<template>
  <div id="app">
    <Header></Header>
    <!-- 路由组件出口展示的地方 -->
    <router-view class="showPage w"></router-view>
  </div>
</template>

<script>
import Header from "./components/Header";
export default {
  name: "App",
  components: {
    Header,
  },
};
</script>

<style>
.showPage {
  height: 50rem;
  background-color: rgba(138, 198, 209, 0.3);
  position: relative;
}
</style>
