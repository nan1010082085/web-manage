<template>
  <div ref="containerRef" class="lazy-chart-container">
    <div v-if="!isVisible" class="chart-placeholder">
      <a-spin size="large" />
      <p class="placeholder-text">图表加载中...</p>
    </div>
    <slot v-else :is-visible="isVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 组件属性
 */
interface LazyChartProps {
  /** 根边距，用于提前触发加载 */
  rootMargin?: string
  /** 可见性阈值 */
  threshold?: number
  /** 是否只触发一次 */
  once?: boolean
}

/**
 * 组件名称
 */
defineOptions({
  name: 'LazyChart'
})

const props = withDefaults(defineProps<LazyChartProps>(), {
  rootMargin: '50px',
  threshold: 0.1,
  once: true
})

/**
 * 组件事件
 */
const emit = defineEmits<{
  visible: [isVisible: boolean]
}>()

// 响应式数据
const containerRef = ref<HTMLElement>()
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

/**
 * 初始化交叉观察器
 */
const initIntersectionObserver = (): void => {
  if (!containerRef.value || !window.IntersectionObserver) {
    // 如果不支持 IntersectionObserver，直接显示
    isVisible.value = true
    emit('visible', true)
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          emit('visible', true)
          
          // 如果设置为只触发一次，则停止观察
          if (props.once && observer) {
            observer.unobserve(entry.target)
          }
        } else if (!props.once) {
          isVisible.value = false
          emit('visible', false)
        }
      })
    },
    {
      rootMargin: props.rootMargin,
      threshold: props.threshold
    }
  )

  observer.observe(containerRef.value)
}

/**
 * 清理观察器
 */
const cleanup = (): void => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

// 生命周期钩子
onMounted(() => {
  initIntersectionObserver()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.lazy-chart-container {
  min-height: 400px;
  position: relative;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: var(--color-bg-container);
  border: 1px dashed var(--color-border);
  border-radius: 8px;
}

.placeholder-text {
  margin-top: 16px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .lazy-chart-container {
    min-height: 300px;
  }
  
  .chart-placeholder {
    height: 300px;
  }
}
</style>