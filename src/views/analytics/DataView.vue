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

      <!-- 新增图表类型 -->
      <a-row :gutter="16" style="margin-top: 16px">
        <!-- 销售对比柱状图 -->
        <a-col :span="12">
          <a-card title="月度销售对比" class="chart-card">
            <template #extra>
              <a-radio-group v-model:value="barChartPeriod" size="small">
                <a-radio-button value="month">月度</a-radio-button>
                <a-radio-button value="quarter">季度</a-radio-button>
              </a-radio-group>
            </template>
            <HighChart :options="barChartOption" height="300px" @created="onBarChartReady" />
          </a-card>
        </a-col>

        <!-- 销售趋势面积图 -->
        <a-col :span="12">
          <a-card title="销售趋势面积图" class="chart-card">
            <template #extra>
              <a-radio-group v-model:value="areaChartType" size="small">
                <a-radio-button value="revenue">销售额</a-radio-button>
                <a-radio-button value="profit">利润</a-radio-button>
              </a-radio-group>
            </template>
            <HighChart :options="areaChartOption" height="300px" @created="onAreaChartReady" />
          </a-card>
        </a-col>
      </a-row>

      <!-- 热力图 -->
      <a-row :gutter="16" style="margin-top: 16px">
        <a-col :span="24">
          <a-card title="用户活跃度热力图" class="chart-card">
            <template #extra>
              <a-space>
                <a-select v-model:value="heatmapMetric" style="width: 120px">
                  <a-select-option value="activity">活跃度</a-select-option>
                  <a-select-option value="orders">订单量</a-select-option>
                  <a-select-option value="revenue">销售额</a-select-option>
                </a-select>
                <a-button size="small" @click="refreshHeatmap">
                  <ReloadOutlined />
                  刷新
                </a-button>
              </a-space>
            </template>
            <HighChart :options="heatmapOption" height="400px" @created="onHeatmapReady" />
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
            <HighChart :options="salesTrendOption" height="300px" @created="onSalesChartReady" />
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
            <HighChart :options="userGrowthOption" height="300px" @created="onUserChartReady" />
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="16" style="margin-top: 16px">
        <!-- 商品分类销售占比 -->
        <a-col :span="8">
          <a-card title="商品分类销售占比" class="chart-card">
            <HighChart
              :options="categoryDistributionOption"
              height="300px"
              @created="onCategoryChartReady"
            />
          </a-card>
        </a-col>

        <!-- 地区销售分布 -->
        <a-col :span="8">
          <a-card title="地区销售分布" class="chart-card">
            <HighChart
              :options="regionDistributionOption"
              height="300px"
              @created="onRegionChartReady"
            />
          </a-card>
        </a-col>

        <!-- 支付方式分布 -->
        <a-col :span="8">
          <a-card title="支付方式分布" class="chart-card">
            <HighChart
              :options="paymentDistributionOption"
              height="300px"
              @created="onPaymentChartReady"
            />
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

    <!-- 高级图表分析 -->
    <div class="advanced-charts-section">
      <AdvancedCharts />
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
import HighChart from '@/components/common/HighChart.vue'
import AdvancedCharts from '@/components/charts/AdvancedCharts.vue'
import {
  getOverviewData,
  getSalesTrendData,
  getUserGrowthData,
  getCategoryDistributionData,
  getRegionDistributionData,
  getPaymentDistributionData,
  getHeatmapData,
  getBarChartData,
  getAreaChartData,
  getRealtimeData,
  getProductData,
  getUserData,
  getOrderData,
} from '@/api/analytics'
import { dataAnalysisChartConfigs as chartConfigs } from '@/config/charts/chartConfigs'
import type { Options } from 'highcharts'
import type * as Highcharts from 'highcharts'
import dayjs, { type Dayjs } from 'dayjs'
import { omit } from 'lodash-es'
import 'highcharts/modules/heatmap'
import type {
  DataOverview,
  RealtimeData,
  OrderDataItem,
  UserDataItem,
  ProductDataItem,
  SalesChartType,
  UserChartType,
  TableDataType,
  BarChartPeriod,
  AreaChartType,
  HeatmapMetric,
  TableDataItem,
  DateRange,
} from './types'

