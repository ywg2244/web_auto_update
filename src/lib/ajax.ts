type RequestConfig = {
    url: string,
    method?: "GET" | "POST",
    param?: any
}

// 基于泛型封装一个网络请求demo
export default class MyRequest {
    private static ROOT_URL = "https://www.baidu.com/"
    /**
        * 请求网络
        * @static
        * @template T 指定响应实体
        * @param {RequestConfig} option 请求url+参数+请求方式
        * @return {*}  {Promise<T>}
        */
    public static request<T>(option: RequestConfig): Promise<T> {
        return new Promise((resolve, reject) => {
            option.url = `${MyRequest.ROOT_URL}/${option.url}`;
            // 默认get
            option.method = option.method || "GET";
            // 如果是get请求把参数整合到url后面
            if (option.method === 'GET') this.formatUrl(option);

            let xhr: any = new XMLHttpRequest()
            xhr.responseType = 'json'
            xhr.onreadystatechange = function (e: any) {
                if (xhr.readyState === 4) {
                    if (xhr.status !== 200) {
                        // 可自行封装错误内容
                        return reject({ code: xhr.status, msg: 'request error' })
                    }
                    if (xhr.response?.code !== undefined) {
                        if (xhr.response.code === 0) {
                            let t: T = xhr.response.data
                            return resolve(t)
                        } else {
                            // 这里可以通过公共方法 把异常以弹窗形式抛出 如:showRequestError(xhr.response)
                            return reject(xhr.response)
                        }
                    } else {
                        return reject(xhr.response)
                    }
                }
            }
            xhr.open(option.method, option.url, true)
            if (option.method === 'POST') {
                xhr.setRequestHeader('Content-Type', 'application/json')
                // xhr.setRequestHeader('token', '')
            }
            xhr.send(option.method === 'POST' ? JSON.stringify(option.param) : null)
        });
    }
    /**
     * 格式化get请求url 
     * @param {RequestConfig} option
     */
    public static formatUrl(option: RequestConfig) {
        let formData = []
        for (let key in option.param) {
            formData.push(''.concat(key, '=', option.param[key]))
        }
        let formStr = formData.join('&')
        if (formData) option.url += option.url.indexOf('?') === -1 ? ''.concat('?', formStr) : ''.concat('&', formStr)
    }
}
// 响应数据实体,仅供测试使用
export interface ResponseDataBean {
    id: number;
    name: string;
    age: number;
}
export interface ListData<T> {
    current_page: string;
    data: T;
    last_page: number;
    per_page: number;
    total: number;
}
