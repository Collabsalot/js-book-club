const ERROR = 'error'

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    node: true,
  },
  extends: [
    'standard',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'comma-dangle': [ERROR, 'always-multiline'],
    'curly': [ERROR, 'multi-line', 'consistent'],
    'func-style': [ERROR, 'expression'],
    'max-len': [ERROR, { code: 100 }],
    'no-var': ERROR,
  },
}
