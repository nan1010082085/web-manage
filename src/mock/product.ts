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
  code: string
  name: string
  description: string
  category: string
  categoryName: string
  brand: string
  sku: string
  price: number
  originalPrice: number
  stock: number
  weight: number
  sales: number
  images: string | string[]
  status: string
  tags: string[]
  attributes: Record<string, unknown>
  createTime: string
  updateTime: string
}

/**
 * 产品分类接口
 */
export interface ProductCategory {
  id: string
  name: string
  code: string
  parentId: string | null
  level: number
  sort: number
  icon?: string
  description?: string
  status: number
  isHot: boolean
  showInHome: boolean
  productCount: number
  children?: ProductCategory[]
  createTime: string
  updateTime: string
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
export const mockCategories: ProductCategory[] = [
  {
    id: 'cat_001',
    name: '电子产品',
    code: 'electronics',
    parentId: null,
    level: 1,
    sort: 1,
    icon: 'laptop',
    description: '各类电子产品分类',
    status: 1,
    isHot: true,
    showInHome: true,
    productCount: 1250,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-15 14:30:00',
    children: [
      {
        id: 'cat_001_001',
        name: '手机数码',
        code: 'mobile',
        parentId: 'cat_001',
        level: 2,
        sort: 1,
        description: '手机及数码产品',
        status: 1,
        isHot: true,
        showInHome: true,
        productCount: 450,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-15 14:30:00',
      },
      {
        id: 'cat_001_002',
        name: '电脑办公',
        code: 'computer',
        parentId: 'cat_001',
        level: 2,
        sort: 2,
        description: '电脑及办公设备',
        status: 1,
        isHot: false,
        showInHome: true,
        productCount: 380,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-15 14:30:00',
      },
      {
        id: 'cat_001_003',
        name: '家用电器',
        code: 'appliance',
        parentId: 'cat_001',
        level: 2,
        sort: 3,
        description: '各类家用电器',
        status: 1,
        isHot: false,
        showInHome: false,
        productCount: 420,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-15 14:30:00',
      },
    ],
  },
  {
    id: 'cat_002',
    name: '服装配饰',
    code: 'clothing',
    parentId: null,
    level: 1,
    sort: 2,
    icon: 'shirt',
    description: '服装及配饰用品',
    status: 1,
    isHot: true,
    showInHome: true,
    productCount: 890,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-15 14:30:00',
    children: [
      {
        id: 'cat_002_001',
        name: '男装',
        code: 'mens_clothing',
        parentId: 'cat_002',
        level: 2,
        sort: 1,
        description: '男士服装',
        status: 1,
        isHot: false,
        showInHome: true,
        productCount: 320,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-15 14:30:00',
      },
      {
        id: 'cat_002_002',
        name: '女装',
        code: 'womens_clothing',
        parentId: 'cat_002',
        level: 2,
        sort: 2,
        description: '女士服装',
        status: 1,
        isHot: true,
        showInHome: true,
        productCount: 420,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-15 14:30:00',
      },
      {
        id: 'cat_002_003',
        name: '鞋靴',
        code: 'shoes',
        parentId: 'cat_002',
        level: 2,
        sort: 3,
        description: '各类鞋靴',
        status: 1,
        isHot: false,
        showInHome: false,
        productCount: 150,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-15 14:30:00',
      },
    ],
  },
  {
    id: 'cat_003',
    name: '家居用品',
    code: 'home',
    parentId: null,
    level: 1,
    sort: 3,
    icon: 'home',
    description: '家居生活用品',
    status: 1,
    isHot: false,
    showInHome: true,
    productCount: 650,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-15 14:30:00',
    children: [
      {
        id: 'cat_003_001',
        name: '家具',
        code: 'furniture',
        parentId: 'cat_003',
        level: 2,
        sort: 1,
        description: '各类家具',
        status: 1,
        isHot: false,
        showInHome: true,
        productCount: 280,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-15 14:30:00',
      },
      {
        id: 'cat_003_002',
        name: '家纺',
        code: 'textile',
        parentId: 'cat_003',
        level: 2,
        sort: 2,
        description: '家纺用品',
        status: 1,
        isHot: false,
        showInHome: false,
        productCount: 180,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-15 14:30:00',
      },
      {
        id: 'cat_003_003',
        name: '厨具',
        code: 'kitchenware',
        parentId: 'cat_003',
        level: 2,
        sort: 3,
        description: '厨房用具',
        status: 1,
        isHot: false,
        showInHome: false,
        productCount: 190,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-15 14:30:00',
      },
    ],
  },
]

/**
 * 品牌数据
 */
export const mockBrands = [
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
 * 标签数据
 */
export const mockTags = [
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
 * 产品数据
 */
export const mockProducts: ProductInfo[] = []

// 生成模拟产品数据
for (let i = 1; i <= 100; i++) {
  const category = randomChoice(mockCategories)
  const subCategory = randomChoice(category.children || [])
  const brand = randomChoice(mockBrands)
  const originalPrice = randomNumber(100, 5000)
  const price = (originalPrice * randomNumber(70, 95)) / 100

  mockProducts.push({
    id: generateId('prod'),
    code: `PROD${i.toString().padStart(6, '0')}`,
    name: `${brand} ${category.name}产品 ${i}`,
    description: `这是一款优质的${category.name}产品，具有出色的性能和设计。`,
    category: subCategory?.id || category.id,
    categoryName: subCategory?.name || category.name,
    brand,
    sku: `SKU${i.toString().padStart(6, '0')}`,
    price: Math.round(price * 100) / 100,
    originalPrice: Math.round(originalPrice * 100) / 100,
    stock: randomNumber(0, 1000),
    weight: randomNumber(100, 2000),
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

// Mock API functions
export const mockGetProductList = (
  params: ProductListParams = {},
): Promise<{ code: number; message: string; data: PaginationData<ProductInfo> }> => {
  let filteredProducts = [...mockProducts]

  // 关键词搜索
  if (params.keyword) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.includes(params.keyword!) || product.description.includes(params.keyword!),
    )
  }

  // 分类筛选
  if (params.category) {
    filteredProducts = filteredProducts.filter((product) => product.category === params.category)
  }

  // 品牌筛选
  if (params.brand) {
    filteredProducts = filteredProducts.filter((product) => product.brand === params.brand)
  }

  // 状态筛选
  if (params.status) {
    filteredProducts = filteredProducts.filter((product) => product.status === params.status)
  }

  // 价格筛选
  if (params.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter((product) => product.price >= params.minPrice!)
  }
  if (params.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter((product) => product.price <= params.maxPrice!)
  }

  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      list: filteredProducts.slice(start, end),
      total: filteredProducts.length,
      page,
      pageSize,
    },
  })
}

export const mockGetProductDetail = (
  productId: string,
): Promise<{ code: number; message: string; data: ProductInfo | null }> => {
  const product = mockProducts.find((p) => p.id === productId)
  return Promise.resolve({
    code: product ? 200 : 404,
    message: product ? 'success' : '产品不存在',
    data: product || null,
  })
}

export const mockCreateProduct = (
  productData: Partial<ProductInfo>,
): Promise<{ code: number; message: string; data: ProductInfo }> => {
  const newProduct: ProductInfo = {
    id: generateId('prod'),
    code: `PROD${Date.now().toString().padStart(6, '0')}`,
    name: productData.name || '新产品',
    description: productData.description || '',
    category: productData.category || 'cat_001',
    categoryName: productData.categoryName || '电子产品',
    brand: productData.brand || 'Unknown',
    sku: productData.sku || `SKU${Date.now()}`,
    price: productData.price || 0,
    originalPrice: productData.originalPrice || 0,
    stock: productData.stock || 0,
    weight: productData.weight || 0,
    sales: 0,
    images: productData.images || [],
    status: productData.status || 'draft',
    tags: productData.tags || [],
    attributes: productData.attributes || {},
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  }

  mockProducts.unshift(newProduct)

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: newProduct,
  })
}

