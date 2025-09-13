<template>
  <a-card :title="title" class="chart-card" :loading="loading">
    <template #extra>
      <slot name="extra" :loading="loading" :onRefresh="handleRefresh">
        <a-button v-if="showRefresh" @click="handleRefresh" :loading="loading">
          <template #icon><ReloadOutlined /></template>
          刷新
        </a-button>
      </slot>
    </template>
    
    <div class="chart-container">
      <HighChart
        :options="options"
        :height="height"
        :width="width"
        @created="handleChartCreated"
        @error="handleChartError"
      />
    </div>
    
    <!-- 空状态 -->
    <div v-if="showEmpty" class="chart-empty">
      <a-empty :description="emptyDescription" />
    </div>
    
    <!-- 错误状态 -->
    <div v-if="showError" class="chart-error">
      <a-result
        status="error"
        :title="errorTitle"
        :sub-title="errorDescription"
      >
        <template #extra>
          <a-button type="primary" @click="handleRefresh">重新加载</a-button>
        </template>
      </a-result>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import HighChart from '@/components/common/HighChart.vue'
import type { Options } from 'highcharts'

/**
 * 图表卡片组件属性
 */
interface ChartCardProps {
  /** 卡片标题 */
  title: string
  /** 图表配置选项 */
  options: Options
  /** 图表高度 */
  height?: string
  /** 图表宽度 */
  width?: string
  /** 加载状态 */
  loading?: boolean
  /** 是否显示刷新按钮 */
  showRefresh?: boolean
  /** 是否显示空状态 */
  showEmpty?: boolean
  /** 空状态描述 */
  emptyDescription?: string
  /** 是否显示错误状态 */
  showError?: boolean
  /** 错误标题 */
  errorTitle?: string
  /** 错误描述 */
  errorDescription?: string
}

/**
 * 图表卡片组件事件
 */
interface ChartCardEmits {
  /** 刷新事件 */
  refresh: []
  /** 图表创建完成事件 */
  chartCreated: [chartInstance: any]
  /** 图表错误事件 */
  chartError: [error: any]
}

/**
 * 组件名称
 */
defineOptions({
  name: 'ChartCard'
})

/**
 * 组件属性
 */
const props = withDefaults(defineProps<ChartCardProps>(), {
  height: '350px',
  width: '100%',
  loading: false,
  showRefresh: true,
  showEmpty: false,
  emptyDescription: '暂无数据',
  showError: false,
  errorTitle: '加载失败',
  errorDescription: '图表数据加载失败，请重试'
})

/**
 * 组件事件
 */
const emit = defineEmits<ChartCardEmits>()

/**
 * 是否显示图表内容
 */
const showChart = computed(() => {
  return !props.showEmpty && !props.showError && props.options && Object.keys(props.options).length > 0
})

/**
 * 处理刷新事件
 */
const handleRefresh = (): void => {
  emit('refresh')
}

/**
 * 处理图表创建完成事件
 * @param chartInstance 图表实例
 */
const handleChartCreated = (chartInstance: any): void => {
  emit('chartCreated', chartInstance)
}

/**
 * 处理图表错误事件
 * @param error 错误信息
 */
const handleChartError = (error: any): void => {
  console.error('图表渲染错误:', error)
  emit('chartError', error)
}
</script>

<style scoped>
.chart-card {
  height: fit-content;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-card :deep(.ant-card-body) {
  padding: 16px;
}

.chart-card :deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
}

.chart-container {
  position: relative;
  width: 100%;
}

.chart-empty,
.chart-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.chart-error {
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-card :deep(.ant-card-body) {
    padding: 12px;
  }
  
  .chart-card :deep(.ant-card-head-title) {
    font-size: 14px;
  }
}

/* 加载状态样式 */
.chart-card.ant-card-loading .chart-container {
  opacity: 0.6;
  pointer-events: none;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .chart-card {
    background-color: #1f1f1f;
    border-color: #303030;
  }
  
  .chart-card :deep(.ant-card-head) {
    border-bottom-color: #303030;
  }
}
</style>