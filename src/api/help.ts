import { apiGet, apiPost } from './index'
import type { ApiResponse } from './index'
import {
  mockSearchHelpArticles,
  mockGetHelpArticleDetail,
  mockGetFAQList,
  mockGetAPIDocList,
  mockGetVideoList,
  mockGetDownloadResourceList,
  mockGetGettingStartedSteps,
  mockGetUserGuideList,
  mockGetQuickAccessList,
  mockCreateSupportTicket,
  mockLikeHelpArticle,
  mockDislikeHelpArticle,
  mockLikeFAQ,
  mockDislikeFAQ,
  type HelpArticle,
  type FAQ,
  type APIDoc,
  type Video,
  type DownloadResource,
  type GettingStartedStep,
  type UserGuide,
  type QuickAccess,
  type SupportTicket,
  type HelpSearchParams,
  type CreateSupportTicketParams,
} from '@/mock/help'

/**
 * 搜索帮助文章
 * @param params 搜索参数
 * @returns 帮助文章列表
 */
export const searchHelpArticles = (
  params: HelpSearchParams = {},
): Promise<ApiResponse<{ list: HelpArticle[]; total: number }>> => {
  return apiGet<{ list: HelpArticle[]; total: number }>(
    '/help/articles/search',
    params as Record<string, unknown>,
    () => mockSearchHelpArticles(params),
  )
}

/**
 * 获取帮助文章详情
 * @param id 文章ID
 * @returns 帮助文章详情
 */
export const getHelpArticleDetail = (id: string): Promise<ApiResponse<HelpArticle | null>> => {
  return apiGet<HelpArticle | null>(`/help/articles/${id}`, undefined, () => mockGetHelpArticleDetail(id))
}

/**
 * 获取常见问题列表
 * @returns 常见问题列表
 */
export const getFAQList = (): Promise<ApiResponse<FAQ[]>> => {
  return apiGet<FAQ[]>('/help/faq', undefined, mockGetFAQList)
}

/**
 * 获取API文档列表
 * @returns API文档列表
 */
export const getAPIDocList = (): Promise<ApiResponse<APIDoc[]>> => {
  return apiGet<APIDoc[]>('/help/api-docs', undefined, mockGetAPIDocList)
}

/**
 * 获取视频教程列表
 * @returns 视频教程列表
 */
export const getVideoList = (): Promise<ApiResponse<Video[]>> => {
  return apiGet<Video[]>('/help/videos', undefined, mockGetVideoList)
}

/**
 * 获取下载资源列表
 * @returns 下载资源列表
 */
export const getDownloadResourceList = (): Promise<ApiResponse<DownloadResource[]>> => {
  return apiGet<DownloadResource[]>('/help/downloads', undefined, mockGetDownloadResourceList)
}

/**
 * 获取快速入门步骤
 * @returns 快速入门步骤列表
 */
export const getGettingStartedSteps = (): Promise<ApiResponse<GettingStartedStep[]>> => {
  return apiGet<GettingStartedStep[]>(
    '/help/getting-started',
    undefined,
    mockGetGettingStartedSteps,
  )
}

/**
 * 获取用户指南列表
 * @returns 用户指南列表
 */
export const getUserGuideList = (): Promise<ApiResponse<UserGuide[]>> => {
  return apiGet<UserGuide[]>('/help/user-guides', undefined, mockGetUserGuideList)
}

/**
 * 获取快速访问列表
 * @returns 快速访问列表
 */
export const getQuickAccessList = (): Promise<ApiResponse<QuickAccess[]>> => {
  return apiGet<QuickAccess[]>('/help/quick-access', undefined, mockGetQuickAccessList)
}

/**
 * 创建支持工单
 * @param params 工单参数
 * @returns 创建的工单信息
 */
export const createSupportTicket = (
  params: CreateSupportTicketParams,
): Promise<ApiResponse<SupportTicket>> => {
  return apiPost<SupportTicket>('/help/support-tickets', params, () =>
    mockCreateSupportTicket(params),
  )
}

/**
 * 点赞帮助文章
 * @param id 文章ID
 * @returns 操作结果
 */
export const likeHelpArticle = (id: string): Promise<ApiResponse<null>> => {
  return apiPost<null>(`/help/articles/${id}/like`, undefined, () => mockLikeHelpArticle(id))
}

/**
 * 点踩帮助文章
 * @param id 文章ID
 * @returns 操作结果
 */
export const dislikeHelpArticle = (id: string): Promise<ApiResponse<null>> => {
  return apiPost<null>(`/help/articles/${id}/dislike`, undefined, () => mockDislikeHelpArticle(id))
}

/**
 * 点赞FAQ
 * @param id FAQ ID
 * @returns 操作结果
 */
export const likeFAQ = (id: string): Promise<ApiResponse<null>> => {
  return apiPost<null>(`/help/faq/${id}/like`, undefined, () => mockLikeFAQ(id))
}

/**
 * 点踩FAQ
 * @param id FAQ ID
 * @returns 操作结果
 */
export const dislikeFAQ = (id: string): Promise<ApiResponse<null>> => {
  return apiPost<null>(`/help/faq/${id}/dislike`, undefined, () => mockDislikeFAQ(id))
}

// 导出类型
export type {
  HelpArticle,
  FAQ,
  APIDoc,
  Video,
  DownloadResource,
  GettingStartedStep,
  UserGuide,
  QuickAccess,
  SupportTicket,
  HelpSearchParams,
  CreateSupportTicketParams,
}
