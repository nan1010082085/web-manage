<template>
  <div class="data-analytics-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">数据分析</h2>
        <p class="page-description">全面的业务数据分析和洞察</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-range-picker
            v-model:value="dateRange"
            @change="handleDateChange"
            :presets="datePresets"
          />
          <a-button @click="refreshData">
            <ReloadOutlined />
            刷新
          </a-button>
          <a-button type="primary" @click="exportReport">
            <ExportOutlined />
            导出报告
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 核心指标概览 -->
    <div class="overview-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="metric-card">
            <a-statistic
              title="总销售额"
              :value="overview.totalRevenue"
              :precision="2"
              suffix="元"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <DollarOutlined />
              </template>
            </a-statistic>
            <div class="metric-trend">
              <span class="trend-text">较上期</span>
              <span :class="['trend-value', overview.revenueTrend > 0 ? 'positive' : 'negative']">
                <ArrowUpOutlined v-if="overview.revenueTrend > 0" />
                <ArrowDownOutlined v-else />
                {{ Math.abs(overview.revenueTrend) }}%
              </span>
            </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="metric-card">
            <a-statistic
              title="订单数量"
              :value="overview.totalOrders"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <ShoppingCartOutlined />
              </template>
            </a-statistic>
            <div class="metric-trend">
              <span class="trend-text">较上期</span>
              <span :class="['trend-value', overview.ordersTrend > 0 ? 'positive' : 'negative']">
                <ArrowUpOutlined v-if="overview.ordersTrend > 0" />
                <ArrowDownOutlined v-else />
                {{ Math.abs(overview.ordersTrend) }}%
              </span>
            </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="metric-card">
            <a-statistic
              title="新增用户"
              :value="overview.newUsers"
              :value-style="{ color: '#fa8c16' }"
            >
              <template #prefix>
                <UserAddOutlined />
              </template>
            </a-statistic>
            <div class="metric-trend">
              <span class="trend-text">较上期</span>
              <span :class="['trend-value', overview.usersTrend > 0 ? 'positive' : 'negative']">
                <ArrowUpOutlined v-if="overview.usersTrend > 0" />
                <ArrowDownOutlined v-else />
                {{ Math.abs(overview.usersTrend) }}%
              </span>
            </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="metric-card">
            <a-statistic
              title="转化率"
              :value="overview.conversionRate"
              suffix="%"
              :precision="2"
              :value-style="{ color: '#722ed1' }"
            >
              <template #prefix>
                <RiseOutlined />
              </template>
            </a-statistic>
            <div class="metric-trend">
              <span class="trend-text">较上期</span>
              <span
                :class="['trend-value', overview.conversionTrend > 0 ? 'positive' : 'negative']"
              >
                <ArrowUpOutlined v-if="overview.conversionTrend > 0" />
                <ArrowDownOutlined v-else />
                {{ Math.abs(overview.conversionTrend) }}%
              </span>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 图表分析区域 -->
    <div class="charts-section">
      <a-row :gutter="16">
        <!-- 销售趋势图 -->
        <a-col :span="12">
          <a-card title="销售趋势" class="chart-card">
            <template #extra>
              <a-radio-group v-model:value="salesChartType" size="small">
                <a-radio-button value="revenue">销售额</a-radio-button>
                <a-radio-button value="orders">订单量</a-radio-button>
              </a-radio-group>
            </template>
            <div ref="salesChartRef" class="chart-container"></div>
          </a-card>
        </a-col>

        <!-- 用户增长图 -->
        <a-col :span="12">
          <a-card title="用户增长" class="chart-card">
            <template #extra>
              <a-radio-group v-model:value="userChartType" size="small">
                <a-radio-button value="new">新增用户</a-radio-button>
                <a-radio-button value="active">活跃用户</a-radio-button>
              </a-radio-group>
            </template>
            <div ref="userChartRef" class="chart-container"></div>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="16" style="margin-top: 16px">
        <!-- 商品分类销售占比 -->
        <a-col :span="8">
          <a-card title="商品分类销售占比" class="chart-card">
            <div ref="categoryChartRef" class="chart-container"></div>
          </a-card>
        </a-col>

        <!-- 地区销售分布 -->
        <a-col :span="8">
          <a-card title="地区销售分布" class="chart-card">
            <div ref="regionChartRef" class="chart-container"></div>
          </a-card>
        </a-col>

        <!-- 支付方式分布 -->
        <a-col :span="8">
          <a-card title="支付方式分布" class="chart-card">
            <div ref="paymentChartRef" class="chart-container"></div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 实时数据监控 -->
    <div class="realtime-section">
      <a-card title="实时数据监控">
        <template #extra>
          <a-space>
            <a-switch
              v-model:checked="realtimeEnabled"
              checked-children="开启"
              un-checked-children="关闭"
              @change="toggleRealtime"
            />
            <span class="update-time">最后更新: {{ lastUpdateTime }}</span>
          </a-space>
        </template>

        <a-row :gutter="16">
          <a-col :span="6">
            <div class="realtime-metric">
              <div class="metric-label">在线用户</div>
              <div class="metric-value">{{ realtimeData.onlineUsers }}</div>
              <div class="metric-change positive">
                <ArrowUpOutlined />
                +{{ realtimeData.onlineUsersChange }}
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="realtime-metric">
              <div class="metric-label">今日订单</div>
              <div class="metric-value">{{ realtimeData.todayOrders }}</div>
              <div class="metric-change positive">
                <ArrowUpOutlined />
                +{{ realtimeData.todayOrdersChange }}
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="realtime-metric">
              <div class="metric-label">今日销售额</div>
              <div class="metric-value">¥{{ realtimeData.todayRevenue.toLocaleString() }}</div>
              <div class="metric-change positive">
                <ArrowUpOutlined />
                +{{ realtimeData.todayRevenueChange }}%
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="realtime-metric">
              <div class="metric-label">页面浏览量</div>
              <div class="metric-value">{{ realtimeData.pageViews.toLocaleString() }}</div>
              <div class="metric-change positive">
                <ArrowUpOutlined />
                +{{ realtimeData.pageViewsChange }}%
              </div>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <a-card title="详细数据">
        <template #extra>
          <a-space>
            <a-select
              v-model:value="tableDataType"
              style="width: 120px"
              @change="handleTableTypeChange"
            >
              <a-select-option value="products">商品数据</a-select-option>
              <a-select-option value="users">用户数据</a-select-option>
              <a-select-option value="orders">订单数据</a-select-option>
            </a-select>
            <a-button @click="exportTableData">
              <ExportOutlined />
              导出
            </a-button>
          </a-space>
        </template>

        <a-table
          :columns="currentTableColumns"
          :data-source="currentTableData"
          :loading="tableLoading"
          :pagination="tablePagination"
          @change="handleTableChange"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'trend'">
              <span :class="['trend-indicator', record.trend > 0 ? 'positive' : 'negative']">
                <ArrowUpOutlined v-if="record.trend > 0" />
                <ArrowDownOutlined v-else />
                {{ Math.abs(record.trend) }}%
              </span>
            </template>

            <template v-else-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ record.status }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small" @click="viewDetail(record)"> 详情 </a-button>
                <a-button type="link" size="small" @click="analyze(record)"> 分析 </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>

    <!-- 数据洞察 -->
    <div class="insights-section">
      <a-card title="数据洞察">
        <a-row :gutter="16">
          <a-col :span="8">
            <div class="insight-item">
              <div class="insight-icon">
                <TrophyOutlined style="color: #faad14" />
              </div>
              <div class="insight-content">
                <div class="insight-title">热销商品</div>
                <div class="insight-desc">iPhone 15 Pro 销量领先，占总销量的 23.5%</div>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="insight-item">
              <div class="insight-icon">
                <ClockCircleOutlined style="color: #52c41a" />
              </div>
              <div class="insight-content">
                <div class="insight-title">购买高峰</div>
                <div class="insight-desc">晚上 8-10 点是用户购买的高峰时段</div>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="insight-item">
              <div class="insight-icon">
                <TeamOutlined style="color: #1890ff" />
              </div>
              <div class="insight-content">
                <div class="insight-title">用户画像</div>
                <div class="insight-desc">25-35 岁用户群体贡献了 45% 的销售额</div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import {
  ReloadOutlined,
  ExportOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, TableProps } from 'ant-design-vue'

