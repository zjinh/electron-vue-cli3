<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <span class="title">
          vue+electron
        </span>
        <system-information></system-information>
      </div>
      <div class="right-side">
        <div class="doc">
          <div class="title">简介</div>
          <p>
            项目集成了vue cli3、electron。
            <br />electron-updater <br />electron-builder
            <br />electron、ipcRenderer已经挂载至全局
            <br />项目已使用单例运行模式，具体代码在background.js 109行-119行处
          </p>
        </div>
        <div class="doc">
          <div class="title alt">相关文档</div>
          <button class="alt" @click="open('https://electronjs.org/')">
            Electron
          </button>
          <button class="alt" @click="open('https://cn.vuejs.org/v2/guide/')">
            Vue.js
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import SystemInformation from "@/components/home/SystemInformation";

console.log(process.env.HOMEDRIVE + process.env.HOMEPATH);
//这里输出的是NAN,但是在F12中输入 process.env.HOMEDRIVE+process.env.HOMEPATH  又是正确的值
export default {
  name: "landing-page",
  components: { SystemInformation },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "微软雅黑";
}

#wrapper {
  background: #fff;
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
  margin-right: 10px;
}
</style>
