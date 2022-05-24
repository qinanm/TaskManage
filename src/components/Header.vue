<template>
  <div id="header" class="w">
    <div class="active">
        <!-- 声明式导航--路由跳转 -->
        <router-link to="/task_manage">任务管理</router-link>
        <!-- <a href="#">任务管理</a> -->
    </div>
    <div><a href="#">心情监测</a></div>
    <div><a href="#">来点music</a></div>
    <div><a href="#">随机美句</a></div>
    <div><a href="#">个人中心</a></div>
  </div>
</template>

<script>
export default {
  name: "my-header",
  data() {
      return {
      }
  },
};
</script>

<style scoped lang="less">

#header {
  display: flex;
  height: 3.4375rem;
  background-color: rgb(187,222,214);
  
  div{
      display: flex;
      flex-direction: column;
      width: 25%;
      border: .0625rem solid rgb(253, 210, 210);
      justify-content: center;
      font-size: 1.1875rem;
      a{
          text-align: center;
      }
  }
  .active{
      background-color: rgb(255,182,185);
  }
}
</style>