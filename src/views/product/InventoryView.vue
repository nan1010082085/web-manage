<template>
  <div class="inventory-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">库存管理</h2>
        <p class="page-description">实时监控商品库存状态，支持批量调整和预警设置</p>
      </div>
      <div class="header-actions">
        <a-button type="primary" @click="showBatchModal = true">
          <EditOutlined />
          批量调整
        </a-button>
        <a-button @click="exportInventory">
          <DownloadOutlined />
          导出库存
        </a-button>
        <a-button @click="refreshData">
          <ReloadOutlined />
          刷新
        </a-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="总商品数"
              :value="stats.totalProducts"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <ShoppingOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="库存不足"
              :value="stats.lowStock"
              :value-style="{ color: '#ff4d4f' }"
            >
              <template #prefix>
                <ExclamationCircleOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="库存充足"
              :value="stats.normalStock"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <CheckCircleOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="总库存值"
              :value="stats.totalValue"
              :precision="2"
              prefix="¥"
              :value-style="{ color: '#722ed1' }"
            >
              <template #prefix>
                <DollarOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 搜索筛选 -->
    <div class="search-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-input
            v-model:value="searchForm.keyword"
            placeholder="商品名称/SKU"
            allow-clear
            @change="handleSearch"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="searchForm.category"
            placeholder="商品分类"
            allow-clear
            @change="handleSearch"
          >
            <a-select-option value="electronics">电子产品</a-select-option>
            <a-select-option value="clothing">服装鞋帽</a-select-option>
            <a-select-option value="books">图书音像</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="searchForm.stockStatus"
            placeholder="库存状态"
            allow-clear
            @change="handleSearch"
          >
            <a-select-option value="low">库存不足</a-select-option>
            <a-select-option value="normal">库存正常</a-select-option>
            <a-select-option value="high">库存充足</a-select-option>
            <a-select-option value="out">缺货</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="searchForm.warehouse"
            placeholder="仓库"
            allow-clear
            @change="handleSearch"
          >
            <a-select-option value="main">主仓库</a-select-option>
            <a-select-option value="backup">备用仓库</a-select-option>
            <a-select-option value="transit">中转仓库</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-button type="primary" @click="handleSearch">
            <SearchOutlined />
            搜索
          </a-button>
          <a-button @click="resetSearch" style="margin-left: 8px"> 重置 </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 库存表格 -->
    <div class="table-section">
      <a-table
        :columns="columns"
        :data-source="inventoryData"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: 1400 }"
        :row-selection="rowSelection"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'product'">
            <div class="product-info">
              <a-avatar :src="record.image" size="large" shape="square" style="margin-right: 12px">
                <template #icon>
                  <PictureOutlined />
                </template>
              </a-avatar>
              <div class="product-details">
                <div class="product-name">{{ record.name }}</div>
                <div class="product-sku">SKU: {{ record.sku }}</div>
                <div class="product-category">{{ record.category }}</div>
              </div>
            </div>
          </template>

          <template v-else-if="column.key === 'stock'">
            <div class="stock-info">
              <div class="stock-number" :class="getStockStatusClass(record.stock, record.minStock)">
                {{ record.stock }}
              </div>
              <div class="stock-status">
                <a-tag :color="getStockStatusColor(record.stock, record.minStock)">
                  {{ getStockStatusText(record.stock, record.minStock) }}
                </a-tag>
              </div>
            </div>
          </template>

          <template v-else-if="column.key === 'price'">
            <div class="price-info">
              <div class="cost-price">成本: ¥{{ record.costPrice }}</div>
              <div class="sell-price">售价: ¥{{ record.sellPrice }}</div>
            </div>
          </template>

          <template v-else-if="column.key === 'value'">
            <span class="stock-value">¥{{ (record.stock * record.costPrice).toFixed(2) }}</span>
          </template>

          <template v-else-if="column.key === 'lastUpdate'">
            <div class="update-info">
              <div>{{ record.lastUpdate }}</div>
              <div class="update-type">{{ record.updateType }}</div>
            </div>
          </template>

          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleAdjust(record)"> 调整库存 </a-button>
              <a-button type="link" size="small" @click="handleViewHistory(record)">
                变更记录
              </a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="({ key }: { key: string }) => handleMenuAction(key, record)">
                    <a-menu-item key="setAlert">设置预警</a-menu-item>
                    <a-menu-item key="transfer">库存调拨</a-menu-item>
                    <a-menu-item key="freeze">冻结库存</a-menu-item>
                  </a-menu>
                </template>
                <a-button type="link" size="small">
                  更多
                  <DownOutlined />
                </a-button>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 库存调整弹窗 -->
    <a-modal
      v-model:open="showAdjustModal"
      title="库存调整"
      width="600px"
      @ok="handleAdjustSubmit"
      @cancel="handleAdjustCancel"
     ok-text="确定" cancel-text="取消">
      <a-form ref="adjustFormRef" :model="adjustForm" :rules="adjustRules" layout="vertical">
        <div class="adjust-product-info">
          <a-avatar :src="adjustingProduct?.image" size="large" shape="square" />
          <div class="product-details">
            <h4>{{ adjustingProduct?.name }}</h4>
            <p>SKU: {{ adjustingProduct?.sku }}</p>
            <p>
              当前库存: <span class="current-stock">{{ adjustingProduct?.stock }}</span>
            </p>
          </div>
        </div>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="调整类型" name="type">
              <a-select v-model:value="adjustForm.type" placeholder="请选择调整类型">
                <a-select-option value="in">入库</a-select-option>
                <a-select-option value="out">出库</a-select-option>
                <a-select-option value="set">设置库存</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="调整数量" name="quantity">
              <a-input-number
                v-model:value="adjustForm.quantity"
                :min="adjustForm.type === 'out' ? -(adjustingProduct?.stock || 0) : 1"
                :max="adjustForm.type === 'set' ? 999999 : 999999"
                placeholder="请输入数量"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="调整原因" name="reason">
          <a-select v-model:value="adjustForm.reason" placeholder="请选择调整原因">
            <a-select-option value="purchase">采购入库</a-select-option>
            <a-select-option value="return">退货入库</a-select-option>
            <a-select-option value="sale">销售出库</a-select-option>
            <a-select-option value="damage">损坏出库</a-select-option>
            <a-select-option value="transfer">调拨</a-select-option>
            <a-select-option value="inventory">盘点调整</a-select-option>
            <a-select-option value="other">其他</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="adjustForm.remark" :rows="3" placeholder="请输入调整备注" />
        </a-form-item>

        <div class="adjust-preview">
          <a-alert :message="getAdjustPreviewText()" type="info" show-icon />
        </div>
      </a-form>
    </a-modal>

    <!-- 批量调整弹窗 -->
    <a-modal
      v-model:open="showBatchModal"
      title="批量库存调整"
      width="800px"
      @ok="handleBatchSubmit"
      @cancel="showBatchModal = false"
     ok-text="确定" cancel-text="取消">
      <div class="batch-info">
        <a-alert
          :message="`已选择 ${selectedRowKeys.length} 个商品进行批量调整`"
          type="info"
          show-icon
          style="margin-bottom: 16px"
        />
      </div>

      <a-form ref="batchFormRef" :model="batchForm" :rules="batchRules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="调整类型" name="type">
              <a-select v-model:value="batchForm.type" placeholder="请选择调整类型">
                <a-select-option value="in">统一入库</a-select-option>
                <a-select-option value="out">统一出库</a-select-option>
                <a-select-option value="percent">按比例调整</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="调整值" name="value">
              <a-input-number
                v-model:value="batchForm.value"
                :min="1"
                :formatter="
                  (value: number | string) => (batchForm.type === 'percent' ? `${value}%` : value)
                "
                :parser="(value: string) => value.replace('%', '')"
                placeholder="请输入调整值"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="调整原因" name="reason">
              <a-select v-model:value="batchForm.reason" placeholder="请选择原因">
                <a-select-option value="inventory">盘点调整</a-select-option>
                <a-select-option value="promotion">促销活动</a-select-option>
                <a-select-option value="season">季节调整</a-select-option>
                <a-select-option value="other">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="batchForm.remark" :rows="3" placeholder="请输入批量调整备注" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 变更记录弹窗 -->
    <a-modal v-model:open="showHistoryModal" title="库存变更记录" width="900px" :footer="null" ok-text="确定" cancel-text="取消">
      <a-table
        :columns="historyColumns"
        :data-source="historyData"
        :loading="historyLoading"
        :pagination="{ pageSize: 10 }"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag :color="getChangeTypeColor(record.type)">
              {{ getChangeTypeText(record.type) }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'change'">
            <span :class="record.change > 0 ? 'positive-change' : 'negative-change'">
              {{ record.change > 0 ? '+' : '' }}{{ record.change }}
            </span>
          </template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  EditOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  ShoppingOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  PictureOutlined,
  DownOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, FormInstance, TableProps } from 'ant-design-vue'
