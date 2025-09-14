<template>
  <a-layout-header class="top-header">
    <div class="header-content">
      <!-- 左侧区域 -->
      <div class="header-left">
        <!-- 折叠按钮 -->
        <a-button
          type="text"
          :icon="collapsed ? h(MenuUnfoldOutlined) : h(MenuFoldOutlined)"
          @click="toggleCollapsed"
          class="trigger-btn"
        />

        <!-- 面包屑导航 -->
        <a-breadcrumb class="breadcrumb">
          <a-breadcrumb-item v-for="item in breadcrumbList" :key="item.title">
            <router-link v-if="item.path" :to="item.path">
              {{ item.title }}
            </router-link>
            <span v-else>{{ item.title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>

      <!-- 中间区域 - 全局搜索 -->
      <div class="header-center">
        <div class="search-container">
          <a-auto-complete
            v-model:value="searchValue"
            :options="searchOptions"
            placeholder="搜索功能、数据、文档..."
            class="global-search"
            @search="handleSearch"
            @select="handleSearchSelect"
          >
            <template #prefix>
              <SearchOutlined class="search-icon" />
            </template>
          </a-auto-complete>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="header-right">
        <!-- 帮助入口 -->
        <a-dropdown>
          <a-tooltip title="帮助中心">
            <a-button type="text" class="action-btn">
              <QuestionCircleOutlined />
            </a-button>
          </a-tooltip>
          <template #overlay>
            <a-menu>
              <a-menu-item key="docs" @click="openDocs">
                <FileTextOutlined class="mr-2" />
                使用文档
              </a-menu-item>
              <a-menu-item key="support" @click="openSupport">
                <CustomerServiceOutlined class="mr-2" />
                在线客服
              </a-menu-item>
              <a-menu-item key="feedback" @click="openFeedback">
                <MessageOutlined class="mr-2" />
                意见反馈
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <!-- 全局通知 -->
        <a-dropdown>
          <a-badge :count="notificationCount" :offset="[10, 0]">
            <a-tooltip title="消息通知">
              <a-button type="text" class="action-btn">
                <BellOutlined />
              </a-button>
            </a-tooltip>
          </a-badge>
          <template #overlay>
            <div class="notification-panel">
              <div class="notification-header">
                <a-tabs v-model:activeKey="notificationTab">
                  <a-tab-pane key="message" tab="消息">
                    <div class="notification-list">
                      <div
                        v-for="item in messageList"
                        :key="item.id"
                        class="notification-item"
                        @click="handleNotificationClick(item)"
                      >
                        <div class="notification-content">
                          <div class="notification-title">{{ item.title }}</div>
                          <div class="notification-desc">{{ item.description }}</div>
                          <div class="notification-time">{{ formatTime(item.time) }}</div>
                        </div>
                        <div v-if="!item.read" class="notification-dot"></div>
                      </div>
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="todo" tab="待办">
                    <div class="notification-list">
                      <div
                        v-for="item in todoList"
                        :key="item.id"
                        class="notification-item"
                        @click="handleTodoClick(item)"
                      >
                        <div class="notification-content">
                          <div class="notification-title">{{ item.title }}</div>
                          <div class="notification-desc">{{ item.description }}</div>
                          <div class="notification-time">{{ formatTime(item.deadline) }}</div>
                        </div>
                        <a-tag :color="getPriorityColor(item.priority)" size="small">
                          {{ item.priority }}
                        </a-tag>
                      </div>
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </div>
              <div class="notification-footer">
                <a-button type="link" size="small" @click="viewAllNotifications">
                  查看全部
                </a-button>
                <a-button type="link" size="small" @click="markAllAsRead"> 全部已读 </a-button>
              </div>
            </div>
          </template>
        </a-dropdown>

        <!-- 全屏切换 -->
        <a-tooltip title="全屏">
          <a-button
            type="text"
            :icon="h(FullscreenOutlined)"
            @click="toggleFullscreen"
            class="action-btn"
          />
        </a-tooltip>

        <!-- 主题切换 -->
        <a-tooltip title="主题切换">
          <a-button
            type="text"
            :icon="themeConfig.theme === 'light' ? h(BulbOutlined) : h(StarOutlined)"
            @click="toggleTheme"
            class="action-btn"
          />
        </a-tooltip>

        <!-- 用户中心 -->
        <a-dropdown>
          <div class="user-info">
            <a-avatar :src="userInfo?.avatar" :size="32" class="user-avatar">
              {{ userInfo?.username?.charAt(0)?.toUpperCase() }}
            </a-avatar>
            <div class="user-details">
              <div class="user-name">{{ userInfo?.username }}</div>
              <div class="user-role">{{ userInfo?.role }}</div>
            </div>
            <DownOutlined class="user-arrow" />
          </div>

          <template #overlay>
            <a-menu class="user-menu">
              <a-menu-item key="profile" @click="goToProfile">
                <UserOutlined class="mr-2" />
                个人资料
              </a-menu-item>
              <a-menu-item key="settings" @click="goToSettings">
                <SettingOutlined class="mr-2" />
                账户设置
              </a-menu-item>
              <a-menu-item key="switch" @click="switchAccount">
                <SwapOutlined class="mr-2" />
                切换账号
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="handleLogout">
                <LogoutOutlined class="mr-2" />
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { h, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  BellOutlined,
  FullscreenOutlined,
  BulbOutlined,
  StarOutlined,
  UserOutlined,
  SettingOutlined,
  SwapOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons-vue'
import { useFullscreen } from '@vueuse/core'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { createDebouncedFn } from '@/utils/common'

/**
 * 组件Props定义
 */
interface Props {
  /** 侧边栏是否折叠 */
  collapsed?: boolean
  /** 是否为移动端 */
  isMobile?: boolean
}

/**
 * 顶部导航栏组件
 */
interface SearchOption {
  value: string
  label: string
  type: 'function' | 'data' | 'document'
  path?: string
}

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'message' | 'system' | 'warning'
}

interface TodoItem {
  id: string
  title: string
  description: string
  deadline: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'processing' | 'completed'
}

// 定义Props
const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  isMobile: false,
})

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

