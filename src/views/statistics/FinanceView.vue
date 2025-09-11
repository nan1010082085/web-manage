<template>
  <div class="finance-stats-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">财务统计</h2>
        <p class="page-description">分析收入支出数据，掌握财务状况和趋势</p>
      </div>
      <div class="header-actions">
        <a-range-picker
          v-model:value="dateRange"
          :presets="datePresets"
          @change="handleDateChange"
        />
        <a-select
          v-model:value="reportType"
          @change="handleReportTypeChange"
          style="width: 120px"
        >
          <a-select-option value="revenue">收入</a-select-option>
          <a-select-option value="expense">支出</a-select-option>
          <a-select-option value="profit">利润</a-select-option>
          <a-select-option value="all">全部</a-select-option>
        </a-select>
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

    <!-- 财务概览指标 -->
    <div class="overview-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="总收入"
              :value="overview.totalRevenue"
              :precision="2"
              prefix="¥"
              :value-style="{ color: '#52c41a' }"
            >
              <template #suffix>
                <span class="trend-indicator" :class="overview.revenueTrend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="overview.revenueTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(overview.revenueTrend) }}%
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="总支出"
              :value="overview.totalExpense"
              :precision="2"
              prefix="¥"
              :value-style="{ color: '#ff4d4f' }"
            >
              <template #suffix>
                <span class="trend-indicator" :class="overview.expenseTrend > 0 ? 'negative' : 'positive'">
                  <ArrowUpOutlined v-if="overview.expenseTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(overview.expenseTrend) }}%
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="净利润"
              :value="overview.netProfit"
              :precision="2"
              prefix="¥"
              :value-style="{ color: overview.netProfit >= 0 ? '#1890ff' : '#ff4d4f' }"
            >
              <template #suffix>
                <span class="trend-indicator" :class="overview.profitTrend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="overview.profitTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(overview.profitTrend) }}%
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="利润率"
              :value="overview.profitMargin"
              :precision="2"
              suffix="%"
              :value-style="{ color: '#722ed1' }"
            >
              <template #suffix>
                <span class="trend-indicator" :class="overview.marginTrend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="overview.marginTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(overview.marginTrend) }}%
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 图表分析区域 -->
    <div class="charts-section">
      <a-row :gutter="16">
        <!-- 收支趋势图 -->
        <a-col :span="16">
          <a-card title="收支趋势分析" class="chart-card">
            <template #extra>
              <a-radio-group v-model:value="trendPeriod" @change="handleTrendPeriodChange">
                <a-radio-button value="day">日</a-radio-button>
                <a-radio-button value="week">周</a-radio-button>
                <a-radio-button value="month">月</a-radio-button>
              </a-radio-group>
            </template>
            <div ref="trendChartRef" class="chart-container"></div>
          </a-card>
        </a-col>
        
        <!-- 收入构成饼图 -->
        <a-col :span="8">
          <a-card title="收入构成" class="chart-card">
            <div ref="revenueChartRef" class="chart-container"></div>
          </a-card>
        </a-col>
      </a-row>
      
      <a-row :gutter="16" style="margin-top: 16px">
        <!-- 支出分类 -->
        <a-col :span="8">
          <a-card title="支出分类" class="chart-card">
            <div ref="expenseChartRef" class="chart-container"></div>
          </a-card>
        </a-col>
        
        <!-- 现金流分析 -->
        <a-col :span="16">
          <a-card title="现金流分析" class="chart-card">
            <div ref="cashflowChartRef" class="chart-container"></div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 财务指标分析 -->
    <div class="metrics-section">
      <a-row :gutter="16">
        <!-- 关键财务指标 -->
        <a-col :span="12">
          <a-card title="关键财务指标">
            <div class="metrics-grid">
              <div class="metric-item" v-for="metric in keyMetrics" :key="metric.key">
                <div class="metric-label">{{ metric.label }}</div>
                <div class="metric-value" :class="getMetricClass(metric.trend)">
                  {{ metric.value }}
                  <span class="metric-unit">{{ metric.unit }}</span>
                </div>
                <div class="metric-trend" :class="metric.trend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="metric.trend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(metric.trend) }}%
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
        
        <!-- 预算执行情况 -->
        <a-col :span="12">
          <a-card title="预算执行情况">
            <div class="budget-container">
              <div class="budget-item" v-for="budget in budgetData" :key="budget.category">
                <div class="budget-header">
                  <span class="budget-category">{{ budget.category }}</span>
                  <span class="budget-percentage">{{ budget.percentage }}%</span>
                </div>
                <div class="budget-progress">
                  <a-progress
                    :percent="budget.percentage"
                    :status="getBudgetStatus(budget.percentage)"
                    :show-info="false"
                  />
                </div>
                <div class="budget-details">
                  <span class="budget-used">已用: ¥{{ budget.used.toFixed(2) }}</span>
                  <span class="budget-total">预算: ¥{{ budget.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 财务明细表格 -->
    <div class="table-section">
      <a-card title="财务明细">
        <template #extra>
          <a-space>
            <a-input
              v-model:value="searchKeyword"
              placeholder="搜索交易记录"
              allow-clear
              @change="handleSearch"
              style="width: 200px"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
            <a-select
              v-model:value="typeFilter"
              placeholder="交易类型"
              allow-clear
              @change="handleSearch"
              style="width: 120px"
            >
              <a-select-option value="income">收入</a-select-option>
              <a-select-option value="expense">支出</a-select-option>
            </a-select>
            <a-select
              v-model:value="categoryFilter"
              placeholder="分类"
              allow-clear
              @change="handleSearch"
              style="width: 120px"
            >
              <a-select-option value="sales">销售收入</a-select-option>
              <a-select-option value="service">服务收入</a-select-option>
              <a-select-option value="marketing">营销费用</a-select-option>
              <a-select-option value="operation">运营费用</a-select-option>
            </a-select>
          </a-space>
        </template>
        
        <a-table
          :columns="tableColumns"
          :data-source="financeData"
          :loading="tableLoading"
          :pagination="pagination"
          :scroll="{ x: 1400 }"
          @change="handleTableChange"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'type'">
              <a-tag :color="getTypeColor(record.type)">
                {{ getTypeText(record.type) }}
              </a-tag>
            </template>
            
            <template v-else-if="column.key === 'amount'">
              <span class="amount" :class="record.type === 'income' ? 'income' : 'expense'">
                {{ record.type === 'income' ? '+' : '-' }}¥{{ Math.abs(record.amount).toFixed(2) }}
              </span>
            </template>
            
            <template v-else-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>
            
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small" @click="viewDetail(record)">
                  查看
                </a-button>
                <a-button type="link" size="small" @click="editRecord(record)">
                  编辑
                </a-button>
                <a-popconfirm
                  title="确定要删除这条记录吗？"
                  @confirm="deleteRecord(record.id)"
                >
                  <a-button type="link" size="small" danger>
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>

    <!-- 财务记录详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="财务记录详情"
      :footer="null"
      width="600px"
    >
      <div class="detail-content" v-if="selectedRecord">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="交易ID">{{ selectedRecord.id }}</a-descriptions-item>
          <a-descriptions-item label="交易类型">
            <a-tag :color="getTypeColor(selectedRecord.type)">
              {{ getTypeText(selectedRecord.type) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="金额">
            <span class="amount" :class="selectedRecord.type === 'income' ? 'income' : 'expense'">
              {{ selectedRecord.type === 'income' ? '+' : '-' }}¥{{ Math.abs(selectedRecord.amount).toFixed(2) }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item label="分类">{{ selectedRecord.category }}</a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="getStatusColor(selectedRecord.status)">
              {{ getStatusText(selectedRecord.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="交易时间">{{ selectedRecord.transactionTime }}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ selectedRecord.createTime }}</a-descriptions-item>
          <a-descriptions-item label="更新时间">{{ selectedRecord.updateTime }}</a-descriptions-item>
          <a-descriptions-item label="备注" :span="2">{{ selectedRecord.remark || '无' }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
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
} from '@ant-design/icons-vue'
import type { TableColumnsType, TableProps } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import dayjs, { type Dayjs } from 'dayjs'

/**
 * 财务统计页面
 */

interface FinanceOverview {
  totalRevenue: number
  totalExpense: number
  netProfit: number
  profitMargin: number
  revenueTrend: number
  expenseTrend: number
  profitTrend: number
  marginTrend: number
}

interface FinanceItem {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  status: string
  transactionTime: string
  createTime: string
  updateTime: string
  remark?: string
}

interface KeyMetric {
  key: string
  label: string
  value: string
  unit: string
  trend: number
}

interface BudgetItem {
  category: string
  used: number
  total: number
  percentage: number
}

// 响应式数据
const tableLoading = ref(false)
const detailModalVisible = ref(false)
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(30, 'day'), dayjs()])
const reportType = ref('all')
const trendPeriod = ref('day')
const searchKeyword = ref('')
const typeFilter = ref<string | undefined>(undefined)
const categoryFilter = ref<string | undefined>(undefined)
const financeData = ref<FinanceItem[]>([])
const selectedRecord = ref<FinanceItem | null>(null)

// 图表引用
const trendChartRef = ref<HTMLDivElement>()
const revenueChartRef = ref<HTMLDivElement>()
const expenseChartRef = ref<HTMLDivElement>()
const cashflowChartRef = ref<HTMLDivElement>()

// 财务概览数据
const overview = ref<FinanceOverview>({
  totalRevenue: 0,
  totalExpense: 0,
  netProfit: 0,
  profitMargin: 0,
  revenueTrend: 0,
  expenseTrend: 0,
  profitTrend: 0,
  marginTrend: 0,
})

// 关键指标数据
const keyMetrics = ref<KeyMetric[]>([])

// 预算数据
const budgetData = ref<BudgetItem[]>([])

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
    title: '交易ID',
    dataIndex: 'id',
    key: 'id',
    width: 120,
    fixed: 'left',
  },
  {
    title: '类型',
    key: 'type',
    width: 100,
  },
  {
    title: '金额',
    key: 'amount',
    width: 150,
    sorter: true,
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 200,
    ellipsis: true,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '交易时间',
    dataIndex: 'transactionTime',
    key: 'transactionTime',
    width: 160,
    sorter: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160,
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
  },
]

/**
 * 获取交易类型颜色
 */
const getTypeColor = (type: string): string => {
  return type === 'income' ? 'green' : 'red'
}

/**
 * 获取交易类型文本
 */
const getTypeText = (type: string): string => {
  return type === 'income' ? '收入' : '支出'
}

/**
 * 获取状态颜色
 */
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    completed: 'green',
    pending: 'orange',
    failed: 'red',
    cancelled: 'gray',
  }
  return colorMap[status] || 'default'
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    completed: '已完成',
    pending: '处理中',
    failed: '失败',
    cancelled: '已取消',
  }
  return textMap[status] || status
}

