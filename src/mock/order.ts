/**
 * 订单相关 mock 数据
 */

import {
  createSuccessResponse,
  createErrorResponse,
  mockDelay,
  generateRandomId,
  generateRandomNumber,
  generateRandomDate,
  randomChoice,
  type MockResponse,
  type PaginationData,
} from './index'

/**
 * 订单信息接口
 */
export interface OrderInfo {
  id: string
  orderNo: string
  userId: string
  userName: string
  userPhone: string
  userEmail: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'unpaid' | 'paid' | 'refunded' | 'partial_refund'
  paymentMethod: 'alipay' | 'wechat' | 'credit_card' | 'bank_transfer'
  totalAmount: number
  discountAmount: number
  shippingFee: number
  actualAmount: number
  items: OrderItem[]
  shippingAddress: ShippingAddress
  remark?: string
  createdAt: string
  updatedAt: string
  paidAt?: string
  shippedAt?: string
  deliveredAt?: string
}

/**
 * 订单商品项接口
 */
export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  sku: string
  price: number
  quantity: number
  totalPrice: number
}

/**
 * 收货地址接口
 */
export interface ShippingAddress {
  id: string
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  address: string
  zipCode: string
}

/**
 * 订单查询参数接口
 */
export interface OrderListParams {
  page?: number
  pageSize?: number
  status?: string
  paymentStatus?: string
  orderNo?: string
  userName?: string
  startDate?: string
  endDate?: string
}

/**
 * 订单统计接口
 */
export interface OrderStats {
  totalOrders: number
  totalAmount: number
  pendingOrders: number
  paidOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  refundedOrders: number
}

// 模拟订单状态
const orderStatuses: OrderInfo['status'][] = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]

// 模拟支付状态
const paymentStatuses: OrderInfo['paymentStatus'][] = [
  'unpaid',
  'paid',
  'refunded',
  'partial_refund',
]

// 模拟支付方式
const paymentMethods: OrderInfo['paymentMethod'][] = [
  'alipay',
  'wechat',
  'credit_card',
  'bank_transfer',
]

// 模拟用户名
const userNames = [
  '张三',
  '李四',
  '王五',
  '赵六',
  '钱七',
  '孙八',
  '周九',
  '吴十',
  '郑十一',
  '王十二',
  '冯十三',
  '陈十四',
  '褚十五',
  '卫十六',
]

// 模拟产品名称
const productNames = [
  'iPhone 15 Pro',
  'MacBook Air M2',
  'iPad Pro',
  'AirPods Pro',
  '小米13 Ultra',
  '华为P60 Pro',
  'OPPO Find X6',
  'vivo X90 Pro',
  '戴尔XPS 13',
  '联想ThinkPad X1',
  '华硕ROG游戏本',
  'Surface Pro 9',
  '索尼WH-1000XM5',
  'Bose QC45',
  '罗技MX Master 3',
  '雷蛇DeathAdder V3',
]

// 模拟省市区
const provinces = ['北京市', '上海市', '广东省', '浙江省', '江苏省', '山东省', '河南省', '四川省']
const cities = [
  '北京市',
  '上海市',
  '广州市',
  '深圳市',
  '杭州市',
  '南京市',
  '济南市',
  '郑州市',
  '成都市',
]
const districts = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区', '石景山区', '通州区', '昌平区']

/**
 * 生成模拟订单商品项
 */
function generateOrderItem(): OrderItem {
  const productName = randomChoice(productNames)
  const price = generateRandomNumber(100, 10000)
  const quantity = generateRandomNumber(1, 5)

  return {
    id: generateRandomId(),
    productId: generateRandomId(),
    productName,
    productImage: `https://picsum.photos/200/200?random=${generateRandomNumber(1, 1000)}`,
    sku: `SKU${generateRandomNumber(100000, 999999)}`,
    price,
    quantity,
    totalPrice: price * quantity,
  }
}

/**
 * 生成模拟收货地址
 */
