import { faker } from '@faker-js/faker'
import type { ApiResponse } from '@/api'

/**
 * 营销活动概览数据接口
 */
export interface CampaignOverview {
  /** 总活动数 */
  totalCampaigns: number
  /** 进行中活动数 */
  activeCampaigns: number
  /** 总参与人数 */
  totalParticipants: number
  /** 转化率 */
  conversionRate: number
}

/**
 * 营销活动数据接口
 */
export interface Campaign {
  /** 活动ID */
  id: string
  /** 活动名称 */
  name: string
  /** 活动类型 */
  type: (typeof campaignTypes)[number]
  /** 活动状态 */
  status: (typeof campaignStatuses)[number] | (typeof couponStatuses)[number]
  /** 活动描述 */
  description?: string
  /** 活动封面 */
  cover?: string
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 参与人数 */
  participants: number
  /** 转化人数 */
  conversions: number
  /** 转化率 */
  conversionRate: number
  /** 预算 */
  budget?: number
  /** 已花费 */
  spent?: number
  /** 目标商品ID列表 */
  targetProducts?: string[]
  /** 目标用户群体 */
  targetAudience?: string
  /** 活动规则 */
  rules?: Record<string, any>
  /** 是否启用 */
  enabled: boolean
  /** 创建者 */
  creator: string
  /** 目标参与人数 */
  targetParticipants: number
  /** 已使用预算 */
  usedBudget: number
  /** 总预算 */
  totalBudget: number
}

/**
 * 优惠券数据接口
 */
export interface Coupon {
  /** 优惠券ID */
  id: string
  /** 优惠券名称 */
  name: string
  /** 优惠券类型 */
  type: (typeof campaignTypes)[number] | (typeof couponTypes)[number]
  /** 优惠券状态 */
  status: (typeof campaignStatuses)[number] | (typeof couponStatuses)[number]
  /** 优惠金额/折扣 */
  value: number
  /** 最低消费金额 */
  minAmount?: number
  /** 最大优惠金额 */
  maxDiscount?: number
  /** 使用条件 */
  conditions?: string
  /** 有效期开始 */
  validFrom: string
  /** 有效期结束 */
  validTo: string
  /** 发放数量 */
  totalCount: number
  /** 已使用数量 */
  usedCount: number
  /** 剩余数量 */
  remainingCount: number
  /** 每人限领数量 */
  limitPerUser: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 创建者 */
  creator: string
}

/**
 * 营销数据统计接口
 */
export interface MarketingStats {
  /** 日期 */
  date: string
  /** 活动数量 */
  campaignCount: number
  /** 参与人数 */
  participants: number
  /** 转化人数 */
  conversions: number
  /** 转化率 */
  conversionRate: number
  /** 收入 */
  revenue: number
  /** 成本 */
  cost: number
  /** ROI */
  roi: number
}

/**
 * 营销活动搜索参数接口
 */
export interface CampaignSearchParams {
  /** 活动名称 */
  name?: string
  /** 活动类型 */
  type?: string
  /** 活动状态 */
  status?: string
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 创建者 */
  creator?: string
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 创建营销活动参数接口
 */
export interface CreateCampaignParams {
  /** 活动名称 */
  name: string
  /** 活动类型 */
  type: (typeof campaignTypes)[number]
  /** 活动描述 */
  description?: string
  /** 活动封面 */
  cover?: string
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 预算 */
  budget?: number
  /** 目标商品ID列表 */
  targetProducts?: string[]
  /** 目标用户群体 */
  targetAudience?: string
  /** 活动规则 */
  rules?: Record<string, any>
  /** 目标参与人数 */
  targetParticipants?: number
  /** 总预算 */
  totalBudget?: number
}

/**
 * 更新营销活动参数接口
 */
export interface UpdateCampaignParams extends Partial<CreateCampaignParams> {
  /** 活动ID */
  id: string
}

/**
 * 创建优惠券参数接口
 */
export interface CreateCouponParams {
  /** 优惠券名称 */
  name: string
  /** 优惠券类型 */
  type: (typeof campaignTypes)[number]
  /** 优惠金额/折扣 */
  value: number
  /** 最低消费金额 */
  minAmount?: number
  /** 最大优惠金额 */
  maxDiscount?: number
  /** 使用条件 */
  conditions?: string
  /** 有效期开始 */
  validFrom: string
  /** 有效期结束 */
  validTo: string
  /** 发放数量 */
  totalCount: number
  /** 每人限领数量 */
  limitPerUser: number
}

/**
 * 更新优惠券参数接口
 */
export interface UpdateCouponParams extends Partial<CreateCouponParams> {
  /** 优惠券ID */
  id: string
}

// 模拟数据生成
const campaignTypes = [
  'discount',
  'coupon',
  'flash_sale',
  'group_buy',
  'lottery',
  'points',
] as const
const campaignStatuses = ['draft', 'active', 'paused', 'ended', 'expired'] as const
const couponTypes = ['fixed', 'percentage', 'shipping'] as const
const couponStatuses = ['active', 'inactive', 'expired'] as const
const creators = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']

/**
 * 生成随机营销活动数据
 */
const generateCampaign = (): Campaign => {
  const type = faker.helpers.arrayElement(campaignTypes)
  const status = faker.helpers.arrayElement(campaignStatuses)
  const createTime = faker.date.past({ years: 1 }).toISOString()
  const startTime = faker.date.between({ from: createTime, to: new Date() }).toISOString()
  const endTime = faker.date.future({ years: 1, refDate: startTime }).toISOString()
  const participants = faker.number.int({ min: 0, max: 10000 })
  const conversions = faker.number.int({ min: 0, max: participants })
  const budget = faker.number.int({ min: 1000, max: 100000 })

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName() + '活动',
    type,
    status,
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    cover: faker.helpers.maybe(() => faker.image.url({ width: 800, height: 400 }), {
      probability: 0.7,
    }),
    startTime,
    endTime,
    createTime,
    updateTime: faker.date.between({ from: createTime, to: new Date() }).toISOString(),
    participants,
    conversions,
    conversionRate: participants > 0 ? Number(((conversions / participants) * 100).toFixed(2)) : 0,
    budget,
    spent: faker.number.int({ min: 0, max: budget }),
    targetProducts: faker.helpers.maybe(
      () => Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.string.uuid()),
      { probability: 0.6 },
    ),
    targetAudience: faker.helpers.arrayElement([
      '全部用户',
      '新用户',
      'VIP用户',
      '活跃用户',
      '沉睡用户',
    ]),
    rules: {
      minPurchase: faker.number.int({ min: 0, max: 500 }),
      maxDiscount: faker.number.int({ min: 10, max: 1000 }),
      usageLimit: faker.number.int({ min: 1, max: 10 }),
    },
    enabled: faker.datatype.boolean({ probability: 0.8 }),
    creator: faker.helpers.arrayElement(creators),
    targetParticipants: faker.number.int({ min: 100, max: 50000 }),
    usedBudget: faker.number.int({ min: 0, max: budget }),
    totalBudget: budget,
  }
}

