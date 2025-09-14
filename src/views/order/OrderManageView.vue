<template>
  <div class="order-manage">
    <!-- 页面头部 -->
    <div class="page-header mb-6">
      <div class="flex-between">
        <div>
          <h1 class="text-title mb-2">订单管理</h1>
          <p class="text-body">管理所有订单信息，包括订单状态跟踪、发货处理和退款管理</p>
        </div>
        <a-space>
          <a-button @click="exportOrders">
            <template #icon>
              <ExportOutlined />
            </template>
            导出订单
          </a-button>
          <a-button type="primary" @click="refreshOrders">
            <template #icon>
              <ReloadOutlined />
            </template>
            刷新
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">今日订单</p>
            <p class="text-2xl font-bold text-blue-600">{{ statistics.todayOrders }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <ShoppingCartOutlined class="text-blue-600 text-xl" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-500 mr-1">↗ +12%</span>
          <span class="text-gray-500">较昨日</span>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">待处理</p>
            <p class="text-2xl font-bold text-orange-600">{{ statistics.pendingOrders }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <ClockCircleOutlined class="text-orange-600 text-xl" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-red-500 mr-1">↗ +3</span>
          <span class="text-gray-500">需要处理</span>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">今日销售额</p>
            <p class="text-2xl font-bold text-green-600">¥{{ statistics.todaySales.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarOutlined class="text-green-600 text-xl" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-500 mr-1">↗ +8%</span>
          <span class="text-gray-500">较昨日</span>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">退款申请</p>
            <p class="text-2xl font-bold text-red-600">{{ statistics.refundRequests }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <ExclamationCircleOutlined class="text-red-600 text-xl" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-red-500 mr-1">↗ +2</span>
          <span class="text-gray-500">待处理</span>
        </div>
      </div>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="card mb-6">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item label="订单号">
          <a-input
            v-model:value="searchForm.orderNo"
            placeholder="请输入订单号"
            allow-clear
            class="w-48"
          />
        </a-form-item>
        <a-form-item label="客户手机">
          <a-input
            v-model:value="searchForm.customerPhone"
            placeholder="请输入客户手机号"
            allow-clear
            class="w-48"
          />
        </a-form-item>
        <a-form-item label="订单状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            allow-clear
            class="w-32"
          >
            <a-select-option value="pending">待付款</a-select-option>
            <a-select-option value="paid">已付款</a-select-option>
            <a-select-option value="shipped">已发货</a-select-option>
            <a-select-option value="delivered">已送达</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
            <a-select-option value="cancelled">已取消</a-select-option>
            <a-select-option value="refunded">已退款</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="下单时间">
          <a-range-picker
            v-model:value="searchForm.dateRange"
            class="w-64"
          />
        </a-form-item>
        <a-form-item label="金额区间">
          <a-input-group compact class="w-48">
            <a-input-number
              v-model:value="searchForm.minAmount"
              placeholder="最低金额"
              :min="0"
              class="w-1/2"
            />
            <a-input-number
              v-model:value="searchForm.maxAmount"
              placeholder="最高金额"
              :min="0"
              class="w-1/2"
            />
          </a-input-group>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
            <a-button @click="resetSearch">
              <template #icon>
                <ReloadOutlined />
              </template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <!-- 数据表格 -->
    <div class="card">
      <div class="flex-between mb-4">
        <div class="flex items-center space-x-4">
          <a-checkbox
            v-model:checked="selectAll"
            :indeterminate="indeterminate"
            @change="handleSelectAll"
          >
            全选
          </a-checkbox>
          <a-button
            v-if="selectedRowKeys.length > 0"
            type="primary"
            @click="batchExport"
          >
            批量导出 ({{ selectedRowKeys.length }})
          </a-button>
        </div>
        <div class="text-body">
          共 {{ pagination.total }} 条记录
        </div>
      </div>

      <a-table
        :columns="columns"
        :data-source="orderList"
        :loading="loading"
        :pagination="pagination"
        :row-selection="rowSelection"
        @change="handleTableChange"
        row-key="id"
        :scroll="{ x: 1200 }"
      >
        <!-- 订单信息列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'orderInfo'">
            <div>
              <div class="font-medium text-blue-600 cursor-pointer hover:text-blue-800" @click="viewOrder(record)">
                {{ record.orderNo }}
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ record.createTime }}
              </div>
            </div>
          </template>

          <!-- 客户信息列 -->
          <template v-else-if="column.key === 'customer'">
            <div>
              <div class="font-medium">{{ record.customerName }}</div>
              <div class="text-sm text-gray-500">{{ record.customerPhone }}</div>
            </div>
          </template>

          <!-- 商品信息列 -->
          <template v-else-if="column.key === 'products'">
            <div class="max-w-xs">
              <div v-for="(product, index) in record.products.slice(0, 2)" :key="index" class="text-sm mb-1">
                {{ product.name }} × {{ product.quantity }}
              </div>
              <div v-if="record.products.length > 2" class="text-xs text-gray-400">
                等{{ record.products.length }}件商品
              </div>
            </div>
          </template>

          <!-- 金额列 -->
          <template v-else-if="column.key === 'amount'">
            <div class="text-right">
              <div class="text-lg font-semibold text-red-500">¥{{ record.totalAmount }}</div>
              <div class="text-sm text-gray-500">{{ getPaymentMethodText(record.paymentMethod) }}</div>
            </div>
          </template>

          <!-- 状态列 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewOrder(record)">
                <template #icon>
                  <EyeOutlined />
                </template>
                查看
              </a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-if="record.status === 'paid'" key="ship" @click="shipOrder(record)">
                      <CarOutlined /> 发货
                    </a-menu-item>
                    <a-menu-item v-if="record.status === 'shipped'" key="deliver" @click="deliverOrder(record)">
                      <CheckCircleOutlined /> 确认送达
                    </a-menu-item>
                    <a-menu-item v-if="['pending', 'paid'].includes(record.status)" key="cancel" @click="cancelOrder(record)">
                      <CloseCircleOutlined /> 取消订单
                    </a-menu-item>
                    <a-menu-item key="refund" @click="refundOrder(record)">
                      <RollbackOutlined /> 申请退款
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="print" @click="printOrder(record)">
                      <PrinterOutlined /> 打印订单
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button type="link" size="small">
                  <template #icon>
                    <MoreOutlined />
                  </template>
                </a-button>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 订单详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="订单详情"
      :footer="null"
      width="800px"
      :body-style="{ maxHeight: '70vh', overflow: 'auto' }"
     ok-text="确定" cancel-text="取消">
      <div v-if="currentOrder">
        <!-- 订单基本信息 -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">订单信息</h3>
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="订单号">{{ currentOrder.orderNo }}</a-descriptions-item>
            <a-descriptions-item label="订单状态">
              <a-tag :color="getStatusColor(currentOrder.status)">
                {{ getStatusText(currentOrder.status) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="下单时间">{{ currentOrder.createTime }}</a-descriptions-item>
            <a-descriptions-item label="支付方式">{{ getPaymentMethodText(currentOrder.paymentMethod) }}</a-descriptions-item>
            <a-descriptions-item label="订单金额">¥{{ currentOrder.totalAmount }}</a-descriptions-item>
            <a-descriptions-item label="实付金额">¥{{ currentOrder.paidAmount || currentOrder.totalAmount }}</a-descriptions-item>
          </a-descriptions>
        </div>

        <!-- 客户信息 -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">客户信息</h3>
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="客户姓名">{{ currentOrder.customerName }}</a-descriptions-item>
            <a-descriptions-item label="联系电话">{{ currentOrder.customerPhone }}</a-descriptions-item>
            <a-descriptions-item label="收货地址" :span="2">{{ currentOrder.shippingAddress }}</a-descriptions-item>
          </a-descriptions>
        </div>

        <!-- 商品信息 -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">商品信息</h3>
          <a-table
            :columns="productColumns"
            :data-source="currentOrder.products"
            :pagination="false"
            size="small"
            bordered
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'image'">
                <a-image
                  :width="40"
                  :height="40"
                  :src="record.image"
                  :alt="record.name"
                  class="rounded"
                />
              </template>
              <template v-else-if="column.key === 'subtotal'">
                ¥{{ (record.price * record.quantity).toFixed(2) }}
              </template>
            </template>
          </a-table>
        </div>

        <!-- 物流信息 -->
        <div v-if="currentOrder.logistics" class="mb-6">
          <h3 class="text-lg font-medium mb-4">物流信息</h3>
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="物流公司">{{ currentOrder.logistics.company }}</a-descriptions-item>
            <a-descriptions-item label="运单号">{{ currentOrder.logistics.trackingNo }}</a-descriptions-item>
            <a-descriptions-item label="发货时间">{{ currentOrder.logistics.shipTime }}</a-descriptions-item>
            <a-descriptions-item label="预计送达">{{ currentOrder.logistics.estimatedDelivery }}</a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </a-modal>

    <!-- 发货弹窗 -->
    <a-modal
      v-model:open="shipModalVisible"
      title="订单发货"
      :confirm-loading="shipModalLoading"
      @ok="handleShipModalOk"
      @cancel="shipModalVisible = false"
      ok-text="确认发货"
      cancel-text="取消"
      width="500px"
    >
      <a-form layout="vertical">
        <a-form-item label="物流公司" required>
          <a-select v-model:value="shipForm.company" placeholder="请选择物流公司">
            <a-select-option value="顺丰速运">顺丰速运</a-select-option>
            <a-select-option value="圆通速递">圆通速递</a-select-option>
            <a-select-option value="中通快递">中通快递</a-select-option>
            <a-select-option value="韵达速递">韵达速递</a-select-option>
            <a-select-option value="申通快递">申通快递</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="运单号" required>
          <a-input v-model:value="shipForm.trackingNo" placeholder="请输入运单号" />
        </a-form-item>

        <a-form-item label="备注">
          <a-textarea
            v-model:value="shipForm.remark"
            placeholder="请输入发货备注"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  EyeOutlined,
  MoreOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
  PrinterOutlined
} from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'
import {
  getOrderList,
  getOrderStats,
  shipOrder as shipOrderApi,
  deliverOrder as deliverOrderApi,
  cancelOrder as cancelOrderApi,
  exportOrders as exportOrdersApi
} from '@/api/order'

/**
 * 订单管理页面
 */

// 订单接口定义
interface OrderProduct {
  id: string
  name: string
  image: string
  price: number
  quantity: number
}

interface OrderLogistics {
  company: string
  trackingNo: string
  shipTime: string
  estimatedDelivery: string
}

interface Order {
  id: string
  orderNo: string
  customerName: string
  customerPhone: string
  shippingAddress: string
  products: OrderProduct[]
  totalAmount: number
  paidAmount?: number
  paymentMethod: 'alipay' | 'wechat' | 'bank' | 'cash'
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded'
  createTime: string
  logistics?: OrderLogistics
}

// 响应式数据
const loading = ref(false)
const detailModalVisible = ref(false)
const shipModalVisible = ref(false)
const shipModalLoading = ref(false)

// 统计数据
const statistics = reactive({
  todayOrders: 0,
  pendingOrders: 0,
  todaySales: 0,
  refundRequests: 0
})

/**
 * 加载统计数据
 */
const loadStatistics = async () => {
  try {
    const response = await getOrderStats()
    if (response.code === 200) {
      Object.assign(statistics, response.data)
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  customerPhone: '',
  status: undefined as string | undefined,
  dateRange: undefined as [string, string] | undefined,
  minAmount: undefined as number | undefined,
  maxAmount: undefined as number | undefined
})

// 订单列表数据
const orderList = ref<Order[]>([])
const currentOrder = ref<Order | null>(null)

// 选择相关
const selectedRowKeys = ref<string[]>([])
const selectAll = ref(false)
const indeterminate = ref(false)

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) =>
    `共 ${total} 条记录，当前显示 ${range[0]}-${range[1]} 条`
})

// 发货表单
const shipForm = reactive({
  company: '',
  trackingNo: '',
  remark: ''
})

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '订单信息',
    key: 'orderInfo',
    width: 180,
    fixed: 'left'
  },
  {
    title: '客户信息',
    key: 'customer',
    width: 150
  },
  {
    title: '商品信息',
    key: 'products',
    width: 200
  },
  {
    title: '订单金额',
    key: 'amount',
    width: 120,
    align: 'right'
  },
  {
    title: '收货地址',
    dataIndex: 'shippingAddress',
    key: 'shippingAddress',
    width: 200,
    ellipsis: true
  },
  {
    title: '订单状态',
    key: 'status',
    width: 100,
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    align: 'center',
    fixed: 'right'
  }
]

