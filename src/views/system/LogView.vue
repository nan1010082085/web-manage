<template>
  <div class="log-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">系统日志</h2>
        <p class="page-description">查看系统运行日志，监控系统状态和异常</p>
      </div>
      <div class="header-actions">
        <a-range-picker
          v-model:value="dateRange"
          show-time
          :presets="datePresets"
          @change="handleDateChange"
        />
        <a-button @click="exportLogs">
          <DownloadOutlined />
          导出日志
        </a-button>
        <a-button @click="clearLogs" danger>
          <DeleteOutlined />
          清理日志
        </a-button>
        <a-button @click="refreshData">
          <ReloadOutlined />
          刷新
        </a-button>
      </div>
    </div>

    <!-- 日志统计概览 -->
    <div class="overview-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="总日志数"
              :value="overview.totalLogs"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <FileTextOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="错误日志"
              :value="overview.errorLogs"
              :value-style="{ color: '#ff4d4f' }"
            >
              <template #prefix>
                <ExclamationCircleOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="警告日志"
              :value="overview.warningLogs"
              :value-style="{ color: '#fa8c16' }"
            >
              <template #prefix>
                <WarningOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="今日新增"
              :value="overview.todayLogs"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <PlusOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 日志级别分布图表 -->
    <div class="charts-section">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card title="日志级别分布" class="chart-card">
            <HighChart :options="logChartConfigs.levelChart" :height="'300px'" />
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="日志趋势分析" class="chart-card">
            <template #extra>
              <a-radio-group v-model:value="trendPeriod" @change="handleTrendPeriodChange">
                <a-radio-button value="hour">小时</a-radio-button>
                <a-radio-button value="day">天</a-radio-button>
                <a-radio-button value="week">周</a-radio-button>
              </a-radio-group>
            </template>
            <HighChart :options="logChartConfigs.trendChart" :height="'300px'" />
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 日志搜索和筛选 -->
    <div class="search-section">
      <a-card title="日志查询">
        <a-form layout="inline" :model="searchForm" @finish="handleSearch">
          <a-form-item label="关键词">
            <a-input
              v-model:value="searchForm.keyword"
              placeholder="搜索日志内容"
              allow-clear
              style="width: 200px"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>
          
          <a-form-item label="日志级别">
            <a-select
              v-model:value="searchForm.level"
              placeholder="选择级别"
              allow-clear
              style="width: 120px"
            >
              <a-select-option value="DEBUG">DEBUG</a-select-option>
              <a-select-option value="INFO">INFO</a-select-option>
              <a-select-option value="WARN">WARN</a-select-option>
              <a-select-option value="ERROR">ERROR</a-select-option>
              <a-select-option value="FATAL">FATAL</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="模块">
            <a-select
              v-model:value="searchForm.module"
              placeholder="选择模块"
              allow-clear
              style="width: 150px"
            >
              <a-select-option value="auth">用户认证</a-select-option>
              <a-select-option value="order">订单管理</a-select-option>
              <a-select-option value="product">商品管理</a-select-option>
              <a-select-option value="payment">支付系统</a-select-option>
              <a-select-option value="system">系统管理</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="用户ID">
            <a-input
              v-model:value="searchForm.userId"
              placeholder="用户ID"
              allow-clear
              style="width: 120px"
            />
          </a-form-item>
          
          <a-form-item label="IP地址">
            <a-input
              v-model:value="searchForm.ip"
              placeholder="IP地址"
              allow-clear
              style="width: 140px"
            />
          </a-form-item>
          
          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit">
                <SearchOutlined />
                搜索
              </a-button>
              <a-button @click="resetSearch">
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>
    </div>

    <!-- 日志列表 -->
    <div class="table-section">
      <a-card title="日志列表">
        <template #extra>
          <a-space>
            <a-switch
              v-model:checked="autoRefresh"
              checked-children="自动刷新"
              un-checked-children="手动刷新"
              @change="handleAutoRefreshChange"
            />
            <a-select
              v-model:value="pageSize"
              @change="handlePageSizeChange"
              style="width: 100px"
            >
              <a-select-option :value="20">20条/页</a-select-option>
              <a-select-option :value="50">50条/页</a-select-option>
              <a-select-option :value="100">100条/页</a-select-option>
            </a-select>
          </a-space>
        </template>
        
        <a-table
          :columns="tableColumns"
          :data-source="logData"
          :loading="tableLoading"
          :pagination="pagination"
          :scroll="{ x: 1600 }"
          @change="handleTableChange"
          row-key="id"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'level'">
              <a-tag :color="getLevelColor(record.level)" class="level-tag">
                {{ record.level }}
              </a-tag>
            </template>
            
            <template v-else-if="column.key === 'message'">
              <div class="log-message">
                <div class="message-content" :title="record.message">
                  {{ record.message }}
                </div>
                <a-button
                  v-if="record.stackTrace"
                  type="link"
                  size="small"
                  @click="viewStackTrace(record)"
                >
                  查看堆栈
                </a-button>
              </div>
            </template>
            
            <template v-else-if="column.key === 'module'">
              <a-tag color="blue">{{ getModuleName(record.module) }}</a-tag>
            </template>
            
            <template v-else-if="column.key === 'user'">
              <div class="user-info" v-if="record.userId">
                <a-avatar size="small" style="margin-right: 8px">
                  <template #icon>
                    <UserOutlined />
                  </template>
                </a-avatar>
                <span>{{ record.userName || record.userId }}</span>
              </div>
              <span v-else class="no-user">系统</span>
            </template>
            
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small" @click="viewDetail(record)">
                  详情
                </a-button>
                <a-button
                  type="link"
                  size="small"
                  @click="copyLog(record)"
                >
                  复制
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>

    <!-- 日志详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="日志详情"
      :footer="null"
      width="800px"
      :body-style="{ maxHeight: '600px', overflow: 'auto' }"
     ok-text="确定" cancel-text="取消">
      <div class="log-detail" v-if="selectedLog">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="日志ID">{{ selectedLog.id }}</a-descriptions-item>
          <a-descriptions-item label="级别">
            <a-tag :color="getLevelColor(selectedLog.level)">{{ selectedLog.level }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="模块">{{ getModuleName(selectedLog.module) }}</a-descriptions-item>
          <a-descriptions-item label="时间">{{ selectedLog.timestamp }}</a-descriptions-item>
          <a-descriptions-item label="用户" v-if="selectedLog.userId">
            {{ selectedLog.userName || selectedLog.userId }}
          </a-descriptions-item>
          <a-descriptions-item label="IP地址" v-if="selectedLog.ip">{{ selectedLog.ip }}</a-descriptions-item>
          <a-descriptions-item label="用户代理" v-if="selectedLog.userAgent" :span="2">
            {{ selectedLog.userAgent }}
          </a-descriptions-item>
          <a-descriptions-item label="消息" :span="2">
            <pre class="log-message-detail">{{ selectedLog.message }}</pre>
          </a-descriptions-item>
          <a-descriptions-item label="请求路径" v-if="selectedLog.path" :span="2">
            {{ selectedLog.method }} {{ selectedLog.path }}
          </a-descriptions-item>
          <a-descriptions-item label="请求参数" v-if="selectedLog.params" :span="2">
            <pre class="log-params">{{ JSON.stringify(selectedLog.params, null, 2) }}</pre>
          </a-descriptions-item>
          <a-descriptions-item label="堆栈信息" v-if="selectedLog.stackTrace" :span="2">
            <pre class="log-stack-trace">{{ selectedLog.stackTrace }}</pre>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>

    <!-- 堆栈信息弹窗 -->
    <a-modal
      v-model:open="stackTraceModalVisible"
      title="堆栈信息"
      :footer="null"
      width="900px"
      :body-style="{ maxHeight: '600px', overflow: 'auto' }"
     ok-text="确定" cancel-text="取消">
      <pre class="stack-trace-content" v-if="selectedStackTrace">{{ selectedStackTrace }}</pre>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import {
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  FilterOutlined,
} from '@ant-design/icons-vue'
import HighChart from '@/components/common/HighChart.vue'
import { logChartConfigs } from '@/config/charts/chartConfigs'
import type { TableColumnsType, TableProps } from 'ant-design-vue'
import { pickBy, isEmpty, isNil, truncate, trim, isString } from 'lodash-es'

// 过滤空值
const filterEmpty = <T extends Record<string, any>>(
  obj: T
): Record<string, any> => {
  return pickBy(obj, (value) => !isEmpty(value) && !isNil(value))
}

// 格式化文本
const formatText = (
  text: string,
  maxLength = 50,
  suffix = '...'
): string => {
  if (!isString(text)) return ''
  return truncate(trim(text), { length: maxLength, omission: suffix })
}
import dayjs, { type Dayjs } from 'dayjs'

/**
 * 系统日志页面
 */

interface LogOverview {
  totalLogs: number
  errorLogs: number
  warningLogs: number
  todayLogs: number
}

interface LogItem {
  id: string
  level: string
  module: string
  message: string
  timestamp: string
  userId?: string
  userName?: string
  ip?: string
  userAgent?: string
  path?: string
  method?: string
  params?: any
  stackTrace?: string
}

interface SearchForm {
  keyword: string
  level?: string
  module?: string
  userId?: string
  ip?: string
}

// 响应式数据
const tableLoading = ref(false)
const detailModalVisible = ref(false)
const stackTraceModalVisible = ref(false)
const autoRefresh = ref(false)
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(1, 'day'), dayjs()])
const trendPeriod = ref('hour')
const pageSize = ref(20)
const logData = ref<LogItem[]>([])
const selectedLog = ref<LogItem | null>(null)
const selectedStackTrace = ref<string>('')
const refreshTimer = ref<NodeJS.Timeout | null>(null)

