"use strict";
/*
 * @Author: ywg ywg2244@163.com
 * @Date: 2023-05-04 16:39:38
 * @LastEditors: ywg ywg2244@163.com
 * @LastEditTime: 2023-05-06 14:34:07
 * @FilePath: /autoUpDate/src/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var is_1 = require("./lib/type/is");
/**
 * 长时间停留页面,自动检测当前站点更新情况
 */
var AutoUpData = /** @class */ (function () {
    function AutoUpData(options) {
        /** 一开始的script的src数组集合 */
        this._lastSrcs = [];
        /** 一开始的当前html节点字符串长度 */
        this._htmlLangth = 0;
        /** 匹配script的src正则 */
        this._srciptReg = /\<script.*src=["'](?<src>[^"']+)/gm;
        /** 当前请求地址 默认根地址 */
        this._baseUrl = "/";
        /** 是否监听html节点字符串长度作为更新的判断 */
        this._isWatchHtmlLength = false;
        /** 是否开启debugger模式，（console 输出更新对比的日志） */
        this._debugger = false;
        /** 轮训验证时间戳，默认2000毫秒 */
        this._times = 2000;
        /** 响应函数 (检测到更新后的钩子，可以用来处理弹出UI弹框) */
        this._response = undefined;
        options && options.baseUrl && (this._baseUrl = options.baseUrl);
        options && options.times && (this._times = options.times);
        options && typeof options.response === 'function' && (this._response = options.response);
        options && typeof options.isWatchHtmlLength === 'boolean' && (this._isWatchHtmlLength = options.isWatchHtmlLength);
        options && typeof options.debugger === 'boolean' && (this._debugger = options.debugger);
        this.startTest();
    }
    /**
     * 提取脚本字符串
     */
    AutoUpData.prototype.extractNewScripts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var html, result, match, _loop_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this._baseUrl + "?_timestamp=" + Date.now()).then(function (resp) { return resp.text(); })];
                    case 1:
                        html = _a.sent();
                        this._srciptReg.lastIndex = 0;
                        result = [];
                        _loop_1 = function () {
                            if (match && match.groups) {
                                var src_1 = match.groups.src;
                                result.findIndex(function (i) { return i === src_1; }) === -1 && result.push(src_1);
                            }
                        };
                        while ((match = this._srciptReg.exec(html))) {
                            _loop_1();
                        }
                        return [2 /*return*/, { result: result, html: html }];
                }
            });
        });
    };
    /** 检查是否要更新 */
    AutoUpData.prototype.needUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, newScripts, html, result, i;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.extractNewScripts()];
                    case 1:
                        _a = _b.sent(), newScripts = _a.result, html = _a.html;
                        result = false;
                        // 判断第一次script的src，则重新赋值数组
                        if (!this._lastSrcs || this._lastSrcs.length === 0) {
                            this._lastSrcs = newScripts;
                        }
                        // 判断 script的src数组长度不一致，则表示更新过
                        if (this._lastSrcs.length !== newScripts.length) {
                            result = true;
                            if (this._debugger) {
                                console.log("\u5224\u65AD script\u7684src\u6570\u7EC4\u957F\u5EA6\u4E0D\u4E00\u81F4");
                                console.log("\u4FDD\u5B58\u7684\u7684script\u7684src\u6570\u7EC4\u96C6\u5408 length: ".concat(this._lastSrcs.length, " "), this._lastSrcs);
                                console.log("\u65B0\u7684\u7684script\u7684src\u6570\u7EC4\u96C6\u5408 length: ".concat(newScripts.length, " "), newScripts);
                            }
                            return [2 /*return*/, result];
                        }
                        // 轮询遍历 script的src数组，分别对比位置及判断是否一致，不一致的说明有更新
                        for (i = 0; i < this._lastSrcs.length; i++) {
                            if (this._lastSrcs[i] !== newScripts[i]) {
                                result = true;
                                if (this._debugger) {
                                    console.log("\u8F6E\u8BE2\u904D\u5386 script\u7684src\u6570\u7EC4\uFF0C\u5206\u522B\u5BF9\u6BD4\u4F4D\u7F6E\u53CA\u5224\u65AD\u662F\u5426\u4E00\u81F4");
                                    console.log("\u4FDD\u5B58\u7684script src\u96C6\u5408:", this._lastSrcs);
                                    console.log("\u65B0\u7684script src\u96C6\u5408:", newScripts);
                                    console.log("index ".concat(i), this._lastSrcs[i], 'vs', newScripts[i]);
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
                                    console.log("\u5224\u65AD\u5F53\u524Dhtml\u5B57\u7B26\u4E32\u957F\u5EA6\u4E0D\u4E00\u81F4\u8BF4\u660E\u6709\u66F4\u65B0");
                                    console.log("\u4FDD\u5B58\u7684html\u8282\u70B9\u957F\u5EA6:", this._htmlLangth);
                                    console.log("\u65B0\u7684html\u8282\u70B9\u957F\u5EA6:", html.length);
                                }
                            }
                            this._htmlLangth = html.length;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /** 开始执行自动检测更新程序 */
    AutoUpData.prototype.startTest = function () {
        var _this = this;
        clearTimeout(this._setTimeNum);
        this._setTimeNum = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.needUpdate()];
                    case 1:
                        status = _a.sent();
                        // 网站内容已更新
                        if (status) {
                            console.log("The current site has been updated:", "当前网站已更新");
                            if ((0, is_1.isFun)(this._response)) {
                                this._response() && location.reload();
                            }
                            else {
                                if (confirm("确定更新吗?")) {
                                    clearTimeout(this._setTimeNum);
                                    // 操作跟新动作
                                    location.reload();
                                }
                                else {
                                    clearTimeout(this._setTimeNum);
                                    // 已点击取消更新,则不继续轮询
                                }
                            }
                        }
                        else {
                            this.startTest();
                        }
                        return [2 /*return*/];
                }
            });
        }); }, this._times);
    };
    return AutoUpData;
}());
exports.default = AutoUpData;
