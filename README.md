# 自动检测 web 页面更新脚本

## adk(引入)
### js script引入

```html
<!--引入 cdn -->
<script src="http://ywg.cool/file/AutoUpdate@1.2.0.js" ></script>

<!-- 使用 -->
<script>
  new AutoUpdate.default()
</script>
```
## 安装(包引入)
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
## 配置文档
### options 属性说明


| 属性 |版本 | 类型 | 说明 | 必须参数 | 默认值 |
|------|------|------|------|----------|:-------|
|   baseUrl   | >1.1.0 | string   |   当前请求的地址   |     false|  '/'  |
|   times   | >1.1.0|number   |   轮询请求首页的频率（毫秒）   |     false|  2000  |
|   response   | >1.1.0 |function   |   响应函数 (检测到更新后的钩子，可以用来处理弹出UI弹框) 必须返回一个布尔值，true表示用户点击已同意更新，false则表示未同意  |     false|   |
|   isWatchHtmlLength| >1.2.0   |boolean   |   是否监听html节点字符串长度作为更新的判断   |     false| false  |
|   debugger  | >1.2.0 |boolean   |   是否开启debugger模式，（console 输出更新对比的日志）   |     false| false  |





