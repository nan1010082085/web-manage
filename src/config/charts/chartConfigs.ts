/**
 * 优化后的图表配置文件
 * 统一的图表配置结构，提取公共配置，减少重复代码
 */
import type { Options } from 'highcharts'
import type { ChartBaseConfig } from '@/types/charts'

/**
 * 通用颜色配置
 */
export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  lime: '#84cc16',
  orange: '#f97316',
  pink: '#ec4899',
  indigo: '#6366f1',
  gray: '#6b7280',
} as const

/**
 * 基础图表配置
 */
export const BASE_CHART_CONFIG: Partial<Options> = {
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    spacing: [20, 20, 20, 20],
  },
  title: {
    style: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937',
    },
    align: 'left',
  },
  subtitle: {
    style: {
      fontSize: '14px',
      color: '#6b7280',
    },
    align: 'left',
  },
  legend: {
    itemStyle: {
      fontSize: '12px',
      color: '#374151',
    },
    itemHoverStyle: {
      color: '#111827',
    },
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 8,
    borderWidth: 0,
    shadow: true,
    style: {
      color: '#fff',
      fontSize: '12px',
    },
  },
  credits: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
}

/**
 * 线图基础配置
 */
export const LINE_CHART_BASE: Partial<Options> = {
  ...BASE_CHART_CONFIG,
  chart: {
    ...BASE_CHART_CONFIG.chart,
    type: 'line',
  },
  xAxis: {
    categories: [],
    lineColor: '#e5e7eb',
    tickColor: '#e5e7eb',
    labels: {
      style: {
        color: '#6b7280',
        fontSize: '12px',
      },
    },
  },
  yAxis: {
    gridLineColor: '#f3f4f6',
    labels: {
      style: {
        color: '#6b7280',
        fontSize: '12px',
      },
    },
    title: {
      style: {
        color: '#374151',
        fontSize: '12px',
      },
    },
  },
  plotOptions: {
    line: {
      lineWidth: 2,
      marker: {
        radius: 4,
        lineWidth: 2,
        lineColor: '#fff',
      },
    },
  },
}

/**
 * 柱图基础配置
 */
export const COLUMN_CHART_BASE: Partial<Options> = {
  ...BASE_CHART_CONFIG,
  chart: {
    ...BASE_CHART_CONFIG.chart,
    type: 'column',
  },
  xAxis: {
    categories: [],
    lineColor: '#e5e7eb',
    tickColor: '#e5e7eb',
    labels: {
      style: {
        color: '#6b7280',
        fontSize: '12px',
      },
    },
  },
  yAxis: {
    min: 0,
    gridLineColor: '#f3f4f6',
    labels: {
      style: {
        color: '#6b7280',
        fontSize: '12px',
      },
    },
    title: {
      style: {
        color: '#374151',
        fontSize: '12px',
      },
    },
  },
  plotOptions: {
    column: {
      pointPadding: 0.1,
      borderWidth: 0,
      borderRadius: 4,
    },
  },
}

/**
 * 饼图基础配置
 */
export const PIE_CHART_BASE: Partial<Options> = {
  ...BASE_CHART_CONFIG,
  chart: {
    ...BASE_CHART_CONFIG.chart,
    type: 'pie',
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f}%',
        style: {
          fontSize: '12px',
          color: '#374151',
        },
      },
      showInLegend: true,
      borderWidth: 2,
      borderColor: '#fff',
    },
  },
}

/**
 * 创建图表配置的工厂函数
 */
export const createChartConfig = (
  baseConfig: Partial<Options>,
  customConfig: Partial<Options> & ChartBaseConfig,
): Options => {
  const { title, ...configWithoutTitle } = customConfig
  return {
    ...baseConfig,
    ...configWithoutTitle,
    chart: {
      ...baseConfig.chart,
      ...customConfig.chart,
    },
    title: {
      text: undefined,
    },
    subtitle: {
      ...baseConfig.subtitle,
      text: customConfig.subtitle || baseConfig.subtitle?.text,
    },
  } as Options
}

/**
 * 高级图表配置
 * 为AdvancedCharts组件提供统一的配置
 */