function generateShippingAddress(): ShippingAddress {
  return {
    id: generateRandomId(),
    receiverName: randomChoice(userNames),
    receiverPhone: `1${generateRandomNumber(3, 9)}${generateRandomNumber(100000000, 999999999)}`,
    province: randomChoice(provinces),
    city: randomChoice(cities),
    district: randomChoice(districts),
    address: `${randomChoice(['建国路', '中山路', '人民路', '解放路', '和平路'])}${generateRandomNumber(1, 999)}号`,
    zipCode: `${generateRandomNumber(100000, 999999)}`,
  }
}

/**
 * 生成模拟订单数据
 */
function generateOrderInfo(): OrderInfo {
  const items = Array.from({ length: generateRandomNumber(1, 4) }, generateOrderItem)
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const discountAmount = generateRandomNumber(0, totalAmount * 0.2)
  const shippingFee = generateRandomNumber(0, 50)
  const actualAmount = totalAmount - discountAmount + shippingFee
  const status = randomChoice(orderStatuses)
  const paymentStatus = status === 'pending' ? 'unpaid' : randomChoice(paymentStatuses)
  const createdAt = generateRandomDate()

  return {
    id: generateRandomId(),
    orderNo: `ORD${Date.now()}${generateRandomNumber(1000, 9999)}`,
    userId: generateRandomId(),
    userName: randomChoice(userNames),
    userPhone: `1${generateRandomNumber(3, 9)}${generateRandomNumber(100000000, 999999999)}`,
    userEmail: `user${generateRandomNumber(1000, 9999)}@example.com`,
    status,
    paymentStatus,
    paymentMethod: randomChoice(paymentMethods),
    totalAmount,
    discountAmount,
    shippingFee,
    actualAmount,
    items,
    shippingAddress: generateShippingAddress(),
    remark: Math.random() > 0.7 ? '请尽快发货，谢谢！' : undefined,
    createdAt,
    updatedAt: createdAt,
    paidAt: status !== 'pending' ? generateRandomDate() : undefined,
    shippedAt: ['shipped', 'delivered'].includes(status) ? generateRandomDate() : undefined,
    deliveredAt: status === 'delivered' ? generateRandomDate() : undefined,
  }
}

// 生成模拟订单列表
const mockOrders: OrderInfo[] = Array.from({ length: 200 }, generateOrderInfo)

/**
 * 获取订单列表
 */
