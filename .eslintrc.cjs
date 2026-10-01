module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // ES modules nativos exigem a extensão .js nos imports locais
    'import/extensions': ['error', 'always', { ignorePackages: true }],
  },
};
