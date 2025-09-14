# OptimizedRangePicker 优化日期范围选择器

高性能的日期范围选择器组件，支持快捷选择、自定义预设、时间选择和多种显示格式。

## 特性

- ✅ **高性能**: 虚拟滚动和懒加载优化
- ✅ **快捷选择**: 内置常用时间范围预设
- ✅ **自定义预设**: 支持业务场景定制
- ✅ **时间选择**: 精确到时分秒
- ✅ **多种格式**: 支持多种日期时间格式
- ✅ **国际化**: 支持多语言和本地化
- ✅ **响应式**: 适配移动端和桌面端
- ✅ **无障碍**: 完整的键盘导航支持
- ✅ **主题定制**: 支持明暗主题

## 安装依赖

```bash
pnpm add dayjs
pnpm add @ant-design/icons-vue
```

## 基础用法

### 简单日期范围选择

```vue
<template>
  <div>
    <OptimizedRangePicker
      v-model:value="dateRange"
      @change="handleDateChange"
    />
    <p>选择的日期范围: {{ formatDateRange(dateRange) }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OptimizedRangePicker from '@/components/common/OptimizedRangePicker.vue'
import dayjs, { type Dayjs } from 'dayjs'

const dateRange = ref<[Dayjs, Dayjs] | null>(null)

const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
  console.log('日期范围变化:', dates)
  if (dates) {
    console.log('开始日期:', dates[0].format('YYYY-MM-DD'))
    console.log('结束日期:', dates[1].format('YYYY-MM-DD'))
  }
}

const formatDateRange = (dates: [Dayjs, Dayjs] | null) => {
  if (!dates) return '未选择'
  return `${dates[0].format('YYYY-MM-DD')} ~ ${dates[1].format('YYYY-MM-DD')}`
}
</script>
```

### 带时间选择的日期范围

```vue
<template>
  <OptimizedRangePicker
    v-model:value="dateTimeRange"
    show-time
    :time-format="'HH:mm:ss'"
    format="YYYY-MM-DD HH:mm:ss"
    @change="handleDateTimeChange"
  />
</template>

<script setup lang="ts">
const dateTimeRange = ref<[Dayjs, Dayjs] | null>(null)

const handleDateTimeChange = (dates: [Dayjs, Dayjs] | null) => {
  if (dates) {
    console.log('开始时间:', dates[0].format('YYYY-MM-DD HH:mm:ss'))
    console.log('结束时间:', dates[1].format('YYYY-MM-DD HH:mm:ss'))
  }
}
</script>
```

### 自定义快捷选项

```vue
<template>
  <OptimizedRangePicker
    v-model:value="dateRange"
    :presets="customPresets"
    :show-presets="true"
  />
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const dateRange = ref<[Dayjs, Dayjs] | null>(null)

const customPresets = ref([
  {
    label: '今天',
    value: [dayjs().startOf('day'), dayjs().endOf('day')]
  },
  {
    label: '昨天',
    value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')]
  },
  {
    label: '最近7天',
    value: [dayjs().subtract(6, 'day').startOf('day'), dayjs().endOf('day')]
  },
  {
    label: '最近30天',
    value: [dayjs().subtract(29, 'day').startOf('day'), dayjs().endOf('day')]
  },
  {
    label: '本月',
    value: [dayjs().startOf('month'), dayjs().endOf('month')]
  },
  {
    label: '上月',
    value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  },
  {
    label: '本季度',
    value: [dayjs().startOf('quarter'), dayjs().endOf('quarter')]
  },
  {
    label: '本年',
    value: [dayjs().startOf('year'), dayjs().endOf('year')]
  }
])
</script>
```

## 高级用法

### 业务场景定制

