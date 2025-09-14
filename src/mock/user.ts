/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

/**
 * 性别枚举
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

/**
 * 用户接口
 */
export interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  role: string
  status: UserStatus
  gender?: Gender
  birthday?: string
  department?: string
  bio?: string
  lastLoginTime?: string
  createdAt: string
  updatedAt: string
}

/**
 * 用户统计信息
 */
export interface UserStats {
  loginCount: number
  onlineDays: number
  taskCount: number
  totalUsers: number
  activeUsers: number
  newUsersToday: number
}

/**
 * 登录记录
 */
export interface LoginRecord {
  id: string
  userId: string
  ip: string
  location: string
  device: string
  browser: string
  os: string
  status: 'success' | 'failed'
  loginTime: string
  logoutTime?: string
}

/**
 * 操作记录
 */
export interface OperationRecord {
  id: string
  userId: string
  type: string
  description: string
  ip: string
  userAgent: string
  operationTime: string
  result: 'success' | 'failed'
  details?: Record<string, unknown>
}

/**
 * 用户搜索参数
 */
export interface UserSearchParams {
  username?: string
  email?: string
  phone?: string
  role?: string
  status?: UserStatus
  department?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 创建用户参数
 */
export interface CreateUserParams {
  username: string
  email: string
  phone?: string
  password: string
  role: string
  department?: string
  gender?: Gender
  birthday?: string
  bio?: string
}

/**
 * 更新用户参数
 */
export interface UpdateUserParams {
  username?: string
  email?: string
  phone?: string
  role?: string
  department?: string
  gender?: Gender
  birthday?: string
  bio?: string
  status?: UserStatus
}

/**
 * 修改密码参数
 */
export interface ChangePasswordParams {
  userId: string
  currentPassword?: string
  newPassword: string
  confirmPassword: string
}

/**
 * 批量操作参数
 */
export interface BatchOperationParams {
  userIds: string[]
  operation: 'delete' | 'activate' | 'deactivate' | 'suspend'
  reason?: string
}

/**
 * 生成随机用户数据
 */
const generateUser = (id: string): User => {
  const usernames = [
    'admin',
    'user001',
    'user002',
    'manager',
    'developer',
    'designer',
    'tester',
    'analyst',
  ]
  const roles = ['超级管理员', '管理员', '普通用户', '开发者', '设计师', '测试员', '分析师']
  const departments = ['技术部', '产品部', '设计部', '运营部', '市场部', '人事部', '财务部']
  const statuses = [
    UserStatus.ACTIVE,
    UserStatus.INACTIVE,
    UserStatus.SUSPENDED,
    UserStatus.PENDING,
  ]
  const genders = [Gender.MALE, Gender.FEMALE, Gender.OTHER]

  const username = usernames[Math.floor(Math.random() * usernames.length)] + id
  const role = roles[Math.floor(Math.random() * roles.length)]
  const department = departments[Math.floor(Math.random() * departments.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const gender = genders[Math.floor(Math.random() * genders.length)]

  const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
  const lastLoginTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)

  return {
    id,
    username,
    email: `${username}@example.com`,
    phone: `138${Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, '0')}`,
    avatar:
      Math.random() > 0.5
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        : undefined,
    role,
    status,
    gender,
    birthday: new Date(
      1980 + Math.random() * 30,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    )
      .toISOString()
      .split('T')[0],
    department,
    bio: `这是${username}的个人简介，${role}，负责${department}相关工作。`,
    lastLoginTime: lastLoginTime.toISOString(),
    createdAt: createdAt.toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * 生成登录记录
 */
const generateLoginRecord = (id: string, userId: string): LoginRecord => {
  const locations = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市', '成都市']
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']
  const oses = ['Windows 10', 'Windows 11', 'macOS', 'Ubuntu', 'iOS', 'Android']
  const statuses = ['success', 'failed'] as const

  const location = locations[Math.floor(Math.random() * locations.length)]
  const browser = browsers[Math.floor(Math.random() * browsers.length)]
  const os = oses[Math.floor(Math.random() * oses.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]

  const loginTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  const logoutTime =
    status === 'success' && Math.random() > 0.3
      ? new Date(loginTime.getTime() + Math.random() * 8 * 60 * 60 * 1000)
      : undefined

  return {
    id,
    userId,
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    location,
    device: `${browser} / ${os}`,
    browser,
    os,
    status,
    loginTime: loginTime.toISOString(),
    logoutTime: logoutTime?.toISOString(),
  }
}

/**
 * 生成操作记录
 */
const generateOperationRecord = (id: string, userId: string): OperationRecord => {
  const types = ['登录', '登出', '创建', '修改', '删除', '查看', '导出', '导入']
  const descriptions = [
    '用户登录系统',
    '用户退出系统',
    '创建新用户',
    '修改用户信息',
    '删除用户',
    '查看用户列表',
    '导出用户数据',
    '导入用户数据',
  ]
  const results = ['success', 'failed'] as const

  const typeIndex = Math.floor(Math.random() * types.length)
  const type = types[typeIndex]
  const description = descriptions[typeIndex]
  const result = results[Math.floor(Math.random() * results.length)]

  return {
    id,
    userId,
    type,
    description,
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    operationTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    result,
    details: {
      module: '用户管理',
      action: type,
      target: 'user_' + Math.floor(Math.random() * 1000),
    },
  }
}

// 模拟数据
export const mockUsers: User[] = Array.from({ length: 50 }, (_, index) =>
  generateUser((index + 1).toString()),
)
export const mockLoginRecords: LoginRecord[] = Array.from({ length: 200 }, (_, index) =>
  generateLoginRecord((index + 1).toString(), Math.floor(Math.random() * 50 + 1).toString()),
)
export const mockOperationRecords: OperationRecord[] = Array.from({ length: 300 }, (_, index) =>
  generateOperationRecord((index + 1).toString(), Math.floor(Math.random() * 50 + 1).toString()),
)

// Mock API functions
export const mockGetUserList = (
  params: UserSearchParams = {},
): Promise<{ code: number; message: string; data: { list: User[]; total: number } }> => {
  let filteredUsers = [...mockUsers]

  // 用户名搜索
  if (params.username) {
    filteredUsers = filteredUsers.filter((user) =>
      user.username.toLowerCase().includes(params.username!.toLowerCase()),
    )
  }

  // 邮箱搜索
  if (params.email) {
    filteredUsers = filteredUsers.filter((user) =>
      user.email.toLowerCase().includes(params.email!.toLowerCase()),
    )
  }

  // 手机号搜索
  if (params.phone) {
    filteredUsers = filteredUsers.filter((user) => user.phone?.includes(params.phone!))
  }

  // 角色筛选
  if (params.role) {
    filteredUsers = filteredUsers.filter((user) => user.role === params.role)
  }

  // 状态筛选
  if (params.status) {
    filteredUsers = filteredUsers.filter((user) => user.status === params.status)
  }

  // 部门筛选
  if (params.department) {
    filteredUsers = filteredUsers.filter((user) => user.department === params.department)
  }

  // 日期范围筛选
  if (params.startDate) {
    filteredUsers = filteredUsers.filter((user) => user.createdAt >= params.startDate!)
  }
  if (params.endDate) {
    filteredUsers = filteredUsers.filter((user) => user.createdAt <= params.endDate!)
  }

  // 排序
  if (params.sortBy) {
    filteredUsers.sort((a, b) => {
      const aValue = (a as unknown as Record<string, unknown>)[params.sortBy!] as string | number
      const bValue = (b as unknown as Record<string, unknown>)[params.sortBy!] as string | number
      const order = params.sortOrder === 'desc' ? -1 : 1
      return aValue > bValue ? order : aValue < bValue ? -order : 0
    })
  }

  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      list: filteredUsers.slice(start, end),
      total: filteredUsers.length,
    },
  })
}

export const mockGetUserDetail = (
  userId: string,
): Promise<{ code: number; message: string; data: User | null }> => {
  const user = mockUsers.find((u) => u.id === userId)
  return Promise.resolve({
    code: user ? 200 : 404,
    message: user ? 'success' : '用户不存在',
    data: user || null,
  })
}

export const mockCreateUser = (
  params: CreateUserParams,
): Promise<{ code: number; message: string; data: User }> => {
  // 检查用户名是否已存在
  const existingUser = mockUsers.find(
    (u) => u.username === params.username || u.email === params.email,
  )
  if (existingUser) {
    return Promise.resolve({
      code: 400,
      message: '用户名或邮箱已存在',
      data: null as any,
    })
  }

  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    username: params.username,
    email: params.email,
    phone: params.phone,
    avatar: undefined,
    role: params.role,
    status: UserStatus.ACTIVE,
    gender: params.gender,
    birthday: params.birthday,
    department: params.department,
    bio: params.bio,
    lastLoginTime: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockUsers.unshift(newUser)

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: newUser,
  })
}

