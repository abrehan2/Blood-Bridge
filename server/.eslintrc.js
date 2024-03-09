module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['node'],
  env: {
    node: true,
    es6: true,
    jest: true,
  },

  rules: {
    'no-process-exit': 'off',
    'no-template-curly-in-string': 'error',
    'no-caller': 'error',
    'no-extra-bind': 'error',
    'no-loop-func': 'error',
    'no-undef': 'error',
    'prefer-const': 'error',
  },

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
}
