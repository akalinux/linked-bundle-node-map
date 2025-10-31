import path from 'path';
import fs from 'fs';

const dist=path.resolve(__dirname, 'dist');
const src=path.resolve(__dirname, 'src');

// force the target folder to exist
try {
  fs.mkdirSync(dist);
} catch (e) {
  // don't care
}

fs.copyFileSync(
  path.join(src,'LinkedSet.css'),
  path.join(dist,'linked-bundle-node.css')
);

if( process.argv.includes('-w') ||  process.argv.includes('--watch')) {
  fs.watchFile(
    path.join(src,'LinkedSet.css'),
    (ctime,ptime)=>{
      console.log('inked-bundle-node.css updated')
      try {
        fs.copyFileSync(
          path.join(src,'LinkedSet.css'),
          path.join(dist,'linked-bundle-node.css')
        );
      } catch(e) {
        console.log(e);
      }
    }
  );
}

module.exports = {
  entry: './src/LinkedBundleNodeMap.tsx',
  output: {
    path: dist,
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
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /(node_modules|dist)/,
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