export const advancedChartConfigs = {
  /**
   * 订单状态分布饼图
   */
  orderStatus: createChartConfig(PIE_CHART_BASE, {
    series: [
      {
        name: '订单数量',
        type: 'pie',
        data: [], // 动态数据将在组件中合并
      },
    ],
  }),

  /**
   * 商品销售排行柱图
   */
  productRanking: createChartConfig(COLUMN_CHART_BASE, {
    yAxis: {
      ...COLUMN_CHART_BASE.yAxis,
      title: {
        text: '销售额',
      },
    },
    xAxis: {
      ...COLUMN_CHART_BASE.xAxis,
      categories: [], // 动态数据将在组件中合并
    },
    series: [
      {
        name: '销售额',
        type: 'column',
        data: [], // 动态数据将在组件中合并
        color: CHART_COLORS.primary,
      },
    ],
  }),

  /**
   * 用户活跃度趋势图
   */
  userActivity: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: {
        text: '用户数量',
      },
    },
    xAxis: {
      ...LINE_CHART_BASE.xAxis,
      categories: [], // 动态数据将在组件中合并
    },
    series: [], // 动态数据将在组件中合并
  }),

  /**
   * 地区销售分布环形图
   */
  regionSales: createChartConfig(PIE_CHART_BASE, {
    plotOptions: {
      ...PIE_CHART_BASE.plotOptions,
      pie: {
        ...PIE_CHART_BASE.plotOptions?.pie,
        innerSize: '50%',
      },
    },
    series: [
      {
        name: '销售额',
        type: 'pie',
        data: [], // 动态数据将在组件中合并
      },
    ],
  }),
}

/**
 * 用户相关图表配置
 */
export const userChartConfigs = {
  // 用户增长趋势图表
  growthChart: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '用户数' },
    },
    xAxis: {
      ...LINE_CHART_BASE.xAxis,
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        data: [1250, 1680, 2150, 2890, 3420, 4180],
        color: CHART_COLORS.primary,
      },
    ],
  }),

  // 用户活跃度分布图表
  activityChart: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '活跃用户数' },
    },
    xAxis: {
      ...LINE_CHART_BASE.xAxis,
      categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    series: [
      {
        name: '活跃用户',
        type: 'line',
        data: [8950, 9630, 10280, 11170, 12050, 12930, 11800],
        color: CHART_COLORS.success,
      },
    ],
  }),

  // 用户年龄分布图表
  ageChart: createChartConfig(PIE_CHART_BASE, {
    series: [
      {
        name: '年龄分布',
        type: 'pie',
        data: [
          { name: '18-25岁', y: 35.2, color: CHART_COLORS.primary },
          { name: '26-35岁', y: 28.8, color: CHART_COLORS.success },
          { name: '36-45岁', y: 22.1, color: CHART_COLORS.warning },
          { name: '46-55岁', y: 10.5, color: CHART_COLORS.danger },
          { name: '55岁以上', y: 3.4, color: CHART_COLORS.gray },
        ],
      },
    ],
  }),

  // 用户地域分布图表
  regionChart: createChartConfig(PIE_CHART_BASE, {
    series: [
      {
        name: '地域分布',
        type: 'pie',
        data: [
          { name: '华东', y: 32.5, color: CHART_COLORS.primary },
          { name: '华南', y: 25.8, color: CHART_COLORS.success },
          { name: '华北', y: 18.2, color: CHART_COLORS.warning },
          { name: '西南', y: 12.3, color: CHART_COLORS.danger },
          { name: '其他', y: 11.2, color: CHART_COLORS.gray },
        ],
      },
    ],
  }),

  // 设备类型分布图表
  deviceChart: createChartConfig(PIE_CHART_BASE, {
    series: [
      {
        name: '设备类型',
        type: 'pie',
        data: [
          { name: '移动端', y: 68.5, color: CHART_COLORS.primary },
          { name: 'PC端', y: 24.2, color: CHART_COLORS.success },
          { name: '平板', y: 7.3, color: CHART_COLORS.warning },
        ],
      },
    ],
  }),

  // 保持向后兼容的旧属性名
  userGrowth: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '用户数' },
    },
    xAxis: {
      ...LINE_CHART_BASE.xAxis,
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        data: [1250, 1680, 2150, 2890, 3420, 4180],
        color: CHART_COLORS.primary,
      },
    ],
  }),

  userActivity: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '活跃用户数' },
    },
    xAxis: {
      ...LINE_CHART_BASE.xAxis,
      categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    series: [
      {
        name: '活跃用户',
        type: 'line',
        data: [8950, 9630, 10280, 11170, 12050, 12930, 11800],
        color: CHART_COLORS.success,
      },
    ],
  }),
}

/**
 * 财务相关图表配置
 */
