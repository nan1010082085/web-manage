<template>
  <div ref="chartContainer" :style="{ width: width, height: height }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Highcharts from 'highcharts'
import type { Options } from 'highcharts'
import { baseChartConfig } from '@/config/charts'

/**
 * 组件属性接口
 */
interface Props {
  /** 图表配置选项 */
  options: Options
  /** 图表宽度 */
  width?: string
  /** 图表高度 */
  height?: string
  /** 是否自动调整大小 */
  autoResize?: boolean
}

/**
 * 组件属性定义
 */
const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '400px',
  autoResize: true,
})

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 图表创建完成事件 */
  created: [chart: Highcharts.Chart]
  /** 图表更新完成事件 */
  updated: [chart: Highcharts.Chart]
}>()

// 模板引用
const chartContainer = ref<HTMLElement>()
// 图表实例
const chart = ref<Highcharts.Chart | null>(null)
// 窗口大小调整监听器
let resizeObserver: ResizeObserver | null = null

/**
 * 创建图表
 */
const createChart = async (): Promise<void> => {
  if (!chartContainer.value) return

  try {
    // 合并基础配置和传入配置
    const mergedOptions: Options = {
      ...baseChartConfig,
      ...props.options,
      chart: {
        ...(baseChartConfig.chart || {}),
        ...(props.options.chart || {}),
      },
    }

    // 创建图表实例
    chart.value = Highcharts.chart(chartContainer.value, mergedOptions)

    // 触发创建完成事件
    emit('created', chart.value)
  } catch (error) {
    console.error('创建图表失败:', error)
  }
}

/**
 * 更新图表
 */
const updateChart = (): void => {
  if (!chart.value) return

  try {
    // 只传递变更的配置，避免完全重新合并
    // 使用oneToOne参数优化更新性能
    chart.value?.update(props.options, true, true)
    // 触发更新完成事件
    emit('updated', chart.value)
  } catch (error) {
    console.error('更新图表失败:', error)
  }
}

/**
 * 销毁图表
 */
const destroyChart = (): void => {
  if (chart.value) {
    chart.value.destroy()
    chart.value = null
  }
}

/**
 * 调整图表大小
 */
const resizeChart = (): void => {
  if (chart.value) {
    chart.value.reflow()
  }
}

/**
 * 设置窗口大小调整监听
 */
const setupResizeObserver = (): void => {
  if (!props.autoResize || !chartContainer.value) return

  resizeObserver = new ResizeObserver(() => {
    resizeChart()
  })

  resizeObserver.observe(chartContainer.value)
}

/**
 * 清理窗口大小调整监听
 */
const cleanupResizeObserver = (): void => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

// 防抖更新函数
let updateTimer: NodeJS.Timeout | null = null
const debouncedUpdate = (): void => {
  if (updateTimer) {
    clearTimeout(updateTimer)
  }
  updateTimer = setTimeout(() => {
    if (chart.value) {
      updateChart()
    }
  }, 100) // 100ms防抖
}

// 监听配置变化
watch(
  () => props.options,
  (newOptions, oldOptions) => {
    // 只有在配置真正发生变化时才更新
    if (chart.value && JSON.stringify(newOptions) !== JSON.stringify(oldOptions)) {
      debouncedUpdate()
    }
  },
  { deep: true },
)

// 组件挂载
onMounted(async () => {
  await createChart()
  setupResizeObserver()
})

// 组件卸载
onUnmounted(() => {
  // 清理防抖定时器
  if (updateTimer) {
    clearTimeout(updateTimer)
    updateTimer = null
  }
  cleanupResizeObserver()
  destroyChart()
})

/**
 * 暴露给父组件的方法
 */
defineExpose({
  /** 获取图表实例 */
  getChart: () => chart,
  /** 手动调整图表大小 */
  resize: resizeChart,
  /** 重新创建图表 */
  recreate: async () => {
    destroyChart()
    await nextTick()
    await createChart()
  },
})
</script>

<style scoped>
/* 图表容器样式 */
</style>
