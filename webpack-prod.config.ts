import path from 'path';

export default {
  entry: './src/index.ts',
  mode: 'production',
  optimization: {
    minimize: true,
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
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts','.tsx','.jsx', '.js','.css','.scss', '...'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'LinkedNodeMap',
    umdNamedDefine: true
  },
};
