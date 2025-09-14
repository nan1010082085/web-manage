import type { ApiResponse } from '@/api'
import { faker } from '@faker-js/faker'

/**
 * 用户信息接口
 */
export interface UserInfo {
  /** 用户ID */
  id: string
  /** 用户名 */
  name: string
  /** 昵称 */
  nickname: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone: string
  /** 头像 */
  avatar: string
  /** 角色 */
  role: string
  /** 最后登录时间 */
  lastLogin: string
  /** 创建时间 */
  createdAt: string
}

/**
 * 基本信息接口
 */
export interface BasicInfo {
  /** 姓名 */
  name: string
  /** 昵称 */
  nickname: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone: string
  /** 性别 */
  gender: string
  /** 生日 */
  birthday: string
  /** 个人简介 */
  bio: string
  /** 地址 */
  address: string
}

/**
 * 密码修改表单接口
 */
export interface PasswordForm {
  /** 当前密码 */
  currentPassword: string
  /** 新密码 */
  newPassword: string
  /** 确认密码 */
  confirmPassword: string
}

/**
 * 安全设置接口
 */
export interface SecuritySettings {
  /** Google认证 */
  googleAuth: boolean
  /** 短信认证 */
  smsAuth: boolean
  /** 邮箱认证 */
  emailAuth: boolean
  /** 登录IP限制 */
  ipRestriction: boolean
  /** 会话超时时间（分钟） */
  sessionTimeout: number
}

/**
 * 登录设备接口
 */
export interface LoginDevice {
  /** 设备ID */
  id: string
  /** 设备名称 */
  name: string
  /** 设备类型 */
  type: string
  /** 登录位置 */
  location: string
  /** 最后活跃时间 */
  lastActive: string
  /** 是否当前设备 */
  current: boolean
  /** IP地址 */
  ip: string
  /** 浏览器信息 */
  browser: string
  /** 操作系统 */
  os: string
}

/**
 * 通知设置接口
 */
export interface NotificationSettings {
  /** 系统邮件通知 */
  emailSystem: boolean
  /** 订单邮件通知 */
  emailOrder: boolean
  /** 营销邮件通知 */
  emailMarketing: boolean
  /** 浏览器通知 */
  browserNotification: boolean
  /** 声音通知 */
  soundNotification: boolean
  /** 通知开始时间 */
  startTime: string
  /** 通知结束时间 */
  endTime: string
  /** 短信通知 */
  smsNotification: boolean
  /** 微信通知 */
  wechatNotification: boolean
}

/**
 * 外观设置接口
 */
export interface AppearanceSettings {
  /** 主题 */
  theme: string
  /** 语言 */
  language: string
  /** 紧凑模式 */
  compactMode: boolean
  /** 侧边栏折叠 */
  sidebarCollapsed: boolean
  /** 主色调 */
  primaryColor: string
  /** 字体大小 */
  fontSize: string
}

/**
 * 隐私设置接口
 */
export interface PrivacySettings {
  /** 显示真实姓名 */
  showRealName: boolean
  /** 显示邮箱 */
  showEmail: boolean
  /** 显示手机号 */
  showPhone: boolean
  /** 记录登录历史 */
  recordLoginHistory: boolean
  /** 记录活动日志 */
  recordActivityLog: boolean
  /** 允许搜索 */
  allowSearch: boolean
  /** 数据导出 */
  dataExport: boolean
}

/**
 * 活动记录接口
 */
export interface ActivityItem {
  /** 活动ID */
  id: string
  /** 活动类型 */
  type: string
  /** 活动标题 */
  title: string
  /** 活动描述 */
  description: string
  /** IP地址 */
  ip: string
  /** 设备信息 */
  device: string
  /** 位置 */
  location: string
  /** 状态 */
  status: string
  /** 创建时间 */
  createdAt: string
}

/**
 * 活动筛选参数接口
 */
