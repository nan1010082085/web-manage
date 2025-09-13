<template>
  <div class="advanced-charts">
    <!-- 订单状态分布 -->
    <LazyChart :threshold="0.1" root-margin="100px">
      <template #default="{ isVisible }">
        <ChartCard
          v-if="isVisible"
          title="订单状态分布"
          :options="orderStatusChart.chartOptions.value"
          :loading="orderStatusChart.loading.value"
          height="300px"
          @refresh="debouncedLoadOrderStatus"
          @chart-created="onOrderStatusReady"
        />
      </template>
    </LazyChart>

    <!-- 商品销售排行 -->
    <LazyChart :threshold="0.1" root-margin="100px">
      <template #default="{ isVisible }">
        <ChartCard
          v-if="isVisible"
          title="商品销售排行"
          :options="productRankingChart.chartOptions.value"
          :loading="productRankingChart.loading.value"
          height="350px"
          @refresh="() => debouncedLoadProductRanking({ type: productRankingType })"
          @chart-created="onProductRankingReady"
        >
          <template #extra="{ loading }">
            <a-radio-group
              v-model:value="productRankingType"
              @change="() => debouncedLoadProductRanking({ type: productRankingType })"
              :disabled="loading"
            >
              <a-radio-button value="sales">销售额</a-radio-button>
              <a-radio-button value="quantity">销量</a-radio-button>
            </a-radio-group>
          </template>
        </ChartCard>
      </template>
    </LazyChart>

    <!-- 用户活跃度分析 -->
    <LazyChart :threshold="0.1" root-margin="100px">
      <template #default="{ isVisible }">
        <ChartCard
          v-if="isVisible"
          title="用户活跃度分析"
          :options="userActivityChart.chartOptions.value"
          :loading="userActivityChart.loading.value"
          height="350px"
          @refresh="() => debouncedLoadUserActivity({ period: userActivityPeriod })"
          @chart-created="onUserActivityReady"
        >
          <template #extra="{ loading }">
            <a-select
              v-model:value="userActivityPeriod"
              @change="() => debouncedLoadUserActivity({ period: userActivityPeriod })"
              style="width: 120px"
              :disabled="loading"
            >
              <a-select-option value="week">本周</a-select-option>
              <a-select-option value="month">本月</a-select-option>
              <a-select-option value="quarter">本季度</a-select-option>
            </a-select>
          </template>
        </ChartCard>
      </template>
    </LazyChart>

    <!-- 地区销售热力图 -->
    <LazyChart :threshold="0.1" root-margin="100px">
      <template #default="{ isVisible }">
        <ChartCard
          v-if="isVisible"
          title="地区销售热力图"
          :options="regionSalesChart.chartOptions.value"
          :loading="regionSalesChart.loading.value"
          height="400px"
          @refresh="() => debouncedLoadRegionSales({ metric: regionMetric })"
          @chart-created="onRegionSalesReady"
        >
          <template #extra="{ loading }">
            <a-space>
              <a-select
                v-model:value="regionMetric"
                @change="() => debouncedLoadRegionSales({ metric: regionMetric })"
                style="width: 100px"
                :disabled="loading"
              >
                <a-select-option value="sales">销售额</a-select-option>
                <a-select-option value="orders">订单量</a-select-option>
              </a-select>
              <a-button
                @click="() => debouncedLoadRegionSales({ metric: regionMetric })"
                :loading="loading"
              >
                <template #icon><ReloadOutlined /></template>
              </a-button>
            </a-space>
          </template>
        </ChartCard>
      </template>
    </LazyChart>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import ChartCard from './ChartCard.vue'
import LazyChart from './LazyChart.vue'
import { useChartData } from '@/hooks/useChartData'
import { useChartDataCache, useChartPerformanceMonitor } from '@/hooks/useChartPerformance'
import { advancedChartConfigs } from '@/config/charts/chartConfigs'
import {
  getOrderStatusData,
  getProductRankingData,
  getUserActivityData,
  getRegionSalesData,
} from '@/api/charts'
import {
  createOrderStatusConfig,
  createProductRankingConfig,
  createUserActivityConfig,
  createRegionSalesConfig,
  applyResponsiveConfig,
} from '@/utils/chartUtils'

/**
 * 组件名称
 */
defineOptions({
  name: 'AdvancedCharts',
})

// 控制参数
const productRankingType = ref<'sales' | 'quantity'>('sales')
const userActivityPeriod = ref<'week' | 'month' | 'quarter'>('week')
const regionMetric = ref<'sales' | 'orders'>('sales')

// 性能优化
const chartCache = useChartDataCache('advanced-charts', {
  ttl: 10 * 60 * 1000, // 10分钟缓存
  maxSize: 20,
})
const performanceMonitor = useChartPerformanceMonitor()

