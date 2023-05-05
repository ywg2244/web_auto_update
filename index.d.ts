/**
 * 长时间停留页面,自动检测当前站点更新情况
 */
declare class AutoUpData {
    /** 一开始的script的src数组集合 */
    _lastSrcs: string[];
    /** 一开始的当前html节点字符串长度 */
    _htmlLangth: number;
    /** 匹配script的src正则 */
    _srciptReg: RegExp;
    /** 当前请求地址 默认根地址 */
    _baseUrl: string;
    /** 轮训验证时间戳，默认2000毫秒 */
    _times: number;
    /** 响应函数 (检测到更新后的钩子，可以用来处理弹出UI弹框) */
    _response?: () => boolean;
    constructor(options?: {
        /** 当前请求地址 默认根地址 "/" */
        baseUrl?: string;
        /** 轮训验证时间戳，默认2000毫秒 */
        times?: number;
        /** 响应函数 (检测到更新后的钩子，可以用来处理弹出UI弹框)  必须返回一个布尔值，true表示用户点击已同意更新，false则表示未同意 */
        response?: () => boolean;
    });
    /**
     * 提取脚本字符串
     */
    extractNewScripts(): Promise<{
        result: string[];
        html: string;
    }>;
    /** 检查是否要更新 */
    needUpdate(): Promise<boolean>;
    startTest(): void;
}
export default AutoUpData;
