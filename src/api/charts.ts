import { generateMockData } from '@/utils/mockDataGenerator'
import type { ApiResponse } from '@/types/charts'

/**
 * 模拟API延迟
 */
const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 创建API响应格式
 */
const createApiResponse = <T>(data: T): ApiResponse<T> => ({
  code: 200,
  message: 'success',
  data,
  timestamp: Date.now(),
})

// ==================== DataView.vue 相关API ====================

/**
 * 获取数据分析概览数据
 */
export const getAnalyticsOverviewData = async (): Promise<ApiResponse<any>> => {
  await simulateDelay(200)
  const data = generateMockData.dataAnalysis()

  return createApiResponse({
    totalSales: data.salesTrend.series[0].data.reduce((sum, val) => sum + val, 0),
    totalOrders: data.salesTrend.series[1].data.reduce((sum, val) => sum + val, 0),
    newUsers: data.userGrowth.series[0].data[data.userGrowth.series[0].data.length - 1],
    conversionRate: (Math.random() * 3 + 2).toFixed(2) + '%',
  })
}

/**
 * 获取销售趋势数据
 */
export const getSalesTrendData = async (period: string = '30d'): Promise<ApiResponse<any>> => {
  await simulateDelay(300)
  const mockData = generateMockData.dataAnalysis().salesTrend

  // 转换为图表所需的格式
  const categories = mockData.data.map((item) => item.date)
  const revenueData = mockData.data.map((item) => item.revenue)
  const ordersData = mockData.data.map((item) => item.orders)

  const chartData = {
    categories,
    series: [
      {
        name: '销售额',
        data: revenueData,
        type: 'line',
        color: '#1890ff',
      },
      {
        name: '订单数',
        data: ordersData,
        type: 'line',
        color: '#52c41a',
        dashStyle: 'dash',
      },
    ],
  }

  return createApiResponse(chartData)
}

/**
 * 获取用户增长数据
 */
export const getUserGrowthData = async (): Promise<ApiResponse<any>> => {
  await simulateDelay(250)
  const data = generateMockData.dataAnalysis().userGrowth

  return createApiResponse(data)
}

/**
 * 获取分类分布数据
 */
export const getCategoryDistributionData = async (): Promise<ApiResponse<any>> => {
  await simulateDelay(200)
  const data = generateMockData.dataAnalysis().categoryDistribution

  return createApiResponse(data)
}

/**
 * 获取地区分布数据
 */
export const getRegionDistributionData = async (): Promise<ApiResponse<any>> => {
  await simulateDelay(250)
  const data = generateMockData.dataAnalysis().regionDistribution

  return createApiResponse(data)
}

/**
 * 获取支付方式分布数据
 */
export const getPaymentDistributionData = async (): Promise<ApiResponse<any>> => {
  await simulateDelay(200)
  const data = generateMockData.dataAnalysis().paymentDistribution

  return createApiResponse(data)
}

/**
 * 获取实时数据概览
 */
export const getRealtimeOverview = async (): Promise<ApiResponse<any>> => {
  await simulateDelay(150)

  return createApiResponse({
    totalUsers: Math.floor(Math.random() * 5000) + 1000,
    totalProducts: Math.floor(Math.random() * 1000) + 500,
    totalOrders: Math.floor(Math.random() * 2000) + 800,
    totalRevenue: Math.floor(Math.random() * 500000) + 100000,
    todaySales: Math.floor(Math.random() * 50000) + 25000,
    todayOrders: Math.floor(Math.random() * 500) + 200,
    onlineUsers: Math.floor(Math.random() * 1000) + 500,
    conversionRate: (Math.random() * 5 + 2).toFixed(2),
  })
}

/**
 * 获取热力图数据
 */
export const getHeatmapData = async (): Promise<ApiResponse<any>> => {
  await simulateDelay(300)

  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

  const data: [number, number, number][] = []
  let maxValue = 0

  for (let i = 0; i < days.length; i++) {
    for (let j = 0; j < hours.length; j++) {
      const value = Math.floor(Math.random() * 100)
      data.push([j, i, value])
      maxValue = Math.max(maxValue, value)
    }
  }

  return createApiResponse({
    xAxis: hours,
    yAxis: days,
    data,
    max: maxValue,
  })
}

// ==================== DashboardView.vue 相关API ====================

/**
 * 获取仪表板统计数据
 */
export const getDashboardStats = async (): Promise<ApiResponse<any>> => {
  await simulateDelay(200)
  const data = generateMockData.dashboard().stats

  return createApiResponse(data)
}

/**
 * 获取仪表板销售趋势数据
 * @param period 时间周期 '7d' | '30d' | '90d'
 */
export const getDashboardSalesTrend = async (period: string = '7d'): Promise<ApiResponse<any>> => {
  await simulateDelay()
  return createApiResponse(generateMockData.generateDashboardSalesTrendData(period))
}