export const mockGetOrderList = async (
  params?: OrderListParams,
): Promise<MockResponse<PaginationData<OrderInfo>>> => {
  await mockDelay()

  try {
    const {
      page = 1,
      pageSize = 10,
      status,
      paymentStatus,
      orderNo,
      userName,
      startDate,
      endDate,
    } = params || {}

    let filteredOrders = [...mockOrders]

    // 状态筛选
    if (status) {
      filteredOrders = filteredOrders.filter((order) => order.status === status)
    }

    // 支付状态筛选
    if (paymentStatus) {
      filteredOrders = filteredOrders.filter((order) => order.paymentStatus === paymentStatus)
    }

    // 订单号搜索
    if (orderNo) {
      filteredOrders = filteredOrders.filter((order) =>
        order.orderNo.toLowerCase().includes(orderNo.toLowerCase()),
      )
    }

    // 用户名搜索
    if (userName) {
      filteredOrders = filteredOrders.filter((order) => order.userName.includes(userName))
    }

    // 日期范围筛选
    if (startDate) {
      filteredOrders = filteredOrders.filter((order) => order.createdAt >= startDate)
    }
    if (endDate) {
      filteredOrders = filteredOrders.filter((order) => order.createdAt <= endDate)
    }

    const total = filteredOrders.length
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const list = filteredOrders.slice(startIndex, endIndex)

    return createSuccessResponse({
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    return createErrorResponse('获取订单列表失败') as unknown as MockResponse<
      PaginationData<OrderInfo>
    >
  }
}

/**
 * 获取订单详情
 */
export const mockGetOrderDetail = async (orderId: string): Promise<MockResponse<OrderInfo>> => {
  await mockDelay()

  try {
    const order = mockOrders.find((o) => o.id === orderId)

    if (!order) {
      return createErrorResponse('订单不存在') as unknown as MockResponse<OrderInfo>
    }

    return createSuccessResponse(order)
  } catch (error) {
    return createErrorResponse('获取订单详情失败') as unknown as MockResponse<OrderInfo>
  }
}

/**
 * 更新订单状态
 */
export const mockUpdateOrderStatus = async (
  orderId: string,
  status: OrderInfo['status'],
): Promise<MockResponse<OrderInfo>> => {
  await mockDelay()

  try {
    const orderIndex = mockOrders.findIndex((o) => o.id === orderId)

    if (orderIndex === -1) {
      return createErrorResponse('订单不存在') as unknown as MockResponse<OrderInfo>
    }

    const order = mockOrders[orderIndex]
    order.status = status
    order.updatedAt = new Date().toISOString()

    // 更新相关时间戳
    if (status === 'paid' && !order.paidAt) {
      order.paidAt = new Date().toISOString()
      order.paymentStatus = 'paid'
    } else if (status === 'shipped' && !order.shippedAt) {
      order.shippedAt = new Date().toISOString()
    } else if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date().toISOString()
    } else if (status === 'cancelled') {
      order.paymentStatus = 'refunded'
    }

    mockOrders[orderIndex] = order

    return createSuccessResponse(order)
  } catch (error) {
    return createErrorResponse('更新订单状态失败') as unknown as MockResponse<OrderInfo>
  }
}

/**
 * 获取订单统计
 */
export const mockGetOrderStats = async (): Promise<MockResponse<OrderStats>> => {
  await mockDelay()

  try {
    const stats: OrderStats = {
      totalOrders: mockOrders.length,
      totalAmount: mockOrders.reduce((sum, order) => sum + order.actualAmount, 0),
      pendingOrders: mockOrders.filter((o) => o.status === 'pending').length,
      paidOrders: mockOrders.filter((o) => o.status === 'paid').length,
      shippedOrders: mockOrders.filter((o) => o.status === 'shipped').length,
      deliveredOrders: mockOrders.filter((o) => o.status === 'delivered').length,
      cancelledOrders: mockOrders.filter((o) => o.status === 'cancelled').length,
      refundedOrders: mockOrders.filter((o) => o.status === 'refunded').length,
    }

    return createSuccessResponse(stats)
  } catch (error) {
    return createErrorResponse('获取订单统计失败') as unknown as MockResponse<OrderStats>
  }
}

/**
 * 创建订单
 */
export const mockCreateOrder = async (
  orderData: Partial<OrderInfo>,
): Promise<MockResponse<OrderInfo>> => {
  await mockDelay()

  try {
    const newOrder: OrderInfo = {
      id: generateRandomId(),
      orderNo: `ORD${Date.now()}${generateRandomNumber(1000, 9999)}`,
      userId: orderData.userId || generateRandomId(),
      userName: orderData.userName || randomChoice(userNames),
      userPhone:
        orderData.userPhone ||
        `1${generateRandomNumber(3, 9)}${generateRandomNumber(100000000, 999999999)}`,
      userEmail: orderData.userEmail || `user${generateRandomNumber(1000, 9999)}@example.com`,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: orderData.paymentMethod || 'alipay',
      totalAmount: orderData.totalAmount || 0,
      discountAmount: orderData.discountAmount || 0,
      shippingFee: orderData.shippingFee || 0,
      actualAmount: orderData.actualAmount || 0,
      items: orderData.items || [],
      shippingAddress: orderData.shippingAddress || generateShippingAddress(),
      remark: orderData.remark,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockOrders.unshift(newOrder)

    return createSuccessResponse(newOrder)
  } catch (error) {
    return createErrorResponse('创建订单失败') as unknown as MockResponse<OrderInfo>
  }
}

/**
 * 删除订单
 */
export const mockDeleteOrder = async (orderId: string): Promise<MockResponse<null>> => {
  await mockDelay()

  try {
    const orderIndex = mockOrders.findIndex((o) => o.id === orderId)

    if (orderIndex === -1) {
      return createErrorResponse('订单不存在')
    }

    mockOrders.splice(orderIndex, 1)

    return createSuccessResponse(null)
  } catch (error) {
    return createErrorResponse('删除订单失败')
  }
}