```vue
<template>
  <div class="date-filter-container">
    <OptimizedRangePicker
      v-model:value="orderDateRange"
      :presets="orderPresets"
      :disabled-date="disabledDate"
      :shortcuts="orderShortcuts"
      placeholder="选择订单日期范围"
      @change="handleOrderDateChange"
      @preset-click="handlePresetClick"
    />
    
    <!-- 快速筛选按钮 */
    <div class="quick-filters">
      <a-button
        v-for="filter in quickFilters"
        :key="filter.key"
        :type="activeFilter === filter.key ? 'primary' : 'default'"
        size="small"
        @click="applyQuickFilter(filter)"
      >
        {{ filter.label }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'

const orderDateRange = ref<[Dayjs, Dayjs] | null>(null)
const activeFilter = ref<string | null>(null)

// 订单相关的预设选项
const orderPresets = computed(() => [
  {
    label: '今日订单',
    value: [dayjs().startOf('day'), dayjs().endOf('day')],
    key: 'today'
  },
  {
    label: '本周订单',
    value: [dayjs().startOf('week'), dayjs().endOf('week')],
    key: 'thisWeek'
  },
  {
    label: '本月订单',
    value: [dayjs().startOf('month'), dayjs().endOf('month')],
    key: 'thisMonth'
  },
  {
    label: '最近30天热销',
    value: [dayjs().subtract(29, 'day'), dayjs()],
    key: 'hotSales'
  },
  {
    label: '季度报表',
    value: [dayjs().startOf('quarter'), dayjs().endOf('quarter')],
    key: 'quarterReport'
  }
])

// 快速筛选选项
const quickFilters = ref([
  { key: 'pending', label: '待处理', dateRange: 'today' },
  { key: 'processing', label: '处理中', dateRange: 'thisWeek' },
  { key: 'completed', label: '已完成', dateRange: 'thisMonth' },
  { key: 'cancelled', label: '已取消', dateRange: 'thisMonth' }
])

// 禁用未来日期
const disabledDate = (current: Dayjs) => {
  return current && current > dayjs().endOf('day')
}

// 快捷键配置
const orderShortcuts = ref([
  {
    key: 'ctrl+1',
    action: () => applyPreset('today'),
    description: '今日订单'
  },
  {
    key: 'ctrl+7',
    action: () => applyPreset('thisWeek'),
    description: '本周订单'
  }
])

const handleOrderDateChange = (dates: [Dayjs, Dayjs] | null) => {
  orderDateRange.value = dates
  activeFilter.value = null
  
  // 触发数据查询
  if (dates) {
    fetchOrderData({
      startDate: dates[0].format('YYYY-MM-DD'),
      endDate: dates[1].format('YYYY-MM-DD')
    })
  }
}

const handlePresetClick = (preset: any) => {
  console.log('选择预设:', preset.label)
  // 可以在这里添加统计埋点
  trackEvent('date_preset_click', { preset: preset.key })
}

const applyQuickFilter = (filter: any) => {
  activeFilter.value = filter.key
  
  // 根据筛选类型应用对应的日期范围
  const preset = orderPresets.value.find(p => p.key === filter.dateRange)
  if (preset) {
    orderDateRange.value = preset.value
  }
  
  // 应用业务筛选逻辑
  fetchOrderData({
    status: filter.key,
    startDate: orderDateRange.value?.[0].format('YYYY-MM-DD'),
    endDate: orderDateRange.value?.[1].format('YYYY-MM-DD')
  })
}

const applyPreset = (presetKey: string) => {
  const preset = orderPresets.value.find(p => p.key === presetKey)
  if (preset) {
    orderDateRange.value = preset.value
  }
}

// 模拟数据获取
const fetchOrderData = async (params: any) => {
  console.log('获取订单数据:', params)
  // 实际的API调用
}

// 模拟事件追踪
const trackEvent = (event: string, data: any) => {
  console.log('事件追踪:', event, data)
}
</script>

<style scoped>
.date-filter-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.quick-filters {
  display: flex;
  gap: 8px;
}
</style>
```

### 动态预设和缓存