import dayjs, { type Dayjs } from 'dayjs'
import * as echarts from 'echarts'

/**
 * 数据分析页面
 */

interface DataOverview {
  totalRevenue: number
  revenueTrend: number
  totalOrders: number
  ordersTrend: number
  newUsers: number
  usersTrend: number
  conversionRate: number
  conversionTrend: number
}

interface RealtimeData {
  onlineUsers: number
  onlineUsersChange: number
  todayOrders: number
  todayOrdersChange: number
  todayRevenue: number
  todayRevenueChange: number
  pageViews: number
  pageViewsChange: number
}

interface OrderDataItem {
  id: string
  orderNo: string
  userName: string
  amount: number
  createTime: string
  paymentMethod: string
  status: string
}

interface UserDataItem {
  id: string
  name: string
  registerTime: string
  orderCount: number
  totalSpent: number
  trend: number
  status: string
}

interface ProductDataItem {
  id: string
  name: string
  sales: number
  revenue: number
  trend: number
  status: string
}

// 响应式数据
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(30, 'day'), dayjs()])
const salesChartType = ref('revenue')
const userChartType = ref('new')
const tableDataType = ref('products')
const realtimeEnabled = ref(true)
const lastUpdateTime = ref(dayjs().format('HH:mm:ss'))
const tableLoading = ref(false)

