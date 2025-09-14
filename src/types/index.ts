/**
 * 通用类型定义
 */
import type { Component } from 'vue'

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  role: string
  permissions: string[]
  status: 'active' | 'inactive'
  phone?: string
  remark?: string
  createTime: string
  updateTime: string
}

/**
 * 登录表单接口
 */
export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

/**
 * 登录响应接口
 */
export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

/**
 * 菜单项接口
 */
export interface MenuItem {
  key: string
  title: string
  path?: string
  icon?: Component | string
  component?: string
  permission?: string
  disabled?: boolean
  children?: MenuItem[]
}



/**
 * 路由元信息接口
 */
export interface RouteMeta {
  title: string
  requireAuth?: boolean
  roles?: string[]
  hidden?: boolean
  keepAlive?: boolean
  icon?: string
}

/**
 * 面包屑项接口
 */
export interface BreadcrumbItem {
  title: string
  path?: string
}

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  primaryColor: string
  layout: 'side' | 'top' | 'mix'
  theme: 'light' | 'dark'
  fixedHeader: boolean
  fixedSider: boolean
  colorWeak: boolean
  showQuickActions?: boolean
  showStatusBar?: boolean
}