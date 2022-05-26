<template>
  <div id="moodManage">
    <div class="mood_and_diary">
      <!-- 标题提问 -->
      <div class="mood_quiz"><h3>你的心情是？</h3></div>
      <!-- 表情emoji -->
      <div class="mood_emoji" ref="emoji">
        <!-- 开心 -->
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="moodsAndEmojis[3].emoji"></use>
        </svg>
      </div>
      <!-- 表情描述 -->
      <div class="mood_msg">
        <div class="mork" ref="circle">
          <!-- 每一个情绪描述相当于一个节点, 要让节点围绕着圆 -->
          <div
            class="item_mood_msg"
            v-for="(mood, index) in moodsAndEmojis"
            :key="index"
            ref="itemmoods"
          >
            <span>{{ mood.mood }}</span>
          </div>
          <!-- 选中心情描述 -->
          <div class="item_mood_msg_select">
            是{{ moodsAndEmojis[3].mood }}啊
          </div>
          <!-- 左右箭头切换心情 -->
          <div class="pointer pointer left-pointer" @click="leftChangeAngle">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-Arrow-Left-copy"></use>
            </svg>
          </div>
          <div class="pointer right-pointer" @click="rightChangeAngle">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-Arrow-Left-copy"></use>
            </svg>
          </div>
        </div>
      </div>
      <!-- 日记 -->
      <div class="diary">
        <!-- 提问， 是什么让你产生这种心情的呢，不妨写下来吧  多行文本输入框 -->
        <textarea
          name=""
          id=""
          cols="46"
          rows="4"
          placeholder="是什么让你产生这种心情的呢，不妨把它写下来吧"
          ref="diarycon"
        ></textarea>
        <!-- <input type="text" placeholder="是什么让你产生这种心情的呢，不妨写下来吧 "> -->
      </div>
      <!-- 确认今日心情和报告 -->
      <button @click="commitMoodDiary">今日份心情日记提交</button>
      <!-- 当时心情展示  展示条件是否有curMood-->
      <div class="showMoodDiary" v-show="curMood">
        <span>{{ targetDate }}</span
        ><br />
        <span>今日心情: {{ curMood }}</span
        ><br />
        <span>关键词: 心情日记</span><br />
        <span>具体描述: {{ curDiary }}</span>
      </div>
    </div>
    <!-- 心情报告 一些统计功能需要弹窗感觉好像可以用上element-ui了 -->
    <div class="mood_report">
      <el-button type="text" @click="dialogVisible = true"
        >点击查看心情报告</el-button
      >

      <el-dialog
        title="心情报告"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <!-- <span>这是一段信息111111111111</span> -->
        <!-- 画图 -- 关于心情统计的图 在点击来后在画出来 -->
        <!-- <button @click="drawPiePic" class="draw-btn">
          点击查看{{ curMonth }}月心情数据
        </button> -->
        <div
          class="echart"
          ref="echart"
          style="width: 100%; height: 580px"
        ></div>
        <!-- 一些心情具体数据的表现 -->
        <div class="specify-mood">
          你的正面情绪次数出现了 <span>{{ goodMoods }}</span> 次 <br />
          你的中性情绪次数出现了 <span>{{ middleMoods }}</span> 次 <br />
          你的负面情绪次数出现了 <span>{{ badMoods }}</span> 次 <br />
          你的情绪中出现最多次数的是 <span>{{ maxMood }}</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>

    <MyCalendar ref="calendar"></MyCalendar>
    <MyClock></MyClock>
  </div>
</template>

