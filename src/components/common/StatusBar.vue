<template>
  <div class="status-bar" :class="{ visible: isVisible }">
    <div class="status-content">
      <!-- 操作状态 -->
      <div v-if="currentOperation" class="operation-status">
        <div class="operation-info">
          <a-spin v-if="currentOperation.loading" size="small" />
          <CheckCircleOutlined
            v-else-if="currentOperation.status === 'success'"
            class="success-icon"
          />
          <ExclamationCircleOutlined
            v-else-if="currentOperation.status === 'error'"
            class="error-icon"
          />
          <InfoCircleOutlined v-else class="info-icon" />

          <span class="operation-text">{{ currentOperation.message }}</span>

          <div v-if="currentOperation.progress !== undefined" class="progress-info">
            <a-progress
              :percent="currentOperation.progress"
              size="small"
              :show-info="false"
              class="progress-bar"
            />
            <span class="progress-text">{{ currentOperation.progress }}%</span>
          </div>
        </div>

        <div class="operation-actions">
          <a-button
            v-if="currentOperation.cancelable"
            type="text"
            size="small"
            @click="cancelOperation"
            class="cancel-btn"
          >
            取消
          </a-button>

          <a-button
            v-if="currentOperation.status === 'error' && currentOperation.retryable"
            type="text"
            size="small"
            @click="retryOperation"
            class="retry-btn"
          >
            重试
          </a-button>

          <a-button type="text" size="small" @click="dismissOperation" class="close-btn">
            <CloseOutlined />
          </a-button>
        </div>
      </div>

      <!-- 系统状态 -->
      <div class="system-status">
        <!-- 网络状态 -->
        <div class="status-item" :class="{ offline: !networkStatus.online }">
          <WifiOutlined v-if="networkStatus.online" class="status-icon online" />
          <DisconnectOutlined v-else class="status-icon offline" />
          <span class="status-text">
            {{ networkStatus.online ? '在线' : '离线' }}
          </span>
        </div>

        <!-- 数据同步状态 -->
        <div class="status-item" :class="{ syncing: syncStatus.syncing }">
          <SyncOutlined :class="{ 'sync-spinning': syncStatus.syncing }" class="status-icon" />
          <span class="status-text">
            {{ syncStatus.syncing ? '同步中' : `上次同步: ${syncStatus.lastSync}` }}
          </span>
        </div>

        <!-- 系统性能 -->
        <div class="status-item performance" @click="showPerformanceDetails = true">
          <DashboardOutlined class="status-icon" />
          <span class="status-text">性能: {{ performanceStatus.level }}</span>
          <div class="performance-indicator" :class="performanceStatus.level.toLowerCase()"></div>
        </div>

        <!-- 当前时间 -->
        <div class="status-item time">
          <ClockCircleOutlined class="status-icon" />
          <span class="status-text">{{ currentTime }}</span>
        </div>
      </div>
    </div>

    <!-- 性能详情弹窗 -->
    <a-modal
      v-model:open="showPerformanceDetails"
      title="系统性能监控"
      width="600px"
      :footer="null"
    >
      <div class="performance-details">
        <div class="metric-item">
          <span class="metric-label">CPU使用率</span>
          <a-progress :percent="performanceMetrics.cpu" status="active" />
        </div>
        <div class="metric-item">
          <span class="metric-label">内存使用率</span>
          <a-progress :percent="performanceMetrics.memory" status="active" />
        </div>
        <div class="metric-item">
          <span class="metric-label">网络延迟</span>
          <span class="metric-value">{{ performanceMetrics.latency }}ms</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">页面加载时间</span>
          <span class="metric-value">{{ performanceMetrics.loadTime }}ms</span>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  WifiOutlined,
  DisconnectOutlined,
  SyncOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue'
import { debounce } from 'lodash-es'

/**
 * 操作状态栏组件
 * 显示当前操作进度、系统状态等信息
 */

interface Operation {
  id: string
  message: string
  status: 'loading' | 'success' | 'error' | 'info'
  progress?: number
  loading?: boolean
  cancelable?: boolean
  retryable?: boolean
  timestamp: number
}