export interface ActivityFilter {
  /** 活动类型 */
  type?: string
  /** 日期范围 */
  dateRange?: string[]
  /** 状态 */
  status?: string
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 更新基本信息参数接口
 */
export interface UpdateBasicInfoParams {
  /** 姓名 */
  name: string
  /** 昵称 */
  nickname: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone: string
  /** 性别 */
  gender: string
  /** 生日 */
  birthday: string
  /** 个人简介 */
  bio: string
  /** 地址 */
  address: string
}

/**
 * 修改密码参数接口
 */
export interface ChangePasswordParams {
  /** 当前密码 */
  currentPassword: string
  /** 新密码 */
  newPassword: string
}

/**
 * 上传头像参数接口
 */
export interface UploadAvatarParams {
  /** 头像文件 */
  file: File
}

// 模拟数据生成
const activityTypes = [
  'login',
  'logout',
  'password_change',
  'profile_update',
  'security_change',
  'data_export',
  'api_access',
]
const activityTypeNames = [
  '登录',
  '登出',
  '修改密码',
  '更新资料',
  '安全设置',
  '数据导出',
  'API访问',
]
const deviceTypes = ['desktop', 'mobile', 'tablet']
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']
const operatingSystems = ['Windows 11', 'macOS', 'iOS', 'Android', 'Linux']
const statuses = ['success', 'failed', 'warning']
const themes = ['light', 'dark', 'auto']
const languages = ['zh-CN', 'en-US', 'ja-JP']
const fontSizes = ['small', 'medium', 'large']
const primaryColors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2']

/**
 * 生成登录设备
 */
const generateLoginDevice = (): LoginDevice => {
  const type = faker.helpers.arrayElement(deviceTypes)
  const browser = faker.helpers.arrayElement(browsers)
  const os = faker.helpers.arrayElement(operatingSystems)

  return {
    id: faker.string.uuid(),
    name: `${os} - ${browser}`,
    type,
    location: faker.location.city(),
    lastActive: faker.date.recent().toISOString(),
    current: faker.datatype.boolean({ probability: 0.2 }),
    ip: faker.internet.ip(),
    browser,
    os,
  }
}

/**
 * 生成活动记录
 */
const generateActivityItem = (): ActivityItem => {
  const type = faker.helpers.arrayElement(activityTypes)
  const typeIndex = activityTypes.indexOf(type)
  const typeName = activityTypeNames[typeIndex]

  return {
    id: faker.string.uuid(),
    type,
    title: typeName,
    description: faker.lorem.sentence(),
    ip: faker.internet.ip(),
    device: `${faker.helpers.arrayElement(operatingSystems)} - ${faker.helpers.arrayElement(browsers)}`,
    location: faker.location.city(),
    status: faker.helpers.arrayElement(statuses),
    createdAt: faker.date.recent().toISOString(),
  }
}

// 模拟数据存储
export const mockUserInfo: UserInfo = {
  id: '1',
  name: '张三',
  nickname: 'zhangsan',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  avatar: faker.image.avatar(),
  role: '系统管理员',
  lastLogin: faker.date.recent().toISOString(),
  createdAt: faker.date.past().toISOString(),
}

export const mockBasicInfo: BasicInfo = {
  name: '张三',
  nickname: 'zhangsan',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  gender: 'male',
  birthday: '1990-01-01',
  bio: '这是一段个人简介，介绍了用户的基本情况和兴趣爱好。',
  address: '北京市朝阳区某某街道某某号',
}

export const mockSecuritySettings: SecuritySettings = {
  googleAuth: true,
  smsAuth: false,
  emailAuth: true,
  ipRestriction: false,
  sessionTimeout: 30,
}

export const mockLoginDevices = Array.from({ length: 5 }, () => generateLoginDevice())
// 确保有一个当前设备
mockLoginDevices[0].current = true

export const mockNotificationSettings: NotificationSettings = {
  emailSystem: true,
  emailOrder: true,
  emailMarketing: false,
  browserNotification: true,
  soundNotification: true,
  startTime: '09:00',
  endTime: '22:00',
  smsNotification: false,
  wechatNotification: true,
}

export const mockAppearanceSettings: AppearanceSettings = {
  theme: 'light',
  language: 'zh-CN',
  compactMode: false,
  sidebarCollapsed: false,
  primaryColor: '#1890ff',
  fontSize: 'medium',
}

export const mockPrivacySettings: PrivacySettings = {
  showRealName: true,
  showEmail: false,
  showPhone: false,
  recordLoginHistory: true,
  recordActivityLog: true,
  allowSearch: true,
  dataExport: true,
}

export const mockActivityLog = Array.from({ length: 50 }, () => generateActivityItem())

/**
 * 获取用户信息
 */
export const mockGetUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取用户信息', { id: mockUserInfo.id, name: mockUserInfo.name })
      resolve({
        code: 200,
        message: '获取成功',
        data: mockUserInfo,
      })
    }, 300)
  })
}