// 图表引用
const salesChartRef = ref<HTMLDivElement>()
const userChartRef = ref<HTMLDivElement>()
const categoryChartRef = ref<HTMLDivElement>()
const regionChartRef = ref<HTMLDivElement>()
const paymentChartRef = ref<HTMLDivElement>()

// 图表实例
let salesChart: echarts.ECharts | null = null
let userChart: echarts.ECharts | null = null
let categoryChart: echarts.ECharts | null = null
let regionChart: echarts.ECharts | null = null
let paymentChart: echarts.ECharts | null = null

// 实时数据更新定时器
let realtimeTimer: NodeJS.Timeout | null = null

// 数据概览
const overview = ref<DataOverview>({
  totalRevenue: 0,
  revenueTrend: 0,
  totalOrders: 0,
  ordersTrend: 0,
  newUsers: 0,
  usersTrend: 0,
  conversionRate: 0,
  conversionTrend: 0,
})

// 实时数据
const realtimeData = ref<RealtimeData>({
  onlineUsers: 0,
  onlineUsersChange: 0,
  todayOrders: 0,
  todayOrdersChange: 0,
  todayRevenue: 0,
  todayRevenueChange: 0,
  pageViews: 0,
  pageViewsChange: 0,
})

// 表格数据
const tableData = reactive({
  products: [] as ProductDataItem[],
  users: [] as UserDataItem[],
  orders: [] as OrderDataItem[],
})

// 表格分页
const tablePagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 日期预设
const datePresets = [
  { label: '最近7天', value: [dayjs().subtract(7, 'day'), dayjs()] },
  { label: '最近30天', value: [dayjs().subtract(30, 'day'), dayjs()] },
  { label: '最近90天', value: [dayjs().subtract(90, 'day'), dayjs()] },
  { label: '本月', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
  {
    label: '上月',
    value: [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month'),
    ],
  },
]

// 商品数据表格列
const productColumns: TableColumnsType = [
  {
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '销量',
    dataIndex: 'sales',
    key: 'sales',
    width: 100,
    sorter: true,
  },
  {
    title: '销售额',
    dataIndex: 'revenue',
    key: 'revenue',
    width: 120,
    sorter: true,
    customRender: ({ text }) => `¥${text.toLocaleString()}`,
  },
  {
    title: '趋势',
    key: 'trend',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
  },
]

// 用户数据表格列
const userColumns: TableColumnsType = [
  {
    title: '用户ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: '用户名',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
    key: 'registerTime',
    width: 160,
  },
  {
    title: '订单数',
    dataIndex: 'orderCount',
    key: 'orderCount',
    width: 100,
    sorter: true,
  },
  {
    title: '消费金额',
    dataIndex: 'totalSpent',
    key: 'totalSpent',
    width: 120,
    sorter: true,
    customRender: ({ text }) => `¥${text.toLocaleString()}`,
  },
  {
    title: '活跃度',
    key: 'trend',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
  },
]

// 订单数据表格列
const orderColumns: TableColumnsType = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 150,
  },
  {
    title: '用户',
    dataIndex: 'userName',
    key: 'userName',
    width: 120,
  },
  {
    title: '订单金额',
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
    sorter: true,
    customRender: ({ text }) => `¥${text.toLocaleString()}`,
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160,
    sorter: true,
  },
  {
    title: '支付方式',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
  },
]

