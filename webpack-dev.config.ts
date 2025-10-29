const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/LinkedBundleNodeMap.tsx',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'linked-bundle-node.css',
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'LinkedBundleNodeMap', // Global variable name for the UMD module
    libraryTarget: 'umd',
    globalObject: 'this', // Ensures UMD works in various environments
  },
  resolve: {
    extensions: ['.ts', '.tsx',],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'eval-source-map',
  externals: {
    react: {
      root: 'React', // Global variable name for React
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM', // Global variable name for ReactDOM
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  },
  mode: 'development', // or 'development'
};
