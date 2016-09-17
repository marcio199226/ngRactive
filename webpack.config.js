var webpack = require('webpack');

module.exports = {
  entry: './index.js',
  resolve: {
    extensions: ["", ".js", ".styl"],
    modulesDirectories: ['src', 'bower_components', 'node_modules', 'vendors']
  },
  module: {
    loaders: [
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' },
      { test: /\.html$/, loader: 'ractive' }
    ]
  },
    plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
     )
  ],
  output: {
    path: `${__dirname}/`,
    filename: 'index.min.js',
    libraryTarget: 'umd'   
  }
};