export const financeChartConfigs = {
  /**
   * 财务趋势图表
   */
  trendChart: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '金额 (万元)' },
    },
    xAxis: {
      ...LINE_CHART_BASE.xAxis,
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    series: [
      {
        name: '收入',
        type: 'line',
        data: [120.5, 135.8, 158.2, 172.6, 189.3, 205.7],
        color: CHART_COLORS.primary,
      },
      {
        name: '支出',
        type: 'line',
        data: [85.2, 92.6, 108.4, 125.8, 142.1, 156.3],
        color: CHART_COLORS.danger,
      },
    ],
  }),

  /**
   * 收入构成图表
   */
  revenueChart: createChartConfig(PIE_CHART_BASE, {
    title: '收入构成',
    series: [
      {
        name: '收入占比',
        type: 'pie',
        data: [
          { name: '商品销售', y: 65.2, color: CHART_COLORS.primary },
          { name: '服务收入', y: 18.8, color: CHART_COLORS.success },
          { name: '广告收入', y: 10.6, color: CHART_COLORS.warning },
          { name: '其他收入', y: 5.4, color: CHART_COLORS.purple },
        ],
      },
    ],
  }),

  /**
   * 支出分类图表
   */
  expenseChart: createChartConfig(PIE_CHART_BASE, {
    series: [
      {
        name: '支出占比',
        type: 'pie',
        data: [
          { name: '采购成本', y: 45.2, color: CHART_COLORS.danger },
          { name: '人力成本', y: 25.8, color: CHART_COLORS.warning },
          { name: '运营费用', y: 15.6, color: CHART_COLORS.orange },
          { name: '营销费用', y: 8.4, color: CHART_COLORS.purple },
          { name: '其他费用', y: 5.0, color: CHART_COLORS.gray },
        ],
      },
    ],
  }),

  /**
   * 现金流分析图表
   */
  cashflowChart: createChartConfig(COLUMN_CHART_BASE, {
    yAxis: {
      ...COLUMN_CHART_BASE.yAxis,
      title: { text: '现金流 (万元)' },
    },
    xAxis: {
      ...COLUMN_CHART_BASE.xAxis,
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    },
    series: [
      {
        name: '经营现金流',
        type: 'column',
        data: [45.2, 52.8, 48.6, 61.3],
        color: CHART_COLORS.success,
      },
      {
        name: '投资现金流',
        type: 'column',
        data: [-12.5, -18.2, -15.8, -22.1],
        color: CHART_COLORS.warning,
      },
      {
        name: '筹资现金流',
        type: 'column',
        data: [8.5, -5.2, 12.8, -8.9],
        color: CHART_COLORS.purple,
      },
    ],
  }),

  /**
   * 营收趋势（保持向后兼容）
   */
  revenue: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '营收 (万元)' },
    },
    xAxis: {
      ...LINE_CHART_BASE.xAxis,
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    series: [
      {
        name: '营收',
        type: 'line',
        data: [120.5, 135.8, 158.2, 172.6, 189.3, 205.7],
        color: CHART_COLORS.primary,
      },
    ],
  }),

  /**
   * 利润分析（保持向后兼容）
   */
  profit: createChartConfig(COLUMN_CHART_BASE, {
    yAxis: {
      ...COLUMN_CHART_BASE.yAxis,
      title: { text: '利润 (万元)' },
    },
    xAxis: {
      ...COLUMN_CHART_BASE.xAxis,
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    },
    series: [
      {
        name: '净利润',
        type: 'column',
        data: [45.2, 52.8, 48.6, 61.3],
        color: CHART_COLORS.success,
      },
    ],
  }),
}

/**
 * 销售统计页面图表配置
 */