// 防抖处理的数据加载函数
const debouncedLoadOrderStatus = chartCache.createDebounced(() => orderStatusChart.loadData(), {
  delay: 300,
})
const debouncedLoadProductRanking = chartCache.createDebounced(
  (params: { type: 'sales' | 'quantity' }) => productRankingChart.loadData(params),
  { delay: 300 },
)
const debouncedLoadUserActivity = chartCache.createDebounced(
  (params: { period: 'week' | 'month' | 'quarter' }) => userActivityChart.loadData(params),
  { delay: 300 },
)
const debouncedLoadRegionSales = chartCache.createDebounced(
  (params: { metric: 'sales' | 'orders' }) => regionSalesChart.loadData(params),
  { delay: 300 },
)

// 图表数据管理（集成缓存）
const orderStatusChart = useChartData({
  loader: (params) => chartCache.withCache(getOrderStatusData, params),
  configGenerator: performanceMonitor.withPerformanceMonitor((data, baseConfig) =>
    applyResponsiveConfig(createOrderStatusConfig(data, baseConfig)),
  ),
  baseConfig: advancedChartConfigs.orderStatus,
  initialData: [],
  errorMessagePrefix: '订单状态数据',
  successMessagePrefix: '订单状态数据',
})

const productRankingChart = useChartData({
  loader: (params) => chartCache.withCache(getProductRankingData, params),
  configGenerator: performanceMonitor.withPerformanceMonitor((data, baseConfig) =>
    applyResponsiveConfig(createProductRankingConfig(data, baseConfig)),
  ),
  baseConfig: advancedChartConfigs.productRanking,
  initialData: null,
  errorMessagePrefix: '商品排行数据',
  successMessagePrefix: '商品排行数据',
})

const userActivityChart = useChartData({
  loader: (params) => chartCache.withCache(getUserActivityData, params),
  configGenerator: performanceMonitor.withPerformanceMonitor((data, baseConfig) =>
    applyResponsiveConfig(createUserActivityConfig(data, baseConfig)),
  ),
  baseConfig: advancedChartConfigs.userActivity,
  initialData: { categories: [], series: [] },
  errorMessagePrefix: '用户活跃度数据',
  successMessagePrefix: '用户活跃度数据',
})

const regionSalesChart = useChartData({
  loader: (params) => chartCache.withCache(getRegionSalesData, params),
  configGenerator: performanceMonitor.withPerformanceMonitor((data, baseConfig) =>
    applyResponsiveConfig(createRegionSalesConfig(data, baseConfig)),
  ),
  baseConfig: advancedChartConfigs.regionSales,
  initialData: [],
  errorMessagePrefix: '地区销售数据',
  successMessagePrefix: '地区销售数据',
})

/**
 * 图表就绪事件处理
 */
const onOrderStatusReady = (chartInstance: any): void => {
  console.log('订单状态图表已就绪')
}

const onProductRankingReady = (chartInstance: any): void => {
  console.log('商品排行图表已就绪')
}

const onUserActivityReady = (chartInstance: any): void => {
  console.log('用户活跃度图表已就绪')
}

const onRegionSalesReady = (chartInstance: any): void => {
  console.log('地区销售图表已就绪')
}

/**
 * 商品排行类型变更处理
 */
const handleProductRankingTypeChange = (type: 'sales' | 'quantity'): void => {
  productRankingType.value = type
  debouncedLoadProductRanking({ type })
}

/**
 * 用户活跃度周期变更处理
 */
const handleUserActivityPeriodChange = (period: 'week' | 'month' | 'quarter'): void => {
  userActivityPeriod.value = period
  debouncedLoadUserActivity({ period })
}

/**
 * 地区销售指标变更处理
 */
const handleRegionMetricChange = (metric: 'sales' | 'orders'): void => {
  regionMetric.value = metric
  debouncedLoadRegionSales({ metric })
}

/**
 * 预加载常用数据组合
 */
const preloadCommonData = async (): Promise<void> => {
  const commonParams = [
    { type: 'sales' as const },
    { type: 'quantity' as const },
    { period: 'week' as const },
    { period: 'month' as const },
    { metric: 'sales' as const },
    { metric: 'orders' as const },
  ]

  await Promise.allSettled([
    chartCache.preloadData(getProductRankingData, [commonParams[0], commonParams[1]]),
    chartCache.preloadData(getUserActivityData, [commonParams[2], commonParams[3]]),
    chartCache.preloadData(getRegionSalesData, [commonParams[4], commonParams[5]]),
  ])
}

// 组件挂载时加载数据
onMounted(async () => {
  // 立即加载当前配置的数据
  await Promise.all([
    orderStatusChart.loadData(),
    productRankingChart.loadData({ type: productRankingType.value }),
    userActivityChart.loadData({ period: userActivityPeriod.value }),
    regionSalesChart.loadData({ metric: regionMetric.value }),
  ])

  // 后台预加载其他常用数据
  setTimeout(preloadCommonData, 2000)
})
</script>

<style scoped>
.advanced-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 16px;
  padding: 16px;
}

.chart-card {
  height: fit-content;
}

.chart-card :deep(.ant-card-body) {
  padding: 16px;
}

.chart-card :deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .advanced-charts {
    grid-template-columns: 1fr;
    padding: 8px;
  }
}
</style>
