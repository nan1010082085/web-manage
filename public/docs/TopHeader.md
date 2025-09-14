# TopHeader 顶部导航栏组件

功能完整的顶部导航栏组件，包含菜单折叠、面包屑导航、全局搜索、通知中心和用户操作区域。

## 特性

- ✅ **响应式布局**: 适配不同屏幕尺寸
- ✅ **面包屑导航**: 自动生成路由面包屑
- ✅ **全局搜索**: 支持功能、数据、文档搜索
- ✅ **用户中心**: 用户信息和操作入口
- ✅ **通知中心**: 消息通知和提醒
- ✅ **主题切换**: 支持明暗主题切换
- ✅ **多语言**: 支持国际化
- ✅ **快捷操作**: 常用功能快速访问

## 基础用法

### 简单导航栏

```vue
<template>
  <TopHeader
    :collapsed="collapsed"
    :user-info="userInfo"
    @toggle-collapsed="handleToggle"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopHeader from '@/components/common/TopHeader.vue'

const collapsed = ref(false)
const userInfo = ref({
  name: '管理员',
  avatar: '/avatar.png',
  email: 'admin@example.com',
  role: '超级管理员'
})

const handleToggle = () => {
  collapsed.value = !collapsed.value
}

const handleSearch = (value: string) => {
  console.log('搜索:', value)
  // 执行搜索逻辑
}
</script>
```

### 完整功能导航栏

```vue
<template>
  <TopHeader
    :collapsed="collapsed"
    :user-info="userInfo"
    :notifications="notifications"
    :breadcrumb-list="breadcrumbList"
    :theme="currentTheme"
    @toggle-collapsed="handleToggle"
    @search="handleSearch"
    @notification-click="handleNotificationClick"
    @user-action="handleUserAction"
    @theme-change="handleThemeChange"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()

const collapsed = ref(false)
const currentTheme = ref('light')

const userInfo = computed(() => userStore.userInfo)
const notifications = ref([
  {
    id: '1',
    title: '系统通知',
    content: '您有新的订单需要处理',
    type: 'info',
    time: '2024-01-15 10:30',
    read: false
  },
  {
    id: '2',
    title: '安全提醒',
    content: '检测到异常登录，请及时修改密码',
    type: 'warning',
    time: '2024-01-15 09:15',
    read: false
  }
])

// 自动生成面包屑
const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.map(item => ({
    title: item.meta.title,
    path: item.path
  }))
})

const handleToggle = () => {
  collapsed.value = !collapsed.value
  appStore.setCollapsed(collapsed.value)
}

const handleSearch = async (value: string) => {
  if (!value.trim()) return
  
  try {
    // 执行全局搜索
    const results = await globalSearch(value)
    // 显示搜索结果
    showSearchResults(results)
  } catch (error) {
    console.error('搜索失败:', error)
  }
}

const handleNotificationClick = (notification: any) => {
  // 标记为已读
  notification.read = true
  // 跳转到相关页面
  if (notification.link) {
    router.push(notification.link)
  }
}

const handleUserAction = (action: string) => {
  switch (action) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      userStore.logout()
      break
  }
}

const handleThemeChange = (theme: string) => {
  currentTheme.value = theme
  appStore.setTheme(theme)
}
</script>
```

## 高级用法

### 自定义搜索功能

```vue
<template>
  <TopHeader
    :search-options="searchOptions"
    :search-loading="searchLoading"
    @search="handleAdvancedSearch"
    @search-select="handleSearchSelect"
  />
</template>

<script setup lang="ts">
import { ref, watch, debounce } from 'vue'
import { searchAPI } from '@/api/search'

const searchOptions = ref([])
const searchLoading = ref(false)

// 防抖搜索
const debouncedSearch = debounce(async (value: string) => {
  if (!value) {
    searchOptions.value = []
    return
  }
  
  searchLoading.value = true
  try {
    const results = await searchAPI(value)
    searchOptions.value = results.map(item => ({
      value: item.id,
      label: item.title,
      type: item.type,
      description: item.description
    }))
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    searchLoading.value = false
  }
}, 300)

const handleAdvancedSearch = (value: string) => {
  debouncedSearch(value)
}

const handleSearchSelect = (option: any) => {
  // 根据搜索结果类型跳转
  switch (option.type) {
    case 'page':
      router.push(option.path)
      break
    case 'data':
      // 打开数据详情
      openDataDetail(option.value)
      break
    case 'document':
      // 打开文档
      openDocument(option.value)
      break
  }
}
</script>
```

