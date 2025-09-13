<template>
  <div class="user-stats-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">用户统计</h2>
        <p class="page-description">分析用户行为数据，了解用户画像和活跃度</p>
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

    <!-- 用户概览指标 -->
    <div class="overview-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="总用户数"
              :value="overview.totalUsers"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <UserOutlined />
              </template>
              <template #suffix>
                <span class="trend-indicator" :class="overview.usersTrend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="overview.usersTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(overview.usersTrend) }}%
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="活跃用户"
              :value="overview.activeUsers"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <HeartOutlined />
              </template>
              <template #suffix>
                <span class="trend-indicator" :class="overview.activeTrend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="overview.activeTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(overview.activeTrend) }}%
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="新增用户"
              :value="overview.newUsers"
              :value-style="{ color: '#722ed1' }"
            >
              <template #prefix>
                <UserAddOutlined />
              </template>
              <template #suffix>
                <span class="trend-indicator" :class="overview.newUsersTrend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="overview.newUsersTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(overview.newUsersTrend) }}%
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="留存率"
              :value="overview.retentionRate"
              :precision="2"
              suffix="%"
              :value-style="{ color: '#fa8c16' }"
            >
              <template #prefix>
                <RetweetOutlined />
              </template>
              <template #suffix>
                <span class="trend-indicator" :class="overview.retentionTrend > 0 ? 'positive' : 'negative'">
                  <ArrowUpOutlined v-if="overview.retentionTrend > 0" />
                  <ArrowDownOutlined v-else />
                  {{ Math.abs(overview.retentionTrend) }}%
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
        <!-- 用户增长趋势 -->
        <a-col :span="12">
          <a-card title="用户增长趋势" class="chart-card">
            <template #extra>
              <a-radio-group v-model:value="growthPeriod" @change="handleGrowthPeriodChange">
                <a-radio-button value="day">日</a-radio-button>
                <a-radio-button value="week">周</a-radio-button>
                <a-radio-button value="month">月</a-radio-button>
              </a-radio-group>
            </template>
            <HighChart :options="userChartConfigs.growthChart" :height="'300px'" />
          </a-card>
        </a-col>
        
        <!-- 用户活跃度分布 -->
        <a-col :span="12">
          <a-card title="用户活跃度分布" class="chart-card">
            <HighChart :options="userChartConfigs.activityChart" :height="'300px'" />
          </a-card>
        </a-col>
      </a-row>
      
      <a-row :gutter="16" style="margin-top: 16px">
        <!-- 用户年龄分布 -->
        <a-col :span="8">
          <a-card title="年龄分布" class="chart-card">
            <HighChart :options="userChartConfigs.ageChart" :height="'250px'" />
          </a-card>
        </a-col>
        
        <!-- 用户地域分布 -->
        <a-col :span="8">
          <a-card title="地域分布" class="chart-card">
            <HighChart :options="userChartConfigs.regionChart" :height="'250px'" />
          </a-card>
        </a-col>
        
        <!-- 设备类型分布 -->
        <a-col :span="8">
          <a-card title="设备类型" class="chart-card">
            <HighChart :options="userChartConfigs.deviceChart" :height="'250px'" />
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 用户行为分析 -->
    <div class="behavior-section">
      <a-row :gutter="16">
        <!-- 用户行为漏斗 -->
        <a-col :span="12">
          <a-card title="用户行为漏斗" class="chart-card">
            <div class="funnel-container">
              <div class="funnel-item" v-for="(item, index) in funnelData" :key="index">
                <div class="funnel-bar" :style="{ width: `${item.percentage}%` }">
                  <span class="funnel-label">{{ item.name }}</span>
                  <span class="funnel-value">{{ item.value }}</span>
                </div>
                <div class="funnel-percentage">{{ item.percentage }}%</div>
              </div>
            </div>
          </a-card>
        </a-col>
        
        <!-- 用户留存分析 -->
        <a-col :span="12">
          <a-card title="用户留存分析" class="chart-card">
            <div class="retention-container">
              <div class="retention-header">
                <div class="retention-cell">日期</div>
                <div class="retention-cell">新增用户</div>
                <div class="retention-cell">次日留存</div>
                <div class="retention-cell">7日留存</div>
                <div class="retention-cell">30日留存</div>
              </div>
              <div class="retention-row" v-for="item in retentionData" :key="item.date">
                <div class="retention-cell">{{ item.date }}</div>
                <div class="retention-cell">{{ item.newUsers }}</div>
                <div class="retention-cell">
                  <span :class="getRetentionClass(item.day1)">{{ item.day1 }}%</span>
                </div>
                <div class="retention-cell">
                  <span :class="getRetentionClass(item.day7)">{{ item.day7 }}%</span>
                </div>
                <div class="retention-cell">
                  <span :class="getRetentionClass(item.day30)">{{ item.day30 }}%</span>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 用户详细列表 -->
    <div class="table-section">
      <a-card title="用户详细数据">
        <template #extra>
          <a-space>
            <a-input
              v-model:value="searchKeyword"
              placeholder="搜索用户"
              allow-clear
              @change="handleSearch"
              style="width: 200px"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
            <a-select
              v-model:value="statusFilter"
              placeholder="用户状态"
              allow-clear
              @change="handleSearch"
              style="width: 120px"
            >
              <a-select-option value="active">活跃</a-select-option>
              <a-select-option value="inactive">不活跃</a-select-option>
              <a-select-option value="new">新用户</a-select-option>
            </a-select>
            <a-select
              v-model:value="regionFilter"
              placeholder="地区"
              allow-clear
              @change="handleSearch"
              style="width: 120px"
            >
              <a-select-option value="华东">华东</a-select-option>
              <a-select-option value="华北">华北</a-select-option>
              <a-select-option value="华南">华南</a-select-option>
            </a-select>
          </a-space>
        </template>
        
        <a-table
          :columns="tableColumns"
          :data-source="userData"
          :loading="tableLoading"
          :pagination="pagination"
          :scroll="{ x: 1400 }"
          @change="handleTableChange"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'user'">
              <div class="user-info">
                <a-avatar :src="record.avatar" size="small" style="margin-right: 8px">
                  <template #icon>
                    <UserOutlined />
                  </template>
                </a-avatar>
                <div class="user-details">
                  <div class="user-name">{{ record.name }}</div>
                  <div class="user-email">{{ record.email }}</div>
                </div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'status'">
              <a-tag :color="getUserStatusColor(record.status)">
                {{ getUserStatusText(record.status) }}
              </a-tag>
            </template>
            
            <template v-else-if="column.key === 'activity'">
              <div class="activity-indicator">
                <div class="activity-score" :class="getActivityClass(record.activityScore)">
                  {{ record.activityScore }}
                </div>
                <div class="activity-level">{{ getActivityLevel(record.activityScore) }}</div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'value'">
              <span class="user-value">¥{{ record.totalValue.toFixed(2) }}</span>
            </template>
            
            <template v-else-if="column.key === 'lastActive'">
              <div class="last-active">
                <div>{{ record.lastActiveTime }}</div>
                <div class="active-duration">{{ getActiveDuration(record.lastActiveTime) }}</div>
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
  UserOutlined,
  HeartOutlined,
  UserAddOutlined,
  RetweetOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, TableProps } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import dayjs, { type Dayjs } from 'dayjs'
