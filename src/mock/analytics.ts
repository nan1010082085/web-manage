/**
 * 数据分析页面模拟数据
 */
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'

// 启用 dayjs 插件
dayjs.extend(quarterOfYear)
import type {
  DataOverview,
  RealtimeData,
  OrderDataItem,
  UserDataItem,
  ProductDataItem,
  SalesTrendItem,
  UserGrowthItem,
  CategoryDistributionItem,
  RegionDistributionItem,
  PaymentDistributionItem,
  BarChartItem,
  AreaChartItem,
  HeatmapDataItem,
  OverviewResponse,
  TableDataResponse,
  ChartDataResponse,
  PaginationParams,
} from '@/views/analytics/types'

/**
 * 生成数据概览
 * 对应界面中的核心指标概览卡片：总销售额、订单数量、新增用户、转化率
 */
export const generateOverviewData = (): DataOverview => {
  return {
    // 总销售额（元）- 对应"总销售额"卡片
    totalRevenue: faker.number.int({ min: 1000000, max: 5000000 }),
    // 销售额趋势（%）- 对应"较上期"变化百分比
    revenueTrend: faker.number.float({ min: -20, max: 30, fractionDigits: 1 }),
    // 订单总数 - 对应"订单数量"卡片
    totalOrders: faker.number.int({ min: 5000, max: 20000 }),
    // 订单趋势（%）- 对应"较上期"变化百分比
    ordersTrend: faker.number.float({ min: -15, max: 25, fractionDigits: 1 }),
    // 新增用户数 - 对应"新增用户"卡片
    newUsers: faker.number.int({ min: 500, max: 2000 }),
    // 用户增长趋势（%）- 对应"较上期"变化百分比
    usersTrend: faker.number.float({ min: -10, max: 40, fractionDigits: 1 }),
    // 转化率（%）- 对应"转化率"卡片，显示时会加%后缀
    conversionRate: faker.number.float({ min: 2, max: 8, fractionDigits: 2 }),
    // 转化率趋势（%）- 对应"较上期"变化百分比
    conversionTrend: faker.number.float({ min: -5, max: 15, fractionDigits: 1 }),
  }
}

/**
 * 生成实时数据
 * 对应界面中的实时数据监控部分
 */
export const generateRealtimeData = (): RealtimeData => {
  return {
    // 当前在线用户数
    onlineUsers: faker.number.int({ min: 100, max: 1000 }),
    // 在线用户变化数（相比上一时段）
    onlineUsersChange: faker.number.int({ min: 5, max: 50 }),
    // 今日订单数
    todayOrders: faker.number.int({ min: 50, max: 300 }),
    // 今日订单变化数（相比昨日同期）
    todayOrdersChange: faker.number.int({ min: 2, max: 20 }),
    // 今日销售额（元）
    todayRevenue: faker.number.int({ min: 10000, max: 100000 }),
    // 今日销售额变化率（%）
    todayRevenueChange: faker.number.float({ min: 1, max: 15, fractionDigits: 1 }),
    // 页面浏览量
    pageViews: faker.number.int({ min: 1000, max: 10000 }),
    // 页面浏览量变化率（%）
    pageViewsChange: faker.number.float({ min: 2, max: 20, fractionDigits: 1 }),
  }
}

/**
 * 生成图表数据
 * 对应界面中的各种图表：销售趋势、用户增长、分类分布、地区分布、支付方式分布等
 */
