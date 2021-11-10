import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/common.css'
import './assets/iconfont.css'
Vue.config.productionTip = false

Vue.use(ElementUI);

axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1'
axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$api = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
