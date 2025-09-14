import { ref, computed, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

/**
 * 缓存配置接口
 */
interface CacheConfig {
  /** 缓存过期时间（毫秒） */
  ttl?: number
  /** 最大缓存数量 */
  maxSize?: number
}

/**
 * 缓存项接口
 */
interface CacheItem<T> {
  data: T
  timestamp: number
  key: string
}

/**
 * 防抖配置接口
 */
interface DebounceConfig {
  /** 防抖延迟时间（毫秒） */
  delay?: number
  /** 是否立即执行 */
  immediate?: boolean
}

/**
 * 图表性能优化Hook
 * @param config 缓存配置
 * @returns 性能优化工具函数
 */
export function useChartPerformance(config: CacheConfig = {}) {
  const {
    ttl = 5 * 60 * 1000, // 默认5分钟
    maxSize = 50 // 默认最大50个缓存项
  } = config

  // 缓存存储
  const cache = new Map<string, CacheItem<any>>()
  const cacheKeys = ref<string[]>([])

  /**
   * 生成缓存键
   * @param prefix 前缀
   * @param params 参数
   * @returns 缓存键
   */
  const generateCacheKey = (prefix: string, params?: Record<string, any>): string => {
    const paramStr = params ? JSON.stringify(params) : ''
    return `${prefix}_${paramStr}`
  }

  /**
   * 检查缓存是否过期
   * @param item 缓存项
   * @returns 是否过期
   */
  const isExpired = (item: CacheItem<any>): boolean => {
    return Date.now() - item.timestamp > ttl
  }

  /**
   * 清理过期缓存
   */
  const cleanExpiredCache = (): void => {
    const now = Date.now()
    const expiredKeys: string[] = []

    cache.forEach((item, key) => {
      if (now - item.timestamp > ttl) {
        expiredKeys.push(key)
      }
    })

    expiredKeys.forEach(key => {
      cache.delete(key)
      const index = cacheKeys.value.indexOf(key)
      if (index > -1) {
        cacheKeys.value.splice(index, 1)
      }
    })
  }

  /**
   * 限制缓存大小
   */
  const limitCacheSize = (): void => {
    while (cache.size > maxSize) {
      const oldestKey = cacheKeys.value.shift()
      if (oldestKey) {
        cache.delete(oldestKey)
      }
    }
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param data 数据
   */
  const setCache = <T>(key: string, data: T): void => {
    // 清理过期缓存
    cleanExpiredCache()
    
    // 如果键已存在，先删除
    if (cache.has(key)) {
      const index = cacheKeys.value.indexOf(key)
      if (index > -1) {
        cacheKeys.value.splice(index, 1)
      }
    }

    // 添加新缓存
    cache.set(key, {
      data,
      timestamp: Date.now(),
      key
    })
    cacheKeys.value.push(key)

    // 限制缓存大小
    limitCacheSize()
  }

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 缓存数据或null
   */
  const getCache = <T>(key: string): T | null => {
    const item = cache.get(key)
    if (!item) return null

    if (isExpired(item)) {
      cache.delete(key)
      const index = cacheKeys.value.indexOf(key)
      if (index > -1) {
        cacheKeys.value.splice(index, 1)
      }
      return null
    }

    return item.data
  }

  /**
   * 清除指定缓存
   * @param key 缓存键
   */
  const clearCache = (key: string): void => {
    cache.delete(key)
    const index = cacheKeys.value.indexOf(key)
    if (index > -1) {
      cacheKeys.value.splice(index, 1)
    }
  }

  /**
   * 清除所有缓存
   */
  const clearAllCache = (): void => {
    cache.clear()
    cacheKeys.value = []
  }

  /**
   * 创建防抖函数
   * @param fn 要防抖的函数
   * @param config 防抖配置
   * @returns 防抖后的函数
   */
  const createDebounced = <T extends (...args: unknown[]) => unknown>(
    fn: T,
    config: DebounceConfig = {}
  ): T => {
    const { delay = 300, immediate = false } = config
    let timeoutId: NodeJS.Timeout | null = null
    let lastCallTime = 0

    return ((...args: Parameters<T>) => {
      const now = Date.now()
      
      if (immediate && now - lastCallTime > delay) {
        lastCallTime = now
        return fn(...args)
      }

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        lastCallTime = Date.now()
        fn(...args)
        timeoutId = null
      }, delay)
    }) as T
  }

  /**
   * 创建节流函数
   * @param fn 要节流的函数
   * @param delay 节流延迟
   * @returns 节流后的函数
   */
  const createThrottled = <T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number = 300
  ): T => {
    let lastCallTime = 0
    let timeoutId: NodeJS.Timeout | null = null

    return ((...args: Parameters<T>) => {
      const now = Date.now()
      const timeSinceLastCall = now - lastCallTime

      if (timeSinceLastCall >= delay) {
        lastCallTime = now
        return fn(...args)
      }

      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          lastCallTime = Date.now()
          fn(...args)
          timeoutId = null
        }, delay - timeSinceLastCall)
      }
    }) as T
  }

  /**
   * 缓存统计信息
   */
  const cacheStats = computed(() => ({
    size: cache.size,
    maxSize,
    keys: [...cacheKeys.value],
    hitRate: 0 // 可以根据需要实现命中率统计
  }))

  // 定期清理过期缓存
  const cleanupInterval = setInterval(cleanExpiredCache, ttl)

  // 组件卸载时清理
  onUnmounted(() => {
    clearInterval(cleanupInterval)
    clearAllCache()
  })

  return {
    // 缓存相关
    generateCacheKey,
    setCache,
    getCache,
    clearCache,
    clearAllCache,
    cacheStats,
    
    // 性能优化
    createDebounced,
    createThrottled
  }
}

