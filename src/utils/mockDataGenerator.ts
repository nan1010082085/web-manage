/**
 * Mock数据生成器接口
 */
export interface MockDataGenerator {
  generateData(config: Record<string, unknown>, params?: Record<string, unknown>): Record<string, unknown>
}

/**
 * 生成随机数据的工具函数
 */
class DataGeneratorUtils {
  /**
   * 生成指定范围内的随机整数
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * 生成指定范围内的随机浮点数
   */
  static randomFloat(min: number, max: number, decimals: number = 2): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
  }

  /**
   * 生成日期序列
   */
  static generateDateSeries(days: number, format: 'YYYY-MM-DD' | 'MM-DD' = 'MM-DD'): string[] {
    const dates: string[] = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      if (format === 'YYYY-MM-DD') {
        dates.push(date.toISOString().split('T')[0])
      } else {
        dates.push(
          `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
        )
      }
    }

    return dates
  }

  /**
   * 生成月份序列
   */
  static generateMonthSeries(months: number): string[] {
    const monthNames = [
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
    ]
    const result: string[] = []
    const today = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      result.push(monthNames[date.getMonth()])
    }

    return result
  }

  /**
   * 生成产品名称列表
   */
  static generateProductNames(count: number): string[] {
    const products = [
      'iPhone 15 Pro',
      'MacBook Air M3',
      'iPad Pro',
      'Apple Watch',
      'AirPods Pro',
      'Samsung Galaxy S24',
      'Dell XPS 13',
      'Surface Pro',
      'Sony WH-1000XM5',
      'Nintendo Switch',
      '小米14 Pro',
      '华为Mate 60',
      'OPPO Find X7',
      'vivo X100',
      '一加12',
      'ThinkPad X1',
      'HP Spectre',
      'Asus ZenBook',
      'Acer Swift',
      'Lenovo Yoga',
    ]

    return products.slice(0, count)
  }

  /**
   * 生成地区名称列表
   */
  static generateRegionNames(): string[] {
    return ['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都', '西安', '重庆']
  }

  /**
   * 生成分类名称列表
   */
  static generateCategoryNames(): string[] {
    return ['电子产品', '服装配饰', '家居用品', '运动户外', '图书音像', '美妆护肤', '食品饮料']
  }
}

/**
 * 基于图表配置生成mock数据
 */
export class ChartMockDataGenerator {
  /**
   * 为数据分析图表生成mock数据
   */
  static generateDataAnalysisData() {
    return {
      // 销售趋势数据
      salesTrend: {
        data: Array.from({ length: 30 }, (_, i) => ({
          date: DataGeneratorUtils.generateDateSeries(30)[i],
          revenue: DataGeneratorUtils.randomInt(5000, 15000),
          orders: DataGeneratorUtils.randomInt(50, 200)
        }))
      },

      // 用户增长数据
      userGrowth: {
        data: Array.from({ length: 30 }, (_, i) => ({
          date: DataGeneratorUtils.generateDateSeries(30)[i],
          users: DataGeneratorUtils.randomInt(800, 1500),
          newUsers: DataGeneratorUtils.randomInt(100, 300),
          activeUsers: DataGeneratorUtils.randomInt(3000, 8000)
        }))
      },

      // 分类分布数据
      categoryDistribution: {
        data: DataGeneratorUtils.generateCategoryNames().map((name) => ({
          name,
          y: DataGeneratorUtils.randomFloat(10, 30),
          value: DataGeneratorUtils.randomInt(500, 2000)
        }))
      },

      // 地区分布数据
      regionDistribution: {
        data: DataGeneratorUtils.generateRegionNames().map((name) => ({
          name,
          y: DataGeneratorUtils.randomFloat(5, 20),
          value: DataGeneratorUtils.randomInt(1000, 5000)
        }))
      },

      // 支付方式分布数据
      paymentDistribution: {
        data: [
          { name: '微信支付', y: 42.5, value: DataGeneratorUtils.randomInt(1000, 2000) },
          { name: '支付宝', y: 35.8, value: DataGeneratorUtils.randomInt(800, 1500) },
          { name: '银行卡', y: 15.2, value: DataGeneratorUtils.randomInt(300, 600) },
          { name: '其他', y: 6.5, value: DataGeneratorUtils.randomInt(100, 300) }
        ]
      },

      // 柱状图数据
      barChart: {
        data: {
          bar: {
            categories: DataGeneratorUtils.generateProductNames(6),
            series: [{
              name: '销售额',
              data: Array.from({ length: 6 }, () => DataGeneratorUtils.randomInt(10000, 50000))
            }]
          }
        }
      },

      // 热力图数据
      heatmap: {
        data: {
          xCategories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          yCategories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
          series: [{
            name: '访问量',
            data: Array.from({ length: 42 }, (_, i) => [
              i % 7,
              Math.floor(i / 7),
              DataGeneratorUtils.randomInt(10, 100)
            ])
          }]
        }
      }
    }
  }

  /**
   * 为用户图表生成mock数据
   */
  static generateUserChartsData() {
    return {
      // 用户增长图表
      growthChart: {
        categories: DataGeneratorUtils.generateMonthSeries(6),
        series: [
          {
            name: '新增用户',
            data: Array.from({ length: 6 }, () => DataGeneratorUtils.randomInt(500, 1200)),
          },
        ],
      },

      // 用户活跃度图表
      activityChart: {
        categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        series: [
          {
            name: '活跃用户',
            data: Array.from({ length: 7 }, () => DataGeneratorUtils.randomInt(1000, 2000)),
          },
        ],
      },
    }
  }

  /**
   * 为财务图表生成mock数据
   */
  static generateFinanceChartsData() {
    return {
      // 财务趋势图表
      trendChart: {
        categories: DataGeneratorUtils.generateMonthSeries(12),
        series: [
          {
            name: '收入',
            data: Array.from({ length: 12 }, () => DataGeneratorUtils.randomInt(50000, 120000)),
          },
          {
            name: '支出',
            data: Array.from({ length: 12 }, () => DataGeneratorUtils.randomInt(30000, 80000)),
          },
        ],
      },

      // 收入图表
      revenueChart: {
        categories: DataGeneratorUtils.generateDateSeries(30),
        series: [
          {
            name: '日收入',
            data: Array.from({ length: 30 }, () => DataGeneratorUtils.randomInt(3000, 8000)),
          },
        ],
      },

      // 利润图表
      profitChart: {
        categories: DataGeneratorUtils.generateMonthSeries(6),
        series: [
          {
            name: '毛利润',
            data: Array.from({ length: 6 }, () => DataGeneratorUtils.randomInt(20000, 50000)),
          },
          {
            name: '净利润',
            data: Array.from({ length: 6 }, () => DataGeneratorUtils.randomInt(15000, 40000)),
          },
        ],
      },
    }
  }

  /**
   * 为销售图表生成mock数据
   */
  static generateSalesChartsData() {
    return {
      // 销售趋势图表
      trendChart: {
        categories: DataGeneratorUtils.generateDateSeries(30),
        series: [
          {
            name: '销售额',
            data: Array.from({ length: 30 }, () => DataGeneratorUtils.randomInt(8000, 20000)),
          },
        ],
      },

      // 渠道图表
      channelChart: [
        { name: '线上销售', value: DataGeneratorUtils.randomInt(3000, 6000), percentage: 65.2 },
        { name: '线下门店', value: DataGeneratorUtils.randomInt(1500, 3000), percentage: 25.8 },
        { name: '代理商', value: DataGeneratorUtils.randomInt(500, 1500), percentage: 9.0 },
      ],

      // 排行图表
      rankingChart: {
        categories: DataGeneratorUtils.generateProductNames(10),
        series: [
          {
            name: '销售额',
            data: Array.from({ length: 10 }, () => DataGeneratorUtils.randomInt(1000, 5000)),
          },
        ],
      },

      // 地区图表
      regionChart: DataGeneratorUtils.generateRegionNames().map((name) => ({
        name,
        value: DataGeneratorUtils.randomInt(2000, 8000),
        percentage: DataGeneratorUtils.randomFloat(8, 18),
      })),
    }
  }

  /**
   * 为高级图表生成mock数据 - 符合Highcharts标准格式
   */
  static generateAdvancedChartsData() {
    return {
      // 订单状态数据 - Highcharts饼图格式
      orderStatus: [
        {
          name: '待处理',
          y: DataGeneratorUtils.randomInt(100, 200),
          color: '#f59e0b',
          sliced: false,
          selected: false,
        },
        {
          name: '处理中',
          y: DataGeneratorUtils.randomInt(200, 300),
          color: '#3b82f6',
          sliced: false,
          selected: false,
        },
        {
          name: '已发货',
          y: DataGeneratorUtils.randomInt(150, 250),
          color: '#10b981',
          sliced: false,
          selected: false,
        },
        {
          name: '已送达',
          y: DataGeneratorUtils.randomInt(20, 50),
          color: '#6b7280',
          sliced: false,
          selected: false,
        },
      ],

      // 商品排行数据 - Highcharts柱图格式
      productRanking: {
        categories: DataGeneratorUtils.generateProductNames(8),
        series: [
          {
            name: '销售额',
            type: 'column',
            data: Array.from({ length: 8 }, () => DataGeneratorUtils.randomInt(500, 2000)),
            color: '#1890ff',
          },
        ],
      },

      // 用户活跃度数据 - Highcharts折线图格式
      userActivity: {
        categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        series: [
          {
            name: '活跃用户',
            type: 'line',
            data: Array.from({ length: 7 }, () => DataGeneratorUtils.randomInt(1200, 1900)),
            color: '#52c41a',
            lineWidth: 2,
            marker: {
              enabled: true,
              radius: 4,
            },
          },
          {
            name: '新增用户',
            type: 'line',
            data: Array.from({ length: 7 }, () => DataGeneratorUtils.randomInt(100, 250)),
            color: '#1890ff',
            lineWidth: 2,
            marker: {
              enabled: true,
              radius: 4,
            },
          },
        ],
      },

      // 地区销售数据 - Highcharts环形图格式
      regionSales: DataGeneratorUtils.generateRegionNames()
        .slice(0, 8)
        .map((name) => ({
          name,
          y: DataGeneratorUtils.randomInt(1000, 5000),
          color: ChartMockDataGenerator.getRegionColor(name),
        })),
    }
  }

  /**
   * 获取地区对应的颜色
   */
  private static getRegionColor(regionName: string): string {
    const colors = [
      '#1890ff',
      '#52c41a',
      '#faad14',
      '#f5222d',
      '#722ed1',
      '#13c2c2',
      '#eb2f96',
      '#fa8c16',
    ]
    const index = regionName.charCodeAt(0) % colors.length
    return colors[index]
  }

  /**
   * 为仪表板生成mock数据
   */
  static generateDashboardData() {
    return {
      // 统计数据
      stats: {
        totalUsers: DataGeneratorUtils.randomInt(1000, 2000),
        totalProducts: DataGeneratorUtils.randomInt(400, 800),
        totalOrders: DataGeneratorUtils.randomInt(800, 1500),
        totalRevenue: DataGeneratorUtils.randomInt(100000, 200000),
      },

      // 销售趋势数据 - 符合Highcharts标准格式
      salesTrend: {
        categories: DataGeneratorUtils.generateDateSeries(7),
        series: [
          {
            name: '销售额',
            type: 'line',
            data: Array.from({ length: 7 }, () => DataGeneratorUtils.randomInt(8000, 25000)),
            color: '#1890ff',
            smooth: true,
          },
          {
            name: '订单数',
            type: 'line',
            data: Array.from({ length: 7 }, () => DataGeneratorUtils.randomInt(150, 500)),
            color: '#52c41a',
            smooth: true,
          },
        ],
      },

      // 订单状态数据 - 符合Highcharts饼图标准格式
      orderStatus: [
        {
          name: '待处理',
          y: DataGeneratorUtils.randomInt(80, 150),
          color: '#f59e0b',
          percentage: 0, // 将在运行时计算
        },
        {
          name: '处理中',
          y: DataGeneratorUtils.randomInt(150, 280),
          color: '#3b82f6',
          percentage: 0,
        },
        {
          name: '已发货',
          y: DataGeneratorUtils.randomInt(120, 220),
          color: '#10b981',
          percentage: 0,
        },
        {
          name: '已送达',
          y: DataGeneratorUtils.randomInt(30, 80),
          color: '#6b7280',
          percentage: 0,
        },
      ],
    }
  }

  /**
   * 为首页销售趋势图表生成专门的数据
   * 支持不同时间周期的数据生成
   */
  static generateDashboardSalesTrendData(period: string = '7d') {
    let days = 7
    let dataRange = { min: 8000, max: 25000 }
    let orderRange = { min: 150, max: 500 }

    switch (period) {
      case '30d':
        days = 30
        dataRange = { min: 5000, max: 20000 }
        orderRange = { min: 100, max: 400 }
        break
      case '90d':
        days = 90
        dataRange = { min: 3000, max: 15000 }
        orderRange = { min: 80, max: 300 }
        break
      default:
        days = 7
    }

    return {
      categories: DataGeneratorUtils.generateDateSeries(days),
      series: [
        {
          name: '销售额',
          type: 'line',
          data: Array.from({ length: days }, () =>
            DataGeneratorUtils.randomInt(dataRange.min, dataRange.max),
          ),
          color: '#1890ff',
          smooth: true,
          lineWidth: 2,
          marker: {
            enabled: true,
            radius: 4,
          },
        },
        {
          name: '订单数',
          type: 'line',
          data: Array.from({ length: days }, () =>
            DataGeneratorUtils.randomInt(orderRange.min, orderRange.max),
          ),
          color: '#52c41a',
          smooth: true,
          lineWidth: 2,
          marker: {
            enabled: true,
            radius: 4,
          },
        },
      ],
    }
  }

  /**
   * 为首页订单状态图表生成专门的数据
   * 自动计算百分比，符合Highcharts饼图标准
   */
  static generateDashboardOrderStatusData() {
    const rawData = [
      {
        name: '待处理',
        y: DataGeneratorUtils.randomInt(80, 150),
        color: '#f59e0b',
      },
      {
        name: '处理中',
        y: DataGeneratorUtils.randomInt(150, 280),
        color: '#3b82f6',
      },
      {
        name: '已发货',
        y: DataGeneratorUtils.randomInt(120, 220),
        color: '#10b981',
      },
      {
        name: '已送达',
        y: DataGeneratorUtils.randomInt(30, 80),
        color: '#6b7280',
      },
    ]

    // 计算总数和百分比
    const total = rawData.reduce((sum, item) => sum + item.y, 0)

    return rawData.map((item) => ({
      ...item,
      percentage: parseFloat(((item.y / total) * 100).toFixed(1)),
      // 添加Highcharts饼图所需的额外属性
      sliced: false,
      selected: false,
    }))
  }
}

/**
 * 导出便捷的数据生成函数
 */
export const generateMockData = {
  dataAnalysis: () => ChartMockDataGenerator.generateDataAnalysisData(),
  userCharts: () => ChartMockDataGenerator.generateUserChartsData(),
  financeCharts: () => ChartMockDataGenerator.generateFinanceChartsData(),
  salesCharts: () => ChartMockDataGenerator.generateSalesChartsData(),
  advancedCharts: () => ChartMockDataGenerator.generateAdvancedChartsData(),
  generateAdvancedChartsData: () => ChartMockDataGenerator.generateAdvancedChartsData(),
  dashboard: () => ChartMockDataGenerator.generateDashboardData(),
  generateDashboardData: () => ChartMockDataGenerator.generateDashboardData(),
  generateDashboardSalesTrendData: (period: string = '7d') =>
    ChartMockDataGenerator.generateDashboardSalesTrendData(period),
  generateDashboardOrderStatusData: () => ChartMockDataGenerator.generateDashboardOrderStatusData(),
}

export default ChartMockDataGenerator