import { debounce } from 'lodash-es'

/**
 * 库存管理页面
 */

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  image?: string
  stock: number
  minStock: number
  maxStock: number
  costPrice: number
  sellPrice: number
  warehouse: string
  lastUpdate: string
  updateType: string
}

interface SearchForm {
  keyword: string
  category?: string
  stockStatus?: string
  warehouse?: string
}

interface AdjustForm {
  type: string
  quantity: number
  reason: string
  remark: string
}

interface BatchForm {
  type: string
  value: number
  reason: string
  remark: string
}

interface HistoryRecord {
  id: string
  type: string
  change: number
  beforeStock: number
  afterStock: number
  reason: string
  operator: string
  createTime: string
  remark?: string
}

interface Stats {
  totalProducts: number
  lowStock: number
  normalStock: number
  totalValue: number
}

// 响应式数据
const loading = ref(false)
const historyLoading = ref(false)
const showAdjustModal = ref(false)
const showBatchModal = ref(false)
const showHistoryModal = ref(false)
const inventoryData = ref<InventoryItem[]>([])
const historyData = ref<HistoryRecord[]>([])
const adjustingProduct = ref<InventoryItem | null>(null)
const selectedRowKeys = ref<string[]>([])
const adjustFormRef = ref<FormInstance>()
const batchFormRef = ref<FormInstance>()

