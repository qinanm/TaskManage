<template>
  <div id="music">
    <!-- 版心 -->
    <div class="m_w">
      <!-- 搜索框 -->
      <div class="search">
        <input
          type="text"
          name="search-music"
          placeholder="请输入你要搜索的歌曲"
          @keyup.enter="searchTargetMusic"
        />
      </div>
      <!-- 面包屑，历史记录 -->
      <div class="history">
        <ul>
          <li
            v-for="historySongName in historySongNames"
            :key="historySongName"
            @click="searchTargetMusic"
          >
            {{ historySongName }}
          </li>
        </ul>
        <!-- 清空历史记录 -->
        <button class="clear-history" @click="clearHistoryNames">
          清空历史记录
        </button>
      </div>
      <!-- 展示歌曲页面 -->
      <div class="target-music">
        <!-- 靠，老子自己写，气死我了element-ui -->
        <table cellspacing="0">
          <thead>
            <tr>
              <th>播放</th>
              <th>歌曲</th>
              <th>歌手</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="targetMusic in targetMusics" :key="targetMusic.id">
              <!-- 使用.self使事件只作用在自身，阻止了捕获行为 -->
              <td @click.self="toPlay">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-play"></use>
                </svg>
              </td>
              <td>{{ targetMusic.title }}</td>
              <td>{{ targetMusic.songer }}</td>
              <td>{{ targetMusic.id }}</td>
            </tr>
          </tbody>
        </table>
        <!-- 音乐播放显示 -->
        <div class="show-playing-music">
          <!-- controls表示有控件的 autoplay表示音频出现自动播放 loop循环播放 controls否掉的话直接可以在用户看不到的地方播放，可以-->
          <audio :src="curMusicUrl" autoplay loop ref="music"></audio>
        </div>
      </div>
      <!-- 分页器---后面在写 -->
      <div class="page-devide"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "some-music",
  data() {
    return {
      historySongNames: [], // 历史记录的呈现
      targetMusics: [
        {
          title: "暂无数据",
          songer: "暂无数据",
          id: "暂无数据",
        },
      ], // 页面展现歌曲数据，每个元素都是对象
      curMusicId: 0, // 当前处于播放链接的id
      curSvgDom: "", // 当前改变图标的dom元素
      curMusicUrl: "", // 当前音乐地址
    };
  },
  mounted() {
    // 将历史记录存储到本地
    // 如果获取不到就创建一个空数组
    if (!localStorage.getItem("historySongNames")) {
      localStorage.setItem("historySongNames", JSON.stringify([]));
    } else {
      // 如果获取得到，将它渲染到页面上
      this.historySongNames = JSON.parse(
        localStorage.getItem("historySongNames")
      );
    }
  },
  watch: {
    // 监听历史记录的变化，用于刷新本地存储
    historySongNames(value) {
      localStorage.setItem("historySongNames", JSON.stringify(value));
    },
  },
  methods: {
    // 发送请求获取 targetMusics 数据
    searchTargetMusic(e) {
      // 通过搜索框访问 为e.target.value 通过历史记录访问 为e.target.innerText
      const songName = e.target.value ? e.target.value : e.target.innerText;
      axios
        .get(`http://localhost:3000/search?keywords=${songName}`)
        .then((response) => {
          // response.data.result.songs
          let resSongList = [];
          for (let song of response.data.result.songs) {
            // 将每首歌的关键信息封装为一个对象，逐个放进数组里
            const resSong = {
              title: song.name,
              songer: song.artists[0].name,
              id: song.id,
            };
            resSongList.push(resSong);
          }
          // 将数据传给data,在页面中渲染出来
          this.targetMusics = resSongList; // 注意axios里的this指向不是组件实例，可以在一开始将this赋值给that，再用that操作,或者将回调函数改为箭头函数即可
        })
        .catch((error) => {
          console.log(error);
        });
      // 存入历史记录中  如果历史记录不含有这个记录， 添加记录
      if (this.historySongNames.indexOf(songName) === -1) {
        this.historySongNames.unshift(songName);
      } else {
        // 如果历史记录里含有这个记录, 删掉这个记录，重新添加
        this.historySongNames = this.historySongNames.filter(
          (historysongName) => historysongName !== songName
        );
        this.historySongNames.unshift(songName);
      }
      e.target.value && (e.target.value = ""); // 清空搜索框(如果是通过搜索框访问的而不是通过历史记录访问)
    },
    // 清空历史记录
    clearHistoryNames() {
      this.historySongNames = [];
    },
    // 发送请求播放音乐
    toPlay(e) {
      // 获取自身的图标元素
      const svg = e.target.children[0];
      const id = e.target.parentNode.children[3].innerText; // 获取发送请求需要的id
      // 判断当前音乐是否播放中，那就要请求获取数据进行播放 icon-play 是未播放， icon-pause是播放中
      if (svg.children[0].getAttribute("xlink:href") === "#icon-play") {
        svg.children[0].setAttribute("xlink:href", "#icon-pause"); // 修改图标 -- 播放中
        // 在发送请求前判断一下是否是重复的id，重复的id不再重新发送请求，只要播放就可以了
        if (this.curMusicId !== id) {
          axios
            .get(`http://localhost:3000/song/url?id=${id}`)
            .then((response) => {
              console.log(response.data.data[0].url);
              this.curMusicUrl = response.data.data[0].url; // 获取url给到data
              // 注意要开是music节点没有src，所以需要等这个src放进去之后才能play，使用nextTick
              this.$nextTick(() => {
                this.$refs.music.play(); // 通过音乐节点控制音乐播放
              });
              // 如果前面存在svg的话，说明有上一首，需要将其对应的播放图标改为未播放  --- 这样的话 暂停的时候 就不需要判断id了
              this.curSvgDom &&
                this.curSvgDom.children[0].setAttribute(
                  "xlink:href",
                  "#icon-play"
                );
              // 将当前svg 赋值给 curSvgDom
              this.curSvgDom = svg;
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.$refs.music.play(); // 通过音乐节点控制音乐播放
        }
      } else {
        svg.children[0].setAttribute("xlink:href", "#icon-play"); // 修改图标 -- 未播放
        // 暂停音乐的播放 -- 只用当前id匹配的时候，才去暂停当前音乐的播放，但是我在下一首播放的时候就改变了播放的图标，所以这里不用匹配id了
        this.$refs.music.pause(); // 通过音乐节点控制音乐播放
      }
    },
  },
};
</script>

<style scoped lang="less">
#music {
    padding-top: 3.125rem;
  // 版心
  .m_w {
    width: 70%;
    margin: 0 auto;
    // background-color: #fff;
    // 搜索框
    .search {
      width: 80%;
      margin: 0 auto;
      padding: 0.9375rem 0;
      input {
        width: 100%;
        height: 1.875rem;
        padding: 0.3125rem;
        border: 0.0625rem solid rgb(49, 39, 100);
        border-radius: 0.5rem;
      }
    }
    // 搜索历史 面包屑
    .history {
      width: 80%;
      margin: 0 auto;
      position: relative;
      padding-bottom: 1.25rem;
      ul {
        display: flex;
        flex-wrap: wrap; // 可换行
        li {
          border: 0.0625rem solid #000;
          border-radius: 0.375rem;
          margin: 0 0.8125rem 0.3125rem 0; //上右下左
          font-size: 0.875rem;
          padding: 0.1875rem;
          cursor: pointer;
        }
      }
      // 清空历史记录
      .clear-history {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    .target-music {
      width: 80%;
      height: 34.375rem;
      background-color: rgb(138, 198, 209);
      margin: 1.875rem auto;
      border-radius: 0.625rem;
      overflow: hidden;
      table {
        width: 100%;
        font-size: 0.875rem;
        thead {
          height: 2.5rem;
          text-align: left;
          color: rgb(83, 84, 85);
          font-size: 0.9375rem;
          th {
            &:nth-child(1) {
              width: 5rem;
            }
          }
        }
        tbody {
          text-align: left;
          tr {
            color: rgb(83, 84, 85);
            // display: flex;
            svg {
              width: 1.125rem;
              height: 2.1875rem;
            }
            //设置隔行变色 奇数行变灰色背景
            &:nth-of-type(odd) {
              background-color: rgb(250, 227, 217);
            }
          }
        }
        .playing {
          cursor: pointer;
        }
      }
    }
  }
}
</style>