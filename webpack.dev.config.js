const merge = require('webpack-merge');
const path = require('path');
const commonConfig = require('./webpack.common.config.js');
const theme = {
    "primary-color": "#35B2F9",
    "table-header-bg": "#3A424F",
};


const devConfig = {
    devtool: 'eval-source-map',
    entry: {
        app: [
            'babel-polyfill',
            'react-hot-loader/patch',
            path.join(__dirname, 'src/index.js')
        ]
    },
    output: {
        filename: '[name].js', // '[name].[chunkhash].js',
        chunkFilename: '[name].js', // '[name].[chunkhash].js',
        publicPath: "/"
    },
    module: {
        rules:[
            {
                test: /\.less$/,
                use: ["style-loader","css-loader",`less-loader?{"modifyVars":${JSON.stringify(theme)}}`],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, './bundle/'),
        historyApiFallback: true,
        host: 'localhost',
        proxy:{
            // '/api': {
            //     //项目接口地址代理
            //     target: 'http://127.0.0.1:10199',
            //     // target: 'http://10.1.4.119:8080/',
            //     pathRewrite: {'^/api' : '/'},
            //     changeOrigin: true
            // },
            // '/image': {
            //     //项目接口地址代理
            //     target: 'http://127.0.0.1:10199',
            //     // target: 'http://10.1.4.119:8080/',
            //     pathRewrite: {'^/image' : '/image'},
            //     changeOrigin: true
            // }
        }
    }
};
const config = merge({
    customizeArray(a, b, key) {
        /*entry.app不合并，全替换*/
        if (key === 'entry.app') {
            return b;
        }
        return undefined;
    }
})(commonConfig, devConfig);
console.log(config.module.rules[2]);
module.exports = merge({
    customizeArray(a, b, key) {
        /*entry.app不合并，全替换*/
        if (key === 'entry.app') {
            return b;
        }
        return undefined;
    }
})(commonConfig, devConfig);