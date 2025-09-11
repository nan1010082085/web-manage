<template>
  <div class="side-menu-container">
    <!-- 常用功能区 -->
    <div v-if="favoriteMenus.length > 0 && !collapsed" class="favorite-section">
      <div class="section-title">
        <StarFilled class="title-icon" />
        <span>常用功能</span>
        <a-button type="text" size="small" @click="showFavoriteManager = true" class="manage-btn">
          <SettingOutlined />
        </a-button>
      </div>
      <div class="favorite-list">
        <div
          v-for="item in favoriteMenus"
          :key="item.key"
          class="favorite-item"
          :class="{ active: selectedKeys.includes(item.key) }"
          @click="handleMenuClick({ key: item.key })"
        >
          <component :is="item.icon" class="favorite-icon" />
          <span class="favorite-title">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <!-- 主菜单区 -->
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
      class="side-menu"
      @click="handleMenuClick"
    >
      <template v-for="group in menuGroups" :key="group.key">
        <!-- 业务域分组标题 -->
        <div v-if="!collapsed" class="menu-group-title">
          <component :is="group.icon" class="group-icon" />
          <span class="group-title">{{ group.title }}</span>
        </div>

        <!-- 分组菜单项 -->
        <template v-for="item in group.menus" :key="item.key">
          <!-- 有子菜单的情况 -->
          <a-sub-menu v-if="item.children && item.children.length > 0" :key="item.key">
            <template #icon>
              <component :is="item.icon" />
            </template>
            <template #title>
              <div class="menu-title-wrapper">
                <span>{{ item.title }}</span>
                <a-button
                  v-if="!collapsed"
                  type="text"
                  size="small"
                  @click.stop="toggleFavorite(item)"
                  class="favorite-toggle"
                >
                  <StarFilled v-if="isFavorite(item.key)" class="star-active" />
                  <StarOutlined v-else class="star-inactive" />
                </a-button>
              </div>
            </template>

            <template v-for="child in item.children" :key="child.key">
              <a-sub-menu v-if="child.children && child.children.length > 0" :key="child.key">
                <template #icon>
                  <component :is="child.icon" />
                </template>
                <template #title>
                  <div class="menu-title-wrapper">
                    <span>{{ child.title }}</span>
                    <a-button
                      type="text"
                      size="small"
                      @click.stop="toggleFavorite(child)"
                      class="favorite-toggle"
                    >
                      <StarFilled v-if="isFavorite(child.key)" class="star-active" />
                      <StarOutlined v-else class="star-inactive" />
                    </a-button>
                  </div>
                </template>

                <a-menu-item
                  v-for="grandChild in child.children"
                  :key="grandChild.key"
                  :disabled="grandChild.disabled"
                >
                  <template #icon>
                    <component :is="grandChild.icon" />
                  </template>
                  <div class="menu-title-wrapper">
                    <span>{{ grandChild.title }}</span>
                    <a-button
                      type="text"
                      size="small"
                      @click.stop="toggleFavorite(grandChild)"
                      class="favorite-toggle"
                    >
                      <StarFilled v-if="isFavorite(grandChild.key)" class="star-active" />
                      <StarOutlined v-else class="star-inactive" />
                    </a-button>
                  </div>
                </a-menu-item>
              </a-sub-menu>

              <a-menu-item v-else :key="`${child.key}`" :disabled="child.disabled">
                <template #icon>
                  <component :is="child.icon" />
                </template>
                <div class="menu-title-wrapper">
                  <span>{{ child.title }}</span>
                  <a-button
                    v-if="!collapsed"
                    type="text"
                    size="small"
                    @click.stop="toggleFavorite(child)"
                    class="favorite-toggle"
                  >
                    <StarFilled v-if="isFavorite(child.key)" class="star-active" />
                    <StarOutlined v-else class="star-inactive" />
                  </a-button>
                </div>
              </a-menu-item>
            </template>
          </a-sub-menu>

          <!-- 没有子菜单的情况 -->
          <a-menu-item
            v-else-if="!item.children || item.children.length === 0"
            :key="`${item.key}`"
            :disabled="item.disabled"
          >
            <template #icon>
              <component :is="item.icon" />
            </template>
            <div class="menu-title-wrapper">
              <span>{{ item.title }}</span>
              <a-button
                v-if="!collapsed"
                type="text"
                size="small"
                @click.stop="toggleFavorite(item)"
                class="favorite-toggle"
              >
                <StarFilled v-if="isFavorite(item.key)" class="star-active" />
                <StarOutlined v-else class="star-inactive" />
              </a-button>
            </div>
          </a-menu-item>
        </template>
      </template>
    </a-menu>

    <!-- 常用功能管理弹窗 -->
    <a-modal
      v-model:open="showFavoriteManager"
      title="管理常用功能"
      width="600px"
      @ok="saveFavoriteSettings"
    >
      <div class="favorite-manager">
        <div class="manager-section">
          <h4>当前常用功能</h4>
          <div class="current-favorites">
            <div
              v-for="(item, index) in favoriteMenus"
              :key="item.key"
              class="favorite-manager-item"
            >
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
              <div class="item-actions">
                <a-button
                  type="text"
                  size="small"
                  @click="moveFavorite(index, -1)"
                  :disabled="index === 0"
                >
                  <UpOutlined />
                </a-button>
                <a-button
                  type="text"
                  size="small"
                  @click="moveFavorite(index, 1)"
                  :disabled="index === favoriteMenus.length - 1"
                >
                  <DownOutlined />
                </a-button>
                <a-button type="text" size="small" danger @click="removeFavorite(item.key)">
                  <DeleteOutlined />
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <div class="manager-section">
          <h4>添加常用功能</h4>
          <div class="available-menus">
            <div
              v-for="item in availableMenus"
              :key="item.key"
              class="available-menu-item"
              @click="addToFavorites(item)"
            >
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
              <PlusOutlined class="add-icon" />
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  SettingOutlined,
  StarFilled,
  StarOutlined,
  UpOutlined,
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import type { MenuItem } from '@/types'
import { generateMenuConfig } from '@/utils/menuGenerator'

