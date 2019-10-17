const ERROR = 'error'

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    node: true,
  },
  extends: [
    'standard',
    'plugin:prettier/recommended',
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
    'no-var': ERROR,
  },
}