/**
 * 数据分析页面
 */

// 响应式数据
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(30, 'day'), dayjs()])
const salesChartType = ref<SalesChartType>('revenue')
const userChartType = ref<UserChartType>('new')
const tableDataType = ref<TableDataType>('products')
const realtimeEnabled = ref(true)
const lastUpdateTime = ref(dayjs().format('HH:mm:ss'))
const tableLoading = ref(false)
const barChartPeriod = ref<BarChartPeriod>('month')
const areaChartType = ref<AreaChartType>('revenue')
const heatmapMetric = ref<HeatmapMetric>('activity')

// 图表引用已移除，使用HighChart组件

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

// 图表数据
const salesTrendData = ref<any>(null)
const userGrowthData = ref<any>(null)
const categoryDistributionData = ref<any>(null)
const regionDistributionData = ref<any>(null)
const paymentDistributionData = ref<any>(null)
const barChartData = ref<any>(null)
const areaChartData = ref<any>(null)
const heatmapData = ref<any>(null)

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

// 图表配置计算属性
const salesTrendOption = computed<Options>(() => {
  const config = chartConfigs.salesTrend
  const data = salesTrendData.value

  if (!data || !Array.isArray(data)) return config

  // 创建数据副本避免重复计算
  const categories = data.map((item: any) => item.date)
  const seriesData = data.map((item: any) =>
    salesChartType.value === 'revenue' ? item.revenue : item.orders,
  )

  return {
    ...config,
    xAxis: {
      ...config.xAxis,
      categories,
    },
    series: [
      {
        name: salesChartType.value === 'revenue' ? '销售额' : '订单量',
        type: 'line',
        data: seriesData,
        color: '#1890ff',
      },
    ],
  }
})

const userGrowthOption = computed<Options>(() => {
  const config = chartConfigs.userGrowth
  const data = userGrowthData.value

  if (!data || !Array.isArray(data)) return config

  // 创建数据副本避免重复计算
  const categories = data.map((item: any) => item.date)
  const seriesData = data.map((item: any) =>
    userChartType.value === 'new' ? item.newUsers : item.activeUsers,
  )

  return {
    ...config,
    xAxis: {
      ...config.xAxis,
      categories,
    },
    series: [
      {
        name: userChartType.value === 'new' ? '新增用户' : '活跃用户',
        type: 'line',
        data: seriesData,
        color: '#52c41a',
      },
    ],
  }
})

const categoryDistributionOption = computed<Options>(() => {
  const config = chartConfigs.categoryDistribution
  const data = categoryDistributionData.value
  if (!data || !Array.isArray(data)) return config

  // 创建数据副本避免重复计算
  const seriesData = data.map((item: any) => ({
    name: item.category,
    y: item.value,
  }))

  return {
    ...config,
    series: [
      {
        name: '分类分布',
        type: 'pie',
        data: seriesData,
      },
    ],
  }
})

const regionDistributionOption = computed<Options>(() => {
  const config = chartConfigs.regionDistribution
  const data = regionDistributionData.value

  if (!data || !Array.isArray(data)) return config

  // 创建数据副本避免重复计算
  const seriesData = data.map((item: any) => ({
    name: item.region,
    y: item.value,
  }))

  return {
    ...config,
    series: [
      {
        name: '地区分布',
        type: 'pie',
        data: seriesData,
      },
    ],
  }
})

const paymentDistributionOption = computed<Options>(() => {
  const config = chartConfigs.paymentDistribution
  const data = paymentDistributionData.value

  if (!data || !Array.isArray(data)) return config

  // 创建数据副本避免重复计算
  const seriesData = data.map((item: any) => ({
    name: item.method,
    y: item.value,
  }))

  return {
    ...config,
    series: [
      {
        name: '支付方式分布',
        type: 'pie',
        data: seriesData,
      },
    ],
  }
})