### 通知中心集成

```vue
<template>
  <TopHeader
    :notifications="notifications"
    :unread-count="unreadCount"
    @notification-click="handleNotificationClick"
    @mark-all-read="handleMarkAllRead"
    @load-more-notifications="handleLoadMore"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

onMounted(() => {
  // 加载通知数据
  notificationStore.loadNotifications()
  
  // 设置定时刷新
  setInterval(() => {
    notificationStore.refreshNotifications()
  }, 30000) // 30秒刷新一次
})

const handleNotificationClick = (notification: any) => {
  notificationStore.markAsRead(notification.id)
  
  // 根据通知类型执行相应操作
  switch (notification.type) {
    case 'order':
      router.push(`/order/${notification.relatedId}`)
      break
    case 'system':
      // 显示系统消息详情
      showSystemMessage(notification)
      break
    case 'user':
      router.push(`/user/${notification.relatedId}`)
      break
  }
}

const handleMarkAllRead = () => {
  notificationStore.markAllAsRead()
}

const handleLoadMore = () => {
  notificationStore.loadMoreNotifications()
}
</script>
```

### 用户菜单定制

```vue
<template>
  <TopHeader
    :user-menu-items="customUserMenuItems"
    @user-menu-click="handleUserMenuClick"
  />
</template>

<script setup lang="ts">
const customUserMenuItems = ref([
  {
    key: 'profile',
    label: '个人资料',
    icon: 'UserOutlined',
    shortcut: 'Ctrl+P'
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: 'SettingOutlined',
    shortcut: 'Ctrl+,'
  },
  {
    key: 'help',
    label: '帮助中心',
    icon: 'QuestionCircleOutlined',
    shortcut: 'F1'
  },
  {
    type: 'divider'
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: 'LogoutOutlined',
    danger: true
  }
])

const handleUserMenuClick = (menuItem: any) => {
  switch (menuItem.key) {
    case 'profile':
      openUserProfile()
      break
    case 'settings':
      openSystemSettings()
      break
    case 'help':
      openHelpCenter()
      break
    case 'logout':
      confirmLogout()
      break
  }
}
</script>
```

## 主题定制

### 主题切换

```vue
<template>
  <TopHeader
    :theme="currentTheme"
    :theme-options="themeOptions"
    @theme-change="handleThemeChange"
  />
</template>

<script setup lang="ts">
const currentTheme = ref('light')
const themeOptions = ref([
  {
    key: 'light',
    label: '明亮主题',
    icon: 'SunOutlined'
  },
  {
    key: 'dark',
    label: '深色主题',
    icon: 'MoonOutlined'
  },
  {
    key: 'auto',
    label: '跟随系统',
    icon: 'DesktopOutlined'
  }
])

const handleThemeChange = (theme: string) => {
  currentTheme.value = theme
  
  // 应用主题
  if (theme === 'auto') {
    // 检测系统主题
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(isDark ? 'dark' : 'light')
  } else {
    applyTheme(theme)
  }
  
  // 保存主题设置
  localStorage.setItem('theme', theme)
}

function applyTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme)
  
  // 更新 Ant Design 主题
  if (theme === 'dark') {
    import('ant-design-vue/dist/antd.dark.css')
  } else {
    import('ant-design-vue/dist/antd.css')
  }
}
</script>
```

