const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const appDirectory = path.resolve(__dirname, '../');
const babelConfig = require('../babel.config');

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
            rules: [
                {
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
                },
                {
                    test: /\.(gif|jpe?g|png)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[ext]',
                            esModule: false,
                        },
                    },
                },
                {
                    test: /\.svg$/,
                    exclude: /node_modules/,
                    use: ['svg-inline-loader'],
                },
            ],
        },
        plugins: [
            new ReactRefreshWebpackPlugin(), // Fast refresh plugin
            // Plugin that takes public/index.html and injects script tags with the built bundles
            new HtmlWebpackPlugin({ template: path.resolve(appDirectory, 'web/public/index.html') }),
            // Defines __DEV__ and process.env as not being null
            new webpack.DefinePlugin({ __DEV__: argv.mode !== 'production' || true, process: { env: {} } }),
        ],
        optimization: {
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
            alias: { 'react-native$': 'react-native-web' },
            extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.jsx', '.jsx', '.web.tsx', '.tsx'],
        },
    };
};