/**
 * 增强版侧边栏菜单组件
 * 支持业务域分组、常用功能置顶、拖拽排序等功能
 */

interface MenuGroup {
  key: string
  title: string
  icon: any
  menus: MenuItem[]
}

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

// 响应式数据
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])
const favoriteKeys = ref<string[]>([])
const showFavoriteManager = ref(false)

// 计算属性
const collapsed = computed(() => appStore.collapsed)
const userInfo = computed(() => userStore.userInfo)

/**
 * 业务域分组菜单配置
 * 自动根据views目录结构生成
 */
const menuGroups = ref<MenuGroup[]>([])

/**
 * 初始化菜单配置
 */
const initMenuConfig = async (): Promise<void> => {
  try {
    const generatedGroups = await generateMenuConfig()
    // 根据用户权限过滤菜单组
    menuGroups.value = generatedGroups
      .map((group) => ({
        ...group,
        menus: filterMenuByPermission(group.menus || []),
      }))
      .filter((group) => group.menus.length > 0)
  } catch (error) {
    console.error('Failed to generate menu config:', error)
    // 如果生成失败，使用空菜单
    menuGroups.value = []
  }
}

/**
 * 常用功能菜单
 */
const favoriteMenus = computed<MenuItem[]>(() => {
  const allMenus = getAllMenuItems()
  return favoriteKeys.value
    .map((key) => allMenus.find((menu) => menu.key === key))
    .filter(Boolean) as MenuItem[]
})

/**
 * 可添加到常用功能的菜单
 */
const availableMenus = computed<MenuItem[]>(() => {
  const allMenus = getAllMenuItems()
  return allMenus.filter((menu) => menu.path && !favoriteKeys.value.includes(menu.key))
})

/**
 * 获取所有菜单项（扁平化）
 */
