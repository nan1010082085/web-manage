import { apiGet, apiPost, apiPut, apiDelete } from './index'
import type {
  ContentOverview,
  Content,
  ContentCategory,
  ContentSearchParams,
  CreateContentParams,
  UpdateContentParams,
  BatchContentParams,
} from '@/mock/content'
import {
  mockGetContentOverview,
  mockGetContentCategories,
  mockGetContentList,
  mockGetContentDetail,
  mockCreateContent,
  mockUpdateContent,
  mockDeleteContent,
  mockPublishContent,
  mockBatchContentOperation,
  mockExportContent,
} from '@/mock/content'
import type { ApiResponse } from './index'

/**
 * 获取内容概览数据
 */
export const getContentOverview = (): Promise<ApiResponse<ContentOverview>> => {
  return apiGet<ContentOverview>('/content/overview', undefined, mockGetContentOverview)
}

/**
 * 获取内容分类列表
 */
export const getContentCategories = (): Promise<ApiResponse<ContentCategory[]>> => {
  return apiGet<ContentCategory[]>('/content/categories', undefined, mockGetContentCategories)
}

/**
 * 获取内容列表
 * @param params 搜索参数
 */
export const getContentList = (
  params: ContentSearchParams = {},
): Promise<ApiResponse<{ list: Content[]; total: number }>> => {
  return apiGet<{ list: Content[]; total: number }>(
    '/content/list',
    params as Record<string, unknown>,
    () => mockGetContentList(params),
  )
}

/**
 * 获取内容详情
 * @param id 内容ID
 */
export const getContentDetail = (id: string): Promise<ApiResponse<Content>> => {
  return apiGet<Content>(`/content/detail/${id}`, undefined, () => mockGetContentDetail(id))
}

/**
 * 创建内容
 * @param params 创建参数
 */
export const createContent = (params: CreateContentParams): Promise<ApiResponse<Content>> => {
  return apiPost<Content>('/content/create', params, () => mockCreateContent(params))
}

/**
 * 更新内容
 * @param params 更新参数
 */
export const updateContent = (
  id: string,
  params: UpdateContentParams,
): Promise<ApiResponse<Content>> => {
  return apiPut<Content>('/content/update', params, () => mockUpdateContent(id, params))
}

/**
 * 删除内容
 * @param id 内容ID
 */
export const deleteContent = (id: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/content/delete/${id}`, undefined, () => mockDeleteContent(id))
}

/**
 * 发布内容
 * @param id 内容ID
 */
export const publishContent = (id: string): Promise<ApiResponse<Content>> => {
  return apiPut<Content>(`/content/publish/${id}`, undefined, () => mockPublishContent(id))
}

/**
 * 批量操作内容
 * @param params 批量操作参数
 */
export const batchContentOperation = (params: BatchContentParams): Promise<ApiResponse<null>> => {
  return apiPost<null>('/content/batch', params, () => mockBatchContentOperation(params))
}

/**
 * 导出内容
 * @param params 导出参数
 */
export const exportContent = (
  params: ContentSearchParams = {},
): Promise<ApiResponse<{ url: string }>> => {
  return apiGet<{ url: string }>('/content/export', params as Record<string, unknown>, () =>
    mockExportContent(params),
  )
}

/**
 * 归档内容
 * @param id 内容ID
 */
export const archiveContent = (id: string): Promise<ApiResponse<Content>> => {
  return apiPut<Content>(`/content/${id}/archive`, {}, () =>
    mockBatchContentOperation({ ids: [id], action: 'archive' }),
  )
}

/**
 * 复制内容
 * @param id 内容ID
 */
export const duplicateContent = (id: string): Promise<ApiResponse<Content>> => {
  return apiPost<Content>(`/content/${id}/duplicate`, {}, () =>
    mockCreateContent({ title: '复制的内容', type: 'article', content: '这是复制的内容' }),
  )
}

/**
 * 设置内容置顶
 * @param id 内容ID
 * @param isTop 是否置顶
 */
export const setContentTop = (id: string, isTop: boolean): Promise<ApiResponse<Content>> => {
  return apiPut<Content>(`/content/${id}/top`, { isTop }, () => mockUpdateContent(id, { isTop }))
}

/**
 * 设置内容推荐
 * @param id 内容ID
 * @param isRecommend 是否推荐
 */
export const setContentRecommend = (
  id: string,
  isRecommend: boolean,
): Promise<ApiResponse<Content>> => {
  return apiPut<Content>(`/content/${id}/recommend`, { isRecommend }, () =>
    mockUpdateContent(id, { isRecommend }),
  )
}

/**
 * 导出内容列表
 * @param params 搜索参数
 */
export const exportContentList = (
  params: ContentSearchParams = {},
): Promise<ApiResponse<{ url: string }>> => {
  return apiGet<{ url: string }>('/content/export-list', params as Record<string, unknown>, () =>
    mockExportContent(params),
  )
}
