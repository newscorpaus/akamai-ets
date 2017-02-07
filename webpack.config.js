'use strict';

var path    = require('path'),
    webpack = require('webpack'),
    isCI    = process.env['ci_env'],
    CompressionPlugin = require('compression-webpack-plugin');

module.exports = (function() {

    var outputDir = path.join(__dirname, 'public/playground/assets/js'),
        Define    = webpack.DefinePlugin,
        Occurence = webpack.optimize.OccurenceOrderPlugin,
        Uglify    = webpack.optimize.UglifyJsPlugin,
        DeDupe    = webpack.optimize.DedupePlugin;

    return {
        devtool : 'source-map',
        quiet   : isCI,
        context : __dirname,
        entry   : './lib/client',

        output : {
            path          : outputDir,
            filename      : 'playground.min.js',
            library       : 'playground',
            libraryTarget : 'umd'
        },

        plugins : [
            new Occurence(),
            new DeDupe(),
            new Define({
                'process.env' : {
                    'NODE_ENV' : JSON.stringify('production')
                }
            }),
            new Uglify({
                compress  : { warnings : false },
                sourceMap : false,
                mangle    : true
            }),
            new CompressionPlugin({
                asset     : '[path].gz[query]',
                algorithm : 'gzip',
                test      : /\.js$|\.html$/,
                threshold : 10240,
                minRatio  : 0.8
            })
        ],

        module : {
            loaders : [
                {
                    test    : /\.js$/,
                    exclude : /node_modules/,
                    loader  : 'babel',
                    query   : {
                        presets : ['es2015'],
                        plugins : ['transform-runtime']
                    }
                }
            ]
        }
    };

}());
