//export  default只能抛出一个
export default function request(options) {
    console.log(options)
    let xhr = new XMLHttpRequest()
    xhr.open(options.method,options.url,true)
    for (let  name in options.headers){
        // xhr.setRequestHeader(name,options.headers[name])
        //当出现  比如 b:321fho:fdsf vfds; :等代码时  我们需要进行解析
        xhr.setRequestHeader(
            encodeURIComponent(name),
            encodeURIComponent(options.headers[name]),
        )
    }

    xhr.send(options.data)

    return new Promise((resolve,reject)=>{
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr) 
                } else {
                    reject(xhr)
                }
            }
        }
    })
}