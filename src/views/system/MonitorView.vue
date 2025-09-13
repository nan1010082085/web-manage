<template>
  <div class="monitor-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">系统监控</h2>
        <p class="page-description">实时监控系统运行状态，确保服务稳定运行</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-switch
            v-model:checked="autoRefresh"
            checked-children="自动刷新"
            un-checked-children="手动刷新"
            @change="handleAutoRefreshChange"
          />
          <a-select
            v-model:value="refreshInterval"
            @change="handleRefreshIntervalChange"
            style="width: 120px"
          >
            <a-select-option :value="5">5秒</a-select-option>
            <a-select-option :value="10">10秒</a-select-option>
            <a-select-option :value="30">30秒</a-select-option>
            <a-select-option :value="60">1分钟</a-select-option>
          </a-select>
          <a-button @click="refreshData">
            <ReloadOutlined />
            刷新
          </a-button>
          <a-button @click="exportReport">
            <DownloadOutlined />
            导出报告
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 系统状态概览 -->
    <div class="overview-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="status-card" :class="{ 'status-normal': systemStatus.overall === 'normal', 'status-warning': systemStatus.overall === 'warning', 'status-error': systemStatus.overall === 'error' }">
            <div class="status-content">
              <div class="status-icon">
                <CheckCircleOutlined v-if="systemStatus.overall === 'normal'" />
                <ExclamationCircleOutlined v-else-if="systemStatus.overall === 'warning'" />
                <CloseCircleOutlined v-else />
              </div>
              <div class="status-info">
                <div class="status-title">系统状态</div>
                <div class="status-value">{{ getStatusText(systemStatus.overall) }}</div>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="metric-card">
            <a-statistic
              title="在线用户"
              :value="systemMetrics.onlineUsers"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="metric-card">
            <a-statistic
              title="请求/分钟"
              :value="systemMetrics.requestsPerMinute"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <ApiOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="metric-card">
            <a-statistic
              title="响应时间"
              :value="systemMetrics.avgResponseTime"
              suffix="ms"
              :value-style="{ color: '#fa8c16' }"
            >
              <template #prefix>
                <ClockCircleOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 服务状态监控 -->
    <div class="services-section">
      <a-card title="服务状态">
        <template #extra>
          <a-button type="link" @click="refreshServices">
            <ReloadOutlined />
            刷新服务状态
          </a-button>
        </template>
        
        <a-row :gutter="16">
          <a-col :span="8" v-for="service in services" :key="service.name">
            <a-card class="service-card" size="small">
              <div class="service-header">
                <div class="service-name">{{ service.name }}</div>
                <a-tag :color="getServiceStatusColor(service.status)" class="service-status">
                  {{ service.status }}
                </a-tag>
              </div>
              <div class="service-metrics">
                <div class="metric-item">
                  <span class="metric-label">CPU:</span>
                  <span class="metric-value">{{ service.cpu }}%</span>
                  <a-progress
                    :percent="service.cpu"
                    :stroke-color="getProgressColor(service.cpu)"
                    size="small"
                    :show-info="false"
                  />
                </div>
                <div class="metric-item">
                  <span class="metric-label">内存:</span>
                  <span class="metric-value">{{ service.memory }}%</span>
                  <a-progress
                    :percent="service.memory"
                    :stroke-color="getProgressColor(service.memory)"
                    size="small"
                    :show-info="false"
                  />
                </div>
                <div class="metric-item">
                  <span class="metric-label">响应时间:</span>
                  <span class="metric-value">{{ service.responseTime }}ms</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">最后检查:</span>
                  <span class="metric-value">{{ service.lastCheck }}</span>
                </div>
              </div>
              <div class="service-actions">
                <a-button type="link" size="small" @click="viewServiceDetail(service)">
                  详情
                </a-button>
                <a-button type="link" size="small" @click="restartService(service)">
                  重启
                </a-button>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <!-- 系统资源监控 -->
    <div class="resources-section">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card title="CPU 使用率" class="chart-card">
            <template #extra>
              <a-radio-group v-model:value="cpuTimeRange" @change="handleCpuTimeRangeChange">
                <a-radio-button value="1h">1小时</a-radio-button>
                <a-radio-button value="6h">6小时</a-radio-button>
                <a-radio-button value="24h">24小时</a-radio-button>
              </a-radio-group>
            </template>
            <HighChart :options="monitorChartConfigs.cpuChart" :height="'300px'" />
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="内存使用率" class="chart-card">
            <template #extra>
              <a-radio-group v-model:value="memoryTimeRange" @change="handleMemoryTimeRangeChange">
                <a-radio-button value="1h">1小时</a-radio-button>
                <a-radio-button value="6h">6小时</a-radio-button>
                <a-radio-button value="24h">24小时</a-radio-button>
              </a-radio-group>
            </template>
            <HighChart :options="monitorChartConfigs.memoryChart" :height="'300px'" />
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 网络和磁盘监控 -->
    <div class="network-disk-section">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card title="网络流量" class="chart-card">
            <HighChart :options="monitorChartConfigs.networkChart" :height="'300px'" />
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="磁盘使用情况">
            <div class="disk-usage">
              <div class="disk-item" v-for="disk in diskUsage" :key="disk.name">
                <div class="disk-header">
                  <span class="disk-name">{{ disk.name }}</span>
                  <span class="disk-size">{{ disk.used }} / {{ disk.total }}</span>
                </div>
                <a-progress
                  :percent="disk.percentage"
                  :stroke-color="getProgressColor(disk.percentage)"
                  :status="disk.percentage > 90 ? 'exception' : 'normal'"
                />
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 告警信息 -->
    <div class="alerts-section">
      <a-card title="系统告警">
        <template #extra>
          <a-space>
            <a-select
              v-model:value="alertFilter"
              @change="handleAlertFilterChange"
              style="width: 120px"
            >
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="critical">严重</a-select-option>
              <a-select-option value="warning">警告</a-select-option>
              <a-select-option value="info">信息</a-select-option>
            </a-select>
            <a-button @click="clearAlerts">
              清除已读
            </a-button>
          </a-space>
        </template>
        
        <a-list
          :data-source="filteredAlerts"
          :pagination="{ pageSize: 5, showSizeChanger: false }"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a-button type="link" size="small" @click="markAsRead(item)">
                  标记已读
                </a-button>
                <a-button type="link" size="small" @click="viewAlertDetail(item)">
                  详情
                </a-button>
              </template>
              
              <a-list-item-meta>
                <template #avatar>
                  <a-avatar :style="{ backgroundColor: getAlertColor(item.level) }">
                    <ExclamationOutlined v-if="item.level === 'critical'" />
                    <WarningOutlined v-else-if="item.level === 'warning'" />
                    <InfoCircleOutlined v-else />
                  </a-avatar>
                </template>
                <template #title>
                  <div class="alert-title">
                    <span>{{ item.title }}</span>
                    <a-tag :color="getAlertColor(item.level)" size="small">
                      {{ getAlertLevelText(item.level) }}
                    </a-tag>
                  </div>
                </template>
                <template #description>
                  <div class="alert-description">
                    <div>{{ item.description }}</div>
                    <div class="alert-time">{{ item.timestamp }}</div>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </div>

    <!-- 服务详情弹窗 -->
    <a-modal
      v-model:open="serviceDetailModalVisible"
      :title="`${selectedService?.name} 服务详情`"
      :footer="null"
      width="800px"
     ok-text="确定" cancel-text="取消">
      <div class="service-detail" v-if="selectedService">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="服务名称">{{ selectedService.name }}</a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="getServiceStatusColor(selectedService.status)">
              {{ selectedService.status }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="版本">{{ selectedService.version }}</a-descriptions-item>
          <a-descriptions-item label="端口">{{ selectedService.port }}</a-descriptions-item>
          <a-descriptions-item label="启动时间">{{ selectedService.startTime }}</a-descriptions-item>
          <a-descriptions-item label="运行时长">{{ selectedService.uptime }}</a-descriptions-item>
          <a-descriptions-item label="CPU使用率">{{ selectedService.cpu }}%</a-descriptions-item>
          <a-descriptions-item label="内存使用率">{{ selectedService.memory }}%</a-descriptions-item>
          <a-descriptions-item label="平均响应时间">{{ selectedService.responseTime }}ms</a-descriptions-item>
          <a-descriptions-item label="请求总数">{{ selectedService.totalRequests }}</a-descriptions-item>
          <a-descriptions-item label="错误率">{{ selectedService.errorRate }}%</a-descriptions-item>
          <a-descriptions-item label="最后检查">{{ selectedService.lastCheck }}</a-descriptions-item>
        </a-descriptions>
        
        <div class="service-logs" style="margin-top: 16px;">
          <h4>最近日志</h4>
          <a-list
            :data-source="selectedService.recentLogs"
            size="small"
            :pagination="false"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <div class="log-item">
                  <span class="log-time">{{ item.timestamp }}</span>
                  <a-tag :color="getLevelColor(item.level)" size="small">
                    {{ item.level }}
                  </a-tag>
                  <span class="log-message">{{ item.message }}</span>
                </div>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import {
  ReloadOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  ExclamationOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue'
import HighChart from '@/components/common/HighChart.vue'
import { monitorChartConfigs } from '@/config/charts/chartConfigs'


/**
 * 系统监控页面
 */

interface SystemStatus {
  overall: 'normal' | 'warning' | 'error'
}

interface SystemMetrics {
  onlineUsers: number
  requestsPerMinute: number
  avgResponseTime: number
}

interface Service {
  name: string
  status: 'running' | 'stopped' | 'error'
  cpu: number
  memory: number
  responseTime: number
  lastCheck: string
  version?: string
  port?: number
  startTime?: string
  uptime?: string
  totalRequests?: number
  errorRate?: number
  recentLogs?: LogItem[]
}

interface LogItem {
  timestamp: string
  level: string
  message: string
}

interface DiskUsage {
  name: string
  used: string
  total: string
  percentage: number
}

interface Alert {
  id: string
  title: string
  description: string
  level: 'critical' | 'warning' | 'info'
  timestamp: string
  read: boolean
}

// 响应式数据
const autoRefresh = ref(true)
const refreshInterval = ref(10)
const cpuTimeRange = ref('1h')
const memoryTimeRange = ref('1h')
const alertFilter = ref('all')
const serviceDetailModalVisible = ref(false)
const selectedService = ref<Service | null>(null)
const refreshTimer = ref<NodeJS.Timeout | null>(null)

// 图表引用已移除，使用 HighChart 组件

// 系统状态
const systemStatus = ref<SystemStatus>({
  overall: 'normal',
})

// 系统指标
const systemMetrics = ref<SystemMetrics>({
  onlineUsers: 0,
  requestsPerMinute: 0,
  avgResponseTime: 0,
})

// 服务列表
const services = ref<Service[]>([])

// 磁盘使用情况
const diskUsage = ref<DiskUsage[]>([])

// 告警列表
const alerts = ref<Alert[]>([])

// 过滤后的告警
const filteredAlerts = computed(() => {
  if (alertFilter.value === 'all') {
    return alerts.value
  }
  return alerts.value.filter(alert => alert.level === alertFilter.value)
})

/**
 * 获取状态文本
 */
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    normal: '正常',
    warning: '警告',
    error: '异常',
  }
  return statusMap[status] || status
}