/**
 * 获取仪表板订单状态数据
 */
export const getDashboardOrderStatus = async (): Promise<ApiResponse<any>> => {
  await simulateDelay()
  return createApiResponse(generateMockData.generateDashboardOrderStatusData())
}

// ==================== AdvancedCharts.vue 相关API ====================

/**
 * 获取订单状态数据 - 符合Highcharts饼图标准
 */
export const getOrderStatusData = async (): Promise<ApiResponse<any>> => {
  await simulateDelay()
  const data = generateMockData.generateAdvancedChartsData().orderStatus
  // 计算百分比
  const total = data.reduce((sum, item) => sum + item.y, 0)
  const dataWithPercentage = data.map((item) => ({
    ...item,
    percentage: parseFloat(((item.y / total) * 100).toFixed(1)),
  }))
  return createApiResponse(dataWithPercentage)
}

/**
 * 获取商品排行数据 - 符合Highcharts柱图标准
 */
export const getProductRankingData = async (params?: {
  type?: 'sales' | 'quantity'
}): Promise<ApiResponse<any>> => {
  await simulateDelay()
  const baseData = generateMockData.generateAdvancedChartsData().productRanking

  // 根据类型调整数据
  if (params?.type === 'quantity') {
    return createApiResponse({
      ...baseData,
      series: [
        {
          ...baseData.series[0],
          name: '销售数量',
          data: baseData.series[0].data.map((val) => Math.floor(val / 10)), // 数量通常比金额小
        },
      ],
    })
  }

  return createApiResponse(baseData)
}

/**
 * 获取用户活跃度数据 - 符合Highcharts折线图标准
 */
export const getUserActivityData = async (params?: {
  period?: 'week' | 'month' | 'quarter'
}): Promise<ApiResponse<any>> => {
  await simulateDelay()
  const baseData = generateMockData.generateAdvancedChartsData().userActivity

  // 根据周期调整数据
  let categories = baseData.categories
  let dataLength = 7

  if (params?.period === 'month') {
    categories = Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
    dataLength = 30
  } else if (params?.period === 'quarter') {
    categories = ['1月', '2月', '3月']
    dataLength = 3
  }

  return createApiResponse({
    categories,
    series: baseData.series.map((series) => ({
      ...series,
      data: Array.from(
        { length: dataLength },
        () =>
          Math.floor(Math.random() * (series.name === '活跃用户' ? 1900 - 1200 : 250 - 100)) +
          (series.name === '活跃用户' ? 1200 : 100),
      ),
    })),
  })
}

/**
 * 获取地区销售数据 - 符合Highcharts环形图标准
 */
export const getRegionSalesData = async (params?: {
  metric?: 'sales' | 'orders'
}): Promise<ApiResponse<any>> => {
  await simulateDelay()
  const baseData = generateMockData.generateAdvancedChartsData().regionSales

  // 根据指标调整数据
  if (params?.metric === 'orders') {
    const dataWithOrders = baseData.map((item) => ({
      ...item,
      y: Math.floor(item.y / 100), // 订单数通常比销售额小
    }))
    return createApiResponse(dataWithOrders)
  }

  return createApiResponse(baseData)
}

// ==================== 通用API ====================

/**
 * 获取图表配置选项
 */
export const getChartOption = (configKey: string, data?: any): any => {
  // 这个函数将在组件中直接使用chartConfigs，这里保留接口兼容性
  return null
}

/**
 * 批量获取图表数据
 */
export const getBatchChartData = async (
  requests: string[],
): Promise<ApiResponse<Record<string, any>>> => {
  await simulateDelay(500)

  const results: Record<string, any> = {}

  for (const request of requests) {
    switch (request) {
      case 'analytics':
        results.analytics = generateMockData.dataAnalysis()
        break
      case 'dashboard':
        results.dashboard = generateMockData.dashboard()
        break
      case 'advanced':
        results.advanced = generateMockData.generateAdvancedChartsData()
        break
      case 'bar':
        // 生成柱状图数据
        results.bar = [
          { category: '一月', value: 120, color: '#1890ff' },
          { category: '二月', value: 200, color: '#52c41a' },
          { category: '三月', value: 150, color: '#faad14' },
          { category: '四月', value: 180, color: '#f5222d' },
          { category: '五月', value: 220, color: '#722ed1' },
          { category: '六月', value: 190, color: '#fa8c16' },
        ]
        break
      default:
        results[request] = null
    }
  }

  return createApiResponse(results)
}

/**
 * 获取产品销售数据
 */
export const getProductSalesData = async (
  params: { period?: string } = {},
): Promise<ApiResponse<any>> => {
  await simulateDelay(400)
  const data = generateMockData.generateAdvancedChartsData().productRanking

  return createApiResponse(data)
}