```vue
<template>
  <OptimizedRangePicker
    v-model:value="dateRange"
    :presets="dynamicPresets"
    :loading="presetsLoading"
    :cache-key="'user-date-presets'"
    @preset-save="handlePresetSave"
    @preset-delete="handlePresetDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useLocalStorage } from '@vueuse/core'

const userStore = useUserStore()
const dateRange = ref<[Dayjs, Dayjs] | null>(null)
const presetsLoading = ref(false)
const customPresets = useLocalStorage('date-presets', [])

// 动态预设（系统预设 + 用户自定义）
const dynamicPresets = computed(() => {
  const systemPresets = [
    {
      label: '今天',
      value: [dayjs().startOf('day'), dayjs().endOf('day')],
      type: 'system'
    },
    {
      label: '最近7天',
      value: [dayjs().subtract(6, 'day'), dayjs()],
      type: 'system'
    }
  ]
  
  return [
    ...systemPresets,
    ...customPresets.value.map(preset => ({
      ...preset,
      type: 'custom',
      deletable: true
    }))
  ]
})

// 保存用户自定义预设
const handlePresetSave = async (preset: any) => {
  presetsLoading.value = true
  
  try {
    // 保存到本地存储
    customPresets.value.push({
      id: Date.now().toString(),
      label: preset.label,
      value: preset.value,
      createdAt: new Date().toISOString()
    })
    
    // 同步到服务器（可选）
    if (userStore.isLoggedIn) {
      await savePresetToServer(preset)
    }
    
    message.success('预设保存成功')
  } catch (error) {
    message.error('预设保存失败')
    console.error(error)
  } finally {
    presetsLoading.value = false
  }
}

// 删除用户自定义预设
const handlePresetDelete = async (presetId: string) => {
  try {
    customPresets.value = customPresets.value.filter(p => p.id !== presetId)
    
    if (userStore.isLoggedIn) {
      await deletePresetFromServer(presetId)
    }
    
    message.success('预设删除成功')
  } catch (error) {
    message.error('预设删除失败')
    console.error(error)
  }
}

// 从服务器加载用户预设
const loadUserPresets = async () => {
  if (!userStore.isLoggedIn) return
  
  try {
    const serverPresets = await fetchUserPresetsFromServer()
    // 合并本地和服务器预设
    customPresets.value = mergePresets(customPresets.value, serverPresets)
  } catch (error) {
    console.error('加载用户预设失败:', error)
  }
}

onMounted(() => {
  loadUserPresets()
})
</script>
```

### 性能优化配置

```vue
<template>
  <OptimizedRangePicker
    v-model:value="dateRange"
    :virtual-scroll="true"
    :lazy-load="true"
    :debounce-delay="300"
    :cache-size="100"
    :preload-months="2"
    @performance-metrics="handlePerformanceMetrics"
  />
</template>

<script setup lang="ts">
// 性能监控
const handlePerformanceMetrics = (metrics: any) => {
  console.log('性能指标:', {
    renderTime: metrics.renderTime,
    memoryUsage: metrics.memoryUsage,
    cacheHitRate: metrics.cacheHitRate
  })
  
  // 发送到监控系统
  if (metrics.renderTime > 100) {
    reportPerformanceIssue('slow_render', metrics)
  }
}
</script>
```

