# HighChart 高性能图表组件

基于 Highcharts 的高性能图表组件，支持自动调整大小和丰富的配置选项。

## 特性

- ✅ **高性能渲染**: 基于 Highcharts 引擎，支持大数据量渲染
- ✅ **自动调整大小**: 响应式布局支持，自动适配容器大小
- ✅ **TypeScript**: 完整的类型支持和智能提示
- ✅ **事件回调**: 图表创建和更新事件监听
- ✅ **配置灵活**: 支持所有 Highcharts 配置项
- ✅ **内存优化**: 组件销毁时自动清理图表实例

## 安装依赖

```bash
pnpm add highcharts
pnpm add @types/highcharts -D
```

## 基础用法

### 简单折线图

```vue
<template>
  <HighChart
    :options="lineChartOptions"
    width="100%"
    height="400px"
    @created="onChartCreated"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HighChart from '@/components/common/HighChart.vue'
import type { Options } from 'highcharts'

const lineChartOptions = ref<Options>({
  title: {
    text: '月度销售趋势'
  },
  xAxis: {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    title: {
      text: '销售额 (万元)'
    }
  },
  series: [{
    name: '销售额',
    type: 'line',
    data: [120, 150, 180, 200, 230, 250]
  }]
})

const onChartCreated = (chart: Highcharts.Chart) => {
  console.log('图表创建完成:', chart)
}
</script>
```

### 柱状图示例

```vue
<template>
  <HighChart
    :options="barChartOptions"
    height="500px"
  />
</template>

<script setup lang="ts">
const barChartOptions = ref<Options>({
  chart: {
    type: 'column'
  },
  title: {
    text: '产品销量对比'
  },
  xAxis: {
    categories: ['产品A', '产品B', '产品C', '产品D']
  },
  yAxis: {
    title: {
      text: '销量 (件)'
    }
  },
  series: [{
    name: '本月',
    data: [100, 150, 120, 180]
  }, {
    name: '上月',
    data: [80, 130, 100, 160]
  }]
})
</script>
```

### 饼图示例

```vue
<template>
  <HighChart
    :options="pieChartOptions"
    width="600px"
    height="400px"
  />
</template>

<script setup lang="ts">
const pieChartOptions = ref<Options>({
  chart: {
    type: 'pie'
  },
  title: {
    text: '市场份额分布'
  },
  series: [{
    name: '份额',
    data: [
      { name: '产品A', y: 35.5 },
      { name: '产品B', y: 28.2 },
      { name: '产品C', y: 20.8 },
      { name: '产品D', y: 15.5 }
    ]
  }]
})
</script>
```

## 高级用法

### 动态数据更新

```vue
<template>
  <div>
    <HighChart
      ref="chartRef"
      :options="dynamicOptions"
      @created="onChartCreated"
      @updated="onChartUpdated"
    />
    <a-button @click="updateData">更新数据</a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const chartRef = ref()
let chartInstance: Highcharts.Chart | null = null

const dynamicOptions = ref<Options>({
  title: {
    text: '实时数据监控'
  },
  series: [{
    name: '数据',
    data: [10, 20, 30, 40, 50]
  }]
})

const onChartCreated = (chart: Highcharts.Chart) => {
  chartInstance = chart
}

const onChartUpdated = (chart: Highcharts.Chart) => {
  console.log('图表已更新')
}

const updateData = () => {
  if (chartInstance) {
    const newData = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100))
    chartInstance.series[0].setData(newData)
  }
}

// 模拟实时数据
onMounted(() => {
  setInterval(() => {
    updateData()
  }, 3000)
})
</script>
```

### 多Y轴图表

```vue
<template>
  <HighChart :options="multiAxisOptions" height="500px" />
</template>

<script setup lang="ts">
const multiAxisOptions = ref<Options>({
  title: {
    text: '销售额与利润率'
  },
  xAxis: {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: [{
    title: {
      text: '销售额 (万元)'
    }
  }, {
    title: {
      text: '利润率 (%)'
    },
    opposite: true
  }],
  series: [{
    name: '销售额',
    type: 'column',
    yAxis: 0,
    data: [120, 150, 180, 200, 230, 250]
  }, {
    name: '利润率',
    type: 'line',
    yAxis: 1,
    data: [15, 18, 20, 22, 25, 28]
  }]
})
</script>
```

### 自定义主题

