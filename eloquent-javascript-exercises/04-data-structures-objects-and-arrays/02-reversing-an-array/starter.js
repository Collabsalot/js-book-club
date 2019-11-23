#!/usr/bin/env node

const { deepStrictEqual } = require('assert')

// Your code here.

deepStrictEqual(reverseArray(['A', 'B', 'C']), ['C', 'B', 'A']);

let array = [1, 2, 3, 4, 5];
reverseArrayInPlace(array);
deepStrictEqual(array, [5, 4, 3, 2, 1]);