/**
 * 获取指标样式类
 */
const getMetricClass = (trend: number): string => {
  if (trend > 0) return 'positive'
  if (trend < 0) return 'negative'
  return 'neutral'
}

/**
 * 获取预算状态
 */
const getBudgetStatus = (percentage: number): 'success' | 'normal' | 'exception' => {
  if (percentage <= 80) return 'success'
  if (percentage <= 100) return 'normal'
  return 'exception'
}

/**
 * 加载财务数据
 */
const loadFinanceData = async (): Promise<void> => {
  tableLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟概览数据
    overview.value = {
      totalRevenue: 1256780.50,
      totalExpense: 856432.20,
      netProfit: 400348.30,
      profitMargin: 31.85,
      revenueTrend: 12.5,
      expenseTrend: 8.3,
      profitTrend: 18.7,
      marginTrend: 5.2,
    }
    
    // 模拟关键指标数据
    keyMetrics.value = [
      { key: 'roa', label: '资产回报率', value: '15.6', unit: '%', trend: 2.3 },
      { key: 'roe', label: '净资产收益率', value: '22.8', unit: '%', trend: 4.1 },
      { key: 'current_ratio', label: '流动比率', value: '1.85', unit: '', trend: -0.5 },
      { key: 'debt_ratio', label: '资产负债率', value: '45.2', unit: '%', trend: -1.8 },
      { key: 'inventory_turnover', label: '存货周转率', value: '8.5', unit: '次', trend: 3.2 },
      { key: 'receivables_turnover', label: '应收账款周转率', value: '12.3', unit: '次', trend: 1.7 },
    ]
    
    // 模拟预算数据
    budgetData.value = [
      { category: '营销费用', used: 85600, total: 100000, percentage: 85.6 },
      { category: '运营费用', used: 67800, total: 80000, percentage: 84.75 },
      { category: '人力成本', used: 156000, total: 150000, percentage: 104 },
      { category: '技术投入', used: 42300, total: 60000, percentage: 70.5 },
      { category: '办公费用', used: 23400, total: 30000, percentage: 78 },
    ]
    
    // 模拟财务明细数据
    const mockData: FinanceItem[] = [
      {
        id: 'FIN001',
        type: 'income',
        amount: 25680.50,
        category: '销售收入',
        description: '商品销售收入',
        status: 'completed',
        transactionTime: '2024-01-15 14:30:00',
        createTime: '2024-01-15 14:30:00',
        updateTime: '2024-01-15 14:30:00',
        remark: '正常销售收入',
      },
      {
        id: 'FIN002',
        type: 'expense',
        amount: -8500.00,
        category: '营销费用',
        description: '广告投放费用',
        status: 'completed',
        transactionTime: '2024-01-15 10:15:00',
        createTime: '2024-01-15 10:15:00',
        updateTime: '2024-01-15 10:15:00',
        remark: '百度推广费用',
      },
      {
        id: 'FIN003',
        type: 'income',
        amount: 12300.00,
        category: '服务收入',
        description: '技术服务费',
        status: 'pending',
        transactionTime: '2024-01-14 16:45:00',
        createTime: '2024-01-14 16:45:00',
        updateTime: '2024-01-14 16:45:00',
      },
    ]
    
    financeData.value = mockData
    pagination.total = mockData.length
    
    // 渲染图表
    await nextTick()
    renderCharts()
  } catch (__error) {
    message.error('加载财务数据失败')
  } finally {
    tableLoading.value = false
  }
}

