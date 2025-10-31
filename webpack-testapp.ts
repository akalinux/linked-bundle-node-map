import path from 'path';
import webpack from 'webpack'
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

export default {
  mode: 'production',
  entry: './demo_app/App.tsx',
	plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
	],

  module: {
    rules: [
       {
        test: /\.css$/i,
        use: [
          // Use MiniCssExtractPlugin.loader for production, style-loader for development
          //process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              // Set modules to false for third-party CSS to prevent CSS Modules behavior
              modules: false, 
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      }
    ],
  },

  resolve: {
    extensions: ['.ts','.tsx','.js','.jsx'],
    alias: { 
      react: path.resolve('./node_modules/react'), 
      'react-dom': path.resolve('./node_modules/react-dom'), 
    },
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public','js'),
    filename: 'index.js',
  },
};