export const mockUpdateProduct = (
  productId: string,
  productData: Partial<ProductInfo>,
): Promise<{ code: number; message: string; data: ProductInfo | null }> => {
  const index = mockProducts.findIndex((p) => p.id === productId)
  if (index === -1) {
    return Promise.resolve({
      code: 404,
      message: '产品不存在',
      data: null,
    })
  }

  const updatedProduct = {
    ...mockProducts[index],
    ...productData,
    updateTime: new Date().toISOString(),
  }

  mockProducts[index] = updatedProduct

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: updatedProduct,
  })
}

export const mockDeleteProduct = (
  productId: string,
): Promise<{ code: number; message: string; data: null }> => {
  const index = mockProducts.findIndex((p) => p.id === productId)
  if (index === -1) {
    return Promise.resolve({
      code: 404,
      message: '产品不存在',
      data: null,
    })
  }

  mockProducts.splice(index, 1)

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
  })
}

export const mockBatchDeleteProducts = (
  productIds: string[],
): Promise<{ code: number; message: string; data: null }> => {
  productIds.forEach((id) => {
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index !== -1) {
      mockProducts.splice(index, 1)
    }
  })

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
  })
}

export const mockGetProductCategories = (): Promise<{
  code: number
  message: string
  data: ProductCategory[]
}> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: mockCategories,
  })
}

