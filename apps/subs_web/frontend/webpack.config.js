const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
    extensions: ['.js', '.jsx'],
  },
  entry: {
    app: [
      path.resolve(__dirname, './src/index.jsx'),
    ],
    vendor: [
      '@fortawesome/fontawesome',
      '@fortawesome/fontawesome-free-solid',
      '@fortawesome/react-fontawesome',
      'axios',
      'classnames',
      'emotion',
      'immutable',
      'js-cookie',
      'moment',
      'moment-timezone',
      'prop-types',
      'react',
      'react-addons-shallow-compare',
      'react-color',
      'react-dates',
      'react-dom',
      'react-emotion',
      'react-modal',
      'react-redux',
      'react-redux-loading-bar',
      'react-router',
      'react-router-redux',
      'react-select',
      'redux',
      'redux-thunk',
    ],
  },

  output: {
    path: path.resolve(__dirname, '../priv/static'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader!sass-loader',
        }),
      },
      {
        test: /\.(png|gif|jpg)$/,
        use: 'file-loader?name=images/[name].[ext]',
        exclude: /node_modules/,
      },
      {
        test: /\.(ttf|eot|svg|woff|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'file-loader?name=images/[name].[ext]',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'app.bundle.css', allChunks: true }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
  ],
}
