const range = (start, end, step = 1) => {
  const array = []

  if (step > 0) {
    for (let i = start; i <= end; i += step) {
      array.push(i)
    }
  } else {
    for (let i = start; i >= end; i += step) {
      array.push(i)
    }
  }
  return array
}

const sum = (array) => {
  let total = 0
  for (let i = 0; i < array.length; i++) {
    total += array[i]
  }
  return total
}

const factorial = (n) => (n === 0 ? 1 : factorial(n - 1) * n)

module.exports = { range, sum, factorial }
