const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const { reload } = process.env.NODE_ENV === 'development' ? require('./scripts/reload') : { reload: () => { } }

const source = process.env.source;
const buildDir = process.env.buildDir;

module.exports = {
  entry: {
    background: path.resolve(source, 'background.ts'),
    "content-script": path.resolve(source, 'content-script.ts')
  },
  mode: 'production',
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
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    chunkFormat: "module",
    path: path.resolve(buildDir),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(source, "manifest.json") },
      ],
    }),
    new webpack.ProgressPlugin(percentage => {
      if (percentage === 1) {
        reload();
      }
    })
  ],
}
