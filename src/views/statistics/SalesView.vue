<template>
  <div class="sales-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">销售统计</h2>
        <p class="page-description">实时监控销售数据，分析销售趋势和业绩表现</p>
      </div>
      <div class="header-actions">
        <a-range-picker
          v-model:value="dateRange"
          :presets="datePresets"
          @change="handleDateChange"
        />
        <a-button @click="exportReport">
          <DownloadOutlined />
          导出报表
        </a-button>
        <a-button @click="refreshData">
          <ReloadOutlined />
          刷新
        </a-button>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <div class="metrics-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="metric-card">
            <a-statistic
              title="总销售额"
              :value="metrics.totalSales"
              :precision="2"
              prefix="¥"
              :value-style="{ color: '#1890ff' }"
            >
              <template #suffix>
                <span class="metric-trend" :class="metrics.salesTrend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="metrics.salesTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(metrics.salesTrend) }}%
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="metric-card">
            <a-statistic
              title="订单数量"
              :value="metrics.totalOrders"
              :value-style="{ color: '#52c41a' }"
            >
              <template #suffix>
                <span class="metric-trend" :class="metrics.ordersTrend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="metrics.ordersTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(metrics.ordersTrend) }}%
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="metric-card">
            <a-statistic
              title="客单价"
              :value="metrics.avgOrderValue"
              :precision="2"
              prefix="¥"
              :value-style="{ color: '#722ed1' }"
            >
              <template #suffix>
                <span class="metric-trend" :class="metrics.aovTrend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="metrics.aovTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(metrics.aovTrend) }}%
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="metric-card">
            <a-statistic
              title="转化率"
              :value="metrics.conversionRate"
              :precision="2"
              suffix="%"
              :value-style="{ color: '#fa8c16' }"
            >
              <template #suffix>
                <span class="metric-trend" :class="metrics.conversionTrend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="metrics.conversionTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(metrics.conversionTrend) }}%
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <a-row :gutter="16">
        <!-- 销售趋势图 -->
        <a-col :span="16">
          <a-card title="销售趋势" class="chart-card">
            <template #extra>
              <a-radio-group v-model:value="trendPeriod" @change="handleTrendPeriodChange">
                <a-radio-button value="day">日</a-radio-button>
                <a-radio-button value="week">周</a-radio-button>
                <a-radio-button value="month">月</a-radio-button>
              </a-radio-group>
            </template>
            <HighChart :options="salesChartConfigs.trendChart" height="300px" />
          </a-card>
        </a-col>
        
        <!-- 销售渠道分布 -->
        <a-col :span="8">
          <a-card title="销售渠道" class="chart-card">
            <HighChart :options="salesChartConfigs.channelChart" height="300px" />
          </a-card>
        </a-col>
      </a-row>
      
      <a-row :gutter="16" style="margin-top: 16px">
        <!-- 商品销售排行 -->
        <a-col :span="12">
          <a-card title="商品销售排行" class="chart-card">
            <template #extra>
              <a-select v-model:value="rankingType" @change="handleRankingTypeChange" style="width: 120px">
                <a-select-option value="sales">销售额</a-select-option>
                <a-select-option value="quantity">销量</a-select-option>
                <a-select-option value="profit">利润</a-select-option>
              </a-select>
            </template>
            <HighChart :options="salesChartConfigs.rankingChart" height="300px" />
          </a-card>
        </a-col>
        
        <!-- 地区销售分布 -->
        <a-col :span="12">
          <a-card title="地区销售分布" class="chart-card">
            <HighChart :options="salesChartConfigs.regionChart" height="300px" />
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 详细数据表格 -->
    <div class="table-section">
      <a-card title="销售明细">
        <template #extra>
          <a-space>
            <a-input
              v-model:value="searchKeyword"
              placeholder="搜索商品名称"
              allow-clear
              @change="handleSearch"
              style="width: 200px"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
            <a-select
              v-model:value="categoryFilter"
              placeholder="商品分类"
              allow-clear
              @change="handleSearch"
              style="width: 120px"
            >
              <a-select-option value="electronics">电子产品</a-select-option>
              <a-select-option value="clothing">服装鞋帽</a-select-option>
              <a-select-option value="books">图书音像</a-select-option>
            </a-select>
          </a-space>
        </template>
        
        <a-table
          :columns="tableColumns"
          :data-source="salesData"
          :loading="tableLoading"
          :pagination="pagination"
          :scroll="{ x: 1200 }"
          @change="handleTableChange"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'product'">
              <div class="product-info">
                <a-avatar 
                  :src="record.image" 
                  size="small" 
                  shape="square"
                  style="margin-right: 8px"
                >
                  <template #icon>
                    <PictureOutlined />
                  </template>
                </a-avatar>
                <div class="product-details">
                  <div class="product-name">{{ record.productName }}</div>
                  <div class="product-sku">{{ record.sku }}</div>
                </div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'sales'">
              <span class="sales-amount">¥{{ record.salesAmount.toFixed(2) }}</span>
            </template>
            
            <template v-else-if="column.key === 'profit'">
              <span class="profit-amount" :class="record.profit > 0 ? 'positive' : 'negative'">
                ¥{{ record.profit.toFixed(2) }}
              </span>
            </template>
            
            <template v-else-if="column.key === 'trend'">
              <div class="trend-indicator">
                <ArrowUpOutlined v-if="record.trend > 0" class="trend-up" />
                <ArrowDownOutlined v-else-if="record.trend < 0" class="trend-down" />
                <MinusOutlined v-else class="trend-flat" />
                <span :class="{
                  'trend-up': record.trend > 0,
                  'trend-down': record.trend < 0,
                  'trend-flat': record.trend === 0
                }">
                  {{ Math.abs(record.trend) }}%
                </span>
              </div>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import {
  DownloadOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SearchOutlined,
  PictureOutlined,
  MinusOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, TableProps } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import dayjs, { type Dayjs } from 'dayjs'
