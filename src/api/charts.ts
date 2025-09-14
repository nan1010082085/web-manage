import { generateMockData } from '@/utils/mockDataGenerator'
import { apiGet, type ApiResponse } from './index'

// 模拟延迟函数
const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ==================== DataView.vue 相关API ====================

/**
 * 获取销售趋势数据
 * @param period 时间周期
 * @returns 销售趋势数据
 */
export const getSalesTrendData = async (period: string = '30d'): Promise<ApiResponse<any>> => {
  return apiGet('/charts/sales/trend', { period }, async () => {
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

    return {
      code: 200,
      message: 'success',
      data: chartData,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取用户增长数据
 * @returns 用户增长数据
 */
export const getUserGrowthData = async (): Promise<ApiResponse<any>> => {
  return apiGet('/charts/user/growth', {}, async () => {
    await simulateDelay(250)
    const data = generateMockData.dataAnalysis().userGrowth

    return {
      code: 200,
      message: 'success',
      data,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取分类分布数据
 * @returns 分类分布数据
 */
export const getCategoryDistributionData = async (): Promise<ApiResponse<any>> => {
  return apiGet('/charts/category/distribution', {}, async () => {
    await simulateDelay(200)
    const data = generateMockData.dataAnalysis().categoryDistribution

    return {
      code: 200,
      message: 'success',
      data,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取地区分布数据
 * @returns 地区分布数据
 */
export const getRegionDistributionData = async (): Promise<ApiResponse<any>> => {
  return apiGet('/charts/region/distribution', {}, async () => {
    await simulateDelay(250)
    const data = generateMockData.dataAnalysis().regionDistribution

    return {
      code: 200,
      message: 'success',
      data,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取支付方式分布数据
 * @returns 支付方式分布数据
 */
export const getPaymentDistributionData = async (): Promise<ApiResponse<any>> => {
  return apiGet('/charts/payment/distribution', {}, async () => {
    await simulateDelay(200)
    const data = generateMockData.dataAnalysis().paymentDistribution

    return {
      code: 200,
      message: 'success',
      data,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取实时数据概览
 * @returns 实时数据概览
 */
export const getRealtimeOverview = async (): Promise<ApiResponse<any>> => {
  return apiGet('/charts/realtime/overview', {}, async () => {
    await simulateDelay(150)

    return {
      code: 200,
      message: 'success',
      data: {
        totalUsers: Math.floor(Math.random() * 5000) + 1000,
        totalProducts: Math.floor(Math.random() * 1000) + 500,
        totalOrders: Math.floor(Math.random() * 2000) + 800,
        totalRevenue: Math.floor(Math.random() * 500000) + 100000,
        todaySales: Math.floor(Math.random() * 50000) + 25000,
        todayOrders: Math.floor(Math.random() * 500) + 200,
        onlineUsers: Math.floor(Math.random() * 1000) + 500,
        conversionRate: (Math.random() * 5 + 2).toFixed(2),
      },
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取热力图数据
 * @returns 热力图数据
 */
export const getHeatmapData = async (): Promise<ApiResponse<any>> => {
  return apiGet('/charts/heatmap', {}, async () => {
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

    return {
      code: 200,
      message: 'success',
      data: {
        xAxis: hours,
        yAxis: days,
        data,
        max: maxValue,
      },
      timestamp: Date.now(),
    }
  })
}

// ==================== DashboardView.vue 相关API ====================

/**
 * 获取仪表板统计数据
 * @returns 仪表板统计数据
 */
export const getDashboardStats = async (): Promise<ApiResponse<any>> => {
  return apiGet('/charts/dashboard/stats', {}, async () => {
    await simulateDelay(200)
    const data = generateMockData.dashboard().stats

    return {
      code: 200,
      message: 'success',
      data,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取仪表板销售趋势数据
 * @param period 时间周期 '7d' | '30d' | '90d'
 * @returns 销售趋势数据
 */
export const getDashboardSalesTrend = async (period: string = '7d'): Promise<ApiResponse<any>> => {
  return apiGet('/charts/dashboard/sales-trend', { period }, async () => {
    await simulateDelay()
    const data = generateMockData.generateDashboardSalesTrendData(period)

    return {
      code: 200,
      message: 'success',
      data,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取仪表板订单状态数据
 * @returns 订单状态数据
 */
export const getDashboardOrderStatus = async (): Promise<ApiResponse<any>> => {
  return apiGet('/charts/dashboard/order-status', {}, async () => {
    await simulateDelay()
    const data = generateMockData.generateDashboardOrderStatusData()

    return {
      code: 200,
      message: 'success',
      data,
      timestamp: Date.now(),
    }
  })
}

// ==================== AdvancedCharts.vue 相关API ====================

/**
 * 获取订单状态数据 - 符合Highcharts饼图标准
 * @returns 订单状态数据
 */
export const getOrderStatusData = async (): Promise<ApiResponse<any>> => {
  return apiGet('/charts/order/status', {}, async () => {
    await simulateDelay()
    const data = generateMockData.generateAdvancedChartsData().orderStatus
    // 计算百分比
    const total = data.reduce((sum, item) => sum + item.y, 0)
    const dataWithPercentage = data.map((item) => ({
      ...item,
      percentage: parseFloat(((item.y / total) * 100).toFixed(1)),
    }))

    return {
      code: 200,
      message: 'success',
      data: dataWithPercentage,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取商品排行数据 - 符合Highcharts柱图标准
 * @param params 查询参数
 * @returns 商品排行数据
 */
export const getProductRankingData = async (params?: {
  type?: 'sales' | 'quantity'
}): Promise<ApiResponse<any>> => {
  return apiGet('/charts/product/ranking', params || {}, async () => {
    await simulateDelay()
    const baseData = generateMockData.generateAdvancedChartsData().productRanking

    // 根据类型调整数据
    if (params?.type === 'quantity') {
      const data = {
        ...baseData,
        series: [
          {
            ...baseData.series[0],
            name: '销售数量',
            data: baseData.series[0].data.map((val) => Math.floor(val / 10)), // 数量通常比金额小
          },
        ],
      }

      return {
        code: 200,
        message: 'success',
        data,
        timestamp: Date.now(),
      }
    }

    return {
      code: 200,
      message: 'success',
      data: baseData,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取用户活跃度数据 - 符合Highcharts折线图标准
 * @param params 查询参数
 * @returns 用户活跃度数据
 */
export const getUserActivityData = async (params?: {
  period?: 'week' | 'month' | 'quarter'
}): Promise<ApiResponse<any>> => {
  return apiGet('/charts/user/activity', params || {}, async () => {
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

    const data = {
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
    }

    return {
      code: 200,
      message: 'success',
      data,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取地区销售数据 - 符合Highcharts环形图标准
 * @param params 查询参数
 * @returns 地区销售数据
 */
export const getRegionSalesData = async (params?: {
  metric?: 'sales' | 'orders'
}): Promise<ApiResponse<any>> => {
  return apiGet('/charts/region/sales', params || {}, async () => {
    await simulateDelay()
    const baseData = generateMockData.generateAdvancedChartsData().regionSales

    // 根据指标调整数据
    if (params?.metric === 'orders') {
      const dataWithOrders = baseData.map((item) => ({
        ...item,
        y: Math.floor(item.y / 100), // 订单数通常比销售额小
      }))

      return {
        code: 200,
        message: 'success',
        data: dataWithOrders,
        timestamp: Date.now(),
      }
    }

    return {
      code: 200,
      message: 'success',
      data: baseData,
      timestamp: Date.now(),
    }
  })
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
 * @param requests 请求的数据类型数组
 * @returns 批量图表数据
 */
export const getBatchChartData = async (
  requests: string[],
): Promise<ApiResponse<Record<string, any>>> => {
  return apiGet('/charts/batch', { requests }, async () => {
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

    return {
      code: 200,
      message: 'success',
      data: results,
      timestamp: Date.now(),
    }
  })
}

/**
 * 获取产品销售数据
 * @param params 查询参数
 * @returns 产品销售数据
 */
export const getProductSalesData = async (
  params: { period?: string } = {},
): Promise<ApiResponse<any>> => {
  return apiGet('/charts/product/sales', params, async () => {
    await simulateDelay(400)
    const data = generateMockData.generateAdvancedChartsData().productRanking

    return {
      code: 200,
      message: 'success',
      data,
      timestamp: Date.now(),
    }
  })
}
