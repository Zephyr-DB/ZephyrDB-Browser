const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? 'zephyr-db.min.js' : 'zephyr-db.js',
            library: 'ZephyrDB',
            libraryTarget: 'umd',
            libraryExport: 'default',
            globalObject: 'typeof self !== \'undefined\' ? self : this'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: false
                        },
                        mangle: true
                    }
                })
            ]
        },
        resolve: {
            fallback: {
                "buffer": false,
                "crypto": false,
                "stream": false
            }
        }
    };
};
