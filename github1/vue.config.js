module.exports = {
    chainWebpack: config => {
        //  config.module
        //生产环境
        //通过when来判断现在是什么编译模式
        config.when(process.env.NODE_ENV === "production", config => {
            //entry找到默认的打包入口，clear删除默认的入口，add添加新入口
            config.entry("app").clear().add("./src/main-prod.js");
            //externals,设置打包排除项，通过键值对的形式，键名是可省略的包名
            config.set('externals', {
                vue: "Vue",
                "vue-router": "VueRouter",
                axios: "axios",
                lodash: " _",
                nprogress: "nprogress",
                echarts: "echarts"
            })
            config.plugin('html').tap(args => {
                //添加一个变量
                args[0].isProd = true;
                return args;
            })
        });
        //开发环境
        config.when(process.env.NODE_ENV === "development", config => {
            console.log(config)
            //entry找到默认的打包入口，clear删除默认的的入口，add添加新的入口；
            config.entry("app").clear().add('./src/main-dev.js');
            config.plugin('html').tap(args => {
                args[0].isProd = false;
                return args
            })
        })
    }
}