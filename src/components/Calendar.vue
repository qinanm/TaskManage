<template>
  <div id="calendar">
    <div class="calendar_header">
      <span class="iconfont" @click="lessMonth">&#xe685;</span>
      <h5>{{ curYear }}年{{ curMonth + 1 }}月{{ curData }}日</h5>
      <span class="iconfont" @click="addMonth">&#xe687;</span>
    </div>
    <div class="calendar_main">
      <div class="main_block_head"><span>日</span></div>
      <div class="main_block_head"><span>一</span></div>
      <div class="main_block_head"><span>二</span></div>
      <div class="main_block_head"><span>三</span></div>
      <div class="main_block_head"><span>四</span></div>
      <div class="main_block_head"><span>五</span></div>
      <div class="main_block_head"><span>六</span></div>
      <div
        v-for="(curday, index) in curDaysInMonth"
        :class="curday.class"
        :key="index"
        @click="changeActiveDate(curday.content)"
      >
        <span>{{ curday.content }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "my-calendar",
  // 日历的关键就是定位每个月的一号是星期几
  props: ["taskList"],
  data() {
    return {
      // 当前年份
      curYear: new Date().getFullYear(),
      // 当前月份
      curMonth: new Date().getMonth(), // 注意要展示month要手动加1
      // 当前日
      curData: new Date().getDate(),
      // 当前年月的一号为星期X
      //   targetDay: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay(), // 注意这里计算星期，如果月份手动加1了，需要将月份减回去
    };
  },
  computed: {
    // 每个月对应的天数
    curDaysInMonth() {
      let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      // 闰年2月不同天数
      if (
        (this.curYear % 4 === 0 && this.curYear % 100 !== 0) ||
        this.curYear % 400 === 0
      ) {
        daysInMonth[1] = 29;
      }
      let daysBlock = [];
      let pre = new Date(this.curYear, this.curMonth, 1).getDay();
      let after = daysInMonth[this.curMonth];
      let dayNum = 1;
      for (let i = 0; i < 35; i++) {
        let obj = {
          class: "main_block",
          content: "",
        };
        if (i >= pre && dayNum <= after) {
          obj = {
            class: "main_block",
            content: dayNum++,
          };
          if (dayNum - 1 === this.curData) {
            obj.class = "main_block active";
          }
        }

        daysBlock.push(obj);
      }
      return daysBlock;
    },
  },
  methods: {
    // 这里对mouth进行操作，一定要注意mouth比实际小1，要考虑进去
    lessMonth() {
      const realMonth = this.curMonth + 1;
      if (realMonth > 1) {
        this.curMonth -= 1;
      } else {
        this.curYear -= 1;
        this.curMonth = 11; // 时刻记住小1
      }
    },
    addMonth() {
      const realMonth = this.curMonth + 1;
      if (realMonth < 12) {
        this.curMonth += 1;
      } else {
        this.curYear += 1;
        this.curMonth = 0;
      }
    },
    // 点击对应的天数，1.修改当前天数  2.获取当前时间对应的任务（匹配年月日）
    changeActiveDate(date) {
      this.curData = date;
      // 修改组件taskManage的 targetDate
      const targetDate = this.curYear + "." + (this.curMonth + 1) + "." + date;
      // 通过自定义事件来进行组件间的通信
      console.log(targetDate);
      this.$emit("getTargetDate", targetDate);
    },
  },
};
</script>

<style scoped lang="less">
#calendar {
  width: 23.75rem;
  height: 25rem;
  position: absolute;
  top: 25rem;
  right: 6.25rem;
  //   background-color: #fff;
  padding: 0.9375rem;
  .calendar_header {
    display: flex;
    justify-content: space-between;
    height: 1.875rem;
    // background-color: rgb(184, 127, 127);
    span {
      line-height: 1.875rem;
      color: rgb(31, 108, 138);
      font-size: 1.25rem;
      cursor: pointer; // 鼠标样式改为小手
    }
    h5 {
      line-height: 1.875rem;
      font-size: 1.0625rem;
      font-weight: normal;
    }
  }
  .calendar_main {
    height: 18.75rem;
    margin-top: 1.25rem;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .main_block_head {
      // 使用less预处理器可以直接进行计算
      width: 100% ./ 7; // less除法失效，可以在/前加.进行强制除法运算
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 0.875rem;
      span {
        text-align: center;
        color: rgb(31, 108, 138);
      }
    }
    .main_block {
      width: 100% ./ 7;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 0.875rem;
      cursor: pointer;
      span {
        text-align: center;
      }
    }
    .active {
      background-color: rgb(245, 158, 158);
      color: #fff;
    }
  }
}
</style>