/**
 * 图表数据缓存Hook
 * @param prefix 缓存前缀
 * @param config 缓存配置
 * @returns 数据缓存工具
 */
export function useChartDataCache(prefix: string, config?: CacheConfig) {
  const performance = useChartPerformance(config)

  /**
   * 缓存数据加载函数
   * @param loader 数据加载函数
   * @param params 参数
   * @returns 带缓存的数据加载函数
   */
  const withCache = async <T, P = any>(
    loader: (params?: P) => Promise<T>,
    params?: P
  ): Promise<T> => {
    const cacheKey = performance.generateCacheKey(prefix, params as Record<string, any>)
    
    // 尝试从缓存获取
    const cached = performance.getCache<T>(cacheKey)
    if (cached !== null) {
      return cached
    }

    // 加载新数据
    const data = await loader(params)
    
    // 缓存数据
    performance.setCache(cacheKey, data)
    
    return data
  }

  /**
   * 预加载数据
   * @param loader 数据加载函数
   * @param paramsList 参数列表
   */
  const preloadData = async <T, P = any>(
    loader: (params?: P) => Promise<T>,
    paramsList: P[]
  ): Promise<void> => {
    const promises = paramsList.map(params => withCache(loader, params))
    await Promise.allSettled(promises)
  }

  return {
    ...performance,
    withCache,
    preloadData
  }
}

/**
 * 图表渲染性能监控Hook
 * @returns 性能监控工具
 */
export function useChartPerformanceMonitor() {
  const renderTimes = ref<number[]>([])
  const averageRenderTime = computed(() => {
    if (renderTimes.value.length === 0) return 0
    return renderTimes.value.reduce((sum, time) => sum + time, 0) / renderTimes.value.length
  })

  /**
   * 记录渲染时间
   * @param startTime 开始时间
   * @param endTime 结束时间
   */
  const recordRenderTime = (startTime: number, endTime: number): void => {
    const renderTime = endTime - startTime
    renderTimes.value.push(renderTime)
    
    // 只保留最近50次记录
    if (renderTimes.value.length > 50) {
      renderTimes.value.shift()
    }
  }

  /**
   * 创建性能监控装饰器
   * @param fn 要监控的函数
   * @returns 带性能监控的函数
   */
  const withPerformanceMonitor = <T extends (...args: any[]) => any>(fn: T): T => {
    return ((...args: Parameters<T>) => {
      const startTime = performance.now()
      const result = fn(...args)
      
      if (result instanceof Promise) {
        return result.finally(() => {
          recordRenderTime(startTime, performance.now())
        })
      } else {
        recordRenderTime(startTime, performance.now())
        return result
      }
    }) as T
  }

  return {
    renderTimes: renderTimes.value,
    averageRenderTime,
    recordRenderTime,
    withPerformanceMonitor
  }
}