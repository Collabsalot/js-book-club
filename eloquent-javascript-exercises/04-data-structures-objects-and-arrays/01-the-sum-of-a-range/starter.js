#!/usr/bin/env node

const { deepStrictEqual, strictEqual } = require('assert');

// Your code here.

deepStrictEqual(range(1, 10), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

deepStrictEqual(range(5, 2, -1), [5, 4, 3, 2]);

strictEqual(sum(range(1, 10)), 55);
