let path = require('path');
let webpack = require('webpack');
let BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  // the base directry (absolute path) for resolving the entry option
  context: __dirname,

  entry: {
    three: './assets/index.js',
    p5_sunburst: './assets/p5/sunburst/index.js'
  },

  output: {
    // where you want your compiled bundle to be stored
    path: path.resolve('./static/bundles/'),
    filename: '[name].bundle.js',
  },

  plugins: [
    // telss webpack where to store data about your bundles
    new BundleTracker({filename: './webpack-stats.json'}),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],

  module: {
    loaders: [
      // a regexp that tells webpack to use the following loads on all .js and .jsx files
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },
  watchOptions: {
    aggregateTimeout: 100,
    ignored: /node_modules/,
    poll: 1000
  },

  resolve: {
    // tells webpack where to look for modules
    modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  }
}
