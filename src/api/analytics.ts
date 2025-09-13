/**
 * 数据分析相关API接口
 */
import request from '@/utils/request'
import type {
  OverviewResponse,
  ChartDataResponse,
  TableDataResponse,
  ProductDataItem,
  UserDataItem,
  OrderDataItem,
  DateRange,
  PaginationParams,
} from '@/views/analytics/types'
import { mockGetOverviewData, mockGetChartData, mockGetTableData } from '@/mock/analytics'

// 是否使用mock数据
const USE_MOCK = true

/**
 * 获取数据概览
 */
export const getOverviewData = async (dateRange?: DateRange): Promise<any> => {
  if (USE_MOCK) {
    const mockData = await mockGetOverviewData()
    return mockData.overview
  }

  return request({
    url: '/api/analytics/overview',
    method: 'GET',
    params: dateRange,
  })
}

/**
 * 获取图表数据
 */
export const getChartData = async (dateRange?: DateRange): Promise<ChartDataResponse> => {
  if (USE_MOCK) {
    return mockGetChartData()
  }

  return request({
    url: '/api/analytics/charts',
    method: 'GET',
    params: dateRange,
  })
}

/**
 * 获取商品数据
 */
export const getProductData = async (
  pagination: PaginationParams,
  dateRange?: DateRange,
): Promise<TableDataResponse<ProductDataItem>> => {
  if (USE_MOCK) {
    return mockGetTableData<ProductDataItem>('products', pagination.current, pagination.pageSize)
  }

  return request({
    url: '/api/analytics/products',
    method: 'GET',
    params: {
      ...pagination,
      ...dateRange,
    },
  })
}

/**
 * 获取用户数据
 */
export const getUserData = async (
  pagination: PaginationParams,
  dateRange?: DateRange,
): Promise<TableDataResponse<UserDataItem>> => {
  if (USE_MOCK) {
    return mockGetTableData<UserDataItem>('users', pagination.current, pagination.pageSize)
  }

  return request({
    url: '/api/analytics/users',
    method: 'GET',
    params: {
      ...pagination,
      ...dateRange,
    },
  })
}

/**
 * 获取订单数据
 */
export const getOrderData = async (
  pagination: PaginationParams,
  dateRange?: DateRange,
): Promise<TableDataResponse<OrderDataItem>> => {
  if (USE_MOCK) {
    return mockGetTableData<OrderDataItem>('orders', pagination.current, pagination.pageSize)
  }

  return request({
    url: '/api/analytics/orders',
    method: 'GET',
    params: {
      ...pagination,
      ...dateRange,
    },
  })
}

/**
 * 获取销售趋势数据
 */
export const getSalesTrendData = async (dateRange?: DateRange) => {
  if (USE_MOCK) {
    const chartData = await mockGetChartData()
    return chartData.salesTrend
  }

  return request({
    url: '/api/analytics/sales-trend',
    method: 'GET',
    params: dateRange,
  })
}

/**
 * 获取用户增长数据
 */
export const getUserGrowthData = async (dateRange?: DateRange) => {
  if (USE_MOCK) {
    const chartData = await mockGetChartData()
    return chartData.userGrowth
  }

  return request({
    url: '/api/analytics/user-growth',
    method: 'GET',
    params: dateRange,
  })
}

/**
 * 获取分类分布数据
 */
export const getCategoryDistributionData = async (dateRange?: DateRange) => {
  if (USE_MOCK) {
    const chartData = await mockGetChartData()
    return chartData.categoryDistribution
  }

  return request({
    url: '/api/analytics/category-distribution',
    method: 'GET',
    params: dateRange,
  })
}

/**
 * 获取地区分布数据
 */
export const getRegionDistributionData = async (dateRange?: DateRange) => {
  if (USE_MOCK) {
    const chartData = await mockGetChartData()
    return chartData.regionDistribution
  }

  return request({
    url: '/api/analytics/region-distribution',
    method: 'GET',
    params: dateRange,
  })
}

/**
 * 获取支付方式分布数据
 */
export const getPaymentDistributionData = async (dateRange?: DateRange) => {
  if (USE_MOCK) {
    const chartData = await mockGetChartData()
    return chartData.paymentDistribution
  }

  return request({
    url: '/api/analytics/payment-distribution',
    method: 'GET',
    params: dateRange,
  })
}

/**
 * 获取柱状图数据
 */
export const getBarChartData = async (
  period: 'month' | 'quarter' = 'month',
  dateRange?: DateRange,
) => {
  if (USE_MOCK) {
    const chartData = await mockGetChartData()
    return chartData.barChart
  }

  return request({
    url: '/api/analytics/bar-chart',
    method: 'GET',
    params: {
      period,
      ...dateRange,
    },
  })
}

/**
 * 获取面积图数据
 */
export const getAreaChartData = async (dateRange?: DateRange) => {
  if (USE_MOCK) {
    const chartData = await mockGetChartData()
    return chartData.areaChart
  }

  return request({
    url: '/api/analytics/area-chart',
    method: 'GET',
    params: dateRange,
  })
}

/**
 * 获取热力图数据
 */
export const getHeatmapData = async (
  metric: 'activity' | 'orders' | 'revenue' = 'activity',
  dateRange?: DateRange,
) => {
  if (USE_MOCK) {
    const chartData = await mockGetChartData()
    return chartData.heatmap
  }

  return request({
    url: '/api/analytics/heatmap',
    method: 'GET',
    params: {
      metric,
      ...dateRange,
    },
  })
}

/**
 * 获取批量图表数据
 */
export const getBatchChartData = async (dateRange?: DateRange): Promise<ChartDataResponse> => {
  if (USE_MOCK) {
    return mockGetChartData()
  }

  return request({
    url: '/api/analytics/batch-charts',
    method: 'GET',
    params: dateRange,
  })
}

/**
 * 导出报告
 */
export const exportReport = async (dateRange?: DateRange) => {
  return request({
    url: '/api/analytics/export',
    method: 'POST',
    data: dateRange,
    responseType: 'blob',
  })
}

/**
 * 获取表格数据（通用函数）
 */
export const getTableData = async (
  type: 'products' | 'users' | 'orders',
  params: {
    page: number
    pageSize: number
    dateRange?: DateRange
  },
): Promise<TableDataResponse<ProductDataItem | UserDataItem | OrderDataItem>> => {
  if (USE_MOCK) {
    return mockGetTableData(type, params.page, params.pageSize)
  }

  return request({
    url: `/api/analytics/table/${type}`,
    method: 'GET',
    params,
  })
}

/**
 * 获取实时数据
 */
export const getRealtimeData = async (): Promise<any> => {
  if (USE_MOCK) {
    const mockData = await mockGetOverviewData()
    return mockData.realtime
  }

  return request({
    url: '/api/analytics/realtime',
    method: 'GET',
  })
}

/**
 * 导出表格数据
 */
export const exportTableData = async (
  type: 'products' | 'users' | 'orders',
  dateRange?: DateRange,
) => {
  return request({
    url: `/api/analytics/export/${type}`,
    method: 'POST',
    data: dateRange,
    responseType: 'blob',
  })
}
