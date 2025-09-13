/**
 * 产品相关 API 接口
 */

import { apiGet, apiPost, apiPut, apiDelete } from './index'
import {
  mockGetProductList,
  mockGetProductDetail,
  mockGetProductCategories,
  mockGetProductBrands,
  mockCreateProduct,
  mockUpdateProduct,
  mockDeleteProduct,
  type ProductInfo,
  type ProductCategory,
  type ProductListParams,
} from '@/mock/product'
import type { ApiResponse, PaginationResponse } from './index'

/**
 * 获取产品列表
 * @param params 查询参数
 * @returns 产品列表
 */
export const getProductList = (
  params?: ProductListParams,
): Promise<ApiResponse<PaginationResponse<ProductInfo>>> => {
  return apiGet<PaginationResponse<ProductInfo>>('/product/list', params, mockGetProductList)
}

/**
 * 获取产品详情
 * @param productId 产品ID
 * @returns 产品详情
 */
export const getProductDetail = (productId: string): Promise<ApiResponse<ProductInfo>> => {
  return apiGet<ProductInfo>(`/product/${productId}`, undefined, () =>
    mockGetProductDetail(productId),
  )
}

/**
 * 创建产品
 * @param productData 产品数据
 * @returns 创建结果
 */
export const createProduct = (
  productData: Partial<ProductInfo>,
): Promise<ApiResponse<ProductInfo>> => {
  return apiPost<ProductInfo>('/product', productData, () => mockCreateProduct(productData))
}

/**
 * 更新产品
 * @param productId 产品ID
 * @param productData 产品数据
 * @returns 更新结果
 */
export const updateProduct = (
  productId: string,
  productData: Partial<ProductInfo>,
): Promise<ApiResponse<ProductInfo>> => {
  return apiPut<ProductInfo>(`/product/${productId}`, productData, () =>
    mockUpdateProduct(productId, productData),
  )
}

/**
 * 删除产品
 * @param productId 产品ID
 * @returns 删除结果
 */
export const deleteProduct = (productId: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/product/${productId}`, undefined, () => mockDeleteProduct(productId))
}

/**
 * 批量删除产品
 * @param productIds 产品ID列表
 * @returns 删除结果
 */
export const batchDeleteProducts = (productIds: string[]): Promise<ApiResponse<null>> => {
  return apiDelete<null>('/product/batch', { ids: productIds })
}

/**
 * 获取产品分类列表
 * @returns 分类列表
 */
export const getProductCategories = (): Promise<ApiResponse<ProductCategory[]>> => {
  return apiGet<ProductCategory[]>('/product/categories', undefined, mockGetProductCategories)
}

/**
 * 获取品牌列表
 * @returns 品牌列表
 */
export const getProductBrands = (): Promise<ApiResponse<string[]>> => {
  return apiGet<string[]>('/product/brands', undefined, mockGetProductBrands)
}

/**
 * 创建产品分类
 * @param categoryData 分类数据
 * @returns 创建结果
 */
export const createProductCategory = (
  categoryData: Partial<ProductCategory>,
): Promise<ApiResponse<ProductCategory>> => {
  return apiPost<ProductCategory>('/product/category', categoryData)
}

/**
 * 更新产品分类
 * @param categoryId 分类ID
 * @param categoryData 分类数据
 * @returns 更新结果
 */
export const updateProductCategory = (
  categoryId: string,
  categoryData: Partial<ProductCategory>,
): Promise<ApiResponse<ProductCategory>> => {
  return apiPut<ProductCategory>(`/product/category/${categoryId}`, categoryData)
}

/**
 * 删除产品分类
 * @param categoryId 分类ID
 * @returns 删除结果
 */
export const deleteProductCategory = (categoryId: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/product/category/${categoryId}`)
}

/**
 * 上传产品图片
 * @param file 图片文件
 * @returns 上传结果
 */
export const uploadProductImage = (file: File): Promise<ApiResponse<{ url: string }>> => {
  const formData = new FormData()
  formData.append('file', file)

  return apiPost<{ url: string }>('/product/upload', formData)
}

/**
 * 批量上传产品图片
 * @param files 图片文件列表
 * @returns 上传结果
 */
export const batchUploadProductImages = (
  files: File[],
): Promise<ApiResponse<{ urls: string[] }>> => {
  const formData = new FormData()
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file)
  })

  return apiPost<{ urls: string[] }>('/product/upload/batch', formData)
}

/**
 * 更新产品库存
 * @param productId 产品ID
 * @param stock 库存数量
 * @returns 更新结果
 */
export const updateProductStock = (
  productId: string,
  stock: number,
): Promise<ApiResponse<null>> => {
  return apiPut<null>(`/product/${productId}/stock`, { stock })
}

/**
 * 更新产品状态
 * @param productId 产品ID
 * @param status 产品状态
 * @returns 更新结果
 */
export const updateProductStatus = (
  productId: string,
  status: 'active' | 'inactive' | 'draft',
): Promise<ApiResponse<null>> => {
  return apiPut<null>(`/product/${productId}/status`, { status })
}

/**
 * 获取产品销售统计
 * @param productId 产品ID
 * @param dateRange 日期范围
 * @returns 销售统计
 */
export const getProductSalesStats = (
  productId: string,
  dateRange?: { startDate: string; endDate: string },
): Promise<ApiResponse<any>> => {
  return apiGet<any>(`/product/${productId}/stats`, dateRange)
}

/**
 * 获取热销产品
 * @param limit 数量限制
 * @returns 热销产品列表
 */
export const getHotProducts = (limit: number = 10): Promise<ApiResponse<ProductInfo[]>> => {
  return apiGet<ProductInfo[]>('/product/hot', { limit })
}

/**
 * 获取推荐产品
 * @param productId 基准产品ID
 * @param limit 数量限制
 * @returns 推荐产品列表
 */
export const getRecommendedProducts = (
  productId: string,
  limit: number = 10,
): Promise<ApiResponse<ProductInfo[]>> => {
  return apiGet<ProductInfo[]>(`/product/${productId}/recommended`, { limit })
}
