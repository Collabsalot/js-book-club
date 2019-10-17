const range = (start, end, step) => {
  if (step == null) step = 1
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

const sum = array => {
  let total = 0
  for (let i = 0; i < array.length; i++) {
    total += array[i]
  }
  return total
}

const factorial = n => {
  if (n === 0) {
    return 1
  } else {
    return factorial(n - 1) * n
  }
}

module.exports = { range, sum, factorial }
