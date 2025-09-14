import 'normalize.css'
import './styles/global.css'
import 'virtual:uno.css'
import 'ant-design-vue/dist/reset.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import Highcharts from 'highcharts'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

import App from './App.vue'
import router from './router'

// 配置 dayjs 中文本地化
dayjs.locale('zh-cn')

// 配置 Highcharts 全局设置
Highcharts.setOptions({
  lang: {
    months: [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月',
    ],
    weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    shortMonths: [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ],
    loading: '加载中...',
    noData: '暂无数据',
    resetZoom: '重置缩放',
    resetZoomTitle: '重置缩放比例 1:1',
    thousandsSep: ',',
    decimalPoint: '.',
  },
  time: {
    timezone: 'Asia/Shanghai',
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
