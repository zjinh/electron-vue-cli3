<template>
  <main>
    <div class="logo">
      <img src="../assets/logo.png" @click="open('https://cn.vuejs.org/guide/')" draggable="false" alt="Vue logo" /><span>+</span
      ><img class="electron" src="../assets/electron.png" @click="open('https://electronjs.org/')" draggable="false" alt="Electron logo" />
    </div>
    <div class="content">
      <section class="left-side">
        <h4>项目说明</h4>
        <ul>
          <li>Vue 3 + TypeScript + Vite</li>
          <li>安全的 <span class="key">main / preload / renderer</span> 边界</li>
          <li>默认启用 <span class="key">单实例模式</span></li>
          <li>通过 typed bridge 使用 <span class="key">IPC</span></li>
          <li>集成 <span class="key">electron-updater</span></li>
        </ul>
      </section>
      <section class="left-side">
        <h4>基本信息</h4>
        <SystemInformation />
      </section>
      <section class="left-side">
        <h4>简单示例</h4>
        <button @click="sendMessage">点我弹出通知</button
        ><button @click="checkUpdate" :disabled="loading || (percent > 0 && percent < 100)">{{ buttonText }}</button><span>{{ message }}</span>
      </section>
      <section class="left-side">
        <h4>相关文档</h4>
        <button class="alt" @click="open('https://electronjs.org/')">Electron</button
        ><button class="alt" @click="open('https://cn.vuejs.org/guide/')">Vue.js</button>
      </section>
    </div>
  </main>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import SystemInformation from '../components/SystemInformation.vue'
import type { UpdateEvent } from '../../shared/electron-api'
const message = ref('')
const loading = ref(false)
const percent = ref(0)
const canInstall = ref(false)
const buttonText = computed(() => (canInstall.value ? '安装' : loading.value ? '正在检查' : '使用 IPC 检查更新'))
let stopListening: (() => void) | undefined
function open(url: string) {
  void window.electronAPI.openExternal(url)
}
async function sendMessage() {
  await window.electronAPI.notify({ title: '这是消息标题', body: '这是一个示例信息' })
}
async function checkUpdate() {
  if (canInstall.value) {
    await window.electronAPI.updater.install()
    return
  }
  loading.value = true
  percent.value = 0
  await window.electronAPI.updater.check('https://github.com/zjinh/electron-vue-cli3')
}
function handleUpdate(event: UpdateEvent) {
  if (event.type === 'checking') {
    message.value = '正在检查更新……'
    loading.value = true
  }
  if (event.type === 'available') message.value = '检测到新版本，正在下载……'
  if (event.type === 'not-available') {
    message.value = '现在使用的就是最新版本，不用更新'
    loading.value = false
  }
  if (event.type === 'progress') {
    percent.value = Math.round(event.progress.percent)
    message.value = '下载进度 ' + percent.value + '%'
    loading.value = percent.value < 100
  }
  if (event.type === 'downloaded') {
    message.value = '最新版本已下载，点击安装进行更新'
    canInstall.value = true
    loading.value = false
    percent.value = 100
  }
  if (event.type === 'error') {
    message.value = event.message
    loading.value = false
  }
}
onMounted(() => {
  stopListening = window.electronAPI.updater.onEvent(handleUpdate)
})
onUnmounted(() => stopListening?.())
</script>
<style scoped lang="scss">
main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  .logo {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-weight: bold;
      font-size: 30px;
      margin: 0 30px;
    }
    img {
      width: 100px;
      cursor: pointer;
      &.electron {
        border-radius: 100%;
      }
    }
  }
  .content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    .left-side {
      margin-top: 30px;
      margin-left: 30px;
      h4 {
        margin-bottom: 10px;
      }
      ul {
        padding-left: 30px;
        li {
          list-style: decimal-leading-zero;
          font-size: 16px;
          margin: 5px 0;
          .key {
            color: #42b983;
            font-weight: bold;
            margin: 0 5px;
          }
        }
      }
    }
    button {
      font-size: 12px;
      padding: 5px 10px;
      border-radius: 30px;
      display: inline-block;
      color: #fff;
      background-color: #4fc08d;
      transition: all 0.15s ease;
      box-sizing: border-box;
      border: 1px solid #4fc08d;
      margin-right: 10px;
      margin-bottom: 10px;
      &.alt {
        color: #42b983;
        background-color: transparent;
      }
    }
  }
}
</style>