<script>
export default {
  name: "mood-watch",
  data() {
    return {
      // 为了让心情和表情对应性更强烈一些，使用数组对象  // 用来存储在localStorage的心情数据
      moodsAndEmojis: [
        {
          mood: "开心",
          emoji: "#icon-happy",
          type: "正面",
          diary: "",
        },
        {
          mood: "难过",
          emoji: "#icon-a-dakubeishangshangxinbiaoqingxiaolian",
          type: "负面",
          diary: "",
        },
        {
          mood: "尴尬",
          emoji: "#icon-a-gangaliuhanbiaoqingxiaolian",
          type: "中性",
          diary: "",
        },
        {
          mood: "喜欢",
          emoji: "#icon-a-aiqingxihuansebiaoqingxiaolian",
          type: "正面",
          diary: "",
        },
        {
          mood: "生气",
          emoji: "#icon-a-shengqifennumaohuofenkaiqifenbiaoqingxiaolian",
          type: "负面",
          diary: "",
        },
        {
          mood: "惊讶",
          emoji: "#icon-a-jingyajingqiwasetianlabiaoqingxiaolian",
          type: "中性",
          diary: "",
        },
        {
          mood: "自定",
          emoji: "#icon-a-xiaolianbiaoqing",
          // 可用户指定type
          type: "中性",
          diary: "",
        },
      ],
      curMood: "",
      curDiary: "",
      // 存放关于圆的一些数据
      cache: {},
      targetDate:
        new Date().getFullYear() +
        "." +
        (new Date().getMonth() + 1) +
        "." +
        new Date().getDate(),
      dialogVisible: false, // element-ui中用到

      // echarts画图需要用到
      myChart: "",
      option: {},
      // 统计的不同情绪次数
      goodMoods: 0, // 正面情绪出现次数
      middleMoods: 0, // 中性情绪出现次数
      badMoods: 0, // 负面情绪出现次数
      maxMood: "无", // 出现最多次的情绪
    };
  },
  computed: {
    curMonth() {
      return this.targetDate.split(".")[1];
    },
  },
  watch: {
    // 监听targetDate的变化
    targetDate() {
      if (localStorage.getItem(`${this.targetDate}moodDiary`)) {
        const curmoodsAndEmojis =
          JSON.parse(localStorage.getItem(`${this.targetDate}moodDiary`))[3] ||
          [];
        this.curMood = curmoodsAndEmojis.mood;
        this.curDiary = curmoodsAndEmojis.diary;
      } else {
        this.curMood = "";
        this.curDiary = "";
      }
    },
    // 监听这个数据的变化，当它为true的时候,渲染echarts  dialogVisible这个数据就是true出现弹窗，false不出现
    dialogVisible(value) {
      if (value) {
        // console.log(this.targetDate.split(".")[1] - 1); // 可以通过这个获取当前月份，然后渲染就可以和日历月份进行联动，年份也是同理可得
        // 获取数据，从本地得到本月的数据
        // const curYear = new Date().getFullYear();
        const curYear = new Date().getFullYear();
        const curMonth = this.targetDate.split(".")[1] - 1;
        // 每个月对应的天数
        let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // 闰年2月不同天数
        if ((curYear % 4 === 0 && curYear % 100 !== 0) || curYear % 400 === 0) {
          daysInMonth[1] = 29;
        }
        const days = daysInMonth[curMonth];
        let goodMoods = 0; // 正面心情次数
        let middleMoods = 0; // 中性心情次数
        let badMoods = 0; // 负面心情次数
        let maxMoodCount = 0; // 出现心情次数最多的次数
        let maxMood = "无"; // 出现次数最多的心情
        // 使用map来存储数据 心情是键，次数是值
        let map = new Map();
        let moodItems = []; // 用来存放遍历的map
        for (let i = 1; i < days + 1; i++) {
          const targetDate = curYear + "." + (curMonth + 1) + "." + i;
          // console.log(targetDate);
          if (localStorage.getItem(`${targetDate}moodDiary`)) {
            const curMoodDiary = JSON.parse(
              localStorage.getItem(`${targetDate}moodDiary`)
            )[3];
            if (!map.has(curMoodDiary.mood)) {
              map.set(curMoodDiary.mood, 1);
            } else {
              map.set(curMoodDiary.mood, map.get(curMoodDiary.mood) + 1);
            }
            // 得到正面，负面和中性情绪分别的次数
            if (curMoodDiary.type === "正面") {
              goodMoods++;
            } else if (curMoodDiary.type === "中性") {
              middleMoods++;
            } else {
              badMoods++;
            }
          }
        }
        // 如果map为空，说明当月没有数据
        if (!map.size) {
          moodItems = [{ value: 1, name: "本月木有情绪记录啦" }];
        }
        // 将统计的不同面情绪赋值给data
        this.goodMoods = goodMoods;
        this.middleMoods = middleMoods;
        this.badMoods = badMoods;

        // map遍历 item 是数组 第一个值是 key， 第二个值是 value
        for (let item of map) {
          // console.log(item);
          moodItems.push({
            value: item[1],
            name: item[0],
          });
          // 通过这个也可以得到出现最多的心情是什么
          if (maxMoodCount < item[1]) {
            maxMoodCount = item[1];
            maxMood = item[0];
          }
        }
        this.maxMood = maxMood; // 将maxMood赋值给data

        // 老是报获取不到dom的错误，所以用nextTick试试
        this.$nextTick(() => {
          this.myChart && this.myChart.clear(); //每次重新渲染, 清除前面的
          // echarts 画图
          const chartDom = this.$refs.echart;
          let myChart = this.$echarts.init(chartDom);
          let option;
          option = {
            title: {
              text: `2022年${this.curMonth}月心情统计`,
              left: "center",
            },
            tooltip: {
              trigger: "item",
            },
            legend: {
              orient: "vertical",
              left: "left",
            },
            series: [
              {
                name: "my Mood",
                type: "pie",
                radius: "50%",
                // 将数据放入其中
                data: moodItems,
                /* data: [
              { value: 3, name: "开心" },
              { value: 4, name: "惊讶" },
              { value: 1, name: "难过" },
              { value: 3, name: "生气" },
              { value: 2, name: "喜欢" },
              { value: 2, name: "中性" },
            ], */
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          };
          this.myChart = myChart;
          this.option = option;
          option && myChart.setOption(option);
        });
      }
    },
  },
  methods: {
    // 向左
    rightChangeAngle() {
      // 点击向右，所有词语顺时针改变一下角度， 其他都按照180长度改变，
      // 我再想了一下，好像只要改变list就可以了，方便, 逆时针，就是将最后一个放到第一个去
      const first = this.moodsAndEmojis.shift();
      this.moodsAndEmojis.push(first);
      this.changeItemAngle();
      // 接下来改变对应的表情,顺势就变了，这里不用改了直接
    },

    // 向右
    leftChangeAngle() {
      // 相反的向左点击就是顺时针就是将第一个放到最后一个去
      const last = this.moodsAndEmojis.pop();
      this.moodsAndEmojis.unshift(last);
      this.changeItemAngle();
    },

    // 提交，存储
    commitMoodDiary() {
      // 讲内容赋值给this.moodsAndEmojis
      if (this.$refs.diarycon.value) {
        this.moodsAndEmojis[3].diary = this.$refs.diarycon.value;
        // 清空文本框
        this.$refs.diarycon.value = "";
      }
      // 将数据存储到本地
      localStorage.setItem(
        `${this.targetDate}moodDiary`,
        JSON.stringify(this.moodsAndEmojis)
      );
      // 将当天提交的数据展示出来
      this.curMood = this.moodsAndEmojis[3].mood;
      this.curDiary = this.moodsAndEmojis[3].diary;
    },
    // 函数  根据已知角度算出每个元素的具体位置并赋值
    changeItemAngle(options = { angleStart: 170, circle: 180 }) {
      // 关于圆的一些数据
      // 获取圆
      const circle = this.$refs.circle;
      // 圆的的半径
      const circleRadius = circle.clientWidth / 2;
      // 获取要在圆内的节点列表
      const circleItemMoods = this.$refs.itemmoods;
      // 角度转弧度
      const transformToRidians = (degrees) => degrees * (Math.PI / 180);
      // 圆心
      const circlePointX = circleRadius;
      const circlePointY = circleRadius;
      // 划分等份
      const count = circleItemMoods.length;

      // console.log(count);
      // angleStart: 开始的角度， circle: 划分多大的圆
      this.cache = {
        ...options,
      };
      // 划分的角度
      const angle = Math.floor(this.cache.circle / count);

      // 得到每一个节点对应的left 和 top值
      circleItemMoods.forEach((item, index) => {
        // 转为0-360度
        let itemAngle = angle * (index + 1) + (this.cache.angleStart % 360);
        itemAngle = itemAngle > 360 ? itemAngle - 360 : itemAngle;
        // 弧度
        const itemRandians = transformToRidians(itemAngle);
        // 节点宽高
        const { clientWidth, clientHeight } = item;
        let top = circleRadius * Math.sin(itemRandians) + circlePointY;
        let left = circleRadius * Math.cos(itemRandians) + circlePointX;

        // 使上半圆的子节点都在圆外壁
        if (itemAngle == 270) {
          top -= 1.2 * clientHeight;
          left -= clientWidth / 2;
          item.className = "item_mood_msg active";
        } else if (itemAngle >= 180 && itemAngle < 270) {
          top -= clientHeight;
          left -= clientWidth;
        } else if (itemAngle > 270 && itemAngle < 360) {
          top -= clientHeight;
        }
        item.style.top = top + "px";
        item.style.left = left + "px";
        // console.log(itemAngle);
      });
    },
    // 点击画图
    // drawPiePic(e) {
    //   // console.log(this.targetDate.split(".")[1] - 1); // 可以通过这个获取当前月份，然后渲染就可以和日历月份进行联动，年份也是同理可得
    //   // 获取数据，从本地得到本月的数据
    //   // const curYear = new Date().getFullYear();
    //   const curYear = new Date().getFullYear();
    //   const curMonth = this.targetDate.split(".")[1] - 1;
    //   // 每个月对应的天数
    //   let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    //   // 闰年2月不同天数
    //   if ((curYear % 4 === 0 && curYear % 100 !== 0) || curYear % 400 === 0) {
    //     daysInMonth[1] = 29;
    //   }
    //   const days = daysInMonth[curMonth];
    //   let goodMoods = 0; // 正面心情次数
    //   let middleMoods = 0; // 中性心情次数
    //   let badMoods = 0; // 负面心情次数
    //   let maxMoodCount = 0; // 出现心情次数最多的次数
    //   let maxMood = "无"; // 出现次数最多的心情
    //   // 使用map来存储数据 心情是键，次数是值
    //   let map = new Map();
    //   let moodItems = []; // 用来存放遍历的map
    //   for (let i = 1; i < days + 1; i++) {
    //     const targetDate = curYear + "." + (curMonth + 1) + "." + i;
    //     // console.log(targetDate);
    //     if (localStorage.getItem(`${targetDate}moodDiary`)) {
    //       const curMoodDiary = JSON.parse(
    //         localStorage.getItem(`${targetDate}moodDiary`)
    //       )[3];
    //       if (!map.has(curMoodDiary.mood)) {
    //         map.set(curMoodDiary.mood, 1);
    //       } else {
    //         map.set(curMoodDiary.mood, map.get(curMoodDiary.mood) + 1);
    //       }
    //       // 得到正面，负面和中性情绪分别的次数
    //       if (curMoodDiary.type === "正面") {
    //         goodMoods++;
    //       } else if (curMoodDiary.type === "中性") {
    //         middleMoods++;
    //       } else {
    //         badMoods++;
    //       }
    //     }
    //   }
    //   // 如果map为空，说明当月没有数据
    //   if (!map.size) {
    //     moodItems = [{ value: 1, name: "本月木有情绪记录啦" }];
    //   }
    //   // 将统计的不同面情绪赋值给data
    //   this.goodMoods = goodMoods;
    //   this.middleMoods = middleMoods;
    //   this.badMoods = badMoods;

    //   // map遍历 item 是数组 第一个值是 key， 第二个值是 value
    //   for (let item of map) {
    //     // console.log(item);
    //     moodItems.push({
    //       value: item[1],
    //       name: item[0],
    //     });
    //     // 通过这个也可以得到出现最多的心情是什么
    //     if (maxMoodCount < item[1]) {
    //       maxMoodCount = item[1];
    //       maxMood = item[0];
    //     }
    //   }
    //   this.maxMood = maxMood; // 将maxMood赋值给data

    //   // echarts 画图
    //   const chartDom = this.$refs.echart;
    //   let myChart = this.$echarts.init(chartDom);
    //   let option;
    //   option = {
    //     title: {
    //       text: `2022年${this.curMonth}月心情统计`,
    //       left: "center",
    //     },
    //     tooltip: {
    //       trigger: "item",
    //     },
    //     legend: {
    //       orient: "vertical",
    //       left: "left",
    //     },
    //     series: [
    //       {
    //         name: "my Mood",
    //         type: "pie",
    //         radius: "50%",
    //         // 将数据放入其中
    //         data: moodItems,
    //         /* data: [
    //           { value: 3, name: "开心" },
    //           { value: 4, name: "惊讶" },
    //           { value: 1, name: "难过" },
    //           { value: 3, name: "生气" },
    //           { value: 2, name: "喜欢" },
    //           { value: 2, name: "中性" },
    //         ], */
    //         emphasis: {
    //           itemStyle: {
    //             shadowBlur: 10,
    //             shadowOffsetX: 0,
    //             shadowColor: "rgba(0, 0, 0, 0.5)",
    //           },
    //         },
    //       },
    //     ],
    //   };
    //   this.myChart = myChart;
    //   this.option = option;
    //   option && myChart.setOption(option);
    //   // 点击之后点击功能禁用
    //   e.target.disabled = true;
    // },
    // element-ui 复制
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
  },
  // 挂载完毕
  mounted() {
    this.changeItemAngle();
    // 查看今天是否已经提交心情日记，如果已经提交，把它加载出来
    if (localStorage.getItem(`${this.targetDate}moodDiary`)) {
      const curMoodDiary = JSON.parse(
        localStorage.getItem(`${this.targetDate}moodDiary`)
      )[3];
      this.curMood = curMoodDiary.mood;
      this.curDiary = curMoodDiary.diary;
    }

    // 注册自定义事件
    this.$refs.calendar.$on("getTargetDate", (targetDate) => {
      this.targetDate = targetDate;
    });
  },
  // 销毁前
  beforeDestroy() {
    // 销毁自定义时间
    this.$refs.calendar.$on("getTargetDate");
  },
};
</script>

<style scoped lang="less">
#moodManage {
  .mood_and_diary {
    width: 40%;
    padding: 0.625rem;
    border-radius: 0.3125rem;
    transform: translate(5rem, 3.125rem);
    background-color: rgb(250, 227, 217);
    position: relative;
    .mood_quiz {
      text-align: center;
    }
    .mood_emoji {
      text-align: center;
      margin: 2.5rem auto;
    }
    .mood_msg {
      width: 80%;
      height: 18.75rem;
      background-color: #fff;
      position: relative;
      margin: 0 auto;
      overflow: hidden;
      .mork {
        width: 37.5rem;
        height: 37.5rem;
        padding: 0.3125rem;
        background-color: rgb(127, 196, 120);
        border-radius: 50%;
        position: absolute;
        top: 3.125rem;
        // （圆的宽度-父盒子的宽度）/ 2
        left: -(37.5-26) ./ 2rem;
        box-shadow: 0 -0.125rem 1.5625rem rgba(49, 82, 49, 0.46);
        z-index: 1;
        &::before {
          content: "";
          width: 0.1875rem;
          height: 20%;
          background-color: rgb(22, 20, 20);
          position: absolute;
          left: 50%;
          border-radius: 0.1875rem;
          z-index: 2;
        }
        .item_mood_msg_select {
          width: 30%;
          height: 10%;
          padding-top: 0.625rem;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 15%;
          transform: translateX(-50%);
          background-color: rgb(29, 25, 25);
          box-shadow: 0 0 1.25rem 0.125rem rgb(80, 112, 77);
          text-align: center;
          font-size: 1.25rem;
          color: #fff;
          z-index: 3;
        }
        .item_mood_msg {
          width: 3.75rem;
          height: 1.875rem;
          // background-color: rgb(183, 214, 96);
          position: absolute;
          text-align: center;
          z-index: 3;
          // 结构伪类选择器，我想给节点的第3和第5个加旋转  .mork 的 子类 .item_mood_msg
          &:nth-of-type(3){
            transform: rotate(-33deg);
          }
          &:nth-of-type(5){
            transform: rotate(33deg);
          }
        }

        .active {
          font-size: 1.375rem;
          font-weight: bold;
          transform: translateY(-20%);
        }
        .pointer {
          position: absolute;
          z-index: 4;
          top: 15%;
          cursor: pointer;
        }
        .left-pointer {
          left: 17%;
          transform: rotate(180deg);
        }
        .right-pointer {
          left: 66%;
        }
      }
    }
    .diary {
      width: 70%;
      margin: 0.625rem auto;
      textarea {
        padding: 0.3125rem;
        border-radius: 8px;
        background-color: #fff;
        &:focus {
          outline: none;
        }
      }
    }
    button {
      display: block;
      padding: 0.625rem;
      background-color: rgb(31, 76, 117);
      color: rgb(220, 240, 238);
      border: 0;
      border-radius: 0.5rem;
      margin: 0 auto;
    }
    // 当日心情展示
    .showMoodDiary {
      width: 12.5rem;
      height: 12.5rem;
      // background-color: rgb(250, 227, 217);
      border-radius: 0.625rem;
      position: absolute;
      left: 106%;
      top: 23%;
      font-family: "宋体";
      font-size: 1.0625rem;
      font-weight: bold;
      color: rgb(83, 46, 22);
      span {
        line-height: 1.875rem;
      }
    }
  }
  // 心情报告
  .mood_report {
    width: 40%;
    position: absolute;
    top: 45.625rem;
    left: 5rem;
    border-radius: 0.5rem;
    background-color: rgb(250, 227, 217);
    text-align: center;
    .draw-btn {
      padding: 0.4375rem;
      border: 0;
      border-radius: 0.5rem;
      margin-bottom: 1.25rem;
      color: #fff;
      background-color: rgb(253, 138, 186);
    }
    .specify-mood {
      font-size: 1.375rem;
      line-height: 1.875rem;
      span {
        font-weight: bolder;
      }
    }
  }
}
</style>