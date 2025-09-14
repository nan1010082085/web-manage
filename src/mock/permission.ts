import { faker } from '@faker-js/faker'


/**
 * 权限类型枚举
 */
export type PermissionType = 
  | 'menu'      // 菜单权限
  | 'button'    // 按钮权限
  | 'api'       // API权限
  | 'data'      // 数据权限

/**
 * 角色状态枚举
 */
export type RoleStatus = 'active' | 'inactive'

/**
 * 用户状态枚举
 */
export type UserStatus = 'active' | 'inactive' | 'locked'

/**
 * 权限节点接口
 */
export interface Permission {
  /** 权限ID */
  id: string
  /** 权限标识 */
  key: string
  /** 权限名称 */
  title: string
  /** 权限类型 */
  type: PermissionType
  /** 权限描述 */
  description: string
  /** 权限状态 */
  status: 'active' | 'inactive'
  /** 菜单路径 */
  path?: string
  /** API地址 */
  apiUrl?: string
  /** 父级权限ID */
  parentId?: string
  /** 排序 */
  sort: number
  /** 图标 */
  icon?: string
  /** 子权限 */
  children?: Permission[]
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 角色接口
 */
export interface Role {
  /** 角色ID */
  id: string
  /** 角色名称 */
  name: string
  /** 角色描述 */
  description: string
  /** 角色颜色 */
  color: string
  /** 角色状态 */
  status: RoleStatus
  /** 权限列表 */
  permissions: string[]
  /** 用户数量 */
  userCount: number
  /** 是否内置角色 */
  isBuiltIn: boolean
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 用户接口
 */
export interface User {
  /** 用户ID */
  id: string
  /** 用户名 */
  username: string
  /** 邮箱 */
  email: string
  /** 真实姓名 */
  realName: string
  /** 手机号 */
  phone: string
  /** 头像 */
  avatar?: string
  /** 用户状态 */
  status: UserStatus
  /** 角色列表 */
  roles: Role[]
  /** 部门ID */
  departmentId?: string
  /** 部门名称 */
  departmentName?: string
  /** 最后登录时间 */
  lastLogin?: string
  /** 最后登录IP */
  lastLoginIp?: string
  /** 登录次数 */
  loginCount: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 权限统计概览接口
 */
export interface PermissionOverview {
  /** 总角色数 */
  totalRoles: number
  /** 权限节点数 */
  totalPermissions: number
  /** 活跃用户数 */
  activeUsers: number
  /** 今日登录数 */
  todayLogins: number
  /** 总用户数 */
  totalUsers: number
  /** 在线用户数 */
  onlineUsers: number
}

/**
 * 角色搜索参数接口
 */
export interface RoleSearchParams {
  /** 角色名称 */
  name?: string
  /** 角色状态 */
  status?: RoleStatus
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 用户搜索参数接口
 */
export interface UserSearchParams {
  /** 用户名 */
  username?: string
  /** 邮箱 */
  email?: string
  /** 真实姓名 */
  realName?: string
  /** 手机号 */
  phone?: string
  /** 角色ID */
  roleId?: string
  /** 部门ID */
  departmentId?: string
  /** 用户状态 */
  status?: UserStatus
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 创建角色参数接口
 */
export interface CreateRoleParams {
  /** 角色名称 */
  name: string
  /** 角色描述 */
  description: string
  /** 角色颜色 */
  color: string
  /** 权限列表 */
  permissions: string[]
}

/**
 * 更新角色参数接口
 */
export interface UpdateRoleParams {
  /** 角色ID */
  id: string
  /** 角色名称 */
  name?: string
  /** 角色描述 */
  description?: string
  /** 角色颜色 */
  color?: string
  /** 角色状态 */
  status?: RoleStatus
  /** 权限列表 */
  permissions?: string[]
}

/**
 * 创建权限参数接口
 */
export interface CreatePermissionParams {
  /** 权限标识 */
  key: string
  /** 权限名称 */
  title: string
  /** 权限类型 */
  type: PermissionType
  /** 权限描述 */
  description: string
  /** 菜单路径 */
  path?: string
  /** API地址 */
  apiUrl?: string
  /** 父级权限ID */
  parentId?: string
  /** 排序 */
  sort: number
  /** 图标 */
  icon?: string
}

/**
 * 更新权限参数接口
 */
export interface UpdatePermissionParams {
  /** 权限ID */
  id: string
  /** 权限标识 */
  key?: string
  /** 权限名称 */
  title?: string
  /** 权限类型 */
  type?: PermissionType
  /** 权限描述 */
  description?: string
  /** 权限状态 */
  status?: 'active' | 'inactive'
  /** 菜单路径 */
  path?: string
  /** API地址 */
  apiUrl?: string
  /** 父级权限ID */
  parentId?: string
  /** 排序 */
  sort?: number
  /** 图标 */
  icon?: string
}

/**
 * 分配用户角色参数接口
 */
export interface AssignUserRoleParams {
  /** 用户ID */
  userId: string
  /** 角色ID列表 */
  roleIds: string[]
}

// 模拟数据生成
const permissionTypes: PermissionType[] = ['menu', 'button', 'api', 'data']
const roleStatuses: RoleStatus[] = ['active', 'inactive']
const userStatuses: UserStatus[] = ['active', 'inactive', 'locked']
const roleColors = ['#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#faad14']
const userNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二']
const departments = ['技术部', '产品部', '运营部', '市场部', '人事部', '财务部', '客服部', '设计部']
const menuIcons = ['DashboardOutlined', 'ShopOutlined', 'UserOutlined', 'SettingOutlined', 'FileTextOutlined', 'BarChartOutlined']

/**
 * 生成权限树
 */
const generatePermissionTree = (): Permission[] => {
  const rootPermissions: Permission[] = [
    {
      id: '1',
      key: 'dashboard',
      title: '仪表盘',
      type: 'menu',
      description: '系统仪表盘',
      status: 'active',
      path: '/dashboard',
      sort: 1,
      icon: 'DashboardOutlined',
      createTime: faker.date.past().toISOString(),
      updateTime: faker.date.recent().toISOString(),
      children: [
        {
          id: '1-1',
          key: 'dashboard:view',
          title: '查看仪表盘',
          type: 'button',
          description: '查看仪表盘数据',
          status: 'active',
          parentId: '1',
          sort: 1,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
      ],
    },
    {
      id: '2',
      key: 'product',
      title: '商品管理',
      type: 'menu',
      description: '商品信息管理',
      status: 'active',
      path: '/product',
      sort: 2,
      icon: 'ShopOutlined',
      createTime: faker.date.past().toISOString(),
      updateTime: faker.date.recent().toISOString(),
      children: [
        {
          id: '2-1',
          key: 'product:list',
          title: '商品列表',
          type: 'button',
          description: '查看商品列表',
          status: 'active',
          parentId: '2',
          sort: 1,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
        {
          id: '2-2',
          key: 'product:create',
          title: '新增商品',
          type: 'button',
          description: '创建新商品',
          status: 'active',
          parentId: '2',
          sort: 2,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
        {
          id: '2-3',
          key: 'product:edit',
          title: '编辑商品',
          type: 'button',
          description: '编辑商品信息',
          status: 'active',
          parentId: '2',
          sort: 3,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
        {
          id: '2-4',
          key: 'product:delete',
          title: '删除商品',
          type: 'button',
          description: '删除商品',
          status: 'active',
          parentId: '2',
          sort: 4,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
      ],
    },
    {
      id: '3',
      key: 'order',
      title: '订单管理',
      type: 'menu',
      description: '订单信息管理',
      status: 'active',
      path: '/order',
      sort: 3,
      icon: 'FileTextOutlined',
      createTime: faker.date.past().toISOString(),
      updateTime: faker.date.recent().toISOString(),
      children: [
        {
          id: '3-1',
          key: 'order:list',
          title: '订单列表',
          type: 'button',
          description: '查看订单列表',
          status: 'active',
          parentId: '3',
          sort: 1,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
        {
          id: '3-2',
          key: 'order:detail',
          title: '订单详情',
          type: 'button',
          description: '查看订单详情',
          status: 'active',
          parentId: '3',
          sort: 2,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
        {
          id: '3-3',
          key: 'order:process',
          title: '处理订单',
          type: 'button',
          description: '处理订单状态',
          status: 'active',
          parentId: '3',
          sort: 3,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
      ],
    },
    {
      id: '4',
      key: 'user',
      title: '用户管理',
      type: 'menu',
      description: '用户信息管理',
      status: 'active',
      path: '/user',
      sort: 4,
      icon: 'UserOutlined',
      createTime: faker.date.past().toISOString(),
      updateTime: faker.date.recent().toISOString(),
      children: [
        {
          id: '4-1',
          key: 'user:list',
          title: '用户列表',
          type: 'button',
          description: '查看用户列表',
          status: 'active',
          parentId: '4',
          sort: 1,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
        {
          id: '4-2',
          key: 'user:create',
          title: '新增用户',
          type: 'button',
          description: '创建新用户',
          status: 'active',
          parentId: '4',
          sort: 2,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
        {
          id: '4-3',
          key: 'user:edit',
          title: '编辑用户',
          type: 'button',
          description: '编辑用户信息',
          status: 'active',
          parentId: '4',
          sort: 3,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
      ],
    },
    {
      id: '5',
      key: 'permission',
      title: '权限管理',
      type: 'menu',
      description: '系统权限管理',
      status: 'active',
      path: '/permission',
      sort: 5,
      icon: 'SettingOutlined',
      createTime: faker.date.past().toISOString(),
      updateTime: faker.date.recent().toISOString(),
      children: [
        {
          id: '5-1',
          key: 'permission:role',
          title: '角色管理',
          type: 'button',
          description: '管理系统角色',
          status: 'active',
          parentId: '5',
          sort: 1,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
        {
          id: '5-2',
          key: 'permission:permission',
          title: '权限管理',
          type: 'button',
          description: '管理系统权限',
          status: 'active',
          parentId: '5',
          sort: 2,
          createTime: faker.date.past().toISOString(),
          updateTime: faker.date.recent().toISOString(),
        },
      ],
    },
  ]
  
  return rootPermissions
}

/**
 * 生成角色数据
 */
const generateRole = (): Role => {
  const permissionTree = generatePermissionTree()
  const allPermissions = getAllPermissionIds(permissionTree)
  const selectedPermissions = faker.helpers.arrayElements(
    allPermissions,
    { min: 3, max: allPermissions.length }
  )
  
  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(['超级管理员', '管理员', '运营', '客服', '财务', '普通用户']),
    description: faker.lorem.sentence(),
    color: faker.helpers.arrayElement(roleColors),
    status: faker.helpers.arrayElement(roleStatuses),
    permissions: selectedPermissions,
    userCount: faker.number.int({ min: 0, max: 50 }),
    isBuiltIn: faker.datatype.boolean({ probability: 0.3 }),
    createTime: faker.date.past().toISOString(),
    updateTime: faker.date.recent().toISOString(),
  }
}

/**
 * 生成用户数据
 */
const generateUser = (roles: Role[]): User => {
  const userRoles = faker.helpers.arrayElements(roles, { min: 1, max: 3 })
  
  return {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    realName: faker.helpers.arrayElement(userNames),
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
    status: faker.helpers.arrayElement(userStatuses),
    roles: userRoles,
    departmentId: faker.string.uuid(),
    departmentName: faker.helpers.arrayElement(departments),
    lastLogin: faker.helpers.maybe(() => faker.date.recent().toISOString(), { probability: 0.8 }),
    lastLoginIp: faker.internet.ip(),
    loginCount: faker.number.int({ min: 0, max: 1000 }),
    createTime: faker.date.past().toISOString(),
    updateTime: faker.date.recent().toISOString(),
  }
}

/**
 * 获取所有权限ID
 */
const getAllPermissionIds = (permissions: Permission[]): string[] => {
  const ids: string[] = []
  
  const traverse = (perms: Permission[]) => {
    perms.forEach(perm => {
      ids.push(perm.id)
      if (perm.children) {
        traverse(perm.children)
      }
    })
  }
  
  traverse(permissions)
  return ids
}

/**
 * 生成权限统计概览
 */
const generatePermissionOverview = (roles: Role[], users: User[], permissions: Permission[]): PermissionOverview => {
  const activeUsers = users.filter(user => user.status === 'active')
  const today = new Date().toISOString().split('T')[0]
  const todayLogins = users.filter(user => user.lastLogin?.startsWith(today))
  
  return {
    totalRoles: roles.length,
    totalPermissions: getAllPermissionIds(permissions).length,
    activeUsers: activeUsers.length,
    todayLogins: todayLogins.length,
    totalUsers: users.length,
    onlineUsers: faker.number.int({ min: 0, max: activeUsers.length }),
  }
}

// 模拟数据存储
export const mockPermissionTree = generatePermissionTree()
export const mockRoleList = Array.from({ length: 8 }, () => generateRole())
export const mockUserList = Array.from({ length: 50 }, () => generateUser(mockRoleList))

// Mock API functions
export const mockGetPermissionOverview = (): Promise<{ code: number; message: string; data: PermissionOverview }> => {
  const overview = generatePermissionOverview(mockRoleList, mockUserList, mockPermissionTree)
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: overview
  })
}

export const mockGetPermissionTree = (): Promise<{ code: number; message: string; data: Permission[] }> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: mockPermissionTree
  })
}

export const mockGetRoleList = (params: RoleSearchParams = {}): Promise<{ code: number; message: string; data: { list: Role[]; total: number } }> => {
  let filteredList = [...mockRoleList]
  
  if (params.name) {
    filteredList = filteredList.filter(item => item.name.includes(params.name!))
  }
  if (params.status) {
    filteredList = filteredList.filter(item => item.status === params.status)
  }
  
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      list: filteredList.slice(start, end),
      total: filteredList.length
    }
  })
}

export const mockGetUserList = (params: UserSearchParams = {}): Promise<{ code: number; message: string; data: { list: User[]; total: number } }> => {
  let filteredList = [...mockUserList]
  
  if (params.username) {
    filteredList = filteredList.filter(item => item.username.includes(params.username!))
  }
  if (params.email) {
    filteredList = filteredList.filter(item => item.email.includes(params.email!))
  }
  if (params.realName) {
    filteredList = filteredList.filter(item => item.realName.includes(params.realName!))
  }
  if (params.status) {
    filteredList = filteredList.filter(item => item.status === params.status)
  }
  if (params.roleId) {
    filteredList = filteredList.filter(item => item.roles.some(role => role.id === params.roleId))
  }
  
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      list: filteredList.slice(start, end),
      total: filteredList.length
    }
  })
}

export const mockGetRoleDetail = (id: string): Promise<{ code: number; message: string; data: Role | null }> => {
  const role = mockRoleList.find(item => item.id === id)
  return Promise.resolve({
    code: role ? 200 : 404,
    message: role ? 'success' : '角色不存在',
    data: role || null
  })
}

export const mockCreateRole = (params: CreateRoleParams): Promise<{ code: number; message: string; data: Role }> => {
  const newRole: Role = {
    id: faker.string.uuid(),
    ...params,
    status: 'active',
    userCount: 0,
    isBuiltIn: false,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
  
  mockRoleList.unshift(newRole)
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: newRole
  })
}

export const mockUpdateRole = (params: UpdateRoleParams): Promise<{ code: number; message: string; data: Role | null }> => {
  const index = mockRoleList.findIndex(item => item.id === params.id)
  if (index === -1) {
    return Promise.resolve({
      code: 404,
      message: '角色不存在',
      data: null
    })
  }
  
  const updatedRole = {
    ...mockRoleList[index],
    ...params,
    updateTime: new Date().toISOString()
  }
  
  mockRoleList[index] = updatedRole
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: updatedRole
  })
}

export const mockDeleteRole = (id: string): Promise<{ code: number; message: string; data: null }> => {
  const index = mockRoleList.findIndex(item => item.id === id)
  if (index === -1) {
    return Promise.resolve({
      code: 404,
      message: '角色不存在',
      data: null
    })
  }
  
  const role = mockRoleList[index]
  if (role.isBuiltIn) {
    return Promise.resolve({
      code: 400,
      message: '内置角色不能删除',
      data: null
    })
  }
  
  mockRoleList.splice(index, 1)
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null
  })
}