import HighChart from '@/components/common/HighChart.vue'
import { userChartConfigs } from '@/config/charts/chartConfigs'

/**
 * 用户统计页面
 */

interface UserOverview {
  totalUsers: number
  activeUsers: number
  newUsers: number
  retentionRate: number
  usersTrend: number
  activeTrend: number
  newUsersTrend: number
  retentionTrend: number
}

interface UserItem {
  id: string
  name: string
  email: string
  avatar?: string
  status: string
  activityScore: number
  totalValue: number
  orderCount: number
  region: string
  device: string
  registerTime: string
  lastActiveTime: string
}

interface FunnelItem {
  name: string
  value: number
  percentage: number
}

interface RetentionItem {
  date: string
  newUsers: number
  day1: number
  day7: number
  day30: number
}

// 响应式数据
const tableLoading = ref(false)
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(30, 'day'), dayjs()])
const growthPeriod = ref('day')
const searchKeyword = ref('')
const statusFilter = ref<string | undefined>(undefined)
const regionFilter = ref<string | undefined>(undefined)
const userData = ref<UserItem[]>([])

// 图表引用已移除，使用 HighChart 组件

// 用户概览数据
const overview = ref<UserOverview>({
  totalUsers: 0,
  activeUsers: 0,
  newUsers: 0,
  retentionRate: 0,
  usersTrend: 0,
  activeTrend: 0,
  newUsersTrend: 0,
  retentionTrend: 0,
})

