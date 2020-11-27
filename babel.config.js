const plugins = [

  // // "vant": "^1.6.18",
  // [
  //   "import",
  //   {
  //     libraryName: "vant",
  //     libraryDirectory: "es",
  //     style: true
  //   },
  //   "vant",
  // ],
  [
    "import",
    {
      libraryName: 'ant-design-vue',
      libraryDirectory: 'es',
      style: 'css'
    }
  ]
];
if (["production", "prod"].includes(process.env.NODE_ENV)) {
  plugins.push("transform-remove-console");
}
module.exports = {
  presets: [
    [
      "@vue/app",
      {
        polyfills: ["es6.promise", "es6.symbol"],
        useBuiltIns: "entry"
      }
    ]
  ],
  plugins
};