// 响应式数据
const { toggle: toggleFullscreen } = useFullscreen()
const searchValue = ref('')
const searchOptions = ref<SearchOption[]>([])
const notificationTab = ref('message')
const messageList = ref<NotificationItem[]>([])
const todoList = ref<TodoItem[]>([])

// 计算属性
const collapsed = computed(() => props.collapsed || appStore.collapsed)
const themeConfig = computed(() => appStore.themeConfig)
const breadcrumbList = computed(() => appStore.breadcrumbList)
const userInfo = computed(() => userStore.userInfo)
const notificationCount = computed(() => {
  const unreadMessages = messageList.value.filter((item) => !item.read).length
  const pendingTodos = todoList.value.filter((item) => item.status === 'pending').length
  return unreadMessages + pendingTodos
})

/**
 * 动态计算头部左边距
 */
const headerLeftOffset = computed(() => {
  if (props.isMobile) {
    return '0px'
  }
  return collapsed.value ? '80px' : '240px'
})

/**
 * 切换菜单折叠状态
 */
const toggleCollapsed = (): void => {
  appStore.toggleCollapsed()
}

/**
 * 切换主题
 */
const toggleTheme = (): void => {
  const newTheme = themeConfig.value.theme === 'light' ? 'dark' : 'light'
  appStore.updateThemeConfig({ theme: newTheme })
}

/**
 * 处理搜索
 */
const handleSearch = createDebouncedFn((value: unknown) => {
  const searchValue = String(value || '')
  if (!searchValue.trim()) {
    searchOptions.value = []
    return
  }

  // 模拟搜索结果
  const mockOptions: SearchOption[] = [
    { value: '用户管理', label: '用户管理', type: 'function', path: '/system/user' },
    { value: '订单列表', label: '订单列表', type: 'function', path: '/order/list' },
    { value: '商品管理', label: '商品管理', type: 'function', path: '/product/list' },
    { value: '销售数据', label: '销售数据', type: 'data', path: '/statistics/sales' },
    { value: '用户手册', label: '用户手册', type: 'document' },
    { value: 'API文档', label: 'API文档', type: 'document' },
  ]

  searchOptions.value = mockOptions.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()),
  )
}, 300)

/**
 * 处理搜索选择
 */
const handleSearchSelect = (value: string, option: SearchOption): void => {
  if (option.path) {
    router.push(option.path)
  } else {
    message.info(`打开${option.label}`)
  }
  searchValue.value = ''
}

/**
 * 打开文档
 */
const openDocs = (): void => {
  window.open('/docs', '_blank')
}

/**
 * 打开客服
 */
const openSupport = (): void => {
  message.info('正在连接客服...')
}

/**
 * 打开反馈
 */
const openFeedback = (): void => {
  router.push('/feedback')
}

/**
 * 处理通知点击
 */
const handleNotificationClick = (item: NotificationItem): void => {
  item.read = true
  message.info(`查看消息：${item.title}`)
}

/**
 * 处理待办点击
 */
const handleTodoClick = (item: TodoItem): void => {
  message.info(`处理待办：${item.title}`)
}