// 统计数据
const stats = ref<Stats>({
  totalProducts: 0,
  lowStock: 0,
  normalStock: 0,
  totalValue: 0,
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 搜索表单
const searchForm = reactive<SearchForm>({
  keyword: '',
  category: undefined,
  stockStatus: undefined,
  warehouse: undefined,
})

// 调整表单
const adjustForm = reactive<AdjustForm>({
  type: '',
  quantity: 0,
  reason: '',
  remark: '',
})

// 批量调整表单
const batchForm = reactive<BatchForm>({
  type: '',
  value: 0,
  reason: '',
  remark: '',
})

// 表单验证规则
const adjustRules = {
  type: [{ required: true, message: '请选择调整类型', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入调整数量', trigger: 'blur' }],
  reason: [{ required: true, message: '请选择调整原因', trigger: 'change' }],
}

const batchRules = {
  type: [{ required: true, message: '请选择调整类型', trigger: 'change' }],
  value: [{ required: true, message: '请输入调整值', trigger: 'blur' }],
  reason: [{ required: true, message: '请选择调整原因', trigger: 'change' }],
}

// 行选择配置
const rowSelection: TableProps['rowSelection'] = {
  selectedRowKeys: selectedRowKeys as any,
  onChange: (keys: (string | number)[]) => {
    selectedRowKeys.value = keys as string[]
  },
  onSelect: (record: InventoryItem, selected: boolean) => {
    console.log(`${record.name} ${selected ? '选中' : '取消选中'}`)
  },
  onSelectAll: (selected: boolean, selectedRows: InventoryItem[], changeRows: InventoryItem[]) => {
    console.log(`${selected ? '全选' : '取消全选'}, 变更行数: ${changeRows.length}`)
  },
}

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '商品信息',
    key: 'product',
    width: 300,
    fixed: 'left',
  },
  {
    title: '当前库存',
    key: 'stock',
    width: 120,
    sorter: true,
  },
  {
    title: '最小库存',
    dataIndex: 'minStock',
    key: 'minStock',
    width: 100,
  },
  {
    title: '最大库存',
    dataIndex: 'maxStock',
    key: 'maxStock',
    width: 100,
  },
  {
    title: '价格信息',
    key: 'price',
    width: 150,
  },
  {
    title: '库存价值',
    key: 'value',
    width: 120,
    sorter: true,
  },
  {
    title: '仓库',
    dataIndex: 'warehouse',
    key: 'warehouse',
    width: 100,
  },
  {
    title: '最后更新',
    key: 'lastUpdate',
    width: 160,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
]

// 历史记录表格列
const historyColumns: TableColumnsType = [
  {
    title: '变更类型',
    key: 'type',
    width: 100,
  },
  {
    title: '变更数量',
    key: 'change',
    width: 100,
  },
  {
    title: '变更前',
    dataIndex: 'beforeStock',
    key: 'beforeStock',
    width: 80,
  },
  {
    title: '变更后',
    dataIndex: 'afterStock',
    key: 'afterStock',
    width: 80,
  },
  {
    title: '变更原因',
    dataIndex: 'reason',
    key: 'reason',
    width: 120,
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
    width: 100,
  },
  {
    title: '变更时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true,
  },
]

/**
 * 获取库存状态样式类
 */
const getStockStatusClass = (stock: number, minStock: number): string => {
  if (stock === 0) return 'out-of-stock'
  if (stock <= minStock) return 'low-stock'
  return 'normal-stock'
}

/**
 * 获取库存状态颜色
 */
const getStockStatusColor = (stock: number, minStock: number): string => {
  if (stock === 0) return 'red'
  if (stock <= minStock) return 'orange'
  return 'green'
}

/**
 * 获取库存状态文本
 */
const getStockStatusText = (stock: number, minStock: number): string => {
  if (stock === 0) return '缺货'
  if (stock <= minStock) return '库存不足'
  return '库存正常'
}

/**
 * 获取变更类型颜色
 */
const getChangeTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    in: 'green',
    out: 'red',
    transfer: 'blue',
    adjust: 'orange',
  }
  return colorMap[type] || 'default'
}

/**
 * 获取变更类型文本
 */
const getChangeTypeText = (type: string): string => {
  const textMap: Record<string, string> = {
    in: '入库',
    out: '出库',
    transfer: '调拨',
    adjust: '调整',
  }
  return textMap[type] || type
}

/**
 * 获取调整预览文本
 */
const getAdjustPreviewText = (): string => {
  if (!adjustingProduct.value || !adjustForm.type || !adjustForm.quantity) {
    return '请完善调整信息'
  }

  const current = adjustingProduct.value.stock
  let result = 0

  switch (adjustForm.type) {
    case 'in':
      result = current + adjustForm.quantity
      return `库存将从 ${current} 增加到 ${result}`
    case 'out':
      result = current - adjustForm.quantity
      return `库存将从 ${current} 减少到 ${result}`
    case 'set':
      return `库存将从 ${current} 设置为 ${adjustForm.quantity}`
    default:
      return '请选择调整类型'
  }
}

/**
 * 加载库存数据
 */
const loadInventoryData = async (): Promise<void> => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟数据
    const mockData: InventoryItem[] = [
      {
        id: '1',
        name: 'iPhone 15 Pro Max',
        sku: 'IP15PM001',
        category: '手机通讯',
        image: '',
        stock: 45,
        minStock: 20,
        maxStock: 200,
        costPrice: 8000,
        sellPrice: 9999,
        warehouse: '主仓库',
        lastUpdate: '2024-01-15 14:30:00',
        updateType: '销售出库',
      },
      {
        id: '2',
        name: 'MacBook Pro 16"',
        sku: 'MBP16001',
        category: '电脑办公',
        stock: 8,
        minStock: 10,
        maxStock: 50,
        costPrice: 15000,
        sellPrice: 18999,
        warehouse: '主仓库',
        lastUpdate: '2024-01-15 10:20:00',
        updateType: '采购入库',
      },
      {
        id: '3',
        name: 'AirPods Pro 2',
        sku: 'APP2001',
        category: '数码配件',
        stock: 0,
        minStock: 15,
        maxStock: 100,
        costPrice: 1200,
        sellPrice: 1899,
        warehouse: '主仓库',
        lastUpdate: '2024-01-14 16:45:00',
        updateType: '销售出库',
      },
    ]

    inventoryData.value = mockData
    pagination.total = mockData.length

    // 计算统计数据
    stats.value = {
      totalProducts: mockData.length,
      lowStock: mockData.filter((item) => item.stock <= item.minStock).length,
      normalStock: mockData.filter((item) => item.stock > item.minStock).length,
      totalValue: mockData.reduce((sum, item) => sum + item.stock * item.costPrice, 0),
    }
  } catch (error) {
    message.error('加载库存数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索处理
 */
const handleSearch = debounce((): void => {
  pagination.current = 1
  loadInventoryData()
}, 300)

/**
 * 重置搜索
 */
const resetSearch = (): void => {
  Object.assign(searchForm, {
    keyword: '',
    category: undefined,
    stockStatus: undefined,
    warehouse: undefined,
  })
  handleSearch()
}

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 20
  loadInventoryData()
}

/**
 * 刷新数据
 */
const refreshData = (): void => {
  loadInventoryData()
}

/**
 * 导出库存
 */
const exportInventory = (): void => {
  message.success('导出功能开发中')
}

/**
 * 处理库存调整
 */
const handleAdjust = (record: InventoryItem): void => {
  adjustingProduct.value = record
  Object.assign(adjustForm, {
    type: '',
    quantity: 0,
    reason: '',
    remark: '',
  })
  showAdjustModal.value = true
}

/**
 * 处理调整提交
 */
const handleAdjustSubmit = async (): Promise<void> => {
  try {
    await adjustFormRef.value?.validate()

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    message.success('库存调整成功')
    showAdjustModal.value = false
    loadInventoryData()
  } catch (error) {
    console.error('调整失败:', error)
  }
}

/**
 * 处理调整取消
 */
const handleAdjustCancel = (): void => {
  showAdjustModal.value = false
  adjustingProduct.value = null
  adjustFormRef.value?.resetFields()
}

/**
 * 处理批量提交
 */
const handleBatchSubmit = async (): Promise<void> => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要调整的商品')
    return
  }

  try {
    await batchFormRef.value?.validate()

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    message.success(`成功调整 ${selectedRowKeys.value.length} 个商品的库存`)
    showBatchModal.value = false
    selectedRowKeys.value = []
    loadInventoryData()
  } catch (error) {
    console.error('批量调整失败:', error)
  }
}