// 图表引用已移除，使用 HighChart 组件

// 搜索表单
const searchForm = reactive<SearchForm>({
  keyword: '',
  level: undefined,
  module: undefined,
  userId: '',
  ip: '',
})

// 日志概览数据
const overview = ref<LogOverview>({
  totalLogs: 0,
  errorLogs: 0,
  warningLogs: 0,
  todayLogs: 0,
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 日期预设
const datePresets = [
  { label: '最近1小时', value: [dayjs().subtract(1, 'hour'), dayjs()] },
  { label: '最近6小时', value: [dayjs().subtract(6, 'hour'), dayjs()] },
  { label: '最近24小时', value: [dayjs().subtract(1, 'day'), dayjs()] },
  { label: '最近3天', value: [dayjs().subtract(3, 'day'), dayjs()] },
  { label: '最近7天', value: [dayjs().subtract(7, 'day'), dayjs()] },
  { label: '最近30天', value: [dayjs().subtract(30, 'day'), dayjs()] },
]

// 表格列配置
const tableColumns: TableColumnsType = [
  {
    title: '时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 160,
    fixed: 'left',
    sorter: true,
  },
  {
    title: '级别',
    key: 'level',
    width: 80,
  },
  {
    title: '模块',
    key: 'module',
    width: 100,
  },
  {
    title: '消息',
    key: 'message',
    width: 400,
    ellipsis: true,
  },
  {
    title: '用户',
    key: 'user',
    width: 120,
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    width: 120,
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
  },
]

/**
 * 获取日志级别颜色
 */
const getLevelColor = (level: string): string => {
  const colorMap: Record<string, string> = {
    DEBUG: 'default',
    INFO: 'blue',
    WARN: 'orange',
    ERROR: 'red',
    FATAL: 'magenta',
  }
  return colorMap[level] || 'default'
}

/**
 * 获取模块名称
 */
const getModuleName = (module: string): string => {
  const moduleMap: Record<string, string> = {
    auth: '用户认证',
    order: '订单管理',
    product: '商品管理',
    payment: '支付系统',
    system: '系统管理',
  }
  return moduleMap[module] || module
}

/**
 * 加载日志数据
 */
const loadLogData = async (): Promise<void> => {
  tableLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟概览数据
    overview.value = {
      totalLogs: 15678,
      errorLogs: 234,
      warningLogs: 567,
      todayLogs: 1234,
    }
    
    // 模拟日志数据
    const mockData: LogItem[] = [
      {
        id: 'LOG001',
        level: 'ERROR',
        module: 'auth',
        message: '用户登录失败：密码错误',
        timestamp: '2024-01-15 14:30:25',
        userId: 'user123',
        userName: '张三',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        path: '/api/auth/login',
        method: 'POST',
        params: { username: 'zhangsan', password: '***' },
        stackTrace: 'AuthenticationException: Invalid password\n    at AuthService.login(AuthService.java:45)\n    at AuthController.login(AuthController.java:23)',
      },
      {
        id: 'LOG002',
        level: 'INFO',
        module: 'order',
        message: '订单创建成功',
        timestamp: '2024-01-15 14:28:15',
        userId: 'user456',
        userName: '李四',
        ip: '192.168.1.101',
        path: '/api/orders',
        method: 'POST',
        params: { productId: 'P001', quantity: 2, amount: 199.99 },
      },
      {
        id: 'LOG003',
        level: 'WARN',
        module: 'payment',
        message: '支付接口响应超时，正在重试',
        timestamp: '2024-01-15 14:25:30',
        userId: 'user789',
        userName: '王五',
        ip: '192.168.1.102',
        path: '/api/payment/process',
        method: 'POST',
      },
      {
        id: 'LOG004',
        level: 'DEBUG',
        module: 'system',
        message: '缓存清理完成',
        timestamp: '2024-01-15 14:20:00',
        ip: '127.0.0.1',
      },
      {
        id: 'LOG005',
        level: 'INFO',
        module: 'product',
        message: '商品库存更新',
        timestamp: '2024-01-15 14:15:45',
        userId: 'admin',
        userName: '管理员',
        ip: '192.168.1.1',
        path: '/api/products/P001/stock',
        method: 'PUT',
        params: { stock: 100 },
      },
    ]
    
    logData.value = mockData
    pagination.total = mockData.length
    
    // 图表已通过HighChart组件自动渲染
  } catch (__error) {
    message.error('加载日志数据失败')
  } finally {
    tableLoading.value = false
  }
}

/**
 * 渲染图表
 */
const renderCharts = (): void => {
  // 图表已通过 HighChart 组件渲染，无需手动处理
}

/**
 * 处理日期变化
 */
const handleDateChange = (dates: [Dayjs, Dayjs] | null): void => {
  if (dates) {
    dateRange.value = dates
    loadLogData()
  }
}

/**
 * 处理趋势周期变化
 */
const handleTrendPeriodChange = (): void => {
  // 图表会自动响应数据变化
}

/**
 * 搜索处理
 */
const handleSearch = (): void => {
  pagination.current = 1
  loadLogData()
}

/**
 * 重置搜索
 */
const resetSearch = (): void => {
  Object.assign(searchForm, {
    keyword: '',
    level: undefined,
    module: undefined,
    userId: '',
    ip: '',
  })
  handleSearch()
}

/**
 * 获取过滤后的搜索参数
 */
const getFilteredSearchParams = () => {
  return filterEmpty({
    ...searchForm,
    startDate: dateRange.value?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
    endDate: dateRange.value?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
  })
}

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 20
  loadLogData()
}