/**
 * 获取服务状态颜色
 */
const getServiceStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    running: 'green',
    stopped: 'orange',
    error: 'red',
  }
  return colorMap[status] || 'default'
}

/**
 * 获取进度条颜色
 */
const getProgressColor = (percentage: number): string => {
  if (percentage < 60) return '#52c41a'
  if (percentage < 80) return '#fa8c16'
  return '#ff4d4f'
}

/**
 * 获取告警颜色
 */
const getAlertColor = (level: string): string => {
  const colorMap: Record<string, string> = {
    critical: '#ff4d4f',
    warning: '#fa8c16',
    info: '#1890ff',
  }
  return colorMap[level] || '#1890ff'
}

/**
 * 获取告警级别文本
 */
const getAlertLevelText = (level: string): string => {
  const levelMap: Record<string, string> = {
    critical: '严重',
    warning: '警告',
    info: '信息',
  }
  return levelMap[level] || level
}

/**
 * 获取日志级别颜色
 */
const getLevelColor = (level: string): string => {
  const colorMap: Record<string, string> = {
    DEBUG: 'default',
    INFO: 'blue',
    WARN: 'orange',
    ERROR: 'red',
    FATAL: 'magenta',
  }
  return colorMap[level] || 'default'
}

/**
 * 加载监控数据
 */