export const mockCreatePermission = (params: CreatePermissionParams): Promise<{ code: number; message: string; data: Permission }> => {
  const newPermission: Permission = {
    id: faker.string.uuid(),
    ...params,
    status: 'active',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: newPermission
  })
}

export const mockUpdatePermission = (params: UpdatePermissionParams): Promise<{ code: number; message: string; data: Permission | null }> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      id: params.id,
      key: params.key || 'test',
      title: params.title || 'Test Permission',
      type: params.type || 'menu',
      description: params.description || '',
      status: params.status || 'active',
      sort: params.sort || 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }
  })
}

export const mockDeletePermission = (id: string): Promise<{ code: number; message: string; data: null }> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null
  })
}

export const mockAssignUserRole = (params: AssignUserRoleParams): Promise<{ code: number; message: string; data: null }> => {
  const userIndex = mockUserList.findIndex(user => user.id === params.userId)
  if (userIndex === -1) {
    return Promise.resolve({
      code: 404,
      message: '用户不存在',
      data: null
    })
  }
  
  const roles = mockRoleList.filter(role => params.roleIds.includes(role.id))
  mockUserList[userIndex].roles = roles
  mockUserList[userIndex].updateTime = new Date().toISOString()
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null
  })
}

export const mockBatchDeleteRoles = (ids: string[]): Promise<{ code: number; message: string; data: null }> => {
  ids.forEach(id => {
    const index = mockRoleList.findIndex(item => item.id === id)
    if (index !== -1 && !mockRoleList[index].isBuiltIn) {
      mockRoleList.splice(index, 1)
    }
  })
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null
  })
}

