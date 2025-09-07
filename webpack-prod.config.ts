import path from 'path';
import fs from 'fs';
if(!fs.existsSync(path.resolve(__dirname,'dist'))) { fs.mkdirSync(path.resolve(__dirname,'dist')); }
fs.copyFile(path.resolve(__dirname, 'src','LinkedSet.css'), path.resolve(__dirname, 'dist','LinkedSet.css'), (err) => {
  if (err) {
    throw new Error(err);
    return;
  }
});

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