interface NetworkStatus {
  online: boolean
  speed?: string
  type?: string
}

interface SyncStatus {
  syncing: boolean
  lastSync: string
  nextSync?: string
}

interface PerformanceStatus {
  level: 'Good' | 'Fair' | 'Poor'
  score: number
}

interface PerformanceMetrics {
  cpu: number
  memory: number
  latency: number
  loadTime: number
}

// 响应式数据
const isVisible = ref(false)
const currentOperation = ref<Operation | null>(null)
const showPerformanceDetails = ref(false)
const currentTime = ref('')

const networkStatus = ref<NetworkStatus>({
  online: navigator.onLine,
})

const syncStatus = ref<SyncStatus>({
  syncing: false,
  lastSync: '刚刚',
})

const performanceStatus = ref<PerformanceStatus>({
  level: 'Good',
  score: 85,
})

const performanceMetrics = ref<PerformanceMetrics>({
  cpu: 45,
  memory: 62,
  latency: 120,
  loadTime: 850,
})

// 定时器
let timeTimer: NodeJS.Timeout | null = null
let performanceTimer: NodeJS.Timeout | null = null
let operationTimer: NodeJS.Timeout | null = null

/**
 * 显示操作状态
 */
const showOperation = (operation: Omit<Operation, 'id' | 'timestamp'>): string => {
  const id = Date.now().toString()
  currentOperation.value = {
    ...operation,
    id,
    timestamp: Date.now(),
  }
  isVisible.value = true

  // 自动隐藏成功和错误状态
  if (operation.status === 'success' || operation.status === 'error') {
    operationTimer = setTimeout(() => {
      if (currentOperation.value?.id === id) {
        dismissOperation()
      }
    }, 5000)
  }

  return id
}

/**
 * 更新操作进度
 */
const updateOperation = (id: string, updates: Partial<Operation>): void => {
  if (currentOperation.value?.id === id) {
    currentOperation.value = {
      ...currentOperation.value,
      ...updates,
    }
  }
}

/**
 * 取消操作
 */
const cancelOperation = (): void => {
  if (currentOperation.value?.cancelable) {
    // 触发取消事件
    window.dispatchEvent(
      new CustomEvent('operation-cancel', {
        detail: { id: currentOperation.value.id },
      }),
    )

    currentOperation.value = {
      ...currentOperation.value,
      status: 'error',
      message: '操作已取消',
      loading: false,
      cancelable: false,
    }
  }
}

/**
 * 重试操作
 */
const retryOperation = (): void => {
  if (currentOperation.value?.retryable) {
    // 触发重试事件
    window.dispatchEvent(
      new CustomEvent('operation-retry', {
        detail: { id: currentOperation.value.id },
      }),
    )

    currentOperation.value = {
      ...currentOperation.value,
      status: 'loading',
      loading: true,
      retryable: false,
    }
  }
}

/**
 * 关闭操作状态
 */
const dismissOperation = (): void => {
  currentOperation.value = null
  if (operationTimer) {
    clearTimeout(operationTimer)
    operationTimer = null
  }

  // 如果没有其他状态需要显示，隐藏状态栏
  setTimeout(() => {
    if (!currentOperation.value) {
      isVisible.value = false
    }
  }, 300)
}

/**
 * 更新当前时间
 */
const updateTime = (): void => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * 更新网络状态
 */
const updateNetworkStatus = (): void => {
  networkStatus.value.online = navigator.onLine

  // 检测网络速度（简化版）
  if (navigator.onLine) {
    const connection = (navigator as any).connection
    if (connection) {
      networkStatus.value.speed = connection.effectiveType
      networkStatus.value.type = connection.type
    }
  }
}

/**
 * 更新同步状态
 */
const updateSyncStatus = debounce((): void => {
  // 模拟同步状态更新
  const now = new Date()
  syncStatus.value.lastSync = now.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  })
}, 1000)

/**
 * 更新性能状态
 */