import HighChart from '@/components/common/HighChart.vue'
import { salesChartConfigs } from '@/config/charts/chartConfigs'

/**
 * 销售统计页面
 */

interface SalesMetrics {
  totalSales: number
  totalOrders: number
  avgOrderValue: number
  conversionRate: number
  salesTrend: number
  ordersTrend: number
  aovTrend: number
  conversionTrend: number
}

interface SalesItem {
  id: string
  productName: string
  sku: string
  image?: string
  category: string
  salesAmount: number
  quantity: number
  profit: number
  trend: number
  channel: string
  region: string
}

// 响应式数据
const tableLoading = ref(false)
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(30, 'day'), dayjs()])
const trendPeriod = ref('day')
const rankingType = ref('sales')
const searchKeyword = ref('')
const categoryFilter = ref<string | undefined>(undefined)
const salesData = ref<SalesItem[]>([])

// 图表引用已移除，使用 HighChart 组件

// 核心指标
const metrics = ref<SalesMetrics>({
  totalSales: 0,
  totalOrders: 0,
  avgOrderValue: 0,
  conversionRate: 0,
  salesTrend: 0,
  ordersTrend: 0,
  aovTrend: 0,
  conversionTrend: 0,
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

// 日期预设
const datePresets = [
  { label: '今天', value: [dayjs(), dayjs()] },
  { label: '昨天', value: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')] },
  { label: '最近7天', value: [dayjs().subtract(7, 'day'), dayjs()] },
  { label: '最近30天', value: [dayjs().subtract(30, 'day'), dayjs()] },
  { label: '本月', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
  { label: '上月', value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] },
]

// 表格列配置
const tableColumns: TableColumnsType = [
  {
    title: '商品信息',
    key: 'product',
    width: 250,
    fixed: 'left',
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: 100,
  },
  {
    title: '销售额',
    key: 'sales',
    width: 120,
    sorter: true,
  },
  {
    title: '销量',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 80,
    sorter: true,
  },
  {
    title: '利润',
    key: 'profit',
    width: 120,
    sorter: true,
  },
  {
    title: '趋势',
    key: 'trend',
    width: 100,
  },
  {
    title: '渠道',
    dataIndex: 'channel',
    key: 'channel',
    width: 100,
  },
  {
    title: '地区',
    dataIndex: 'region',
    key: 'region',
    width: 100,
  },
]

/**
 * 加载销售数据
 */
const loadSalesData = async (): Promise<void> => {
  tableLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟核心指标数据
    metrics.value = {
      totalSales: 1234567.89,
      totalOrders: 2345,
      avgOrderValue: 526.32,
      conversionRate: 3.45,
      salesTrend: 12.5,
      ordersTrend: 8.3,
      aovTrend: -2.1,
      conversionTrend: 5.7,
    }
    
    // 模拟销售明细数据
    const mockData: SalesItem[] = [
      {
        id: '1',
        productName: 'iPhone 15 Pro Max',
        sku: 'IP15PM001',
        category: '电子产品',
        salesAmount: 89991.00,
        quantity: 9,
        profit: 8999.10,
        trend: 15.2,
        channel: '线上',
        region: '华东',
      },
      {
        id: '2',
        productName: 'MacBook Pro 16"',
        sku: 'MBP16001',
        category: '电子产品',
        salesAmount: 75996.00,
        quantity: 4,
        profit: 7599.60,
        trend: -5.3,
        channel: '线下',
        region: '华北',
      },
      {
        id: '3',
        productName: 'AirPods Pro 2',
        sku: 'APP2001',
        category: '数码配件',
        salesAmount: 37980.00,
        quantity: 20,
        profit: 3798.00,
        trend: 23.7,
        channel: '线上',
        region: '华南',
      },
    ]
    
    salesData.value = mockData
    pagination.total = mockData.length
    
    // 图表已通过HighChart组件自动渲染
  } catch (__error) {
    message.error('加载销售数据失败')
  } finally {
    tableLoading.value = false
  }
}

/**
 * 渲染图表
 */
const renderCharts = (): void => {
  // 图表已通过 HighChart 组件渲染，无需手动处理
}

/**
 * 处理日期变化
 */
const handleDateChange = (dates: [Dayjs, Dayjs] | null): void => {
  if (dates) {
    dateRange.value = dates
    loadSalesData()
  }
}

/**
 * 处理趋势周期变化
 */
const handleTrendPeriodChange = (): void => {
  // 图表会自动响应数据变化
}

/**
 * 处理排行类型变化
 */
const handleRankingTypeChange = (): void => {
  // 图表会自动响应数据变化
}

/**
 * 搜索处理
 */
const handleSearch = debounce((): void => {
  pagination.current = 1
  loadSalesData()
}, 300)

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 20
  loadSalesData()
}

/**
 * 刷新数据
 */
const refreshData = (): void => {
  loadSalesData()
}

/**
 * 导出报表
 */
const exportReport = (): void => {
  message.success('导出功能开发中')
}

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  loadSalesData()
})
</script>

