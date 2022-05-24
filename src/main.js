import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'

// 注册全局组件 -- 日历
import Calendar from '@/components/Calendar'
Vue.component('MyCalendar', Calendar)

// 注册全局组件 -- 时钟
import Clock from '@/components/Clock'
Vue.component('MyClock', Clock)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 注册路由
  router,
}).$mount('#app')
