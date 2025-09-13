/**
 * 用户相关 API 接口
 */

import { apiGet, apiPost, apiPut, apiDelete } from './index'
import {
  mockLogin,
  mockGetUserInfo,
  mockGetUserList,
  type UserInfo,
  type LoginRequest,
  type LoginResponse,
  type UserListParams,
} from '@/mock/user'
import type { ApiResponse, PaginationResponse } from './index'

/**
 * 用户登录
 * @param loginData 登录数据
 * @returns 登录响应
 */
export const login = (loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  return apiPost<LoginResponse>('/auth/login', loginData, mockLogin)
}

/**
 * 用户登出
 * @returns 登出响应
 */
export const logout = (): Promise<ApiResponse<null>> => {
  return apiPost<null>('/auth/logout')
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export const getCurrentUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return apiGet<UserInfo>('/user/info', undefined, () => {
    const token = localStorage.getItem('token') || ''
    return mockGetUserInfo(token)
  })
}

/**
 * 获取用户列表
 * @param params 查询参数
 * @returns 用户列表
 */
export const getUserList = (
  params?: UserListParams,
): Promise<ApiResponse<PaginationResponse<UserInfo>>> => {
  return apiGet<PaginationResponse<UserInfo>>('/user/list', params, mockGetUserList)
}

/**
 * 获取用户详情
 * @param userId 用户ID
 * @returns 用户详情
 */
export const getUserDetail = (userId: string): Promise<ApiResponse<UserInfo>> => {
  return apiGet<UserInfo>(`/user/${userId}`)
}

/**
 * 创建用户
 * @param userData 用户数据
 * @returns 创建结果
 */
export const createUser = (userData: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> => {
  return apiPost<UserInfo>('/user', userData)
}

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param userData 用户数据
 * @returns 更新结果
 */
export const updateUser = (
  userId: string,
  userData: Partial<UserInfo>,
): Promise<ApiResponse<UserInfo>> => {
  return apiPut<UserInfo>(`/user/${userId}`, userData)
}

/**
 * 删除用户
 * @param userId 用户ID
 * @returns 删除结果
 */
export const deleteUser = (userId: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/user/${userId}`)
}

/**
 * 批量删除用户
 * @param userIds 用户ID列表
 * @returns 删除结果
 */
export const batchDeleteUsers = (userIds: string[]): Promise<ApiResponse<null>> => {
  return apiDelete<null>('/user/batch', { ids: userIds })
}

/**
 * 重置用户密码
 * @param userId 用户ID
 * @param newPassword 新密码
 * @returns 重置结果
 */
export const resetUserPassword = (
  userId: string,
  newPassword: string,
): Promise<ApiResponse<null>> => {
  return apiPut<null>(`/user/${userId}/password`, { password: newPassword })
}

/**
 * 修改用户状态
 * @param userId 用户ID
 * @param status 用户状态
 * @returns 修改结果
 */
export const updateUserStatus = (
  userId: string,
  status: 'active' | 'inactive' | 'banned',
): Promise<ApiResponse<null>> => {
  return apiPut<null>(`/user/${userId}/status`, { status })
}

/**
 * 获取用户权限
 * @param userId 用户ID
 * @returns 用户权限
 */
export const getUserPermissions = (userId: string): Promise<ApiResponse<string[]>> => {
  return apiGet<string[]>(`/user/${userId}/permissions`)
}

/**
 * 更新用户权限
 * @param userId 用户ID
 * @param permissions 权限列表
 * @returns 更新结果
 */
export const updateUserPermissions = (
  userId: string,
  permissions: string[],
): Promise<ApiResponse<null>> => {
  return apiPut<null>(`/user/${userId}/permissions`, { permissions })
}
