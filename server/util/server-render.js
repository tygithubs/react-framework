const ReactDomServer = require('react-dom/server')
// 序列化javascript对象
const serialize = require('serialize-javascript')
const ejs = require('ejs')
const asyncBootstrapper = require('react-async-bootstrapper')
// 设置文档title、meta等属性
const Helmet = require('react-helmet').default

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
        const app = createApp(stores, routerContext, req.url)
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
                link: helmet.link.toString()
            })
            res.send(html)
            // res.send(template.replace('<!-- app -->', content))
            resolve()
        }).catch(reject)
    })
}
