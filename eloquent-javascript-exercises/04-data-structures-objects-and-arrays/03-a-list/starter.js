#!/usr/bin/env node

const { deepStrictEqual, strictEqual } = require('assert');

// Your code here.

deepStrictEqual(
  arrayToList([10, 20]),
  { value: 10, rest: { value: 20, rest: null } },
);
deepStrictEqual(
  listToArray(arrayToList([10, 20, 30])),
  [10, 20, 30],
);
deepStrictEqual(
  prepend(10, prepend(20, null)),
  { value: 10, rest: { value: 20, rest: null } },
);
strictEqual(
  nth(arrayToList([10, 20, 30]), 1),
  20,
);
