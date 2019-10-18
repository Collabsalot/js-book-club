const repeat = (n, action) => {
  for (let i = 0; i < n; i++) {
    action(i)
  }
}

const characterScript = (code) => {
  for (const script of SCRIPTS) {
    if (
      script.ranges.some(([from, to]) => {
        return code >= from && code < to
      })
    ) {
      return script
    }
  }
  return null
}

const countBy = (items, groupName) => {
  const counts = []
  for (const item of items) {
    const name = groupName(item)
    const known = counts.findIndex((c) => c.name === name)
    if (known === -1) {
      counts.push({ name, count: 1 })
    } else {
      counts[known].count++
    }
  }
  return counts
}

const textScripts = (text) => {
  const scripts = countBy(text, (char) => {
    const script = characterScript(char.codePointAt(0))
    return script ? script.name : 'none'
  }).filter(({ name }) => name !== 'none')

  const total = scripts.reduce((n, { count }) => n + count, 0)
  if (total === 0) return 'No scripts found'

  return scripts
    .map(({ name, count }) => {
      return `${Math.round((count * 100) / total)}% ${name}`
    })
    .join(', ')
}
