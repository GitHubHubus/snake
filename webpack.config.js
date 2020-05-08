const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: './client/index.js',
  devtool: 'eval',
  node: {
    fs: 'empty'
  },
  externals: {
    uws: "uws"
  },
  output: {
    path: path.resolve(__dirname, 'web', 'build', 'js'),
    filename: 'snake.js',
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        loader: ['style-loader', 'css-loader?url=false', 'sass-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
};
