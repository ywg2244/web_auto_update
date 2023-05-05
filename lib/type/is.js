"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFun = void 0;
/*
 * @Author: ywg ywg2244@163.com
 * @Date: 2023-05-05 17:20:24
 * @LastEditors: ywg ywg2244@163.com
 * @LastEditTime: 2023-05-05 17:30:05
 * @FilePath: /autoUpData/lib/type/is.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 判断当前参数是不是函数
 * @param param
 * @returns
 */
function isFun(param) {
    return typeof param === 'function';
}
exports.isFun = isFun;
