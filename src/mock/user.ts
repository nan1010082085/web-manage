/**
 * 用户相关 Mock 数据
 */

import {
  createSuccessResponse,
  createErrorResponse,
  createPaginationData,
  generateId,
  randomNumber,
  randomDate,
  randomChoice,
  mockDelay,
  mockLog,
  type MockResponse,
  type PaginationData,
} from './index'

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  role: string
  status: 'active' | 'inactive' | 'banned'
  createTime: string
  updateTime: string
  lastLoginTime: string
}

/**
 * 登录请求接口
 */
export interface LoginRequest {
  username: string
  password: string
  captcha?: string
}

/**
 * 登录响应接口
 */
export interface LoginResponse {
  token: string
  userInfo: UserInfo
  permissions: string[]
  menus: any[]
}

/**
 * 用户列表查询参数
 */
export interface UserListParams {
  page?: number
  pageSize?: number
  keyword?: string
  role?: string
  status?: string
}

/**
 * 模拟用户数据
 */
const mockUsers: UserInfo[] = [
  {
    id: 'user_001',
    username: 'admin',
    nickname: '系统管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    role: 'admin',
    status: 'active',
    createTime: '2023-01-01T00:00:00.000Z',
    updateTime: '2024-01-01T00:00:00.000Z',
    lastLoginTime: new Date().toISOString(),
  },
  {
    id: 'user_002',
    username: 'manager',
    nickname: '运营经理',
    email: 'manager@example.com',
    phone: '13800138001',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    role: 'manager',
    status: 'active',
    createTime: '2023-02-01T00:00:00.000Z',
    updateTime: '2024-01-01T00:00:00.000Z',
    lastLoginTime: randomDate(),
  },
  {
    id: 'user_003',
    username: 'editor',
    nickname: '内容编辑',
    email: 'editor@example.com',
    phone: '13800138002',
    avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    role: 'editor',
    status: 'active',
    createTime: '2023-03-01T00:00:00.000Z',
    updateTime: '2024-01-01T00:00:00.000Z',
    lastLoginTime: randomDate(),
  },
]

// 生成更多模拟用户
for (let i = 4; i <= 50; i++) {
  mockUsers.push({
    id: generateId('user'),
    username: `user${i.toString().padStart(3, '0')}`,
    nickname: `用户${i}`,
    email: `user${i}@example.com`,
    phone: `138${randomNumber(10000000, 99999999)}`,
    avatar: `https://avatars.githubusercontent.com/u/${i}?v=4`,
    role: randomChoice(['user', 'editor', 'manager']),
    status: randomChoice(['active', 'inactive', 'banned']),
    createTime: randomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
    updateTime: randomDate(new Date(2024, 0, 1), new Date()),
    lastLoginTime: randomDate(new Date(2024, 0, 1), new Date()),
  })
}

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应
 */
export const mockLogin = async (params: LoginRequest): Promise<MockResponse<LoginResponse>> => {
  await mockDelay()

  const { username, password } = params

  // 模拟登录验证
  const user = mockUsers.find((u) => u.username === username)

  if (!user) {
    const response = createErrorResponse(
      '用户不存在',
      404,
    ) as unknown as MockResponse<LoginResponse>
    mockLog('POST', '/api/auth/login', response)
    return response
  }

  if (password !== '123456') {
    const response = createErrorResponse('密码错误', 401) as unknown as MockResponse<LoginResponse>
    mockLog('POST', '/api/auth/login', response)
    return response
  }

  if (user.status !== 'active') {
    const response = createErrorResponse(
      '账户已被禁用',
      403,
    ) as unknown as MockResponse<LoginResponse>
    mockLog('POST', '/api/auth/login', response)
    return response
  }

  // 更新最后登录时间
  user.lastLoginTime = new Date().toISOString()

  const loginData: LoginResponse = {
    token: `mock_token_${user.id}_${Date.now()}`,
    userInfo: user,
    permissions: getPermissionsByRole(user.role),
    menus: getMenusByRole(user.role),
  }

  const response = createSuccessResponse(loginData, '登录成功')
  mockLog('POST', '/api/auth/login', response)
  return response
}

/**
 * 获取用户信息
 * @param token 用户令牌
 * @returns 用户信息
 */
export const mockGetUserInfo = async (token: string): Promise<MockResponse<UserInfo>> => {
  await mockDelay()

  // 从 token 中解析用户 ID（简化处理）
  const userId = token.split('_')[2]
  const user = mockUsers.find((u) => u.id === userId)

  if (!user) {
    const response = createErrorResponse('用户不存在', 404) as unknown as MockResponse<UserInfo>
    mockLog('GET', '/api/user/info', response)
    return response
  }

  const response = createSuccessResponse(user, '获取用户信息成功')
  mockLog('GET', '/api/user/info', response)
  return response
}

/**
 * 获取用户列表
 * @param params 查询参数
 * @returns 用户列表
 */
export const mockGetUserList = async (
  params: UserListParams = {},
): Promise<MockResponse<PaginationData<UserInfo>>> => {
  await mockDelay()

  const { page = 1, pageSize = 10, keyword, role, status } = params

  let filteredUsers = [...mockUsers]

  // 关键词搜索
  if (keyword) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.username.includes(keyword) ||
        user.nickname.includes(keyword) ||
        user.email.includes(keyword) ||
        user.phone.includes(keyword),
    )
  }

  // 角色筛选
  if (role) {
    filteredUsers = filteredUsers.filter((user) => user.role === role)
  }

  // 状态筛选
  if (status) {
    filteredUsers = filteredUsers.filter((user) => user.status === status)
  }

  const paginationData = createPaginationData(filteredUsers, page, pageSize)
  const response = createSuccessResponse(paginationData, '获取用户列表成功')
  mockLog('GET', '/api/user/list', response)
  return response
}

/**
 * 根据角色获取权限
 * @param role 用户角色
 * @returns 权限列表
 */
const getPermissionsByRole = (role: string): string[] => {
  const permissions: Record<string, string[]> = {
    admin: [
      'user:read',
      'user:write',
      'user:delete',
      'product:read',
      'product:write',
      'product:delete',
      'order:read',
      'order:write',
      'order:delete',
      'system:read',
      'system:write',
    ],
    manager: [
      'user:read',
      'user:write',
      'product:read',
      'product:write',
      'order:read',
      'order:write',
    ],
    editor: ['product:read', 'product:write', 'order:read'],
    user: ['order:read'],
  }

  return permissions[role] || []
}

/**
 * 根据角色获取菜单
 * @param role 用户角色
 * @returns 菜单列表
 */
const getMenusByRole = (role: string): any[] => {
  const allMenus = [
    {
      id: 'dashboard',
      name: '仪表盘',
      path: '/dashboard',
      icon: 'dashboard',
      roles: ['admin', 'manager', 'editor', 'user'],
    },
    {
      id: 'user',
      name: '用户管理',
      path: '/user',
      icon: 'user',
      roles: ['admin', 'manager'],
    },
    {
      id: 'product',
      name: '商品管理',
      path: '/product',
      icon: 'product',
      roles: ['admin', 'manager', 'editor'],
    },
    {
      id: 'order',
      name: '订单管理',
      path: '/order',
      icon: 'order',
      roles: ['admin', 'manager', 'editor', 'user'],
    },
    {
      id: 'system',
      name: '系统设置',
      path: '/system',
      icon: 'setting',
      roles: ['admin'],
    },
  ]

  return allMenus.filter((menu) => menu.roles.includes(role))
}
