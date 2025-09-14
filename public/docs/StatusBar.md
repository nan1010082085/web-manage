# StatusBar 状态栏组件

智能状态栏组件，提供实时状态显示、进度跟踪、操作反馈和系统监控功能，支持多种状态类型和自定义配置。

## 特性

- ✅ **实时状态**: 实时显示系统和操作状态
- ✅ **进度跟踪**: 支持多种进度显示方式
- ✅ **状态分类**: 支持成功、警告、错误、信息等状态
- ✅ **自动更新**: 智能状态轮询和推送更新
- ✅ **历史记录**: 状态变更历史追踪
- ✅ **批量状态**: 支持批量操作状态显示
- ✅ **自定义主题**: 支持多种视觉主题
- ✅ **响应式**: 适配不同屏幕尺寸
- ✅ **无障碍**: 支持屏幕阅读器

## 基础用法

### 简单状态显示

```vue
<template>
  <StatusBar
    :status="currentStatus"
    :show-progress="true"
    @status-click="handleStatusClick"
    @action-click="handleActionClick"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StatusBar from '@/components/common/StatusBar.vue'
import type { StatusInfo } from '@/types/status'

const currentStatus = ref<StatusInfo>({
  type: 'info',
  title: '系统正常',
  message: '所有服务运行正常',
  timestamp: new Date(),
  progress: {
    current: 0,
    total: 100,
    showPercent: true
  },
  actions: [
    {
      key: 'refresh',
      label: '刷新',
      icon: 'ReloadOutlined',
      type: 'primary'
    }
  ]
})

const handleStatusClick = (status: StatusInfo) => {
  console.log('状态点击:', status)
  // 显示详细信息
  showStatusDetails(status)
}

const handleActionClick = (actionKey: string) => {
  console.log('操作点击:', actionKey)
  
  switch (actionKey) {
    case 'refresh':
      refreshStatus()
      break
    case 'retry':
      retryOperation()
      break
    case 'cancel':
      cancelOperation()
      break
  }
}

const refreshStatus = async () => {
  currentStatus.value = {
    ...currentStatus.value,
    type: 'loading',
    title: '刷新中...',
    message: '正在获取最新状态'
  }
  
  try {
    const newStatus = await fetchSystemStatus()
    currentStatus.value = newStatus
  } catch (error) {
    currentStatus.value = {
      type: 'error',
      title: '刷新失败',
      message: error.message,
      timestamp: new Date(),
      actions: [
        {
          key: 'retry',
          label: '重试',
          icon: 'ReloadOutlined',
          type: 'primary'
        }
      ]
    }
  }
}

onMounted(() => {
  // 初始化状态
  refreshStatus()
})
</script>
```

### 进度状态显示

