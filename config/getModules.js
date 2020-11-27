const glob = require("glob");
let modules = {};

module.exports.modules = function() {
  glob.sync("./src/modules/*/*.js").forEach(filepath => {
    let fileList = filepath.split("/");
    let fileName = fileList[fileList.length - 2];
    modules[fileName] = {
      entry: `src/modules/${fileName}/${fileName}.js`,
      // 模板来源
      template: `public/${fileName}.html`,
      // 在 dist/index.html 的输出
      filename: `${fileName}.html`,
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", fileName]
    };
  });
  return modules;
};