const loadMonitorData = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟系统状态
    systemStatus.value = {
      overall: Math.random() > 0.8 ? 'warning' : 'normal',
    }
    
    // 模拟系统指标
    systemMetrics.value = {
      onlineUsers: Math.floor(Math.random() * 1000) + 500,
      requestsPerMinute: Math.floor(Math.random() * 5000) + 1000,
      avgResponseTime: Math.floor(Math.random() * 200) + 50,
    }
    
    // 模拟服务数据
    services.value = [
      {
        name: 'Web服务器',
        status: 'running',
        cpu: Math.floor(Math.random() * 30) + 10,
        memory: Math.floor(Math.random() * 40) + 20,
        responseTime: Math.floor(Math.random() * 100) + 50,
        lastCheck: '刚刚',
        version: '1.2.3',
        port: 8080,
        startTime: '2024-01-15 09:00:00',
        uptime: '5小时23分钟',
        totalRequests: 125678,
        errorRate: 0.5,
        recentLogs: [
          { timestamp: '14:30:25', level: 'INFO', message: '服务启动成功' },
          { timestamp: '14:28:15', level: 'INFO', message: '处理用户请求' },
          { timestamp: '14:25:30', level: 'WARN', message: '连接池使用率较高' },
        ],
      },
      {
        name: '数据库服务',
        status: 'running',
        cpu: Math.floor(Math.random() * 20) + 5,
        memory: Math.floor(Math.random() * 60) + 30,
        responseTime: Math.floor(Math.random() * 50) + 20,
        lastCheck: '1分钟前',
        version: '8.0.25',
        port: 3306,
        startTime: '2024-01-15 08:30:00',
        uptime: '5小时53分钟',
        totalRequests: 89456,
        errorRate: 0.1,
        recentLogs: [
          { timestamp: '14:29:45', level: 'INFO', message: '查询执行完成' },
          { timestamp: '14:27:30', level: 'INFO', message: '连接建立成功' },
        ],
      },
      {
        name: 'Redis缓存',
        status: 'running',
        cpu: Math.floor(Math.random() * 15) + 2,
        memory: Math.floor(Math.random() * 30) + 10,
        responseTime: Math.floor(Math.random() * 20) + 5,
        lastCheck: '30秒前',
        version: '6.2.6',
        port: 6379,
        startTime: '2024-01-15 08:30:00',
        uptime: '5小时53分钟',
        totalRequests: 234567,
        errorRate: 0.01,
        recentLogs: [
          { timestamp: '14:30:00', level: 'INFO', message: '缓存命中率: 95%' },
          { timestamp: '14:25:00', level: 'INFO', message: '内存清理完成' },
        ],
      },
      {
        name: '消息队列',
        status: Math.random() > 0.9 ? 'error' : 'running',
        cpu: Math.floor(Math.random() * 25) + 5,
        memory: Math.floor(Math.random() * 35) + 15,
        responseTime: Math.floor(Math.random() * 80) + 30,
        lastCheck: '2分钟前',
        version: '3.8.0',
        port: 5672,
        startTime: '2024-01-15 08:45:00',
        uptime: '5小时38分钟',
        totalRequests: 45678,
        errorRate: 1.2,
        recentLogs: [
          { timestamp: '14:28:00', level: 'WARN', message: '队列积压较多' },
          { timestamp: '14:20:00', level: 'INFO', message: '消息处理完成' },
        ],
      },
      {
        name: '文件服务',
        status: 'running',
        cpu: Math.floor(Math.random() * 10) + 2,
        memory: Math.floor(Math.random() * 20) + 10,
        responseTime: Math.floor(Math.random() * 60) + 40,
        lastCheck: '1分钟前',
        version: '2.1.0',
        port: 9000,
        startTime: '2024-01-15 09:15:00',
        uptime: '4小时58分钟',
        totalRequests: 12345,
        errorRate: 0.3,
        recentLogs: [
          { timestamp: '14:25:00', level: 'INFO', message: '文件上传成功' },
          { timestamp: '14:20:00', level: 'INFO', message: '存储空间检查完成' },
        ],
      },
      {
        name: '搜索引擎',
        status: 'running',
        cpu: Math.floor(Math.random() * 20) + 8,
        memory: Math.floor(Math.random() * 50) + 25,
        responseTime: Math.floor(Math.random() * 120) + 80,
        lastCheck: '3分钟前',
        version: '7.15.0',
        port: 9200,
        startTime: '2024-01-15 08:30:00',
        uptime: '5小时53分钟',
        totalRequests: 67890,
        errorRate: 0.8,
        recentLogs: [
          { timestamp: '14:27:00', level: 'INFO', message: '索引重建完成' },
          { timestamp: '14:22:00', level: 'WARN', message: '查询响应时间较长' },
        ],
      },
    ]
    
    // 模拟磁盘使用情况
    diskUsage.value = [
      {
        name: 'C: 系统盘',
        used: '45.2 GB',
        total: '100 GB',
        percentage: 45,
      },
      {
        name: 'D: 数据盘',
        used: '180.5 GB',
        total: '500 GB',
        percentage: 36,
      },
      {
        name: 'E: 备份盘',
        used: '750.8 GB',
        total: '1 TB',
        percentage: 73,
      },
    ]
    
    // 模拟告警数据
    alerts.value = [
      {
        id: 'ALERT001',
        title: 'CPU使用率过高',
        description: 'Web服务器CPU使用率达到85%，建议检查系统负载',
        level: 'warning',
        timestamp: '2024-01-15 14:25:00',
        read: false,
      },
      {
        id: 'ALERT002',
        title: '磁盘空间不足',
        description: '备份盘使用率达到73%，建议清理旧文件',
        level: 'warning',
        timestamp: '2024-01-15 14:20:00',
        read: false,
      },
      {
        id: 'ALERT003',
        title: '数据库连接异常',
        description: '检测到数据库连接超时，已自动重连',
        level: 'info',
        timestamp: '2024-01-15 14:15:00',
        read: true,
      },
    ]
    
    // 图表已通过HighChart组件自动渲染
  } catch (__error) {
    message.error('加载监控数据失败')
  }
}

