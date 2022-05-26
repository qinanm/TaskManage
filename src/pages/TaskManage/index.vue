<template>
  <div id="task-manager">
    <div class="task-sec">
      <div class="header task_w">
        <!-- 直接enter键添加 不用发送图标了 -->
        <input
          type="text"
          placeholder="请输入你的任务"
          @keyup.enter="addTask"
          v-model="taskCon"
        />
      </div>
      <ul class="task-list task_w">
        <li v-for="task in taskList" :key="task.id">
          <input
            type="checkbox"
            name="task"
            :id="task.id"
            :checked="task.isdone"
            @change="updateTaskDone(task.id)"
          />
          <label :for="task.id">
            <span
              v-show="!task.isEdit"
              @dblclick="updateTaskCon(task.id)"
              ref="spanContent"
              >{{ task.content }}</span
            >
          </label>
          <input
            class="edit-input"
            type="text"
            v-show="task.isEdit"
            @keyup.enter="editTaskCon($event, task.id)"
            @blur="editTaskCon($event, task.id)"
            ref="editInput"
          />
          <button @click="deleteTask(task.id)">删除</button>
          <button @click="updateTaskCon(task.id)">修改</button>
        </li>
      </ul>
      <div class="footer task_w">
        <div class="selectAll">
          <input
            type="checkbox"
            name="optionAll"
            id="optionAll"
            v-model="updateAllToDoneJudge"
          />
          <label for="optionAll">
            <span>全选</span>
          </label>
        </div>
        <button @click="deleteAllDone">清除已完成任务</button>
      </div>
    </div>
    <!-- 使用全局组件 日历 -->
    <!-- 组件间的传递，自定义事件 -->
    <MyCalendar ref="calendar"></MyCalendar>
    <MyClock></MyClock>
  </div>
</template>

<script>
import { nanoid } from "nanoid";
export default {
  name: "task-manage",
  // 数据
  data() {
    return {
      taskCon: "",
      taskList: [], // 任务数组
      // 当前日期
      targetDate:
        new Date().getFullYear() +
        "." +
        (new Date().getMonth() + 1) +
        "." +
        new Date().getDate(),
    };
  },
  // 方法
  methods: {
    // 添加任务
    addTask() {
      // 输入数据非空，将用户的输入包装成一个对象
      if (this.taskCon.trim()) {
        const task = {
          id: nanoid(),
          content: this.taskCon,
          // 是否完成
          isdone: false,
          // 是否处于编辑状态
          isEdit: false,
          // 获取当前日期
        };
        this.taskList.unshift(task);
        this.taskCon = "";
      }
    },

    // 通过id 修改任务 --- 改变isEdit得到编辑状态
    updateTaskCon(id) {
      this.taskList.forEach((task) => {
        if (task.id === id) {
          task.isEdit = true;
          return;
        }
      });
      // 获取输入框焦点   ----$nextTick 在下一次DOM更新结束后执行指定的回调
      this.$nextTick(() => {
        console.log(this.$refs.editInput[0]); // 注意this.$refs.editInput是一个数组
        // this.$refs.editInput[0].focus(); // 好家伙这个只有第一个有效果，那就只能
        this.$refs.editInput.forEach((editIn) => {
          editIn.focus();
        }); // 给全部input都加聚焦
      });
    },

    // 通过id 修改的编辑的内容 --- 改变taskCon 将isEdit改回false
    editTaskCon(e, id) {
      this.taskList.forEach((task) => {
        if (task.id === id) {
          if (e.target.value.trim()) {
            task.content = e.target.value.trim();
            task.isEdit = false;
            e.target.value = "";
          } else {
            task.isEdit = false;
          }
          return;
        }
      });
    },

    // 更新task.done状态
    updateTaskDone(id) {
      this.taskList.forEach((task) => {
        if (task.id === id) {
          // console.log(task.isdone);
          task.isdone = !task.isdone;
          // console.log(task.isdone);
          return;
        }
      });
    },

    // 通过id 删除任务
    deleteTask(id) {
      this.taskList = this.taskList.filter((task) => task.id !== id);
    },
    // 删除全部已完成任务
    deleteAllDone() {
      this.taskList = this.taskList.filter((task) => task.isdone === false);
    },
  },

  // 挂载完毕
  mounted() {
    // 防止localStorage.getItem("taskList")还未被定义，为空，所以要传入空的数组，使类型为数组
    if (!localStorage.getItem(`taskList${this.targetDate}`)) {
      localStorage.setItem(
        `taskList${this.targetDate}`,
        JSON.stringify(this.taskList)
      );
    }
    this.taskList = JSON.parse(
      localStorage.getItem(`taskList${this.targetDate}`)
    );

    // 绑定自定义事件
    this.$refs.calendar.$on("getTargetDate", (targetDate) => {
      this.targetDate = targetDate;
    });
  },

  // 销毁前
  beforeDestroy() {
    //解绑自定义事件
    this.$refs.calendar.$off("getTargetDate");
  },

  // 更新完毕  ---- 以使用深度监视taskList代替
  // updated() {
  //   localStorage.setItem("taskList", JSON.stringify(this.taskList));
  // },

  // 开启深度监视
  watch: {
    taskList: {
      deep: true,
      handler(value) {
        localStorage.setItem(
          `taskList${this.targetDate}`,
          JSON.stringify(value)
        );
      },
    },
    // 监听targetDate的变化，发生改变，重新获取taskLisk(然后就可以自动重新渲染任务列表了)
    targetDate() {
      this.taskList = JSON.parse(localStorage.getItem(`taskList${this.targetDate}`)) || [];
    },
  },
  // 计算属性
  computed: {
    // 值决定是否全选 --- 使用v-model可以得到和改变输入框checked的值
    updateAllToDoneJudge: {
      get() {
        for (let i = 0; i < this.taskList.length; i++) {
          const task = this.taskList[i];
          // 但凡有一个未完成
          if (task.isdone === false) {
            return false;
          }
        }
        // 全部已完成
        return true;
      },
      set(value) {
        this.taskList.forEach((task) => {
          // console.log(value);
          task.isdone = value;
        });
      },
    },
  },
};
</script>

