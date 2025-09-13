import type { RouteRecordRaw } from 'vue-router'
import { getViewsStructure, generateMenuFromViews } from './menuGenerator'

/**
 * 路由元信息接口
 */
interface RouteMeta {
  title: string
  icon?: string
  requireAuth?: boolean
  roles?: string[]
  hidden?: boolean
}

/**
 * 路由配置接口
 */
interface RouteConfig {
  path: string
  name: string
  component?: () => Promise<any>
  meta: RouteMeta
  children?: RouteConfig[]
  redirect?: string
}

/**
 * 根据文件名生成路由名称
 * @param directory 目录名
 * @param fileName 文件名
 * @returns 路由名称
 */
const generateRouteName = (directory: string, fileName?: string): string => {
  if (!fileName) {
    // 目录级别的路由名称
    return directory.charAt(0).toUpperCase() + directory.slice(1) + 'Management'
  }

  // 文件级别的路由名称
  const baseName = fileName.replace(/\.vue$/, '')

  // 特殊处理一些文件名
  const nameMap: Record<string, string> = {
    ProductManage: 'ProductList',
    OrderManage: 'OrderList',
    UserManage: 'SystemUserManagement',
    DashboardView: 'Dashboard',
    LoginView: 'Login',
    NotFoundView: 'NotFound',
  }

  if (nameMap[baseName]) {
    return nameMap[baseName]
  }

  return baseName
}

/**
 * 组件映射表 - 静态导入避免Vite警告
 */
const componentMap: Record<string, () => Promise<any>> = {
  // Analytics
  'analytics/DataView.vue': () => import('@/views/analytics/DataView.vue'),
  'analytics/ReportView.vue': () => import('@/views/analytics/ReportView.vue'),

  // Auth
  'auth/LoginView.vue': () => import('@/views/auth/LoginView.vue'),

  // Content
  'content/ContentView.vue': () => import('@/views/content/ContentView.vue'),

  // Dashboard
  'dashboard/DashboardView.vue': () => import('@/views/dashboard/DashboardView.vue'),

  // Error
  'error/NotFoundView.vue': () => import('@/views/error/NotFoundView.vue'),

  // Help
  'help/HelpView.vue': () => import('@/views/help/HelpView.vue'),

  // Marketing
  'marketing/CampaignView.vue': () => import('@/views/marketing/CampaignView.vue'),
  'marketing/CouponView.vue': () => import('@/views/marketing/CouponView.vue'),

  // Order
  'order/OrderManageView.vue': () => import('@/views/order/OrderManageView.vue'),

  // Permission
  'permission/PermissionView.vue': () => import('@/views/permission/PermissionView.vue'),

  // Product
  'product/ProductManageView.vue': () => import('@/views/product/ProductManageView.vue'),
  'product/CategoryView.vue': () => import('@/views/product/CategoryView.vue'),
  'product/InventoryView.vue': () => import('@/views/product/InventoryView.vue'),

  // Profile
  'profile/ProfileView.vue': () => import('@/views/profile/ProfileView.vue'),

  // Service
  'service/CustomerServiceView.vue': () => import('@/views/service/CustomerServiceView.vue'),

  // Statistics
  'statistics/SalesView.vue': () => import('@/views/statistics/SalesView.vue'),
  'statistics/FinanceView.vue': () => import('@/views/statistics/FinanceView.vue'),
  'statistics/UserView.vue': () => import('@/views/statistics/UserView.vue'),

  // System
  'system/UserManageView.vue': () => import('@/views/system/UserManageView.vue'),
  'system/RoleManagementView.vue': () => import('@/views/system/RoleManagementView.vue'),
  'system/MenuManagementView.vue': () => import('@/views/system/MenuManagementView.vue'),
  'system/SettingsView.vue': () => import('@/views/system/SettingsView.vue'),
  'system/SystemSettingsView.vue': () => import('@/views/system/SystemSettingsView.vue'),
  'system/LogView.vue': () => import('@/views/system/LogView.vue'),
  'system/MonitorView.vue': () => import('@/views/system/MonitorView.vue'),

  // User
  'user/UserListView.vue': () => import('@/views/user/UserListView.vue'),
  'user/UserProfileView.vue': () => import('@/views/user/UserProfileView.vue'),
}

/**
 * 生成组件导入函数
 * @param directory 目录名
 * @param fileName 文件名
 * @returns 组件导入函数
 */