```vue
<template>
  <div class="status-container">
    <!-- 文件上传状态 -->
    <StatusBar
      :status="uploadStatus"
      :show-progress="true"
      :auto-hide="false"
    />
    
    <!-- 数据处理状态 -->
    <StatusBar
      :status="processStatus"
      :show-progress="true"
      :progress-type="'steps'"
    />
    
    <!-- 批量操作状态 -->
    <StatusBar
      :status="batchStatus"
      :show-progress="true"
      :show-details="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFileUpload } from '@/composables/useFileUpload'
import { useBatchProcess } from '@/composables/useBatchProcess'

// 文件上传状态
const { uploadProgress, uploadStatus: uploadState } = useFileUpload()

const uploadStatus = computed<StatusInfo>(() => {
  const progress = uploadProgress.value
  
  return {
    type: progress.status === 'uploading' ? 'loading' : 
          progress.status === 'success' ? 'success' : 
          progress.status === 'error' ? 'error' : 'info',
    title: getUploadTitle(progress.status),
    message: `${progress.uploaded}/${progress.total} 文件`,
    timestamp: new Date(),
    progress: {
      current: progress.uploaded,
      total: progress.total,
      showPercent: true,
      showSpeed: true,
      speed: progress.speed,
      remainingTime: progress.remainingTime
    },
    details: {
      successCount: progress.successCount,
      errorCount: progress.errorCount,
      skippedCount: progress.skippedCount
    },
    actions: getUploadActions(progress.status)
  }
})

// 数据处理状态
const processStatus = ref<StatusInfo>({
  type: 'loading',
  title: '数据处理中',
  message: '正在处理订单数据',
  timestamp: new Date(),
  progress: {
    current: 2,
    total: 5,
    type: 'steps',
    steps: [
      { title: '数据验证', status: 'completed' },
      { title: '数据清洗', status: 'completed' },
      { title: '数据转换', status: 'processing' },
      { title: '数据存储', status: 'pending' },
      { title: '完成处理', status: 'pending' }
    ]
  },
  actions: [
    {
      key: 'pause',
      label: '暂停',
      icon: 'PauseOutlined',
      type: 'default'
    },
    {
      key: 'cancel',
      label: '取消',
      icon: 'CloseOutlined',
      type: 'danger'
    }
  ]
})

// 批量操作状态
const { batchProgress } = useBatchProcess()

const batchStatus = computed<StatusInfo>(() => {
  const progress = batchProgress.value
  
  return {
    type: progress.hasErrors ? 'warning' : 
          progress.isCompleted ? 'success' : 'loading',
    title: getBatchTitle(progress),
    message: `处理进度: ${progress.completed}/${progress.total}`,
    timestamp: new Date(),
    progress: {
      current: progress.completed,
      total: progress.total,
      showPercent: true,
      showDetails: true
    },
    details: {
      successCount: progress.successCount,
      errorCount: progress.errorCount,
      warningCount: progress.warningCount,
      errors: progress.errors.slice(0, 3) // 只显示前3个错误
    },
    actions: getBatchActions(progress)
  }
})

const getUploadTitle = (status: string) => {
  switch (status) {
    case 'uploading': return '文件上传中'
    case 'success': return '上传完成'
    case 'error': return '上传失败'
    case 'paused': return '上传已暂停'
    default: return '准备上传'
  }
}

const getUploadActions = (status: string) => {
  switch (status) {
    case 'uploading':
      return [
        { key: 'pause', label: '暂停', icon: 'PauseOutlined' },
        { key: 'cancel', label: '取消', icon: 'CloseOutlined', type: 'danger' }
      ]
    case 'paused':
      return [
        { key: 'resume', label: '继续', icon: 'PlayCircleOutlined', type: 'primary' },
        { key: 'cancel', label: '取消', icon: 'CloseOutlined', type: 'danger' }
      ]
    case 'error':
      return [
        { key: 'retry', label: '重试', icon: 'ReloadOutlined', type: 'primary' },
        { key: 'clear', label: '清除', icon: 'DeleteOutlined' }
      ]
    case 'success':
      return [
        { key: 'view', label: '查看', icon: 'EyeOutlined', type: 'primary' },
        { key: 'clear', label: '清除', icon: 'DeleteOutlined' }
      ]
    default:
      return []
  }
}

const getBatchTitle = (progress: any) => {
  if (progress.isCompleted) {
    return progress.hasErrors ? '批量处理完成(有错误)' : '批量处理完成'
  }
  return '批量处理中'
}

const getBatchActions = (progress: any) => {
  if (progress.isCompleted) {
    return [
      { key: 'view-report', label: '查看报告', icon: 'FileTextOutlined', type: 'primary' },
      { key: 'download-log', label: '下载日志', icon: 'DownloadOutlined' },
      { key: 'clear', label: '清除', icon: 'DeleteOutlined' }
    ]
  }
  
  return [
    { key: 'pause', label: '暂停', icon: 'PauseOutlined' },
    { key: 'stop', label: '停止', icon: 'StopOutlined', type: 'danger' }
  ]
}
</script>
```

## 高级用法

### 多状态管理和历史记录

