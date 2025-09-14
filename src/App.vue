<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { onMounted } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

/**
 * 应用根组件
 */
const userStore = useUserStore()
const appStore = useAppStore()

/**
 * 初始化应用
 */
const initApp = (): void => {
  // 初始化用户信息
  userStore.initUserInfo()
  // 初始化应用配置
  appStore.initAppConfig()
}

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  initApp()
})
</script>

<template>
  <a-config-provider :locale="zhCN">
    <RouterView />
  </a-config-provider>
</template>

<style>
.ant-select,
.ant-input,
.ant-input-number {
  width: 100%;
}
</style>
