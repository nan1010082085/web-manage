/**
 * API 请求配置
 * 统一管理所有 API 请求，支持 Mock 和真实接口切换
 */

import { mockConfig } from '@/mock'
import type { MockResponse } from '@/mock'
import request from '@/utils/request'

/**
 * API 请求配置接口
 */
export interface ApiConfig {
  /** 基础 URL */
  baseURL: string
  /** 请求超时时间 */
  timeout: number
  /** 是否使用 Mock */
  useMock: boolean
}

/**
 * API 配置
 */
export const apiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  useMock: mockConfig.enabled,
}

/**
 * API 响应接口
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp?: number
}

/**
 * 分页响应接口
 */
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * API 请求方法类型
 */
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * API 请求参数接口
 */
export interface ApiRequestConfig {
  /** 请求方法 */
  method: ApiMethod
  /** 请求 URL */
  url: string
  /** 请求参数 */
  params?: Record<string, unknown>
  /** 请求数据 */
  data?: unknown
  /** 请求头 */
  headers?: Record<string, string>
  /** Mock 函数 */
  mockFn?: (...args: unknown[]) => Promise<MockResponse<unknown>>
}

/**
 * API 请求函数
 * @param config 请求配置
 * @returns 响应数据
 */
export const apiRequest = async <T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> => {
  const { method, url, params, data, headers, mockFn } = config

  // 如果启用 Mock 且提供了 Mock 函数
  if (apiConfig.useMock && mockFn) {
    try {
      const mockResponse = await mockFn(data || params)
      return mockResponse as ApiResponse<T>
    } catch (error) {
      console.error('Mock request failed:', error)
      throw error
    }
  }

  // 真实 API 请求
  try {
    const response = await request({
      method,
      url,
      params,
      data,
      headers,
    })

    return response.data as ApiResponse<T>
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

/**
 * GET 请求
 * @param url 请求 URL
 * @param params 请求参数
 * @param mockFn Mock 函数
 * @returns 响应数据
 */
export const apiGet = <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  mockFn?: (...args: unknown[]) => Promise<MockResponse<unknown>>,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({
    method: 'GET',
    url,
    params,
    mockFn,
  })
}

/**
 * POST 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param mockFn Mock 函数
 * @returns 响应数据
 */
export const apiPost = <T = unknown>(
  url: string,
  data?: unknown,
  mockFn?: (...args: unknown[]) => Promise<MockResponse<unknown>>,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({
    method: 'POST',
    url,
    data,
    mockFn,
  })
}

/**
 * PUT 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param mockFn Mock 函数
 * @returns 响应数据
 */
export const apiPut = <T = unknown>(
  url: string,
  data?: unknown,
  mockFn?: (...args: unknown[]) => Promise<MockResponse<unknown>>,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({
    method: 'PUT',
    url,
    data,
    mockFn,
  })
}

/**
 * DELETE 请求
 * @param url 请求 URL
 * @param params 请求参数
 * @param mockFn Mock 函数
 * @returns 响应数据
 */
export const apiDelete = <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  mockFn?: (...args: unknown[]) => Promise<MockResponse<unknown>>,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({
    method: 'DELETE',
    url,
    params,
    mockFn,
  })
}

/**
 * PATCH 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param mockFn Mock 函数
 * @returns 响应数据
 */
export const apiPatch = <T = unknown>(
  url: string,
  data?: unknown,
  mockFn?: (...args: unknown[]) => Promise<MockResponse<unknown>>,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({
    method: 'PATCH',
    url,
    data,
    mockFn,
  })
}
