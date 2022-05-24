<template>
  <div id="app">
    <Header></Header>
    <!-- 路由组件出口展示的地方 -->
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header'
export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style>    
</style>