```vue
<template>
  <div class="multi-status-container">
    <!-- 状态列表 -->
    <div class="status-list">
      <StatusBar
        v-for="status in activeStatuses"
        :key="status.id"
        :status="status"
        :show-close="true"
        :auto-hide="status.autoHide"
        @close="removeStatus"
        @status-click="showStatusHistory"
      />
    </div>
    
    <!-- 状态历史 -->
    <a-drawer
      v-model:visible="showHistory"
      title="状态历史"
      width="600px"
    >
      <StatusHistory
        :history="statusHistory"
        :filters="historyFilters"
        @filter-change="updateHistoryFilters"
        @export="exportHistory"
      />
    </a-drawer>
    
    <!-- 状态统计 -->
    <StatusSummary
      :summary="statusSummary"
      :show-charts="true"
      @period-change="updateSummaryPeriod"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStatusManager } from '@/composables/useStatusManager'
import { useStatusHistory } from '@/composables/useStatusHistory'
import { useWebSocket } from '@/composables/useWebSocket'

const {
  statuses,
  addStatus,
  removeStatus,
  updateStatus,
  clearExpiredStatuses
} = useStatusManager()

const {
  history: statusHistory,
  addToHistory,
  getHistoryByType,
  exportHistory
} = useStatusHistory()

const { connect, disconnect, on } = useWebSocket()

const showHistory = ref(false)
const historyFilters = ref({
  type: 'all',
  dateRange: [null, null],
  keyword: ''
})

// 活跃状态列表
const activeStatuses = computed(() => {
  return statuses.value.filter(status => 
    !status.hidden && !status.expired
  )
})

// 状态统计
const statusSummary = computed(() => {
  const summary = {
    total: statuses.value.length,
    success: 0,
    error: 0,
    warning: 0,
    info: 0,
    loading: 0
  }
  
  statuses.value.forEach(status => {
    summary[status.type]++
  })
  
  return summary
})

// WebSocket 状态更新
const setupWebSocketListeners = () => {
  on('status-update', (data: any) => {
    updateStatus(data.id, data.updates)
  })
  
  on('new-status', (data: any) => {
    addStatus(data)
  })
  
  on('batch-progress', (data: any) => {
    updateBatchProgress(data)
  })
  
  on('system-alert', (data: any) => {
    addSystemAlert(data)
  })
}

// 添加系统警报
const addSystemAlert = (alertData: any) => {
  const alertStatus: StatusInfo = {
    id: `alert-${Date.now()}`,
    type: alertData.level === 'critical' ? 'error' : 'warning',
    title: alertData.title,
    message: alertData.message,
    timestamp: new Date(alertData.timestamp),
    persistent: alertData.level === 'critical',
    actions: [
      {
        key: 'acknowledge',
        label: '确认',
        icon: 'CheckOutlined',
        type: 'primary'
      },
      {
        key: 'details',
        label: '详情',
        icon: 'InfoCircleOutlined'
      }
    ],
    metadata: {
      source: alertData.source,
      severity: alertData.level,
      category: alertData.category
    }
  }
  
  addStatus(alertStatus)
  addToHistory(alertStatus)
  
  // 关键警报需要声音提醒
  if (alertData.level === 'critical') {
    playAlertSound()
  }
}

// 更新批量进度
const updateBatchProgress = (progressData: any) => {
  const existingStatus = statuses.value.find(
    s => s.id === progressData.batchId
  )
  
  if (existingStatus) {
    updateStatus(progressData.batchId, {
      progress: {
        current: progressData.completed,
        total: progressData.total,
        showPercent: true
      },
      message: `处理进度: ${progressData.completed}/${progressData.total}`,
      details: {
        successCount: progressData.successCount,
        errorCount: progressData.errorCount,
        currentItem: progressData.currentItem
      }
    })
  } else {
    // 创建新的批量状态
    addStatus({
      id: progressData.batchId,
      type: 'loading',
      title: '批量处理中',
      message: `处理进度: ${progressData.completed}/${progressData.total}`,
      timestamp: new Date(),
      progress: {
        current: progressData.completed,
        total: progressData.total,
        showPercent: true
      },
      actions: [
        {
          key: 'pause',
          label: '暂停',
          icon: 'PauseOutlined'
        },
        {
          key: 'cancel',
          label: '取消',
          icon: 'CloseOutlined',
          type: 'danger'
        }
      ]
    })
  }
}

// 显示状态历史
const showStatusHistory = (status: StatusInfo) => {
  showHistory.value = true
  // 可以根据状态ID过滤历史记录
  historyFilters.value = {
    ...historyFilters.value,
    statusId: status.id
  }
}

// 更新历史过滤器
const updateHistoryFilters = (filters: any) => {
  historyFilters.value = { ...filters }
}

// 更新统计周期
const updateSummaryPeriod = (period: string) => {
  // 重新计算指定周期的统计数据
  console.log('更新统计周期:', period)
}

// 播放警报声音
const playAlertSound = () => {
  const audio = new Audio('/sounds/alert.mp3')
  audio.play().catch(console.error)
}

// 定时清理过期状态
let cleanupTimer: NodeJS.Timeout

onMounted(() => {
  connect()
  setupWebSocketListeners()
  
  // 每30秒清理一次过期状态
  cleanupTimer = setInterval(() => {
    clearExpiredStatuses()
  }, 30000)
})

onUnmounted(() => {
  disconnect()
  if (cleanupTimer) {
    clearInterval(cleanupTimer)
  }
})
</script>

<style scoped>
.multi-status-container {
  .status-list {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 1000;
    max-width: 400px;
    
    .status-bar {
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
```

### 自定义状态类型和主题