## API 参考

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | `[Dayjs, Dayjs] \| null` | `null` | 选中的日期范围 |
| format | `string` | `'YYYY-MM-DD'` | 日期格式 |
| showTime | `boolean` | `false` | 是否显示时间选择 |
| timeFormat | `string` | `'HH:mm:ss'` | 时间格式 |
| presets | `PresetItem[]` | `[]` | 预设选项 |
| showPresets | `boolean` | `true` | 是否显示预设面板 |
| disabledDate | `(date: Dayjs) => boolean` | - | 禁用日期函数 |
| placeholder | `string \| [string, string]` | - | 输入框占位符 |
| size | `'small' \| 'middle' \| 'large'` | `'middle'` | 输入框大小 |
| disabled | `boolean` | `false` | 是否禁用 |
| allowClear | `boolean` | `true` | 是否允许清除 |
| virtualScroll | `boolean` | `false` | 是否启用虚拟滚动 |
| lazyLoad | `boolean` | `false` | 是否启用懒加载 |
| debounceDelay | `number` | `300` | 防抖延迟（毫秒） |
| cacheSize | `number` | `50` | 缓存大小 |
| preloadMonths | `number` | `1` | 预加载月份数 |
| shortcuts | `ShortcutItem[]` | `[]` | 快捷键配置 |
| theme | `'light' \| 'dark'` | `'light'` | 主题 |
| locale | `string` | `'zh-CN'` | 语言环境 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | `(dates: [Dayjs, Dayjs] \| null, dateStrings: [string, string] \| null)` | 日期范围变化事件 |
| ok | `(dates: [Dayjs, Dayjs])` | 确认选择事件 |
| preset-click | `(preset: PresetItem)` | 预设点击事件 |
| preset-save | `(preset: PresetItem)` | 预设保存事件 |
| preset-delete | `(presetId: string)` | 预设删除事件 |
| panel-change | `(value: [Dayjs, Dayjs], mode: [string, string])` | 面板变化事件 |
| calendar-change | `(dates: [Dayjs, Dayjs])` | 日历变化事件 |
| performance-metrics | `(metrics: PerformanceMetrics)` | 性能指标事件 |

### 方法

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| focus | - | `void` | 聚焦到输入框 |
| blur | - | `void` | 失去焦点 |
| clear | - | `void` | 清除选择 |
| setPreset | `(presetKey: string)` | `void` | 设置预设 |
| getPerformanceMetrics | - | `PerformanceMetrics` | 获取性能指标 |
| clearCache | - | `void` | 清除缓存 |

### 类型定义

```typescript
// 预设项接口
interface PresetItem {
  /** 预设标签 */
  label: string
  /** 预设值 */
  value: [Dayjs, Dayjs]
  /** 预设键值 */
  key?: string
  /** 预设类型 */
  type?: 'system' | 'custom'
  /** 是否可删除 */
  deletable?: boolean
  /** 图标 */
  icon?: string
  /** 描述 */
  description?: string
}

// 快捷键项接口
interface ShortcutItem {
  /** 快捷键 */
  key: string
  /** 执行动作 */
  action: () => void
  /** 描述 */
  description: string
}

// 性能指标接口
interface PerformanceMetrics {
  /** 渲染时间（毫秒） */
  renderTime: number
  /** 内存使用量（MB） */
  memoryUsage: number
  /** 缓存命中率（%） */
  cacheHitRate: number
  /** 组件实例数 */
  instanceCount: number
}

// 日期范围类型
type DateRange = [Dayjs, Dayjs] | null

// 日期格式类型
type DateFormat = 'YYYY-MM-DD' | 'YYYY/MM/DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY'

// 时间格式类型
type TimeFormat = 'HH:mm' | 'HH:mm:ss' | 'hh:mm A' | 'hh:mm:ss A'
```

## 样式定制

### CSS 变量

```css
.optimized-range-picker {
  --picker-bg: #ffffff;
  --picker-border: #d9d9d9;
  --picker-border-hover: #40a9ff;
  --picker-border-focus: #1890ff;
  --picker-text: #000000d9;
  --picker-placeholder: #bfbfbf;
  --picker-disabled-bg: #f5f5f5;
  --picker-disabled-text: #00000040;
  
  /* 预设面板 */
  --preset-bg: #fafafa;
  --preset-border: #f0f0f0;
  --preset-item-hover: #e6f7ff;
  --preset-item-active: #1890ff;
  
  /* 日历面板 */
  --calendar-bg: #ffffff;
  --calendar-border: #f0f0f0;
  --calendar-cell-hover: #e6f7ff;
  --calendar-cell-selected: #1890ff;
  --calendar-cell-in-range: #e6f7ff;
  
  /* 时间选择 */
  --time-panel-bg: #ffffff;
  --time-column-hover: #e6f7ff;
  --time-cell-selected: #1890ff;
}

/* 深色主题 */
[data-theme='dark'] .optimized-range-picker {
  --picker-bg: #141414;
  --picker-border: #434343;
  --picker-border-hover: #177ddc;
  --picker-border-focus: #1890ff;
  --picker-text: #ffffffd9;
  --picker-placeholder: #ffffff40;
  --picker-disabled-bg: #262626;
  --picker-disabled-text: #ffffff25;
  
  --preset-bg: #1f1f1f;
  --preset-border: #303030;
  --preset-item-hover: #111b26;
  --preset-item-active: #1890ff;
  
  --calendar-bg: #141414;
  --calendar-border: #303030;
  --calendar-cell-hover: #111b26;
  --calendar-cell-selected: #1890ff;
  --calendar-cell-in-range: #111b26;
  
  --time-panel-bg: #141414;
  --time-column-hover: #111b26;
  --time-cell-selected: #1890ff;
}
```

