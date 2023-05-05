/**
 * 长时间停留页面,自动检测当前站点更新情况
 */
export default class AutoUpData {
    /** 一开始的script的src数组集合 */
    _lastSrcs: (string | undefined)[];
    /** 一开始的当前html节点字符串长度 */
    _htmlLangth: number;
    /** 匹配script的src正则 */
    _srciptReg: RegExp;
    /** 当前请求地址 默认根地址 */
    _baseUrl: string;
    /** 轮训验证时间戳，默认2000毫秒 */
    _times: number;
    /** 响应函数 */
    _response?: () => void;
    /**
     *
     * @param {{baseUrl?:String,times?:Number,response?:() => void}} options
     */
    constructor(options: {
        baseUrl: string;
        times: number;
        response: () => void;
    });
    /**
     * 提取脚本字符串
     */
    extractNewScripts(): Promise<{
        result: any[];
        html: any;
    }>;
    /** 检查是否要更新 */
    needUpdate(): Promise<boolean>;
    startTest(): void;
}
