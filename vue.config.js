// vue.config.js
// 配置信息详见vue-cli官网：https://cli.vuejs.org/zh/config/
let moduleMethod = require("./config/getModules.js");
let modules = moduleMethod.modules();
const isProduction = process.env.NODE_ENV === "production"; // 是否是生产环境
// let _publicPath = "/";
module.exports = {
  publicPath: "", // 部署应用包时的基本 URL
  // filenameHashing: true, // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，默认: true
  pages: modules, // 多页面配置
  lintOnSave: !isProduction, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  // runtimeCompiler: false, // 是否使用包含运行时编译器的 Vue 构建版本，默认: false
  transpileDependencies: ["webpack-dev-server/client"], // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  chainWebpack: config => {
    if (isProduction) {
      config.module
        .rule("images")
        .test(/\.(jpg|png|gif)$/)
        .use("url-loader")
        .loader("url-loader")
        .tap(options => Object.assign(options, { limit: 10000 }))
        .options({
          limit: 10000, // 以下配置项用于配置file-loader
          // 将图片打包到dist/img文件夹下, 不配置则打包到dist文件夹下
          outputPath: "static/image/",
          // 配置打包后图片文件名
          name: "[name].[hash:8].[ext]"
        })
        .end();
    }
  },
  css: {
    extract: isProduction ? true : false,
    sourceMap: false,
    modules: false
  },
  devServer: {
    //代理
    proxy: {
      "/game": {
        target: "https://empdev.enn.cn",
        ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/game": ""
        }
      },
      "/helmet": {
        target: "https://wis-hat.enn.cn:20020/api/v1",
        ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/helmet": ""
        }
      },
      "/invite": {
        target: "https://empdev.enn.cn",
        ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/invite": ""
        }
      },
    }
  }
};
