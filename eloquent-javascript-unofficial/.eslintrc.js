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
    ecmaVersion: 2019,
  },
  rules: {
    'comma-dangle': [ERROR, 'always-multiline'],
    'no-var': ERROR,
  },
}
