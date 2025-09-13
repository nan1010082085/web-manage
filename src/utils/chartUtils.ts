import type { Options } from 'highcharts'
import type { OrderStatusData, ProductRankingData, UserActivityData, RegionSalesData } from '@/types/charts'

/**
 * 深度合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {} as any, source[key] as any)
    } else {
      result[key] = source[key] as any
    }
  }
  
  return result
}

/**
 * 图表配置生成器类型
 */
export interface ChartConfigGenerator<T = any> {
  (data: T, baseConfig: any): Options
}

/**
 * 订单状态图表配置生成器
 * @param data 订单状态数据
 * @param baseConfig 基础配置
 * @returns 图表配置选项
 */
export const createOrderStatusConfig: ChartConfigGenerator<OrderStatusData[]> = (
  data,
  baseConfig
) => {
  if (!data || data.length === 0) return {}
  
  return deepMerge(baseConfig, {
    series: [{
      ...baseConfig.series[0],
      data: data
    }]
  })
}

/**
 * 商品排行图表配置生成器
 * @param data 商品排行数据
 * @param baseConfig 基础配置
 * @returns 图表配置选项
 */
export const createProductRankingConfig: ChartConfigGenerator<ProductRankingData> = (
  data,
  baseConfig
) => {
  if (!data || !data.categories || !data.series) return {}
  
  return deepMerge(baseConfig, {
    xAxis: {
      ...baseConfig.xAxis,
      categories: data.categories
    },
    series: data.series
  })
}

/**
 * 用户活跃度图表配置生成器
 * @param data 用户活跃度数据
 * @param baseConfig 基础配置
 * @returns 图表配置选项
 */
export const createUserActivityConfig: ChartConfigGenerator<UserActivityData> = (
  data,
  baseConfig
) => {
  if (!data || !data.categories || !data.series) return {}
  
  return deepMerge(baseConfig, {
    xAxis: {
      ...baseConfig.xAxis,
      categories: data.categories
    },
    series: data.series
  })
}

/**
 * 地区销售图表配置生成器
 * @param data 地区销售数据
 * @param baseConfig 基础配置
 * @returns 图表配置选项
 */
export const createRegionSalesConfig: ChartConfigGenerator<RegionSalesData[]> = (
  data,
  baseConfig
) => {
  if (!data || data.length === 0) return {}
  
  return deepMerge(baseConfig, {
    series: [{
      ...baseConfig.series[0],
      data: data
    }]
  })
}

/**
 * 图表配置生成器映射
 */
export const chartConfigGenerators = {
  orderStatus: createOrderStatusConfig,
  productRanking: createProductRankingConfig,
  userActivity: createUserActivityConfig,
  regionSales: createRegionSalesConfig
} as const

/**
 * 通用图表配置生成器
 * @param type 图表类型
 * @param data 图表数据
 * @param baseConfig 基础配置
 * @returns 图表配置选项
 */
export function createChartConfig<T = any>(
  type: keyof typeof chartConfigGenerators,
  data: T,
  baseConfig: any
): Options {
  const generator = chartConfigGenerators[type] as ChartConfigGenerator<T>
  return generator(data, baseConfig)
}

/**
 * 图表响应式配置选项
 */
export const responsiveChartOptions: Partial<Options> = {
  chart: {
    animation: {
      duration: 300
    },
    style: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }
  },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 768
        },
        chartOptions: {
          chart: {
            height: 250
          },
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          },
          xAxis: {
            labels: {
              rotation: -45,
              style: {
                fontSize: '10px'
              }
            }
          },
          yAxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        }
      },
      {
        condition: {
          maxWidth: 480
        },
        chartOptions: {
          chart: {
            height: 200
          },
          title: {
            style: {
              fontSize: '14px'
            }
          },
          legend: {
            enabled: false
          }
        }
      }
    ]
  }
}

/**
 * 应用响应式配置到图表选项
 * @param options 原始图表选项
 * @returns 应用响应式配置后的图表选项
 */
export function applyResponsiveConfig(options: Options): Options {
  return deepMerge(options, responsiveChartOptions)
}

/**
 * 图表主题配置
 */
export const chartThemes = {
  light: {
    chart: {
      backgroundColor: '#ffffff'
    },
    title: {
      style: {
        color: '#333333'
      }
    },
    xAxis: {
      gridLineColor: '#e6e6e6',
      labels: {
        style: {
          color: '#666666'
        }
      }
    },
    yAxis: {
      gridLineColor: '#e6e6e6',
      labels: {
        style: {
          color: '#666666'
        }
      }
    }
  },
  dark: {
    chart: {
      backgroundColor: '#1f1f1f'
    },
    title: {
      style: {
        color: '#ffffff'
      }
    },
    xAxis: {
      gridLineColor: '#404040',
      labels: {
        style: {
          color: '#cccccc'
        }
      }
    },
    yAxis: {
      gridLineColor: '#404040',
      labels: {
        style: {
          color: '#cccccc'
        }
      }
    }
  }
} as const

/**
 * 应用主题到图表选项
 * @param options 原始图表选项
 * @param theme 主题名称
 * @returns 应用主题后的图表选项
 */
export function applyTheme(
  options: Options,
  theme: keyof typeof chartThemes = 'light'
): Options {
  return deepMerge(options, chartThemes[theme])
}