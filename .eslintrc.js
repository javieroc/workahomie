module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      // web-v3: Vite + TS bundler resolution (`@/` alias, no extensions); tsc validates imports.
      files: ['apps/web-v3/**/*.{ts,tsx}'],
      rules: {
        'import/extensions': 0,
        'import/no-unresolved': 0,
        // small helper components live below the component that uses them
        '@typescript-eslint/no-use-before-define': [2, { functions: false, classes: true, variables: true }],
        // `void promise` marks intentional fire-and-forget calls (e.g. onClick={() => void login()})
        'no-void': 0,
        // inputs nested inside their <label> are associated
        'jsx-a11y/label-has-associated-control': [2, { assert: 'either' }],
      },
    },
  ],
  ignorePatterns: ['.eslintrc.js', 'mongo-init.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./apps/*/tsconfig.json', './services/*/tsconfig.json'],
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier'
  ],
  rules: {
    'import/prefer-default-export': 0,
    'class-methods-use-this': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'import/no-extraneous-dependencies': 0,
    'no-nested-ternary': 0,
    'no-underscore-dangle': 0,
    'react/no-array-index-key': 0,
    'react/function-component-definition': [
      2,
      {
        namedComponents: ['arrow-function', 'function-declaration'],
        unnamedComponents: 'arrow-function',
      },
    ],
  },
};
