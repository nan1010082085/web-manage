<template>
  <a-range-picker
    v-model:value="dateRange"
    :placeholder="placeholder"
    :format="format"
    :show-time="showTime"
    :disabled="disabled"
    :allow-clear="allowClear"
    :size="size"
    :presets="presets"
    :disabled-date="disabledDate"
    :style="style"
    @change="handleChange"
    @ok="handleOk"
  >
    <template #suffixIcon>
      <CalendarOutlined />
    </template>
  </a-range-picker>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CalendarOutlined } from '@ant-design/icons-vue'
import dayjs, { type Dayjs } from 'dayjs'

/**
 * 优化的日期范围选择器组件
 * 提供预设快捷选项、格式化、禁用日期等功能
 */

interface Props {
  /** 绑定值 */
  modelValue?: [Dayjs, Dayjs] | null
  /** 占位符 */
  placeholder?: [string, string]
  /** 日期格式 */
  format?: string
  /** 是否显示时间选择 */
  showTime?: boolean | object
  /** 是否禁用 */
  disabled?: boolean
  /** 是否允许清除 */
  allowClear?: boolean
  /** 尺寸 */
  size?: 'large' | 'middle' | 'small'
  /** 是否显示预设选项 */
  showPresets?: boolean
  /** 自定义预设选项 */
  customPresets?: Array<{ label: string; value: [Dayjs, Dayjs] }>
  /** 最大可选择的日期范围（天数） */
  maxRange?: number
  /** 最小可选择的日期范围（天数） */
  minRange?: number
  /** 样式 */
  style?: string | object
}

interface Emits {
  /** 更新绑定值 */
  (e: 'update:modelValue', value: [Dayjs, Dayjs] | null): void
  /** 日期改变事件 */
  (e: 'change', value: [Dayjs, Dayjs] | null, dateString: [string, string]): void
  /** 确认选择事件 */
  (e: 'ok', value: [Dayjs, Dayjs]): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: () => ['开始日期', '结束日期'],
  format: 'YYYY-MM-DD',
  showTime: false,
  disabled: false,
  allowClear: true,
  size: 'middle',
  showPresets: true,
  maxRange: undefined,
  minRange: undefined
})

const emit = defineEmits<Emits>()

// 内部日期值
const dateRange = ref<[Dayjs, Dayjs] | null>(props.modelValue || null)

/**
 * 预设快捷选项
 */
const presets = computed(() => {
  if (!props.showPresets) return undefined
  
  const defaultPresets = [
    {
      label: '今天',
      value: [dayjs().startOf('day'), dayjs().endOf('day')] as [Dayjs, Dayjs]
    },
    {
      label: '昨天',
      value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')] as [Dayjs, Dayjs]
    },
    {
      label: '最近7天',
      value: [dayjs().subtract(6, 'day').startOf('day'), dayjs().endOf('day')] as [Dayjs, Dayjs]
    },
    {
      label: '最近30天',
      value: [dayjs().subtract(29, 'day').startOf('day'), dayjs().endOf('day')] as [Dayjs, Dayjs]
    },
    {
      label: '本月',
      value: [dayjs().startOf('month'), dayjs().endOf('month')] as [Dayjs, Dayjs]
    },
    {
      label: '上月',
      value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] as [Dayjs, Dayjs]
    },
    {
      label: '本季度',
      value: [dayjs().startOf('quarter'), dayjs().endOf('quarter')] as [Dayjs, Dayjs]
    },
    {
      label: '本年',
      value: [dayjs().startOf('year'), dayjs().endOf('year')] as [Dayjs, Dayjs]
    }
  ]
  
  return props.customPresets || defaultPresets
})

/**
 * 禁用日期函数
 */
const disabledDate = (current: Dayjs): boolean => {
  if (!current) return false
  
  // 禁用未来日期（可根据需要调整）
  if (current.isAfter(dayjs().endOf('day'))) {
    return true
  }
  
  // 如果有选中的开始日期，检查范围限制
  if (dateRange.value && dateRange.value[0] && !dateRange.value[1]) {
    const startDate = dateRange.value[0]
    
    // 最大范围限制
    if (props.maxRange && Math.abs(current.diff(startDate, 'day')) > props.maxRange) {
      return true
    }
    
    // 最小范围限制
    if (props.minRange && Math.abs(current.diff(startDate, 'day')) < props.minRange) {
      return true
    }
  }
  
  return false
}

/**
 * 处理日期改变
 */
const handleChange = (dates: [Dayjs, Dayjs] | null, dateStrings: [string, string]): void => {
  dateRange.value = dates
  emit('update:modelValue', dates)
  emit('change', dates, dateStrings)
}

/**
 * 处理确认选择
 */
const handleOk = (value: [Dayjs, Dayjs]): void => {
  emit('ok', value)
}

/**
 * 监听外部值变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    dateRange.value = newValue || null
  },
  { deep: true }
)
</script>

<style scoped>
.ant-picker {
  width: 100%;
}
</style>