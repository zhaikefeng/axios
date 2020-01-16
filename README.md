# axios
模仿大佬Mikey-9进行axios原理的封装
git地址:https://github.com/Mikey-9/axios
掘金地址:https://juejin.im/post/5e16e5d76fb9a02fd742a92b?utm_source=gold_browser_extension#heading-0

####第一个知识点:
先在webpack.config.js里面配置  可以随时监控
        devServer:{
            port: 8000,
            open: true,
        },
在package.json里面配置script

"scripts": {
    <!-- "start": "webpack-dev-server"  //运行webpack指令 -->
    "start": "webpack-dev-server --env.dev" //动态实现webpack监控

  },



  <!-- 原版 基础路径url报错  
  option的method不填写也会报错 -->