export const mockBatchDeleteUsers = (ids: string[]): Promise<{ code: number; message: string; data: null }> => {
  ids.forEach(id => {
    const index = mockUserList.findIndex(item => item.id === id)
    if (index !== -1) {
      mockUserList.splice(index, 1)
    }
  })
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null
  })
}

export const mockResetUserPassword = (userId: string, newPassword: string): Promise<{ code: number; message: string; data: null }> => {
  const user = mockUserList.find(item => item.id === userId)
  if (!user) {
    return Promise.resolve({
      code: 404,
      message: '用户不存在',
      data: null
    })
  }
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null
  })
}

export const mockToggleUserLock = (userId: string, locked: boolean): Promise<{ code: number; message: string; data: null }> => {
  const user = mockUserList.find(item => item.id === userId)
  if (!user) {
    return Promise.resolve({
      code: 404,
      message: '用户不存在',
      data: null
    })
  }
  
  user.status = locked ? 'locked' : 'active'
  user.updateTime = new Date().toISOString()
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null
  })
}

export const mockGetUserPermissions = (userId: string): Promise<{ code: number; message: string; data: Permission[] }> => {
  const user = mockUserList.find(item => item.id === userId)
  if (!user) {
    return Promise.resolve({
      code: 404,
      message: '用户不存在',
      data: []
    })
  }
  
  const userPermissionIds = user.roles.flatMap(role => role.permissions)
  const userPermissions = getAllPermissionIds(mockPermissionTree)
    .filter(id => userPermissionIds.includes(id))
    .map(id => mockPermissionTree.find(p => p.id === id))
    .filter(Boolean) as Permission[]
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: userPermissions
  })
}

export const mockCheckUserPermission = (userId: string, permission: string): Promise<{ code: number; message: string; data: boolean }> => {
  const user = mockUserList.find(item => item.id === userId)
  if (!user) {
    return Promise.resolve({
      code: 404,
      message: '用户不存在',
      data: false
    })
  }
  
  const userPermissionIds = user.roles.flatMap(role => role.permissions)
  const hasPermission = userPermissionIds.includes(permission)
  
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: hasPermission
  })
}