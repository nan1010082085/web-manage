import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import type { UserInfo, LoginForm, LoginResponse } from '@/types'
import { STORAGE_KEYS } from '@/constants'
import { post } from '@/utils/request'
import router from '@/router'

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>('')
  const isLoggedIn = computed(() => !!token.value)

  /**
   * 初始化用户信息
   */
  const initUserInfo = () => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const savedUserInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO)
    
    if (savedToken) {
      token.value = savedToken
    }
    
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        clearUserInfo()
      }
    }
  }

  /**
   * 用户登录
   */
  const login = async (loginForm: LoginForm): Promise<boolean> => {
    try {
      const response = await post<LoginResponse>('/auth/login', loginForm)
      
      if (response.code === 200) {
        const { token: newToken, userInfo: newUserInfo } = response.data
        
        // 保存到状态
        token.value = newToken
        userInfo.value = newUserInfo
        
        // 保存到本地存储
        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken)
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(newUserInfo))
        
        message.success('登录成功')
        return true
      } else {
        message.error(response.message || '登录失败')
        return false
      }
    } catch (error) {
      console.error('登录失败:', error)
      message.error('登录失败，请稍后重试')
      return false
    }
  }

  /**
   * 用户登出
   */
  const logout = async (): Promise<void> => {
    try {
      await post('/auth/logout')
    } catch (error) {
      console.error('登出请求失败:', error)
    } finally {
      clearUserInfo()
      message.success('已退出登录')
      router.push('/login')
    }
  }

  /**
   * 清除用户信息
   */
  const clearUserInfo = (): void => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_INFO)
  }

  /**
   * 获取用户信息
   */
  const getUserInfo = async (): Promise<void> => {
    try {
      const response = await post<UserInfo>('/auth/userinfo')
      
      if (response.code === 200) {
        userInfo.value = response.data
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.data))
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      clearUserInfo()
    }
  }

  /**
   * 更新用户信息
   */
  const updateUserInfo = (newUserInfo: Partial<UserInfo>): void => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...newUserInfo }
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo.value))
    }
  }

  /**
   * 检查权限
   */
  const hasPermission = (permission: string): boolean => {
    return userInfo.value?.permissions?.includes(permission) || false
  }

  /**
   * 检查角色
   */
  const hasRole = (role: string): boolean => {
    return userInfo.value?.role === role
  }

  /**
   * 检查多个角色
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return userInfo.value ? roles.includes(userInfo.value.role) : false
  }

  return {
    // 状态
    userInfo,
    token,
    isLoggedIn,
    
    // 方法
    initUserInfo,
    login,
    logout,
    clearUserInfo,
    getUserInfo,
    updateUserInfo,
    hasPermission,
    hasRole,
    hasAnyRole,
  }
})