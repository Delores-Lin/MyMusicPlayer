const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',  // 入口文件
    output: {
        filename: 'bundle.js',  // 输出文件
        path: path.resolve(__dirname, 'dist'),  // 输出路径
    },
    resolve: {
        extensions: ['.js', '.json', '.wasm', '.mjs', '.ts', '.tsx'], // 解析文件扩展名
    },
    module: {
        rules: [
        {
            test: /\.m?js$/,  // 处理 JavaScript 文件
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',  // 使用 Babel 编译 ES6+ 代码
            options: {
                presets: ['@babel/preset-env'],
            },
            },
        },
        ],
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        port: 3000, 
        historyApiFallback: {
            index: '/MyMusicPlayer.html' 
        },
        // open: {
        //     app: {
        //       // 如果系统中 Chrome 已经添加到 PATH 中，可以直接写 "chrome"
        //       // 否则请使用完整路径，注意双斜杠或使用反引号包裹
        //         name: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        //     }
        // },
    },
}