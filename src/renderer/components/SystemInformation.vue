<template>
  <ul class="items">
    <li><span class="name">路由地址:</span><span class="value">{{ route.path }}</span></li>
    <li><span class="name">路由名称:</span><span class="value">{{ route.name }}</span></li>
    <li><span class="name">应用版本:</span><span class="value">{{ info?.appVersion ?? '读取中…' }}</span></li>
    <li><span class="name">Vue.js:</span><span class="value">{{ vueVersion }}</span></li>
    <li><span class="name">Electron:</span><span class="value">{{ info?.electronVersion ?? '读取中…' }}</span></li>
    <li><span class="name">Node:</span><span class="value">{{ info?.nodeVersion ?? '读取中…' }}</span></li>
    <li><span class="name">系统类型:</span><span class="value">{{ info?.platform ?? '读取中…' }}</span></li>
    <li v-if="error" class="error">{{ error }}</li>
  </ul>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { version as vueVersion } from 'vue'
import type { SystemInfo } from '../../shared/electron-api'
const route = useRoute()
const info = ref<SystemInfo>()
const error = ref('')
onMounted(async () => {
  try {
    info.value = await window.electronAPI.getSystemInfo()
  } catch {
    error.value = '系统信息读取失败'
  }
})
</script>
<style scoped lang="scss">
li {
  list-style: decimal-leading-zero;
  font-size: 16px;
  margin: 5px 0;
  .name {
    color: #6a6a6a;
    margin-right: 6px;
  }
  .value {
    color: #000;
    font-weight: bold;
  }
}
.error {
  color: #c00;
}
</style>
