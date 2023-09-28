module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  extends: ['plugin:@typescript-eslint/recommended', 'standard', 'prettier'],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-unused-vars': 'off',
    'camelcase': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
}
