#!/usr/bin/env node

const { strictEqual } = require('assert');

// Your code here.

let obj = { here: { is: 'an' }, object: 2 };

strictEqual(true, deepEqual(obj, obj));

strictEqual(false, deepEqual(obj, { here: 1, object: 2 }));

strictEqual(true, deepEqual(obj, { here: { is: 'an' }, object: 2 }));
