<template>
  <div class="dashboard-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">仪表盘</h1>
      <p class="page-subtitle">欢迎回来，这里是您的数据概览</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-blue-500">
          <UserOutlined class="text-white text-2xl" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ stats.totalUsers }}</h3>
          <p class="stat-label">总用户数</p>
          <span class="stat-change positive">+12%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-green-500">
          <ShoppingOutlined class="text-white text-2xl" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ stats.totalProducts }}</h3>
          <p class="stat-label">商品总数</p>
          <span class="stat-change positive">+8%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-orange-500">
          <FileTextOutlined class="text-white text-2xl" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ stats.totalOrders }}</h3>
          <p class="stat-label">订单总数</p>
          <span class="stat-change positive">+15%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-purple-500">
          <DollarOutlined class="text-white text-2xl" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">¥{{ stats.totalRevenue }}</h3>
          <p class="stat-label">总收入</p>
          <span class="stat-change positive">+23%</span>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 销售趋势图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">销售趋势</h3>
          <a-select v-model:value="salesPeriod" class="chart-select">
            <a-select-option value="7d">最近7天</a-select-option>
            <a-select-option value="30d">最近30天</a-select-option>
            <a-select-option value="90d">最近90天</a-select-option>
          </a-select>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <LineChartOutlined class="text-6xl text-gray-300" />
            <p class="text-gray-500 mt-4">销售趋势图表</p>
          </div>
        </div>
      </div>

      <!-- 订单状态分布 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">订单状态分布</h3>
        </div>
        <div class="chart-content">
          <div class="order-status-list">
            <div class="status-item" v-for="item in orderStatusData" :key="item.status">
              <div class="status-indicator" :style="{ backgroundColor: item.color }"></div>
              <span class="status-label">{{ item.label }}</span>
              <span class="status-count">{{ item.count }}</span>
              <span class="status-percentage">{{ item.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="activity-section">
      <div class="section-header">
        <h3 class="section-title">最近活动</h3>
        <a-button type="link">查看全部</a-button>
      </div>
      
      <div class="activity-list">
        <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
          <div class="activity-avatar">
            <a-avatar :src="activity.avatar" :style="{ backgroundColor: activity.color }">
              {{ activity.name.charAt(0) }}
            </a-avatar>
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.text }}</p>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
          <div class="activity-type">
            <a-tag :color="activity.typeColor">{{ activity.type }}</a-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  DollarOutlined,
  LineChartOutlined
} from '@ant-design/icons-vue'

interface Stats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: string
}

interface OrderStatus {
  status: string
  label: string
  count: number
  percentage: number
  color: string
}

interface Activity {
  id: number
  name: string
  avatar?: string
  color: string
  text: string
  time: string
  type: string
  typeColor: string
}

const salesPeriod = ref('30d')

const stats = reactive<Stats>({
  totalUsers: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: '0'
})

const orderStatusData = ref<OrderStatus[]>([
  { status: 'pending', label: '待处理', count: 45, percentage: 25, color: '#faad14' },
  { status: 'processing', label: '处理中', count: 32, percentage: 18, color: '#1890ff' },
  { status: 'shipped', label: '已发货', count: 68, percentage: 38, color: '#52c41a' },
  { status: 'delivered', label: '已完成', count: 34, percentage: 19, color: '#722ed1' }
])

const recentActivities = ref<Activity[]>([
  {
    id: 1,
    name: '张三',
    color: '#1890ff',
    text: '创建了新订单 #12345',
    time: '2分钟前',
    type: '订单',
    typeColor: 'blue'
  },
  {
    id: 2,
    name: '李四',
    color: '#52c41a',
    text: '更新了商品库存',
    time: '5分钟前',
    type: '库存',
    typeColor: 'green'
  },
  {
    id: 3,
    name: '王五',
    color: '#faad14',
    text: '注册了新账户',
    time: '10分钟前',
    type: '用户',
    typeColor: 'orange'
  },
  {
    id: 4,
    name: '赵六',
    color: '#f5222d',
    text: '取消了订单 #12340',
    time: '15分钟前',
    type: '订单',
    typeColor: 'red'
  }
])

