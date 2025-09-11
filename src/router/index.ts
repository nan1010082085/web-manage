import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { STORAGE_KEYS } from '@/constants'
import type { RouteMeta } from '@/types'
import { generateVueRoutes } from '@/utils/routeGenerator'

/**
 * 基础路由配置
 */
const baseRoutes: Array<RouteRecordRaw & { meta?: RouteMeta }> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: '登录',
      requireAuth: false,
      hidden: true,
    },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: {
      title: '页面不存在',
      hidden: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

/**
 * 初始化路由配置
 */
const initializeRoutes = async (): Promise<Array<RouteRecordRaw & { meta?: RouteMeta }>> => {
  try {
    // 生成动态路由
    return await generateVueRoutes()
  } catch (error) {
    console.error('Failed to generate routes:', error)
    return baseRoutes
  }
}

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: baseRoutes, // 先使用基础路由
})

// 异步添加动态路由
initializeRoutes()
  .then((routes) => {
    // 清除现有路由
    router.getRoutes().forEach((route) => {
      if (route.name) {
        router.removeRoute(route.name)
      }
    })

    // 添加新路由
    routes.forEach((route) => {
      router.addRoute(route)
    })
  })
  .catch((error) => {
    console.error('Failed to initialize routes:', error)
  })

/**
 * 路由守卫
 */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  const requireAuth = to.meta?.requireAuth !== false

  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
  }

  // 检查登录状态
  if (requireAuth && !token) {
    next('/login')
    return
  }

  // 已登录用户访问登录页，重定向到首页
  if (to.path === '/login' && token) {
    next({ name: 'Dashboard' })
    return
  }

  // 角色权限检查
  if (to.meta?.roles && Array.isArray(to.meta.roles) && token) {
    const userInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO) || '{}')
    const userRole = userInfo.role

    if (!to.meta.roles.includes(userRole)) {
      next('/404')
      return
    }
  }

  next()
})

export default router
