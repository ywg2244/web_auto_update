# 自动检测 web 页面更新脚本

## 安装

```javascript
npm i web_auto_update
```

## 使用

```javascript
import WebAutoUpdate from "web_auto_update";
// ...

new WebAutoUpdate({
  baseUrl: "/", // 默认
  times: 2000, // 默认
  response() {
    //... 弹出更新框，可以自己使用UI框架
    // 使用loaction.reload() 进行更新
  },
});
```