/**
 * 加载统计数据
 */
const loadStats = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    stats.totalUsers = 1234
    stats.totalProducts = 567
    stats.totalOrders = 890
    stats.totalRevenue = '123,456'
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

/**
 * 数字动画效果
 */
const animateNumber = (target: number, key: keyof Stats) => {
  const start = 0
  const duration = 1000
  const startTime = Date.now()
  
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const current = Math.floor(start + (target - start) * progress)
    
    if (key === 'totalRevenue') {
      stats[key] = current.toLocaleString()
    } else {
      (stats as any)[key] = current
    }
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  animate()
}

onMounted(() => {
  loadStats()
  
  // 启动数字动画
  setTimeout(() => {
    animateNumber(1234, 'totalUsers')
    animateNumber(567, 'totalProducts')
    animateNumber(890, 'totalOrders')
    animateNumber(123456, 'totalRevenue')
  }, 500)
})
</script>

<style scoped>
.dashboard-container {
  @apply p-6 space-y-6;
}

.page-header {
  @apply mb-8;
}

.page-title {
  @apply text-3xl font-bold text-gray-800 mb-2;
}

.page-subtitle {
  @apply text-gray-600 text-lg;
}

.stats-grid {
  @apply flex flex-wrap gap-6;
  
  > * {
    @apply flex-1 min-w-0;
  }
  
  @media (min-width: 768px) {
    > * {
      @apply min-w-[calc(50%-12px)];
    }
  }
  
  @media (min-width: 1024px) {
    > * {
      @apply min-w-[calc(25%-18px)];
    }
  }
}

.stat-card {
  @apply bg-white rounded-lg shadow-sm border p-6 flex items-center space-x-4 hover:shadow-md transition-shadow;
}

.stat-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center;
}

.stat-content {
  @apply flex-1;
}

.stat-number {
  @apply text-2xl font-bold text-gray-800 mb-1;
}

.stat-label {
  @apply text-gray-600 text-sm mb-2;
}

.stat-change {
  @apply text-xs font-medium px-2 py-1 rounded-full;
}

.stat-change.positive {
  @apply bg-green-100 text-green-600;
}

.charts-grid {
  @apply flex flex-wrap gap-6;
  
  > * {
    @apply flex-1 min-w-0;
  }
  
  @media (min-width: 1024px) {
    > * {
      @apply min-w-[calc(50%-12px)];
    }
  }
}

.chart-card {
  @apply bg-white rounded-lg shadow-sm border;
}

.chart-header {
  @apply flex items-center justify-between p-6 border-b;
}

.chart-title {
  @apply text-lg font-semibold text-gray-800;
}

.chart-select {
  @apply w-32;
}

.chart-content {
  @apply p-6;
}

.chart-placeholder {
  @apply flex flex-col items-center justify-center h-64;
}

.order-status-list {
  @apply space-y-4;
}

.status-item {
  @apply flex items-center space-x-3;
}

.status-indicator {
  @apply w-3 h-3 rounded-full;
}

.status-label {
  @apply flex-1 text-gray-700;
}

.status-count {
  @apply font-semibold text-gray-800;
}

.status-percentage {
  @apply text-gray-500 text-sm w-12 text-right;
}

.activity-section {
  @apply bg-white rounded-lg shadow-sm border;
}

.section-header {
  @apply flex items-center justify-between p-6 border-b;
}

.section-title {
  @apply text-lg font-semibold text-gray-800;
}

.activity-list {
  @apply divide-y;
}

.activity-item {
  @apply flex items-center space-x-4 p-6 hover:bg-gray-50 transition-colors;
}

.activity-avatar {
  @apply flex-shrink-0;
}

.activity-content {
  @apply flex-1;
}

.activity-text {
  @apply text-gray-800 mb-1;
}

.activity-time {
  @apply text-gray-500 text-sm;
}

.activity-type {
  @apply flex-shrink-0;
}


</style>