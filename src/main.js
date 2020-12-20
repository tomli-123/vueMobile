import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from '@/utils/request.js'
// 导入, 按需导入的核心配置文件
import '@/utils/vant-ui.js'
// 监测屏幕的变化 resize, 动态的设置 html font-size, 公式: 屏幕宽度/10
// 假定当前屏幕 375px => html font-size 37.5 => 1rem 37.5
import 'amfe-flexible'
// 自己的样式
import '@/styles/index.scss'
import { getRelativeTime } from '@/utils/date-time.js'

Vue.prototype.$http = http
Vue.config.productionTip = false
Vue.prototype.$eventBus = new Vue()

// 全局过滤器
// {{ msg | relative }}
Vue.filter('relative', (value) => {
  return getRelativeTime(value)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app') // 指定视图

// 模块化 组件化
// 1. 模块化, 对于js功能封装或者拆分, 便于维护
//    模块化: 只是对于js层面的处理
//    request.js 请求的封装模块
//    storage.js 本地存储的封装模块
//    ...

// 2. 组件化: 页面由结构样式行为三部分组成, 一个页面拆分成一个个组件
//    每个组件都有这个自己独立的结构样式行为
//    comment.vue 评论组件
//    ...
