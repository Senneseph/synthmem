module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules', 'build'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: { version: '18.2' },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx']
      }
    }
  },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'no-undef': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'react/function-component-definition': 'off'
  },
}
