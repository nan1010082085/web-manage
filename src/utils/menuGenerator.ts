import type { MenuItem } from '@/types'
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  SettingOutlined,
  SafetyOutlined,
  FileTextOutlined,
  TagsOutlined,
  GiftOutlined,
  CustomerServiceOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  PieChartOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  ProfileOutlined,
  MonitorOutlined,
  MenuOutlined,
  UsergroupAddOutlined,
  ShoppingOutlined,
  MailOutlined,
  BulbOutlined,
  FundOutlined,
  ContainerOutlined,
  ExceptionOutlined,
} from '@ant-design/icons-vue'

/**
 * 菜单图标映射配置
 */
const iconMap: Record<string, any> = {
  // 仪表盘
  dashboard: DashboardOutlined,

  // 用户相关
  user: UserOutlined,
  profile: ProfileOutlined,

  // 商品相关
  product: ShopOutlined,
  category: TagsOutlined,
  inventory: DatabaseOutlined,

  // 订单相关
  order: ShoppingCartOutlined,

  // 营销相关
  marketing: BulbOutlined,
  campaign: MailOutlined,
  coupon: GiftOutlined,

  // 统计分析
  statistics: BarChartOutlined,
  analytics: LineChartOutlined,
  data: PieChartOutlined,
  finance: FundOutlined,
  sales: ShoppingOutlined,
  report: ContainerOutlined,

  // 内容管理
  content: BookOutlined,

  // 客服相关
  service: CustomerServiceOutlined,

  // 权限管理
  permission: SafetyOutlined,

  // 帮助中心
  help: QuestionCircleOutlined,

  // 系统管理
  system: SettingOutlined,
  settings: SettingOutlined,
  log: FileTextOutlined,
  monitor: MonitorOutlined,
  menu: MenuOutlined,
  role: UsergroupAddOutlined,

  // 认证相关
  auth: SafetyOutlined,
  login: UserOutlined,

  // 错误页面
  error: ExceptionOutlined,

  // 默认图标
  default: AppstoreOutlined,
}

/**
 * 菜单标题映射配置
 */
const titleMap: Record<string, string> = {
  // 目录级别
  dashboard: '仪表盘',
  user: '用户管理',
  product: '商品管理',
  order: '订单管理',
  marketing: '营销管理',
  statistics: '数据统计',
  analytics: '数据分析',
  content: '内容管理',
  service: '客服管理',
  permission: '权限管理',
  help: '帮助中心',
  system: '系统管理',
  auth: '认证管理',
  error: '错误页面',

  // 页面级别
  DashboardView: '仪表盘',
  UserListView: '用户列表',
  UserProfileView: '用户详情',
  ProductManage: '商品列表',
  CategoryView: '商品分类',
  InventoryView: '库存管理',
  OrderManage: '订单管理',
  CampaignView: '营销活动',
  CouponView: '优惠券管理',
  SalesView: '销售统计',
  UserView: '用户统计',
  FinanceView: '财务统计',
  DataView: '数据分析',
  ReportView: '报表分析',
  ContentView: '内容管理',
  CustomerServiceView: '客服管理',
  PermissionView: '权限管理',
  HelpView: '帮助中心',
  ProfileView: '个人中心',
  SettingsView: '系统设置',
  SystemSettingsView: '系统配置',
  LogView: '系统日志',
  MonitorView: '系统监控',
  MenuManagementView: '菜单管理',
  RoleManagementView: '角色管理',
  UserManage: '用户管理',
  LoginView: '登录',
  NotFoundView: '页面不存在',
}

/**
 * 业务域分组配置
 */
interface MenuGroup {
  key: string
  title: string
  icon: any
  order: number
  directories: string[]
  menus?: MenuItem[]
}

const menuGroupConfig: MenuGroup[] = [
  {
    key: 'dashboard',
    title: '工作台',
    icon: DashboardOutlined,
    order: 1,
    directories: ['dashboard'],
  },
  {
    key: 'business',
    title: '业务管理',
    icon: AppstoreOutlined,
    order: 2,
    directories: ['product', 'order', 'marketing'],
  },
  {
    key: 'user',
    title: '用户管理',
    icon: UserOutlined,
    order: 3,
    directories: ['user', 'permission'],
  },
  {
    key: 'analytics',
    title: '数据分析',
    icon: BarChartOutlined,
    order: 4,
    directories: ['statistics', 'analytics'],
  },
  {
    key: 'content',
    title: '内容服务',
    icon: BookOutlined,
    order: 5,
    directories: ['content', 'service'],
  },
  {
    key: 'system',
    title: '系统配置',
    icon: SettingOutlined,
    order: 6,
    directories: ['system', 'help', 'profile'],
  },
]

/**
 * 获取图标组件
 * @param key 图标键名
 * @returns 图标组件
 */
const getIcon = (key: string): any => {
  const lowerKey = key.toLowerCase()
  return iconMap[lowerKey] || iconMap.default
}

/**
 * 获取菜单标题
 * @param key 键名（目录名或文件名）
 * @returns 菜单标题
 */
