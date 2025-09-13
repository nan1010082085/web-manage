/**
 * 产品相关 Mock 数据
 */

import {
  createSuccessResponse,
  createErrorResponse,
  createPaginationData,
  generateId,
  randomNumber,
  randomDate,
  randomChoice,
  mockDelay,
  mockLog,
  type MockResponse,
  type PaginationData,
} from './index'

/**
 * 产品信息接口
 */
export interface ProductInfo {
  id: string
  name: string
  description: string
  category: string
  categoryName: string
  brand: string
  sku: string
  price: number
  originalPrice: number
  stock: number
  sales: number
  images: string[]
  status: 'active' | 'inactive' | 'draft'
  tags: string[]
  attributes: Record<string, any>
  createTime: string
  updateTime: string
}

/**
 * 产品分类接口
 */
export interface ProductCategory {
  id: string
  name: string
  parentId: string | null
  level: number
  sort: number
  icon?: string
  children?: ProductCategory[]
}

/**
 * 产品查询参数
 */
export interface ProductListParams {
  page?: number
  pageSize?: number
  keyword?: string
  category?: string
  brand?: string
  status?: string
  minPrice?: number
  maxPrice?: number
}

/**
 * 产品分类数据
 */
const mockCategories: ProductCategory[] = [
  {
    id: 'cat_001',
    name: '电子产品',
    parentId: null,
    level: 1,
    sort: 1,
    icon: 'laptop',
    children: [
      {
        id: 'cat_001_001',
        name: '手机数码',
        parentId: 'cat_001',
        level: 2,
        sort: 1,
      },
      {
        id: 'cat_001_002',
        name: '电脑办公',
        parentId: 'cat_001',
        level: 2,
        sort: 2,
      },
      {
        id: 'cat_001_003',
        name: '家用电器',
        parentId: 'cat_001',
        level: 2,
        sort: 3,
      },
    ],
  },
  {
    id: 'cat_002',
    name: '服装配饰',
    parentId: null,
    level: 1,
    sort: 2,
    icon: 'shirt',
    children: [
      {
        id: 'cat_002_001',
        name: '男装',
        parentId: 'cat_002',
        level: 2,
        sort: 1,
      },
      {
        id: 'cat_002_002',
        name: '女装',
        parentId: 'cat_002',
        level: 2,
        sort: 2,
      },
      {
        id: 'cat_002_003',
        name: '鞋靴',
        parentId: 'cat_002',
        level: 2,
        sort: 3,
      },
    ],
  },
  {
    id: 'cat_003',
    name: '家居用品',
    parentId: null,
    level: 1,
    sort: 3,
    icon: 'home',
    children: [
      {
        id: 'cat_003_001',
        name: '家具',
        parentId: 'cat_003',
        level: 2,
        sort: 1,
      },
      {
        id: 'cat_003_002',
        name: '家纺',
        parentId: 'cat_003',
        level: 2,
        sort: 2,
      },
      {
        id: 'cat_003_003',
        name: '厨具',
        parentId: 'cat_003',
        level: 2,
        sort: 3,
      },
    ],
  },
]

/**
 * 品牌列表
 */
const mockBrands = [
  'Apple',
  'Samsung',
  'Huawei',
  'Xiaomi',
  'OPPO',
  'Vivo',
  'Nike',
  'Adidas',
  'Uniqlo',
  'Zara',
  'H&M',
  'IKEA',
  'Muji',
  'Xiaomi',
  'Haier',
  'Midea',
]

/**
 * 产品标签
 */
const mockTags = [
  '热销',
  '新品',
  '限时优惠',
  '包邮',
  '品质保证',
  '环保',
  '智能',
  '轻薄',
  '防水',
  '无线',
]

/**
 * 模拟产品数据
 */
const mockProducts: ProductInfo[] = []

// 生成模拟产品数据
for (let i = 1; i <= 100; i++) {
  const category = randomChoice(mockCategories)
  const subCategory = randomChoice(category.children || [])
  const brand = randomChoice(mockBrands)
  const originalPrice = randomNumber(100, 5000)
  const price = (originalPrice * randomNumber(70, 95)) / 100

  mockProducts.push({
    id: generateId('prod'),
    name: `${brand} ${category.name}产品 ${i}`,
    description: `这是一款优质的${category.name}产品，具有出色的性能和设计。`,
    category: subCategory?.id || category.id,
    categoryName: subCategory?.name || category.name,
    brand,
    sku: `SKU${i.toString().padStart(6, '0')}`,
    price: Math.round(price * 100) / 100,
    originalPrice: Math.round(originalPrice * 100) / 100,
    stock: randomNumber(0, 1000),
    sales: randomNumber(0, 5000),
    images: [
      `https://picsum.photos/400/400?random=${i}`,
      `https://picsum.photos/400/400?random=${i + 1000}`,
      `https://picsum.photos/400/400?random=${i + 2000}`,
    ],
    status: randomChoice(['active', 'inactive', 'draft']),
    tags: Array.from({ length: randomNumber(1, 3) }, () => randomChoice(mockTags)),
    attributes: {
      color: randomChoice(['黑色', '白色', '红色', '蓝色', '金色']),
      size: randomChoice(['S', 'M', 'L', 'XL', 'XXL']),
      material: randomChoice(['塑料', '金属', '玻璃', '陶瓷', '木材']),
      weight: `${randomNumber(100, 2000)}g`,
    },
    createTime: randomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
    updateTime: randomDate(new Date(2024, 0, 1), new Date()),
  })
}

