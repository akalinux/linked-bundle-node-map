import path from 'path';
import fs from 'fs';
if(!fs.existsSync(path.resolve(__dirname,'dist'))) { fs.mkdirSync(path.resolve(__dirname,'dist')); }
fs.copyFile(path.resolve(__dirname, 'src','LinkedSet.css'), path.resolve(__dirname, 'dist','LinkedSet.css'), (err) => {
  if (err) {
    throw new Error(err.message);
  }
});
export default {
  entry: './src/index.tsx',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts','.tsx','.jsx', '.js','.css','.scss', '...'],
  },
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'LinkedNodeMap',
	globalObject: 'this', 
    umdNamedDefine: true,
  },
};