// 计算属性
const currentTableColumns = computed(() => {
  switch (tableDataType.value) {
    case 'products':
      return productColumns
    case 'users':
      return userColumns
    case 'orders':
      return orderColumns
    default:
      return productColumns
  }
})

const currentTableData = computed(() => {
  return tableData[tableDataType.value as keyof typeof tableData] as (
    | ProductDataItem
    | UserDataItem
    | OrderDataItem
  )[]
})

/**
 * 获取状态颜色
 */
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    热销: 'red',
    正常: 'green',
    滞销: 'orange',
    活跃: 'green',
    普通: 'blue',
    沉睡: 'default',
    已完成: 'green',
    进行中: 'blue',
    已取消: 'red',
  }
  return colorMap[status] || 'default'
}

/**
 * 初始化图表
 */
const initCharts = async (): Promise<void> => {
  await nextTick()

  // 销售趋势图
  if (salesChartRef.value) {
    salesChart = echarts.init(salesChartRef.value)
    updateSalesChart()
  }

  // 用户增长图
  if (userChartRef.value) {
    userChart = echarts.init(userChartRef.value)
    updateUserChart()
  }

  // 商品分类图
  if (categoryChartRef.value) {
    categoryChart = echarts.init(categoryChartRef.value)
    updateCategoryChart()
  }

  // 地区分布图
  if (regionChartRef.value) {
    regionChart = echarts.init(regionChartRef.value)
    updateRegionChart()
  }

  // 支付方式图
  if (paymentChartRef.value) {
    paymentChart = echarts.init(paymentChartRef.value)
    updatePaymentChart()
  }
}

/**
 * 更新销售趋势图
 */
const updateSalesChart = (): void => {
  if (!salesChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: [salesChartType.value === 'revenue' ? '销售额' : '订单量'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        '01-01',
        '01-02',
        '01-03',
        '01-04',
        '01-05',
        '01-06',
        '01-07',
        '01-08',
        '01-09',
        '01-10',
      ],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: salesChartType.value === 'revenue' ? '销售额' : '订单量',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data:
          salesChartType.value === 'revenue'
            ? [12000, 13200, 10100, 13400, 9000, 23000, 21000, 19000, 14000, 16000]
            : [120, 132, 101, 134, 90, 230, 210, 190, 140, 160],
        areaStyle: {
          opacity: 0.3,
        },
      },
    ],
  }

  salesChart.setOption(option)
}

/**
 * 更新用户增长图
 */
const updateUserChart = (): void => {
  if (!userChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [userChartType.value === 'new' ? '新增用户' : '活跃用户'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: [
        '01-01',
        '01-02',
        '01-03',
        '01-04',
        '01-05',
        '01-06',
        '01-07',
        '01-08',
        '01-09',
        '01-10',
      ],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: userChartType.value === 'new' ? '新增用户' : '活跃用户',
        type: 'bar',
        data:
          userChartType.value === 'new'
            ? [320, 302, 301, 334, 390, 330, 320, 280, 250, 300]
            : [1200, 1320, 1010, 1340, 900, 2300, 2100, 1900, 1400, 1600],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
      },
    ],
  }

  userChart.setOption(option)
}

/**
 * 更新商品分类图
 */
const updateCategoryChart = (): void => {
  if (!categoryChart) return

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '销售占比',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '手机数码' },
          { value: 735, name: '服装鞋包' },
          { value: 580, name: '家居用品' },
          { value: 484, name: '美妆护肤' },
          { value: 300, name: '运动户外' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }

  categoryChart.setOption(option)
}

/**
 * 更新地区分布图
 */
const updateRegionChart = (): void => {
  if (!regionChart) return

  const option = {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: '销售额',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 335, name: '北京' },
          { value: 310, name: '上海' },
          { value: 234, name: '广州' },
          { value: 135, name: '深圳' },
          { value: 1548, name: '其他' },
        ],
      },
    ],
  }

  regionChart.setOption(option)
}

/**
 * 更新支付方式图
 */
const updatePaymentChart = (): void => {
  if (!paymentChart) return

  const option = {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: '支付方式',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1200, name: '微信支付' },
          { value: 800, name: '支付宝' },
          { value: 300, name: '银行卡' },
          { value: 100, name: '其他' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }

  paymentChart.setOption(option)
}

/**
 * 加载数据概览
 */