/**
 * 获取产品列表
 * @param params 查询参数
 * @returns 产品列表
 */
export const mockGetProductList = async (
  params: ProductListParams = {},
): Promise<MockResponse<PaginationData<ProductInfo>>> => {
  await mockDelay()

  const { page = 1, pageSize = 10, keyword, category, brand, status, minPrice, maxPrice } = params

  let filteredProducts = [...mockProducts]

  // 关键词搜索
  if (keyword) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.includes(keyword) ||
        product.description.includes(keyword) ||
        product.sku.includes(keyword),
    )
  }

  // 分类筛选
  if (category) {
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  // 品牌筛选
  if (brand) {
    filteredProducts = filteredProducts.filter((product) => product.brand === brand)
  }

  // 状态筛选
  if (status) {
    filteredProducts = filteredProducts.filter((product) => product.status === status)
  }

  // 价格筛选
  if (minPrice !== undefined) {
    filteredProducts = filteredProducts.filter((product) => product.price >= minPrice)
  }

  if (maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter((product) => product.price <= maxPrice)
  }

  const paginationData = createPaginationData(filteredProducts, page, pageSize)
  const response = createSuccessResponse(paginationData, '获取产品列表成功')
  mockLog('GET', '/api/product/list', response)
  return response
}

/**
 * 获取产品详情
 * @param id 产品ID
 * @returns 产品详情
 */
export const mockGetProductDetail = async (id: string): Promise<MockResponse<ProductInfo>> => {
  await mockDelay()

  const product = mockProducts.find((p) => p.id === id)

  if (!product) {
    const response = createErrorResponse('产品不存在', 404) as unknown as MockResponse<ProductInfo>
    mockLog('GET', `/api/product/${id}`, response)
    return response
  }

  const response = createSuccessResponse(product, '获取产品详情成功')
  mockLog('GET', `/api/product/${id}`, response)
  return response
}

/**
 * 获取产品分类列表
 * @returns 分类列表
 */
export const mockGetProductCategories = async (): Promise<MockResponse<ProductCategory[]>> => {
  await mockDelay()

  const response = createSuccessResponse(mockCategories, '获取产品分类成功')
  mockLog('GET', '/api/product/categories', response)
  return response
}

/**
 * 获取品牌列表
 * @returns 品牌列表
 */
export const mockGetProductBrands = async (): Promise<MockResponse<string[]>> => {
  await mockDelay()

  const response = createSuccessResponse(mockBrands, '获取品牌列表成功')
  mockLog('GET', '/api/product/brands', response)
  return response
}

/**
 * 创建产品
 * @param productData 产品数据
 * @returns 创建结果
 */
export const mockCreateProduct = async (
  productData: Partial<ProductInfo>,
): Promise<MockResponse<ProductInfo>> => {
  await mockDelay()

  const newProduct: ProductInfo = {
    id: generateId('prod'),
    name: productData.name || '',
    description: productData.description || '',
    category: productData.category || '',
    categoryName: productData.categoryName || '',
    brand: productData.brand || '',
    sku: productData.sku || generateId('SKU'),
    price: productData.price || 0,
    originalPrice: productData.originalPrice || 0,
    stock: productData.stock || 0,
    sales: 0,
    images: productData.images || [],
    status: productData.status || 'draft',
    tags: productData.tags || [],
    attributes: productData.attributes || {},
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  }

  mockProducts.unshift(newProduct)

  const response = createSuccessResponse(newProduct, '创建产品成功')
  mockLog('POST', '/api/product', response)
  return response
}

/**
 * 更新产品
 * @param id 产品ID
 * @param productData 产品数据
 * @returns 更新结果
 */
export const mockUpdateProduct = async (
  id: string,
  productData: Partial<ProductInfo>,
): Promise<MockResponse<ProductInfo>> => {
  await mockDelay()

  const productIndex = mockProducts.findIndex((p) => p.id === id)

  if (productIndex === -1) {
    const response = createErrorResponse('产品不存在', 404) as unknown as MockResponse<ProductInfo>
    mockLog('PUT', `/api/product/${id}`, response)
    return response
  }

  const updatedProduct = {
    ...mockProducts[productIndex],
    ...productData,
    updateTime: new Date().toISOString(),
  }

  mockProducts[productIndex] = updatedProduct

  const response = createSuccessResponse(updatedProduct, '更新产品成功')
  mockLog('PUT', `/api/product/${id}`, response)
  return response
}

/**
 * 删除产品
 * @param id 产品ID
 * @returns 删除结果
 */
export const mockDeleteProduct = async (id: string): Promise<MockResponse<null>> => {
  await mockDelay()

  const productIndex = mockProducts.findIndex((p) => p.id === id)

  if (productIndex === -1) {
    const response = createErrorResponse('产品不存在', 404)
    mockLog('DELETE', `/api/product/${id}`, response)
    return response
  }

  mockProducts.splice(productIndex, 1)

  const response = createSuccessResponse(null, '删除产品成功')
  mockLog('DELETE', `/api/product/${id}`, response)
  return response
}
