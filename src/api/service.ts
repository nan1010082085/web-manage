/**
 * 客服相关 API 接口
 */

import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  type ApiResponse,
  type PaginationResponse,
} from './index'
import {
  mockGetServiceOverview,
  mockGetTicketList,
  mockGetTicketDetail,
  mockCreateTicket,
  mockUpdateTicket,
  mockDeleteTicket,
  mockGetAgentList,
  mockAssignTicket,
  mockExportTickets,
  type ServiceOverview,
  type Ticket,
  type TicketRecord,
  type ServiceAgent,
  type TicketListParams,
  type CreateTicketParams,
  type UpdateTicketParams,
  type SearchForm,
  type FormData,
  type ReplyForm,
  type AssignTicketParams,
  type ResolveTicketParams,
  type CloseTicketParams,
  type AddReplyParams,
} from '@/mock/service'

// 导出类型
export type {
  ServiceOverview,
  Ticket,
  TicketRecord,
  ServiceAgent,
  TicketListParams,
  CreateTicketParams,
  UpdateTicketParams,
  SearchForm,
  FormData,
  ReplyForm,
  AssignTicketParams,
  ResolveTicketParams,
  CloseTicketParams,
  AddReplyParams,
}

/**
 * 获取客服概览数据
 * @returns 客服概览数据
 */
export const getServiceOverview = (): Promise<ApiResponse<ServiceOverview>> => {
  return apiGet('/service/overview', {}, mockGetServiceOverview)
}

/**
 * 获取工单列表
 * @param params 查询参数
 * @returns 工单列表
 */
export const getTicketList = (
  params: TicketListParams = {},
): Promise<ApiResponse<PaginationResponse<Ticket>>> => {
  return apiGet('/service/tickets', params as Record<string, unknown>, () =>
    mockGetTicketList(params),
  )
}

/**
 * 获取工单详情
 * @param id 工单ID
 * @returns 工单详情
 */
export const getTicketDetail = (id: string): Promise<ApiResponse<Ticket>> => {
  return apiGet(`/service/tickets/${id}`, {}, () => mockGetTicketDetail(id))
}

/**
 * 创建工单
 * @param params 创建参数
 * @returns 创建的工单
 */
export const createTicket = (params: CreateTicketParams): Promise<ApiResponse<Ticket>> => {
  return apiPost('/service/tickets', params, () => mockCreateTicket(params))
}

/**
 * 更新工单
 * @param params 更新参数
 * @returns 更新后的工单
 */
export const updateTicket = (params: UpdateTicketParams): Promise<ApiResponse<Ticket>> => {
  return apiPut(`/service/tickets/${params.id}`, params, () => mockUpdateTicket(params))
}

/**
 * 删除工单
 * @param id 工单ID
 * @returns 删除结果
 */
export const deleteTicket = (id: string): Promise<ApiResponse<null>> => {
  return apiDelete(`/service/tickets/${id}`, {}, () => mockDeleteTicket(id))
}

/**
 * 获取客服人员列表
 * @returns 客服人员列表
 */
export const getAgentList = (): Promise<ApiResponse<ServiceAgent[]>> => {
  return apiGet('/service/agents', {}, mockGetAgentList)
}

/**
 * 分配工单
 * @param params 分配参数
 * @returns 分配后的工单
 */
export const assignTicket = (params: AssignTicketParams): Promise<ApiResponse<Ticket>> => {
  return apiPost(`/service/tickets/${params.id}/assign`, { agentId: params.agentId }, () =>
    mockAssignTicket(params.id, params.agentId),
  )
}

/**
 * 关闭工单
 * @param params 关闭参数
 * @returns 关闭后的工单
 */
export const closeTicket = (params: CloseTicketParams): Promise<ApiResponse<Ticket>> => {
  return apiPut(`/service/tickets/${params.id}/close`, {}, () => {
    return mockUpdateTicket({ id: params.id, status: 'closed' })
  })
}

/**
 * 重新打开工单
 * @param params 重新打开参数
 * @returns 重新打开后的工单
 */
export const reopenTicket = (params: ResolveTicketParams): Promise<ApiResponse<Ticket>> => {
  return apiPut(`/service/tickets/${params.id}/reopen`, {}, () => {
    return mockUpdateTicket({ id: params.id, status: 'processing' })
  })
}

/**
 * 解决工单
 * @param params 解决参数
 * @returns 解决后的工单
 */
export const resolveTicket = (params: ResolveTicketParams): Promise<ApiResponse<Ticket>> => {
  return apiPut(`/service/tickets/${params.id}/resolve`, {}, () => {
    return mockUpdateTicket({ id: params.id, status: 'resolved' })
  })
}

/**
 * 批量操作工单
 * @param ids 工单ID列表
 * @param action 操作类型
 * @param params 操作参数
 * @returns 操作结果
 */
export const batchOperateTickets = (
  ids: string[],
  action: 'assign' | 'close' | 'resolve' | 'delete',
  params?: { agentId?: string },
): Promise<ApiResponse<null>> => {
  return apiPost('/service/tickets/batch', { ids, action, ...params }, async () => {
    // 模拟批量操作
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      code: 200,
      message: '批量操作成功',
      data: null,
      timestamp: Date.now(),
    }
  })
}

/**
 * 导出工单数据
 * @param params 导出参数
 * @returns 导出文件URL
 */
export const exportTickets = (
  params: TicketListParams = {},
): Promise<ApiResponse<{ url: string }>> => {
  return apiPost('/service/tickets/export', params, async () => {
    // 模拟导出操作
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      code: 200,
      message: '导出成功',
      data: {
        url: '/downloads/tickets_export.xlsx',
      },
      timestamp: Date.now(),
    }
  })
}

/**
 * 导出工单
 * @param params 导出参数
 * @returns Promise<ApiResponse<{ url: string }>>
 */
export const exportTicketsApi = async (
  params: TicketListParams,
): Promise<ApiResponse<{ url: string }>> => {
  return mockExportTickets(params)
}