const generateComponent = (directory: string, fileName: string) => {
  const componentPath = `${directory}/${fileName}`
  const component = componentMap[componentPath]

  if (!component) {
    console.warn(`Component not found in componentMap: ${componentPath}`)
    // 返回一个默认的空组件
    return () => Promise.resolve({ default: { template: '<div>Component not found</div>' } })
  }

  return component
}

/**
 * 生成路由路径
 * @param directory 目录名
 * @param fileName 文件名（可选）
 * @returns 路由路径
 */
const generatePath = (directory: string, fileName?: string): string => {
  if (!fileName) {
    return `/${directory}`
  }

  // 特殊处理一些文件名
  const fileNameMap: Record<string, string> = {
    'ProductManageView.vue': 'list',
    'OrderManageView.vue': 'list',
    'UserManageView.vue': 'list',
    'DashboardView.vue': '',
    'LoginView.vue': '',
    'NotFoundView.vue': '',
  }

  if (fileNameMap[fileName]) {
    const subPath = fileNameMap[fileName]
    return subPath ? `/${directory}/${subPath}` : `/${directory}`
  }

  // 默认处理：去掉View后缀，转换为小写
  const baseName = fileName.replace(/\.vue$/, '').replace(/View$/, '')
  const subPath = baseName.toLowerCase()

  return `/${directory}/${subPath}`
}

/**
 * 获取菜单标题
 * @param key 键名（目录名或文件名）
 * @returns 菜单标题
 */
const getTitle = (key: string): string => {
  const titleMap: Record<string, string> = {
    // 目录级别
    dashboard: '仪表盘',
    user: '用户管理',
    product: '商品管理',
    order: '订单管理',
    marketing: '营销管理',
    statistics: '数据统计',
    analytics: '数据分析',
    content: '内容管理',
    service: '客服管理',
    permission: '权限管理',
    help: '帮助中心',
    system: '系统管理',
    auth: '认证管理',
    error: '错误页面',

    // 页面级别
    DashboardView: '仪表盘',
    UserListView: '用户列表',
    UserProfileView: '用户详情',
    ProductManageView: '商品列表',
    CategoryView: '商品分类',
    InventoryView: '库存管理',
    OrderManageView: '订单管理',
    CampaignView: '营销活动',
    CouponView: '优惠券管理',
    SalesView: '销售统计',
    UserView: '用户统计',
    FinanceView: '财务统计',
    DataView: '数据分析',
    ReportView: '报表分析',
    ContentView: '内容管理',
    CustomerServiceView: '客服管理',
    PermissionView: '权限管理',
    HelpView: '帮助中心',
    ProfileView: '个人中心',
    SettingsView: '系统设置',
    SystemSettingsView: '系统配置',
    LogView: '系统日志',
    MonitorView: '系统监控',
    MenuManagementView: '菜单管理',
    RoleManagementView: '角色管理',
    UserManageView: '用户管理',
    LoginView: '登录',
    NotFoundView: '页面不存在',
  }

  // 优先匹配完整的文件名
  if (titleMap[key]) {
    return titleMap[key]
  }

  // 匹配目录名
  const lowerKey = key.toLowerCase()
  if (titleMap[lowerKey]) {
    return titleMap[lowerKey]
  }

  // 如果是Vue文件，去掉View后缀再匹配
  if (key.endsWith('View.vue')) {
    const baseName = key.replace('.vue', '')
    if (titleMap[baseName]) {
      return titleMap[baseName]
    }
  }

  // 默认使用文件名（去掉扩展名和View后缀）
  return key.replace(/\.vue$/, '').replace(/View$/, '')
}

/**
 * 获取图标名称
 * @param key 图标键名
 * @returns 图标名称
 */
const getIcon = (key: string): string => {
  const iconMap: Record<string, string> = {
    dashboard: 'dashboard',
    user: 'user',
    product: 'shopping',
    order: 'file-text',
    marketing: 'gift',
    statistics: 'bar-chart',
    analytics: 'line-chart',
    content: 'file',
    service: 'customer-service',
    permission: 'safety',
    help: 'question-circle',
    system: 'setting',
    auth: 'safety',
    error: 'exception',
  }

  const lowerKey = key.toLowerCase()
  return iconMap[lowerKey] || 'default'
}

/**
 * 根据目录和文件生成路由配置
 * @param directory 目录名
 * @param files 文件列表
 * @returns 路由配置
 */