export const salesChartConfigs = {
  trendChart: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '销售额 (万元)' },
    },
    xAxis: {
      ...LINE_CHART_BASE.xAxis,
      categories: [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月',
      ],
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        color: CHART_COLORS.primary,
      },
      {
        name: '目标',
        type: 'line',
        data: [50, 80, 120, 140, 160, 180, 150, 170, 200, 180, 120, 80],
        color: CHART_COLORS.success,
        dashStyle: 'Dash',
      },
    ],
  }),

  channelChart: createChartConfig(PIE_CHART_BASE, {
    series: [
      {
        name: '销售占比',
        type: 'pie',
        data: [
          { name: '线上商城', y: 45.2, color: CHART_COLORS.primary },
          { name: '实体店', y: 28.8, color: CHART_COLORS.success },
          { name: '第三方平台', y: 15.6, color: CHART_COLORS.warning },
          { name: '其他', y: 10.4, color: CHART_COLORS.danger },
        ],
      },
    ],
  }),

  rankingChart: createChartConfig(COLUMN_CHART_BASE, {
    yAxis: {
      ...COLUMN_CHART_BASE.yAxis,
      title: { text: '销售额 (万元)' },
    },
    xAxis: {
      ...COLUMN_CHART_BASE.xAxis,
      categories: ['iPhone 15', '华为 Mate60', '小米14', 'OPPO Find X7', 'vivo X100'],
    },
    series: [
      {
        name: '销售额',
        type: 'column',
        data: [89.2, 67.8, 45.6, 38.9, 32.1],
        color: CHART_COLORS.purple,
      },
    ],
  }),

  regionChart: createChartConfig(PIE_CHART_BASE, {
    plotOptions: {
      ...PIE_CHART_BASE.plotOptions,
      pie: {
        ...PIE_CHART_BASE.plotOptions?.pie,
        innerSize: '50%',
      },
    },
    series: [
      {
        name: '销售额',
        type: 'pie',
        data: [
          { name: '华东', y: 35.2, color: CHART_COLORS.primary },
          { name: '华南', y: 25.8, color: CHART_COLORS.success },
          { name: '华北', y: 18.6, color: CHART_COLORS.warning },
          { name: '西南', y: 12.4, color: CHART_COLORS.danger },
          { name: '其他', y: 8.0, color: CHART_COLORS.purple },
        ],
      },
    ],
  }),
}

/**
 * 数据分析页面图表配置
 */
export const dataAnalysisChartConfigs = {
  salesTrend: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '销售额 (万元)' },
    },
    xAxis: {
      ...LINE_CHART_BASE.xAxis,
      categories: [], // 动态数据
    },
    series: [], // 动态数据
  }),

  userGrowth: createChartConfig(LINE_CHART_BASE, {
    chart: {
      ...LINE_CHART_BASE.chart,
      type: 'line',
    },
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '用户数' },
    },
    xAxis: {
      ...LINE_CHART_BASE.xAxis,
      categories: [], // 动态数据
    },
    series: [], // 动态数据
  }),

  categoryDistribution: createChartConfig(PIE_CHART_BASE, {
    series: [
      {
        name: '销售占比',
        type: 'pie',
        data: [], // 动态数据
      },
    ],
  }),

  regionDistribution: createChartConfig(PIE_CHART_BASE, {
    plotOptions: {
      ...PIE_CHART_BASE.plotOptions,
      pie: {
        ...PIE_CHART_BASE.plotOptions?.pie,
        innerSize: '50%',
      },
    },
    series: [
      {
        name: '销售额',
        type: 'pie',
        data: [], // 动态数据
      },
    ],
  }),

  paymentDistribution: createChartConfig(PIE_CHART_BASE, {
    series: [
      {
        name: '支付占比',
        type: 'pie',
        data: [], // 动态数据
      },
    ],
  }),

  // DataView.vue 专用图表配置
  barChart: createChartConfig(COLUMN_CHART_BASE, {
    yAxis: {
      ...COLUMN_CHART_BASE.yAxis,
      title: { text: '销售额' },
    },
    xAxis: {
      ...COLUMN_CHART_BASE.xAxis,
      categories: [], // 动态数据
    },
    series: [], // 动态数据
  }),

  areaChart: createChartConfig(LINE_CHART_BASE, {
    chart: {
      ...LINE_CHART_BASE.chart,
      type: 'area',
    },
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '数值' },
    },
    xAxis: {
      ...LINE_CHART_BASE.xAxis,
      categories: [], // 动态数据
    },
    series: [], // 动态数据
  }),

  heatmap: createChartConfig(BASE_CHART_CONFIG, {
    chart: {
      ...BASE_CHART_CONFIG.chart,
      type: 'heatmap',
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      verticalAlign: 'middle',
    },
    colorAxis: {
      min: 0,
      stops: [
        [0.2, 'lightblue'],
        [0.4, '#CBDFC8'],
        [0.6, '#F3E99E'],
        [0.9, '#F9A05C'],
      ],
      labels: {
        format: '{value}',
      },
    },
    xAxis: {
      categories: [], // 动态数据
    },
    yAxis: {
      categories: [], // 动态数据
    },
    series: [], // 动态数据
  }),
}

/**
 * 营销活动页面图表配置
 */