/**
 * 处理页面大小变化
 */
const handlePageSizeChange = (size: number): void => {
  pageSize.value = size
  pagination.pageSize = size
  pagination.current = 1
  loadLogData()
}

/**
 * 处理自动刷新变化
 */
const handleAutoRefreshChange = (checked: boolean): void => {
  if (checked) {
    refreshTimer.value = setInterval(() => {
      loadLogData()
    }, 30000) // 30秒刷新一次
  } else {
    if (refreshTimer.value) {
      clearInterval(refreshTimer.value)
      refreshTimer.value = null
    }
  }
}

/**
 * 查看详情
 */
const viewDetail = (record: LogItem): void => {
  selectedLog.value = record
  detailModalVisible.value = true
}

/**
 * 查看堆栈信息
 */
const viewStackTrace = (record: LogItem): void => {
  selectedStackTrace.value = record.stackTrace || ''
  stackTraceModalVisible.value = true
}

/**
 * 复制日志
 */
const copyLog = async (record: LogItem): Promise<void> => {
  try {
    const logText = `[${record.timestamp}] [${record.level}] [${record.module}] ${formatText(record.message, 200)}`
    await navigator.clipboard.writeText(logText)
    message.success('日志已复制到剪贴板')
  } catch (__error) {
    message.error('复制失败')
  }
}

