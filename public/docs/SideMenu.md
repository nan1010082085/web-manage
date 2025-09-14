# SideMenu 侧边菜单组件

功能丰富的侧边菜单组件，支持多级菜单、收藏功能、业务域分组和折叠模式。

## 特性

- ✅ **多级菜单**: 支持无限层级菜单结构
- ✅ **收藏功能**: 常用菜单收藏和管理
- ✅ **业务域分组**: 按业务模块分组显示
- ✅ **折叠模式**: 支持菜单折叠显示
- ✅ **路由集成**: 与 Vue Router 深度集成
- ✅ **权限控制**: 支持菜单权限验证
- ✅ **主题适配**: 支持明暗主题切换

## 基础用法

### 简单菜单

```vue
<template>
  <SideMenu
    :collapsed="collapsed"
    :selected-keys="selectedKeys"
    @menu-click="handleMenuClick"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SideMenu from '@/components/common/SideMenu.vue'

const collapsed = ref(false)
const selectedKeys = ref(['dashboard'])

const handleMenuClick = (menuInfo: any) => {
  console.log('菜单点击:', menuInfo)
  selectedKeys.value = [menuInfo.key]
}
</script>
```

### 带收藏功能的菜单

```vue
<template>
  <div class="layout-container">
    <SideMenu
      :collapsed="collapsed"
      :selected-keys="selectedKeys"
      :favorite-menus="favoriteMenus"
      @menu-click="handleMenuClick"
      @favorite-change="handleFavoriteChange"
    />
    
    <div class="content">
      <a-button @click="toggleCollapsed">
        {{ collapsed ? '展开' : '折叠' }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)
const selectedKeys = ref(['dashboard'])
const favoriteMenus = ref([
  {
    key: 'dashboard',
    title: '仪表盘',
    icon: 'DashboardOutlined'
  },
  {
    key: 'user-list',
    title: '用户管理',
    icon: 'UserOutlined'
  }
])

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

const handleMenuClick = (menuInfo: any) => {
  selectedKeys.value = [menuInfo.key]
  // 路由跳转
  router.push({ name: menuInfo.key })
}

const handleFavoriteChange = (favorites: any[]) => {
  favoriteMenus.value = favorites
  // 保存到本地存储
  localStorage.setItem('favoriteMenus', JSON.stringify(favorites))
}
</script>
```

## 高级用法

### 自定义菜单数据

```vue
<template>
  <SideMenu
    :menu-data="customMenuData"
    :collapsed="collapsed"
    @menu-click="handleMenuClick"
  />
</template>

<script setup lang="ts">
interface MenuGroup {
  key: string
  title: string
  icon: string
  menus: MenuItem[]
}

interface MenuItem {
  key: string
  title: string
  icon: string
  path?: string
  children?: MenuItem[]
  permission?: string
  badge?: number
}

const customMenuData = ref<MenuGroup[]>([
  {
    key: 'business',
    title: '业务管理',
    icon: 'ShopOutlined',
    menus: [
      {
        key: 'product',
        title: '商品管理',
        icon: 'ShoppingOutlined',
        children: [
          {
            key: 'product-list',
            title: '商品列表',
            icon: 'UnorderedListOutlined',
            path: '/product/list'
          },
          {
            key: 'product-category',
            title: '商品分类',
            icon: 'AppstoreOutlined',
            path: '/product/category'
          }
        ]
      },
      {
        key: 'order',
        title: '订单管理',
        icon: 'FileTextOutlined',
        path: '/order',
        badge: 5
      }
    ]
  },
  {
    key: 'system',
    title: '系统管理',
    icon: 'SettingOutlined',
    menus: [
      {
        key: 'user',
        title: '用户管理',
        icon: 'UserOutlined',
        path: '/user',
        permission: 'user:manage'
      },
      {
        key: 'role',
        title: '角色管理',
        icon: 'TeamOutlined',
        path: '/role',
        permission: 'role:manage'
      }
    ]
  }
])
</script>
```

### 权限控制

```vue
<template>
  <SideMenu
    :menu-data="filteredMenuData"
    :user-permissions="userPermissions"
    @menu-click="handleMenuClick"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userPermissions = computed(() => userStore.permissions)

// 根据权限过滤菜单
const filteredMenuData = computed(() => {
  return filterMenuByPermission(customMenuData.value, userPermissions.value)
})

function filterMenuByPermission(menus: MenuGroup[], permissions: string[]): MenuGroup[] {
  return menus.map(group => ({
    ...group,
    menus: group.menus.filter(menu => {
      if (menu.permission && !permissions.includes(menu.permission)) {
        return false
      }
      if (menu.children) {
        menu.children = menu.children.filter(child => 
          !child.permission || permissions.includes(child.permission)
        )
      }
      return true
    })
  })).filter(group => group.menus.length > 0)
}
</script>
```