const generateRouteConfig = (directory: string, files: string[]): RouteConfig => {
  if (files.length === 1) {
    // 单个文件，直接作为路由
    const fileName = files[0]
    return {
      path: generatePath(directory, fileName),
      name: generateRouteName(directory, fileName),
      component: generateComponent(directory, fileName),
      meta: {
        title: getTitle(fileName),
        icon: getIcon(directory),
        requireAuth: true,
      },
    }
  } else {
    // 多个文件，创建父子路由
    const children: RouteConfig[] = files.map((fileName: string) => ({
      path: generatePath(directory, fileName),
      name: generateRouteName(directory, fileName),
      component: generateComponent(directory, fileName),
      meta: {
        title: getTitle(fileName),
        requireAuth: true,
      },
    }))

    return {
      path: `/${directory}`,
      name: generateRouteName(directory),
      meta: {
        title: getTitle(directory),
        icon: getIcon(directory),
        requireAuth: true,
      },
      children,
    }
  }
}

/**
 * 添加特殊路由配置（权限、角色等）
 * @param routeConfig 路由配置
 * @param directory 目录名
 * @returns 更新后的路由配置
 */
const addSpecialMeta = (routeConfig: RouteConfig, directory: string): RouteConfig => {
  // 权限管理和系统管理需要特殊角色
  if (directory === 'permission') {
    routeConfig.meta.roles = ['admin', 'super_admin']
    if (routeConfig.children) {
      routeConfig.children.forEach((child) => {
        child.meta.roles = ['admin', 'super_admin']
      })
    }
  }

  if (directory === 'system') {
    routeConfig.meta.roles = ['admin', 'super_admin']
    if (routeConfig.children) {
      routeConfig.children.forEach((child) => {
        child.meta.roles = ['admin', 'super_admin']
        // 菜单管理和系统设置只有超级管理员可以访问
        if (child.name === 'MenuManagementView' || child.name === 'SystemSettingsView') {
          child.meta.roles = ['admin', 'super_admin']
        }
      })
    }
  }

  // 个人中心和帮助中心设为隐藏
  if (directory === 'profile' || directory === 'help') {
    routeConfig.meta.hidden = true
  }

  return routeConfig
}

/**
 * 生成完整的路由配置
 * @returns 路由配置数组
 */
export const generateRoutes = async (): Promise<RouteConfig[]> => {
  const viewsStructure = await getViewsStructure()
  console.log('viewsStructure', viewsStructure)
  const routes: RouteConfig[] = []

  // 添加登录路由
  if (viewsStructure.auth) {
    routes.push({
      path: '/login',
      name: 'Login',
      component: generateComponent('auth', 'LoginView.vue'),
      meta: {
        title: '登录',
        requireAuth: false,
        hidden: true,
      },
    })
  }

  // 添加错误页面路由
  if (viewsStructure.error) {
    const errors = [
      {
        path: '/404',
        name: 'NotFound',
        component: generateComponent('error', 'NotFoundView.vue'),
        meta: {
          title: '页面不存在',
          requireAuth: false,
          hidden: true,
        },
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
      } as any,
    ]
    routes.push(...errors)
  }

  // 生成主布局路由
  const layoutChildren: RouteConfig[] = []

  // 遍历所有目录生成路由
  Object.entries(viewsStructure).forEach(([directory, files]) => {
    // 跳过认证和错误页面，它们已经单独处理
    if (directory === 'auth' || directory === 'error') {
      return
    }

    const routeConfig = generateRouteConfig(directory, files)
    const finalRouteConfig = addSpecialMeta(routeConfig, directory)
    layoutChildren.push(finalRouteConfig)
  })

  // 添加主布局路由
  routes.push({
    path: '/',
    redirect: (() => layoutChildren.find((item) => item.name === 'Dashboard')?.path)(),
    name: 'Layout',
    component: () => import('@/layouts/BasicLayout.vue'),
    meta: {
      title: '首页',
      requireAuth: true,
    },
    children: layoutChildren,
  })

  return routes
}

/**
 * 将路由配置转换为Vue Router格式
 * @param routes 路由配置数组
 * @returns Vue Router路由配置
 */
export const convertToVueRoutes = (
  routes: RouteConfig[],
): Array<RouteRecordRaw & { meta?: RouteMeta }> => {
  return routes.map((route) => ({
    path: route.path,
    name: route.name,
    component: route.component,
    redirect: route.redirect,
    meta: route.meta,
    children: route.children ? convertToVueRoutes(route.children) : undefined,
  })) as Array<RouteRecordRaw & { meta?: RouteMeta }>
}

/**
 * 生成Vue Router路由配置
 * @returns Vue Router路由配置数组
 */
export const generateVueRoutes = async (): Promise<
  Array<RouteRecordRaw & { meta?: RouteMeta }>
> => {
  const routes = await generateRoutes()
  console.log('routes', routes)

  return convertToVueRoutes(routes)
}
