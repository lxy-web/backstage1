import Vue from 'vue'
import axios from "axios"
import nprogress from "nprogress"
import "nprogress/nprogress.css"
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器
 nprogress.start();//请求服务之前，调用进度条渲染动画
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
});
//在response拦截器中，隐藏进度条。
axios.interceptors.response.use(config=>{
  //当进入response说明数据请求结束，隐藏进读条；
  nprogress.done()
  return config
})
Vue.prototype.$axios=axios;
