<template>
  <div class="report-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">报表管理</h2>
        <p class="page-description">创建、管理和分享各类业务报表</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button type="primary" @click="showCreateModal">
            <PlusOutlined />
            新建报表
          </a-button>
          <a-button @click="refreshReports">
            <ReloadOutlined />
            刷新
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 报表统计概览 -->
    <div class="overview-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="总报表数"
              :value="overview.totalReports"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <FileTextOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="今日生成"
              :value="overview.todayGenerated"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <CalendarOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="定时任务"
              :value="overview.scheduledTasks"
              :value-style="{ color: '#fa8c16' }"
            >
              <template #prefix>
                <ClockCircleOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="共享报表"
              :value="overview.sharedReports"
              :value-style="{ color: '#722ed1' }"
            >
              <template #prefix>
                <ShareAltOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <a-card title="快捷操作">
        <a-row :gutter="16">
          <a-col :span="6">
            <div class="action-item" @click="createQuickReport('sales')">
              <div class="action-icon">
                <DollarOutlined style="color: #1890ff" />
              </div>
              <div class="action-content">
                <div class="action-title">销售报表</div>
                <div class="action-desc">快速生成销售数据报表</div>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="action-item" @click="createQuickReport('inventory')">
              <div class="action-icon">
                <InboxOutlined style="color: #52c41a" />
              </div>
              <div class="action-content">
                <div class="action-title">库存报表</div>
                <div class="action-desc">快速生成库存统计报表</div>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="action-item" @click="createQuickReport('user')">
              <div class="action-icon">
                <UserOutlined style="color: #fa8c16" />
              </div>
              <div class="action-content">
                <div class="action-title">用户报表</div>
                <div class="action-desc">快速生成用户分析报表</div>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="action-item" @click="createQuickReport('finance')">
              <div class="action-icon">
                <FundOutlined style="color: #722ed1" />
              </div>
              <div class="action-content">
                <div class="action-title">财务报表</div>
                <div class="action-desc">快速生成财务数据报表</div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <a-card>
        <a-form layout="inline" :model="searchForm">
          <a-form-item label="报表名称">
            <a-input
              v-model:value="searchForm.name"
              placeholder="请输入报表名称"
              allow-clear
              @change="handleSearch"
            />
          </a-form-item>
          <a-form-item label="报表类型">
            <a-select
              v-model:value="searchForm.type"
              placeholder="请选择报表类型"
              style="width: 150px"
              allow-clear
              @change="handleSearch"
            >
              <a-select-option value="sales">销售报表</a-select-option>
              <a-select-option value="inventory">库存报表</a-select-option>
              <a-select-option value="user">用户报表</a-select-option>
              <a-select-option value="finance">财务报表</a-select-option>
              <a-select-option value="custom">自定义报表</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              v-model:value="searchForm.status"
              placeholder="请选择状态"
              style="width: 120px"
              allow-clear
              @change="handleSearch"
            >
              <a-select-option value="draft">草稿</a-select-option>
              <a-select-option value="published">已发布</a-select-option>
              <a-select-option value="scheduled">定时任务</a-select-option>
              <a-select-option value="archived">已归档</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="创建时间">
            <a-range-picker
              v-model:value="searchForm.dateRange"
              @change="handleSearch"
            />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSearch">
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

    <!-- 报表列表 -->
    <div class="table-section">
      <a-card>
        <template #title>
          <span>报表列表</span>
          <a-tag color="blue" style="margin-left: 8px">
            共 {{ pagination.total }} 条
          </a-tag>
        </template>
        
        <template #extra>
          <a-space>
            <a-radio-group v-model:value="viewMode" size="small">
              <a-radio-button value="table">
                <UnorderedListOutlined />
                列表
              </a-radio-button>
              <a-radio-button value="card">
                <AppstoreOutlined />
                卡片
              </a-radio-button>
            </a-radio-group>
            <a-button @click="exportReports">
              <ExportOutlined />
              批量导出
            </a-button>
          </a-space>
        </template>
        
        <!-- 表格视图 -->
        <a-table
          v-if="viewMode === 'table'"
          :columns="columns"
          :data-source="reportList"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <div class="report-name">
                <a @click="viewReport(record)">{{ record.name }}</a>
                <a-tag v-if="record.isShared" color="green" size="small" style="margin-left: 8px">
                  共享
                </a-tag>
              </div>
            </template>
            
            <template v-else-if="column.key === 'type'">
              <a-tag :color="getTypeColor(record.type)">
                {{ getTypeName(record.type) }}
              </a-tag>
            </template>
            
            <template v-else-if="column.key === 'status'">
              <a-badge :status="getStatusBadge(record.status)" :text="getStatusText(record.status)" />
            </template>
            
            <template v-else-if="column.key === 'schedule'">
              <span v-if="record.schedule">
                {{ record.schedule }}
              </span>
              <span v-else class="text-muted">-</span>
            </template>
            
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small" @click="viewReport(record)">
                  查看
                </a-button>
                <a-button type="link" size="small" @click="editReport(record)">
                  编辑
                </a-button>
                <a-button type="link" size="small" @click="generateReport(record)">
                  生成
                </a-button>
                <a-dropdown>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="duplicateReport(record)">
                        <CopyOutlined />
                        复制
                      </a-menu-item>
                      <a-menu-item @click="shareReport(record)">
                        <ShareAltOutlined />
                        共享
                      </a-menu-item>
                      <a-menu-item @click="scheduleReport(record)">
                        <ClockCircleOutlined />
                        定时任务
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item @click="archiveReport(record)" style="color: #faad14">
                        <InboxOutlined />
                        归档
                      </a-menu-item>
                      <a-menu-item @click="deleteReport(record)" style="color: #ff4d4f">
                        <DeleteOutlined />
                        删除
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a-button type="link" size="small">
                    更多
                    <DownOutlined />
                  </a-button>
                </a-dropdown>
              </a-space>
            </template>
          </template>
        </a-table>
        
        <!-- 卡片视图 -->
        <div v-else class="card-view">
          <a-row :gutter="[16, 16]">
            <a-col :span="6" v-for="report in reportList" :key="report.id">
              <a-card class="report-card" hoverable>
                <template #title>
                  <div class="card-title">
                    <span>{{ report.name }}</span>
                    <a-tag :color="getTypeColor(report.type)" size="small">
                      {{ getTypeName(report.type) }}
                    </a-tag>
                  </div>
                </template>
                
                <template #extra>
                  <a-dropdown>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item @click="viewReport(report)">
                          <EyeOutlined />
                          查看
                        </a-menu-item>
                        <a-menu-item @click="editReport(report)">
                          <EditOutlined />
                          编辑
                        </a-menu-item>
                        <a-menu-item @click="generateReport(report)">
                          <PlayCircleOutlined />
                          生成
                        </a-menu-item>
                      </a-menu>
                    </template>
                    <MoreOutlined />
                  </a-dropdown>
                </template>
                
                <div class="card-content">
                  <p class="report-desc">{{ report.description || '暂无描述' }}</p>
                  
                  <div class="report-meta">
                    <div class="meta-item">
                      <span class="meta-label">状态:</span>
                      <a-badge :status="getStatusBadge(report.status)" :text="getStatusText(report.status)" />
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">创建者:</span>
                      <span>{{ report.creator }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">更新时间:</span>
                      <span>{{ report.updateTime }}</span>
                    </div>
                    <div class="meta-item" v-if="report.schedule">
                      <span class="meta-label">定时:</span>
                      <span>{{ report.schedule }}</span>
                    </div>
                  </div>
                  
                  <div class="card-actions">
                    <a-button type="primary" size="small" @click="generateReport(report)">
                      <PlayCircleOutlined />
                      生成报表
                    </a-button>
                    <a-button size="small" @click="viewReport(report)">
                      查看详情
                    </a-button>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
          
          <!-- 卡片视图分页 -->
          <div class="card-pagination">
            <a-pagination
              v-model:current="pagination.current"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              :show-size-changer="pagination.showSizeChanger"
              :show-quick-jumper="pagination.showQuickJumper"
              :show-total="pagination.showTotal"
              @change="handleTableChange"
            />
          </div>
        </div>
      </a-card>
    </div>

    <!-- 新建/编辑报表弹窗 -->
    <a-modal
      v-model:open="createModalVisible"
      :title="editingReport ? '编辑报表' : '新建报表'"
      width="800px"
      @ok="handleCreateSubmit"
      @cancel="handleCreateCancel"
     ok-text="确定" cancel-text="取消">
      <a-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="报表名称" name="name">
              <a-input v-model:value="createForm.name" placeholder="请输入报表名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="报表类型" name="type">
              <a-select v-model:value="createForm.type" placeholder="请选择报表类型">
                <a-select-option value="sales">销售报表</a-select-option>
                <a-select-option value="inventory">库存报表</a-select-option>
                <a-select-option value="user">用户报表</a-select-option>
                <a-select-option value="finance">财务报表</a-select-option>
                <a-select-option value="custom">自定义报表</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="报表描述" name="description">
          <a-textarea
            v-model:value="createForm.description"
            placeholder="请输入报表描述"
            :rows="3"
          />
        </a-form-item>
        
        <a-form-item label="数据源配置" name="dataSource">
          <a-select v-model:value="createForm.dataSource" placeholder="请选择数据源">
            <a-select-option value="mysql">MySQL数据库</a-select-option>
            <a-select-option value="api">API接口</a-select-option>
            <a-select-option value="file">文件导入</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="报表模板">
          <a-radio-group v-model:value="createForm.template">
            <a-radio value="table">表格模板</a-radio>
            <a-radio value="chart">图表模板</a-radio>
            <a-radio value="mixed">混合模板</a-radio>
            <a-radio value="custom">自定义模板</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item label="输出格式">
          <a-checkbox-group v-model:value="createForm.outputFormats">
            <a-checkbox value="pdf">PDF</a-checkbox>
            <a-checkbox value="excel">Excel</a-checkbox>
            <a-checkbox value="word">Word</a-checkbox>
            <a-checkbox value="html">HTML</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        
        <a-form-item label="高级设置">
          <a-space direction="vertical" style="width: 100%">
            <a-checkbox v-model:checked="createForm.isShared">
              允许共享给其他用户
            </a-checkbox>
            <a-checkbox v-model:checked="createForm.enableSchedule">
              启用定时生成
            </a-checkbox>
            <a-checkbox v-model:checked="createForm.enableCache">
              启用数据缓存
            </a-checkbox>
          </a-space>
        </a-form-item>
        
        <a-form-item v-if="createForm.enableSchedule" label="定时设置">
          <a-input v-model:value="createForm.schedule" placeholder="如: 每天 09:00" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 报表详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="报表详情"
      width="1000px"
      :footer="null"
     ok-text="确定" cancel-text="取消">
      <div v-if="currentReport" class="report-detail">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="报表名称">
            {{ currentReport.name }}
          </a-descriptions-item>
          <a-descriptions-item label="报表类型">
            <a-tag :color="getTypeColor(currentReport.type)">
              {{ getTypeName(currentReport.type) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-badge :status="getStatusBadge(currentReport.status)" :text="getStatusText(currentReport.status)" />
          </a-descriptions-item>
          <a-descriptions-item label="创建者">
            {{ currentReport.creator }}
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            {{ currentReport.createTime }}
          </a-descriptions-item>
          <a-descriptions-item label="更新时间">
            {{ currentReport.updateTime }}
          </a-descriptions-item>
          <a-descriptions-item label="生成次数">
            {{ currentReport.generateCount || 0 }} 次
          </a-descriptions-item>
          <a-descriptions-item label="最后生成">
            {{ currentReport.lastGenerate || '未生成' }}
          </a-descriptions-item>
          <a-descriptions-item label="描述" :span="2">
            {{ currentReport.description || '暂无描述' }}
          </a-descriptions-item>
        </a-descriptions>
        
        <div class="detail-actions">
          <a-space>
            <a-button type="primary" @click="generateReport(currentReport)">
              <PlayCircleOutlined />
              生成报表
            </a-button>
            <a-button @click="editReport(currentReport)">
              <EditOutlined />
              编辑
            </a-button>
            <a-button @click="duplicateReport(currentReport)">
              <CopyOutlined />
              复制
            </a-button>
            <a-button @click="shareReport(currentReport)">
              <ShareAltOutlined />
              共享
            </a-button>
          </a-space>
        </div>
      </div>
    </a-modal>

    <!-- 共享设置弹窗 -->
    <a-modal
      v-model:open="shareModalVisible"
      title="共享设置"
      @ok="handleShareSubmit"
      @cancel="handleShareCancel"
     ok-text="保存" cancel-text="取消">
      <a-form :model="shareForm" layout="vertical">
        <a-form-item label="共享范围">
          <a-radio-group v-model:value="shareForm.scope">
            <a-radio value="public">公开</a-radio>
            <a-radio value="internal">内部</a-radio>
            <a-radio value="private">指定用户</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item v-if="shareForm.scope === 'private'" label="指定用户">
          <a-select
            v-model:value="shareForm.users"
            mode="multiple"
            placeholder="请选择用户"
            style="width: 100%"
          >
            <a-select-option value="user1">张三</a-select-option>
            <a-select-option value="user2">李四</a-select-option>
            <a-select-option value="user3">王五</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="权限设置">
          <a-checkbox-group v-model:value="shareForm.permissions">
            <a-checkbox value="view">查看</a-checkbox>
            <a-checkbox value="download">下载</a-checkbox>
            <a-checkbox value="edit">编辑</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        
        <a-form-item label="有效期">
          <a-date-picker v-model:value="shareForm.expireDate" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  ReloadOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ShareAltOutlined,
  DollarOutlined,
  InboxOutlined,
  UserOutlined,
  FundOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  ExportOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  EyeOutlined,
  EditOutlined,
  PlayCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, TableProps, FormInstance } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import dayjs, { type Dayjs } from 'dayjs'

/**
 * 报表管理页面
 */

interface ReportOverview {
  totalReports: number
  todayGenerated: number
  scheduledTasks: number
  sharedReports: number
}

interface Report {
  id: string
  name: string
  type: string
  status: string
  description?: string
  creator: string
  createTime: string
  updateTime: string
  schedule?: string
  isShared: boolean
  generateCount?: number
  lastGenerate?: string
}

interface SearchForm {
  name: string
  type: string
  status: string
  dateRange: [Dayjs, Dayjs] | null
}

interface CreateForm {
  name: string
  type: string
  description: string
  dataSource: string
  template: string
  outputFormats: string[]
  isShared: boolean
  enableSchedule: boolean
  enableCache: boolean
  schedule: string
}

interface ShareForm {
  scope: string
  users: string[]
  permissions: string[]
  expireDate: Dayjs | null
}

// 响应式数据
const loading = ref(false)
const viewMode = ref('table')
const createModalVisible = ref(false)
const detailModalVisible = ref(false)
const shareModalVisible = ref(false)
const editingReport = ref<Report | null>(null)
const currentReport = ref<Report | null>(null)
const createFormRef = ref<FormInstance>()

// 概览数据
const overview = ref<ReportOverview>({
  totalReports: 0,
  todayGenerated: 0,
  scheduledTasks: 0,
  sharedReports: 0,
})

// 搜索表单
const searchForm = reactive<SearchForm>({
  name: '',
  type: '',
  status: '',
  dateRange: null,
})

// 新建表单
const createForm = reactive<CreateForm>({
  name: '',
  type: '',
  description: '',
  dataSource: '',
  template: 'table',
  outputFormats: ['pdf'],
  isShared: false,
  enableSchedule: false,
  enableCache: true,
  schedule: '',
})

// 共享表单
const shareForm = reactive<ShareForm>({
  scope: 'internal',
  users: [],
  permissions: ['view'],
  expireDate: null,
})

// 表单验证规则
const createRules = {
  name: [{ required: true, message: '请输入报表名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择报表类型', trigger: 'change' }],
  dataSource: [{ required: true, message: '请选择数据源', trigger: 'change' }],
}

// 报表列表
const reportList = ref<Report[]>([])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '报表名称',
    key: 'name',
    width: 200,
    fixed: 'left',
  },
  {
    title: '类型',
    key: 'type',
    width: 120,
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
  },
  {
    title: '创建者',
    dataIndex: 'creator',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 160,
    sorter: true,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 160,
    sorter: true,
  },
  {
    title: '定时任务',
    key: 'schedule',
    width: 120,
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
  },
]

