import { apiGet, apiPost, apiPut, apiDelete } from './index'
import type {
  CampaignOverview,
  Campaign,
  CampaignSearchParams,
  CreateCampaignParams,
  UpdateCampaignParams,
  Coupon,
  CreateCouponParams,
  UpdateCouponParams,
  MarketingStats,
} from '@/mock/marketing'
import {
  mockGetCampaignOverview,
  mockGetCampaignList,
  mockGetCampaignDetail,
  mockCreateCampaign,
  mockUpdateCampaign,
  mockDeleteCampaign,
  mockToggleCampaign,
  mockGetCouponList,
  mockCreateCoupon,
  mockUpdateCoupon,
  mockDeleteCoupon,
  mockGetMarketingStats,
  mockExportCampaignData,
  mockExportCouponData,
} from '@/mock/marketing'
import type { ApiResponse } from './index'

/**
 * 获取营销活动概览数据
 */
export const getCampaignOverview = (): Promise<ApiResponse<CampaignOverview>> => {
  return apiGet<CampaignOverview>(
    '/marketing/campaigns/overview',
    undefined,
    mockGetCampaignOverview,
  )
}

/**
 * 获取营销活动列表
 * @param params 搜索参数
 */
export const getCampaignList = (
  params: CampaignSearchParams = {},
): Promise<ApiResponse<{ list: Campaign[]; total: number }>> => {
  return apiGet<{ list: Campaign[]; total: number }>(
    '/marketing/campaigns',
    params as Record<string, unknown>,
    () => mockGetCampaignList(params),
  )
}

/**
 * 获取营销活动详情
 * @param id 活动ID
 */
export const getCampaignDetail = (id: string): Promise<ApiResponse<Campaign>> => {
  return apiGet<Campaign>(`/marketing/campaigns/${id}`, undefined, () => mockGetCampaignDetail(id))
}

/**
 * 创建营销活动
 * @param params 创建参数
 */
export const createCampaign = (params: CreateCampaignParams): Promise<ApiResponse<Campaign>> => {
  return apiPost<Campaign>('/marketing/campaigns', params, () => mockCreateCampaign(params))
}

/**
 * 更新营销活动
 * @param params 更新参数
 */
export const updateCampaign = (params: UpdateCampaignParams): Promise<ApiResponse<Campaign>> => {
  return apiPut<Campaign>(`/marketing/campaigns/${params.id}`, params, () =>
    mockUpdateCampaign(params),
  )
}

/**
 * 删除营销活动
 * @param id 活动ID
 */
export const deleteCampaign = (id: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/marketing/campaigns/${id}`, undefined, () => mockDeleteCampaign(id))
}

/**
 * 启动/暂停营销活动
 * @param id 活动ID
 */
export const toggleCampaign = (id: string): Promise<ApiResponse<Campaign>> => {
  return apiPost<Campaign>(`/marketing/campaigns/${id}/toggle`, undefined, () =>
    mockToggleCampaign(id),
  )
}

/**
 * 获取优惠券列表
 */
export const getCouponList = (): Promise<ApiResponse<Coupon[]>> => {
  return apiGet<Coupon[]>('/marketing/coupons', undefined, mockGetCouponList)
}

/**
 * 创建优惠券
 * @param params 创建参数
 */
export const createCoupon = (params: CreateCouponParams): Promise<ApiResponse<Coupon>> => {
  return apiPost<Coupon>('/marketing/coupons', params, () => mockCreateCoupon(params))
}

/**
 * 更新优惠券
 * @param params 更新参数
 */
export const updateCoupon = (params: UpdateCouponParams): Promise<ApiResponse<Coupon>> => {
  return apiPut<Coupon>(`/marketing/coupons/${params.id}`, params, () => mockUpdateCoupon(params))
}

/**
 * 删除优惠券
 * @param id 优惠券ID
 */
export const deleteCoupon = (id: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/marketing/coupons/${id}`, undefined, () => mockDeleteCoupon(id))
}

/**
 * 获取营销统计数据
 */
export const getMarketingStats = (): Promise<ApiResponse<MarketingStats[]>> => {
  return apiGet<MarketingStats[]>('/marketing/stats', undefined, mockGetMarketingStats)
}

/**
 * 导出营销活动数据
 */
export const exportCampaignData = (): Promise<ApiResponse<{ url: string }>> => {
  return apiPost<{ url: string }>('/marketing/campaigns/export', undefined, mockExportCampaignData)
}

/**
 * 导出优惠券数据
 */
export const exportCouponData = (): Promise<ApiResponse<{ url: string }>> => {
  return apiPost<{ url: string }>('/marketing/coupons/export', undefined, mockExportCouponData)
}