export const mockUpdateUser = (
  userId: string,
  params: UpdateUserParams,
): Promise<{ code: number; message: string; data: User | null }> => {
  const index = mockUsers.findIndex((u) => u.id === userId)
  if (index === -1) {
    return Promise.resolve({
      code: 404,
      message: '用户不存在',
      data: null,
    })
  }

  const updatedUser = {
    ...mockUsers[index],
    ...params,
    updatedAt: new Date().toISOString(),
  }

  mockUsers[index] = updatedUser

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: updatedUser,
  })
}

export const mockDeleteUser = (
  userId: string,
): Promise<{ code: number; message: string; data: null }> => {
  const index = mockUsers.findIndex((u) => u.id === userId)
  if (index === -1) {
    return Promise.resolve({
      code: 404,
      message: '用户不存在',
      data: null,
    })
  }

  mockUsers.splice(index, 1)

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
  })
}

export const mockBatchOperateUsers = (
  params: BatchOperationParams,
): Promise<{ code: number; message: string; data: null }> => {
  params.userIds.forEach((userId) => {
    const user = mockUsers.find((u) => u.id === userId)
    if (user) {
      switch (params.operation) {
        case 'delete':
          const index = mockUsers.findIndex((u) => u.id === userId)
          if (index !== -1) mockUsers.splice(index, 1)
          break
        case 'activate':
          user.status = UserStatus.ACTIVE
          user.updatedAt = new Date().toISOString()
          break
        case 'deactivate':
          user.status = UserStatus.INACTIVE
          user.updatedAt = new Date().toISOString()
          break
        case 'suspend':
          user.status = UserStatus.SUSPENDED
          user.updatedAt = new Date().toISOString()
          break
      }
    }
  })

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
  })
}