```vue
<template>
  <HighChart :options="themedOptions" />
</template>

<script setup lang="ts">
import { baseChartConfig } from '@/config/charts'

const themedOptions = ref<Options>({
  ...baseChartConfig,
  chart: {
    backgroundColor: '#2a2a2a',
    style: {
      fontFamily: 'Arial, sans-serif'
    }
  },
  title: {
    text: '深色主题图表',
    style: {
      color: '#ffffff'
    }
  },
  xAxis: {
    categories: ['A', 'B', 'C', 'D'],
    labels: {
      style: {
        color: '#ffffff'
      }
    }
  },
  yAxis: {
    title: {
      text: '数值',
      style: {
        color: '#ffffff'
      }
    },
    labels: {
      style: {
        color: '#ffffff'
      }
    }
  },
  series: [{
    name: '数据',
    data: [10, 20, 30, 40],
    color: '#7cb5ec'
  }]
})
</script>
```

## API 参考

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| options | `Options` | - | 图表配置选项，支持所有 Highcharts 配置 |
| width | `string` | `'100%'` | 图表宽度，支持 px、%、vw 等单位 |
| height | `string` | `'400px'` | 图表高度，支持 px、%、vh 等单位 |
| autoResize | `boolean` | `true` | 是否自动调整大小，响应容器尺寸变化 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| created | `(chart: Highcharts.Chart)` | 图表创建完成时触发 |
| updated | `(chart: Highcharts.Chart)` | 图表更新完成时触发 |

### 方法

通过 ref 可以访问组件实例的方法：

```typescript
interface HighChartInstance {
  /** 获取图表实例 */
  getChart(): Highcharts.Chart | null
  /** 重新渲染图表 */
  reflow(): void
  /** 销毁图表 */
  destroy(): void
}
```

## 配置示例

### 基础配置文件

```typescript
// config/charts/index.ts
import type { Options } from 'highcharts'

export const baseChartConfig: Partial<Options> = {
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }
  },
  title: {
    style: {
      fontSize: '16px',
      fontWeight: '600'
    }
  },
  credits: {
    enabled: false
  },
  legend: {
    itemStyle: {
      fontSize: '12px'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    style: {
      color: '#ffffff'
    }
  }
}
```

## 性能优化

### 大数据量处理

```vue
<template>
  <HighChart
    :options="bigDataOptions"
    :auto-resize="false"
    @created="onBigDataChartCreated"
  />
</template>

<script setup lang="ts">
const bigDataOptions = ref<Options>({
  chart: {
    type: 'line',
    zoomType: 'x'
  },
  title: {
    text: '大数据量图表'
  },
  plotOptions: {
    line: {
      marker: {
        enabled: false
      },
      states: {
        hover: {
          lineWidth: 0
        }
      },
      enableMouseTracking: false
    }
  },
  boost: {
    useGPUTranslations: true,
    usePreAllocated: true
  },
  series: [{
    name: '数据',
    data: generateBigData(10000) // 生成10000个数据点
  }]
})

function generateBigData(count: number) {
  const data = []
  for (let i = 0; i < count; i++) {
    data.push([i, Math.random() * 100])
  }
  return data
}
</script>
```

### 内存管理

```vue
<script setup lang="ts">
import { onUnmounted } from 'vue'

let chartInstance: Highcharts.Chart | null = null

const onChartCreated = (chart: Highcharts.Chart) => {
  chartInstance = chart
}

// 组件销毁时清理图表实例
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
```

## 常见问题

### Q: 图表不显示或显示异常？

A: 检查以下几点：
1. 确保容器有明确的宽高
2. 检查数据格式是否正确
3. 确保 Highcharts 依赖已正确安装

### Q: 如何实现图表的响应式？

A: 组件默认开启 `autoResize`，会自动监听容器尺寸变化。如需手动控制，可以：

```typescript
const chartRef = ref()

// 手动触发重新计算尺寸
const handleResize = () => {
  chartRef.value?.reflow()
}
```

### Q: 如何自定义图表主题？

A: 可以通过配置文件或直接在 options 中设置：

```typescript
// 全局主题配置
import Highcharts from 'highcharts'

Highcharts.setOptions({
  colors: ['#7cb5ec', '#434348', '#90ed7d'],
  chart: {
    backgroundColor: '#f8f9fa'
  }
})
```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基础图表类型
- 自动调整大小功能
- TypeScript 类型支持

### v1.1.0
- 添加事件回调支持
- 优化内存管理
- 增加性能优化选项

### v1.2.0
- 支持大数据量渲染
- 添加更多配置选项
- 改进错误处理