import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// Element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 公共样式
import './assets/css/common.css'

// 树型表格
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 图表

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor, /* { default global options } */)

// 进度条  NProgress

import 'nprogress/nprogress.css'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