const loadOverviewData = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    overview.value = {
      totalRevenue: 2456789.5,
      revenueTrend: 12.5,
      totalOrders: 15678,
      ordersTrend: 8.3,
      newUsers: 3456,
      usersTrend: -2.1,
      conversionRate: 3.45,
      conversionTrend: 5.2,
    }
  } catch (error) {
    message.error('加载概览数据失败')
  }
}

/**
 * 加载实时数据
 */
const loadRealtimeData = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 200))

    realtimeData.value = {
      onlineUsers: Math.floor(Math.random() * 1000) + 500,
      onlineUsersChange: Math.floor(Math.random() * 50) + 10,
      todayOrders: Math.floor(Math.random() * 500) + 200,
      todayOrdersChange: Math.floor(Math.random() * 20) + 5,
      todayRevenue: Math.floor(Math.random() * 100000) + 50000,
      todayRevenueChange: Math.floor(Math.random() * 20) + 5,
      pageViews: Math.floor(Math.random() * 10000) + 5000,
      pageViewsChange: Math.floor(Math.random() * 30) + 10,
    }

    lastUpdateTime.value = dayjs().format('HH:mm:ss')
  } catch (error) {
    console.error('加载实时数据失败:', error)
  }
}

/**
 * 加载表格数据
 */
const loadTableData = async (): Promise<void> => {
  tableLoading.value = true
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 800))

    // 模拟商品数据
    tableData.products = [
      {
        id: 'P001',
        name: 'iPhone 15 Pro',
        sales: 1234,
        revenue: 12340000,
        trend: 15.6,
        status: '热销',
      },
      {
        id: 'P002',
        name: 'MacBook Pro',
        sales: 567,
        revenue: 8900000,
        trend: -3.2,
        status: '正常',
      },
      {
        id: 'P003',
        name: 'AirPods Pro',
        sales: 2345,
        revenue: 4690000,
        trend: 28.9,
        status: '热销',
      },
      {
        id: 'P004',
        name: 'iPad Air',
        sales: 890,
        revenue: 3560000,
        trend: 5.7,
        status: '正常',
      },
      {
        id: 'P005',
        name: 'Apple Watch',
        sales: 456,
        revenue: 1824000,
        trend: -8.1,
        status: '滞销',
      },
    ]

    // 模拟用户数据
    tableData.users = [
      {
        id: 'U001',
        name: '张三',
        registerTime: '2024-01-01',
        orderCount: 15,
        totalSpent: 25600,
        trend: 12.5,
        status: '活跃',
      },
      {
        id: 'U002',
        name: '李四',
        registerTime: '2024-01-02',
        orderCount: 8,
        totalSpent: 12800,
        trend: -2.3,
        status: '普通',
      },
      {
        id: 'U003',
        name: '王五',
        registerTime: '2024-01-03',
        orderCount: 3,
        totalSpent: 4500,
        trend: -15.6,
        status: '沉睡',
      },
    ]

    // 模拟订单数据
    tableData.orders = [
      {
        id: 'O001',
        orderNo: 'ORD202401001',
        userName: '张三',
        amount: 12999,
        createTime: '2024-01-15 10:30:00',
        paymentMethod: '微信支付',
        status: '已完成',
      },
      {
        id: 'O002',
        orderNo: 'ORD202401002',
        userName: '李四',
        amount: 8999,
        createTime: '2024-01-15 11:20:00',
        paymentMethod: '支付宝',
        status: '进行中',
      },
      {
        id: 'O003',
        orderNo: 'ORD202401003',
        userName: '王五',
        amount: 1599,
        createTime: '2024-01-15 14:15:00',
        paymentMethod: '银行卡',
        status: '已取消',
      },
    ]

    tablePagination.total = currentTableData.value.length
  } catch (error) {
    message.error('加载表格数据失败')
  } finally {
    tableLoading.value = false
  }
}

/**
 * 日期变化处理
 */
const handleDateChange = (): void => {
  refreshData()
}

/**
 * 表格类型变化处理
 */
const handleTableTypeChange = (): void => {
  tablePagination.current = 1
  loadTableData()
}

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  tablePagination.current = pag.current || 1
  tablePagination.pageSize = pag.pageSize || 10
  loadTableData()
}

/**
 * 切换实时数据
 */
const toggleRealtime = (enabled: boolean): void => {
  if (enabled) {
    startRealtimeUpdate()
  } else {
    stopRealtimeUpdate()
  }
}

