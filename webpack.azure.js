const path = require('path');

module.exports = (options) => ({
  ...options,
  entry: path.join(__dirname, 'src/functions/httpTrigger.ts'),
  output: {
    filename: 'httpTrigger.js',
    path: path.join(__dirname, 'dist/functions'),
    libraryTarget: 'commonjs2',
  },
});