/**
 * 查看全部通知
 */
const viewAllNotifications = (): void => {
  router.push('/notifications')
}

/**
 * 标记全部已读
 */
const markAllAsRead = (): void => {
  messageList.value.forEach((item) => (item.read = true))
  message.success('已标记全部消息为已读')
}

/**
 * 格式化时间
 */
const formatTime = (time: string): string => {
  const now = new Date()
  const target = new Date(time)
  const diff = now.getTime() - target.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return `${days}天前`
  }
}

/**
 * 获取优先级颜色
 */
const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    high: 'red',
    medium: 'orange',
    low: 'blue',
  }
  return colorMap[priority] || 'default'
}

/**
 * 跳转到个人资料页面
 */
const goToProfile = (): void => {
  router.push('/user/profile')
}

/**
 * 跳转到系统设置页面
 */
const goToSettings = (): void => {
  router.push('/system/settings')
}

/**
 * 切换账号
 */
const switchAccount = (): void => {
  message.info('切换账号功能开发中...')
}

/**
 * 处理用户登出
 */
const handleLogout = (): void => {
  userStore.logout()
}

/**
 * 初始化通知数据
 */
const initNotifications = (): void => {
  // 模拟消息数据
  messageList.value = [
    {
      id: '1',
      title: '系统升级通知',
      description: '系统将于今晚22:00-24:00进行升级维护',
      time: '2024-01-15 14:30:00',
      read: false,
      type: 'system',
    },
    {
      id: '2',
      title: '新订单提醒',
      description: '您有3个新订单待处理',
      time: '2024-01-15 13:45:00',
      read: false,
      type: 'message',
    },
    {
      id: '3',
      title: '库存预警',
      description: '商品"iPhone 15"库存不足，请及时补货',
      time: '2024-01-15 12:20:00',
      read: true,
      type: 'warning',
    },
  ]

  // 模拟待办数据
  todoList.value = [
    {
      id: '1',
      title: '审核用户申请',
      description: '有5个用户注册申请待审核',
      deadline: '2024-01-16 18:00:00',
      priority: 'high',
      status: 'pending',
    },
    {
      id: '2',
      title: '更新商品信息',
      description: '更新春季新品的详细信息',
      deadline: '2024-01-17 12:00:00',
      priority: 'medium',
      status: 'pending',
    },
  ]
}

// 组件挂载时初始化数据
onMounted(() => {
  initNotifications()
})
</script>

<style scoped lang="less">
.top-header {
  position: fixed;
  top: 0;
  right: 0;
  left: v-bind(headerLeftOffset);
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  padding: 0;
  height: 64px;
  line-height: 64px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.trigger-btn {
  font-size: 18px;
  margin-right: 16px;

  &:hover {
    color: #1890ff;
  }
}

.logo-section {
  display: flex;
  align-items: center;
  margin-right: 24px;

  .logo-img {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }

  .logo-text {
    font-size: 18px;
    font-weight: 600;
    color: #1890ff;
  }
}

.breadcrumb {
  flex: 1;
  min-width: 0;
}

.header-center {
  flex: 0 0 400px;
  display: flex;
  justify-content: center;
  margin: 0 24px;
}

.search-container {
  width: 100%;
  max-width: 400px;
}

.global-search {
  width: 100%;

  :deep(.ant-input) {
    border-radius: 20px;
    background: #f5f5f5;
    border: 1px solid transparent;

    &:focus {
      background: #fff;
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
}

.search-icon {
  color: #999;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  &:hover {
    background: #f5f5f5;
  }
}

.user-info {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f5f5f5;
  }
}

.user-avatar {
  margin-right: 8px;
}

.user-details {
  margin-right: 8px;
  text-align: left;
  line-height: 1.2;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.user-role {
  font-size: 12px;
  color: #999;
}

.user-arrow {
  font-size: 12px;
  color: #999;
}

.notification-panel {
  width: 320px;
  max-height: 400px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notification-header {
  border-bottom: 1px solid #f0f0f0;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  position: relative;

  &:hover {
    background: #f9f9f9;
  }

  &:last-child {
    border-bottom: none;
  }
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #999;
}

.notification-dot {
  width: 6px;
  height: 6px;
  background: #ff4d4f;
  border-radius: 50%;
  margin-left: 8px;
  margin-top: 4px;
  flex-shrink: 0;
}

.notification-footer {
  padding: 8px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
}

.user-menu {
  min-width: 160px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-center {
    flex: 0 0 200px;
  }

  .logo-section {
    display: none;
  }

  .breadcrumb {
    display: none;
  }
}
</style>
