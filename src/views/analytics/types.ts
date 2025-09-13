/**
 * 数据分析页面相关类型定义
 */

// 数据概览接口
export interface DataOverview {
  totalRevenue: number
  revenueTrend: number
  totalOrders: number
  ordersTrend: number
  newUsers: number
  usersTrend: number
  conversionRate: number
  conversionTrend: number
}

// 实时数据接口
export interface RealtimeData {
  onlineUsers: number
  onlineUsersChange: number
  todayOrders: number
  todayOrdersChange: number
  todayRevenue: number
  todayRevenueChange: number
  pageViews: number
  pageViewsChange: number
}

// 订单数据项接口
export interface OrderDataItem {
  id: string
  orderNo: string
  userName: string
  amount: number
  createTime: string
  paymentMethod: string
  status: string
}

// 用户数据项接口
export interface UserDataItem {
  id: string
  name: string
  registerTime: string
  orderCount: number
  totalSpent: number
  trend: number
  status: string
}

// 商品数据项接口
export interface ProductDataItem {
  id: string
  name: string
  sales: number
  revenue: number
  trend: number
  status: string
}

// 销售趋势数据接口
export interface SalesTrendItem {
  date: string
  revenue: number
  orders: number
}

// 用户增长数据接口
export interface UserGrowthItem {
  date: string
  newUsers: number
  activeUsers: number
}

// 分类分布数据接口
export interface CategoryDistributionItem {
  name: string
  value: number
  percentage: number
}

// 地区分布数据接口
export interface RegionDistributionItem {
  name: string
  value: number
  percentage: number
}

// 支付方式分布数据接口
export interface PaymentDistributionItem {
  name: string
  value: number
  percentage: number
}

// 柱状图数据接口
export interface BarChartItem {
  period: string
  currentYear: number
  lastYear: number
}

// 面积图数据接口
export interface AreaChartItem {
  date: string
  revenue: number
  profit: number
}

// 热力图数据接口
export interface HeatmapDataItem {
  x: number
  y: number
  value: number
  day: string
  hour: number
}

// 热力图配置接口
export interface HeatmapConfig {
  metric: 'activity' | 'orders' | 'revenue'
  data: HeatmapDataItem[]
}

// 图表类型枚举
export type SalesChartType = 'revenue' | 'orders'
export type UserChartType = 'new' | 'active'
export type TableDataType = 'products' | 'users' | 'orders'
export type BarChartPeriod = 'month' | 'quarter'
export type AreaChartType = 'revenue' | 'profit'
export type HeatmapMetric = 'activity' | 'orders' | 'revenue'

// 表格数据联合类型
export type TableDataItem = ProductDataItem | UserDataItem | OrderDataItem

// API响应基础接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页参数接口
export interface PaginationParams {
  current: number
  pageSize: number
}

// 日期范围接口
export interface DateRange {
  startDate: string
  endDate: string
}

// 图表数据响应接口
export interface ChartDataResponse {
  salesTrend: SalesTrendItem[]
  userGrowth: UserGrowthItem[]
  categoryDistribution: CategoryDistributionItem[]
  regionDistribution: RegionDistributionItem[]
  paymentDistribution: PaymentDistributionItem[]
  barChart: BarChartItem[]
  areaChart: AreaChartItem[]
  heatmap: HeatmapDataItem[]
}

// 数据概览响应接口
export interface OverviewResponse {
  overview: DataOverview
  realtime: RealtimeData
}

// 表格数据响应接口
export interface TableDataResponse<T = TableDataItem> {
  list: T[]
  total: number
  current: number
  pageSize: number
}
