/**
 * 图表数据类型定义
 * 统一的图表数据接口规范
 */

/**
 * 通用API响应接口
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

/**
 * 图表基础配置接口
 */
export interface ChartBaseConfig {
  title?: string
  subtitle?: string
  loading?: boolean
  error?: string | null
}

/**
 * 饼图数据项接口
 */
export interface PieDataItem {
  name: string
  value: number
  percentage?: number
  color: string
}

/**
 * 线图/柱图数据系列接口
 */
export interface SeriesDataItem {
  name: string
  type: 'line' | 'column' | 'bar' | 'area' | 'spline'
  data: number[]
  color: string
  dashStyle?: 'solid' | 'dash' | 'dot'
  smooth?: boolean
}

/**
 * 图表数据接口
 */
export interface ChartData {
  categories?: string[]
  series?: SeriesDataItem[]
  pieData?: PieDataItem[]
  mapData?: MapDataItem[]
}

/**
 * 地图数据项接口
 */
export interface MapDataItem {
  name: string
  value: [number, number, number] // [经度, 纬度, 数值]
  itemStyle?: {
    color?: string
  }
}

/**
 * 订单状态数据接口
 */
export interface OrderStatusData {
  status: string
  label: string
  count: number
  percentage: number
  color: string
}

/**
 * 商品排行数据接口
 */
export interface ProductRankingData {
  categories: string[]
  series: {
    name: string
    type: 'column'
    data: number[]
    itemStyle: {
      color: string
    }
  }[]
}

/**
 * 用户活跃度数据接口
 */
export interface UserActivityData {
  categories: string[]
  series: {
    name: string
    type: 'line' | 'column'
    data: number[]
    smooth?: boolean
    itemStyle: {
      color: string
    }
  }[]
}

/**
 * 地区销售数据接口
 */
export interface RegionSalesData extends MapDataItem {
  region?: string // 地区名称
  salesAmount?: number // 销售金额
}

/**
 * 销售趋势数据接口
 */
export interface SalesTrendData {
  date: string
  sales: number
  orders: number
  revenue: number
}

/**
 * 用户增长数据接口
 */
export interface UserGrowthData {
  date: string
  newUsers: number
  activeUsers: number
  totalUsers: number
}

/**
 * 分类分布数据接口
 */
export interface CategoryDistributionData {
  category: string
  count: number
  percentage: number
  color: string
}

/**
 * 支付方式分布数据接口
 */
export interface PaymentDistributionData {
  method: string
  count: number
  percentage: number
  color: string
}

/**
 * 热力图数据接口
 */
export interface HeatmapData {
  xAxis: string[]
  yAxis: string[]
  data: [number, number, number][] // [x索引, y索引, 数值]
  max?: number
}

/**
 * 图表配置参数接口
 */
export interface ChartParams {
  type?: 'sales' | 'quantity' | 'orders'
  period?: 'week' | 'month' | 'quarter' | 'year'
  metric?: 'sales' | 'orders' | 'revenue'
  region?: string
  category?: string
}

/**
 * 图表数据加载状态接口
 */
export interface ChartLoadingState {
  loading: boolean
  error: string | null
  lastUpdated: number | null
}