/**
 * 生成随机优惠券数据
 */
const generateCoupon = (): Coupon => {
  const type = faker.helpers.arrayElement(couponTypes)
  const status = faker.helpers.arrayElement(couponStatuses)
  const createTime = faker.date.past({ years: 1 }).toISOString()
  const validFrom = faker.date.between({ from: createTime, to: new Date() }).toISOString()
  const validTo = faker.date.future({ years: 1, refDate: validFrom }).toISOString()
  const totalCount = faker.number.int({ min: 100, max: 10000 })
  const usedCount = faker.number.int({ min: 0, max: totalCount })

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName() + '优惠券',
    type,
    status,
    value:
      type === 'percentage'
        ? faker.number.int({ min: 5, max: 50 })
        : faker.number.int({ min: 10, max: 500 }),
    minAmount: faker.helpers.maybe(() => faker.number.int({ min: 100, max: 1000 }), {
      probability: 0.7,
    }),
    maxDiscount:
      type === 'percentage'
        ? faker.helpers.maybe(() => faker.number.int({ min: 50, max: 1000 }), { probability: 0.6 })
        : undefined,
    conditions: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }),
    validFrom,
    validTo,
    totalCount,
    usedCount,
    remainingCount: totalCount - usedCount,
    limitPerUser: faker.number.int({ min: 1, max: 5 }),
    createTime,
    updateTime: faker.date.between({ from: createTime, to: new Date() }).toISOString(),
    creator: faker.helpers.arrayElement(creators),
  }
}

/**
 * 生成营销活动列表
 */
const generateCampaignList = (count: number): Campaign[] => {
  return Array.from({ length: count }, generateCampaign)
}

/**
 * 生成优惠券列表
 */
const generateCouponList = (count: number): Coupon[] => {
  return Array.from({ length: count }, generateCoupon)
}

/**
 * 生成营销统计数据
 */
const generateMarketingStats = (days: number): MarketingStats[] => {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - index))

    const campaignCount = faker.number.int({ min: 1, max: 10 })
    const participants = faker.number.int({ min: 100, max: 5000 })
    const conversions = faker.number.int({ min: 10, max: participants })
    const revenue = faker.number.int({ min: 1000, max: 50000 })
    const cost = faker.number.int({ min: 500, max: revenue })

    return {
      date: date.toISOString().split('T')[0],
      campaignCount,
      participants,
      conversions,
      conversionRate: Number(((conversions / participants) * 100).toFixed(2)),
      revenue,
      cost,
      roi: Number((((revenue - cost) / cost) * 100).toFixed(2)),
    }
  })
}

// 模拟数据存储
export const mockCampaignList = generateCampaignList(50)
export const mockCouponList = generateCouponList(30)
export const mockStatsData = generateMarketingStats(30)

