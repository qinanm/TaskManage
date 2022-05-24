// 配置路由的地方
import Vue from 'vue';
import VueRouter from 'vue-router';

// 使用插件
Vue.use(VueRouter);

// 引入路由
import routes from './routes';

// 配置并暴露路由器
export default new VueRouter({
    //配置路由
    routes,
    //配置跳转滚动
    scrollBehavior() {
        return { y: 0 }
    }
})