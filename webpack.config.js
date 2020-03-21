var path = require('path');

module.exports = {
  entry: './lib/index.js',
  output: {
    filename: 'snake.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }
    ]
  }
};
