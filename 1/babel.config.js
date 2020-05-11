//初始化一个数据，用来储存依赖，

const productionPlugins=[];
//process.env.NODE_ENV用来获取编译模式
if(process.env.NODE_ENV==="production"){
  //如果是生产模式说明需要去除掉多余的console
   productionPlugins.push("transform-remove-console");
   //存储到变量里面；
   //transform-remove-console 用来清除console
}
module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...productionPlugins//解构
  ]
}