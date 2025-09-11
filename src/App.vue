<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { onMounted } from 'vue'

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
  <RouterView />
</template>

<style></style>
