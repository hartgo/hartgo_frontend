// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
import App from '@/App'
import router from '@/router'
import fetch, { fetchForm, fetchGet } from '@/lib/axios'
import ElementUI from 'element-ui'
import store from '@/lib/store'
import sha from '@/lib/sha'
import aes from '@/lib/aes'
import { api } from '@/constant'
import log from '@/utils/log'
import i18n from '@/utils/i18n'
// 引入字体和页面样式
import '@/assets/icon/iconfont.css';
import '@/assets/style/default.scss'; // 默认皮肤

Vue.use(VueLazyLoad, {
  error: require('@/../static/theme/default/images/default.png'),
  loading: require('@/../static/theme/default/images/default.png'),
  preLoad: 1,
  attempt: 1
})
Vue.use(ElementUI, {
  i18n: (path, value) => i18n.t(path, value),
  size: 'small'
})

Vue.prototype.$fetch = fetch
Vue.prototype.$fetchForm = fetchForm
Vue.prototype.$fetchGet = fetchGet
Vue.prototype.$sha = sha
Vue.prototype.$aes = aes
Vue.prototype.$api = api
Vue.prototype.$log = log
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
