import Vue from 'vue'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters' // 全局filter
import './icons' // icon
import './errorLog'// error log
import './permission' // 权限
// import './mock'  // 该项目所有请求使用mockjs模拟
import waves from '@/directive/waves/index.js' // 水波纹指令
import { pageUtilsInstall } from '@/utils/vueCommon'
import 'font-awesome-webpack2'
import VueAreaLinkage from 'vue-area-linkage'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import vueQuillEditor from 'vue-quill-editor'

import Viewer from 'v-viewer'
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})

// if (process.env.NODE_ENV === 'development') {
//   require('./mock')
// }

Vue.use(ElementUI)
Vue.directive('waves', waves)
Vue.use(VueAreaLinkage)
Vue.use(vueQuillEditor)

pageUtilsInstall(Vue)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