/**
 * 渲染图表
 */
const renderCharts = (): void => {
  // 这里应该使用实际的图表库如 ECharts 或 Chart.js
  // 为了演示，我们只是创建占位符
  
  if (trendChartRef.value) {
    trendChartRef.value.innerHTML = '<div style="height: 300px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 4px;">收支趋势图表占位符</div>'
  }
  
  if (revenueChartRef.value) {
    revenueChartRef.value.innerHTML = '<div style="height: 300px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 4px;">收入构成图表占位符</div>'
  }
  
  if (expenseChartRef.value) {
    expenseChartRef.value.innerHTML = '<div style="height: 250px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 4px;">支出分类图表占位符</div>'
  }
  
  if (cashflowChartRef.value) {
    cashflowChartRef.value.innerHTML = '<div style="height: 250px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 4px;">现金流图表占位符</div>'
  }
}

/**
 * 处理日期变化
 */
const handleDateChange = (dates: [Dayjs, Dayjs] | null): void => {
  if (dates) {
    dateRange.value = dates
    loadFinanceData()
  }
}

/**
 * 处理报表类型变化
 */
const handleReportTypeChange = (): void => {
  loadFinanceData()
}

/**
 * 处理趋势周期变化
 */
const handleTrendPeriodChange = (): void => {
  renderCharts()
}