const getAllMenuItems = (): MenuItem[] => {
  const items: MenuItem[] = []

  const extractItems = (menus: MenuItem[]): void => {
    menus.forEach((menu) => {
      if (menu.path) {
        items.push(menu)
      }
      if (menu.children) {
        extractItems(menu.children)
      }
    })
  }

  menuGroups.value.forEach((group) => {
    extractItems(group.menus)
  })

  return items
}

/**
 * 根据权限过滤菜单
 */
const filterMenuByPermission = (menus: MenuItem[]): MenuItem[] => {
  if (!userInfo.value) {
    return menus
  }

  return menus.filter((menu) => {
    if (menu.permission && !userStore.hasPermission(menu.permission)) {
      return false
    }

    if (menu.children && menu.children.length > 0) {
      menu.children = filterMenuByPermission(menu.children)
      return menu.children.length > 0
    }

    return true
  })
}

/**
 * 处理菜单点击事件
 */
const handleMenuClick = ({ key }: { key: string }): void => {
  const allMenus = getAllMenuItems()
  const menu = allMenus.find((item) => item.key === key)
  if (menu?.path) {
    router.push(menu.path)
  }
}

/**
 * 切换收藏状态
 */
const toggleFavorite = (menu: MenuItem): void => {
  if (!menu.path) return

  const index = favoriteKeys.value.indexOf(menu.key)
  if (index > -1) {
    favoriteKeys.value.splice(index, 1)
    message.success(`已从常用功能中移除"${menu.title}"`)
  } else {
    if (favoriteKeys.value.length >= 8) {
      message.warning('常用功能最多只能添加8个')
      return
    }
    favoriteKeys.value.push(menu.key)
    message.success(`已将"${menu.title}"添加到常用功能`)
  }
  saveFavoriteKeys()
}

/**
 * 检查是否为收藏菜单
 */
const isFavorite = (key: string): boolean => {
  return favoriteKeys.value.includes(key)
}

/**
 * 添加到收藏
 */
const addToFavorites = (menu: MenuItem): void => {
  if (favoriteKeys.value.length >= 8) {
    message.warning('常用功能最多只能添加8个')
    return
  }
  favoriteKeys.value.push(menu.key)
  message.success(`已将"${menu.title}"添加到常用功能`)
}

/**
 * 移除收藏
 */
const removeFavorite = (key: string): void => {
  const index = favoriteKeys.value.indexOf(key)
  if (index > -1) {
    favoriteKeys.value.splice(index, 1)
  }
}

/**
 * 移动收藏项位置
 */
const moveFavorite = (index: number, direction: number): void => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= favoriteKeys.value.length) return

  const item = favoriteKeys.value.splice(index, 1)[0]
  favoriteKeys.value.splice(newIndex, 0, item)
}

/**
 * 保存收藏设置
 */
const saveFavoriteSettings = (): void => {
  saveFavoriteKeys()
  showFavoriteManager.value = false
  message.success('常用功能设置已保存')
}

/**
 * 保存收藏keys到本地存储
 */
const saveFavoriteKeys = (): void => {
  localStorage.setItem('menu-favorites', JSON.stringify(favoriteKeys.value))
}

/**
 * 从本地存储加载收藏keys
 */