/**
 * 获取基本信息
 */
export const mockGetBasicInfo = (): Promise<ApiResponse<BasicInfo>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取基本信息', { name: mockBasicInfo.name })
      resolve({
        code: 200,
        message: '获取成功',
        data: mockBasicInfo,
      })
    }, 200)
  })
}

/**
 * 更新基本信息
 */
export const mockUpdateBasicInfo = (params: UpdateBasicInfoParams): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 更新基本信息
      Object.assign(mockBasicInfo, params)

      // 同步更新用户信息
      mockUserInfo.name = params.name
      mockUserInfo.nickname = params.nickname
      mockUserInfo.email = params.email
      mockUserInfo.phone = params.phone

      console.log('Mock: 更新基本信息', { name: params.name })
      resolve({
        code: 200,
        message: '更新成功',
        data: null,
      })
    }, 500)
  })
}

/**
 * 获取安全设置
 */
export const mockGetSecuritySettings = (): Promise<ApiResponse<SecuritySettings>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取安全设置')
      resolve({
        code: 200,
        message: '获取成功',
        data: mockSecuritySettings,
      })
    }, 200)
  })
}

/**
 * 获取登录设备列表
 */
export const mockGetLoginDevices = (): Promise<ApiResponse<LoginDevice[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取登录设备列表', { count: mockLoginDevices.length })
      resolve({
        code: 200,
        message: '获取成功',
        data: mockLoginDevices,
      })
    }, 300)
  })
}

/**
 * 获取通知设置
 */
export const mockGetNotificationSettings = (): Promise<ApiResponse<NotificationSettings>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取通知设置')
      resolve({
        code: 200,
        message: '获取成功',
        data: mockNotificationSettings,
      })
    }, 200)
  })
}

/**
 * 获取活动日志
 */
export const mockGetActivityLog = (filter?: ActivityFilter): Promise<ApiResponse<{ list: ActivityItem[]; total: number }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = filter?.page || 1
      const pageSize = filter?.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      let filteredLog = [...mockActivityLog]
      
      // 按类型过滤
      if (filter?.type) {
        filteredLog = filteredLog.filter(item => item.type === filter.type)
      }
      
      // 按状态过滤
      if (filter?.status) {
        filteredLog = filteredLog.filter(item => item.status === filter.status)
      }
      
      // 按日期范围过滤
      if (filter?.dateRange && filter.dateRange.length === 2) {
        const [startDate, endDate] = filter.dateRange
        filteredLog = filteredLog.filter(item => {
          const itemDate = new Date(item.createdAt)
          return itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
        })
      }
      
      const paginatedLog = filteredLog.slice(start, end)
      
      console.log('Mock: 获取活动日志', { page, pageSize, total: filteredLog.length })
      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: paginatedLog,
          total: filteredLog.length,
        },
      })
    }, 300)
  })
}

/**
 * 导出个人数据
 */
export const mockExportPersonalData = (): Promise<ApiResponse<{ downloadUrl: string; fileName: string }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fileName = `personal_data_${Date.now()}.zip`
      const downloadUrl = `/api/download/${fileName}`
      
      console.log('Mock: 导出个人数据', { fileName })
      resolve({
        code: 200,
        message: '导出成功',
        data: {
          downloadUrl,
          fileName,
        },
      })
    }, 2000) // 模拟较长的处理时间
  })
}