/**
 * 查看变更记录
 */
const handleViewHistory = async (record: InventoryItem): Promise<void> => {
  showHistoryModal.value = true
  historyLoading.value = true

  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟历史数据
    historyData.value = [
      {
        id: '1',
        type: 'out',
        change: -5,
        beforeStock: 50,
        afterStock: 45,
        reason: '销售出库',
        operator: '张三',
        createTime: '2024-01-15 14:30:00',
        remark: '订单号: ORD20240115001',
      },
      {
        id: '2',
        type: 'in',
        change: 20,
        beforeStock: 30,
        afterStock: 50,
        reason: '采购入库',
        operator: '李四',
        createTime: '2024-01-15 09:15:00',
        remark: '采购单号: PUR20240115001',
      },
    ]
  } catch (error) {
    message.error('加载变更记录失败')
  } finally {
    historyLoading.value = false
  }
}

/**
 * 处理菜单操作
 */
const handleMenuAction = (key: string, record: InventoryItem): void => {
  switch (key) {
    case 'setAlert':
      message.info('设置预警功能开发中')
      break
    case 'transfer':
      message.info('库存调拨功能开发中')
      break
    case 'freeze':
      message.info('冻结库存功能开发中')
      break
  }
}

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  loadInventoryData()
})
</script>

