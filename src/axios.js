import _default from './default'
import {merge, assert, clone} from './common'
import request from './request'
import createResponse from './response'
import createError from './error'
const url = require('url')
import Interceptor from './interceptor'

class Axios{
    constructor() {
        this.interceptors = {
            request: new Interceptor(),
            response: new Interceptor(),
        }
        let _this = this
        return new Proxy(request,{
            get(data,name) {
                return _this[name]
            },  
            set(data,name,val) {
                _this[name] = val
                return true
            },
            apply(fn,thisArg,args) {
                let options = _this._preprocessArgs(undefined,args)
                if(!options) {
                    if (args.length == 2){
                        assert(typeof args[0] == 'string','args[0] must is string')
                        assert(
                            typeof args[1] == 'object' &&
                             args[1] &&
                             args[1].constructor == Object,
                             'args[1] must is JSON'
                        )
                        options = {
                            ...args[1],
                            url: args[0],
                        }
                       return _this.request(options)
                    } else {
                        assert(false,'invaild arguments')
                    }

                }
            }
        })
    }
    
    // request方法主要干的四件事:
    // 1.跟this.default进行合并
    // 2.检测参数是否正确
    // 3.baseUrl合并请求
    // 4.正式调用request(options)
    request(options) {

    // 1.跟this.default进行合并
         // merge(options,this.default) 单纯合并相关代码 headers里面的数据会出现错误  无法实现相关代码的属性的覆盖会保存原有的数据
        
        let _headers = this.default.headers
        delete this.default.headers

        let result = clone(this.default)
        merge(result,this.default)
        merge(result,options)
        this.default.headers = _headers
        options = result
        //合并头
        // this.default.headers.common -> this.default.headers.get -> options
        let headers = {}
        merge(headers,this.default.headers.common)
        if (options.method) {
            merge(headers,this.default.headers[options.method.toLowerCase()])
        }
        merge(headers,options.headers)
        options.headers = headers

    // 2.检测参数是否正确
        assert(options.method,'no method')
        assert(typeof options.method == 'string','method must be string')
        assert(options.url,'no url')
        assert(typeof options.url == 'string','url must be string')

    //3.baseUrl合并请求
        // options.url = options.baseUrl + options.url
        options.url = url.resolve(options.baseUrl,options.url)
        delete options.baseUrl


    // 4.变换一下请求
    const { transformRequest,transformResponse } = options
    delete options.transformRequest
    delete options.transformResponse
    if (transformRequest) {
        options = transformRequest(options)
    }
    let list = this.interceptors.request.list()
    list.forEach(fn => {
        options = fn(options)
    }) 
    // 4-5.正式调用request(options)
        // return request(options)
        return new Promise((resolve,reject)=>{
            return request(options).then(
                xhr => {
                   let res = createResponse(xhr)
                   if (transformResponse) res = transformResponse(res)
                   let  list = this.interceptors.response.list()
                   list.forEach(fn => {
                       res = fn(res)
                   })
                   resolve(res)
                },
                xhr => {
                    let err = createError(xhr)
                    reject(err)
                }
            )
        })
    }

    //  因为针对axios传参的三种方法 无论是get  post还是delete 
    //  其第一位形参url的判断是一致的  故而将其分离出来  进行一个判断 
    //      get(url)
    //      get(url,{headers,params})
    //      get({url,headers,params})
    _preprocessArgs(method,args) {
        let options
        if (args.length == 1 && typeof args[0] == 'string') {
            options = {
                method,
                url:args[0]
            }
            this.request(options)
        } else if(args.length == 1 && args[0].constructor == Object){
            options = {
                ...args[0],
                method
            } 
          this.request(options)
        } else {
            return undefined
        }
        return options
    }
    get(...args) {
        let options = this._preprocessArgs('get',args)
        if(!options) {
            if (args.length == 2) {
                assert(typeof args[0] == 'string','args[0] must is string')
                assert(
                    typeof args[1] == 'object' && 
                    args[1] && 
                    args[1].constructor == Object,
                    'args[1] must is JSON'
                )
                options = {
                    ...args[1],
                    url: args[0],
                    method: 'get',
                }
                return this.request(options)
            } else {
                assert(false,'invaild arguments')
            }
            
        }
    }

    post(...args) {
        let options = this._preprocessArgs('post',args)
        if(!options) {
            if (args.length == 2) {
                assert(typeof args[0] == 'string','args[0] must is string')
                options = {
                    url: args[0],
                    data: args[1],
                    method: 'post',
                }
                return this.request(options)
            } else if (args.length == 3) {
                assert(typeof args[0] == 'string','args[0] must is string')
                assert(
                    typeof args[2] == 'object' &&
                    args[2] &&
                    args[2].constructor == Object,
                    'args[2] must is JSON'
                )
                options = {
                    ...args[2],
                    url: args[0],
                    data: args[1],
                    method: 'post',
                }
                return this.request(options)
            } else {
                assert(false,'invaild arguments')
            }
        }
    }

    delete(...args) {
        let options = this._preprocessArgs('delete',args)
        if (!options) {
            assert(typeof args[0] == 'string','args[0] must is string')
            assert(
                typeof args[1] == 'object' && args[1] && args[1].constructor == Object,
                'args[1] must is JSON'
            )
            options = {
                ...args[1],
                url: args[0],
                method: 'get'
            }
           return this.request(options)
        }
    }
}

Axios.create = Axios.prototype.create = function(options={}) {
    let axios = new Axios()

    // axios.default = {
    //     ...JSON.parse(JSON.stringify(_default)),//动态在proxy中添加数据  打印结果是undefined 原因是proxy必须有set方法
    //     ...options
    // } 
    // //这个提供了一种传参的思路   就是如果参数是对象   先给与默认值  如果想要替换 可以进行解构赋值  将其覆盖
    let res = {...JSON.parse(JSON.stringify(_default))}
    merge(res,options)
    axios.default = res
    return axios
}


export default Axios.create()