
//生产模式
import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import ZkTable from 'vue-table-with-tree-grid'
import './assets/fonts/iconfont.css'
import './assets/css/reset.css'


Vue.use(ZkTable)
Vue.config.productionTip = false

new Vue({
  router,
 
  render: h => h(App)
}).$mount('#app')
