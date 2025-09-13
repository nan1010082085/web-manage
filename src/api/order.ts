/**
 * 订单相关 API 接口
 */

import { apiGet, apiPost, apiPut, apiDelete } from './index'
import {
  mockGetOrderList,
  mockGetOrderDetail,
  mockUpdateOrderStatus,
  mockGetOrderStats,
  mockCreateOrder,
  mockDeleteOrder,
  type OrderInfo,
  type OrderListParams,
  type OrderStats,
} from '@/mock/order'
import type { ApiResponse, PaginationResponse } from './index'

/**
 * 获取订单列表
 * @param params 查询参数
 * @returns 订单列表
 */
export const getOrderList = (
  params?: OrderListParams,
): Promise<ApiResponse<PaginationResponse<OrderInfo>>> => {
  return apiGet<PaginationResponse<OrderInfo>>('/order/list', params, mockGetOrderList)
}

/**
 * 获取订单详情
 * @param orderId 订单ID
 * @returns 订单详情
 */
export const getOrderDetail = (orderId: string): Promise<ApiResponse<OrderInfo>> => {
  return apiGet<OrderInfo>(`/order/${orderId}`, undefined, () => mockGetOrderDetail(orderId))
}

/**
 * 创建订单
 * @param orderData 订单数据
 * @returns 创建结果
 */
export const createOrder = (orderData: Partial<OrderInfo>): Promise<ApiResponse<OrderInfo>> => {
  return apiPost<OrderInfo>('/order', orderData, () => mockCreateOrder(orderData))
}

/**
 * 更新订单状态
 * @param orderId 订单ID
 * @param status 订单状态
 * @returns 更新结果
 */
export const updateOrderStatus = (
  orderId: string,
  status: OrderInfo['status'],
): Promise<ApiResponse<OrderInfo>> => {
  return apiPut<OrderInfo>(`/order/${orderId}/status`, { status }, () =>
    mockUpdateOrderStatus(orderId, status),
  )
}

/**
 * 删除订单
 * @param orderId 订单ID
 * @returns 删除结果
 */
export const deleteOrder = (orderId: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/order/${orderId}`, undefined, () => mockDeleteOrder(orderId))
}

/**
 * 批量删除订单
 * @param orderIds 订单ID列表
 * @returns 删除结果
 */
export const batchDeleteOrders = (orderIds: string[]): Promise<ApiResponse<null>> => {
  return apiDelete<null>('/order/batch', { ids: orderIds })
}

/**
 * 获取订单统计
 * @returns 订单统计
 */
export const getOrderStats = (): Promise<ApiResponse<OrderStats>> => {
  return apiGet<OrderStats>('/order/stats', undefined, mockGetOrderStats)
}

/**
 * 确认订单
 * @param orderId 订单ID
 * @returns 确认结果
 */
export const confirmOrder = (orderId: string): Promise<ApiResponse<OrderInfo>> => {
  return apiPut<OrderInfo>(`/order/${orderId}/confirm`, {}, () =>
    mockUpdateOrderStatus(orderId, 'paid'),
  )
}

/**
 * 发货
 * @param orderId 订单ID
 * @param trackingNumber 快递单号
 * @param courier 快递公司
 * @returns 发货结果
 */
export const shipOrder = (
  orderId: string,
  trackingNumber: string,
  courier: string,
): Promise<ApiResponse<OrderInfo>> => {
  return apiPut<OrderInfo>(
    `/order/${orderId}/ship`,
    {
      trackingNumber,
      courier,
    },
    () => mockUpdateOrderStatus(orderId, 'shipped'),
  )
}

/**
 * 确认收货
 * @param orderId 订单ID
 * @returns 确认结果
 */
export const deliverOrder = (orderId: string): Promise<ApiResponse<OrderInfo>> => {
  return apiPut<OrderInfo>(`/order/${orderId}/deliver`, {}, () =>
    mockUpdateOrderStatus(orderId, 'delivered'),
  )
}

/**
 * 取消订单
 * @param orderId 订单ID
 * @param reason 取消原因
 * @returns 取消结果
 */
export const cancelOrder = (orderId: string, reason: string): Promise<ApiResponse<OrderInfo>> => {
  return apiPut<OrderInfo>(
    `/order/${orderId}/cancel`,
    {
      reason,
    },
    () => mockUpdateOrderStatus(orderId, 'cancelled'),
  )
}

/**
 * 申请退款
 * @param orderId 订单ID
 * @param reason 退款原因
 * @param amount 退款金额
 * @returns 退款结果
 */
export const refundOrder = (
  orderId: string,
  reason: string,
  amount: number,
): Promise<ApiResponse<OrderInfo>> => {
  return apiPut<OrderInfo>(
    `/order/${orderId}/refund`,
    {
      reason,
      amount,
    },
    () => mockUpdateOrderStatus(orderId, 'refunded'),
  )
}

/**
 * 获取订单物流信息
 * @param orderId 订单ID
 * @returns 物流信息
 */
export const getOrderTracking = (orderId: string): Promise<ApiResponse<any>> => {
  return apiGet<any>(`/order/${orderId}/tracking`)
}

/**
 * 获取订单发票
 * @param orderId 订单ID
 * @returns 发票信息
 */
export const getOrderInvoice = (orderId: string): Promise<ApiResponse<any>> => {
  return apiGet<any>(`/order/${orderId}/invoice`)
}

/**
 * 导出订单数据
 * @param params 查询参数
 * @returns 导出结果
 */
export const exportOrders = (params?: OrderListParams): Promise<ApiResponse<{ url: string }>> => {
  return apiPost<{ url: string }>('/order/export', params)
}

/**
 * 获取订单趋势数据
 * @param dateRange 日期范围
 * @returns 趋势数据
 */
export const getOrderTrends = (dateRange?: {
  startDate: string
  endDate: string
}): Promise<ApiResponse<any>> => {
  return apiGet<any>('/order/trends', dateRange)
}

/**
 * 获取热销商品
 * @param limit 数量限制
 * @returns 热销商品列表
 */
export const getHotSellingProducts = (limit: number = 10): Promise<ApiResponse<any[]>> => {
  return apiGet<any[]>('/order/hot-products', { limit })
}

/**
 * 获取订单来源统计
 * @returns 来源统计
 */
export const getOrderSourceStats = (): Promise<ApiResponse<any>> => {
  return apiGet<any>('/order/source-stats')
}
