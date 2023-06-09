/*
 * @Author: ywg ywg2244@163.com
 * @Date: 2023-05-04 16:39:38
 * @LastEditors: ywg ywg2244@163.com
 * @LastEditTime: 2023-05-08 09:32:13
 * @FilePath: /autoUpDate/src/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { isFun } from "./lib/type/is";

/**
 * 长时间停留页面,自动检测当前站点更新情况
 */
class AutoUpData {
  /** 自动检测程序是否开启    */
  _status = true;
  _setTimeNum?: NodeJS.Timeout;
  /** 一开始的script的src数组集合 */
  _lastSrcs: string[] = [];
  /** 一开始的当前html节点字符串长度 */
  _htmlLangth = 0;
  /** 匹配script的src正则 */
  _srciptReg = /\<script.*src=["'](?<src>[^"']+)/gm;
  /** 当前请求地址 默认根地址 */
  _baseUrl = "/";
  /** 是否监听html节点字符串长度作为更新的判断 */
  _isWatchHtmlLength = false;
  /** 是否开启debugger模式，（console 输出更新对比的日志） */
  _debugger = false;
  /** 轮训验证时间戳，默认2000毫秒 */
  _times = 2000;
  /** 响应函数 (检测到更新后的钩子，可以用来处理弹出UI弹框) */
  _response?: () => void = undefined;
  constructor(options?: {
    /** 当前请求地址 默认根地址 "/" */
    baseUrl?: string;
    /** 轮训验证时间戳，默认2000毫秒 */
    times?: number;
    /** 是否监听html节点字符串长度作为更新的判断 */
    isWatchHtmlLength?: boolean;
    /** 是否开启debugger模式，（console 输出更新对比的日志） */
    debugger?: boolean;
    /** 响应函数 (检测到更新后的钩子，可以用来处理弹出UI弹框)  需用户手动出发更新机制
     * * location.reload();
     * * history.go(0);
     */
    response?: () => void;
  }) {
    options && options.baseUrl && (this._baseUrl = options.baseUrl);
    options && options.times && (this._times = options.times);
    options && typeof options.response === 'function' && (this._response = options.response);
    options && typeof options.isWatchHtmlLength === 'boolean' && (this._isWatchHtmlLength = options.isWatchHtmlLength);
    options && typeof options.debugger === 'boolean' && (this._debugger = options.debugger);
    this.startTest();
    this.watchOffline();
    this.watchOnline();
  }
  /**
   * 提取脚本字符串
   */
  async extractNewScripts() {
    let result: string[] = [];
    let html = '';
    if (navigator.onLine) {
      try {
        html = await fetch(this._baseUrl + "?_timestamp=" + Date.now()).then(
          (resp) => resp.text()
        );
      } catch (e) {
        console.error(`请求异常:`, e);
        this.stopTest();
      }
      this._srciptReg.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = this._srciptReg.exec(html))) {
        if (match && match.groups) {
          const src = match.groups.src;
          result.findIndex(i => i === src) === -1 && result.push(src);
        }
      }
    } else {
      console.warn('设备处于离线状态，无法发送网络请求。');
      this.stopTest();
    }
    return { result, html };
  }
  /** 检查是否要更新 */
  async needUpdate() {
    const { result: newScripts, html } = await this.extractNewScripts();
    let result = false;
    // 判断第一次script的src，则重新赋值数组
    if (!this._lastSrcs || this._lastSrcs.length === 0) {
      this._lastSrcs = newScripts;
    }

    // 判断 script的src数组长度不一致，则表示更新过
    if (this._lastSrcs.length !== newScripts.length) {
      result = true;
      if (this._debugger) {
        console.log(`判断 script的src数组长度不一致`);
        console.log(`保存的的script的src数组集合 length: ${this._lastSrcs.length} `, this._lastSrcs,);
        console.log(`新的的script的src数组集合 length: ${newScripts.length} `, newScripts,);
      }
      return result;
    }
    // 轮询遍历 script的src数组，分别对比位置及判断是否一致，不一致的说明有更新
    for (let i = 0; i < this._lastSrcs.length; i++) {
      if (this._lastSrcs[i] !== newScripts[i]) {
        result = true;
        if (this._debugger) {
          console.log(`轮询遍历 script的src数组，分别对比位置及判断是否一致`);
          console.log(`保存的script src集合:`, this._lastSrcs);
          console.log(`新的script src集合:`, newScripts);
          console.log(`index ${i}`, this._lastSrcs[i], 'vs', newScripts[i]);
        }
        break;
      }
    }
    this._lastSrcs = newScripts;
    if (this._isWatchHtmlLength) {
      // 判断第一次html的长度，则重新赋值长度
      if (this._htmlLangth === 0) {
        this._htmlLangth = html.length;
      }
      // 判断当前html字符串长度不一致说明有更新
      if (this._htmlLangth !== html.length) {
        result = true;
        if (this._debugger) {
          console.log(`判断当前html字符串长度不一致说明有更新`);
          console.log(`保存的html节点长度:`, this._htmlLangth);
          console.log(`新的html节点长度:`, html.length);
        }
      }
      this._htmlLangth = html.length;
    }
    return result;
  }
  /** 开始执行自动检测更新程序 */
  startTest() {
    if (!this._status) return;
    clearTimeout(this._setTimeNum);
    this._setTimeNum = setTimeout(async () => {
      const status = await this.needUpdate();
      // 网站内容已更新
      if (status) {
        console.log(`The current site has been updated:`, "当前网站已更新");
        if (isFun(this._response)) {
          this._response();
        } else {
          if (confirm("已发现更新内容,确定现在更新吗?")) {
            clearTimeout(this._setTimeNum);
            // 操作跟新动作
            location.reload();
          } else {
            clearTimeout(this._setTimeNum);
            // 已点击取消更新,则不继续轮询
          }
        }
      } else {
        this.startTest();
      }
    }, this._times);
  }
  /** 监听网络是否关闭了（关闭网络直接 结束自动检测动作） */
  watchOffline() {
    window.addEventListener('offline', () => {
      this.stopTest();
    });
  }
  /** 监听网络是否开启了（开启网络直接 开始自动检测动作） */
  watchOnline() {
    window.addEventListener('online', () => {
      this._status = true;
      this.startTest();
    });
  }
  /** 结束检测动作 */
  stopTest() {
    this._status = false;
    clearTimeout(this._setTimeNum);
  }
}


export default AutoUpData;