// 漏斗数据
const funnelData = ref<FunnelItem[]>([])

// 留存数据
const retentionData = ref<RetentionItem[]>([])

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
    title: '用户信息',
    key: 'user',
    width: 200,
    fixed: 'left',
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '活跃度',
    key: 'activity',
    width: 120,
    sorter: true,
  },
  {
    title: '消费金额',
    key: 'value',
    width: 120,
    sorter: true,
  },
  {
    title: '订单数',
    dataIndex: 'orderCount',
    key: 'orderCount',
    width: 100,
    sorter: true,
  },
  {
    title: '地区',
    dataIndex: 'region',
    key: 'region',
    width: 100,
  },
  {
    title: '设备',
    dataIndex: 'device',
    key: 'device',
    width: 100,
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
    key: 'registerTime',
    width: 160,
  },
  {
    title: '最后活跃',
    key: 'lastActive',
    width: 160,
  },
]

/**
 * 获取用户状态颜色
 */
const getUserStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    active: 'green',
    inactive: 'red',
    new: 'blue',
    vip: 'gold',
  }
  return colorMap[status] || 'default'
}

/**
 * 获取用户状态文本
 */
const getUserStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    active: '活跃',
    inactive: '不活跃',
    new: '新用户',
    vip: 'VIP',
  }
  return textMap[status] || status
}

/**
 * 获取活跃度样式类
 */
const getActivityClass = (score: number): string => {
  if (score >= 80) return 'high-activity'
  if (score >= 60) return 'medium-activity'
  return 'low-activity'
}

/**
 * 获取活跃度等级
 */
const getActivityLevel = (score: number): string => {
  if (score >= 80) return '高活跃'
  if (score >= 60) return '中活跃'
  return '低活跃'
}

/**
 * 获取留存率样式类
 */
const getRetentionClass = (rate: number): string => {
  if (rate >= 70) return 'high-retention'
  if (rate >= 40) return 'medium-retention'
  return 'low-retention'
}

/**
 * 获取活跃时长
 */
const getActiveDuration = (lastActiveTime: string): string => {
  const now = dayjs()
  const lastActive = dayjs(lastActiveTime)
  const diff = now.diff(lastActive, 'hour')
  
  if (diff < 1) return '刚刚活跃'
  if (diff < 24) return `${diff}小时前`
  if (diff < 24 * 7) return `${Math.floor(diff / 24)}天前`
  return '很久未活跃'
}

/**
 * 加载用户数据
 */
