import { ref, computed, type Ref } from 'vue'
import { message } from 'ant-design-vue'
import type { Options } from 'highcharts'

/**
 * 图表数据加载函数类型
 */
type ChartDataLoader<T = unknown, P = unknown> = (params?: P) => Promise<{ data: T }>

/**
 * 图表配置生成函数类型
 */
type ChartConfigGenerator<T = unknown> = (data: T, baseConfig: Options) => Options

/**
 * 图表数据管理Hook的配置选项
 */
interface UseChartDataOptions<T, P> {
  /** 数据加载函数 */
  loader: ChartDataLoader<T, P>
  /** 图表配置生成函数 */
  configGenerator: ChartConfigGenerator<T>
  /** 基础图表配置 */
  baseConfig: Options
  /** 初始数据 */
  initialData?: T
  /** 错误消息前缀 */
  errorMessagePrefix?: string
  /** 成功消息前缀 */
  successMessagePrefix?: string
}

/**
 * 图表数据管理Hook的返回值
 */
interface UseChartDataReturn<T, P> {
  /** 图表数据 */
  data: Ref<T | undefined>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 图表配置选项 */
  chartOptions: Ref<Options>
  /** 加载数据 */
  loadData: (params?: P) => Promise<void>
  /** 刷新数据 */
  refreshData: (params?: P, showMessage?: boolean) => Promise<void>
  /** 重置数据 */
  resetData: () => void
}

/**
 * 通用图表数据管理Hook
 * 
 * @template T 数据类型
 * @template P 参数类型
 * @param options 配置选项
 * @returns 图表数据管理对象
 * 
 * @example
 * ```typescript
 * const {
 *   data: orderStatusData,
 *   loading: orderStatusLoading,
 *   chartOptions: orderStatusOptions,
 *   loadData: loadOrderStatus,
 *   refreshData: refreshOrderStatus
 * } = useChartData({
 *   loader: getOrderStatusData,
 *   configGenerator: (data, baseConfig) => ({
 *     ...baseConfig,
 *     series: [{ ...baseConfig.series[0], data }]
 *   }),
 *   baseConfig: advancedChartConfigs.orderStatus,
 *   initialData: [],
 *   errorMessagePrefix: '订单状态数据',
 *   successMessagePrefix: '订单状态数据'
 * })
 * ```
 */
export function useChartData<T = unknown, P = unknown>({
  loader,
  configGenerator,
  baseConfig,
  initialData,
  errorMessagePrefix = '数据',
  successMessagePrefix = '数据'
}: UseChartDataOptions<T, P>): UseChartDataReturn<T, P> {
  // 响应式数据
  const data = ref(initialData) as Ref<T | undefined>
  const loading = ref(false)

  /**
   * 计算图表配置选项
   */
  const chartOptions = computed<Options>(() => {
    if (!data.value) return {}
    return configGenerator(data.value, baseConfig)
  })

  /**
   * 加载数据
   * @param params 请求参数
   */
  const loadData = async (params?: P): Promise<void> => {
    try {
      const response = await loader(params)
      data.value = response.data
    } catch (error) {
      message.error(`加载${errorMessagePrefix}失败`)
      console.error(`${errorMessagePrefix}加载错误:`, error)
      throw error
    }
  }

  /**
   * 刷新数据
   * @param params 请求参数
   * @param showMessage 是否显示成功消息
   */
  const refreshData = async (params?: P, showMessage = true): Promise<void> => {
    loading.value = true
    try {
      await loadData(params)
      if (showMessage) {
        message.success(`${successMessagePrefix}已刷新`)
      }
    } catch (error) {
      message.error(`刷新${errorMessagePrefix}失败`)
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置数据
   */
  const resetData = (): void => {
    data.value = initialData
    loading.value = false
  }

  return {
    data,
    loading,
    chartOptions,
    loadData,
    refreshData,
    resetData
  }
}

/**
 * 批量图表数据管理Hook
 * 
 * @param charts 图表配置数组
 * @returns 批量图表数据管理对象
 * 
 * @example
 * ```typescript
 * const charts = useBatchChartData([
 *   {
 *     key: 'orderStatus',
 *     loader: getOrderStatusData,
 *     configGenerator: (data, baseConfig) => ({ ...baseConfig, series: [{ ...baseConfig.series[0], data }] }),
 *     baseConfig: advancedChartConfigs.orderStatus,
 *     initialData: []
 *   },
 *   // ... 其他图表配置
 * ])
 * ```
 */
export function useBatchChartData<T extends Record<string, unknown>>(
  charts: Array<{
    key: keyof T
    loader: ChartDataLoader
    configGenerator: ChartConfigGenerator
    baseConfig: Options
    initialData?: unknown
    errorMessagePrefix?: string
    successMessagePrefix?: string
  }>
) {
  const chartInstances = {} as Record<keyof T, UseChartDataReturn<any, any>>

  // 创建每个图表的数据管理实例
  charts.forEach(chart => {
    chartInstances[chart.key] = useChartData({
      loader: chart.loader,
      configGenerator: chart.configGenerator,
      baseConfig: chart.baseConfig,
      initialData: chart.initialData,
      errorMessagePrefix: chart.errorMessagePrefix,
      successMessagePrefix: chart.successMessagePrefix
    })
  })

  /**
   * 批量加载所有图表数据
   */
  const loadAllData = async (): Promise<void> => {
    const loadPromises = Object.values(chartInstances).map(instance => 
      instance.loadData().catch(error => {
        console.error('批量加载图表数据时发生错误:', error)
        return null // 继续执行其他图表的加载
      })
    )
    
    await Promise.allSettled(loadPromises)
  }

  /**
   * 批量重置所有图表数据
   */
  const resetAllData = (): void => {
    Object.values(chartInstances).forEach(instance => instance.resetData())
  }

  return {
    charts: chartInstances,
    loadAllData,
    resetAllData
  }
}