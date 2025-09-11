import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ThemeConfig, MenuItem, BreadcrumbItem } from '@/types'
import { STORAGE_KEYS, THEME_CONFIG } from '@/constants'

/**
 * 应用状态管理
 */
export const useAppStore = defineStore('app', () => {
  // 状态
  const collapsed = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const themeConfig = ref<ThemeConfig>({
    primaryColor: THEME_CONFIG.PRIMARY_COLOR,
    layout: 'side',
    theme: 'light',
    fixedHeader: true,
    fixedSider: true,
    colorWeak: false,
  })
  const menuList = ref<MenuItem[]>([])
  const breadcrumbList = ref<BreadcrumbItem[]>([])
  const visitedViews = ref<string[]>([])
  const device = ref<'desktop' | 'mobile'>('desktop')

  // 计算属性
  const isMobile = computed(() => device.value === 'mobile')
  const siderWidth = computed(() => collapsed.value ? 80 : 200)

  /**
   * 初始化应用配置
   */
  const initAppConfig = (): void => {
    // 恢复菜单折叠状态
    const savedCollapsed = localStorage.getItem(STORAGE_KEYS.MENU_COLLAPSED)
    if (savedCollapsed !== null) {
      collapsed.value = JSON.parse(savedCollapsed)
    }

    // 恢复主题配置
    const savedThemeConfig = localStorage.getItem(STORAGE_KEYS.THEME_CONFIG)
    if (savedThemeConfig) {
      try {
        themeConfig.value = { ...themeConfig.value, ...JSON.parse(savedThemeConfig) }
      } catch (error) {
        console.error('解析主题配置失败:', error)
      }
    }

    // 恢复访问过的页面
    const savedVisitedViews = localStorage.getItem(STORAGE_KEYS.VISITED_VIEWS)
    if (savedVisitedViews) {
      try {
        visitedViews.value = JSON.parse(savedVisitedViews)
      } catch (error) {
        console.error('解析访问记录失败:', error)
      }
    }
  }

  /**
   * 切换菜单折叠状态
   */
  const toggleCollapsed = (): void => {
    collapsed.value = !collapsed.value
    localStorage.setItem(STORAGE_KEYS.MENU_COLLAPSED, JSON.stringify(collapsed.value))
  }

  /**
   * 设置菜单折叠状态
   */
  const setCollapsed = (value: boolean): void => {
    collapsed.value = value
    localStorage.setItem(STORAGE_KEYS.MENU_COLLAPSED, JSON.stringify(value))
  }

  /**
   * 设置加载状态
   */
  const setLoading = (value: boolean): void => {
    loading.value = value
  }

  /**
   * 更新主题配置
   */
  const updateThemeConfig = (config: Partial<ThemeConfig>): void => {
    themeConfig.value = { ...themeConfig.value, ...config }
    localStorage.setItem(STORAGE_KEYS.THEME_CONFIG, JSON.stringify(themeConfig.value))
  }

  /**
   * 设置菜单列表
   */
  const setMenuList = (menus: MenuItem[]): void => {
    menuList.value = menus
  }

  /**
   * 设置面包屑
   */
  const setBreadcrumbList = (breadcrumbs: BreadcrumbItem[]): void => {
    breadcrumbList.value = breadcrumbs
  }

  /**
   * 添加访问过的页面
   */
  const addVisitedView = (path: string): void => {
    if (!visitedViews.value.includes(path)) {
      visitedViews.value.push(path)
      // 限制最多保存20个
      if (visitedViews.value.length > 20) {
        visitedViews.value.shift()
      }
      localStorage.setItem(STORAGE_KEYS.VISITED_VIEWS, JSON.stringify(visitedViews.value))
    }
  }

  /**
   * 移除访问过的页面
   */
  const removeVisitedView = (path: string): void => {
    const index = visitedViews.value.indexOf(path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
      localStorage.setItem(STORAGE_KEYS.VISITED_VIEWS, JSON.stringify(visitedViews.value))
    }
  }

  /**
   * 清空访问记录
   */
  const clearVisitedViews = (): void => {
    visitedViews.value = []
    localStorage.removeItem(STORAGE_KEYS.VISITED_VIEWS)
  }

  /**
   * 设置设备类型
   */
  const setDevice = (deviceType: 'desktop' | 'mobile'): void => {
    device.value = deviceType
    // 移动端自动折叠菜单
    if (deviceType === 'mobile') {
      setCollapsed(true)
    }
  }

  /**
   * 重置应用状态
   */
  const resetAppState = (): void => {
    collapsed.value = false
    loading.value = false
    menuList.value = []
    breadcrumbList.value = []
    visitedViews.value = []
    device.value = 'desktop'
    
    // 清除本地存储
    localStorage.removeItem(STORAGE_KEYS.MENU_COLLAPSED)
    localStorage.removeItem(STORAGE_KEYS.VISITED_VIEWS)
  }

  return {
    // 状态
    collapsed,
    loading,
    themeConfig,
    menuList,
    breadcrumbList,
    visitedViews,
    device,
    
    // 计算属性
    isMobile,
    siderWidth,
    
    // 方法
    initAppConfig,
    toggleCollapsed,
    setCollapsed,
    setLoading,
    updateThemeConfig,
    setMenuList,
    setBreadcrumbList,
    addVisitedView,
    removeVisitedView,
    clearVisitedViews,
    setDevice,
    resetAppState,
  }
})