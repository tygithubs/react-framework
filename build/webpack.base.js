const path = require('path')

module.exports = {
    output: {
        path: path.join(__dirname, '../dist'),
        // 静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径 距离：html中引用js 由 ‘/app.js’ 变为
        // '/public/app.js'
        publicPath: '/public/'
    },
    resolve: {
        extensions: ['.js', '.jsx', 'json']
    },
    module: {
        rules: [
            {
                enforce: 'pre', // 在代码编译之前执行eslint-loader
                test: /.(js|jsx)$/,
                loader: 'eslint-loader',
                exclude: [
                    path.resolve(__dirname, '../node_modules')
                ]
            },
            // jsx文件通过babel-loader进行处理 核心库：babel-core 插件：babel-preset-es2015 babel-preset-es2015-loose babel-preset-react 配置文件在根目录.babelrc中
            {
                test: /.jsx$/,
                loader: 'babel-loader'
            },
            // node_modules下的js代码不可以用babel编译，所以我们js和jsx分开写
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: [path.join(__dirname, '../node_modules')]
            }
        ]
    }
}
