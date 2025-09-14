/**
 * Mock 数据管理
 * 统一管理所有模拟数据
 */

import type { ApiResponse } from '@/api'

/**
 * Mock 数据配置接口
 */
export interface MockConfig {
  /** 是否启用 Mock */
  enabled: boolean
  /** Mock 延迟时间（毫秒） */
  delay: number
  /** 是否显示 Mock 日志 */
  showLog: boolean
}

/**
 * Mock 配置
 */
export const mockConfig: MockConfig = {
  enabled: import.meta.env.VITE_USE_MOCK === 'true',
  delay: 300,
  showLog: import.meta.env.DEV,
}

/**
 * Mock 响应数据接口
 */
export type MockResponse<T = unknown> = ApiResponse<T>

/**
 * 创建成功响应
 * @param data 响应数据
 * @param message 响应消息
 * @returns Mock 响应
 */
export const createSuccessResponse = <T>(
  data: T,
  message: string = '操作成功',
): MockResponse<T> => ({
  code: 200,
  message,
  data,
  timestamp: Date.now(),
})

/**
 * 创建错误响应
 * @param message 错误消息
 * @param code 错误码
 * @returns Mock 响应
 */
export const createErrorResponse = (
  message: string = '操作失败',
  code: number = 500,
): MockResponse<null> => ({
  code,
  message,
  data: null,
  timestamp: Date.now(),
})

/**
 * 模拟异步延迟
 * @param delay 延迟时间（毫秒）
 * @returns Promise
 */
export const mockDelay = (delay: number = mockConfig.delay): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

/**
 * Mock 日志输出
 * @param method HTTP 方法
 * @param url 请求 URL
 * @param data 响应数据
 */
export const mockLog = (method: string, url: string, data: unknown): void => {
  if (mockConfig.showLog) {
    console.group(`🎭 Mock ${method.toUpperCase()} ${url}`)
    console.log('Response:', data)
    console.groupEnd()
  }
}

/**
 * 分页数据接口
 */
export interface PaginationData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 创建分页响应
 * @param list 数据列表
 * @param page 当前页码
 * @param pageSize 每页大小
 * @returns 分页数据
 */
export const createPaginationData = <T>(
  list: T[],
  page: number = 1,
  pageSize: number = 10,
): PaginationData<T> => {
  const total = list.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedList = list.slice(startIndex, endIndex)

  return {
    list: paginatedList,
    total,
    page,
    pageSize,
  }
}

/**
 * 生成随机 ID
 * @param prefix 前缀
 * @returns 随机 ID
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 生成随机数字
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数字
 */
export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成随机日期
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 随机日期字符串
 */
export const randomDate = (
  startDate: Date = new Date(2023, 0, 1),
  endDate: Date = new Date(),
): string => {
  const start = startDate.getTime()
  const end = endDate.getTime()
  const randomTime = start + Math.random() * (end - start)
  return new Date(randomTime).toISOString()
}

/**
 * 生成随机选择
 * @param array 数组
 * @returns 随机元素
 */
export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 生成随机ID（别名）
 * @param prefix ID前缀
 * @returns 随机ID
 */
export const generateRandomId = generateId

/**
 * 生成随机数字（别名）
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数字
 */
export const generateRandomNumber = randomNumber

/**
 * 生成随机日期（别名）
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 随机日期字符串
 */
export const generateRandomDate = randomDate

// 导出图表数据服务
// export * from './charts' // 暂时注释，文件不存在
