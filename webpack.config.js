module.exports = {
  entry: {
    'popup': './src/popup.js'
  },

  output: {
    path: 'lib',
    publicPath: '/lib/',
    filename: '[name].js'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
    }]
  },

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
};
