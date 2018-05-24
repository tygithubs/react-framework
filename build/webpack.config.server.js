// 服务端渲染的webpack配置文件

const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = webpackMerge(baseConfig, {
    target: 'node',
    entry: {
        app: path.join(__dirname, '../client/server-entry.js')
    },
    // 指定的包不打包输出
    externals: Object.keys(require('../package.json').dependencies),
    output: {
        // 服务端没有浏览器缓存 hash没必要，同时要自己手动引入js
        filename: 'server-entry.js',
        libraryTarget: 'commonjs2'
    }
})
