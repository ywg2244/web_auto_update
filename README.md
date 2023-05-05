# 自动检测 web 页面更新脚本

## 安装
### npm

```javascript
npm i @ywg2244/web_auto_update
```
### pnpm

```javascript
pnpm i @ywg2244/web_auto_update
```
### yarn

```javascript
yarn add @ywg2244/web_auto_update
```

## 使用

```javascript
import AutoUpData from "@ywg2244/web_auto_update";
// ...

new AutoUpData({
  baseUrl: "/", // 默认
  times: 2000, // 默认
  response() {
    //... 弹出更新框，可以自己使用UI框架
    // 需要返回一个布尔值，表示用户是否同意更新

    return true // true：内部会自动调用 location.reload() 方法进行刷新页面；false：会终止自动检测操作

  },
});
```
