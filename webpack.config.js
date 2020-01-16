const path = require('path');

module.exports = function(env={}) {
    const dev = env.dev;

    return {
        mode: dev ? 'development' : 'production', //生产模式
        entry: './src/index.js', //入口文件
        output: {
           path : path.resolve(__dirname,'dist'),
           filename: dev ? 'axios.js' : 'axios.min.js',
           sourceMapFilename: dev ? 'axios.map' : 'axios.min.map',
           libraryTarget:'umd', 
        },
        devtool: 'source-map',
        module:{
            rules:[
                {
                    test:/\.js$/i,
                    use:{
                        loader:'babel-loader', //进行es6的转换
                        options:{
                            presets:['@babel/preset-env'],
                        }
                    },
                },
            ],
        },
        // 设置webpack-dev-server代理
        devServer:{
            port: 8000,
            open: true,
        },
    };
};