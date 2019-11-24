#!/usr/bin/env node

const { deepStrictEqual, strictEqual } = require('assert')

const range = (start, stop) =>
  Array.from({ length: stop - start + 1 }, (_, i) => i + start)

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

const rangeBonus = (start, stop, step) => {
  let res = []
  if (step > 0) {
    for (let i = start; i <= stop; i++) {
      res.push(i)
    }
  } else {
    for (let i = start; i >= stop; i--) {
      res.push(i)
    }
  }
  return res
}

deepStrictEqual(range(1, 10), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

strictEqual(sum(range(1, 10)), 55)

deepStrictEqual(rangeBonus(5, 2, -1), [5, 4, 3, 2])