<style scoped lang="less">
.inventory-view {
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 64px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  .page-title {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #262626;
  }

  .page-description {
    margin: 0;
    color: #8c8c8c;
    font-size: 14px;
  }
}

.header-actions {
  display: flex;
  gap: 8px;
}

.stats-section {
  margin-bottom: 24px;

  .stat-card {
    text-align: center;

    :deep(.ant-statistic-title) {
      font-size: 14px;
      color: #8c8c8c;
    }

    :deep(.ant-statistic-content) {
      font-size: 24px;
      font-weight: 600;
    }
  }
}

.search-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.table-section {
  .product-info {
    display: flex;
    align-items: center;

    .product-details {
      .product-name {
        font-weight: 500;
        color: #262626;
        margin-bottom: 4px;
      }

      .product-sku {
        font-size: 12px;
        color: #8c8c8c;
        margin-bottom: 2px;
      }

      .product-category {
        font-size: 12px;
        color: #1890ff;
      }
    }
  }

  .stock-info {
    text-align: center;

    .stock-number {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;

      &.out-of-stock {
        color: #ff4d4f;
      }

      &.low-stock {
        color: #fa8c16;
      }

      &.normal-stock {
        color: #52c41a;
      }
    }
  }

  .price-info {
    .cost-price {
      font-size: 12px;
      color: #8c8c8c;
      margin-bottom: 2px;
    }

    .sell-price {
      font-size: 14px;
      color: #262626;
      font-weight: 500;
    }
  }

  .stock-value {
    font-weight: 500;
    color: #722ed1;
  }

  .update-info {
    .update-type {
      font-size: 12px;
      color: #8c8c8c;
      margin-top: 2px;
    }
  }
}

.adjust-product-info {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  margin-bottom: 16px;

  .product-details {
    margin-left: 12px;

    h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      color: #262626;
    }

    p {
      margin: 0 0 2px 0;
      font-size: 12px;
      color: #8c8c8c;
    }

    .current-stock {
      font-weight: 600;
      color: #1890ff;
    }
  }
}

.adjust-preview {
  margin-top: 16px;
}

.batch-info {
  margin-bottom: 16px;
}

.positive-change {
  color: #52c41a;
  font-weight: 500;
}

.negative-change {
  color: #ff4d4f;
  font-weight: 500;
}

// 响应式设计
@media (max-width: 768px) {
  .inventory-view {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .stats-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }

  .search-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
}
</style>