/**
 * 渲染图表
 */
const renderCharts = (): void => {
  // 图表已通过 HighChart 组件渲染，无需手动处理
}

/**
 * 处理自动刷新变化
 */
const handleAutoRefreshChange = (checked: boolean): void => {
  if (checked) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

/**
 * 处理刷新间隔变化
 */
const handleRefreshIntervalChange = (): void => {
  if (autoRefresh.value) {
    stopAutoRefresh()
    startAutoRefresh()
  }
}

/**
 * 开始自动刷新
 */
const startAutoRefresh = (): void => {
  refreshTimer.value = setInterval(() => {
    loadMonitorData()
  }, refreshInterval.value * 1000)
}

/**
 * 停止自动刷新
 */
const stopAutoRefresh = (): void => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
    refreshTimer.value = null
  }
}

/**
 * 处理CPU时间范围变化
 */
const handleCpuTimeRangeChange = (): void => {
  // 图表会自动响应数据变化
}

/**
 * 处理内存时间范围变化
 */
const handleMemoryTimeRangeChange = (): void => {
  // 图表会自动响应数据变化
}

/**
 * 处理告警过滤变化
 */
const handleAlertFilterChange = (): void => {
  // 过滤逻辑已在计算属性中处理
}

/**
 * 刷新数据
 */
