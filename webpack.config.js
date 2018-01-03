/* global __dirname */

var path = require('path');

var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var dir_js = path.resolve(__dirname, 'src');
// var dir_html = path.resolve(__dirname, 'html');
var dir_build = path.resolve(__dirname, 'dist');

module.exports = {
    entry: path.resolve(dir_js, 'index.js'),
    output: {
        path: dir_build,
        filename: 'sowstring.js'
    },
    devServer: {
        contentBase: dir_build,
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: dir_js,
            }
        ]
    },
    plugins: [
        // Simply copies the files over
        // new CopyWebpackPlugin([
        //     { from: dir_html } // to: output.path
        // ]),
        // Avoid publishing files when compilation fails
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false },
          mangle: { except: ['module', 'exports', 'SowString', 'UnsowString', 'Node', 'Leaf'] }
        })
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
};