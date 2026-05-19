const path = require('path');

module.exports = (options) => ({
  ...options,
  entry: path.join(__dirname, 'api/index.ts'),
  output: {
    filename: 'serverless.js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
});
