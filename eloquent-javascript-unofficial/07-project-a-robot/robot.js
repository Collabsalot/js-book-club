/* eslint-disable prettier/prettier */
const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  'Marketplace-Farm',
  'Marketplace-Post Office',
  'Marketplace-Shop',
  'Marketplace-Town Hall',
  'Shop-Town Hall',
]
/* eslint-enable prettier/prettier */

const buildGraph = (edges) => {
  const graph = Object.create(null)
  const addEdge = (from, to) => {
    if (graph[from] == null) {
      graph[from] = [to]
    } else {
      graph[from].push(to)
    }
  }
  for (const [from, to] of edges.map((r) => r.split('-'))) {
    addEdge(from, to)
    addEdge(to, from)
  }
  return graph
}

const roadGraph = buildGraph(roads)

const VillageState = class VillageState {
  constructor(place, parcels) {
    this.place = place
    this.parcels = parcels
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this
    } else {
      const parcels = this.parcels
        .map((p) => {
          if (p.place !== this.place) return p
          return { place: destination, address: p.address }
        })
        .filter((p) => p.place !== p.address)
      return new VillageState(destination, parcels)
    }
  }
}

const runRobot = (state, robot, memory) => {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length === 0) {
      console.log(`Done in ${turn} turns`)
      break
    }
    const action = robot(state, memory)
    state = state.move(action.direction)
    memory = action.memory
    console.log(`Moved to ${action.direction}`)
  }
}

const randomPick = (array) => {
  const choice = Math.floor(Math.random() * array.length)
  return array[choice]
}

const randomRobot = (state) => ({
  direction: randomPick(roadGraph[state.place]),
})

VillageState.random = function(parcelCount = 5) {
  const parcels = []
  for (let i = 0; i < parcelCount; i++) {
    const address = randomPick(Object.keys(roadGraph))
    let place
    do {
      place = randomPick(Object.keys(roadGraph))
    } while (place === address)
    parcels.push({ place, address })
  }
  return new VillageState('Post Office', parcels)
}

/* eslint-disable prettier/prettier */
const mailRoute = [
  "Alice's House",
  'Cabin',
  "Alice's House",
  "Bob's House",
  'Town Hall',
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  'Shop',
  "Grete's House",
  'Farm',
  'Marketplace',
  'Post Office',
]
/* eslint-enable prettier/prettier */

const routeRobot = (state, memory) => {
  if (memory.length === 0) {
    memory = mailRoute
  }
  return { direction: memory[0], memory: memory.slice(1) }
}

const findRoute = (graph, from, to) => {
  const work = [{ at: from, route: [] }]
  for (let i = 0; i < work.length; i++) {
    const { at, route } = work[i]
    for (const place of graph[at]) {
      if (place === to) return route.concat(place)
      if (!work.some((w) => w.at === place)) {
        work.push({ at: place, route: route.concat(place) })
      }
    }
  }
}

const goalOrientedRobot = ({ place, parcels }, route) => {
  if (route.length === 0) {
    const parcel = parcels[0]
    if (parcel.place !== place) {
      route = findRoute(roadGraph, place, parcel.place)
    } else {
      route = findRoute(roadGraph, place, parcel.address)
    }
  }
  return { direction: route[0], memory: route.slice(1) }
}

module.exports = { runRobot, randomRobot, routeRobot, goalOrientedRobot }