// 商品表格列配置
const productColumns: TableColumnsType = [
  {
    title: '商品图片',
    key: 'image',
    width: 80,
    align: 'center'
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    width: 100,
    align: 'right',
    customRender: ({ text }) => `¥${text}`
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 80,
    align: 'center'
  },
  {
    title: '小计',
    key: 'subtotal',
    width: 100,
    align: 'right'
  }
]

// 行选择配置
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
    updateSelectAllState()
  }
}

// 方法
/**
 * 更新全选状态
 */
const updateSelectAllState = () => {
  const total = orderList.value.length
  const selected = selectedRowKeys.value.length

  selectAll.value = selected === total && total > 0
  indeterminate.value = selected > 0 && selected < total
}

/**
 * 全选处理
 */
const handleSelectAll = (e: any) => {
  if (e.target.checked) {
    selectedRowKeys.value = orderList.value.map(item => item.id)
  } else {
    selectedRowKeys.value = []
  }
  updateSelectAllState()
}

/**
 * 获取状态颜色
 */
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    paid: 'blue',
    shipped: 'cyan',
    delivered: 'green',
    completed: 'success',
    cancelled: 'default',
    refunded: 'red'
  }
  return colorMap[status] || 'default'
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    delivered: '已送达',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return textMap[status] || status
}

