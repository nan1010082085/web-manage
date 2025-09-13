<template>
  <div class="layout-container" :class="{ 'mobile-layout': isMobile }">
    <!-- 侧边栏 - 固定定位 -->
    <div
      class="sider-container"
      :class="{
        collapsed: collapsed,
        'mobile-show': showMobileSider,
      }"
    >
      <div class="logo-container">
        <img v-if="!collapsed" src="../assets/logo.svg" alt="Logo" class="logo-img" />
        <span class="logo-text">{{ collapsed ? 'WS' : appTitle }}</span>
      </div>

      <div class="menu-container">
        <SideMenu />
      </div>
    </div>

    <!-- 主体内容区域 -->
    <div class="main-container" :class="{ collapsed: collapsed }">
      <!-- 头部 - 固定定位 -->
      <div class="header-container">
        <TopHeader :collapsed="collapsed" :is-mobile="isMobile" />
      </div>

      <!-- 内容区域 - 独立滚动 -->
      <div class="content-container">
        <router-view v-slot="{ Component, route }">
          <transition name="page-transition" mode="out-in">
            <keep-alive :include="keepAliveComponents">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </div>

      <!-- 底部 - 固定在内容区域底部 -->
      <div class="footer-container">
        <div class="footer-content">
          <span>© {{ currentYear }} {{ appTitle }}. All rights reserved.</span>
        </div>
      </div>
    </div>

    <!-- 快捷操作栏 -->
    <QuickActions v-if="showQuickActions" />

    <!-- 操作状态栏 -->
    <StatusBar v-if="showStatusBar" />

    <!-- 移动端遮罩 -->
    <div v-if="isMobile && showMobileSider" class="mobile-mask" @click="closeMobileSider"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import SideMenu from '@/components/common/SideMenu.vue'
import TopHeader from '@/components/common/TopHeader.vue'
import QuickActions from '@/components/common/QuickActions.vue'
import StatusBar from '@/components/common/StatusBar.vue'

/**
 * 基础布局组件
 */
const appStore = useAppStore()
const route = useRoute()

// 响应式数据
const appTitle = import.meta.env.VITE_APP_TITLE || 'Web中台管理系统'
const currentYear = new Date().getFullYear()
const showMobileSider = ref(false)
const keepAliveComponents = ref(['Dashboard', 'UserList', 'ProductList'])

// 计算属性
const collapsed = computed({
  get: () => appStore.collapsed,
  set: (value: boolean) => appStore.setCollapsed(value),
})

const isMobile = computed(() => appStore.device === 'mobile')

const showQuickActions = computed(() => {
  return !isMobile.value && appStore.themeConfig.showQuickActions
})

const showStatusBar = computed(() => {
  return appStore.themeConfig.showStatusBar
})

/**
 * 处理窗口大小变化
 */
const handleResize = (): void => {
  const width = window.innerWidth
  const device = width < 768 ? 'mobile' : 'desktop'
  appStore.setDevice(device)

  // 移动端自动收起侧边栏
  if (width < 768) {
    appStore.setCollapsed(true)
    showMobileSider.value = false
  }
}

/**
 * 关闭移动端侧边栏
 */
const closeMobileSider = (): void => {
  showMobileSider.value = false
}

/**
 * 组件挂载时的操作
 */
onMounted(() => {
  // 初始化应用配置
  appStore.initAppConfig()

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  handleResize()
})

/**
 * 组件卸载时的清理操作
 */
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="less">
.layout-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  &.mobile-layout {
    .sider-container {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 1001;
      transform: translateX(-100%);
      transition: transform 0.3s ease;

      &.mobile-show {
        transform: translateX(0);
      }
    }
  }
}

/* 侧边栏容器 - 固定定位 */
.sider-container {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: #001529;
  z-index: 100;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &.collapsed {
    width: 80px;
  }
}

/* Logo容器 */
.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  .logo-img {
    height: 32px;
    width: auto;
    margin-right: 8px;
  }

  .logo-text {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    transition: all 0.3s;
  }
}

/* 菜单容器 - 可滚动 */
.menu-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
}

/* 主体容器 */
.main-container {
  margin-left: 240px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &.collapsed {
    margin-left: 80px;
  }
}

/* 头部容器 - 固定定位 */
.header-container {
  position: relative;
  z-index: 99;
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 内容容器 - 独立滚动 */
.content-container {
  margin-top: 64px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f0f2f5;
  padding: 0;

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    &:hover {
      background: #a8a8a8;
    }
  }
}

/* 底部容器 */
.footer-container {
  flex-shrink: 0;
  background: #f0f2f5;
  border-top: 1px solid #e8e8e8;

  .footer-content {
    text-align: center;
    color: #999;
    padding: 16px 24px;
    font-size: 14px;
  }
}

/* 页面切换动画 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 移动端遮罩 */
.mobile-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-container {
    margin-left: 0 !important;
  }

  .content-wrapper {
    padding: 16px;

    &.card-layout {
      flex-direction: column;
      gap: 16px;

      > * {
        flex: 1;
        min-width: auto;
      }
    }

    &.list-detail-layout {
      flex-direction: column;
      gap: 16px;
    }
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .content-wrapper {
    &.card-layout {
      > * {
        flex: 1 1 280px;
        min-width: 280px;
      }
    }
  }
}

/* 确保在小屏幕下内容不会被遮挡 */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 16px;
  }
}

/* 平滑滚动 */
.content-container,
.menu-container {
  scroll-behavior: smooth;
}

/* 防止内容溢出 */
.content-wrapper > * {
  max-width: 100%;
  word-wrap: break-word;
}
</style>