export const generateChartData = () => {
  return {
    // 销售趋势数据 - 对应"销售趋势"图表
    salesTrend: Array.from({ length: 30 }, (_, i) => ({
      date: dayjs()
        .subtract(29 - i, 'day')
        .format('YYYY-MM-DD'),
      revenue: faker.number.int({ min: 5000, max: 15000 }),
      orders: faker.number.int({ min: 50, max: 200 }),
    })),
    // 用户增长数据 - 对应"用户增长"图表
    userGrowth: Array.from({ length: 30 }, (_, i) => ({
      date: dayjs()
        .subtract(29 - i, 'day')
        .format('YYYY-MM-DD'),
      newUsers: faker.number.int({ min: 100, max: 300 }),
      activeUsers: faker.number.int({ min: 3000, max: 8000 }),
    })),
    // 分类分布数据 - 对应分类分布饼图
    categoryDistribution: [
      { name: '电子产品', value: faker.number.int({ min: 1000, max: 3000 }), percentage: 35.2 },
      { name: '服装鞋帽', value: faker.number.int({ min: 800, max: 2500 }), percentage: 28.7 },
      { name: '家居用品', value: faker.number.int({ min: 600, max: 2000 }), percentage: 18.9 },
      { name: '图书音像', value: faker.number.int({ min: 400, max: 1500 }), percentage: 10.3 },
      { name: '其他', value: faker.number.int({ min: 200, max: 800 }), percentage: 6.9 },
    ],
    // 地区分布数据 - 对应地区分布图表
    regionDistribution: [
      { name: '华东', value: faker.number.int({ min: 2000, max: 5000 }), percentage: 32.1 },
      { name: '华南', value: faker.number.int({ min: 1500, max: 4000 }), percentage: 25.8 },
      { name: '华北', value: faker.number.int({ min: 1200, max: 3500 }), percentage: 22.3 },
      { name: '华中', value: faker.number.int({ min: 800, max: 2500 }), percentage: 12.7 },
      { name: '其他', value: faker.number.int({ min: 500, max: 1500 }), percentage: 7.1 },
    ],
    // 支付方式分布数据 - 对应支付方式分布图表
    paymentDistribution: [
      { name: '支付宝', value: faker.number.int({ min: 3000, max: 6000 }), percentage: 45.2 },
      { name: '微信支付', value: faker.number.int({ min: 2500, max: 5500 }), percentage: 38.7 },
      { name: '银行卡', value: faker.number.int({ min: 800, max: 2000 }), percentage: 12.3 },
      { name: '其他', value: faker.number.int({ min: 200, max: 800 }), percentage: 3.8 },
    ],
    // 柱状图数据 - 对应"月度销售对比"柱状图
    barChart: Array.from({ length: 12 }, (_, i) => ({
      period: `${i + 1}月`,
      currentYear: faker.number.int({ min: 80000, max: 150000 }),
      lastYear: faker.number.int({ min: 70000, max: 140000 }),
    })),
    // 面积图数据 - 对应"销售趋势"面积图
    areaChart: Array.from({ length: 30 }, (_, i) => ({
      date: dayjs()
        .subtract(29 - i, 'day')
        .format('YYYY-MM-DD'),
      revenue: faker.number.int({ min: 8000, max: 18000 }),
      profit: faker.number.int({ min: 1000, max: 3000 }),
    })),
    // 热力图数据 - 对应"用户活跃度热力图"
    heatmap: Array.from({ length: 7 * 24 }, (_, i) => {
      const day = Math.floor(i / 24)
      const hour = i % 24
      return {
        x: hour,
        y: day,
        value: faker.number.int({ min: 0, max: 100 }),
        day: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day],
        hour,
      }
    }),
  }
}

// 生成销售趋势数据
export const generateSalesTrendData = (days: number = 30): SalesTrendItem[] => {
  const data: SalesTrendItem[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    data.push({
      date,
      revenue: faker.number.int({ min: 10000, max: 100000 }),
      orders: faker.number.int({ min: 50, max: 500 }),
    })
  }
  return data
}

// 生成用户增长数据
export const generateUserGrowthData = (days: number = 30): UserGrowthItem[] => {
  const data: UserGrowthItem[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    data.push({
      date,
      newUsers: faker.number.int({ min: 10, max: 100 }),
      activeUsers: faker.number.int({ min: 100, max: 1000 }),
    })
  }
  return data
}

