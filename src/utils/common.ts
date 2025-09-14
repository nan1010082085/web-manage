import {
  cloneDeep,
  get,
  uniqBy,
  filter,
  isString,
  isNumber,
  debounce,
  throttle,
  truncate,
  trim,
  pickBy,
  isEmpty,
  isNil,
} from 'lodash-es'

/**
 * 安全获取对象属性值
 * @param obj 目标对象
 * @param path 属性路径
 * @param defaultValue 默认值
 * @returns 属性值或默认值
 */
export const safeGet = <T, R = unknown>(obj: T, path: string, defaultValue?: R): R => {
  return get(obj, path, defaultValue) as R
}

/**
 * 数组去重（基于属性）
 * @param array 目标数组
 * @param key 去重依据的属性键
 * @returns 去重后的数组
 */
export const uniqueByKey = <T, K extends keyof T>(array: T[], key: K): T[] => {
  return uniqBy(array, key)
}

/**
 * 搜索过滤函数
 * @param items 待搜索的数组
 * @param searchTerm 搜索关键词
 * @param searchFields 搜索字段
 * @returns 过滤后的数组
 */
export const searchFilter = <T extends Record<string, unknown>>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
): T[] => {
  if (!searchTerm.trim()) return items

  return filter(items, (item) => {
    return searchFields.some((field) => {
      const value = get(item, field as string)
      if (isString(value)) {
        return value.toLowerCase().includes(searchTerm.toLowerCase())
      }
      if (isNumber(value)) {
        return value.toString().includes(searchTerm)
      }
      return false
    })
  })
}

/**
 * 创建防抖函数
 * @param fn 目标函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const createDebouncedFn = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300,
): T => {
  return debounce(fn, delay) as unknown as T
}

/**
 * 创建节流函数
 * @param fn 目标函数
 * @param wait 等待时间（毫秒）
 * @returns 节流后的函数
 */
export const createThrottledFn = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait = 300,
): T => {
  return throttle(fn, wait) as unknown as T
}

/**
 * 格式化文本
 * @param text 原始文本
 * @param maxLength 最大长度
 * @param suffix 省略符号
 * @returns 格式化后的文本
 */
export const formatText = (text: string, maxLength = 50, suffix = '...'): string => {
  if (!isString(text)) return ''
  return truncate(trim(text), { length: maxLength, omission: suffix })
}

/**
 * 过滤空值
 * @param obj 目标对象
 * @returns 过滤后的对象
 */
export const filterEmpty = <T extends Record<string, unknown>>(obj: T): Record<string, unknown> => {
  return pickBy(obj, (value) => !isEmpty(value) && !isNil(value))
}

/**
 * 深拷贝对象
 * @param obj 目标对象
 * @returns 深拷贝后的对象
 */
export const deepClone = <T>(obj: T): T => {
  return cloneDeep(obj)
}
