/**
 * 图表数据配置文件
 * 统一管理图表数据结构和类型定义
 */

import type { Options } from 'highcharts'

/**
 * 图表数据点接口
 */
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

/**
 * 图表系列数据接口
 */
export interface ChartSeries {
  name: string
  data: number[] | ChartDataPoint[]
  color?: string
  type?: string
}

/**
 * 图表配置接口
 */
export interface ChartConfig {
  title: string
  categories?: string[]
  series: ChartSeries[]
  yAxisTitle?: string
  xAxisTitle?: string
}

/**
 * HighCharts配置生成器接口
 */
export interface ChartOptionGenerator {
  (data: any, options?: any): Options
}

/**
 * 销售趋势图配置生成器
 */
export const createSalesTrendOption: ChartOptionGenerator = (data, options = {}) => {
  const salesData = data || []

  return {
    title: {
      text: '销售趋势分析',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`
        params.forEach((item: any) => {
          result += `${item.marker}${item.seriesName}: ${item.value.toLocaleString()}<br/>`
        })
        return result
      },
    },
    legend: {
      data: ['销售额', '订单数'],
      top: 30,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: salesData.map((item) => item.date),
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额 (元)',
        position: 'left',
        axisLabel: {
          formatter: '{value}',
        },
      },
      {
        type: 'value',
        name: '订单数',
        position: 'right',
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        yAxisIndex: 0,
        data: salesData.map((item) => item.revenue),
        smooth: true,
        itemStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
            ],
          },
        },
      },
      {
        name: '订单数',
        type: 'line',
        yAxisIndex: 1,
        data: salesData.map((item) => item.orders),
        smooth: true,
        itemStyle: {
          color: '#52c41a',
        },
      },
    ],
  }
}

/**
 * 订单状态分布饼图配置生成器
 */
export const createOrderStatusOption: ChartOptionGenerator = (data) => {
  const orderData = data || []

  return {
    title: {
      text: '订单状态分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: orderData.map((item) => item.label),
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: orderData.map((item) => ({
          value: item.count,
          name: item.label,
          itemStyle: {
            color: item.color,
          },
        })),
      },
    ],
  }
}

/**
 * 商品销售排行柱状图配置生成器
 */
export const createProductSalesOption: ChartOptionGenerator = (data) => {
  const productData = (data || []).slice(0, 10)

  return {
    title: {
      text: '商品销售排行 TOP 10',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>销量: ${data.value}<br/>销售额: ¥${productData[data.dataIndex].revenue.toLocaleString()}`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: productData.map((item) => item.productName),
      axisLabel: {
        interval: 0,
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: '销量',
    },
    series: [
      {
        name: '销量',
        type: 'bar',
        data: productData.map((item, index) => ({
          value: item.sales,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#1890ff' },
                { offset: 1, color: '#69c0ff' },
              ],
            },
          },
        })),
        barWidth: '60%',
      },
    ],
  }
}

/**
 * 用户活跃度热力图配置生成器
 */
export const createHeatmapOption: ChartOptionGenerator = (data) => {
  const heatmapData = data || { xAxis: [], yAxis: [], data: [] }

  return {
    title: {
      text: '用户活跃度热力图',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        return `${heatmapData.xAxis[params.data[0]]} ${heatmapData.yAxis[params.data[1]]}<br/>活跃度: ${params.data[2]}`
      },
    },
    grid: {
      height: '50%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: heatmapData.xAxis,
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: 'category',
      data: heatmapData.yAxis,
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: [
          '#313695',
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffcc',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026',
        ],
      },
    },
    series: [
      {
        name: '活跃度',
        type: 'heatmap',
        data: heatmapData.data,
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
}

/**
 * 地区销售分布地图配置生成器
 */
export const createRegionSalesOption: ChartOptionGenerator = (data) => {
  const regionData = data || []

  return {
    title: {
      text: '地区销售分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const data = regionData.find((item) => item.region === params.name)
        return `${params.name}<br/>销量: ${data?.sales || 0}<br/>销售额: ¥${data?.revenue.toLocaleString() || 0}<br/>增长率: ${data?.growth || 0}%`
      },
    },
    visualMap: {
      min: 0,
      max: Math.max(...regionData.map((item) => item.sales)),
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true,
      inRange: {
        color: ['#e0f3ff', '#1890ff'],
      },
    },
    series: [
      {
        name: '销量',
        type: 'map',
        map: 'china',
        roam: false,
        label: {
          show: true,
        },
        data: regionData.map((item) => ({
          name: item.region,
          value: item.sales,
        })),
      },
    ],
  }
}

