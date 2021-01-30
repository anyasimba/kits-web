/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { execSync } = require('child_process')
const webpack = require('webpack')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = (mode, cwd, globalPackages) => {
    const resolve = {
        fallback: {},
        extensions: ['.ts', '.tsx', '.js'],
        modules: ['node_modules', 'src', path.join(cwd, 'src')],
    }

    globalPackages.forEach(
        package =>
            (resolve.fallback[package] = path.resolve(
                execSync('npm root -g').toString().trim(),
                package
            ))
    )

    const rules = [
        {
            test: /\.tsx?$/,
            enforce: 'pre',
            use: ['cache-loader', 'eslint-loader'],
            exclude: ['/node_modules/', '/dist/'],
            include: [/src/, /extras/],
        },
        {
            test: /\.tsx?$/,
            use: ['cache-loader', 'ts-loader'],
            exclude: '/node_modules/',
            include: [/src/, /extras/],
        },
        {
            test: /\.scss$/,
            use: ['cache-loader', 'style-loader', 'css-loader?modules'],
            include: [/src/, /extras/],
        },
    ]

    function getClientConfig() {
        return {
            stats: 'minimal',
            mode,
            entry: {
                app: [
                    'webpack-hot-middleware/client?path=http://localhost/__webpack_hmr',
                    './src',
                    './extras/client',
                ],
            },
            resolve,
            context: path.resolve(__dirname, '../'),
            module: { rules },
            target: 'web',
            output: {
                filename: 'app.js',
                path: path.resolve(cwd, 'dist'),
            },
            plugins: [new webpack.HotModuleReplacementPlugin()],
            devtool: 'source-map',
        }
    }

    function getServerConfig(outputDir) {
        return {
            stats: 'minimal',
            mode,
            entry: {
                app: ['./src', './extras/server'],
            },
            resolve,
            context: path.resolve(__dirname, '../'),
            module: { rules },
            target: 'node',
            externals: [
                ({ request }, callback) => {
                    try {
                        const modulePath = require.resolve(request)
                        if (modulePath.indexOf('node_modules') !== -1) {
                            callback(null, 'commonjs ' + request)
                            return
                        }
                        callback()
                    } catch (err) {
                        callback()
                    }
                },
            ],
            output: {
                filename: 'server.js',
                path: outputDir,
            },
            plugins: [
                new NodemonPlugin({
                    env: {
                        NODE_PATH: path.resolve(__dirname, '../node_modules'),
                    },
                }),
            ],
            devtool: 'source-map',
        }
    }

    return {
        getClientConfig,
        getServerConfig,
    }
}