const loadUserData = async (): Promise<void> => {
  tableLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟概览数据
    overview.value = {
      totalUsers: 12345,
      activeUsers: 8765,
      newUsers: 234,
      retentionRate: 68.5,
      usersTrend: 8.2,
      activeTrend: 12.5,
      newUsersTrend: -3.1,
      retentionTrend: 5.7,
    }
    
    // 模拟漏斗数据
    funnelData.value = [
      { name: '访问', value: 10000, percentage: 100 },
      { name: '注册', value: 3000, percentage: 30 },
      { name: '首次购买', value: 1200, percentage: 12 },
      { name: '复购', value: 600, percentage: 6 },
      { name: '推荐', value: 180, percentage: 1.8 },
    ]
    
    // 模拟留存数据
    retentionData.value = [
      { date: '2024-01-15', newUsers: 234, day1: 75.2, day7: 45.6, day30: 28.3 },
      { date: '2024-01-14', newUsers: 189, day1: 72.5, day7: 42.8, day30: 25.9 },
      { date: '2024-01-13', newUsers: 267, day1: 78.1, day7: 48.3, day30: 31.2 },
      { date: '2024-01-12', newUsers: 198, day1: 69.7, day7: 38.9, day30: 22.7 },
      { date: '2024-01-11', newUsers: 223, day1: 76.2, day7: 44.4, day30: 27.8 },
    ]
    
    // 模拟用户详细数据
    const mockData: UserItem[] = [
      {
        id: '1',
        name: '张三',
        email: 'zhangsan@example.com',
        status: 'active',
        activityScore: 85,
        totalValue: 12580.50,
        orderCount: 15,
        region: '华东',
        device: 'iOS',
        registerTime: '2023-06-15 10:30:00',
        lastActiveTime: '2024-01-15 14:25:00',
      },
      {
        id: '2',
        name: '李四',
        email: 'lisi@example.com',
        status: 'vip',
        activityScore: 92,
        totalValue: 25680.00,
        orderCount: 28,
        region: '华北',
        device: 'Android',
        registerTime: '2023-03-22 16:45:00',
        lastActiveTime: '2024-01-15 09:15:00',
      },
      {
        id: '3',
        name: '王五',
        email: 'wangwu@example.com',
        status: 'new',
        activityScore: 45,
        totalValue: 1280.00,
        orderCount: 2,
        region: '华南',
        device: 'Web',
        registerTime: '2024-01-10 20:15:00',
        lastActiveTime: '2024-01-14 18:30:00',
      },
    ]
    
    userData.value = mockData
    pagination.total = mockData.length
    
    // 图表已通过HighChart组件自动渲染
  } catch (__error) {
    message.error('加载用户数据失败')
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
    loadUserData()
  }
}

/**
 * 处理增长周期变化
 */
const handleGrowthPeriodChange = (): void => {
  // 图表会自动响应数据变化
}

/**
 * 搜索处理
 */
const handleSearch = debounce((): void => {
  pagination.current = 1
  loadUserData()
}, 300)

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 20
  loadUserData()
}

/**
 * 刷新数据
 */
const refreshData = (): void => {
  loadUserData()
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
  loadUserData()
})
</script>

<style scoped lang="less">
.user-stats-view {
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

.behavior-section {
  margin-bottom: 24px;
  
  .funnel-container {
    padding: 16px 0;
    
    .funnel-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      
      .funnel-bar {
        background: linear-gradient(90deg, #1890ff, #40a9ff);
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        min-width: 200px;
      }
      
      .funnel-percentage {
        margin-left: 16px;
        font-weight: 600;
        color: #1890ff;
      }
    }
  }
  
  .retention-container {
    .retention-header {
      display: flex;
      background: #fafafa;
      border-radius: 4px 4px 0 0;
      
      .retention-cell {
        flex: 1;
        padding: 12px;
        text-align: center;
        font-weight: 600;
        border-right: 1px solid #f0f0f0;
        
        &:last-child {
          border-right: none;
        }
      }
    }
    
    .retention-row {
      display: flex;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .retention-cell {
        flex: 1;
        padding: 12px;
        text-align: center;
        border-right: 1px solid #f0f0f0;
        
        &:last-child {
          border-right: none;
        }
        
        .high-retention {
          color: #52c41a;
          font-weight: 600;
        }
        
        .medium-retention {
          color: #fa8c16;
          font-weight: 500;
        }
        
        .low-retention {
          color: #ff4d4f;
          font-weight: 500;
        }
      }
    }
  }
}

.table-section {
  .user-info {
    display: flex;
    align-items: center;
    
    .user-details {
      .user-name {
        font-weight: 500;
        color: #262626;
        margin-bottom: 2px;
      }
      
      .user-email {
        font-size: 12px;
        color: #8c8c8c;
      }
    }
  }
  
  .activity-indicator {
    text-align: center;
    
    .activity-score {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
      
      &.high-activity {
        color: #52c41a;
      }
      
      &.medium-activity {
        color: #fa8c16;
      }
      
      &.low-activity {
        color: #ff4d4f;
      }
    }
    
    .activity-level {
      font-size: 12px;
      color: #8c8c8c;
    }
  }
  
  .user-value {
    font-weight: 600;
    color: #722ed1;
  }
  
  .last-active {
    .active-duration {
      font-size: 12px;
      color: #8c8c8c;
      margin-top: 2px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-stats-view {
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
  
  .behavior-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
}
</style>