/**
 * 搜索处理
 */
const handleSearch = debounce((): void => {
  pagination.current = 1
  loadFinanceData()
}, 300)

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 20
  loadFinanceData()
}

/**
 * 查看详情
 */
const viewDetail = (record: FinanceItem): void => {
  selectedRecord.value = record
  detailModalVisible.value = true
}

/**
 * 编辑记录
 */
const editRecord = (record: FinanceItem): void => {
  message.info('编辑功能开发中')
}

/**
 * 删除记录
 */
const deleteRecord = (id: string): void => {
  message.success('删除成功')
  loadFinanceData()
}

/**
 * 刷新数据
 */
const refreshData = (): void => {
  loadFinanceData()
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
  loadFinanceData()
})
</script>

<style scoped lang="less">
.finance-stats-view {
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

.overview-section {
  margin-bottom: 24px;
  
  .overview-card {
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
    
    .trend-indicator {
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
      
      &:last-child {
        height: 250px;
      }
    }
  }
}

.metrics-section {
  margin-bottom: 24px;
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    
    .metric-item {
      padding: 16px;
      background: #fafafa;
      border-radius: 6px;
      text-align: center;
      
      .metric-label {
        font-size: 14px;
        color: #8c8c8c;
        margin-bottom: 8px;
      }
      
      .metric-value {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 4px;
        
        &.positive {
          color: #52c41a;
        }
        
        &.negative {
          color: #ff4d4f;
        }
        
        &.neutral {
          color: #1890ff;
        }
        
        .metric-unit {
          font-size: 14px;
          margin-left: 4px;
        }
      }
      
      .metric-trend {
        font-size: 12px;
        
        &.positive {
          color: #52c41a;
        }
        
        &.negative {
          color: #ff4d4f;
        }
      }
    }
  }
  
  .budget-container {
    .budget-item {
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .budget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .budget-category {
          font-weight: 500;
          color: #262626;
        }
        
        .budget-percentage {
          font-weight: 600;
          color: #1890ff;
        }
      }
      
      .budget-progress {
        margin-bottom: 8px;
      }
      
      .budget-details {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #8c8c8c;
        
        .budget-used {
          color: #ff4d4f;
        }
        
        .budget-total {
          color: #52c41a;
        }
      }
    }
  }
}

.table-section {
  .amount {
    font-weight: 600;
    
    &.income {
      color: #52c41a;
    }
    
    &.expense {
      color: #ff4d4f;
    }
  }
}

.detail-content {
  .amount {
    font-weight: 600;
    
    &.income {
      color: #52c41a;
    }
    
    &.expense {
      color: #ff4d4f;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .finance-stats-view {
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
  
  .overview-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
  
  .charts-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
  
  .metrics-section {
    .ant-col {
      margin-bottom: 16px;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>