/**
 * 刷新数据
 */
const refreshData = (): void => {
  loadLogData()
}

/**
 * 导出日志
 */
const exportLogs = (): void => {
  message.success('导出功能开发中')
}

/**
 * 清理日志
 */
const clearLogs = (): void => {
  message.success('清理功能开发中')
}

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  loadLogData()
})

/**
 * 组件卸载时清理定时器
 */
onUnmounted(() => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
  }
})
</script>

<style scoped lang="less">
.log-view {
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 64px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  .page-title {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #262626;
  }
  
  .page-description {
    margin: 0;
    color: #8c8c8c;
    font-size: 14px;
  }
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.overview-section {
  margin-bottom: 24px;
  
  .overview-card {
    text-align: center;
    
    :deep(.ant-statistic-title) {
      font-size: 14px;
      color: #8c8c8c;
      margin-bottom: 8px;
    }
    
    :deep(.ant-statistic-content) {
      display: flex;
      align-items: center;
      justify-content: center;
      
      .ant-statistic-content-value {
        font-size: 24px;
        font-weight: 600;
      }
    }
  }
}

.charts-section {
  margin-bottom: 24px;
  
  .chart-card {
    .chart-container {
      height: 300px;
    }
  }
}

.search-section {
  margin-bottom: 24px;
  
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
}

.table-section {
  .level-tag {
    font-weight: 600;
    border: none;
  }
  
  .log-message {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .message-content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .no-user {
    color: #8c8c8c;
    font-style: italic;
  }
}

.log-detail {
  .log-message-detail {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .log-params {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    font-size: 12px;
    max-height: 150px;
    overflow-y: auto;
  }
  
  .log-stack-trace {
    background: #fff2f0;
    border: 1px solid #ffccc7;
    padding: 12px;
    border-radius: 4px;
    font-size: 12px;
    color: #a8071a;
    max-height: 300px;
    overflow-y: auto;
  }
}

.stack-trace-content {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  padding: 16px;
  border-radius: 4px;
  font-size: 12px;
  color: #a8071a;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
}

// 响应式设计
@media (max-width: 768px) {
  .log-view {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  
  .overview-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
  
  .charts-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
  
  .search-section {
    :deep(.ant-form) {
      .ant-form-item {
        display: block;
        width: 100%;
        
        .ant-form-item-control {
          width: 100%;
          
          .ant-input,
          .ant-select {
            width: 100% !important;
          }
        }
      }
    }
  }
}
</style>