/**
 * 用户活跃度时间分布图配置生成器
 */
export const createUserActivityOption: ChartOptionGenerator = (data) => {
  const activityData = data || []

  return {
    title: {
      text: '24小时用户活跃度分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['活跃用户', '新增用户', '页面浏览量'],
      top: 30,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: activityData.map((item) => `${item.hour}:00`),
    },
    yAxis: [
      {
        type: 'value',
        name: '用户数',
        position: 'left',
      },
      {
        type: 'value',
        name: '页面浏览量',
        position: 'right',
      },
    ],
    series: [
      {
        name: '活跃用户',
        type: 'line',
        yAxisIndex: 0,
        data: activityData.map((item) => item.activeUsers),
        smooth: true,
        itemStyle: {
          color: '#1890ff',
        },
      },
      {
        name: '新增用户',
        type: 'line',
        yAxisIndex: 0,
        data: activityData.map((item) => item.newUsers),
        smooth: true,
        itemStyle: {
          color: '#52c41a',
        },
      },
      {
        name: '页面浏览量',
        type: 'bar',
        yAxisIndex: 1,
        data: activityData.map((item) => item.pageViews),
        itemStyle: {
          color: 'rgba(250, 173, 20, 0.6)',
        },
      },
    ],
  }
}

/**
 * 创建热力图配置
 * @param data - 热力图数据
 * @returns ECharts配置选项
 */
