import { apiGet, apiPost, apiPut, apiDelete } from './index'
import type { ApiResponse } from './index'
import type {
  UserInfo,
  BasicInfo,
  SecuritySettings,
  LoginDevice,
  NotificationSettings,
  AppearanceSettings,
  PrivacySettings,
  ActivityItem,
  ActivityFilter,
  UpdateBasicInfoParams,
  ChangePasswordParams,
  UploadAvatarParams,
} from '@/mock/profile'
import { mockGetBasicInfo, mockGetActivityLog, mockExportPersonalData } from '@/mock/profile'

/**
 * 获取用户信息
 * @returns 用户信息
 */
export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return apiGet('/profile/user-info')
}

/**
 * 获取基本信息
 * @returns 基本信息
 */
export const getBasicInfo = (): Promise<ApiResponse<BasicInfo>> => {
  return apiGet('/profile/basic-info', {}, mockGetBasicInfo)
}

/**
 * 更新基本信息
 * @param params 基本信息参数
 * @returns 操作结果
 */
export const updateBasicInfo = (params: UpdateBasicInfoParams): Promise<ApiResponse<null>> => {
  return apiPut('/profile/basic-info', params)
}

/**
 * 修改密码
 * @param params 密码参数
 * @returns 操作结果
 */
export const changePassword = (params: ChangePasswordParams): Promise<ApiResponse<null>> => {
  return apiPost('/profile/change-password', params)
}

/**
 * 上传头像
 * @param params 头像文件参数
 * @returns 头像URL
 */
export const uploadAvatar = (params: UploadAvatarParams): Promise<ApiResponse<{ url: string }>> => {
  const formData = new FormData()
  formData.append('avatar', params.file)

  return apiPost('/profile/upload-avatar', formData)
}

/**
 * 获取安全设置
 * @returns 安全设置
 */
export const getSecuritySettings = (): Promise<ApiResponse<SecuritySettings>> => {
  return apiGet('/profile/security-settings')
}

/**
 * 更新安全设置
 * @param params 安全设置参数
 * @returns 操作结果
 */
export const updateSecuritySettings = (
  params: Partial<SecuritySettings>,
): Promise<ApiResponse<null>> => {
  return apiPut('/profile/security-settings', params)
}

/**
 * 获取登录设备列表
 * @returns 登录设备列表
 */
export const getLoginDevices = (): Promise<ApiResponse<LoginDevice[]>> => {
  return apiGet('/profile/login-devices')
}

/**
 * 移除登录设备
 * @param deviceId 设备ID
 * @returns 操作结果
 */
export const removeLoginDevice = (deviceId: string): Promise<ApiResponse<null>> => {
  return apiDelete(`/profile/login-devices/${deviceId}`)
}

/**
 * 获取通知设置
 * @returns 通知设置
 */
export const getNotificationSettings = (): Promise<ApiResponse<NotificationSettings>> => {
  return apiGet('/profile/notification-settings')
}

/**
 * 更新通知设置
 * @param params 通知设置参数
 * @returns 操作结果
 */
export const updateNotificationSettings = (
  params: Partial<NotificationSettings>,
): Promise<ApiResponse<null>> => {
  return apiPut('/profile/notification-settings', params)
}

/**
 * 获取外观设置
 * @returns 外观设置
 */
export const getAppearanceSettings = (): Promise<ApiResponse<AppearanceSettings>> => {
  return apiGet('/profile/appearance-settings')
}

/**
 * 更新外观设置
 * @param params 外观设置参数
 * @returns 操作结果
 */
export const updateAppearanceSettings = (
  params: Partial<AppearanceSettings>,
): Promise<ApiResponse<null>> => {
  return apiPut('/profile/appearance-settings', params)
}

/**
 * 获取隐私设置
 * @returns 隐私设置
 */
export const getPrivacySettings = (): Promise<ApiResponse<PrivacySettings>> => {
  return apiGet('/profile/privacy-settings')
}

/**
 * 更新隐私设置
 * @param params 隐私设置参数
 * @returns 操作结果
 */
export const updatePrivacySettings = (
  params: Partial<PrivacySettings>,
): Promise<ApiResponse<null>> => {
  return apiPut('/profile/privacy-settings', params)
}

/**
 * 获取活动记录
 * @param params 筛选参数
 * @returns 活动记录列表
 */
export const getActivityLog = (
  params: ActivityFilter = {},
): Promise<ApiResponse<{ list: ActivityItem[]; total: number }>> => {
  return apiGet('/profile/activity-log', params as Record<string, unknown>, () =>
    mockGetActivityLog(params),
  )
}

/**
 * 导出个人数据
 * @returns 下载链接
 */
export const exportPersonalData = (): Promise<ApiResponse<{ downloadUrl: string }>> => {
  return apiPost('/profile/export-data', {}, mockExportPersonalData)
}

/**
 * 删除账户
 * @param password 确认密码
 * @returns 操作结果
 */
export const deleteAccount = (password: string): Promise<ApiResponse<null>> => {
  return apiDelete('/profile/account', { password })
}

// 导出类型
export type {
  UserInfo,
  BasicInfo,
  SecuritySettings,
  LoginDevice,
  NotificationSettings,
  AppearanceSettings,
  PrivacySettings,
  ActivityItem,
  ActivityFilter,
  UpdateBasicInfoParams,
  ChangePasswordParams,
  UploadAvatarParams,
}
