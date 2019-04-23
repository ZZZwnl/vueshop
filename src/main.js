import Vue from 'vue'
import App from './App'
import router from './router'

//  引入全局控制css样式文件
import './assets/css/global.css'

// 引入icon图标库样式文件
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'

// 引入elementui组件库
import ElementUI from 'element-ui'
// 注册组件
Vue.use(ElementUI)
// Vue.config.productionTip = false

// 给axios做配置
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'

// axios请求拦截器
axios.interceptors.request.use(function (config) {
  // config: axios的配置对象，具体是axios大对象内部的子级成员
  // console.dir(axios)
  // console.dir(config)  // config 约等于 axios.defaults
  // 把token绑定到axios的身上(要通过请求头方式体现)
  var token = window.sessionStorage.getItem('token')
  config.headers.Authorization = token
  return config
}, function (erroe) {
  return erroe
})
Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