```vue
<template>
  <div class="custom-status-demo">
    <!-- 自定义状态类型 -->
    <StatusBar
      v-for="status in customStatuses"
      :key="status.id"
      :status="status"
      :theme="currentTheme"
      :custom-styles="getCustomStyles(status.type)"
    />
    
    <!-- 主题切换 -->
    <div class="theme-switcher">
      <a-radio-group 
        v-model:value="currentTheme" 
        button-style="solid"
      >
        <a-radio-button value="default">默认</a-radio-button>
        <a-radio-button value="minimal">简约</a-radio-button>
        <a-radio-button value="colorful">彩色</a-radio-button>
        <a-radio-button value="dark">深色</a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentTheme = ref('default')

// 自定义状态类型
const customStatuses = ref<StatusInfo[]>([
  {
    id: 'deployment',
    type: 'deployment',
    title: '部署进行中',
    message: '正在部署到生产环境',
    timestamp: new Date(),
    progress: {
      current: 3,
      total: 5,
      type: 'steps',
      steps: [
        { title: '构建', status: 'completed', duration: '2m 30s' },
        { title: '测试', status: 'completed', duration: '1m 45s' },
        { title: '部署', status: 'processing', duration: '0m 30s' },
        { title: '验证', status: 'pending' },
        { title: '完成', status: 'pending' }
      ]
    },
    metadata: {
      environment: 'production',
      version: 'v2.1.0',
      branch: 'main'
    }
  },
  {
    id: 'backup',
    type: 'backup',
    title: '数据备份',
    message: '正在备份数据库',
    timestamp: new Date(),
    progress: {
      current: 75,
      total: 100,
      showPercent: true,
      showSpeed: true,
      speed: '15 MB/s',
      remainingTime: '2分钟'
    },
    metadata: {
      database: 'main_db',
      size: '2.5 GB',
      type: 'full'
    }
  },
  {
    id: 'maintenance',
    type: 'maintenance',
    title: '系统维护',
    message: '计划维护将在30分钟后开始',
    timestamp: new Date(),
    persistent: true,
    countdown: {
      target: new Date(Date.now() + 30 * 60 * 1000),
      format: 'mm:ss'
    },
    actions: [
      {
        key: 'postpone',
        label: '延后',
        icon: 'ClockCircleOutlined'
      },
      {
        key: 'cancel',
        label: '取消',
        icon: 'CloseOutlined',
        type: 'danger'
      }
    ]
  },
  {
    id: 'security',
    type: 'security',
    title: '安全警报',
    message: '检测到异常登录尝试',
    timestamp: new Date(),
    severity: 'high',
    blinking: true,
    actions: [
      {
        key: 'investigate',
        label: '调查',
        icon: 'SearchOutlined',
        type: 'primary'
      },
      {
        key: 'block',
        label: '阻止',
        icon: 'StopOutlined',
        type: 'danger'
      }
    ],
    metadata: {
      ip: '192.168.1.100',
      location: '北京',
      attempts: 5
    }
  }
])

// 自定义样式配置
const getCustomStyles = (type: string) => {
  const styles = {
    deployment: {
      '--status-bg': '#e6f7ff',
      '--status-border': '#91d5ff',
      '--status-text': '#0050b3',
      '--status-icon': '#1890ff'
    },
    backup: {
      '--status-bg': '#f6ffed',
      '--status-border': '#b7eb8f',
      '--status-text': '#389e0d',
      '--status-icon': '#52c41a'
    },
    maintenance: {
      '--status-bg': '#fff7e6',
      '--status-border': '#ffd591',
      '--status-text': '#d46b08',
      '--status-icon': '#fa8c16'
    },
    security: {
      '--status-bg': '#fff2f0',
      '--status-border': '#ffccc7',
      '--status-text': '#cf1322',
      '--status-icon': '#f5222d',
      'animation': 'pulse 2s infinite'
    }
  }
  
  return styles[type] || {}
}
</script>

<style scoped>
.custom-status-demo {
  padding: 20px;
  
  .theme-switcher {
    margin-top: 20px;
    text-align: center;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 34, 45, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(245, 34, 45, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(245, 34, 45, 0);
  }
}
</style>
```

## API 参考

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| status | `StatusInfo` | - | 状态信息对象 |
| showProgress | `boolean` | `true` | 是否显示进度 |
| showActions | `boolean` | `true` | 是否显示操作按钮 |
| showClose | `boolean` | `false` | 是否显示关闭按钮 |
| showDetails | `boolean` | `false` | 是否显示详细信息 |
| autoHide | `boolean` | `false` | 是否自动隐藏 |
| autoHideDelay | `number` | `5000` | 自动隐藏延迟(毫秒) |
| progressType | `'line' \| 'circle' \| 'steps'` | `'line'` | 进度条类型 |
| size | `'small' \| 'middle' \| 'large'` | `'middle'` | 组件大小 |
| theme | `'default' \| 'minimal' \| 'colorful' \| 'dark'` | `'default'` | 主题 |
| position | `'top' \| 'bottom' \| 'fixed'` | `'top'` | 显示位置 |
| maxWidth | `string \| number` | `'400px'` | 最大宽度 |
| customStyles | `Record<string, any>` | `{}` | 自定义样式 |
| clickable | `boolean` | `true` | 是否可点击 |
| persistent | `boolean` | `false` | 是否持久显示 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| status-click | `(status: StatusInfo)` | 状态点击事件 |
| action-click | `(actionKey: string, status: StatusInfo)` | 操作按钮点击事件 |
| close | `(statusId: string)` | 关闭事件 |
| progress-complete | `(status: StatusInfo)` | 进度完成事件 |
| countdown-finish | `(status: StatusInfo)` | 倒计时结束事件 |
| details-toggle | `(visible: boolean, status: StatusInfo)` | 详情展开/收起事件 |

### 方法

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| updateProgress | `(progress: ProgressInfo)` | `void` | 更新进度 |
| addAction | `(action: ActionItem)` | `void` | 添加操作按钮 |
| removeAction | `(actionKey: string)` | `void` | 移除操作按钮 |
| show | - | `void` | 显示状态栏 |
| hide | - | `void` | 隐藏状态栏 |
| blink | `(duration?: number)` | `void` | 闪烁提醒 |
| startCountdown | `(target: Date)` | `void` | 开始倒计时 |
| stopCountdown | - | `void` | 停止倒计时 |