const updatePerformanceStatus = (): void => {
  // 模拟性能监控
  const metrics = {
    cpu: Math.floor(Math.random() * 30) + 30, // 30-60%
    memory: Math.floor(Math.random() * 40) + 40, // 40-80%
    latency: Math.floor(Math.random() * 100) + 50, // 50-150ms
    loadTime: Math.floor(Math.random() * 500) + 500, // 500-1000ms
  }

  performanceMetrics.value = metrics

  // 计算性能等级
  const avgScore =
    (100 -
      metrics.cpu +
      100 -
      metrics.memory +
      Math.max(0, 100 - metrics.latency / 2) +
      Math.max(0, 100 - metrics.loadTime / 10)) /
    4

  if (avgScore >= 80) {
    performanceStatus.value = { level: 'Good', score: avgScore }
  } else if (avgScore >= 60) {
    performanceStatus.value = { level: 'Fair', score: avgScore }
  } else {
    performanceStatus.value = { level: 'Poor', score: avgScore }
  }
}

/**
 * 开始同步
 */
const startSync = (): void => {
  syncStatus.value.syncing = true

  // 模拟同步过程
  setTimeout(() => {
    syncStatus.value.syncing = false
    updateSyncStatus()
    message.success('数据同步完成')
  }, 3000)
}

// 暴露方法给外部使用
defineExpose({
  showOperation,
  updateOperation,
  dismissOperation,
  startSync,
})

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  // 更新时间
  updateTime()
  timeTimer = setInterval(updateTime, 1000)

  // 更新性能状态
  updatePerformanceStatus()
  performanceTimer = setInterval(updatePerformanceStatus, 10000)

  // 监听网络状态变化
  window.addEventListener('online', updateNetworkStatus)
  window.addEventListener('offline', updateNetworkStatus)

  // 监听全局操作事件
  window.addEventListener('show-operation', (e: any) => {
    showOperation(e.detail)
  })

  window.addEventListener('update-operation', (e: any) => {
    updateOperation(e.detail.id, e.detail.updates)
  })

  // 初始显示状态栏
  isVisible.value = true
})

/**
 * 组件卸载时清理
 */
onUnmounted(() => {
  if (timeTimer) {
    clearInterval(timeTimer)
  }

  if (performanceTimer) {
    clearInterval(performanceTimer)
  }

  if (operationTimer) {
    clearTimeout(operationTimer)
  }

  window.removeEventListener('online', updateNetworkStatus)
  window.removeEventListener('offline', updateNetworkStatus)
})
</script>

<style scoped lang="less">
.status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  z-index: 999;
  transform: translateY(100%);
  transition: transform 0.3s ease;

  &.visible {
    transform: translateY(0);
  }
}

.status-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
}

.operation-status {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 16px;
}

.operation-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.operation-text {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
}

.progress-info {
  display: flex;
  align-items: center;
  margin-left: 16px;
}

.progress-bar {
  width: 120px;
  margin-right: 8px;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 35px;
}

.operation-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cancel-btn,
.retry-btn,
.close-btn {
  color: #666;

  &:hover {
    color: #1890ff;
  }
}

.system-status {
  display: flex;
  align-items: center;
  gap: 24px;
}

.status-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
  cursor: default;

  &.performance {
    cursor: pointer;

    &:hover {
      color: #1890ff;
    }
  }

  &.offline {
    color: #ff4d4f;
  }

  &.syncing {
    color: #1890ff;
  }
}

.status-icon {
  margin-right: 4px;
  font-size: 14px;

  &.online {
    color: #52c41a;
  }

  &.offline {
    color: #ff4d4f;
  }

  &.sync-spinning {
    animation: spin 1s linear infinite;
  }
}

.status-text {
  white-space: nowrap;
}

.performance-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-left: 4px;

  &.good {
    background: #52c41a;
  }

  &.fair {
    background: #faad14;
  }

  &.poor {
    background: #ff4d4f;
  }
}

.success-icon {
  color: #52c41a;
}

.error-icon {
  color: #ff4d4f;
}

.info-icon {
  color: #1890ff;
}

.time {
  font-family: 'Courier New', monospace;
}

.performance-details {
  .metric-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .metric-label {
    font-size: 14px;
    color: #333;
    min-width: 100px;
  }

  .metric-value {
    font-size: 14px;
    color: #666;
    font-family: 'Courier New', monospace;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
