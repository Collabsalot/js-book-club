const bigOak = require('./crow-tech').bigOak

const defineRequestType = require('./crow-tech').defineRequestType

defineRequestType('note', (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`)
  done()
})

const storage = (nest, name) =>
  new Promise((resolve) => {
    nest.readStorage(name, (result) => resolve(result))
  })

const Timeout = class Timeout extends Error {}

const request = (nest, target, type, content) =>
  new Promise((resolve, reject) => {
    let done = false

    const attempt = (n) => {
      nest.send(target, type, content, (failed, value) => {
        done = true
        if (failed) reject(failed)
        else resolve(value)
      })
      setTimeout(() => {
        if (!done) {
          if (n < 3) {
            attempt(n + 1)
          } else {
            reject(new Timeout('Timed out'))
          }
        }
      }, 250)
    }

    attempt(1)
  })

const requestType = (name, handler) => {
  defineRequestType(name, (nest, content, source, callback) => {
    try {
      Promise.resolve(handler(nest, content, source)).then(
        (response) => callback(null, response),
        (failure) => callback(failure),
      )
    } catch (exception) {
      callback(exception)
    }
  })
}

requestType('ping', () => 'pong')

const availableNeighbors = (nest) => {
  const requests = nest.neighbors.map((neighbor) => {
    return request(nest, neighbor, 'ping').then(() => true, () => false)
  })
  return Promise.all(requests).then((result) => {
    return nest.neighbors.filter((_, i) => result[i])
  })
}

const everywhere = require('./crow-tech').everywhere

everywhere((nest) => {
  nest.state.gossip = []
})

const sendGossip = (nest, message, exceptFor = null) => {
  nest.state.gossip.push(message)
  for (const neighbor of nest.neighbors) {
    if (neighbor === exceptFor) continue
    request(nest, neighbor, 'gossip', message)
  }
}

requestType('gossip', (nest, message, source) => {
  if (nest.state.gossip.includes(message)) return
  console.log(`${nest.name} received gossip '${message}' from ${source}`)
  sendGossip(nest, message, source)
})

const broadcastConnections = (nest, name, exceptFor = null) => {
  for (const neighbor of nest.neighbors) {
    if (neighbor === exceptFor) continue
    request(nest, neighbor, 'connections', {
      name,
      neighbors: nest.state.connections.get(name),
    })
  }
}

requestType('connections', (nest, { name, neighbors }, source) => {
  const connections = nest.state.connections
  if (JSON.stringify(connections.get(name)) === JSON.stringify(neighbors)) {
    return
  }
  connections.set(name, neighbors)
  broadcastConnections(nest, name, source)
})

everywhere((nest) => {
  nest.state.connections = new Map()
  nest.state.connections.set(nest.name, nest.neighbors)
  broadcastConnections(nest, nest.name)
})

const findRoute = (from, to, connections) => {
  const work = [{ at: from, via: null }]
  for (let i = 0; i < work.length; i++) {
    const { at, via } = work[i]
    for (const next of connections.get(at) || []) {
      if (next === to) return via
      if (!work.some((w) => w.at === next)) {
        work.push({ at: next, via: via || next })
      }
    }
  }
  return null
}

const routeRequest = (nest, target, type, content) => {
  if (nest.neighbors.includes(target)) {
    return request(nest, target, type, content)
  } else {
    const via = findRoute(nest.name, target, nest.state.connections)
    if (!via) throw new Error(`No route to ${target}`)
    return request(nest, via, 'route', { target, type, content })
  }
}

requestType('route', (nest, { target, type, content }) => {
  return routeRequest(nest, target, type, content)
})

requestType('storage', (nest, name) => storage(nest, name))

const findInRemoteStorage = (nest, name) => {
  let sources = network(nest).filter((n) => n !== nest.name)
  const next = () => {
    if (sources.length === 0) {
      return Promise.reject(new Error('Not found'))
    } else {
      const source = sources[Math.floor(Math.random() * sources.length)]
      sources = sources.filter((n) => n !== source)
      return routeRequest(nest, source, 'storage', name).then(
        (value) => (value != null ? value : next()),
        next,
      )
    }
  }
  return next()
}

const findInStorage = (nest, name) =>
  storage(nest, name).then((found) => {
    if (found != null) return found
    else return findInRemoteStorage(nest, name)
  })

const network = (nest) => Array.from(nest.state.connections.keys())

const Group = class Group {
  constructor() {
    this.members = []
  }

  add(m) {
    this.members.add(m)
  }
}

const anyStorage = (nest, source, name) => {
  if (source === nest.name) return storage(nest, name)
  else return routeRequest(nest, source, 'storage', name)
}

const chicks = async (nest, year) => {
  let list = ''
  await Promise.all(
    network(nest).map(async (name) => {
      list += `${name}: ${await anyStorage(nest, name, `chicks in ${year}`)}\n`
    }),
  )
  return list
}

module.exports = { bigOak, availableNeighbors, findInStorage, Group, chicks }
