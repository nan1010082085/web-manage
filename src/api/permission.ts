import { apiGet, apiPost, apiPut, apiDelete } from './index'
import type { ApiResponse } from './index'
import type {
  PermissionOverview,
  Permission,
  Role,
  User,
  RoleSearchParams,
  UserSearchParams,
  CreateRoleParams,
  UpdateRoleParams,
  CreatePermissionParams,
  UpdatePermissionParams,
  AssignUserRoleParams,
} from '@/mock/permission'
import {
  mockGetPermissionOverview,
  mockGetPermissionTree,
  mockGetRoleList,
  mockGetUserList,
  mockGetRoleDetail,
  mockCreateRole,
  mockUpdateRole,
  mockDeleteRole,
  mockCreatePermission,
  mockUpdatePermission,
  mockDeletePermission,
  mockAssignUserRole,
  mockBatchDeleteRoles,
  mockBatchDeleteUsers,
  mockResetUserPassword,
  mockToggleUserLock,
  mockGetUserPermissions,
  mockCheckUserPermission,
} from '@/mock/permission'

/**
 * 获取权限统计概览
 */
export const getPermissionOverview = (): Promise<ApiResponse<PermissionOverview>> => {
  return apiGet<PermissionOverview>('/permission/overview', undefined, mockGetPermissionOverview)
}

/**
 * 获取权限树
 */
export const getPermissionTree = (): Promise<ApiResponse<Permission[]>> => {
  return apiGet<Permission[]>('/permission/tree', undefined, mockGetPermissionTree)
}

/**
 * 获取角色列表
 * @param params 搜索参数
 */
export const getRoleList = (
  params: RoleSearchParams = {},
): Promise<ApiResponse<{ list: Role[]; total: number }>> => {
  return apiGet<{ list: Role[]; total: number }>(
    '/permission/roles',
    params as Record<string, unknown>,
    () => mockGetRoleList(params),
  )
}

/**
 * 获取用户列表
 * @param params 搜索参数
 */
export const getUserList = (
  params: UserSearchParams = {},
): Promise<ApiResponse<{ list: User[]; total: number }>> => {
  return apiGet<{ list: User[]; total: number }>(
    '/permission/users',
    params as Record<string, unknown>,
    () => mockGetUserList(params),
  )
}

/**
 * 获取角色详情
 * @param id 角色ID
 */
export const getRoleDetail = (id: string): Promise<ApiResponse<Role>> => {
  return apiGet<Role>(`/permission/roles/${id}`, undefined, () => mockGetRoleDetail(id))
}

/**
 * 创建角色
 * @param params 创建参数
 */
export const createRole = (params: CreateRoleParams): Promise<ApiResponse<Role>> => {
  return apiPost<Role>('/permission/roles', params, () => mockCreateRole(params))
}

/**
 * 更新角色
 * @param params 更新参数
 */
export const updateRole = (params: UpdateRoleParams): Promise<ApiResponse<Role>> => {
  return apiPut<Role>(`/permission/roles/${params.id}`, params, () => mockUpdateRole(params))
}

/**
 * 删除角色
 * @param id 角色ID
 */
export const deleteRole = (id: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/permission/roles/${id}`, undefined, () => mockDeleteRole(id))
}

/**
 * 创建权限
 * @param params 创建参数
 */
export const createPermission = (
  params: CreatePermissionParams,
): Promise<ApiResponse<Permission>> => {
  return apiPost<Permission>('/permission/permissions', params, () => mockCreatePermission(params))
}

/**
 * 更新权限
 * @param params 更新参数
 */
export const updatePermission = (
  params: UpdatePermissionParams,
): Promise<ApiResponse<Permission>> => {
  return apiPut<Permission>(`/permission/permissions/${params.id}`, params, () =>
    mockUpdatePermission(params),
  )
}

/**
 * 删除权限
 * @param id 权限ID
 */
export const deletePermission = (id: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/permission/permissions/${id}`, undefined, () => mockDeletePermission(id))
}

/**
 * 分配用户角色
 * @param params 分配参数
 */
export const assignUserRole = (params: AssignUserRoleParams): Promise<ApiResponse<null>> => {
  return apiPost<null>('/permission/users/assign-role', params, () => mockAssignUserRole(params))
}

/**
 * 批量删除角色
 * @param ids 角色ID列表
 */
export const batchDeleteRoles = (ids: string[]): Promise<ApiResponse<null>> => {
  return apiDelete<null>('/permission/roles/batch', { ids }, () => mockBatchDeleteRoles(ids))
}

/**
 * 批量删除用户
 * @param ids 用户ID列表
 */
export const batchDeleteUsers = (ids: string[]): Promise<ApiResponse<null>> => {
  return apiDelete<null>('/permission/users/batch', { ids }, () => mockBatchDeleteUsers(ids))
}

/**
 * 重置用户密码
 * @param userId 用户ID
 * @param newPassword 新密码
 */
export const resetUserPassword = (
  userId: string,
  newPassword: string,
): Promise<ApiResponse<null>> => {
  return apiPost<null>(`/permission/users/${userId}/reset-password`, { newPassword }, () =>
    mockResetUserPassword(userId, newPassword),
  )
}

/**
 * 锁定/解锁用户
 * @param userId 用户ID
 * @param locked 是否锁定
 */
export const toggleUserLock = (userId: string, locked: boolean): Promise<ApiResponse<null>> => {
  return apiPost<null>(`/permission/users/${userId}/toggle-lock`, { locked }, () =>
    mockToggleUserLock(userId, locked),
  )
}

/**
 * 获取用户权限
 * @param userId 用户ID
 */
export const getUserPermissions = (userId: string): Promise<ApiResponse<Permission[]>> => {
  return apiGet<Permission[]>(`/permission/users/${userId}/permissions`, undefined, () =>
    mockGetUserPermissions(userId),
  )
}

/**
 * 检查用户权限
 * @param userId 用户ID
 * @param permission 权限标识
 */
export const checkUserPermission = (
  userId: string,
  permission: string,
): Promise<ApiResponse<boolean>> => {
  return apiGet<boolean>(`/permission/users/${userId}/check`, { permission }, () =>
    mockCheckUserPermission(userId, permission),
  )
}