// 生成分类分布数据
export const generateCategoryDistributionData = (): CategoryDistributionItem[] => {
  const categories = [
    '手机数码',
    '服装鞋帽',
    '家居用品',
    '美妆护肤',
    '食品饮料',
    '运动户外',
    '图书文具',
  ]
  const data = categories.map((name) => ({
    name,
    value: faker.number.int({ min: 1000, max: 10000 }),
    percentage: 0,
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  // 防止除零错误和NaN值
  if (total > 0) {
    data.forEach((item) => {
      const percentage = (item.value / total) * 100
      item.percentage = Number(isFinite(percentage) ? percentage.toFixed(1) : '0')
    })
  } else {
    data.forEach((item) => {
      item.percentage = 0
    })
  }

  return data.sort((a, b) => b.value - a.value)
}

// 生成地区分布数据
export const generateRegionDistributionData = (): RegionDistributionItem[] => {
  const regions = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆']
  const data = regions.map((name) => ({
    name,
    value: faker.number.int({ min: 500, max: 5000 }),
    percentage: 0,
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  // 防止除零错误和NaN值
  if (total > 0) {
    data.forEach((item) => {
      const percentage = (item.value / total) * 100
      item.percentage = Number(isFinite(percentage) ? percentage.toFixed(1) : '0')
    })
  } else {
    data.forEach((item) => {
      item.percentage = 0
    })
  }

  return data.sort((a, b) => b.value - a.value)
}

// 生成支付方式分布数据
export const generatePaymentDistributionData = (): PaymentDistributionItem[] => {
  const payments = ['微信支付', '支付宝', '银行卡', '花呗', '京东白条', '现金']
  const data = payments.map((name) => ({
    name,
    value: faker.number.int({ min: 100, max: 3000 }),
    percentage: 0,
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  // 防止除零错误和NaN值
  if (total > 0) {
    data.forEach((item) => {
      const percentage = (item.value / total) * 100
      item.percentage = Number(isFinite(percentage) ? percentage.toFixed(1) : '0')
    })
  } else {
    data.forEach((item) => {
      item.percentage = 0
    })
  }

  return data.sort((a, b) => b.value - a.value)
}

// 生成柱状图数据
export const generateBarChartData = (period: 'month' | 'quarter' = 'month'): BarChartItem[] => {
  const data: BarChartItem[] = []
  const count = period === 'month' ? 12 : 4
  const unit = period === 'month' ? 'month' : 'quarter'

  for (let i = count - 1; i >= 0; i--) {
    const periodLabel =
      period === 'month'
        ? dayjs().subtract(i, 'month').format('MM月')
        : `Q${dayjs()
            .subtract(i * 3, 'month')
            .quarter()}`

    data.push({
      period: periodLabel,
      currentYear: faker.number.int({ min: 50000, max: 200000 }),
      lastYear: faker.number.int({ min: 40000, max: 180000 }),
    })
  }

  return data
}

// 生成面积图数据
export const generateAreaChartData = (days: number = 30): AreaChartItem[] => {
  const data: AreaChartItem[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    const revenue = faker.number.int({ min: 10000, max: 100000 })
    data.push({
      date,
      revenue,
      profit: Math.floor(revenue * faker.number.float({ min: 0.1, max: 0.3 })),
    })
  }
  return data
}

// 生成热力图数据
export const generateHeatmapData = (): HeatmapDataItem[] => {
  const data: HeatmapDataItem[] = []
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        x: hour,
        y: day,
        value: faker.number.int({ min: 0, max: 100 }),
        day: days[day],
        hour,
      })
    }
  }

  return data
}

/**
 * 生成表格数据
 * 对应界面中的数据表格：商品数据、用户数据、订单数据
 */
export const generateTableData = (type: 'products' | 'users' | 'orders', count: number = 50) => {
  switch (type) {
    case 'products':
      // 商品数据 - 对应"商品数据"表格
      return Array.from({ length: count }, (_, i) => ({
        id: `product_${i + 1}`,
        name: faker.commerce.productName(),
        sales: faker.number.int({ min: 10, max: 500 }),
        revenue: faker.number.int({ min: 1000, max: 50000 }),
        trend: faker.number.float({ min: -30, max: 50, fractionDigits: 1 }),
        status: faker.helpers.arrayElement(['hot', 'normal', 'cold']),
      }))
    case 'users':
      // 用户数据 - 对应"用户数据"表格
      return Array.from({ length: count }, (_, i) => ({
        id: `user_${i + 1}`,
        name: faker.person.fullName(),
        registerTime: faker.date.recent({ days: 365 }).toISOString(),
        orderCount: faker.number.int({ min: 0, max: 50 }),
        totalSpent: faker.number.int({ min: 0, max: 10000 }),
        trend: faker.number.float({ min: -20, max: 40, fractionDigits: 1 }),
        status: faker.helpers.arrayElement(['active', 'inactive', 'vip']),
      }))
    case 'orders':
      // 订单数据 - 对应"订单数据"表格
      return Array.from({ length: count }, (_, i) => ({
        id: `order_${i + 1}`,
        orderNo: `ORD${dayjs().format('YYYYMMDD')}${String(i + 1).padStart(4, '0')}`,
        userName: faker.person.fullName(),
        amount: faker.number.int({ min: 50, max: 2000 }),
        createTime: faker.date.recent({ days: 30 }).toISOString(),
        paymentMethod: faker.helpers.arrayElement(['alipay', 'wechat', 'bank', 'cash']),
        status: faker.helpers.arrayElement([
          'pending',
          'paid',
          'shipped',
          'completed',
          'cancelled',
        ]),
      }))
    default:
      return []
  }
}

// 生成商品数据
export const generateProductData = (count: number = 50): ProductDataItem[] => {
  const products = [
    'iPhone 15 Pro',
    'MacBook Air',
    'iPad Pro',
    'AirPods Pro',
    'Apple Watch',
    '华为P60',
    '小米13',
    'OPPO Find X6',
    'vivo X90',
    '一加11',
    '戴尔XPS13',
    '联想ThinkPad',
    '华硕ROG',
    'Surface Pro',
    'HP Spectre',
    '耐克运动鞋',
    '阿迪达斯T恤',
    '优衣库衬衫',
    'Zara外套',
    'H&M连衣裙',
  ]

  const statuses = ['热销', '正常', '滞销', '缺货']

  return Array.from({ length: count }, (_, index) => ({
    id: `product_${index + 1}`,
    name: faker.helpers.arrayElement(products),
    sales: faker.number.int({ min: 10, max: 1000 }),
    revenue: faker.number.int({ min: 1000, max: 100000 }),
    trend: faker.number.float({ min: -30, max: 50, fractionDigits: 1 }),
    status: faker.helpers.arrayElement(statuses),
  }))
}

// 生成用户数据
export const generateUserData = (count: number = 50): UserDataItem[] => {
  const statuses = ['活跃', '普通', '沉睡', '流失']

  return Array.from({ length: count }, (_, index) => ({
    id: `user_${index + 1}`,
    name: faker.person.fullName(),
    registerTime: faker.date.past({ years: 2 }).toISOString().split('T')[0],
    orderCount: faker.number.int({ min: 0, max: 50 }),
    totalSpent: faker.number.int({ min: 0, max: 50000 }),
    trend: faker.number.float({ min: -20, max: 30, fractionDigits: 1 }),
    status: faker.helpers.arrayElement(statuses),
  }))
}

// 生成订单数据
export const generateOrderData = (count: number = 50): OrderDataItem[] => {
  const paymentMethods = ['微信支付', '支付宝', '银行卡', '花呗', '京东白条']
  const statuses = ['已完成', '进行中', '已取消', '已退款']

  return Array.from({ length: count }, (_, index) => ({
    id: `order_${index + 1}`,
    orderNo: `ORD${faker.string.numeric(8)}`,
    userName: faker.person.fullName(),
    amount: faker.number.int({ min: 50, max: 5000 }),
    createTime: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
    paymentMethod: faker.helpers.arrayElement(paymentMethods),
    status: faker.helpers.arrayElement(statuses),
  }))
}

/**
 * Mock概览数据API
 * 返回数据概览和实时数据
 */
export const mockGetOverviewData = (): Promise<OverviewResponse> => {
  return new Promise((resolve) => {
    return resolve({
      overview: generateOverviewData(),
      realtime: generateRealtimeData(),
    })
  })
}

export const mockGetChartData = (): Promise<ChartDataResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        salesTrend: generateSalesTrendData(),
        userGrowth: generateUserGrowthData(),
        categoryDistribution: generateCategoryDistributionData(),
        regionDistribution: generateRegionDistributionData(),
        paymentDistribution: generatePaymentDistributionData(),
        barChart: generateBarChartData(),
        areaChart: generateAreaChartData(),
        heatmap: generateHeatmapData(),
      })
    }, 500)
  })
}

export const mockGetTableData = <T>(
  type: 'products' | 'users' | 'orders',
  pagination: PaginationParams,
): Promise<TableDataResponse<T>> => {
  const { current: page, pageSize } = pagination
  return new Promise((resolve) => {
    setTimeout(() => {
      let allData: any[]

      switch (type) {
        case 'products':
          allData = generateProductData(100)
          break
        case 'users':
          allData = generateUserData(100)
          break
        case 'orders':
          allData = generateOrderData(100)
          break
        default:
          allData = []
      }

      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = allData.slice(start, end)

      resolve({
        list: list as T[],
        total: allData.length,
        current: page,
        pageSize,
      })
    }, 300)
  })
}