### 动态菜单加载

```vue
<template>
  <SideMenu
    :menu-data="menuData"
    :loading="menuLoading"
    @menu-click="handleMenuClick"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMenuData } from '@/api/menu'

const menuData = ref<MenuGroup[]>([])
const menuLoading = ref(true)

onMounted(async () => {
  try {
    const response = await getMenuData()
    menuData.value = response.data
  } catch (error) {
    console.error('加载菜单失败:', error)
  } finally {
    menuLoading.value = false
  }
})
</script>
```

## 菜单配置

### 菜单数据结构

```typescript
// types/menu.ts
export interface MenuGroup {
  /** 分组唯一标识 */
  key: string
  /** 分组标题 */
  title: string
  /** 分组图标 */
  icon: string
  /** 菜单项列表 */
  menus: MenuItem[]
}

export interface MenuItem {
  /** 菜单唯一标识 */
  key: string
  /** 菜单标题 */
  title: string
  /** 菜单图标 */
  icon: string
  /** 路由路径 */
  path?: string
  /** 子菜单 */
  children?: MenuItem[]
  /** 权限标识 */
  permission?: string
  /** 徽章数量 */
  badge?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 是否隐藏 */
  hidden?: boolean
  /** 外部链接 */
  external?: boolean
  /** 目标窗口 */
  target?: '_blank' | '_self'
}
```

### 收藏菜单配置

```typescript
// composables/useFavoriteMenu.ts
import { ref, computed } from 'vue'

export function useFavoriteMenu() {
  const favoriteKeys = ref<string[]>([])
  
  // 从本地存储加载收藏
  const loadFavorites = () => {
    const saved = localStorage.getItem('favoriteMenus')
    if (saved) {
      favoriteKeys.value = JSON.parse(saved)
    }
  }
  
  // 保存收藏到本地存储
  const saveFavorites = () => {
    localStorage.setItem('favoriteMenus', JSON.stringify(favoriteKeys.value))
  }
  
  // 添加收藏
  const addFavorite = (menuKey: string) => {
    if (!favoriteKeys.value.includes(menuKey)) {
      favoriteKeys.value.push(menuKey)
      saveFavorites()
    }
  }
  
  // 移除收藏
  const removeFavorite = (menuKey: string) => {
    const index = favoriteKeys.value.indexOf(menuKey)
    if (index > -1) {
      favoriteKeys.value.splice(index, 1)
      saveFavorites()
    }
  }
  
  // 切换收藏状态
  const toggleFavorite = (menuKey: string) => {
    if (favoriteKeys.value.includes(menuKey)) {
      removeFavorite(menuKey)
    } else {
      addFavorite(menuKey)
    }
  }
  
  return {
    favoriteKeys,
    loadFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite
  }
}
```

## API 参考

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| collapsed | `boolean` | `false` | 是否折叠菜单 |
| selectedKeys | `string[]` | `[]` | 当前选中的菜单项 |
| openKeys | `string[]` | `[]` | 当前展开的子菜单 |
| menuData | `MenuGroup[]` | - | 菜单数据 |
| favoriteMenus | `MenuItem[]` | `[]` | 收藏的菜单项 |
| userPermissions | `string[]` | `[]` | 用户权限列表 |
| theme | `'light' \| 'dark'` | `'dark'` | 菜单主题 |
| loading | `boolean` | `false` | 是否显示加载状态 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| menu-click | `(menuInfo: MenuClickInfo)` | 菜单项点击事件 |
| favorite-change | `(favorites: MenuItem[])` | 收藏菜单变化事件 |
| open-change | `(openKeys: string[])` | 子菜单展开/收起事件 |

### 类型定义

```typescript
interface MenuClickInfo {
  key: string
  keyPath: string[]
  item: MenuItem
  domEvent: Event
}
```

## 样式定制

### CSS 变量

```css
.side-menu-container {
  --menu-bg-color: #001529;
  --menu-text-color: rgba(255, 255, 255, 0.65);
  --menu-active-bg: #1890ff;
  --menu-active-text: #ffffff;
  --menu-hover-bg: rgba(255, 255, 255, 0.1);
  --favorite-bg: #1f1f1f;
  --group-title-color: rgba(255, 255, 255, 0.45);
}

/* 明亮主题 */
.side-menu-container.light {
  --menu-bg-color: #ffffff;
  --menu-text-color: rgba(0, 0, 0, 0.65);
  --menu-active-bg: #e6f7ff;
  --menu-active-text: #1890ff;
  --menu-hover-bg: rgba(0, 0, 0, 0.06);
  --favorite-bg: #fafafa;
  --group-title-color: rgba(0, 0, 0, 0.45);
}
```

### 自定义样式