const barChartOption = computed<Options>(() => {
  const config = chartConfigs.barChart
  const data = barChartData.value
  if (!data || !Array.isArray(data)) return config

  // 创建数据副本避免重复计算
  const categories = data.map((item: any) => item.period)
  const currentYearData = data.map((item: any) => item.currentYear)
  const lastYearData = data.map((item: any) => item.lastYear)

  return {
    ...config,
    xAxis: {
      ...config.xAxis,
      categories,
    },
    series: [
      {
        name: '本年',
        type: 'column',
        data: currentYearData,
        color: '#1890ff',
      },
      {
        name: '去年',
        type: 'column',
        data: lastYearData,
        color: '#52c41a',
      },
    ],
  }
})

const areaChartOption = computed<Options>(() => {
  const config = chartConfigs.areaChart
  const data = areaChartData.value
  const chartType = areaChartType.value

  if (!data || !Array.isArray(data)) return config

  // 避免在计算属性中直接修改响应式数据，创建新的数据副本
  const categories = data.map((item: any) => item.date)
  const revenueData = data.map((item: any) => item.revenue)
  const profitData = data.map((item: any) => item.profit)

  return {
    ...config,
    xAxis: {
      ...config.xAxis,
      categories,
    },
    series: [
      {
        name: chartType === 'revenue' ? '收入' : '利润',
        type: 'area',
        data: chartType === 'revenue' ? revenueData : profitData,
        color: chartType === 'revenue' ? '#1890ff' : '#52c41a',
      },
    ],
  }
})