// Mock API functions
export const mockGetCampaignOverview = (): Promise<ApiResponse<CampaignOverview>> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      totalCampaigns: mockCampaignList.length,
      activeCampaigns: mockCampaignList.filter((c) => c.status === 'active').length,
      totalParticipants: mockCampaignList.reduce((sum, c) => sum + c.participants, 0),
      conversionRate:
        mockCampaignList.reduce((sum, c) => sum + c.conversionRate, 0) / mockCampaignList.length,
    },
  })
}

export const mockGetCampaignList = (
  params: CampaignSearchParams = {},
): Promise<ApiResponse<{ list: Campaign[]; total: number }>> => {
  let filteredList = [...mockCampaignList]

  if (params.name) {
    filteredList = filteredList.filter((item) => item.name.includes(params.name!))
  }
  if (params.type) {
    filteredList = filteredList.filter((item) => item.type === params.type)
  }
  if (params.status) {
    filteredList = filteredList.filter((item) => item.status === params.status)
  }

  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      list: filteredList.slice(start, end),
      total: filteredList.length,
    },
  })
}

export const mockGetCampaignDetail = (id: string): Promise<ApiResponse<Campaign | null>> => {
  const campaign = mockCampaignList.find((item) => item.id === id)
  if (!campaign) {
    return Promise.resolve({
      code: 404,
      message: '营销活动不存在',
      data: null,
    })
  }

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: campaign,
  })
}

export const mockCreateCampaign = (
  params: CreateCampaignParams,
): Promise<ApiResponse<Campaign>> => {
  const newCampaign: Campaign = {
    id: faker.string.uuid(),
    ...params,
    status: 'draft',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    participants: 0,
    conversions: 0,
    conversionRate: 0,
    spent: 0,
    usedBudget: 0,
    enabled: true,
    creator: '当前用户',
    targetParticipants: params.targetParticipants ?? 0,
    totalBudget: params.totalBudget ?? 0, // 设置默认值为0，避免undefined
  }

  mockCampaignList.unshift(newCampaign)

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: newCampaign,
  })
}

export const mockUpdateCampaign = (
  params: UpdateCampaignParams,
): Promise<ApiResponse<Campaign | null>> => {
  const index = mockCampaignList.findIndex((item) => item.id === params.id)
  if (index === -1) {
    return Promise.resolve({
      code: 404,
      message: '营销活动不存在',
      data: null,
    })
  }

  const updatedCampaign = {
    ...mockCampaignList[index],
    ...params,
    updateTime: new Date().toISOString(),
  }

  mockCampaignList[index] = updatedCampaign

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: updatedCampaign,
  })
}

export const mockDeleteCampaign = (id: string): Promise<ApiResponse<null>> => {
  const index = mockCampaignList.findIndex((item) => item.id === id)
  if (index === -1) {
    return Promise.resolve({
      code: 404,
      message: '营销活动不存在',
      data: null,
    })
  }

  mockCampaignList.splice(index, 1)

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
  })
}

export const mockToggleCampaign = (id: string): Promise<ApiResponse<Campaign | null>> => {
  const campaign = mockCampaignList.find((item) => item.id === id)
  if (!campaign) {
    return Promise.resolve({
      code: 404,
      message: '营销活动不存在',
      data: null,
    })
  }

  campaign.status = campaign.status === 'active' ? 'paused' : 'active'
  campaign.updateTime = new Date().toISOString()

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: campaign,
  })
}

export const mockGetCouponList = (): Promise<ApiResponse<Coupon[]>> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: mockCouponList,
  })
}

export const mockCreateCoupon = (params: CreateCouponParams): Promise<ApiResponse<Coupon>> => {
  const newCoupon: Coupon = {
    id: faker.string.uuid(),
    ...params,
    status: 'active',
    usedCount: 0,
    remainingCount: params.totalCount,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    creator: '当前用户',
  }

  mockCouponList.unshift(newCoupon)

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: newCoupon,
  })
}

export const mockUpdateCoupon = (
  params: UpdateCouponParams,
): Promise<ApiResponse<Coupon | null>> => {
  const index = mockCouponList.findIndex((item) => item.id === params.id)
  if (index === -1) {
    return Promise.resolve({
      code: 404,
      message: '优惠券不存在',
      data: null,
    })
  }

  const updatedCoupon = {
    ...mockCouponList[index],
    ...params,
    updateTime: new Date().toISOString(),
  }

  mockCouponList[index] = updatedCoupon as Coupon

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: updatedCoupon,
  })
}

export const mockDeleteCoupon = (id: string): Promise<ApiResponse<null>> => {
  const index = mockCouponList.findIndex((item) => item.id === id)
  if (index === -1) {
    return Promise.resolve({
      code: 404,
      message: '优惠券不存在',
      data: null,
    })
  }

  mockCouponList.splice(index, 1)

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
  })
}

export const mockGetMarketingStats = (): Promise<ApiResponse<MarketingStats[]>> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: mockStatsData,
  })
}

export const mockExportCampaignData = (): Promise<ApiResponse<{ url: string }>> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      url: '/api/export/campaigns.xlsx',
    },
  })
}

export const mockExportCouponData = (): Promise<ApiResponse<{ url: string }>> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      url: '/api/export/coupons.xlsx',
    },
  })
}
