const path = require('path');

module.exports = (options) => ({
  ...options,
  entry: path.join(__dirname, 'src/serverless-handler.ts'),
  output: {
    filename: 'handler.js',
    path: path.join(__dirname, 'api'),
    libraryTarget: 'commonjs2',
  },
});