### 类型定义

```typescript
// 状态信息接口
interface StatusInfo {
  /** 状态ID */
  id?: string
  /** 状态类型 */
  type: 'success' | 'error' | 'warning' | 'info' | 'loading' | string
  /** 状态标题 */
  title: string
  /** 状态消息 */
  message: string
  /** 时间戳 */
  timestamp: Date
  /** 进度信息 */
  progress?: ProgressInfo
  /** 操作按钮 */
  actions?: ActionItem[]
  /** 详细信息 */
  details?: Record<string, any>
  /** 元数据 */
  metadata?: Record<string, any>
  /** 是否持久显示 */
  persistent?: boolean
  /** 是否自动隐藏 */
  autoHide?: boolean
  /** 自动隐藏延迟 */
  autoHideDelay?: number
  /** 是否闪烁 */
  blinking?: boolean
  /** 严重程度 */
  severity?: 'low' | 'medium' | 'high' | 'critical'
  /** 倒计时配置 */
  countdown?: CountdownConfig
  /** 是否隐藏 */
  hidden?: boolean
  /** 是否过期 */
  expired?: boolean
}

// 进度信息接口
interface ProgressInfo {
  /** 当前进度 */
  current: number
  /** 总进度 */
  total: number
  /** 进度类型 */
  type?: 'line' | 'circle' | 'steps'
  /** 是否显示百分比 */
  showPercent?: boolean
  /** 是否显示速度 */
  showSpeed?: boolean
  /** 传输速度 */
  speed?: string
  /** 剩余时间 */
  remainingTime?: string
  /** 是否显示详情 */
  showDetails?: boolean
  /** 步骤信息 */
  steps?: StepInfo[]
  /** 状态 */
  status?: 'normal' | 'exception' | 'success'
}

// 步骤信息接口
interface StepInfo {
  /** 步骤标题 */
  title: string
  /** 步骤状态 */
  status: 'pending' | 'processing' | 'completed' | 'error'
  /** 步骤描述 */
  description?: string
  /** 执行时间 */
  duration?: string
  /** 错误信息 */
  error?: string
}

// 操作按钮接口
interface ActionItem {
  /** 操作键值 */
  key: string
  /** 操作标签 */
  label: string
  /** 图标 */
  icon?: string
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link' | 'danger'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 确认配置 */
  confirm?: ConfirmConfig
}

// 倒计时配置接口
interface CountdownConfig {
  /** 目标时间 */
  target: Date
  /** 格式化 */
  format?: string
  /** 完成回调 */
  onFinish?: () => void
}

// 确认配置接口
interface ConfirmConfig {
  /** 确认标题 */
  title: string
  /** 确认内容 */
  content: string
  /** 确认按钮文本 */
  okText?: string
  /** 取消按钮文本 */
  cancelText?: string
}

// 状态历史接口
interface StatusHistoryItem {
  /** 历史ID */
  id: string
  /** 状态信息 */
  status: StatusInfo
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt?: Date
  /** 持续时间 */
  duration?: number
  /** 操作记录 */
  actions?: ActionRecord[]
}

// 操作记录接口
interface ActionRecord {
  /** 操作键值 */
  actionKey: string
  /** 操作时间 */
  timestamp: Date
  /** 操作结果 */
  result: 'success' | 'error' | 'cancelled'
  /** 错误信息 */
  error?: string
}
```

## 样式定制

### CSS 变量

```css
.status-bar {
  /* 基础样式 */
  --status-bg: #ffffff;
  --status-border: #d9d9d9;
  --status-text: #000000d9;
  --status-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  /* 状态类型样式 */
  --success-bg: #f6ffed;
  --success-border: #b7eb8f;
  --success-text: #389e0d;
  --success-icon: #52c41a;
  
  --error-bg: #fff2f0;
  --error-border: #ffccc7;
  --error-text: #cf1322;
  --error-icon: #f5222d;
  
  --warning-bg: #fffbe6;
  --warning-border: #ffe58f;
  --warning-text: #d48806;
  --warning-icon: #faad14;
  
  --info-bg: #e6f7ff;
  --info-border: #91d5ff;
  --info-text: #0050b3;
  --info-icon: #1890ff;
  
  --loading-bg: #f0f0f0;
  --loading-border: #d9d9d9;
  --loading-text: #595959;
  --loading-icon: #8c8c8c;
  
  /* 进度条样式 */
  --progress-bg: #f5f5f5;
  --progress-fill: #1890ff;
  --progress-text: #000000d9;
  
  /* 操作按钮样式 */
  --action-bg: transparent;
  --action-border: #d9d9d9;
  --action-text: #000000d9;
  --action-hover-bg: #f5f5f5;
  --action-hover-border: #40a9ff;
  
  /* 动画 */
  --transition-duration: 0.3s;
  --animation-duration: 2s;
}

/* 深色主题 */
[data-theme='dark'] .status-bar {
  --status-bg: #141414;
  --status-border: #434343;
  --status-text: #ffffffd9;
  --status-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
  
  --success-bg: #162312;
  --success-border: #274916;
  --success-text: #95de64;
  --success-icon: #52c41a;
  
  --error-bg: #2a1215;
  --error-border: #58181c;
  --error-text: #ff7875;
  --error-icon: #f5222d;
  
  --warning-bg: #2b2111;
  --warning-border: #594214;
  --warning-text: #ffc53d;
  --warning-icon: #faad14;
  
  --info-bg: #111b26;
  --info-border: #112a3a;
  --info-text: #69c0ff;
  --info-icon: #1890ff;
  
  --loading-bg: #262626;
  --loading-border: #434343;
  --loading-text: #ffffffa6;
  --loading-icon: #8c8c8c;
  
  --progress-bg: #262626;
  --progress-fill: #177ddc;
  --progress-text: #ffffffd9;
  
  --action-bg: transparent;
  --action-border: #434343;
  --action-text: #ffffffd9;
  --action-hover-bg: #262626;
  --action-hover-border: #177ddc;
}
```