const refreshData = (): void => {
  loadMonitorData()
}

/**
 * 刷新服务状态
 */
const refreshServices = (): void => {
  loadMonitorData()
}

/**
 * 查看服务详情
 */
const viewServiceDetail = (service: Service): void => {
  selectedService.value = service
  serviceDetailModalVisible.value = true
}

/**
 * 重启服务
 */
const restartService = (service: Service): void => {
  message.success(`正在重启 ${service.name} 服务...`)
  // 这里应该调用实际的重启API
}

/**
 * 标记告警为已读
 */
const markAsRead = (alert: Alert): void => {
  alert.read = true
  message.success('已标记为已读')
}

/**
 * 查看告警详情
 */
const viewAlertDetail = (alert: Alert): void => {
  message.info('告警详情功能开发中')
}

/**
 * 清除已读告警
 */
const clearAlerts = (): void => {
  alerts.value = alerts.value.filter(alert => !alert.read)
  message.success('已清除已读告警')
}

/**
 * 导出报告
 */
const exportReport = (): void => {
  message.success('导出功能开发中')
}

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  loadMonitorData()
  if (autoRefresh.value) {
    startAutoRefresh()
  }
})

/**
 * 组件卸载时清理定时器
 */
onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped lang="less">
.monitor-view {
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
  
  .status-card {
    .status-content {
      display: flex;
      align-items: center;
      
      .status-icon {
        font-size: 32px;
        margin-right: 16px;
      }
      
      .status-info {
        .status-title {
          font-size: 14px;
          color: #8c8c8c;
          margin-bottom: 4px;
        }
        
        .status-value {
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
    
    &.status-normal {
      .status-icon {
        color: #52c41a;
      }
      
      .status-value {
        color: #52c41a;
      }
    }
    
    &.status-warning {
      .status-icon {
        color: #fa8c16;
      }
      
      .status-value {
        color: #fa8c16;
      }
    }
    
    &.status-error {
      .status-icon {
        color: #ff4d4f;
      }
      
      .status-value {
        color: #ff4d4f;
      }
    }
  }
  
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
  }
}

.services-section {
  margin-bottom: 24px;
  
  .service-card {
    height: 100%;
    
    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .service-name {
        font-weight: 600;
        font-size: 16px;
      }
    }
    
    .service-metrics {
      .metric-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .metric-label {
          font-size: 12px;
          color: #8c8c8c;
          width: 60px;
        }
        
        .metric-value {
          font-size: 12px;
          font-weight: 600;
          width: 50px;
          text-align: right;
        }
        
        :deep(.ant-progress) {
          flex: 1;
          margin: 0 8px;
        }
      }
    }
    
    .service-actions {
      margin-top: 12px;
      text-align: center;
    }
  }
}

.resources-section {
  margin-bottom: 24px;
  
  .chart-card {
    .chart-container {
      height: 300px;
    }
  }
}

.network-disk-section {
  margin-bottom: 24px;
  
  .chart-container {
    height: 300px;
  }
  
  .disk-usage {
    .disk-item {
      margin-bottom: 16px;
      
      .disk-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .disk-name {
          font-weight: 600;
        }
        
        .disk-size {
          font-size: 12px;
          color: #8c8c8c;
        }
      }
    }
  }
}

.alerts-section {
  .alert-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .alert-description {
    .alert-time {
      font-size: 12px;
      color: #8c8c8c;
      margin-top: 4px;
    }
  }
}

.service-detail {
  .service-logs {
    .log-item {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .log-time {
        font-size: 12px;
        color: #8c8c8c;
        width: 80px;
      }
      
      .log-message {
        flex: 1;
        font-size: 12px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .monitor-view {
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
  
  .services-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
  
  .resources-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
  
  .network-disk-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
}
</style>