const createHeatmapConfig = (data?: any): Options => {
  return {
    title: {
      text: '用户活跃度热力图',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        return `${params.name}: ${params.value[2]}`
      },
    },
    grid: {
      height: '50%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: data?.hours || ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00'],
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: data?.days || ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: data?.max || 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: [
          '#313695',
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffcc',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026',
        ],
      },
    },
    series: [
      {
        name: '活跃度',
        type: 'heatmap',
        data: data?.data || [],
        label: { show: true },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
}

/**
 * 创建订单状态配置
 * @param data - 订单状态数据
 * @returns ECharts配置选项
 */
const createOrderStatusConfig = (data?: any): Options => {
  return {
    title: {
      text: '订单状态分布',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: '50%',
        data: data || [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
}

/**
 * 创建商品排行配置
 * @param data - 商品排行数据
 * @returns ECharts配置选项
 */
const createProductRankingConfig = (data?: any): Options => {
  return {
    title: {
      text: '商品销售排行',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
    },
    yAxis: {
      type: 'category',
      data: data?.categories || [],
    },
    series: data?.series || [],
  }
}

/**
 * 创建用户活跃度配置
 * @param data - 用户活跃度数据
 * @returns ECharts配置选项
 */
const createUserActivityConfig = (data?: any): Options => {
  return {
    title: {
      text: '用户活跃度分析',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['活跃用户', '新增用户'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data?.categories || [],
    },
    yAxis: {
      type: 'value',
    },
    series: data?.series || [],
  }
}

/**
 * 创建地区销售配置
 * @param data - 地区销售数据
 * @returns ECharts配置选项
 */
const createRegionSalesConfig = (data?: any): Options => {
  return {
    title: {
      text: '地区销售分布',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}: ${params.value[2]}`
      },
    },
    geo: {
      map: 'china',
      roam: true,
      scaleLimit: {
        min: 1,
        max: 2,
      },
      zoom: 1.2,
      top: 120,
      label: {
        show: true,
        fontSize: '14',
        color: 'rgba(0,0,0,0.7)',
      },
      itemStyle: {
        borderColor: 'rgba(0, 0, 0, 0.2)',
      },
      emphasis: {
        itemStyle: {
          areaColor: '#f2d5ad',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          borderWidth: 0,
        },
        label: {
          show: true,
        },
      },
    },
    series: [
      {
        name: '销售数据',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: data || [],
        symbolSize: (val: any) => Math.max(val[2] / 1000, 4),
        label: {
          formatter: '{b}',
          position: 'right',
          show: false,
        },
        itemStyle: {
          color: '#1890ff',
        },
        emphasis: {
          label: {
            show: true,
          },
        },
      },
    ],
  }
}

/**
 * 创建用户增长图表配置
 */
export const createUserGrowthOption: ChartOptionGenerator = (data) => {
  // 处理 {categories, series} 格式的数据
  if (data && typeof data === 'object' && 'categories' in data && 'series' in data) {
    return {
      title: {
        text: '用户增长趋势',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        data: data.series?.map((s: any) => s.name) || [],
        top: 30,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.categories || [],
      },
      yAxis: {
        type: 'value',
      },
      series: data.series?.map((s: any, index: number) => ({
        name: s.name,
        type: 'line',
        data: s.data || [],
        itemStyle: { 
          color: index === 0 ? '#1890ff' : index === 1 ? '#52c41a' : '#faad14' 
        },
      })) || [],
    }
  }
  
  // 向后兼容：处理数组格式的数据
  return {
    title: {
      text: '用户增长趋势',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['新增用户', '活跃用户', '总用户数'],
      top: 30,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data?.map((item: any) => item.date) || [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        stack: 'Total',
        data: data?.map((item: any) => item.newUsers) || [],
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '活跃用户',
        type: 'line',
        stack: 'Total',
        data: data?.map((item: any) => item.activeUsers) || [],
        itemStyle: { color: '#52c41a' },
      },
      {
        name: '总用户数',
        type: 'line',
        data: data?.map((item: any) => item.totalUsers) || [],
        itemStyle: { color: '#faad14' },
      },
    ],
  }
}

/**
 * 创建分类分布图表配置
 */
export const createCategoryDistributionOption: ChartOptionGenerator = (data) => {
  return {
    title: {
      text: '商品分类分布',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '分类分布',
        type: 'pie',
        radius: '50%',
        data:
          data?.map((item: any) => ({
            value: item.count,
            name: item.category,
            itemStyle: { color: item.color },
          })) || [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
}

/**
 * 创建地区分布图表配置
 */
export const createRegionDistributionOption: ChartOptionGenerator = (data) => {
  return {
    title: {
      text: '地区销售分布',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '地区分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        data:
          data?.map((item: any) => ({
            value: item.count,
            name: item.region,
            itemStyle: { color: item.color },
          })) || [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
}

/**
 * 创建支付方式分布图表配置
 */
export const createPaymentDistributionOption: ChartOptionGenerator = (data) => {
  return {
    title: {
      text: '支付方式分布',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      bottom: 10,
      left: 'center',
    },
    series: [
      {
        name: '支付方式',
        type: 'pie',
        radius: '65%',
        data:
          data?.map((item: any) => ({
            value: item.count,
            name: item.method,
            itemStyle: { color: item.color },
          })) || [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
}

/**
 * 创建柱状图配置
 */
export const createBarChartOption: ChartOptionGenerator = (data) => {
  // 处理ProductRankingData类型的数据
  if (data && data.categories && data.series) {
    return {
      title: {
        text: '数据统计',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.categories,
      },
      yAxis: {
        type: 'value',
      },
      series: data.series.map((serie: any) => ({
        name: serie.name,
        type: 'bar',
        data: serie.data,
        itemStyle: serie.itemStyle,
      })),
    }
  }

  // 处理数组类型的数据（向后兼容）
  return {
    title: {
      text: '数据统计',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data?.map((item: any) => item.category) || [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '数值',
        type: 'bar',
        data:
          data?.map((item: any) => ({
            value: item.value,
            itemStyle: { color: item.color },
          })) || [],
      },
    ],
  }
}

/**
 * 创建面积图配置
 */
export const createAreaChartOption: ChartOptionGenerator = (data) => {
  return {
    title: {
      text: '趋势分析',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data?.categories || [],
    },
    yAxis: {
      type: 'value',
    },
    series:
      data?.series?.map((serie: any) => ({
        name: serie.name,
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        data: serie.data,
        itemStyle: { color: serie.color },
      })) || [],
  }
}

/**
 * 获取图表配置选项
 * @param chartType - 图表类型
 * @param data - 图表数据
 * @returns ECharts配置选项
 */
export const getChartOption = (chartType: string, data: any): Options => {
  const generators: Record<string, (data?: any) => Options> = {
    salesTrend: createSalesTrendOption,
    userGrowth: createUserGrowthOption,
    categoryDistribution: createCategoryDistributionOption,
    regionDistribution: createRegionDistributionOption,
    paymentDistribution: createPaymentDistributionOption,
    barChart: createBarChartOption,
    areaChart: createAreaChartOption,
    heatmap: createHeatmapConfig,
    orderStatus: createOrderStatusConfig,
    productRanking: createProductRankingConfig,
    regionSales: createRegionSalesConfig,
    userActivity: createUserActivityConfig,
  }

  const generator = generators[chartType]
  if (!generator) {
    console.warn(`未找到图表类型 ${chartType} 的配置生成器`)
    return {}
  }

  return generator(data)
}
