/*
 * @Author: ywg ywg2244@163.com
 * @Date: 2023-05-04 16:39:38
 * @LastEditors: ywg ywg2244@163.com
 * @LastEditTime: 2023-05-05 10:49:15
 * @FilePath: /autoUpDate/src/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/**
 * 长时间停留页面,自动检测当前站点更新情况
 */
class AutoUpData {
  /** 一开始的script的src数组集合 */
  _lastSrcs = [];
  /** 一开始的当前html节点字符串长度 */
  _htmlLangth = 0;
  /** 匹配script的src正则 */
  _srciptReg = /\<script.*src=["'](?<src>[^"']+)/gm;
  /** 当前请求地址 默认根地址 */
  _baseUrl = "/";
  /** 轮训验证时间戳，默认2000毫秒 */
  _times = 2000;
  /** 响应函数 */
  _response = null;
  /**
   *
   * @param {{baseUrl?:String,times?:Number,response?:() => void}} options
   */
  constructor(options) {
    options && options.baseUrl && (this._baseUrl = options.baseUrl);
    options && options.times && (this._times = options.times);
    options && options.response && (this._response = options.response);

    this.startTest();
  }
  /**
   * 提取脚本字符串
   */
  async extractNewScripts() {
    const html = await fetch(this._baseUrl + "?_timestamp=" + Date.now()).then(
      (resp) => resp.text()
    );
    this._srciptReg.lastIndex = 0;
    let result = [];
    let match;
    while ((match = this._srciptReg.exec(html))) {
      result.push(match.groups.src);
    }
    return { result, html };
  }
  /** 检查是否要更新 */
  async needUpdate() {
    const { result: newScripts, html } = await this.extractNewScripts();
    console.log(`{newScripts,html}:`, { newScripts, html });
    let result = false;
    // 判断第一次html的长度，则重新赋值长度
    if (this._htmlLangth === 0) {
      this._htmlLangth = html.length;
    }
    console.log(`this._htmlLangth :`, this._htmlLangth);
    // 判断第一次script的src，则重新赋值数组
    if (!this._lastSrcs || this._lastSrcs.length === 0) {
      this._lastSrcs = newScripts;
    }
    console.log(`this._lastSrcs:`, this._lastSrcs);
    // 判断当前html字符串长度不一致说明有更新
    if (this._htmlLangth !== html.length) {
      result = true;
    }
    // 判断 script的src数组长度不一致，则表示更新过
    if (this._lastSrcs.length !== newScripts.length) {
      result = true;
      return result;
    }
    // 循化便利script的src数组，分别对比位置及判断是否一致，不一致的说明有更新
    for (let i = 0; i < this._lastSrcs.length; i++) {
      if (this._lastSrcs[i] !== newScripts[i]) {
        result = true;
        break;
      }
    }
    this._htmlLangth = html.length;
    this._lastSrcs = newScripts;
    console.log(`result:`, result);
    return result;
  }
  startTest() {
    setTimeout(async () => {
      const status = await this.needUpdate();
      // 网站内容已更新
      if (status) {
        console.log(`The current site has been updated:`, "当前网站已更新");
        if (this._response) {
          this._response();
        } else {
          if (confirm("确定更新吗?")) {
            // 操作跟新动作
            if (this._response) {
              this._response();
            } else {
              location.reload();
            }
          } else {
            // 已点击取消更新,则不继续轮询
          }
        }
      } else {
        this.startTest();
      }
    }, this._times);
  }
}