/**
 * 开始实时更新
 */
const startRealtimeUpdate = (): void => {
  if (realtimeTimer) {
    clearInterval(realtimeTimer)
  }

  realtimeTimer = setInterval(() => {
    loadRealtimeData()
  }, 5000) // 每5秒更新一次
}

/**
 * 停止实时更新
 */
const stopRealtimeUpdate = (): void => {
  if (realtimeTimer) {
    clearInterval(realtimeTimer)
    realtimeTimer = null
  }
}

/**
 * 查看详情
 */
const viewDetail = (record: ProductDataItem | UserDataItem | OrderDataItem): void => {
  const name = 'name' in record ? record.name : record.orderNo
  message.info(`查看 ${name} 的详细信息`)
}

/**
 * 分析数据
 */
const analyze = (record: ProductDataItem | UserDataItem | OrderDataItem): void => {
  const name = 'name' in record ? record.name : record.orderNo
  message.info(`分析 ${name} 的数据`)
}

/**
 * 导出报告
 */
const exportReport = (): void => {
  message.success('数据报告导出成功')
}

/**
 * 导出表格数据
 */
const exportTableData = (): void => {
  message.success(`${tableDataType.value}数据导出成功`)
}

/**
 * 刷新数据
 */
const refreshData = (): void => {
  loadOverviewData()
  loadRealtimeData()
  loadTableData()

  // 更新图表
  setTimeout(() => {
    updateSalesChart()
    updateUserChart()
    updateCategoryChart()
    updateRegionChart()
    updatePaymentChart()
  }, 100)
}

// 监听图表类型变化
watch(salesChartType, () => {
  updateSalesChart()
})

watch(userChartType, () => {
  updateUserChart()
})

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  loadOverviewData()
  loadRealtimeData()
  loadTableData()
  initCharts()

  if (realtimeEnabled.value) {
    startRealtimeUpdate()
  }

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    salesChart?.resize()
    userChart?.resize()
    categoryChart?.resize()
    regionChart?.resize()
    paymentChart?.resize()
  })
})

/**
 * 组件卸载时清理
 */
onUnmounted(() => {
  stopRealtimeUpdate()

  salesChart?.dispose()
  userChart?.dispose()
  categoryChart?.dispose()
  regionChart?.dispose()
  paymentChart?.dispose()

  window.removeEventListener('resize', () => {})
})
</script>

<style scoped lang="less">
.data-analytics-view {
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

.overview-section {
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
      margin-bottom: 12px;

      .ant-statistic-content-value {
        font-size: 24px;
        font-weight: 600;
      }
    }

    .metric-trend {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      .trend-text {
        font-size: 12px;
        color: #8c8c8c;
      }

      .trend-value {
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 2px;

        &.positive {
          color: #52c41a;
        }

        &.negative {
          color: #ff4d4f;
        }
      }
    }
  }
}

.charts-section {
  margin-bottom: 24px;

  .chart-card {
    .chart-container {
      height: 300px;
      width: 100%;
    }
  }
}

.realtime-section {
  margin-bottom: 24px;

  .update-time {
    font-size: 12px;
    color: #8c8c8c;
  }

  .realtime-metric {
    text-align: center;
    padding: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    background: #fafafa;

    .metric-label {
      font-size: 12px;
      color: #8c8c8c;
      margin-bottom: 8px;
    }

    .metric-value {
      font-size: 20px;
      font-weight: 600;
      color: #262626;
      margin-bottom: 8px;
    }

    .metric-change {
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;

      &.positive {
        color: #52c41a;
      }

      &.negative {
        color: #ff4d4f;
      }
    }
  }
}

.table-section {
  margin-bottom: 24px;

  .trend-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;

    &.positive {
      color: #52c41a;
    }

    &.negative {
      color: #ff4d4f;
    }
  }
}

.insights-section {
  .insight-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    background: #fafafa;

    .insight-icon {
      font-size: 24px;
      margin-top: 4px;
    }

    .insight-content {
      flex: 1;

      .insight-title {
        font-size: 14px;
        font-weight: 600;
        color: #262626;
        margin-bottom: 4px;
      }

      .insight-desc {
        font-size: 12px;
        color: #8c8c8c;
        line-height: 1.5;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .data-analytics-view {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
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

    .chart-card {
      .chart-container {
        height: 250px;
      }
    }
  }

  .realtime-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }

  .insights-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
}
</style>
