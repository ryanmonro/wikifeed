const path = require('path');

module.exports = {
  entry: './src/index.js',
  watch: true,
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  }
};