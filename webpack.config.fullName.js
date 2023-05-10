/*
 * @Author: ywg ywg2244@163.com
 * @Date: 2023-05-06 10:40:32
 * @LastEditors: ywg ywg2244@163.com
 * @LastEditTime: 2023-05-10 09:30:51
 * @FilePath: /WebAutoUpDate/webpack.config.fullName.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const HTMLWebpackPlugin = require("html-webpack-plugin");
// 配置html-webpack插件
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: `AutoUpdate.js`,
    library: {
      name: "AutoUpdate",
      type: "umd",
    },
    // clean: true,
  },
  module: {
    // 指定要加载的规则
    rules: [
      {
        test: /\.ts$/, // test指定的是规则生效的文件
        use: "ts-loader",
        // 排除要处理的文件
        exclude: /node-modules/,
      },
    ],
  },
  // 模块配置：让webpack了解哪些方法可以被当作模块引入
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: "调试 web_auto_update", // 设置生成html的title
      // template:'./src/index.html', // 引入模板
    }),
  ],
};