/**
 * 获取类型颜色
 */
const getTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    sales: 'blue',
    inventory: 'green',
    user: 'orange',
    finance: 'purple',
    custom: 'default',
  }
  return colorMap[type] || 'default'
}

/**
 * 获取类型名称
 */
const getTypeName = (type: string): string => {
  const nameMap: Record<string, string> = {
    sales: '销售报表',
    inventory: '库存报表',
    user: '用户报表',
    finance: '财务报表',
    custom: '自定义报表',
  }
  return nameMap[type] || type
}

/**
 * 获取状态徽章
 */
const getStatusBadge = (status: string): string => {
  const badgeMap: Record<string, string> = {
    draft: 'default',
    published: 'success',
    scheduled: 'processing',
    archived: 'warning',
  }
  return badgeMap[status] || 'default'
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    draft: '草稿',
    published: '已发布',
    scheduled: '定时任务',
    archived: '已归档',
  }
  return textMap[status] || status
}

/**
 * 加载概览数据
 */
const loadOverviewData = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    overview.value = {
      totalReports: 156,
      todayGenerated: 23,
      scheduledTasks: 12,
      sharedReports: 45,
    }
  } catch (error) {
    message.error('加载概览数据失败')
  }
}

/**
 * 加载报表列表
 */
const loadReportList = async (): Promise<void> => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    
    reportList.value = [
      {
        id: 'R001',
        name: '月度销售报表',
        type: 'sales',
        status: 'published',
        description: '每月销售数据统计分析报表',
        creator: '张三',
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-15 14:30:00',
        schedule: '每月1日 09:00',
        isShared: true,
        generateCount: 15,
        lastGenerate: '2024-01-15 09:00:00',
      },
      {
        id: 'R002',
        name: '库存预警报表',
        type: 'inventory',
        status: 'scheduled',
        description: '库存不足商品预警统计',
        creator: '李四',
        createTime: '2024-01-02 11:00:00',
        updateTime: '2024-01-10 16:20:00',
        schedule: '每天 08:00',
        isShared: false,
        generateCount: 30,
        lastGenerate: '2024-01-15 08:00:00',
      },
      {
        id: 'R003',
        name: '用户行为分析',
        type: 'user',
        status: 'draft',
        description: '用户购买行为和偏好分析',
        creator: '王五',
        createTime: '2024-01-03 09:30:00',
        updateTime: '2024-01-12 10:15:00',
        isShared: false,
        generateCount: 0,
      },
      {
        id: 'R004',
        name: '财务收支报表',
        type: 'finance',
        status: 'published',
        description: '月度财务收支明细报表',
        creator: '赵六',
        createTime: '2024-01-04 15:00:00',
        updateTime: '2024-01-14 11:45:00',
        isShared: true,
        generateCount: 8,
        lastGenerate: '2024-01-14 09:00:00',
      },
      {
        id: 'R005',
        name: '自定义数据报表',
        type: 'custom',
        status: 'archived',
        description: '根据特定需求定制的数据报表',
        creator: '孙七',
        createTime: '2024-01-05 13:20:00',
        updateTime: '2024-01-08 17:30:00',
        isShared: false,
        generateCount: 5,
        lastGenerate: '2024-01-08 10:00:00',
      },
    ]
    
    pagination.total = reportList.value.length
  } catch (error) {
    message.error('加载报表列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索处理
 */
const handleSearch = debounce((): void => {
  pagination.current = 1
  loadReportList()
}, 300)

/**
 * 重置搜索
 */
const resetSearch = (): void => {
  Object.assign(searchForm, {
    name: '',
    type: '',
    status: '',
    dateRange: null,
  })
  handleSearch()
}

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
  loadReportList()
}

/**
 * 显示新建弹窗
 */
const showCreateModal = (): void => {
  editingReport.value = null
  Object.assign(createForm, {
    name: '',
    type: '',
    description: '',
    dataSource: '',
    template: 'table',
    outputFormats: ['pdf'],
    isShared: false,
    enableSchedule: false,
    enableCache: true,
    schedule: '',
  })
  createModalVisible.value = true
}

/**
 * 新建提交处理
 */
const handleCreateSubmit = async (): Promise<void> => {
  try {
    await createFormRef.value?.validate()
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success(editingReport.value ? '报表更新成功' : '报表创建成功')
    createModalVisible.value = false
    loadReportList()
    loadOverviewData()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

/**
 * 新建取消处理
 */
const handleCreateCancel = (): void => {
  createModalVisible.value = false
  editingReport.value = null
}

/**
 * 快速创建报表
 */
const createQuickReport = (type: string): void => {
  const typeNames: Record<string, string> = {
    sales: '销售报表',
    inventory: '库存报表',
    user: '用户报表',
    finance: '财务报表',
  }
  
  Object.assign(createForm, {
    name: `${typeNames[type]}_${dayjs().format('YYYYMMDD')}`,
    type,
    description: `快速生成的${typeNames[type]}`,
    dataSource: 'mysql',
    template: type === 'user' ? 'chart' : 'table',
    outputFormats: ['pdf', 'excel'],
    isShared: false,
    enableSchedule: false,
    enableCache: true,
    schedule: '',
  })
  
  createModalVisible.value = true
}

/**
 * 查看报表
 */
const viewReport = (report: Report): void => {
  currentReport.value = report
  detailModalVisible.value = true
}

/**
 * 编辑报表
 */
const editReport = (report: Report): void => {
  editingReport.value = report
  Object.assign(createForm, {
    name: report.name,
    type: report.type,
    description: report.description || '',
    dataSource: 'mysql',
    template: 'table',
    outputFormats: ['pdf'],
    isShared: report.isShared,
    enableSchedule: !!report.schedule,
    enableCache: true,
    schedule: report.schedule || '',
  })
  createModalVisible.value = true
}

/**
 * 生成报表
 */
const generateReport = async (report: Report): Promise<void> => {
  try {
    message.loading('正在生成报表...', 0)
    
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    message.destroy()
    message.success('报表生成成功')
    loadReportList()
  } catch (error) {
    message.destroy()
    message.error('报表生成失败')
  }
}

/**
 * 复制报表
 */
const duplicateReport = async (report: Report): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('报表复制成功')
    loadReportList()
    loadOverviewData()
  } catch (error) {
    message.error('报表复制失败')
  }
}

/**
 * 共享报表
 */
const shareReport = (report: Report): void => {
  currentReport.value = report
  Object.assign(shareForm, {
    scope: report.isShared ? 'internal' : 'private',
    users: [],
    permissions: ['view'],
    expireDate: null,
  })
  shareModalVisible.value = true
}

/**
 * 共享提交处理
 */
const handleShareSubmit = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('共享设置成功')
    shareModalVisible.value = false
    loadReportList()
  } catch (error) {
    message.error('共享设置失败')
  }
}

