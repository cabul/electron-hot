var path = require('path');

module.exports = {
  context: __dirname,
  entry: './app.js',
  output: {
    filename: path.join(__dirname, 'build.js')
  },
  target: 'atom'
};
