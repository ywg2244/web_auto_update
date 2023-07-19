# 自动检测 web 页面更新脚本

## 实现思路

实现机制是对比页面所有的 script 的标签，如果是工程化的（vue、react）会借助于 webpack 打包页面，一有更新 script 的 src 会变化 hash 值，与上次做对比，不一样就提醒更新.
具体:工程网站一打开，把所有 script 的 src 都保存一下，默认 2000 毫米请求下根路径，再看看根路径的 html 文件的 script 的 src 根上次是否一致,其中,根据配置可以使用默认的`onfirm("已发现更新内容,确定现在更新吗?")`同步方式弹框阻塞页面进程让用户选择性更新,也可使用`options.response`钩子进行自定义 UI 弹框，需要注意的是,在这个钩子中,用户必须提供更新页面的方法.

## sdk(引入)

### js script 引入

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My Web app</title>
    <!--引入 资源 -->
    <script src="http://ywg.cool/file/AutoUpdate.js"></script>

    <!-- 或  具体某个版本 -->
    <!-- <script src="http://ywg.cool/file/AutoUpdate@<version>.js"></script> http://ywg.cool/file/AutoUpdate@1.2.4.js -->

  </head>
  <body>
    <!-- 使用 -->
    <script>
      // 使用默认配置
      // new AutoUpdate.default()

      // 或  使用自定义配置
      new AutoUpdate.default({
        times: 10 * 1000,
        response() {
          //... 弹出更新框，可以自己使用UI框架
          //需用户手动出发更新机制
          //...  弹出自定义UI弹框，判断用户是否点击更新按钮  ，使用以下api进行更新
          // 1* * location.reload();
          // 2* * history.go(0);
        },
      });
    </script>
  </body>
</html>
```

**也可以将资源包下载到项目本地，进行相对路径引入**

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
import AutoUpdate from "@ywg2244/web_auto_update";
// ...

new AutoUpdate({
  baseUrl: "/", // 默认
  times: 2000, // 默认
  response() {
    //... 弹出更新框，可以自己使用UI框架
    //...  弹出自定义UI弹框，判断用户是否点击更新按钮 ，使用以下api进行更新
    // 1* * location.reload();
    // 2* * history.go(0);
  },
});
```

## 配置文档

### options 属性说明

| 属性              | 版本   | 类型     | 说明                                                                                                                                                    | 必须参数 | 默认值 |
| ----------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | :----- |
| baseUrl           | >1.1.0 | string   | 当前请求的地址                                                                                                                                          | false    | '/'    |
| times             | >1.1.0 | number   | 轮询请求首页的频率（毫秒）                                                                                                                              | false    | 2000   |
| response          | >1.1.0 | function | 响应函数 (检测到更新后的钩子，可以用来处理弹出 UI 弹框) 需要注意的是,在这个钩子中,用户必须提供更新页面的方法. <br/><br/> 具体实现可参考:<br />1、 location.reload(); <br/>2、 history.go(0); | false    |        |
| isWatchHtmlLength | >1.2.0 | boolean  | 是否监听 html 节点字符串长度作为更新的判断                                                                                                              | false    | false  |
| debugger          | >1.2.0 | boolean  | 是否开启 debugger 模式，（console 输出更新对比的日志）                                                                                                  | false    | false  |