export const campaignChartConfigs = {
  effectChart: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '转化率 (%)' },
    },
    series: [
      {
        name: '转化率',
        type: 'line',
        data: [2.1, 3.5, 4.2, 5.8, 6.1, 7.3, 8.2],
        color: CHART_COLORS.primary,
      },
    ],
  }),

  conversionTrend: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '转化率 (%)' },
    },
    series: [
      {
        name: '转化率',
        type: 'line',
        data: [2.1, 3.5, 4.2, 5.8, 6.1, 7.3, 8.2],
        color: CHART_COLORS.primary,
      },
    ],
  }),

  participantTrend: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '参与人数' },
    },
    series: [
      {
        name: '参与人数',
        type: 'line',
        data: [120, 189, 234, 290, 330, 410, 520],
        color: CHART_COLORS.success,
      },
    ],
  }),

  conversionAnalysis: createChartConfig(PIE_CHART_BASE, {
    series: [
      {
        name: '转化分析',
        type: 'pie',
        data: [
          { name: '已转化', y: 35.2, color: CHART_COLORS.success },
          { name: '未转化', y: 64.8, color: CHART_COLORS.warning },
        ],
      },
    ],
  }),
}

/**
 * 优惠券页面图表配置
 */
export const couponChartConfigs = {
  usageChart: createChartConfig(COLUMN_CHART_BASE, {
    yAxis: {
      ...COLUMN_CHART_BASE.yAxis,
      title: { text: '使用量' },
    },
    series: [
      {
        name: '使用量',
        type: 'column',
        data: [120, 89, 156, 203, 178, 234, 189],
        color: CHART_COLORS.success,
      },
    ],
  }),

  usageTrend: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '使用趋势' },
    },
    series: [
      {
        name: '使用量',
        type: 'line',
        data: [120, 89, 156, 203, 178, 234, 189],
        color: CHART_COLORS.success,
      },
    ],
  }),

  userDistribution: createChartConfig(PIE_CHART_BASE, {
    series: [
      {
        name: '用户分布',
        type: 'pie',
        data: [
          { name: '新用户', y: 45.2, color: CHART_COLORS.primary },
          { name: '老用户', y: 54.8, color: CHART_COLORS.success },
        ],
      },
    ],
  }),
}

/**
 * 日志页面图表配置
 */
export const logChartConfigs = {
  errorChart: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '错误数量' },
    },
    series: [
      {
        name: '错误数',
        type: 'line',
        data: [5, 12, 8, 15, 6, 9, 11],
        color: CHART_COLORS.danger,
      },
    ],
  }),

  levelChart: createChartConfig(PIE_CHART_BASE, {
    series: [
      {
        name: '日志级别',
        type: 'pie',
        data: [
          { name: 'ERROR', y: 15.2, color: CHART_COLORS.danger },
          { name: 'WARN', y: 25.8, color: CHART_COLORS.warning },
          { name: 'INFO', y: 45.6, color: CHART_COLORS.primary },
          { name: 'DEBUG', y: 13.4, color: CHART_COLORS.success },
        ],
      },
    ],
  }),

  trendChart: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '日志趋势' },
    },
    series: [
      {
        name: '日志数量',
        type: 'line',
        data: [120, 89, 156, 203, 178, 234, 189],
        color: CHART_COLORS.primary,
      },
    ],
  }),
}

/**
 * 监控页面图表配置
 */
export const monitorChartConfigs = {
  performanceChart: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: 'CPU使用率 (%)' },
    },
    series: [
      {
        name: 'CPU',
        type: 'line',
        data: [45, 52, 48, 61, 55, 58, 63],
        color: CHART_COLORS.warning,
      },
    ],
  }),

  cpuChart: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: 'CPU使用率 (%)' },
    },
    series: [
      {
        name: 'CPU',
        type: 'line',
        data: [45, 52, 48, 61, 55, 58, 63],
        color: CHART_COLORS.warning,
      },
    ],
  }),

  memoryChart: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '内存使用率 (%)' },
    },
    series: [
      {
        name: '内存',
        type: 'line',
        data: [65, 72, 68, 81, 75, 78, 83],
        color: CHART_COLORS.primary,
      },
    ],
  }),

  networkChart: createChartConfig(LINE_CHART_BASE, {
    yAxis: {
      ...LINE_CHART_BASE.yAxis,
      title: { text: '网络流量 (MB/s)' },
    },
    series: [
      {
        name: '网络',
        type: 'line',
        data: [12, 18, 15, 25, 22, 28, 31],
        color: CHART_COLORS.success,
      },
    ],
  }),
}