/**
 * 共享取消处理
 */
const handleShareCancel = (): void => {
  shareModalVisible.value = false
  currentReport.value = null
}

/**
 * 定时任务设置
 */
const scheduleReport = (report: Report): void => {
  message.info('定时任务设置功能开发中')
}

/**
 * 归档报表
 */
const archiveReport = async (report: Report): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('报表归档成功')
    loadReportList()
    loadOverviewData()
  } catch (error) {
    message.error('报表归档失败')
  }
}

/**
 * 删除报表
 */
const deleteReport = async (report: Report): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('报表删除成功')
    loadReportList()
    loadOverviewData()
  } catch (error) {
    message.error('报表删除失败')
  }
}

/**
 * 导出报表
 */
const exportReports = (): void => {
  message.success('报表导出成功')
}

/**
 * 刷新报表
 */
const refreshReports = (): void => {
  loadReportList()
  loadOverviewData()
}

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  loadOverviewData()
  loadReportList()
})
</script>

<style scoped lang="less">
.report-view {
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

.overview-section {
  margin-bottom: 24px;
  
  .stat-card {
    text-align: center;
    
    :deep(.ant-statistic-title) {
      font-size: 14px;
      color: #8c8c8c;
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

.quick-actions {
  margin-bottom: 24px;
  
  .action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      border-color: #1890ff;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
    }
    
    .action-icon {
      font-size: 24px;
    }
    
    .action-content {
      flex: 1;
      
      .action-title {
        font-size: 14px;
        font-weight: 600;
        color: #262626;
        margin-bottom: 4px;
      }
      
      .action-desc {
        font-size: 12px;
        color: #8c8c8c;
      }
    }
  }
}

.search-section {
  margin-bottom: 24px;
}

.table-section {
  margin-bottom: 24px;
  
  .report-name {
    display: flex;
    align-items: center;
  }
  
  .text-muted {
    color: #8c8c8c;
  }
}

.card-view {
  .report-card {
    .card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      span {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 8px;
      }
    }
    
    .card-content {
      .report-desc {
        color: #8c8c8c;
        font-size: 12px;
        margin-bottom: 16px;
        min-height: 36px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .report-meta {
        margin-bottom: 16px;
        
        .meta-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 12px;
          
          .meta-label {
            color: #8c8c8c;
            margin-right: 8px;
            min-width: 60px;
          }
        }
      }
      
      .card-actions {
        display: flex;
        gap: 8px;
        
        .ant-btn {
          flex: 1;
        }
      }
    }
  }
  
  .card-pagination {
    margin-top: 24px;
    text-align: center;
  }
}

.report-detail {
  .detail-actions {
    margin-top: 24px;
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .report-view {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .overview-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
  
  .quick-actions {
    .ant-col {
      margin-bottom: 16px;
    }
  }
  
  .search-section {
    :deep(.ant-form-item) {
      margin-bottom: 16px;
    }
  }
  
  .card-view {
    .ant-col {
      span: 12;
    }
  }
}

@media (max-width: 576px) {
  .card-view {
    .ant-col {
      span: 24;
    }
  }
}
</style>