<style scoped lang="less">
.sales-view {
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
  align-items: center;
}

.metrics-section {
  margin-bottom: 24px;
  
  .metric-card {
    text-align: center;
    
    :deep(.ant-statistic-title) {
      font-size: 14px;
      color: #8c8c8c;
      margin-bottom: 8px;
    }
    
    :deep(.ant-statistic-content) {
      display: flex;
      align-items: center;
      justify-content: center;
      
      .ant-statistic-content-value {
        font-size: 24px;
        font-weight: 600;
      }
    }
    
    .metric-trend {
      font-size: 12px;
      margin-left: 8px;
      
      &.positive {
        color: #52c41a;
      }
      
      &.negative {
        color: #ff4d4f;
      }
    }
  }
}

.charts-section {
  margin-bottom: 24px;
  
  .chart-card {
    .chart-container {
      height: 300px;
    }
  }
}

.table-section {
  .product-info {
    display: flex;
    align-items: center;
    
    .product-details {
      .product-name {
        font-weight: 500;
        color: #262626;
        margin-bottom: 2px;
      }
      
      .product-sku {
        font-size: 12px;
        color: #8c8c8c;
      }
    }
  }
  
  .sales-amount {
    font-weight: 600;
    color: #1890ff;
  }
  
  .profit-amount {
    font-weight: 500;
    
    &.positive {
      color: #52c41a;
    }
    
    &.negative {
      color: #ff4d4f;
    }
  }
  
  .trend-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    
    .trend-up {
      color: #52c41a;
    }
    
    .trend-down {
      color: #ff4d4f;
    }
    
    .trend-flat {
      color: #8c8c8c;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sales-view {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  
  .metrics-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
  
  .charts-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
}
</style>