### 响应式设计

```css
.optimized-range-picker {
  /* 桌面端 */
  @media (min-width: 1024px) {
    .picker-dropdown {
      min-width: 600px;
    }
    
    .preset-panel {
      width: 200px;
    }
  }
  
  /* 平板端 */
  @media (max-width: 768px) {
    .picker-dropdown {
      min-width: 400px;
    }
    
    .preset-panel {
      width: 150px;
    }
    
    .calendar-panel {
      .calendar-header {
        font-size: 14px;
      }
    }
  }
  
  /* 移动端 */
  @media (max-width: 576px) {
    .picker-dropdown {
      width: 100vw;
      max-width: none;
      left: 0 !important;
      right: 0 !important;
    }
    
    .preset-panel {
      display: none;
    }
    
    .calendar-panel {
      width: 100%;
      
      .calendar-table {
        font-size: 12px;
      }
    }
    
    .time-panel {
      .time-column {
        width: 60px;
      }
    }
  }
}
```

## 最佳实践

### 1. 数据管理

```typescript
// composables/useDateRange.ts
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs, { type Dayjs } from 'dayjs'

export function useDateRange(options: {
  defaultRange?: [Dayjs, Dayjs]
  syncWithUrl?: boolean
  storageKey?: string
}) {
  const route = useRoute()
  const router = useRouter()
  
  const dateRange = ref<[Dayjs, Dayjs] | null>(options.defaultRange || null)
  
  // 从URL同步日期范围
  if (options.syncWithUrl) {
    const urlStart = route.query.start as string
    const urlEnd = route.query.end as string
    
    if (urlStart && urlEnd) {
      dateRange.value = [dayjs(urlStart), dayjs(urlEnd)]
    }
  }
  
  // 从本地存储恢复
  if (options.storageKey) {
    const stored = localStorage.getItem(options.storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        dateRange.value = [dayjs(parsed[0]), dayjs(parsed[1])]
      } catch (error) {
        console.warn('恢复日期范围失败:', error)
      }
    }
  }
  
  // 监听变化并同步
  watch(dateRange, (newRange) => {
    if (options.syncWithUrl && newRange) {
      router.replace({
        query: {
          ...route.query,
          start: newRange[0].format('YYYY-MM-DD'),
          end: newRange[1].format('YYYY-MM-DD')
        }
      })
    }
    
    if (options.storageKey && newRange) {
      localStorage.setItem(
        options.storageKey,
        JSON.stringify([newRange[0].toISOString(), newRange[1].toISOString()])
      )
    }
  })
  
  // 计算属性
  const dateRangeText = computed(() => {
    if (!dateRange.value) return ''
    return `${dateRange.value[0].format('YYYY-MM-DD')} ~ ${dateRange.value[1].format('YYYY-MM-DD')}`
  })
  
  const daysDiff = computed(() => {
    if (!dateRange.value) return 0
    return dateRange.value[1].diff(dateRange.value[0], 'day') + 1
  })
  
  return {
    dateRange,
    dateRangeText,
    daysDiff
  }
}
```

### 2. 性能优化