### 响应式设计

```css
.status-bar {
  /* 桌面端 */
  @media (min-width: 1024px) {
    max-width: 500px;
    
    .status-content {
      padding: 16px 20px;
    }
    
    .status-actions {
      gap: 12px;
    }
    
    .progress-steps {
      .step-item {
        min-width: 120px;
      }
    }
  }
  
  /* 平板端 */
  @media (max-width: 768px) {
    max-width: 400px;
    
    .status-content {
      padding: 12px 16px;
    }
    
    .status-title {
      font-size: 14px;
    }
    
    .status-message {
      font-size: 12px;
    }
    
    .status-actions {
      gap: 8px;
      
      .action-button {
        padding: 4px 8px;
        font-size: 12px;
      }
    }
  }
  
  /* 移动端 */
  @media (max-width: 576px) {
    max-width: calc(100vw - 32px);
    margin: 0 16px;
    
    .status-content {
      padding: 12px;
    }
    
    .status-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .status-actions {
      width: 100%;
      justify-content: space-between;
      
      .action-button {
        flex: 1;
        margin: 0 2px;
      }
    }
    
    .progress-steps {
      .step-item {
        min-width: auto;
        flex: 1;
        
        .step-title {
          font-size: 10px;
        }
      }
    }
    
    .status-details {
      .detail-item {
        flex-direction: column;
        align-items: flex-start;
        
        .detail-label {
          margin-bottom: 4px;
        }
      }
    }
  }
}
```

## 最佳实践

### 1. 状态管理策略

```typescript
// composables/useStatusManager.ts
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export function useStatusManager() {
  const statuses = ref<StatusInfo[]>([])
  const maxStatuses = 10
  const defaultExpireTime = 5 * 60 * 1000 // 5分钟
  
  // 持久化配置
  const persistentConfig = useLocalStorage('status-config', {
    autoHide: true,
    maxVisible: 5,
    soundEnabled: true
  })
  
  const addStatus = (status: StatusInfo) => {
    const newStatus = {
      id: status.id || `status-${Date.now()}`,
      ...status,
      timestamp: status.timestamp || new Date(),
      autoHide: status.autoHide ?? persistentConfig.value.autoHide
    }
    
    // 检查是否已存在相同ID的状态
    const existingIndex = statuses.value.findIndex(s => s.id === newStatus.id)
    if (existingIndex !== -1) {
      statuses.value[existingIndex] = newStatus
    } else {
      statuses.value.unshift(newStatus)
    }
    
    // 限制状态数量
    if (statuses.value.length > maxStatuses) {
      statuses.value = statuses.value.slice(0, maxStatuses)
    }
    
    // 设置自动过期
    if (newStatus.autoHide && !newStatus.persistent) {
      setTimeout(() => {
        removeStatus(newStatus.id)
      }, newStatus.autoHideDelay || defaultExpireTime)
    }
    
    return newStatus.id
  }
  
  const updateStatus = (id: string, updates: Partial<StatusInfo>) => {
    const index = statuses.value.findIndex(s => s.id === id)
    if (index !== -1) {
      statuses.value[index] = {
        ...statuses.value[index],
        ...updates,
        timestamp: new Date()
      }
    }
  }
  
  const removeStatus = (id: string) => {
    const index = statuses.value.findIndex(s => s.id === id)
    if (index !== -1) {
      statuses.value.splice(index, 1)
    }
  }
  
  const clearExpiredStatuses = () => {
    const now = Date.now()
    statuses.value = statuses.value.filter(status => {
      if (status.persistent) return true
      
      const expireTime = status.timestamp.getTime() + 
        (status.autoHideDelay || defaultExpireTime)
      
      return now < expireTime
    })
  }
  
  const getStatusesByType = (type: string) => {
    return statuses.value.filter(s => s.type === type)
  }
  
  const hasActiveStatuses = computed(() => {
    return statuses.value.some(s => !s.hidden && !s.expired)
  })
  
  return {
    statuses,
    addStatus,
    updateStatus,
    removeStatus,
    clearExpiredStatuses,
    getStatusesByType,
    hasActiveStatuses,
    persistentConfig
  }
}
```

