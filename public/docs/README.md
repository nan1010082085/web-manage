# Common Components 通用组件文档

本文档介绍了 `src/components/common` 目录下的所有通用组件的使用方法和API。

## 组件列表

- [HighChart](#highchart) - 高性能图表组件
- [OptimizedRangePicker](#optimizedrangepicker) - 优化的日期范围选择器
- [QuickActions](#quickactions) - 快捷操作面板
- [SideMenu](#sidemenu) - 侧边菜单组件
- [StatusBar](#statusbar) - 状态栏组件
- [TopHeader](#topheader) - 顶部导航栏

---

## HighChart

基于 Highcharts 的高性能图表组件，支持自动调整大小和丰富的配置选项。

### 特性

- ✅ **高性能渲染**: 基于 Highcharts 引擎
- ✅ **自动调整大小**: 响应式布局支持
- ✅ **TypeScript**: 完整的类型支持
- ✅ **事件回调**: 图表创建和更新事件
- ✅ **配置灵活**: 支持所有 Highcharts 配置项

### 基础用法

```vue
<template>
  <HighChart
    :options="chartOptions"
    width="100%"
    height="400px"
    @created="onChartCreated"
    @updated="onChartUpdated"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HighChart from '@/components/common/HighChart.vue'
import type { Options } from 'highcharts'

const chartOptions = ref<Options>({
  title: {
    text: '示例图表'
  },
  series: [{
    name: '数据系列',
    data: [1, 2, 3, 4, 5]
  }]
})

const onChartCreated = (chart: Highcharts.Chart) => {
  console.log('图表创建完成:', chart)
}

const onChartUpdated = (chart: Highcharts.Chart) => {
  console.log('图表更新完成:', chart)
}
</script>
```

### API

#### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| options | `Options` | - | 图表配置选项 |
| width | `string` | `'100%'` | 图表宽度 |
| height | `string` | `'400px'` | 图表高度 |
| autoResize | `boolean` | `true` | 是否自动调整大小 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| created | `(chart: Highcharts.Chart)` | 图表创建完成事件 |
| updated | `(chart: Highcharts.Chart)` | 图表更新完成事件 |

---

## OptimizedRangePicker

基于 Ant Design Vue 的 `a-range-picker` 组件进行优化，提供更好的用户体验和功能。

### 特性

- ✅ **中文本地化**: 自动支持中文界面和日期格式
- ✅ **预设快捷选项**: 提供常用的日期范围快捷选择
- ✅ **范围限制**: 支持最大/最小日期范围限制
- ✅ **自定义预设**: 支持自定义快捷选项
- ✅ **禁用日期**: 智能禁用不可选日期
- ✅ **TypeScript**: 完整的类型支持

### 基础用法

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

### 高级用法

```vue
<template>
  <OptimizedRangePicker
    v-model:value="dateRange"
    :custom-presets="customPresets"
    :show-presets="true"
    :max-range="30"
    format="YYYY-MM-DD"
  />
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const customPresets = [
  {
    label: '本季度',
    value: [dayjs().startOf('quarter'), dayjs().endOf('quarter')]
  }
]
</script>
```

### API

#### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `[Dayjs, Dayjs] \| null` | - | 绑定值 |
| placeholder | `[string, string]` | `['开始日期', '结束日期']` | 占位符 |
| format | `string` | `'YYYY-MM-DD'` | 日期格式 |
| showTime | `boolean \| object` | `false` | 是否显示时间选择 |
| disabled | `boolean` | `false` | 是否禁用 |
| allowClear | `boolean` | `true` | 是否允许清除 |
| size | `'large' \| 'middle' \| 'small'` | `'middle'` | 尺寸 |
| showPresets | `boolean` | `true` | 是否显示预设选项 |
| customPresets | `Array<{label: string, value: [Dayjs, Dayjs]}>` | - | 自定义预设选项 |

---

## QuickActions

快捷操作面板组件，提供常用功能的快速访问入口。

### 特性

- ✅ **可折叠**: 支持展开/折叠状态
- ✅ **分组管理**: 操作按功能分组显示
- ✅ **徽章提醒**: 支持消息数量提醒
- ✅ **自定义配置**: 可配置显示的操作项
- ✅ **权限控制**: 支持操作权限验证

### 基础用法

```vue
<template>
  <QuickActions
    :collapsed="isCollapsed"
    @action-click="handleActionClick"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QuickActions from '@/components/common/QuickActions.vue'

const isCollapsed = ref(false)

const handleActionClick = (action: any) => {
  console.log('点击操作:', action)
}
</script>
```

### API

#### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| collapsed | `boolean` | `false` | 是否折叠 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| action-click | `(action: ActionItem)` | 操作项点击事件 |

---

## SideMenu

侧边菜单组件，支持多级菜单、收藏功能和业务域分组。

### 特性

- ✅ **多级菜单**: 支持无限层级菜单结构
- ✅ **收藏功能**: 常用菜单收藏和管理
- ✅ **业务域分组**: 按业务模块分组显示
- ✅ **折叠模式**: 支持菜单折叠显示
- ✅ **路由集成**: 与 Vue Router 深度集成

### 基础用法

```vue
<template>
  <SideMenu
    :collapsed="collapsed"
    :selected-keys="selectedKeys"
    @menu-click="handleMenuClick"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SideMenu from '@/components/common/SideMenu.vue'

const collapsed = ref(false)
const selectedKeys = ref(['dashboard'])

const handleMenuClick = (menuInfo: any) => {
  console.log('菜单点击:', menuInfo)
}
</script>
```

### API

#### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| collapsed | `boolean` | `false` | 是否折叠 |
| selectedKeys | `string[]` | `[]` | 当前选中的菜单项 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| menu-click | `(menuInfo: MenuInfo)` | 菜单项点击事件 |

---

## StatusBar

状态栏组件，用于显示操作状态、进度信息和系统通知。

### 特性

- ✅ **操作状态**: 显示当前操作的执行状态
- ✅ **进度显示**: 支持进度条和百分比显示
- ✅ **多状态支持**: 成功、错误、警告、信息状态
- ✅ **操作控制**: 支持取消、重试等操作
- ✅ **自动隐藏**: 可配置自动隐藏时间

### 基础用法

```vue
<template>
  <StatusBar
    :visible="showStatus"
    :current-operation="currentOp"
    @cancel="handleCancel"
    @retry="handleRetry"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StatusBar from '@/components/common/StatusBar.vue'

const showStatus = ref(true)
const currentOp = ref({
  message: '正在处理数据...',
  status: 'loading',
  progress: 50,
  cancelable: true
})

const handleCancel = () => {
  console.log('取消操作')
}

const handleRetry = () => {
  console.log('重试操作')
}
</script>
```

### API

#### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | `boolean` | `false` | 是否显示状态栏 |
| currentOperation | `OperationStatus` | - | 当前操作状态 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| cancel | - | 取消操作事件 |
| retry | - | 重试操作事件 |

---

## TopHeader

顶部导航栏组件，包含菜单折叠、面包屑导航、全局搜索和用户操作区域。

### 特性

- ✅ **响应式布局**: 适配不同屏幕尺寸
- ✅ **面包屑导航**: 自动生成路由面包屑
- ✅ **全局搜索**: 支持功能、数据、文档搜索
- ✅ **用户中心**: 用户信息和操作入口
- ✅ **通知中心**: 消息通知和提醒
- ✅ **主题切换**: 支持明暗主题切换

### 基础用法

```vue
<template>
  <TopHeader
    :collapsed="collapsed"
    :user-info="userInfo"
    @toggle-collapsed="handleToggle"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopHeader from '@/components/common/TopHeader.vue'

const collapsed = ref(false)
const userInfo = ref({
  name: '管理员',
  avatar: '/avatar.png'
})

const handleToggle = () => {
  collapsed.value = !collapsed.value
}

const handleSearch = (value: string) => {
  console.log('搜索:', value)
}
</script>
```

### API

#### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| collapsed | `boolean` | `false` | 菜单是否折叠 |
| userInfo | `UserInfo` | - | 用户信息 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| toggle-collapsed | - | 切换菜单折叠状态 |
| search | `(value: string)` | 全局搜索事件 |

---

## 类型定义

```typescript
// 操作状态接口
interface OperationStatus {
  message: string
  status: 'loading' | 'success' | 'error' | 'info'
  progress?: number
  cancelable?: boolean
  retryable?: boolean
}

// 用户信息接口
interface UserInfo {
  name: string
  avatar?: string
  email?: string
  role?: string
}

// 菜单项接口
interface MenuItem {
  key: string
  title: string
  icon?: any
  path?: string
  children?: MenuItem[]
}

// 操作项接口
interface ActionItem {
  key: string
  title: string
  icon: any
  disabled?: boolean
  badge?: number
}
```

## 样式定制

所有组件都支持通过 CSS 变量进行样式定制：

```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --text-color: #000000d9;
  --border-color: #d9d9d9;
  --background-color: #ffffff;
}
```

## 注意事项

1. 所有组件都需要在 Vue 3 + TypeScript 环境下使用
2. 依赖 Ant Design Vue 4.x 版本
3. 图表组件需要安装 Highcharts 依赖
4. 日期组件使用 dayjs 作为日期处理库
5. 建议在项目中统一使用这些组件以保持界面一致性

## 更新日志

### v1.0.0
- 初始版本发布
- 包含 6 个核心通用组件
- 完整的 TypeScript 支持
- 详细的使用文档和示例