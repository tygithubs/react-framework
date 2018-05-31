const ReactDomServer = require('react-dom/server')
// 序列化javascript对象
const serialize = require('serialize-javascript')
const ejs = require('ejs')
const asyncBootstrapper = require('react-async-bootstrapper')
// 设置文档title、meta等属性
const Helmet = require('react-helmet').default

// Material-UI服务端渲染相关参数
const SheetsRegistry = require('react-jss').SheetsRegistry
// const create = require('jss').create
// const preset = require('jss-preset-default').default
const createMuiTheme = require('@material-ui/core/styles').createMuiTheme
const createGenerateClassName = require('@material-ui/core/styles').createGenerateClassName
const colors = require('@material-ui/core/colors')

const getStoreState = (stores) => {
    return Object.keys(stores).reduce((result, storeName) => {
        result[storeName] = stores[storeName].toJson()
        return result
    }, {})
}

module.exports = (bundle, template, req, res) => {
    return new Promise((resolve, reject) => {
        const createStoreMap = bundle.createStoreMap
        const createApp = bundle.default
        const routerContext = {}
        const stores = createStoreMap()
        const sheetsRegistry = new SheetsRegistry()
        const generateClassName = createGenerateClassName()
        // const jss = create(preset())
        // jss.options.createGenerateClassName = createGenerateClassName
        const theme = createMuiTheme({
            palette: {
                primary: colors.lightBlue,
                accent: colors.pink,
                type: 'light'
            }
        })
        const app = createApp(stores, routerContext, sheetsRegistry, generateClassName, theme, req.url)

        asyncBootstrapper(app).then(() => {
            // 处理服务的渲染Redirect
            if (routerContext.url) {
                res.status(302).setHeader('Location', routerContext.url)
                res.end()
                return
            }
            const helmet = Helmet.rewind()
            const state = getStoreState(stores)
            const content = ReactDomServer.renderToString(app)

            const html = ejs.render(template, {
                appString: content,
                initialState: serialize(state),
                meta: helmet.meta.toString(),
                title: helmet.title.toString(),
                style: helmet.style.toString(),
                link: helmet.link.toString(),
                materialCss: sheetsRegistry.toString()
            })
            res.send(html)
            // res.send(template.replace('<!-- app -->', content))
            resolve()
        }).catch(reject)
    })
}
