module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ["eslint:recommended"],
  ignorePatterns: [
    "dist/",
    "dist-ssr/",
    "node_modules/",
    "output/",
    "index-cf790de1.js",
  ],
  rules: {
    "no-unused-vars": "off",
  },
};