export const mockGetProductBrands = (): Promise<{
  code: number
  message: string
  data: string[]
}> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: mockBrands,
  })
}

export const mockCreateProductCategory = (
  categoryData: Partial<ProductCategory>,
): Promise<{ code: number; message: string; data: ProductCategory }> => {
  const newCategory: ProductCategory = {
    id: generateId('cat'),
    name: categoryData.name || '新分类',
    code: categoryData.code || 'new_category',
    parentId: categoryData.parentId || null,
    level: categoryData.level || 1,
    sort: categoryData.sort || 0,
    icon: categoryData.icon,
    description: categoryData.description || '',
    status: categoryData.status || 1,
    isHot: categoryData.isHot || false,
    showInHome: categoryData.showInHome || false,
    productCount: 0,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  }

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: newCategory,
  })
}

export const mockUpdateProductCategory = (
  categoryId: string,
  categoryData: Partial<ProductCategory>,
): Promise<{ code: number; message: string; data: ProductCategory | null }> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      id: categoryId,
      name: categoryData.name || '分类',
      code: categoryData.code || 'category',
      parentId: categoryData.parentId || null,
      level: categoryData.level || 1,
      sort: categoryData.sort || 0,
      icon: categoryData.icon,
      description: categoryData.description || '',
      status: categoryData.status || 1,
      isHot: categoryData.isHot || false,
      showInHome: categoryData.showInHome || false,
      productCount: categoryData.productCount || 0,
      createTime: categoryData.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString(),
    },
  })
}

export const mockDeleteProductCategory = (
  categoryId: string,
): Promise<{ code: number; message: string; data: null }> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
  })
}

export const mockUploadProductImage = (
  file: File,
): Promise<{ code: number; message: string; data: { url: string } }> => {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      url: `https://picsum.photos/400/400?random=${Date.now()}`,
    },
  })
}

export const mockBatchUploadProductImages = (
  files: File[],
): Promise<{ code: number; message: string; data: { urls: string[] } }> => {
  const urls = files.map((_, index) => `https://picsum.photos/400/400?random=${Date.now() + index}`)

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: { urls },
  })
}

export const mockUpdateProductStock = (
  productId: string,
  stock: number,
): Promise<{ code: number; message: string; data: null }> => {
  const product = mockProducts.find((p) => p.id === productId)
  if (product) {
    product.stock = stock
    product.updateTime = new Date().toISOString()
  }

  return Promise.resolve({
    code: product ? 200 : 404,
    message: product ? 'success' : '产品不存在',
    data: null,
  })
}

export const mockUpdateProductStatus = (
  productId: string,
  status: 'active' | 'inactive' | 'draft',
): Promise<{ code: number; message: string; data: null }> => {
  const product = mockProducts.find((p) => p.id === productId)
  if (product) {
    product.status = status
    product.updateTime = new Date().toISOString()
  }

  return Promise.resolve({
    code: product ? 200 : 404,
    message: product ? 'success' : '产品不存在',
    data: null,
  })
}

export const mockGetProductSalesStats = (
  productId: string,
): Promise<{ code: number; message: string; data: Record<string, unknown> | null }> => {
  const product = mockProducts.find((p) => p.id === productId)
  if (!product) {
    return Promise.resolve({
      code: 404,
      message: '产品不存在',
      data: null,
    })
  }

  const stats = {
    totalSales: product.sales,
    totalRevenue: product.sales * product.price,
    dailyStats: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sales: randomNumber(0, 50),
      revenue: randomNumber(0, 5000),
    })),
  }

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: stats,
  })
}

export const mockGetHotProducts = (
  limit: number = 10,
): Promise<{ code: number; message: string; data: ProductInfo[] }> => {
  const hotProducts = mockProducts
    .filter((p) => p.status === 'active')
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit)

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: hotProducts,
  })
}

export const mockGetRecommendedProducts = (
  productId: string,
  limit: number = 10,
): Promise<{ code: number; message: string; data: ProductInfo[] }> => {
  const currentProduct = mockProducts.find((p) => p.id === productId)
  if (!currentProduct) {
    return Promise.resolve({
      code: 404,
      message: '产品不存在',
      data: [],
    })
  }

  const recommendedProducts = mockProducts
    .filter(
      (p) => p.id !== productId && p.category === currentProduct.category && p.status === 'active',
    )
    .slice(0, limit)

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: recommendedProducts,
  })
}