```vue
<template>
  <SideMenu class="custom-menu" />
</template>

<style scoped>
.custom-menu {
  /* 自定义菜单宽度 */
  --menu-width: 280px;
  --menu-collapsed-width: 80px;
}

.custom-menu :deep(.ant-menu-item) {
  /* 自定义菜单项样式 */
  border-radius: 6px;
  margin: 4px 8px;
}

.custom-menu :deep(.favorite-item) {
  /* 自定义收藏项样式 */
  transition: all 0.3s ease;
}

.custom-menu :deep(.favorite-item:hover) {
  transform: translateX(4px);
}
</style>
```

## 最佳实践

### 1. 菜单数据管理

```typescript
// stores/menu.ts
import { defineStore } from 'pinia'
import { getMenuData } from '@/api/menu'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuData: [] as MenuGroup[],
    selectedKeys: [] as string[],
    openKeys: [] as string[],
    collapsed: false,
    loading: false
  }),
  
  actions: {
    async loadMenuData() {
      this.loading = true
      try {
        const response = await getMenuData()
        this.menuData = response.data
      } catch (error) {
        console.error('加载菜单失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    setSelectedKeys(keys: string[]) {
      this.selectedKeys = keys
    },
    
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    }
  }
})
```

### 2. 路由集成

```typescript
// utils/menuUtils.ts
import type { RouteRecordRaw } from 'vue-router'
import type { MenuGroup, MenuItem } from '@/types/menu'

/**
 * 根据菜单数据生成路由
 */
export function generateRoutesFromMenu(menuGroups: MenuGroup[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []
  
  menuGroups.forEach(group => {
    group.menus.forEach(menu => {
      if (menu.path) {
        routes.push({
          path: menu.path,
          name: menu.key,
          component: () => import(`@/views${menu.path}/index.vue`),
          meta: {
            title: menu.title,
            icon: menu.icon,
            permission: menu.permission
          }
        })
      }
      
      if (menu.children) {
        menu.children.forEach(child => {
          if (child.path) {
            routes.push({
              path: child.path,
              name: child.key,
              component: () => import(`@/views${child.path}/index.vue`),
              meta: {
                title: child.title,
                icon: child.icon,
                permission: child.permission,
                parent: menu.key
              }
            })
          }
        })
      }
    })
  })
  
  return routes
}
```

### 3. 权限验证

```typescript
// utils/permission.ts
import type { MenuItem } from '@/types/menu'

/**
 * 检查用户是否有菜单权限
 */
export function hasMenuPermission(menu: MenuItem, userPermissions: string[]): boolean {
  if (!menu.permission) {
    return true
  }
  return userPermissions.includes(menu.permission)
}

/**
 * 过滤用户有权限的菜单
 */
export function filterMenuByPermission(menus: MenuItem[], permissions: string[]): MenuItem[] {
  return menus.filter(menu => {
    if (!hasMenuPermission(menu, permissions)) {
      return false
    }
    
    if (menu.children) {
      menu.children = filterMenuByPermission(menu.children, permissions)
    }
    
    return true
  })
}
```

## 常见问题

### Q: 如何实现菜单的懒加载？

A: 可以在菜单点击时动态加载子菜单：

```typescript
const handleMenuClick = async (menuInfo: any) => {
  if (menuInfo.item.children === undefined && menuInfo.item.hasChildren) {
    // 动态加载子菜单
    const children = await loadSubMenu(menuInfo.key)
    // 更新菜单数据
    updateMenuChildren(menuInfo.key, children)
  }
}
```

### Q: 如何实现菜单的搜索功能？

A: 可以添加搜索框过滤菜单：

```vue
<template>
  <div class="menu-search">
    <a-input
      v-model:value="searchValue"
      placeholder="搜索菜单"
      @input="handleSearch"
    />
  </div>
  <SideMenu :menu-data="filteredMenuData" />
</template>

<script setup lang="ts">
const searchValue = ref('')
const filteredMenuData = computed(() => {
  if (!searchValue.value) {
    return menuData.value
  }
  return filterMenuByKeyword(menuData.value, searchValue.value)
})
</script>
```

### Q: 如何实现菜单的拖拽排序？

A: 可以使用 Vue Draggable 库实现：

```vue
<template>
  <draggable
    v-model="favoriteMenus"
    @end="handleDragEnd"
  >
    <div
      v-for="item in favoriteMenus"
      :key="item.key"
      class="favorite-item"
    >
      {{ item.title }}
    </div>
  </draggable>
</template>
```

## 更新日志

### v1.0.0
- 初始版本发布
- 基础菜单功能
- 收藏功能
- 折叠模式

### v1.1.0
- 添加权限控制
- 支持业务域分组
- 优化性能

### v1.2.0
- 添加主题切换
- 支持徽章显示
- 改进无障碍访问