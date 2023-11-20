const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const appDirectory = path.resolve(__dirname, '../');
const babelConfig = require('../babel.config');

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
    test: /\.(tsx|jsx|ts|js)?$/,
    include: [
        path.resolve(appDirectory, 'web', 'index.js'),
        path.resolve(appDirectory, 'src'),
        path.resolve(appDirectory, 'node_modules/react-native-uncompiled'),
    ],
    use: {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
            // Presets and plugins imported from main babel.config.js in root dir
            presets: babelConfig.presets,
            plugins: ['react-native-web', ...(babelConfig.plugins || [])],
        },
    },
};

const imageLoaderConfiguration = {
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
        loader: 'url-loader',
        options: {
            name: '[name].[ext]',
            esModule: false,
        },
    },
};

module.exports = (argv) => {
    return {
        entry: path.resolve(appDirectory, 'web', 'index'),
        output: {
            clean: true,
            path: path.resolve(appDirectory, 'web/dist'),
            filename: '[name].[chunkhash].js',
            sourceMapFilename: '[name].[chunkhash].map',
            chunkFilename: '[id].[chunkhash].js',
        },
        module: {
            rules: [babelLoaderConfiguration, imageLoaderConfiguration],
        },
        plugins: [
            // Fast refresh plugin
            new ReactRefreshWebpackPlugin(),

            // Plugin that takes public/index.html and injects script tags with the built bundles
            new HtmlWebpackPlugin({
                template: path.resolve(appDirectory, 'web/public/index.html'),
            }),

            // Defines __DEV__ and process.env as not being null
            new webpack.DefinePlugin({
                __DEV__: argv.mode !== 'production' || true,
                process: { env: {} },
            }),
        ],
        optimization: {
            // Split into vendor and main js files
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'initial',
                    },
                },
            },
        },
        resolve: {
            // This will only alias the exact import "react-native"
            alias: {
                'react-native$': 'react-native-web',
            },
            // If you're working on a multi-platform React Native app, web-specific
            // module implementations should be written in files using the extension
            // `.web.js`.
            extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.jsx', '.jsx', '.web.tsx', '.tsx'],
        },
    };
};
