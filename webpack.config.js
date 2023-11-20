module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/build/js',
        filename: 'bundle.js',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: (info) => `webpack:///${info.absoluteResourcePath.replace(/\\/g, '/')}`,
        iife: false,
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                // exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', { modules: 'umd' }], '@babel/preset-react']
                },
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: ['svg-inline-loader'],
            },
            {
                test: /\.(png|jpeg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: true,
                            esModule: false,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        alias: {
            'react-native$': 'react-juce',
        },
        extensions: ['.juce.js', '.js', '.juce.ts', '.ts', '.juce.jsx', '.jsx', '.juce.tsx', '.tsx'],
    },
};
