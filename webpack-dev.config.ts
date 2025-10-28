const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'MyReactComponent', // Global variable name for the UMD module
    libraryTarget: 'umd',
    globalObject: 'this', // Ensures UMD works in various environments
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    react: 'React', // Treat React as an external dependency
    'react-dom': 'ReactDOM', // Treat ReactDOM as an external dependency
  },
  mode: 'development', // or 'development'
};
