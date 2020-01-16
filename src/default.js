export default  {
    method: 'get',
    headers:{
        common: {
            'X-Request-By':'XMLHttpRequest',
            //首先先来一个default,来定义一个这些默认值
            //X-Request-By是一个不成文的规范,方便后台去判断这个请求是来自ajax 还是form 还是浏览器的url
        },
        get:{},
        post:{},
        delete:{},
    },
}