<template>
  <div id="random-word">
    <div class="word">
      <h2>历史上的今天</h2>
      <br />
      <ul>
        <li v-for="(story, index) in historysInToday" :key="index">
          <span>{{ story.date }}：</span>
          <span>{{ story.title }}</span>
        </li>
      </ul>
    </div>
    <div class="img">
      <!-- 随机获取二次元图片 -->
      <img src="https://api.ghser.com/random/pc.php" alt="" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "random-word",
  data() {
    return {
      historysInToday: [],
    };
  },
  mounted() {
    axios
      .get("https://api.oick.cn/lishi/api.php")
      .then((response) => {
        console.log(response);
        //   this.word = response.data.result
        this.historysInToday = response.data.result;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped lang="less">
#random-word {
  .word {
    width: 80%;
    margin: 0 auto;
    padding: 3.125rem 0;
    text-align: center;
  }
  .img {
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    img {
      height: 18.75rem;
    }
  }
}
</style>