/**
 * 获取支付方式文本
 */
const getPaymentMethodText = (method: string) => {
  const textMap: Record<string, string> = {
    alipay: '支付宝',
    wechat: '微信支付',
    bank: '银行卡',
    cash: '现金'
  }
  return textMap[method] || method
}

/**
 * 加载订单列表
 */
const loadOrderList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      orderNo: searchForm.orderNo || undefined,
      userName: searchForm.customerPhone || undefined,
      status: searchForm.status || undefined,
      startDate: searchForm.dateRange?.[0] || undefined,
      endDate: searchForm.dateRange?.[1] || undefined
    }

    const response = await getOrderList(params)
    if (response.code === 200) {
      orderList.value = response.data.list.map(item => {
        // 支付方式映射
        const paymentMethodMap: Record<string, Order['paymentMethod']> = {
          credit_card: 'bank',
          bank_transfer: 'bank',
          alipay: 'alipay',
          wechat: 'wechat',
          cash: 'cash'
        }

        return {
          id: item.id,
          orderNo: item.orderNo,
          customerName: item.userName,
          customerPhone: item.userPhone,
          shippingAddress: `${item.shippingAddress.province}${item.shippingAddress.city}${item.shippingAddress.district}${item.shippingAddress.address}`,
          products: item.items.map(orderItem => ({
            id: orderItem.id,
            name: orderItem.productName,
            image: orderItem.productImage,
            price: orderItem.price,
            quantity: orderItem.quantity
          })),
          totalAmount: item.actualAmount,
          paidAmount: item.actualAmount,
          paymentMethod: paymentMethodMap[item.paymentMethod] || 'cash',
          status: item.status,
          createTime: item.createdAt,
          logistics: item.shippedAt ? {
            company: '顺丰速运',
            trackingNo: 'SF' + item.id.slice(-8),
            shipTime: item.shippedAt,
            estimatedDelivery: item.deliveredAt || ''
          } : undefined
        }
      })
      pagination.total = response.data.total
    } else {
      message.error(response.message || '加载订单列表失败')
    }
  } catch (error) {
    message.error('加载订单列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索订单
 */
const handleSearch = () => {
  pagination.current = 1
  loadOrderList()
}

/**
 * 重置搜索
 */
const resetSearch = () => {
  Object.assign(searchForm, {
    orderNo: '',
    customerPhone: '',
    status: undefined,
    dateRange: undefined,
    minAmount: undefined,
    maxAmount: undefined
  })
  handleSearch()
}

/**
 * 表格变化处理
 */
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadOrderList()
}

/**
 * 查看订单详情
 */
const viewOrder = (record: Order) => {
  currentOrder.value = record
  detailModalVisible.value = true
}

/**
 * 发货处理
 */
const shipOrder = (record: Order) => {
  currentOrder.value = record
  Object.assign(shipForm, {
    company: '',
    trackingNo: '',
    remark: ''
  })
  shipModalVisible.value = true
}

/**
 * 发货弹窗确定
 */
const handleShipModalOk = async () => {
  if (!shipForm.company || !shipForm.trackingNo) {
    message.error('请填写完整的发货信息')
    return
  }

  try {
    shipModalLoading.value = true

    if (currentOrder.value) {
      const response = await shipOrderApi(currentOrder.value.id, shipForm.trackingNo, shipForm.company)
      if (response.code === 200) {
        currentOrder.value.status = 'shipped'
        currentOrder.value.logistics = {
          company: shipForm.company,
          trackingNo: shipForm.trackingNo,
          shipTime: new Date().toLocaleString(),
          estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()
        }

        // 更新列表中的数据
        const index = orderList.value.findIndex(order => order.id === currentOrder.value?.id)
        if (index > -1) {
          orderList.value[index] = { ...currentOrder.value }
        }

        message.success('发货成功')
        shipModalVisible.value = false
      } else {
        message.error(response.message || '发货失败')
      }
    }
  } catch (error) {
    message.error('发货失败')
  } finally {
    shipModalLoading.value = false
  }
}

/**
 * 确认送达
 */
const deliverOrder = async (record: Order) => {
  try {
    loading.value = true

    const response = await deliverOrderApi(record.id)
    if (response.code === 200) {
      record.status = 'delivered'
      message.success('确认送达成功')
    } else {
      message.error(response.message || '确认送达失败')
    }
  } catch (error) {
    message.error('确认送达失败')
  } finally {
    loading.value = false
  }
}

/**
 * 取消订单
 */
const cancelOrder = async (record: Order) => {
  try {
    loading.value = true

    const response = await cancelOrderApi(record.id, '用户取消订单')
    if (response.code === 200) {
      record.status = 'cancelled'
      message.success('取消订单成功')
    } else {
      message.error(response.message || '取消订单失败')
    }
  } catch (error) {
    message.error('取消订单失败')
  } finally {
    loading.value = false
  }
}

/**
 * 申请退款
 */
const refundOrder = (record: Order) => {
  message.info(`申请退款：${record.orderNo}`)
}

/**
 * 打印订单
 */
const printOrder = (record: Order) => {
  message.info(`打印订单：${record.orderNo}`)
}

/**
 * 刷新订单
 */
const refreshOrders = () => {
  loadOrderList()
}

/**
 * 导出订单
 */
const exportOrders = () => {
  message.success('导出功能开发中...')
}

/**
 * 批量导出
 */
const batchExport = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要导出的订单')
    return
  }
  message.success(`批量导出 ${selectedRowKeys.value.length} 个订单`)
}

// 生命周期
onMounted(() => {
  loadOrderList()
  loadStatistics()
})
</script>

<style scoped lang="less">
.order-manage {
  padding: @spacing-xxl;
}

.page-header {
  .card-style();
}

:deep(.ant-table) {
  .ant-table-thead > tr > th {
    background-color: @bg-color-light;
    font-weight: @font-weight-semibold;
  }
}

:deep(.ant-form-item) {
  margin-bottom: @spacing-lg;
}

:deep(.ant-descriptions-item-label) {
  font-weight: @font-weight-semibold;
}
</style>