export const mockChangeUserPassword = (
  params: ChangePasswordParams,
): Promise<{ code: number; message: string; data: null }> => {
  const user = mockUsers.find((u) => u.id === params.userId)
  if (!user) {
    return Promise.resolve({
      code: 404,
      message: '用户不存在',
      data: null,
    })
  }

  if (params.newPassword !== params.confirmPassword) {
    return Promise.resolve({
      code: 400,
      message: '新密码与确认密码不一致',
      data: null,
    })
  }

  user.updatedAt = new Date().toISOString()

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
  })
}

export const mockGetUserStats = (): Promise<{ code: number; message: string; data: UserStats }> => {
  const totalUsers = mockUsers.length
  const activeUsers = mockUsers.filter((u) => u.status === UserStatus.ACTIVE).length
  const today = new Date().toISOString().split('T')[0]
  const newUsersToday = mockUsers.filter((u) => u.createdAt.startsWith(today)).length

  const stats: UserStats = {
    loginCount: Math.floor(Math.random() * 1000) + 500,
    onlineDays: Math.floor(Math.random() * 365) + 100,
    taskCount: Math.floor(Math.random() * 500) + 200,
    totalUsers,
    activeUsers,
    newUsersToday,
  }

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: stats,
  })
}

export const mockGetUserLoginRecords = (
  userId: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<{ code: number; message: string; data: { list: LoginRecord[]; total: number } }> => {
  const userRecords = mockLoginRecords.filter((record) => record.userId === userId)
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      list: userRecords.slice(start, end),
      total: userRecords.length,
    },
  })
}

export const mockGetUserOperationRecords = (
  userId: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<{ code: number; message: string; data: { list: OperationRecord[]; total: number } }> => {
  const userRecords = mockOperationRecords.filter((record) => record.userId === userId)
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      list: userRecords.slice(start, end),
      total: userRecords.length,
    },
  })
}

export const mockExportUsers = (
  params: UserSearchParams = {},
): Promise<{ code: number; message: string; data: { downloadUrl: string } }> => {
  // 模拟导出处理
  const downloadUrl = `https://example.com/exports/users_${Date.now()}.xlsx`

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: { downloadUrl },
  })
}

export const mockImportUsers = (
  file: File,
): Promise<{
  code: number
  message: string
  data: { successCount: number; failCount: number; errors: string[] }
}> => {
  // 模拟导入处理
  const successCount = Math.floor(Math.random() * 50) + 10
  const failCount = Math.floor(Math.random() * 5)
  const errors = failCount > 0 ? [`第${Math.floor(Math.random() * 10) + 1}行：邮箱格式错误`] : []

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      successCount,
      failCount,
      errors,
    },
  })
}