const loadFavoriteKeys = (): void => {
  try {
    const saved = localStorage.getItem('menu-favorites')
    if (saved) {
      favoriteKeys.value = JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Failed to load favorite keys:', error)
  }
}

/**
 * 根据当前路由设置选中的菜单
 */
const setSelectedKeys = (): void => {
  const path = route.path
  const allMenus = getAllMenuItems()
  const menu = allMenus.find((item) => item.path === path)
  if (menu) {
    selectedKeys.value = [menu.key]
    setOpenKeys(menu.key)
  }
}

/**
 * 设置展开的菜单keys
 */
const setOpenKeys = (selectedKey: string): void => {
  const keys: string[] = []

  const findParentKeys = (groups: MenuGroup[], targetKey: string): boolean => {
    for (const group of groups) {
      for (const menu of group.menus) {
        if (findMenuParentKeys(menu, targetKey, keys)) {
          return true
        }
      }
    }
    return false
  }

  const findMenuParentKeys = (menu: MenuItem, targetKey: string, parentKeys: string[]): boolean => {
    if (menu.key === targetKey) {
      return true
    }
    if (menu.children) {
      parentKeys.push(menu.key)
      for (const child of menu.children) {
        if (findMenuParentKeys(child, targetKey, parentKeys)) {
          return true
        }
      }
      parentKeys.pop()
    }
    return false
  }

  findParentKeys(menuGroups.value, selectedKey)
  openKeys.value = keys
}

/**
 * 监听路由变化
 */
watch(
  () => route.path,
  () => {
    setSelectedKeys()
  },
  { immediate: true },
)

/**
 * 监听菜单折叠状态
 */
watch(
  () => collapsed.value,
  (newCollapsed) => {
    if (newCollapsed) {
      openKeys.value = []
    } else {
      setSelectedKeys()
    }
  },
)

/**
 * 组件挂载时初始化
 */
onMounted(async () => {
  await initMenuConfig()
  loadFavoriteKeys()
  setSelectedKeys()
})
</script>

<style scoped lang="less">
.side-menu-container {
  height: calc(100vh - 64px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.favorite-section {
  background: #001529;
  border-bottom: 1px solid #303030;
  padding: 12px 0;
  flex-shrink: 0;
}

.section-title {
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 8px;
  color: #fff;
  font-size: 12px;

  .title-icon {
    color: #fadb14;
    margin-right: 6px;
  }

  .manage-btn {
    margin-left: auto;
    color: #999;

    &:hover {
      color: #fff;
    }
  }
}

.favorite-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 16px;
}

.favorite-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 0;
  flex: 1;
  max-width: calc(50% - 4px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &.active {
    background: #1890ff;
  }
}

.favorite-icon {
  color: #fff;
  margin-right: 6px;
  flex-shrink: 0;
}

.favorite-title {
  color: #fff;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-group-title {
  display: flex;
  align-items: center;
  padding: 12px 16px 8px;
  color: #999;
  font-size: 12px;
  font-weight: 500;
  border-bottom: 1px solid #303030;
  margin-bottom: 8px;

  .group-icon {
    margin-right: 6px;
  }

  .group-title {
    flex: 1;
  }
}

.side-menu {
  flex: 1;
  border-right: 0;
  overflow-y: auto;

  :deep(.ant-menu-item),
  :deep(.ant-menu-submenu-title) {
    .menu-title-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .favorite-toggle {
        opacity: 0;
        transition: opacity 0.3s;

        .star-active {
          color: #fadb14;
        }

        .star-inactive {
          color: #999;
        }
      }
    }

    &:hover .favorite-toggle {
      opacity: 1;
    }
  }
}

.side-menu::-webkit-scrollbar {
  width: 6px;
}

.side-menu::-webkit-scrollbar-track {
  background: #001529;
}

.side-menu::-webkit-scrollbar-thumb {
  background: #6c7b7f;
  border-radius: 3px;
}

.side-menu::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.favorite-manager {
  .manager-section {
    margin-bottom: 24px;

    h4 {
      margin-bottom: 12px;
      color: #333;
    }
  }

  .current-favorites {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    min-height: 120px;
    padding: 12px;
  }

  .favorite-manager-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: #f5f5f5;
    border-radius: 4px;
    margin-bottom: 8px;

    span {
      flex: 1;
      margin-left: 8px;
    }

    .item-actions {
      display: flex;
      gap: 4px;
    }
  }

  .available-menus {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    padding: 8px;
  }

  .available-menu-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.3s;

    &:hover {
      background: #f0f0f0;
    }

    span {
      flex: 1;
      margin-left: 8px;
    }

    .add-icon {
      color: #1890ff;
    }
  }
}
</style>
