/**
 * 图表配置文件
 * 统一管理 Highcharts 图表配置
 */

import type { Options } from 'highcharts'

/**
 * 基础图表配置
 */
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
  legend: {
    itemStyle: {
      fontSize: '12px'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    style: {
      color: '#fff'
    }
  },
  credits: {
    enabled: false
  }
}

/**
 * 折线图配置
 */
export const lineChartConfig: Partial<Options> = {
  ...baseChartConfig,
  chart: {
    ...baseChartConfig.chart,
    type: 'line'
  },
  xAxis: {
    categories: [],
    title: {
      text: undefined
    }
  },
  yAxis: {
    title: {
      text: undefined
    },
    labels: {
      formatter: function() {
        return this.value.toString()
      }
    }
  },
  plotOptions: {
    line: {
      dataLabels: {
        enabled: false
      },
      enableMouseTracking: true
    }
  }
}

/**
 * 柱状图配置
 */
export const columnChartConfig: Partial<Options> = {
  ...baseChartConfig,
  chart: {
    ...baseChartConfig.chart,
    type: 'column'
  },
  xAxis: {
    categories: [],
    crosshair: true
  },
  yAxis: {
    min: 0,
    title: {
      text: undefined
    }
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0
    }
  }
}

/**
 * 饼图配置
 */
export const pieChartConfig: Partial<Options> = {
  ...baseChartConfig,
  chart: {
    ...baseChartConfig.chart,
    type: 'pie'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
      },
      showInLegend: true
    }
  }
}