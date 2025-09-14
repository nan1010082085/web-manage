import { apiGet, apiPost, apiPut, apiDelete, type ApiResponse } from './index'
import {
  type User,
  type UserStats,
  type LoginRecord,
  type OperationRecord,
  type UserSearchParams,
  type CreateUserParams,
  type UpdateUserParams,
  type ChangePasswordParams,
  type BatchOperationParams,
  UserStatus,
  Gender,
  mockGetUserList,
  mockGetUserDetail,
  mockCreateUser,
  mockUpdateUser,
  mockDeleteUser,
  mockBatchOperateUsers,
  mockChangeUserPassword,
  mockGetUserStats,
  mockGetUserLoginRecords,
  mockGetUserOperationRecords,
  mockExportUsers,
  mockImportUsers,
} from '@/mock/user'

/**
 * 获取用户列表
 * @param params 搜索参数
 * @returns 用户列表响应
 */
export const getUserList = async (
  params: UserSearchParams = {},
): Promise<ApiResponse<{ list: User[]; total: number }>> => {
  return apiGet<{ list: User[]; total: number }>('/api/users', params as Record<string, unknown>, (args) => mockGetUserList(args as UserSearchParams))
}

/**
 * 获取用户详情
 * @param userId 用户ID
 * @returns 用户详情响应
 */
export const getUserDetail = async (userId: string): Promise<ApiResponse<User>> => {
  return apiGet<User>(`/api/users/${userId}`, {}, (...args) => mockGetUserDetail(userId))
}

/**
 * 创建用户
 * @param params 创建参数
 * @returns 创建结果响应
 */
export const createUser = async (params: CreateUserParams): Promise<ApiResponse<User>> => {
  return apiPost<User>('/api/users', params, (...args) => mockCreateUser(args[0] as CreateUserParams))
}

/**
 * 更新用户
 * @param userId 用户ID
 * @param params 更新参数
 * @returns 更新结果响应
 */
export const updateUser = async (
  userId: string,
  params: UpdateUserParams,
): Promise<ApiResponse<User>> => {
  return apiPut<User>(`/api/users/${userId}`, params, (...args) => mockUpdateUser(userId, args[0] as UpdateUserParams))
}

/**
 * 删除用户
 * @param userId 用户ID
 * @returns 删除结果响应
 */
export const deleteUser = async (userId: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/api/users/${userId}`, {}, (...args) => mockDeleteUser(userId))
}

/**
 * 批量操作用户
 * @param params 批量操作参数
 * @returns 操作结果响应
 */
export const batchOperateUsers = async (
  params: BatchOperationParams,
): Promise<ApiResponse<null>> => {
  return apiPost<null>('/api/users/batch', params, (...args) => mockBatchOperateUsers(args[0] as BatchOperationParams))
}

/**
 * 修改用户密码
 * @param params 密码修改参数
 * @returns 修改结果响应
 */
export const changeUserPassword = async (
  params: ChangePasswordParams,
): Promise<ApiResponse<null>> => {
  return apiPut<null>('/api/users/password', params, (...args) => mockChangeUserPassword(args[0] as ChangePasswordParams))
}

/**
 * 获取用户统计信息
 * @returns 统计信息响应
 */
export const getUserStats = async (): Promise<ApiResponse<UserStats>> => {
  return apiGet<UserStats>('/api/users/stats', {}, mockGetUserStats)
}

/**
 * 获取用户登录记录
 * @param userId 用户ID
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 登录记录响应
 */
export const getUserLoginRecords = async (
  userId: string,
  page = 1,
  pageSize = 10,
): Promise<ApiResponse<{ list: LoginRecord[]; total: number }>> => {
  return apiGet<{ list: LoginRecord[]; total: number }>(
    `/api/users/${userId}/login-records`,
    { page, pageSize },
    (...args) => mockGetUserLoginRecords(userId, page, pageSize),
  )
}

/**
 * 获取用户操作记录
 * @param userId 用户ID
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 操作记录响应
 */
export const getUserOperationRecords = async (
  userId: string,
  page = 1,
  pageSize = 10,
): Promise<ApiResponse<{ list: OperationRecord[]; total: number }>> => {
  return apiGet<{ list: OperationRecord[]; total: number }>(
    `/api/users/${userId}/operation-records`,
    { page, pageSize },
    (...args) => mockGetUserOperationRecords(userId, page, pageSize),
  )
}

/**
 * 导出用户数据
 * @param params 搜索参数
 * @returns 导出结果响应
 */
export const exportUsers = async (
  params: UserSearchParams = {},
): Promise<ApiResponse<{ downloadUrl: string }>> => {
  return apiPost<{ downloadUrl: string }>('/api/users/export', params, (...args) => mockExportUsers(args[0] as UserSearchParams))
}

/**
 * 导入用户数据
 * @param file 文件对象
 * @returns 导入结果响应
 */
export const importUsers = async (
  file: File,
): Promise<ApiResponse<{ successCount: number; failCount: number; errors: string[] }>> => {
  const formData = new FormData()
  formData.append('file', file)

  return apiPost<{ successCount: number; failCount: number; errors: string[] }>(
    '/api/users/import',
    formData,
    (...args) => mockImportUsers(file),
  )
}

// 导出类型
export type {
  User,
  UserStats,
  LoginRecord,
  OperationRecord,
  UserSearchParams,
  CreateUserParams,
  UpdateUserParams,
  ChangePasswordParams,
  BatchOperationParams,
}

export { UserStatus, Gender }