## API 参考

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| collapsed | `boolean` | `false` | 菜单是否折叠 |
| userInfo | `UserInfo` | - | 用户信息 |
| notifications | `Notification[]` | `[]` | 通知列表 |
| breadcrumbList | `BreadcrumbItem[]` | `[]` | 面包屑导航数据 |
| theme | `'light' \| 'dark' \| 'auto'` | `'light'` | 当前主题 |
| searchOptions | `SearchOption[]` | `[]` | 搜索选项 |
| searchLoading | `boolean` | `false` | 搜索加载状态 |
| userMenuItems | `UserMenuItem[]` | - | 用户菜单项 |
| showBreadcrumb | `boolean` | `true` | 是否显示面包屑 |
| showSearch | `boolean` | `true` | 是否显示搜索框 |
| showNotification | `boolean` | `true` | 是否显示通知 |
| showThemeSwitch | `boolean` | `true` | 是否显示主题切换 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| toggle-collapsed | - | 切换菜单折叠状态 |
| search | `(value: string)` | 搜索事件 |
| search-select | `(option: SearchOption)` | 搜索结果选择事件 |
| notification-click | `(notification: Notification)` | 通知点击事件 |
| mark-all-read | - | 标记所有通知为已读 |
| user-action | `(action: string)` | 用户操作事件 |
| user-menu-click | `(menuItem: UserMenuItem)` | 用户菜单点击事件 |
| theme-change | `(theme: string)` | 主题切换事件 |

### 类型定义

```typescript
// 用户信息接口
interface UserInfo {
  /** 用户名 */
  name: string
  /** 头像URL */
  avatar?: string
  /** 邮箱 */
  email?: string
  /** 角色 */
  role?: string
  /** 部门 */
  department?: string
}

// 通知接口
interface Notification {
  /** 通知ID */
  id: string
  /** 标题 */
  title: string
  /** 内容 */
  content: string
  /** 类型 */
  type: 'info' | 'success' | 'warning' | 'error'
  /** 时间 */
  time: string
  /** 是否已读 */
  read: boolean
  /** 相关链接 */
  link?: string
  /** 关联ID */
  relatedId?: string
}

// 面包屑项接口
interface BreadcrumbItem {
  /** 标题 */
  title: string
  /** 路径 */
  path?: string
  /** 图标 */
  icon?: string
}

// 搜索选项接口
interface SearchOption {
  /** 值 */
  value: string
  /** 标签 */
  label: string
  /** 类型 */
  type: 'page' | 'data' | 'document'
  /** 描述 */
  description?: string
  /** 路径 */
  path?: string
}

// 用户菜单项接口
interface UserMenuItem {
  /** 键值 */
  key: string
  /** 标签 */
  label: string
  /** 图标 */
  icon?: string
  /** 快捷键 */
  shortcut?: string
  /** 是否危险操作 */
  danger?: boolean
  /** 类型 */
  type?: 'divider'
}
```

## 样式定制

### CSS 变量

```css
.top-header {
  --header-height: 64px;
  --header-bg: #ffffff;
  --header-border: #f0f0f0;
  --header-text: #000000d9;
  --header-text-secondary: #00000073;
  --search-bg: #fafafa;
  --search-border: #d9d9d9;
  --notification-dot: #ff4d4f;
  --avatar-bg: #1890ff;
}

/* 深色主题 */
[data-theme='dark'] .top-header {
  --header-bg: #141414;
  --header-border: #303030;
  --header-text: #ffffffd9;
  --header-text-secondary: #ffffff73;
  --search-bg: #1f1f1f;
  --search-border: #434343;
}
```

### 响应式设计

```css
.top-header {
  /* 桌面端 */
  @media (min-width: 1200px) {
    .header-center {
      max-width: 600px;
    }
  }
  
  /* 平板端 */
  @media (max-width: 768px) {
    .header-center {
      display: none;
    }
    
    .header-right {
      .action-btn {
        padding: 0 8px;
      }
    }
  }
  
  /* 移动端 */
  @media (max-width: 576px) {
    .breadcrumb {
      display: none;
    }
    
    .header-right {
      .help-btn,
      .theme-switch {
        display: none;
      }
    }
  }
}
```

