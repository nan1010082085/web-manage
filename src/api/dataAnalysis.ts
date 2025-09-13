/**
 * 数据分析相关API接口
 */
import { generateMockData } from '@/utils/mockDataGenerator'

// 模拟API延迟
const mockApiDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取销售趋势数据
 */
export const getSalesTrendData = async () => {
  await mockApiDelay()
  return generateMockData.dataAnalysis().salesTrend
}

/**
 * 获取用户增长数据
 */
export const getUserGrowthData = async () => {
  await mockApiDelay()
  return generateMockData.dataAnalysis().userGrowth
}

/**
 * 获取分类分布数据
 */
export const getCategoryDistributionData = async () => {
  await mockApiDelay()
  return generateMockData.dataAnalysis().categoryDistribution
}

/**
 * 获取地区分布数据
 */
export const getRegionDistributionData = async () => {
  await mockApiDelay()
  return generateMockData.dataAnalysis().regionDistribution
}

/**
 * 获取支付方式分布数据
 */
export const getPaymentDistributionData = async () => {
  await mockApiDelay()
  return generateMockData.dataAnalysis().paymentDistribution
}

/**
 * 获取批量图表数据
 */
export const getBatchChartData = async (chartTypes: string[]) => {
  await mockApiDelay()
  const mockData = generateMockData.dataAnalysis()
  
  if (chartTypes.includes('bar')) {
    return mockData.barChart
  }
  
  return {}
}

/**
 * 获取热力图数据
 */
export const getHeatmapData = async () => {
  await mockApiDelay()
  return generateMockData.dataAnalysis().heatmap
}