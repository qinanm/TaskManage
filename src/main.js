import Vue from 'vue'
// 按需引入 element-ui 
import { Button,Message,MessageBox,Dialog } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';  // 引入element-ui样式
// 引入echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts
import App from './App.vue'
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.use(Button)
Vue.use(Dialog)

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