<style scoped lang="less">
#task-manager {
  .task-sec {
    width: 40%;
    padding: 0.625rem;
    border-radius: 0.3125rem;
    transform: translate(5rem, 3.125rem);
    background-color: rgb(250, 227, 217);
    .task_w {
      width: 85%;
      margin: 0 auto;
    }
    .header {
      margin-top: 0.625rem;
      input {
        width: 100%;
        height: 2.0625rem;
        padding-left: 0.5rem;
        border: 0.0625rem solid rgb(202, 199, 199);
        border-radius: 0.3125rem;
        font-size: 1rem;
      }
    }
    .task-list {
      border: 0.0625rem solid rgb(202, 199, 199);
      border-radius: 0.3125rem;
      margin: 0.9375rem auto;
      background-color: #fff;
      li {
        width: 100%;
        border-bottom: 0.0625rem solid rgb(202, 199, 199);
        padding: 0.5rem;
        input {
          border: 0.0625rem solid #000;
          border-radius: 0.0625rem;
        }
        span {
          margin-left: 0.5rem;
        }
        .edit-input {
          width: 70%;
          border: 0.0625rem solid rgb(202, 199, 199);
          border-radius: 0.125rem;
          margin-left: 0.5rem;
        }
        &:hover {
          button {
            display: block;
          }
        }
        button {
          display: none;
          float: right;
          padding: 0.1875rem 0.5rem 0.1875rem;
          border: 0.0625rem solid rgb(202, 199, 199);
          border-radius: 0.3125rem;
          background-color: rgb(248, 91, 80);
          color: rgb(241, 240, 239);
        }
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      padding: 0 0.5rem;
      .selectAll {
        span {
          margin-left: 0.5rem;
        }
      }
      button {
        padding: 0.1875rem 0.5rem 0.1875rem;
        border: 0.0625rem solid rgb(202, 199, 199);
        border-radius: 0.3125rem;
        background-color: rgb(248, 91, 80);
        color: rgb(241, 240, 239);
      }
    }
  }
}
</style>