const getTitle = (key: string): string => {
  // 优先匹配完整的文件名
  if (titleMap[key]) {
    return titleMap[key]
  }

  // 匹配目录名
  const lowerKey = key.toLowerCase()
  if (titleMap[lowerKey]) {
    return titleMap[lowerKey]
  }

  // 如果是Vue文件，去掉View后缀再匹配
  if (key.endsWith('View.vue')) {
    const baseName = key.replace('.vue', '')
    if (titleMap[baseName]) {
      return titleMap[baseName]
    }
  }

  // 默认使用文件名（去掉扩展名和View后缀）
  return key.replace(/\.vue$/, '').replace(/View$/, '')
}

/**
 * 生成菜单路径
 * @param directory 目录名
 * @param fileName 文件名（可选）
 * @returns 路由路径
 */
const generatePath = (directory: string, fileName?: string): string => {
  if (!fileName) {
    return `/${directory}`
  }

  // 特殊处理一些文件名
  const fileNameMap: Record<string, string> = {
    'ProductManage.vue': 'list',
    'OrderManage.vue': 'list',
    'UserManage.vue': 'list',
    'DashboardView.vue': '',
    'LoginView.vue': '',
    'NotFoundView.vue': '',
  }

  if (fileNameMap[fileName]) {
    const subPath = fileNameMap[fileName]
    return subPath ? `/${directory}/${subPath}` : `/${directory}`
  }

  // 默认处理：去掉View后缀，转换为小写
  const baseName = fileName.replace(/\.vue$/, '').replace(/View$/, '')
  const subPath = baseName.toLowerCase()

  return `/${directory}/${subPath}`
}

/**
 * 根据views目录结构生成菜单配置
 * @param viewsStructure views目录结构数据
 * @returns 菜单组配置
 */
export const generateMenuFromViews = (viewsStructure: any): MenuGroup[] => {
  const generatedGroups: MenuGroup[] = []

  // 遍历每个业务域分组
  menuGroupConfig.forEach((groupConfig) => {
    const groupMenus: MenuItem[] = []

    // 遍历该分组包含的目录
    groupConfig.directories.forEach((directory) => {
      if (!viewsStructure[directory]) return

      const files = viewsStructure[directory]

      if (files.length === 1) {
        // 单个文件，直接作为菜单项
        const fileName = files[0]
        const menuItem: MenuItem = {
          key: generatePath(directory, fileName),
          title: getTitle(fileName),
          icon: getIcon(directory),
          path: generatePath(directory, fileName),
        }
        groupMenus.push(menuItem)
      } else if (files.length > 1) {
        // 多个文件，创建子菜单
        const children: MenuItem[] = files.map((fileName: string) => ({
          key: generatePath(directory, fileName),
          title: getTitle(fileName),
          icon: getIcon(fileName.replace(/\.vue$/, '').toLowerCase()),
          path: generatePath(directory, fileName),
        }))

        const parentMenu: MenuItem = {
          key: directory,
          title: getTitle(directory),
          icon: getIcon(directory),
          children,
        }
        groupMenus.push(parentMenu)
      }
    })

    // 如果该分组有菜单项，则添加到结果中
    if (groupMenus.length > 0) {
      generatedGroups.push({
        ...groupConfig,
        menus: groupMenus,
      } as MenuGroup & { menus: MenuItem[] })
    }
  })

  return generatedGroups.sort((a, b) => a.order - b.order)
}

/**
 * 获取实际的views目录结构
 * @returns views目录结构
 */
export const getViewsStructure = async (): Promise<Record<string, string[]>> => {
  // 根据实际的views目录结构生成菜单
  const viewsStructure: Record<string, string[]> = {
    analytics: ['DataView.vue', 'ReportView.vue'],
    auth: ['LoginView.vue'],
    content: ['ContentView.vue'],
    dashboard: ['DashboardView.vue'],
    error: ['NotFoundView.vue'],
    help: ['HelpView.vue'],
    marketing: ['CampaignView.vue', 'CouponView.vue'],
    order: ['OrderManage.vue'],
    permission: ['PermissionView.vue'],
    product: ['ProductManage.vue', 'CategoryView.vue', 'InventoryView.vue'],
    profile: ['ProfileView.vue'],
    service: ['CustomerServiceView.vue'],
    statistics: ['SalesView.vue', 'UserView.vue', 'FinanceView.vue'],
    system: [
      'SettingsView.vue',
      'SystemSettingsView.vue',
      'LogView.vue',
      'MonitorView.vue',
      'MenuManagementView.vue',
      'RoleManagementView.vue',
      'UserManage.vue',
    ],
    user: ['UserListView.vue', 'UserProfileView.vue'],
  }

  return viewsStructure
}

/**
 * 生成完整的菜单配置
 * @returns 菜单组配置
 */
export const generateMenuConfig = async (): Promise<MenuGroup[]> => {
  const viewsStructure = await getViewsStructure()
  return generateMenuFromViews(viewsStructure)
}
