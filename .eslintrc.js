module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
  },
  'extends': 'google',
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
  },
  'rules': {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "indent": ["off", "tab"],
    "linebreak-style": ["off", "windows"],
    "require-jsdoc": ["off"],
    "max-len": ["off", { "code": 120 }]
  },
};