### 2. 进度跟踪优化

```typescript
// composables/useProgressTracker.ts
export function useProgressTracker() {
  const createProgressTracker = (config: ProgressConfig) => {
    const progress = ref<ProgressInfo>({
      current: 0,
      total: config.total,
      type: config.type || 'line',
      showPercent: config.showPercent ?? true
    })
    
    const startTime = ref<Date>()
    const estimatedTime = ref<number>()
    
    const updateProgress = (current: number, details?: any) => {
      progress.value.current = Math.min(current, progress.value.total)
      
      // 计算速度和剩余时间
      if (startTime.value) {
        const elapsed = Date.now() - startTime.value.getTime()
        const rate = current / elapsed * 1000 // 每秒处理量
        const remaining = (progress.value.total - current) / rate
        
        progress.value.speed = formatSpeed(rate, config.unit)
        progress.value.remainingTime = formatTime(remaining)
      }
      
      // 更新详细信息
      if (details) {
        progress.value = { ...progress.value, ...details }
      }
      
      // 触发进度更新事件
      config.onProgress?.(progress.value)
      
      // 检查是否完成
      if (current >= progress.value.total) {
        config.onComplete?.(progress.value)
      }
    }
    
    const start = () => {
      startTime.value = new Date()
      config.onStart?.(progress.value)
    }
    
    const pause = () => {
      config.onPause?.(progress.value)
    }
    
    const resume = () => {
      config.onResume?.(progress.value)
    }
    
    const reset = () => {
      progress.value.current = 0
      startTime.value = undefined
      estimatedTime.value = undefined
      config.onReset?.(progress.value)
    }
    
    return {
      progress,
      updateProgress,
      start,
      pause,
      resume,
      reset
    }
  }
  
  const formatSpeed = (rate: number, unit: string = 'items') => {
    if (rate < 1) {
      return `${(rate * 60).toFixed(1)} ${unit}/min`
    }
    return `${rate.toFixed(1)} ${unit}/s`
  }
  
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}秒`
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}分钟`
    } else {
      return `${Math.round(seconds / 3600)}小时`
    }
  }
  
  return {
    createProgressTracker,
    formatSpeed,
    formatTime
  }
}

interface ProgressConfig {
  total: number
  type?: 'line' | 'circle' | 'steps'
  unit?: string
  showPercent?: boolean
  onStart?: (progress: ProgressInfo) => void
  onProgress?: (progress: ProgressInfo) => void
  onPause?: (progress: ProgressInfo) => void
  onResume?: (progress: ProgressInfo) => void
  onComplete?: (progress: ProgressInfo) => void
  onReset?: (progress: ProgressInfo) => void
}
```

### 3. 无障碍支持

```vue
<template>
  <div
    class="status-bar"
    :class="statusClasses"
    role="status"
    :aria-live="ariaLive"
    :aria-label="ariaLabel"
    :tabindex="clickable ? 0 : -1"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- 状态内容 -->
    <div class="status-content">
      <div class="status-header">
        <component
          :is="statusIcon"
          class="status-icon"
          :aria-hidden="true"
        />
        <div class="status-text">
          <h4 class="status-title">{{ status.title }}</h4>
          <p class="status-message">{{ status.message }}</p>
        </div>
        <time 
          class="status-time"
          :datetime="status.timestamp.toISOString()"
        >
          {{ formatTime(status.timestamp) }}
        </time>
      </div>
      
      <!-- 进度条 -->
      <div 
        v-if="showProgress && status.progress"
        class="status-progress"
        role="progressbar"
        :aria-valuenow="status.progress.current"
        :aria-valuemin="0"
        :aria-valuemax="status.progress.total"
        :aria-valuetext="progressText"
      >
        <ProgressBar :progress="status.progress" />
      </div>
      
      <!-- 操作按钮 -->
      <div 
        v-if="showActions && status.actions?.length"
        class="status-actions"
        role="group"
        :aria-label="'状态操作'"
      >
        <button
          v-for="action in status.actions"
          :key="action.key"
          class="action-button"
          :class="`action-${action.type}`"
          :disabled="action.disabled"
          :aria-label="action.label"
          @click.stop="handleActionClick(action.key)"
        >
          <component :is="action.icon" aria-hidden="true" />
          <span>{{ action.label }}</span>
        </button>
      </div>
    </div>
    
    <!-- 关闭按钮 -->
    <button
      v-if="showClose"
      class="close-button"
      :aria-label="'关闭状态'"
      @click.stop="handleClose"
    >
      <CloseOutlined aria-hidden="true" />
    </button>
    
    <!-- 屏幕阅读器专用文本 -->
    <div class="sr-only">
      {{ screenReaderText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: StatusInfo
  showProgress?: boolean
  showActions?: boolean
  showClose?: boolean
  clickable?: boolean
}>()

// 无障碍属性
const ariaLive = computed(() => {
  switch (props.status.type) {
    case 'error':
    case 'warning':
      return 'assertive'
    default:
      return 'polite'
  }
})

const ariaLabel = computed(() => {
  return `${props.status.type}状态: ${props.status.title}, ${props.status.message}`
})

const progressText = computed(() => {
  if (!props.status.progress) return ''
  
  const { current, total, showPercent } = props.status.progress
  const percent = Math.round((current / total) * 100)
  
  if (showPercent) {
    return `进度 ${percent}%`
  }
  
  return `进度 ${current} / ${total}`
})

const screenReaderText = computed(() => {
  let text = `${props.status.title}. ${props.status.message}.`
  
  if (props.status.progress) {
    text += ` ${progressText.value}.`
  }
  
  if (props.status.actions?.length) {
    const actionLabels = props.status.actions.map(a => a.label).join(', ')
    text += ` 可用操作: ${actionLabels}.`
  }
  
  return text
})

// 键盘导航
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      if (props.clickable) {
        event.preventDefault()
        handleClick()
      }
      break
    case 'Escape':
      if (props.showClose) {
        event.preventDefault()
        handleClose()
      }
      break
  }
}
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.status-bar:focus {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}

.action-button:focus {
  outline: 2px solid #1890ff;
  outline-offset: 1px;
}

.close-button:focus {
  outline: 2px solid #1890ff;
  outline-offset: 1px;
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .status-bar {
    border: 2px solid;
  }
  
  .status-icon,
  .action-button,
  .close-button {
    filter: contrast(2);
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .status-bar,
  .progress-bar,
  .action-button {
    transition: none;
    animation: none;
  }
}
</style>
```

