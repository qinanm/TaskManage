<template>
  <div id="clock">
    <!-- 外表盘 -->
    <div class="outer-clock-face">
      <div class="marking marking-one"></div>
      <div class="marking marking-two"></div>
      <div class="marking marking-three"></div>
      <div class="marking marking-four"></div>
      <!-- 内表盘 -->
      <div class="inner-clock-face">
        <!-- 时分秒 -->
        <div class="hand hour-hand" ref="hour"></div>
        <div class="hand min-hand" ref="min"></div>
        <div class="hand second-hand" ref="second"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "my-clock",
  data() {
    return {
      curHour: new Date().getHours() === 0 ? 24 : new Date().getHours(), // 0-23  ---> 1-24
      curMin: new Date().getMinutes(), // 0-59
      curSecond: new Date().getSeconds(), // 0-59
      Timer: "",
    };
  },
  mounted() {
    // 获取时分秒对应的节点
    const hourPointer = this.$refs.hour;
    const minPointer = this.$refs.min;
    const secondPointer = this.$refs.second;
    // 当前分针的度数
    let minDeg = this.curMin * 6;
    // 当前秒针的度数
    let secondDeg = this.curSecond * 6;
    // 当前时针的度数 --- 一小时 等于 30度  +  分针转一圈移动0.5度(就是一分钟0.5度)
    let hoursDeg =
      (this.curHour < 12 ? this.curHour : this.curHour - 12) * 30 +
      this.curMin * 0.5;

    // 初始化 为当前 时分秒
    hourPointer.style.transform = `rotate(${hoursDeg}deg)`;
    minPointer.style.transform = `rotate(${minDeg}deg)`;
    secondPointer.style.transform = `rotate(${secondDeg}deg)`;
    // 设置定时器，指定转动
    this.Timer = setInterval(() => {
      // 1s后秒针向后移动6度
      secondDeg += 6;
      secondPointer.style.transform = `rotate(${secondDeg}deg)`;
      if (secondDeg === 360) {
        secondDeg = 0;
        minDeg += 6;
        minPointer.style.transform = `rotate(${minDeg}deg)`;
        if (minDeg === 360) {
          minDeg = 0;
          hoursDeg += 0.5;
          secondPointer.style.transform = `rotate(${secondDeg}deg)`;
        }
      }
    }, 1000);
  },
  // 注销前清除定时器
  beforeDestroy() {
    clearInterval(this.Timer);
    this.Timer = "";
  },
};
</script>

<style scoped lang="less">
#clock {
  width: 15rem;
  height: 15rem;
  border: 0.3125rem solid rgb(106, 153, 161);
  border-radius: 50%;
  // 设置盒子阴影
  box-shadow: 0.1875rem 0.1875rem 0.4375rem rgb(106, 153, 161, 0.5),
    -0.1875rem -0.1875rem 0.4375rem rgba(145, 187, 196, 0.5),
    inset 0.1875rem 0.1875rem 0.4375rem rgb(106, 153, 161, 0.5),
    inset -0.1875rem -0.1875rem 0.3125rem rgba(105, 137, 145, 0.2);
  padding: 0.625rem;
  position: absolute;
  top: 3.125rem;
  right: 11.25rem;
  .outer-clock-face {
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    // background-color: #fff;
    overflow: hidden;
    &::after {
      transform: rotate(90deg);
    }
    &::before,
    &::after,
    .marking {
      content: "";
      position: absolute;
      left: 49%;
      width: 0.25rem;
      height: 100%;
      background-color: rgb(65, 192, 26);
      z-index: 0;
    }
    .marking {
      width: 0.1875rem;
      background-color: rgb(73, 66, 66);
    }
    .marking-one {
      transform: rotate(30deg);
    }
    .marking-two {
      transform: rotate(60deg);
    }
    .marking-three {
      transform: rotate(120deg);
    }
    .marking-four {
      transform: rotate(150deg);
    }
    .inner-clock-face {
      width: 80%;
      height: 80%;
      position: absolute;
      top: 10%;
      left: 10%;
      background-color: rgb(195, 225, 231);
      border-radius: 50%;
      z-index: 1;
      &::before {
        content: "";
        width: 0.8125rem;
        height: 0.8125rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background-color: rgb(77, 92, 92);
        z-index: 11;
      }
      .hand {
        width: 0.1875rem;
        height: 45%;
        border-radius: 0.1875rem;
        position: absolute;
        left: 50%;
        bottom: 50%;
        // 改变旋转中心
        transform-origin: 50% bottom;
        transform: translateX(-50%);
        z-index: 10;
      }
      .hour-hand {
        width: 0.3125rem;
        height: 30%;
        background-color: rgb(54, 123, 187);
        transform: rotate(180deg);
      }
      .min-hand {
        height: 40%;
        background-color: rgb(92, 147, 230);
        transform: rotate(230deg);
      }
      .second-hand {
        width: 0.125rem;
        background-color: rgb(218, 139, 102);
        transform: rotate(130deg);
      }
    }
  }
}
</style>