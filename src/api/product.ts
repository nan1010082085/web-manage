/**
 * 产品相关 API 接口
 */

import { apiGet, apiPost, apiPut, apiDelete } from './index'
import {
  type ProductInfo,
  type ProductCategory,
  type ProductListParams,
  mockGetProductList,
  mockGetProductDetail,
  mockCreateProduct,
  mockUpdateProduct,
  mockDeleteProduct,
  mockBatchDeleteProducts,
  mockGetProductCategories,
  mockGetProductBrands,
  mockCreateProductCategory,
  mockUpdateProductCategory,
  mockDeleteProductCategory,
  mockUploadProductImage,
  mockBatchUploadProductImages,
  mockUpdateProductStock,
  mockUpdateProductStatus,
  mockGetProductSalesStats,
  mockGetHotProducts,
  mockGetRecommendedProducts,
} from '@/mock/product'
import type { ApiResponse, PaginationResponse } from './index'

// 重新导出类型
export type { ProductInfo, ProductCategory, ProductListParams } from '@/mock/product'

/**
 * 获取产品列表
 * @param params 查询参数
 * @returns 产品列表
 */
export const getProductList = (
  params?: ProductListParams,
): Promise<ApiResponse<PaginationResponse<ProductInfo>>> => {
  return apiGet<PaginationResponse<ProductInfo>>(
    '/products',
    params as Record<string, unknown>,
    () => mockGetProductList(params),
  )
}

/**
 * 获取产品详情
 * @param productId 产品ID
 * @returns 产品详情
 */
export const getProductDetail = (productId: string): Promise<ApiResponse<ProductInfo>> => {
  return apiGet<ProductInfo>(`/products/${productId}`, undefined, () =>
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
  return apiPost<ProductInfo>('/products', productData, () => mockCreateProduct(productData))
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
  return apiPut<ProductInfo>(`/products/${productId}`, productData, () =>
    mockUpdateProduct(productId, productData),
  )
}

/**
 * 删除产品
 * @param productId 产品ID
 * @returns 删除结果
 */
export const deleteProduct = (productId: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/products/${productId}`, undefined, () => mockDeleteProduct(productId))
}

/**
 * 批量删除产品
 * @param productIds 产品ID列表
 * @returns 删除结果
 */
export const batchDeleteProducts = (productIds: string[]): Promise<ApiResponse<null>> => {
  return apiPost<null>('/products/batch-delete', { productIds }, () =>
    mockBatchDeleteProducts(productIds),
  )
}

/**
 * 获取产品分类列表
 * @returns 分类列表
 */
export const getProductCategories = (): Promise<ApiResponse<ProductCategory[]>> => {
  return apiGet<ProductCategory[]>('/products/categories', undefined, () =>
    mockGetProductCategories(),
  )
}

/**
 * 获取品牌列表
 * @returns 品牌列表
 */
export const getProductBrands = (): Promise<ApiResponse<string[]>> => {
  return apiGet<string[]>('/products/brands', undefined, () => mockGetProductBrands())
}

/**
 * 创建产品分类
 * @param categoryData 分类数据
 * @returns 创建结果
 */
export const createProductCategory = (
  categoryData: Partial<ProductCategory>,
): Promise<ApiResponse<ProductCategory>> => {
  return apiPost<ProductCategory>('/products/categories', categoryData, () =>
    mockCreateProductCategory(categoryData),
  )
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
  return apiPut<ProductCategory>(`/products/categories/${categoryId}`, categoryData, () =>
    mockUpdateProductCategory(categoryId, categoryData),
  )
}

/**
 * 删除产品分类
 * @param categoryId 分类ID
 * @returns 删除结果
 */
export const deleteProductCategory = (categoryId: string): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/products/categories/${categoryId}`, undefined, () =>
    mockDeleteProductCategory(categoryId),
  )
}

/**
 * 上传产品图片
 * @param file 图片文件
 * @returns 上传结果
 */
export const uploadProductImage = (file: File): Promise<ApiResponse<{ url: string }>> => {
  return apiPost<{ url: string }>('/products/upload-image', { file }, () =>
    mockUploadProductImage(file),
  )
}

/**
 * 批量上传产品图片
 * @param files 图片文件列表
 * @returns 上传结果
 */
export const batchUploadProductImages = (
  files: File[],
): Promise<ApiResponse<{ urls: string[] }>> => {
  return apiPost<{ urls: string[] }>('/products/batch-upload-images', { files }, () =>
    mockBatchUploadProductImages(files),
  )
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
  return apiPut<null>(`/products/${productId}/stock`, { stock }, () =>
    mockUpdateProductStock(productId, stock),
  )
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
  return apiPut<null>(`/products/${productId}/status`, { status }, () =>
    mockUpdateProductStatus(productId, status),
  )
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
): Promise<
  ApiResponse<{
    totalSales: number
    totalRevenue: number
    salesTrend: Array<{ date: string; sales: number; revenue: number }>
  }>
> => {
  return apiGet<{
    totalSales: number
    totalRevenue: number
    salesTrend: Array<{ date: string; sales: number; revenue: number }>
  }>(`/products/${productId}/sales-stats`, dateRange, () => mockGetProductSalesStats(productId))
}

/**
 * 获取热销产品
 * @param limit 数量限制
 * @returns 热销产品列表
 */
export const getHotProducts = (limit: number = 10): Promise<ApiResponse<ProductInfo[]>> => {
  return apiGet<ProductInfo[]>('/products/hot', { limit }, () => mockGetHotProducts(limit))
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
  return apiGet<ProductInfo[]>(`/products/${productId}/recommended`, { limit }, () =>
    mockGetRecommendedProducts(productId, limit),
  )
}