## 最佳实践

### 1. 状态管理

```typescript
// stores/header.ts
import { defineStore } from 'pinia'

export const useHeaderStore = defineStore('header', {
  state: () => ({
    collapsed: false,
    theme: 'light',
    notifications: [],
    unreadCount: 0,
    searchHistory: []
  }),
  
  actions: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed
      localStorage.setItem('sidebarCollapsed', String(this.collapsed))
    },
    
    setTheme(theme: string) {
      this.theme = theme
      localStorage.setItem('theme', theme)
      this.applyTheme(theme)
    },
    
    addSearchHistory(keyword: string) {
      if (!this.searchHistory.includes(keyword)) {
        this.searchHistory.unshift(keyword)
        this.searchHistory = this.searchHistory.slice(0, 10) // 保留最近10条
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
      }
    }
  }
})
```

### 2. 快捷键支持

```typescript
// composables/useShortcuts.ts
import { onMounted, onUnmounted } from 'vue'

export function useShortcuts() {
  const handleKeydown = (event: KeyboardEvent) => {
    // Ctrl/Cmd + K 打开搜索
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      focusSearch()
    }
    
    // Ctrl/Cmd + / 显示快捷键帮助
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
      event.preventDefault()
      showShortcutHelp()
    }
    
    // Ctrl/Cmd + Shift + N 打开通知面板
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'N') {
      event.preventDefault()
      openNotificationPanel()
    }
  }
  
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}
```

### 3. 性能优化

```vue
<script setup lang="ts">
import { ref, computed, watchEffect, debounce } from 'vue'

// 防抖搜索
const searchValue = ref('')
const debouncedSearch = debounce((value: string) => {
  performSearch(value)
}, 300)

watchEffect(() => {
  if (searchValue.value) {
    debouncedSearch(searchValue.value)
  }
})

// 虚拟滚动通知列表
const visibleNotifications = computed(() => {
  const start = Math.max(0, scrollTop.value - 100)
  const end = Math.min(notifications.value.length, start + 20)
  return notifications.value.slice(start, end)
})

// 懒加载用户头像
const avatarLoaded = ref(false)
const handleAvatarLoad = () => {
  avatarLoaded.value = true
}
</script>
```

## 常见问题

### Q: 如何自定义搜索结果的显示？

A: 可以通过插槽自定义搜索结果：

```vue
<template>
  <TopHeader>
    <template #search-option="{ option }">
      <div class="custom-search-option">
        <div class="option-title">{{ option.label }}</div>
        <div class="option-description">{{ option.description }}</div>
        <div class="option-type">{{ option.type }}</div>
      </div>
    </template>
  </TopHeader>
</template>
```

### Q: 如何实现通知的实时推送？

A: 可以使用 WebSocket 或 Server-Sent Events：

```typescript
// 使用 WebSocket
const ws = new WebSocket('ws://localhost:8080/notifications')
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data)
  notificationStore.addNotification(notification)
}

// 使用 SSE
const eventSource = new EventSource('/api/notifications/stream')
eventSource.onmessage = (event) => {
  const notification = JSON.parse(event.data)
  notificationStore.addNotification(notification)
}
```

### Q: 如何实现多语言支持？

A: 使用 Vue I18n：

```vue
<template>
  <TopHeader
    :placeholder="$t('header.search.placeholder')"
    :user-menu-items="translatedUserMenuItems"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const translatedUserMenuItems = computed(() => [
  {
    key: 'profile',
    label: t('header.user.profile'),
    icon: 'UserOutlined'
  },
  {
    key: 'logout',
    label: t('header.user.logout'),
    icon: 'LogoutOutlined'
  }
])
</script>
```

## 更新日志

### v1.0.0
- 初始版本发布
- 基础导航功能
- 搜索和通知功能

### v1.1.0
- 添加主题切换
- 支持快捷键
- 优化响应式设计

### v1.2.0
- 添加多语言支持
- 改进搜索体验
- 增强通知功能