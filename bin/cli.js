#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const os = require('os')
const webpack = require('webpack')
const express = require('express')
const getWebpackConfigGetter = require('./getWebpackConfigGetter')

const globalPackages = ['web']
const [mode, watch] = getArgs()
const cwd = process.cwd()
const webpackConfigGetter = getWebpackConfigGetter(mode, cwd, globalPackages)
if (watch) {
    const app = express()
    const config = webpackConfigGetter.getClientConfig()
    const compiler = watchConfig(config)
    app.use(
        require('webpack-dev-middleware')(compiler, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
            },
        })
    )
    app.use(require('webpack-hot-middleware')(compiler))
    app.listen(80)

    fs.mkdtemp(path.join(os.tmpdir()), (err, folder) => {
        if (err) throw err
        watchConfig(webpackConfigGetter.getServerConfig(folder))
        // Prints: /tmp/foo-itXde2
    })
} else {
    runConfig(webpackConfigGetter.getClientConfig())
    runConfig(webpackConfigGetter.getServerConfig())
}

function watchConfig(config) {
    const compiler = webpack(config)
    compiler.watch(
        {
            ignored: /node_modules/,
        },
        function (err, _stats) {
            if (err) {
                // eslint-disable-next-line no-console
                console.error(err)
                return
            }
            process.stdout.write(`${_stats.toString(stats)}\n`)
        }
    )
    return compiler
}

function runConfig(config) {
    const compiler = webpack(config)
    compiler.run((err, _stats) => {
        if (err) {
            // eslint-disable-next-line no-console
            console.error(err)
            return
        }
        process.stdout.write(`${_stats.toString(stats)}\n`)
    })
    return compiler
}

function getArgs() {
    let setMode = false
    let mode
    let watch = false
    process.argv.forEach(arg => {
        if (setMode) {
            setMode = false
            mode = arg
            return
        }
        if (arg === '--mode') {
            setMode = true
            return
        }
        if (arg === '--watch') {
            watch = true
            return
        }
    })
    return [mode, watch]
}

const stats = {
    hash: false,
    version: false,
    children: true,
    assets: false,
    chunks: false,
    entrypoints: false,
    modules: false,
}
