import { apiGet, apiPost, apiPut } from './index'
import type { ApiResponse } from './index'

// 基础设置接口
export interface BasicSettings {
  siteName: string
  siteDomain: string
  siteDescription: string
  defaultLanguage: string
  timezone: string
  maintenanceMode: boolean
  allowRegistration: boolean
}

// 安全设置接口
export interface SecuritySettings {
  minPasswordLength: number
  maxLoginAttempts: number
  sessionTimeout: number
  passwordExpireDays: number
  enableTwoFactor: boolean
  forceHttps: boolean
  ipWhitelist: string
}

// 通知设置接口
export interface NotificationSettings {
  newUserRegistration: boolean
  systemError: boolean
  securityAlert: boolean
  newOrder: boolean
  lowStock: boolean
  customerService: boolean
  inSiteMessage: boolean
  emailNotification: boolean
  smsNotification: boolean
}

// 邮件设置接口
export interface EmailSettings {
  smtpHost: string
  smtpPort: number
  fromEmail: string
  fromName: string
  username: string
  password: string
  encryption: string
  enabled: boolean
}

// 存储设置接口
export interface StorageSettings {
  driver: string
  localPath: string
  localUrlPrefix: string
  accessKey: string
  secretKey: string
  bucket: string
  region: string
  customDomain: string
  maxFileSize: number
  allowedTypes: string[]
}

// 支付设置接口
export interface PaymentSettings {
  alipay: {
    appId: string
    privateKey: string
    publicKey: string
    enabled: boolean
  }
  wechat: {
    mchId: string
    appId: string
    apiKey: string
    enabled: boolean
  }
}

// API设置接口
export interface ApiSettings {
  version: string
  rateLimit: number
  enableDocs: boolean
  enableCors: boolean
  allowedOrigins: string
  apiKey: string
}

// 备份设置接口
export interface BackupSettings {
  autoBackup: boolean
  frequency: string
  retentionCount: number
  backupTime: string | Date
  backupContent: string[]
  storageLocation: string
}

// 系统设置汇总接口
export interface SystemSettings {
  basic: BasicSettings
  security: SecuritySettings
  notification: NotificationSettings
  email: EmailSettings
  storage: StorageSettings
  payment: PaymentSettings
  api: ApiSettings
  backup: BackupSettings
}

/**
 * 获取系统设置
 */
export const getSystemSettings = (): Promise<ApiResponse<SystemSettings>> => {
  return apiGet<SystemSettings>('/system/settings')
}

/**
 * 获取基础设置
 */
export const getBasicSettings = (): Promise<ApiResponse<BasicSettings>> => {
  return apiGet<BasicSettings>('/system/settings/basic')
}

/**
 * 更新基础设置
 */
export const updateBasicSettings = (params: Partial<BasicSettings>): Promise<ApiResponse<BasicSettings>> => {
  return apiPut<BasicSettings>('/system/settings/basic', params)
}

/**
 * 获取安全设置
 */
export const getSecuritySettings = (): Promise<ApiResponse<SecuritySettings>> => {
  return apiGet<SecuritySettings>('/system/settings/security')
}

/**
 * 更新安全设置
 */
export const updateSecuritySettings = (params: Partial<SecuritySettings>): Promise<ApiResponse<SecuritySettings>> => {
  return apiPut<SecuritySettings>('/system/settings/security', params)
}

/**
 * 获取通知设置
 */
export const getNotificationSettings = (): Promise<ApiResponse<NotificationSettings>> => {
  return apiGet<NotificationSettings>('/system/settings/notification')
}

/**
 * 更新通知设置
 */
export const updateNotificationSettings = (params: Partial<NotificationSettings>): Promise<ApiResponse<NotificationSettings>> => {
  return apiPut<NotificationSettings>('/system/settings/notification', params)
}

/**
 * 获取邮件设置
 */
export const getEmailSettings = (): Promise<ApiResponse<EmailSettings>> => {
  return apiGet<EmailSettings>('/system/settings/email')
}

/**
 * 更新邮件设置
 */
export const updateEmailSettings = (params: Partial<EmailSettings>): Promise<ApiResponse<EmailSettings>> => {
  return apiPut<EmailSettings>('/system/settings/email', params)
}

/**
 * 测试邮件连接
 */
export const testEmailConnection = (params: EmailSettings): Promise<ApiResponse<{ success: boolean }>> => {
  return apiPost<{ success: boolean }>('/system/settings/email/test', params)
}

/**
 * 获取存储设置
 */
export const getStorageSettings = (): Promise<ApiResponse<StorageSettings>> => {
  return apiGet<StorageSettings>('/system/settings/storage')
}

/**
 * 更新存储设置
 */
export const updateStorageSettings = (params: Partial<StorageSettings>): Promise<ApiResponse<StorageSettings>> => {
  return apiPut<StorageSettings>('/system/settings/storage', params)
}

/**
 * 测试存储连接
 */
export const testStorageConnection = (params: StorageSettings): Promise<ApiResponse<{ success: boolean }>> => {
  return apiPost<{ success: boolean }>('/system/settings/storage/test', params)
}

/**
 * 获取支付设置
 */
export const getPaymentSettings = (): Promise<ApiResponse<PaymentSettings>> => {
  return apiGet<PaymentSettings>('/system/settings/payment')
}

/**
 * 更新支付设置
 */
export const updatePaymentSettings = (params: Partial<PaymentSettings>): Promise<ApiResponse<PaymentSettings>> => {
  return apiPut<PaymentSettings>('/system/settings/payment', params)
}

/**
 * 获取API设置
 */
export const getApiSettings = (): Promise<ApiResponse<ApiSettings>> => {
  return apiGet<ApiSettings>('/system/settings/api')
}

/**
 * 更新API设置
 */
export const updateApiSettings = (params: Partial<ApiSettings>): Promise<ApiResponse<ApiSettings>> => {
  return apiPut<ApiSettings>('/system/settings/api', params)
}

/**
 * 获取备份设置
 */
export const getBackupSettings = (): Promise<ApiResponse<BackupSettings>> => {
  return apiGet<BackupSettings>('/system/settings/backup')
}

/**
 * 更新备份设置
 */
export const updateBackupSettings = (params: Partial<BackupSettings>): Promise<ApiResponse<BackupSettings>> => {
  return apiPut<BackupSettings>('/system/settings/backup', params)
}

/**
 * 创建备份
 */
export const createBackup = (): Promise<ApiResponse<{ success: boolean; backupId: string }>> => {
  return apiPost<{ success: boolean; backupId: string }>('/system/backup/create')
}

/**
 * 更新所有设置
 */
export const updateAllSettings = (params: Partial<SystemSettings>): Promise<ApiResponse<SystemSettings>> => {
  return apiPut<SystemSettings>('/system/settings', params)
}