const heatmapOption = computed<Options>(() => {
  const config = chartConfigs.heatmap
  const data = heatmapData.value
  if (!data || !Array.isArray(data)) return config

  console.log('heatmapOption config', config)
  console.log('heatmapOption', data)

  // 生成小时和星期的分类
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

  // 转换数据格式为热力图需要的格式
  const seriesData = data.map((item: any) => [item.x, item.y, item.value])

  return {
    ...config,
    xAxis: {
      ...config.xAxis,
      categories: hours,
    },
    yAxis: {
      ...config.yAxis,
      categories: days,
    },
    series: [
      {
        name: '活动热力图',
        type: 'heatmap',
        data: seriesData,
        dataLabels: [
          {
            enabled: true,
            color: 'contrast',
          },
        ],
      },
    ],
  }
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
 * 图表创建完成事件处理
 */
const onSalesChartReady = (chartInstance: Highcharts.Chart): void => {
  console.log('销售趋势图表已创建')
}

const onUserChartReady = (chartInstance: Highcharts.Chart): void => {
  console.log('用户增长图表已创建')
}

const onCategoryChartReady = (chartInstance: Highcharts.Chart): void => {
  console.log('分类分布图表已创建')
}

const onRegionChartReady = (chartInstance: Highcharts.Chart): void => {
  console.log('地区分布图表已创建')
}

const onPaymentChartReady = (chartInstance: Highcharts.Chart): void => {
  console.log('支付方式图表已创建')
}

const onBarChartReady = (chartInstance: Highcharts.Chart): void => {
  console.log('柱状图表已创建')
}

const onAreaChartReady = (chartInstance: Highcharts.Chart): void => {
  console.log('面积图表已创建')
}

const onHeatmapReady = (chartInstance: Highcharts.Chart): void => {
  console.log('热力图表已创建')
}

/**
 * 加载图表数据
 */
const loadChartsData = async (): Promise<void> => {
  try {
    // 加载各种图表数据
    const [
      salesResponse,
      userResponse,
      categoryResponse,
      regionResponse,
      paymentResponse,
      barResponse,
      areaResponse,
      heatResponse,
    ] = await Promise.all([
      getSalesTrendData(),
      getUserGrowthData(),
      getCategoryDistributionData(),
      getRegionDistributionData(),
      getPaymentDistributionData(),
      getBarChartData(),
      getAreaChartData(),
      getHeatmapData(),
    ])

    // 从API响应中提取实际数据
    salesTrendData.value = salesResponse.data
    userGrowthData.value = userResponse.data
    categoryDistributionData.value = categoryResponse.data
    regionDistributionData.value = regionResponse.data
    paymentDistributionData.value = paymentResponse.data
    barChartData.value = barResponse.data
    areaChartData.value = areaResponse.data
    heatmapData.value = heatResponse.data
  } catch (error) {
    message.error('加载图表数据失败')
    console.error('图表数据加载错误:', error)
  }
}

/**
 * 刷新热力图数据
 */
const refreshHeatmap = async (): Promise<void> => {
  try {
    const response = await getHeatmapData()
    heatmapData.value = response.data
    message.success('热力图数据已刷新')
  } catch (error) {
    message.error('刷新热力图数据失败')
  }
}

/**
 * 加载数据概览
 */
const loadOverviewData = async (): Promise<void> => {
  try {
    const response = await getOverviewData()
    overview.value = response.data
  } catch (error) {
    message.error('加载概览数据失败')
    console.error('概览数据加载错误:', error)
  }
}

/**
 * 加载实时数据
 */
const loadRealtimeData = async (): Promise<void> => {
  try {
    // 实时数据现在从getOverviewData中获取，这里只更新时间戳
    const response = await getRealtimeData()
    realtimeData.value = response.data
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
    const dateRageFormat = dateRange.value.map((item) => dayjs(item).format('YYYY-MM-DD'))
    const dateRangeParams = {
      startDate: dateRageFormat[0],
      endDate: dateRageFormat[1],
    }

    let response: any

    // 根据表格类型调用对应的API接口
    if (tableDataType.value === 'products') {
      response = await getProductData(tablePagination, dateRangeParams)
    } else if (tableDataType.value === 'users') {
      response = await getUserData(tablePagination, dateRangeParams)
    } else if (tableDataType.value === 'orders') {
      response = await getOrderData(tablePagination, dateRangeParams)
    } else {
      throw new Error(`Unsupported table data type: ${tableDataType.value}`)
    }

    // 验证响应数据结构
    if (!response?.data || !Array.isArray(response.data.list)) {
      throw new Error('Invalid table data response')
    }

    // 根据类型安全地赋值数据
    const tableDataResponse = response.data
    const cleanedData = tableDataResponse.list

    if (tableDataType.value === 'products') {
      tableData.products = cleanedData as ProductDataItem[]
    } else if (tableDataType.value === 'users') {
      tableData.users = cleanedData as UserDataItem[]
    } else if (tableDataType.value === 'orders') {
      tableData.orders = cleanedData as OrderDataItem[]
    }

    // 更新分页信息
    tablePagination.total = tableDataResponse.total || 0
    tablePagination.current = tableDataResponse.current || tablePagination.current
    tablePagination.pageSize = tableDataResponse.pageSize || tablePagination.pageSize
  } catch (error) {
    message.error('加载表格数据失败')
    console.error('表格数据加载错误:', error)
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
const refreshData = async (): Promise<void> => {
  await Promise.all([loadOverviewData(), loadRealtimeData(), loadTableData(), loadChartsData()])
  message.success('数据已刷新')
}

// 图表类型变化通过computed属性自动响应，无需额外监听

/**
 * 组件挂载时初始化
 */
onMounted(async () => {
  // loadOverviewData现在同时加载overview和realtime数据
  await Promise.all([loadOverviewData(), loadTableData(), loadChartsData()])

  if (realtimeEnabled.value) {
    startRealtimeUpdate()
  }

  // 图表已通过HighChart组件自动处理窗口大小变化
})

/**
 * 组件卸载时清理
 */
onUnmounted(() => {
  stopRealtimeUpdate()

  // 图表已通过HighChart组件自动清理

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

.advanced-charts-section {
  margin-top: 24px;
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