## 常见问题

### Q: 如何处理大量状态的性能问题？

A: 使用虚拟滚动和状态分页：

```typescript
const useVirtualStatusList = (statuses: Ref<StatusInfo[]>) => {
  const containerHeight = 400
  const itemHeight = 80
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const scrollTop = ref(0)
  
  const visibleStatuses = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight)
    const end = Math.min(start + visibleCount + 2, statuses.value.length)
    
    return statuses.value.slice(start, end).map((status, index) => ({
      ...status,
      virtualIndex: start + index,
      offsetY: (start + index) * itemHeight
    }))
  })
  
  return {
    visibleStatuses,
    scrollTop,
    totalHeight: computed(() => statuses.value.length * itemHeight)
  }
}
```

### Q: 如何实现状态的持久化存储？

A: 使用 IndexedDB 进行本地存储：

```typescript
// utils/statusStorage.ts
class StatusStorage {
  private dbName = 'status-storage'
  private version = 1
  private db: IDBDatabase | null = null
  
  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains('statuses')) {
          const store = db.createObjectStore('statuses', { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp')
          store.createIndex('type', 'type')
        }
      }
    })
  }
  
  async saveStatus(status: StatusInfo) {
    if (!this.db) await this.init()
    
    const transaction = this.db!.transaction(['statuses'], 'readwrite')
    const store = transaction.objectStore('statuses')
    
    return new Promise<void>((resolve, reject) => {
      const request = store.put({
        ...status,
        savedAt: new Date()
      })
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
  
  async getStatuses(filter?: StatusFilter) {
    if (!this.db) await this.init()
    
    const transaction = this.db!.transaction(['statuses'], 'readonly')
    const store = transaction.objectStore('statuses')
    
    return new Promise<StatusInfo[]>((resolve, reject) => {
      const request = store.getAll()
      
      request.onsuccess = () => {
        let statuses = request.result
        
        if (filter) {
          statuses = this.applyFilter(statuses, filter)
        }
        
        resolve(statuses)
      }
      
      request.onerror = () => reject(request.error)
    })
  }
  
  private applyFilter(statuses: StatusInfo[], filter: StatusFilter) {
    return statuses.filter(status => {
      if (filter.type && status.type !== filter.type) return false
      if (filter.dateRange) {
        const [start, end] = filter.dateRange
        if (start && status.timestamp < start) return false
        if (end && status.timestamp > end) return false
      }
      if (filter.keyword) {
        const keyword = filter.keyword.toLowerCase()
        return status.title.toLowerCase().includes(keyword) ||
               status.message.toLowerCase().includes(keyword)
      }
      return true
    })
  }
}

export const statusStorage = new StatusStorage()
```

## 更新日志

### v2.1.0
- 添加无障碍支持
- 优化性能和内存使用
- 增强状态持久化功能
- 支持自定义状态类型

### v2.0.0
- 重构组件架构
- 添加进度跟踪功能
- 支持批量状态管理
- 增加主题定制

### v1.5.0
- 添加状态历史记录
- 支持WebSocket实时更新
- 增加倒计时功能
- 优化移动端体验

### v1.0.0
- 初始版本发布
- 基础状态显示功能
- 进度条支持
- 操作按钮集成