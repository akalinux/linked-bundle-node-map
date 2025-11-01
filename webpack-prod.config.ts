import path from 'path';
import fs from 'fs';

const dist=path.resolve(__dirname, 'dist');
const src=path.resolve(__dirname, 'src');

try {
  fs.rmdirSync(dst,{recursive:true});
  fs.mkdirSync(dist);
} catch (e) {
  // don't care
}

const rawCss=fs.readFileSync(path.join(src,'LinkedSet.css')).toString();
const minifiedCss=rawCss.replaceAll(/\t/g,'',).replaceAll(/[\r\n]/g,'').replaceAll(/\s{2,}/g,' ');
fs.writeFileSync(path.join(dist,'linked-bundle-node.css'),minifiedCss),


module.exports = {
  entry: './src/LinkedBundleNodeMap.tsx',
  output: {
    path: dist,
    filename: 'bundle.js',
    library: 'LinkedBundleNodeMap', // Global variable name for the UMD module
    libraryTarget: 'umd',
    clean: true,
    globalObject: 'this', // Ensures UMD works in various environments
  },
  resolve: {
    extensions: ['.ts', '.tsx',],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /(node_modules|dist)/,
      },
    ],
  },
  devtool: 'source-map',
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
  mode: 'production', //
};
