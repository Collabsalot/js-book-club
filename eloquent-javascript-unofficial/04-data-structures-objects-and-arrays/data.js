const journal = []

const addEntry = (events, squirrel) => {
  journal.push({ events, squirrel })
}

const phi = table => (table[3] * table[0] - table[2] * table[1]) /
  Math.sqrt((table[2] + table[3]) *
    (table[0] + table[1]) *
    (table[1] + table[3]) *
    (table[0] + table[2]))

const tableFor = (event, journal) => {
  const table = [0, 0, 0, 0]
  for (let i = 0; i < journal.length; i++) {
    const entry = journal[i]; let index = 0
    if (entry.events.includes(event)) index += 1
    if (entry.squirrel) index += 2
    table[index] += 1
  }
  return table
}

const journalEvents = journal => {
  const events = []
  for (const entry of journal) {
    for (const event of entry.events) {
      if (!events.includes(event)) {
        events.push(event)
      }
    }
  }
  return events
}

const max = (...numbers) => {
  let result = -Infinity
  for (const number of numbers) {
    if (number > result) result = number
  }
  return result
}

const list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null,
    },
  },
}

module.exports = { addEntry, phi, tableFor, journalEvents, max, list }
