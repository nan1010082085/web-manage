/**
 * 数据分析相关API接口
 */
import { generateMockData } from '@/utils/mockDataGenerator'
import { apiGet, type ApiResponse } from './index'

// 模拟API延迟
const mockApiDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取销售趋势数据
 * @returns 销售趋势数据
 */
export const getSalesTrendData = async (): Promise<ApiResponse<any>> => {
  return apiGet(
    '/data-analysis/sales-trend',
    {},
    async () => {
      await mockApiDelay()
      const data = generateMockData.dataAnalysis().salesTrend
      
      return {
        code: 200,
        message: 'success',
        data,
        timestamp: Date.now()
      }
    }
  )
}

/**
 * 获取用户增长数据
 * @returns 用户增长数据
 */
export const getUserGrowthData = async (): Promise<ApiResponse<any>> => {
  return apiGet(
    '/data-analysis/user-growth',
    {},
    async () => {
      await mockApiDelay()
      const data = generateMockData.dataAnalysis().userGrowth
      
      return {
        code: 200,
        message: 'success',
        data,
        timestamp: Date.now()
      }
    }
  )
}

/**
 * 获取分类分布数据
 * @returns 分类分布数据
 */
export const getCategoryDistributionData = async (): Promise<ApiResponse<any>> => {
  return apiGet(
    '/data-analysis/category-distribution',
    {},
    async () => {
      await mockApiDelay()
      const data = generateMockData.dataAnalysis().categoryDistribution
      
      return {
        code: 200,
        message: 'success',
        data,
        timestamp: Date.now()
      }
    }
  )
}

/**
 * 获取地区分布数据
 * @returns 地区分布数据
 */
export const getRegionDistributionData = async (): Promise<ApiResponse<any>> => {
  return apiGet(
    '/data-analysis/region-distribution',
    {},
    async () => {
      await mockApiDelay()
      const data = generateMockData.dataAnalysis().regionDistribution
      
      return {
        code: 200,
        message: 'success',
        data,
        timestamp: Date.now()
      }
    }
  )
}

/**
 * 获取支付方式分布数据
 * @returns 支付方式分布数据
 */
export const getPaymentDistributionData = async (): Promise<ApiResponse<any>> => {
  return apiGet(
    '/data-analysis/payment-distribution',
    {},
    async () => {
      await mockApiDelay()
      const data = generateMockData.dataAnalysis().paymentDistribution
      
      return {
        code: 200,
        message: 'success',
        data,
        timestamp: Date.now()
      }
    }
  )
}

/**
 * 获取批量图表数据
 * @param chartTypes 图表类型数组
 * @returns 批量图表数据
 */
export const getBatchChartData = async (chartTypes: string[]): Promise<ApiResponse<any>> => {
  return apiGet(
    '/data-analysis/batch-charts',
    { chartTypes },
    async () => {
      await mockApiDelay()
      const mockData = generateMockData.dataAnalysis()
      
      let data = {}
      if (chartTypes.includes('bar')) {
        data = mockData.barChart
      }
      
      return {
        code: 200,
        message: 'success',
        data,
        timestamp: Date.now()
      }
    }
  )
}

/**
 * 获取热力图数据
 * @returns 热力图数据
 */
export const getHeatmapData = async (): Promise<ApiResponse<any>> => {
  return apiGet(
    '/data-analysis/heatmap',
    {},
    async () => {
      await mockApiDelay()
      const data = generateMockData.dataAnalysis().heatmap
      
      return {
        code: 200,
        message: 'success',
        data,
        timestamp: Date.now()
      }
    }
  )
}