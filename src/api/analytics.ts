/**
 * 数据分析相关API接口
 */
import { apiGet, type ApiResponse } from './index'
import type {
  ChartDataResponse,
  TableDataResponse,
  ProductDataItem,
  UserDataItem,
  OrderDataItem,
  DateRange,
  PaginationParams,
  DataOverview,
  RealtimeData,
} from '@/views/analytics/types'
import { mockGetOverviewData, mockGetChartData, mockGetTableData } from '@/mock/analytics'

/**
 * 获取数据概览
 * @param dateRange 日期范围
 * @returns 概览数据
 */
export const getOverviewData = async (
  dateRange?: DateRange,
): Promise<ApiResponse<DataOverview>> => {
  return apiGet('/analytics/overview', { dateRange }, async () => {
    const mockData = await mockGetOverviewData()
    return {
      code: 200,
      message: 'success',
      data: mockData.overview,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取图表数据
 * @param dateRange 日期范围
 * @returns 图表数据
 */
export const getChartData = async (
  dateRange?: DateRange,
): Promise<ApiResponse<ChartDataResponse>> => {
  return apiGet('/analytics/charts', { dateRange }, async () => {
    const mockData = await mockGetChartData()
    return {
      code: 200,
      message: 'success',
      data: mockData,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取产品数据
 * @param pagination 分页参数
 * @param dateRange 日期范围
 * @returns 产品数据
 */
export const getProductData = async (
  pagination: PaginationParams,
  dateRange?: DateRange,
): Promise<ApiResponse<TableDataResponse<ProductDataItem>>> => {
  return apiGet('/analytics/products', { ...pagination, dateRange }, async () => {
    const mockData = await mockGetTableData('products', pagination)
    return {
      code: 200,
      message: 'success',
      data: mockData,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取用户数据
 * @param pagination 分页参数
 * @param dateRange 日期范围
 * @returns 用户数据
 */
export const getUserData = async (
  pagination: PaginationParams,
  dateRange?: DateRange,
): Promise<ApiResponse<TableDataResponse<UserDataItem>>> => {
  return apiGet('/analytics/users', { ...pagination, dateRange }, async () => {
    const mockData = await mockGetTableData('users', pagination)
    return {
      code: 200,
      message: 'success',
      data: mockData,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取订单数据
 * @param pagination 分页参数
 * @param dateRange 日期范围
 * @returns 订单数据
 */
export const getOrderData = async (
  pagination: PaginationParams,
  dateRange?: DateRange,
): Promise<ApiResponse<TableDataResponse<OrderDataItem>>> => {
  return apiGet('/analytics/orders', { ...pagination, dateRange }, async () => {
    const mockData = await mockGetTableData('orders', pagination)
    return {
      code: 200,
      message: 'success',
      data: mockData,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取销售趋势数据
 * @param dateRange 日期范围
 * @returns 销售趋势数据
 */
export const getSalesTrendData = async (
  dateRange?: DateRange,
): Promise<ApiResponse<Record<string, unknown>>> => {
  return apiGet('/analytics/sales-trend', { dateRange }, async () => {
    const chartData = await mockGetChartData()
    return {
      code: 200,
      message: 'success',
      data: chartData.salesTrend,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取用户增长数据
 * @param dateRange 日期范围
 * @returns 用户增长数据
 */
export const getUserGrowthData = async (
  dateRange?: DateRange,
): Promise<ApiResponse<Record<string, unknown>>> => {
  return apiGet('/analytics/user-growth', { dateRange }, async () => {
    const chartData = await mockGetChartData()
    return {
      code: 200,
      message: 'success',
      data: chartData.userGrowth,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取分类分布数据
 * @param dateRange 日期范围
 * @returns 分类分布数据
 */
export const getCategoryDistributionData = async (
  dateRange?: DateRange,
): Promise<ApiResponse<Record<string, unknown>>> => {
  return apiGet('/analytics/category-distribution', { dateRange }, async () => {
    const chartData = await mockGetChartData()
    return {
      code: 200,
      message: 'success',
      data: chartData.categoryDistribution,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取地区分布数据
 * @param dateRange 日期范围
 * @returns 地区分布数据
 */
export const getRegionDistributionData = async (
  dateRange?: DateRange,
): Promise<ApiResponse<Record<string, unknown>>> => {
  return apiGet('/analytics/region-distribution', { dateRange }, async () => {
    const chartData = await mockGetChartData()
    return {
      code: 200,
      message: 'success',
      data: chartData.regionDistribution,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取支付方式分布数据
 * @param dateRange 日期范围
 * @returns 支付方式分布数据
 */
export const getPaymentDistributionData = async (
  dateRange?: DateRange,
): Promise<ApiResponse<Record<string, unknown>>> => {
  return apiGet('/analytics/payment-distribution', { dateRange }, async () => {
    const chartData = await mockGetChartData()
    return {
      code: 200,
      message: 'success',
      data: chartData.paymentDistribution,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取柱状图数据
 * @param period 时间周期
 * @param dateRange 日期范围
 * @returns 柱状图数据
 */
export const getBarChartData = async (
  period: 'month' | 'quarter' = 'month',
  dateRange?: DateRange,
): Promise<ApiResponse<Record<string, unknown>>> => {
  return apiGet('/analytics/bar-chart', { period, dateRange }, async () => {
    const chartData = await mockGetChartData()
    return {
      code: 200,
      message: 'success',
      data: chartData.barChart,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取面积图数据
 * @param dateRange 日期范围
 * @returns 面积图数据
 */
export const getAreaChartData = async (
  dateRange?: DateRange,
): Promise<ApiResponse<Record<string, unknown>>> => {
  return apiGet('/analytics/area-chart', { dateRange }, async () => {
    const chartData = await mockGetChartData()
    return {
      code: 200,
      message: 'success',
      data: chartData.areaChart,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取热力图数据
 * @param metric 指标类型
 * @param dateRange 日期范围
 * @returns 热力图数据
 */
export const getHeatmapData = async (
  metric: 'activity' | 'orders' | 'revenue' = 'activity',
  dateRange?: DateRange,
): Promise<ApiResponse<Record<string, unknown>>> => {
  return apiGet('/analytics/heatmap', { metric, dateRange }, async () => {
    const chartData = await mockGetChartData()
    return {
      code: 200,
      message: 'success',
      data: chartData.heatmap,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取批量图表数据
 * @param dateRange 日期范围
 * @returns 批量图表数据
 */
export const getBatchChartData = async (
  dateRange?: DateRange,
): Promise<ApiResponse<ChartDataResponse>> => {
  return apiGet('/analytics/batch-charts', { dateRange }, async () => {
    const mockData = await mockGetChartData()
    return {
      code: 200,
      message: 'success',
      data: mockData,
      timestamp: Date.now(),
    }
  })
}

/**
 * 导出报告
 * @param dateRange 日期范围
 * @returns 导出文件
 */
export const exportReport = async (dateRange?: DateRange): Promise<ApiResponse<Blob>> => {
  return apiGet('/analytics/export', { dateRange }, async () => {
    // Mock 导出功能
    const blob = new Blob(['Mock export data'], { type: 'application/octet-stream' })
    return {
      code: 200,
      message: 'success',
      data: blob,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取实时数据
 * @returns 实时数据
 */
export const getRealtimeData = async (): Promise<ApiResponse<RealtimeData>> => {
  return apiGet('/analytics/realtime', {}, async () => {
    const mockData = await mockGetOverviewData()
    return {
      code: 200,
      message: 'success',
      data: mockData.realtime,
      timestamp: Date.now(),
    }
  })
}

/**
 * 导出表格数据
 * @param type 数据类型
 * @param dateRange 日期范围
 * @returns 导出文件
 */
export const exportTableData = async (
  type: 'products' | 'users' | 'orders',
  dateRange?: DateRange,
): Promise<ApiResponse<Blob>> => {
  return apiGet(`/analytics/export/${type}`, { dateRange }, async () => {
    // Mock 导出功能
    const blob = new Blob([`Mock ${type} export data`], { type: 'application/octet-stream' })
    return {
      code: 200,
      message: 'success',
      data: blob,
      timestamp: Date.now(),
    }
  })
}
