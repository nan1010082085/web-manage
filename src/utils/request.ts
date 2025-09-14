import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import type { ApiResponse } from '@/api'

/**
 * 创建axios实例
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config: any) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    if (response.status === 200) {
      if (data.code === 200) {
        return response
      } else {
        // 业务错误
        message.error(data.message || '请求失败')
        return Promise.reject(new Error(data.message || '请求失败'))
      }
    } else {
      message.error('网络错误')
      return Promise.reject(new Error('网络错误'))
    }
  },
  (error) => {
    // 对响应错误做点什么
    console.error('Response error:', error)

    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          message.error('未授权，请重新登录')
          // 清除token并跳转到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          message.error('拒绝访问')
          break
        case 404:
          message.error('请求地址出错')
          break
        case 500:
          message.error('服务器内部错误')
          break
        default:
          message.error(data?.message || '请求失败')
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接')
    } else {
      message.error('请求配置错误')
    }

    return Promise.reject(error)
  },
)

/**
 * 封装POST请求
 */
export const post = <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  return service.post(url, data)
}

export default service
export type { ApiResponse }
