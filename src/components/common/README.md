# OptimizedRangePicker 优化的日期范围选择器

基于 Ant Design Vue 的 `a-range-picker` 组件进行优化，提供更好的用户体验和功能。

## 特性

- ✅ **中文本地化**: 自动支持中文界面和日期格式
- ✅ **预设快捷选项**: 提供常用的日期范围快捷选择
- ✅ **范围限制**: 支持最大/最小日期范围限制
- ✅ **自定义预设**: 支持自定义快捷选项
- ✅ **禁用日期**: 智能禁用不可选日期
- ✅ **TypeScript**: 完整的类型支持

## 基础用法

```vue
<template>
  <OptimizedRangePicker
    v-model:value="dateRange"
    @change="handleDateChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OptimizedRangePicker from '@/components/common/OptimizedRangePicker.vue'
import type { Dayjs } from 'dayjs'

const dateRange = ref<[Dayjs, Dayjs] | null>(null)

const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
  console.log('选择的日期范围:', dates)
}
</script>
```

## 高级用法

### 自定义预设选项

```vue
<template>
  <OptimizedRangePicker
    v-model:value="dateRange"
    :custom-presets="customPresets"
  />
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const customPresets = [
  {
    label: '本周',
    value: [dayjs().startOf('week'), dayjs().endOf('week')]
  },
  {
    label: '上周',
    value: [dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')]
  }
]
</script>
```

### 范围限制

```vue
<template>
  <!-- 限制最大选择范围为30天 -->
  <OptimizedRangePicker
    v-model:value="dateRange"
    :max-range="30"
  />
  
  <!-- 限制最小选择范围为7天 -->
  <OptimizedRangePicker
    v-model:value="dateRange"
    :min-range="7"
  />
</template>
```

### 带时间选择

```vue
<template>
  <OptimizedRangePicker
    v-model:value="dateRange"
    :show-time="true"
    format="YYYY-MM-DD HH:mm:ss"
  />
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 绑定值 | `[Dayjs, Dayjs] \| null` | - |
| placeholder | 占位符 | `[string, string]` | `['开始日期', '结束日期']` |
| format | 日期格式 | `string` | `'YYYY-MM-DD'` |
| showTime | 是否显示时间选择 | `boolean \| object` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| allowClear | 是否允许清除 | `boolean` | `true` |
| size | 尺寸 | `'large' \| 'middle' \| 'small'` | `'middle'` |
| showPresets | 是否显示预设选项 | `boolean` | `true` |
| customPresets | 自定义预设选项 | `Array<{ label: string; value: [Dayjs, Dayjs] }>` | - |
| maxRange | 最大可选择的日期范围（天数） | `number` | - |
| minRange | 最小可选择的日期范围（天数） | `number` | - |
| style | 样式 | `string \| object` | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 更新绑定值 | `(value: [Dayjs, Dayjs] \| null) => void` |
| change | 日期改变事件 | `(value: [Dayjs, Dayjs] \| null, dateString: [string, string]) => void` |
| ok | 确认选择事件 | `(value: [Dayjs, Dayjs]) => void` |

## 默认预设选项

组件提供以下默认预设选项：

- 今天
- 昨天
- 最近7天
- 最近30天
- 本月
- 上月
- 本季度
- 本年

## 注意事项

1. 确保项目已正确配置 Ant Design Vue 的中文本地化
2. 组件依赖 `dayjs` 库，确保已安装并配置中文locale
3. 范围限制功能会在用户选择时进行验证，超出范围的日期将被禁用
4. 默认禁用未来日期，可根据业务需求调整 `disabledDate` 函数

## 全局配置示例

在 `main.ts` 中配置中文本地化：

```typescript
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

// 配置 dayjs 中文本地化
dayjs.locale('zh-cn')

// 在 App.vue 中使用 ConfigProvider
```

```vue
<!-- App.vue -->
<template>
  <a-config-provider :locale="zhCN">
    <RouterView />
  </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
</script>
```