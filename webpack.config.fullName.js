const HTMLWebpackPlugin = require("html-webpack-plugin");
// 配置html-webpack插件
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
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