```vue
<script setup lang="ts">
import { ref, shallowRef, markRaw } from 'vue'
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

// 使用 shallowRef 减少响应式开销
const dateRange = shallowRef<[Dayjs, Dayjs] | null>(null)

// 使用 markRaw 标记不需要响应式的对象
const presets = markRaw([
  {
    label: '今天',
    value: [dayjs().startOf('day'), dayjs().endOf('day')]
  }
])

// 防抖处理用户输入
const debouncedSearch = useDebounceFn((value: string) => {
  performSearch(value)
}, 300)

// 节流处理滚动事件
const throttledScroll = useThrottleFn((event: Event) => {
  handleScroll(event)
}, 100)

// 懒加载月份数据
const loadMonthData = async (year: number, month: number) => {
  const cacheKey = `${year}-${month}`
  
  if (monthDataCache.has(cacheKey)) {
    return monthDataCache.get(cacheKey)
  }
  
  const data = await fetchMonthData(year, month)
  monthDataCache.set(cacheKey, data)
  
  // 限制缓存大小
  if (monthDataCache.size > 12) {
    const firstKey = monthDataCache.keys().next().value
    monthDataCache.delete(firstKey)
  }
  
  return data
}
</script>
```

### 3. 无障碍支持

```vue
<template>
  <OptimizedRangePicker
    :aria-label="'选择日期范围'"
    :aria-describedby="'date-range-help'"
    role="combobox"
    aria-expanded="false"
    @keydown="handleKeydown"
  />
  <div id="date-range-help" class="sr-only">
    使用方向键导航日历，回车键选择日期，ESC键关闭面板
  </div>
</template>

<script setup lang="ts">
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      navigateCalendar('down')
      break
    case 'ArrowUp':
      event.preventDefault()
      navigateCalendar('up')
      break
    case 'ArrowLeft':
      event.preventDefault()
      navigateCalendar('left')
      break
    case 'ArrowRight':
      event.preventDefault()
      navigateCalendar('right')
      break
    case 'Enter':
      event.preventDefault()
      selectCurrentDate()
      break
    case 'Escape':
      event.preventDefault()
      closePanel()
      break
  }
}
</script>

<style>
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
</style>
```

## 常见问题

### Q: 如何处理时区问题？

A: 使用 dayjs 的时区插件：

```typescript
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// 设置默认时区
dayjs.tz.setDefault('Asia/Shanghai')

// 在组件中使用
const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
  if (dates) {
    const startUTC = dates[0].utc().format()
    const endUTC = dates[1].utc().format()
    console.log('UTC时间:', startUTC, endUTC)
  }
}
```

### Q: 如何实现自定义日期格式？

A: 通过 format 属性和自定义解析函数：

```vue
<template>
  <OptimizedRangePicker
    :format="customFormat"
    :value-format="'YYYY-MM-DD'"
    :parse-format="parseCustomFormat"
  />
</template>

<script setup lang="ts">
const customFormat = 'YYYY年MM月DD日'

const parseCustomFormat = (value: string) => {
  // 自定义解析逻辑
  const match = value.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (match) {
    return dayjs(`${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`)
  }
  return null
}
</script>
```

### Q: 如何优化大数据量的性能？

A: 启用虚拟滚动和懒加载：

```vue
<template>
  <OptimizedRangePicker
    :virtual-scroll="true"
    :lazy-load="true"
    :cache-size="100"
    :preload-months="2"
    :render-cell="renderCell"
  />
</template>

<script setup lang="ts">
// 自定义单元格渲染
const renderCell = (date: Dayjs, info: any) => {
  // 只渲染可见区域的单元格
  if (!info.visible) return null
  
  return {
    class: {
      'custom-cell': true,
      'has-data': hasDataForDate(date)
    },
    children: date.date()
  }
}

const hasDataForDate = (date: Dayjs) => {
  // 检查该日期是否有数据（可以从缓存中快速查询）
  return dataCache.has(date.format('YYYY-MM-DD'))
}
</script>
```

## 更新日志

### v2.0.0
- 重构核心架构，提升性能
- 添加虚拟滚动支持
- 增强无障碍功能
- 支持自定义主题

### v1.5.0
- 添加快捷键支持
- 优化移动端体验
- 增加性能监控

### v1.0.0
- 初始版本发布
- 基础日期范围选择功能
- 预设选项支持