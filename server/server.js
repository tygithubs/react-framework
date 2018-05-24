const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
// const ReactSSR = require('react-dom/server')
const serverRender = require('./util/server-render')
const fs = require('fs')
const path = require('path')
const app = express()

const isDev = process.env.NODE_ENV === 'development'

// for parsing application/json，添加json解析器，将application的json格式数据转化成req.body
app.use(bodyParser.json())

// for parsing application/x-www-form-urlencoded，extended为false表示使用querystring来解析数据，这是URL-encoded解析器
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
    maxAge: 10 * 60 * 1000,
    name: 'tid',
    resave: false, // 不用每次请求生成一个id
    saveUninitialized: false,
    secret: 'react cnode class' // 用字符串加密cookie
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

if (!isDev) {
    // production环境
    const serverEntry = require('../dist/server-entry');
    const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8');
    // 将dist目录下的所有文件都托管在public文件夹下
    app.use('/public', express.static(path.join(__dirname, '../dist')));
    app.get('*', function (req, res, next) {
        // 服务端渲染
        // const appString = ReactSSR.renderToString(serverEntry)
        // res.send(template.replace('<!-- app -->', appString))
        serverRender(serverEntry, template, req, res).catch(next)
    })
} else {
    // devlopment环境
    const devStatic = require('./util/dev-static')
    devStatic(app)
}

// 处理next错误
app.use(function (error, req, res, next) {
    console.log(error)
    res.status(500).send(error)
 })

app.listen(3333, function () {
    console.log('server is listening on 3333')
})
