<template>
  <div class="customer-service-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">客服管理</h2>
        <p class="page-description">管理客服工单、在线咨询和客户反馈</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button @click="refreshData">
            <ReloadOutlined />
            刷新
          </a-button>
          <a-button type="primary" @click="showCreateModal">
            <PlusOutlined />
            新建工单
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 客服统计概览 -->
    <div class="overview-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="总工单数"
              :value="overview.totalTickets"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <CustomerServiceOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="待处理"
              :value="overview.pendingTickets"
              :value-style="{ color: '#fa8c16' }"
            >
              <template #prefix>
                <ClockCircleOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="已解决"
              :value="overview.resolvedTickets"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <CheckCircleOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="解决率"
              :value="overview.resolutionRate"
              suffix="%"
              :precision="2"
              :value-style="{ color: '#722ed1' }"
            >
              <template #prefix>
                <RiseOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <a-card title="快捷操作" size="small">
        <a-space wrap>
          <a-button type="primary" ghost @click="showOnlineChat">
            <MessageOutlined />
            在线客服
          </a-button>
          <a-button @click="showKnowledgeBase">
            <BookOutlined />
            知识库
          </a-button>
          <a-button @click="showFeedbackList">
            <CommentOutlined />
            客户反馈
          </a-button>
          <a-button @click="exportTickets">
            <ExportOutlined />
            导出工单
          </a-button>
          <a-button @click="showSettings">
            <SettingOutlined />
            客服设置
          </a-button>
        </a-space>
      </a-card>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <a-card>
        <a-form layout="inline" :model="searchForm" @finish="handleSearch">
          <a-form-item label="工单编号">
            <a-input
              v-model:value="searchForm.ticketId"
              placeholder="搜索工单编号"
              allow-clear
              style="width: 150px"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>
          
          <a-form-item label="客户信息">
            <a-input
              v-model:value="searchForm.customer"
              placeholder="客户姓名/手机号"
              allow-clear
              style="width: 180px"
            />
          </a-form-item>
          
          <a-form-item label="工单状态">
            <a-select
              v-model:value="searchForm.status"
              placeholder="选择状态"
              allow-clear
              style="width: 120px"
            >
              <a-select-option value="pending">待处理</a-select-option>
              <a-select-option value="processing">处理中</a-select-option>
              <a-select-option value="resolved">已解决</a-select-option>
              <a-select-option value="closed">已关闭</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="问题类型">
            <a-select
              v-model:value="searchForm.category"
              placeholder="选择类型"
              allow-clear
              style="width: 150px"
            >
              <a-select-option value="order">订单问题</a-select-option>
              <a-select-option value="product">商品问题</a-select-option>
              <a-select-option value="payment">支付问题</a-select-option>
              <a-select-option value="refund">退款问题</a-select-option>
              <a-select-option value="other">其他问题</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="优先级">
            <a-select
              v-model:value="searchForm.priority"
              placeholder="选择优先级"
              allow-clear
              style="width: 100px"
            >
              <a-select-option value="low">低</a-select-option>
              <a-select-option value="medium">中</a-select-option>
              <a-select-option value="high">高</a-select-option>
              <a-select-option value="urgent">紧急</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="创建时间">
            <a-range-picker
              v-model:value="searchForm.dateRange"
              style="width: 240px"
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

    <!-- 工单列表 -->
    <div class="table-section">
      <a-card title="工单列表">
        <template #extra>
          <a-space>
            <a-button @click="batchAssign" :disabled="selectedRowKeys.length === 0">
              <UserOutlined />
              批量分配
            </a-button>
            <a-button @click="batchClose" :disabled="selectedRowKeys.length === 0">
              <CloseOutlined />
              批量关闭
            </a-button>
            <a-select
              v-model:value="pageSize"
              @change="handlePageSizeChange"
              style="width: 100px"
            >
              <a-select-option :value="10">10条/页</a-select-option>
              <a-select-option :value="20">20条/页</a-select-option>
              <a-select-option :value="50">50条/页</a-select-option>
            </a-select>
          </a-space>
        </template>
        
        <a-table
          :columns="tableColumns"
          :data-source="ticketData"
          :loading="tableLoading"
          :pagination="pagination"
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
          @change="handleTableChange"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'ticketId'">
              <a-button type="link" @click="viewDetail(record)">
                {{ record.ticketId }}
              </a-button>
            </template>
            
            <template v-else-if="column.key === 'customer'">
              <div class="customer-info">
                <div class="name">{{ record.customerName }}</div>
                <div class="contact">{{ record.customerPhone }}</div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'category'">
              <a-tag :color="getCategoryColor(record.category)">
                {{ getCategoryText(record.category) }}
              </a-tag>
            </template>
            
            <template v-else-if="column.key === 'priority'">
              <a-tag :color="getPriorityColor(record.priority)">
                {{ getPriorityText(record.priority) }}
              </a-tag>
            </template>
            
            <template v-else-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>
            
            <template v-else-if="column.key === 'assignee'">
              <div class="assignee-info" v-if="record.assignee">
                <a-avatar size="small" :src="record.assignee.avatar">
                  {{ record.assignee.name.charAt(0) }}
                </a-avatar>
                <span class="name">{{ record.assignee.name }}</span>
              </div>
              <span v-else class="unassigned">未分配</span>
            </template>
            
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small" @click="viewDetail(record)">
                  详情
                </a-button>
                <a-button type="link" size="small" @click="replyTicket(record)">
                  回复
                </a-button>
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="({ key }: { key: string }) => handleMenuClick(key, record)">
                      <a-menu-item key="assign">
                        <UserOutlined />
                        分配
                      </a-menu-item>
                      <a-menu-item key="escalate">
                        <ArrowUpOutlined />
                        升级
                      </a-menu-item>
                      <a-menu-item key="resolve" v-if="record.status !== 'resolved'">
                        <CheckOutlined />
                        解决
                      </a-menu-item>
                      <a-menu-item key="close" v-if="record.status !== 'closed'">
                        <CloseOutlined />
                        关闭
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="export">
                        <ExportOutlined />
                        导出
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
      </a-card>
    </div>

    <!-- 新建/编辑工单弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      width="800px"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="客户姓名" name="customerName">
              <a-input v-model:value="formData.customerName" placeholder="请输入客户姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话" name="customerPhone">
              <a-input v-model:value="formData.customerPhone" placeholder="请输入联系电话" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="问题类型" name="category">
              <a-select v-model:value="formData.category" placeholder="选择问题类型">
                <a-select-option value="order">订单问题</a-select-option>
                <a-select-option value="product">商品问题</a-select-option>
                <a-select-option value="payment">支付问题</a-select-option>
                <a-select-option value="refund">退款问题</a-select-option>
                <a-select-option value="other">其他问题</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="优先级" name="priority">
              <a-select v-model:value="formData.priority" placeholder="选择优先级">
                <a-select-option value="low">低</a-select-option>
                <a-select-option value="medium">中</a-select-option>
                <a-select-option value="high">高</a-select-option>
                <a-select-option value="urgent">紧急</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="问题标题" name="title">
          <a-input v-model:value="formData.title" placeholder="请输入问题标题" />
        </a-form-item>
        
        <a-form-item label="问题描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请详细描述问题"
            :rows="4"
          />
        </a-form-item>
        
        <a-form-item label="相关订单" name="orderId">
          <a-input v-model:value="formData.orderId" placeholder="相关订单号（可选）" />
        </a-form-item>
        
        <a-form-item label="分配给" name="assigneeId">
          <a-select v-model:value="formData.assigneeId" placeholder="选择客服人员" allow-clear>
            <a-select-option value="cs001">张小明</a-select-option>
            <a-select-option value="cs002">李小红</a-select-option>
            <a-select-option value="cs003">王小强</a-select-option>
            <a-select-option value="cs004">赵小美</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="附件">
          <a-upload
            v-model:file-list="formData.attachments"
            :before-upload="() => false"
            multiple
          >
            <a-button>
              <UploadOutlined />
              上传附件
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 工单详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="工单详情"
      :footer="null"
      width="1000px"
    >
      <div class="ticket-detail" v-if="selectedTicket">
        <!-- 工单基本信息 -->
        <a-card title="基本信息" size="small" class="detail-card">
          <a-descriptions :column="3" bordered>
            <a-descriptions-item label="工单编号">{{ selectedTicket.ticketId }}</a-descriptions-item>
            <a-descriptions-item label="客户姓名">{{ selectedTicket.customerName }}</a-descriptions-item>
            <a-descriptions-item label="联系电话">{{ selectedTicket.customerPhone }}</a-descriptions-item>
            <a-descriptions-item label="问题类型">
              <a-tag :color="getCategoryColor(selectedTicket.category)">
                {{ getCategoryText(selectedTicket.category) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="优先级">
              <a-tag :color="getPriorityColor(selectedTicket.priority)">
                {{ getPriorityText(selectedTicket.priority) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="状态">
              <a-tag :color="getStatusColor(selectedTicket.status)">
                {{ getStatusText(selectedTicket.status) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ selectedTicket.createTime }}</a-descriptions-item>
            <a-descriptions-item label="更新时间">{{ selectedTicket.updateTime }}</a-descriptions-item>
            <a-descriptions-item label="处理人">
              <span v-if="selectedTicket.assignee">{{ selectedTicket.assignee.name }}</span>
              <span v-else class="unassigned">未分配</span>
            </a-descriptions-item>
            <a-descriptions-item label="问题标题" :span="3">
              {{ selectedTicket.title }}
            </a-descriptions-item>
            <a-descriptions-item label="问题描述" :span="3">
              <pre class="description-content">{{ selectedTicket.description }}</pre>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        
        <!-- 处理记录 -->
        <a-card title="处理记录" size="small" class="detail-card">
          <a-timeline>
            <a-timeline-item
              v-for="record in selectedTicket.records"
              :key="record.id"
              :color="getRecordColor(record.type)"
            >
              <template #dot>
                <component :is="getRecordIcon(record.type)" />
              </template>
              <div class="record-item">
                <div class="record-header">
                  <span class="action">{{ record.action }}</span>
                  <span class="operator">{{ record.operator }}</span>
                  <span class="time">{{ record.time }}</span>
                </div>
                <div class="record-content" v-if="record.content">
                  {{ record.content }}
                </div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>
        
        <!-- 快捷操作 -->
        <div class="detail-actions">
          <a-space>
            <a-button type="primary" @click="replyTicket(selectedTicket)">
              <MessageOutlined />
              回复
            </a-button>
            <a-button @click="assignTicket(selectedTicket)">
              <UserOutlined />
              分配
            </a-button>
            <a-button @click="escalateTicket(selectedTicket)">
              <ArrowUpOutlined />
              升级
            </a-button>
            <a-button @click="resolveTicket(selectedTicket)" v-if="selectedTicket.status !== 'resolved'">
              <CheckOutlined />
              解决
            </a-button>
            <a-button @click="closeTicket(selectedTicket)" v-if="selectedTicket.status !== 'closed'">
              <CloseOutlined />
              关闭
            </a-button>
          </a-space>
        </div>
      </div>
    </a-modal>

    <!-- 回复工单弹窗 -->
    <a-modal
      v-model:open="replyModalVisible"
      title="回复工单"
      @ok="handleReply"
      @cancel="replyModalVisible = false"
    >
      <a-form layout="vertical">
        <a-form-item label="回复内容">
          <a-textarea
            v-model:value="replyForm.content"
            placeholder="请输入回复内容"
            :rows="6"
          />
        </a-form-item>
        
        <a-form-item label="回复类型">
          <a-radio-group v-model:value="replyForm.type">
            <a-radio value="public">公开回复</a-radio>
            <a-radio value="internal">内部备注</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item label="附件">
          <a-upload
            v-model:file-list="replyForm.attachments"
            :before-upload="() => false"
            multiple
          >
            <a-button>
              <UploadOutlined />
              上传附件
            </a-button>
          </a-upload>
        </a-form-item>
        
        <a-form-item>
          <a-checkbox v-model:checked="replyForm.notifyCustomer">
            通知客户
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  ReloadOutlined,
  PlusOutlined,
  SearchOutlined,
  CustomerServiceOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  MessageOutlined,
  BookOutlined,
  CommentOutlined,
  ExportOutlined,
  SettingOutlined,
  UserOutlined,
  CloseOutlined,
  ArrowUpOutlined,
  CheckOutlined,
  DownOutlined,
  UploadOutlined,
  FileTextOutlined,
  EditOutlined,
  PhoneOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, TableProps, UploadFile } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import dayjs, { type Dayjs } from 'dayjs'

/**
 * 客服管理页面
 */

interface ServiceOverview {
  totalTickets: number
  pendingTickets: number
  resolvedTickets: number
  resolutionRate: number
}

interface Assignee {
  id: string
  name: string
  avatar?: string
}

interface TicketRecord {
  id: string
  type: string
  action: string
  operator: string
  time: string
  content?: string
}

interface Ticket {
  id: string
  ticketId: string
  customerName: string
  customerPhone: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  orderId?: string
  assignee?: Assignee
  createTime: string
  updateTime: string
  records: TicketRecord[]
}

interface SearchForm {
  ticketId: string
  customer: string
  status?: string
  category?: string
  priority?: string
  dateRange?: [Dayjs, Dayjs]
}

interface FormData {
  customerName: string
  customerPhone: string
  title: string
  description: string
  category: string
  priority: string
  orderId?: string
  assigneeId?: string
  attachments?: UploadFile[]
}

interface ReplyForm {
  content: string
  type: string
  attachments?: UploadFile[]
  notifyCustomer: boolean
}

// 响应式数据
const tableLoading = ref(false)
const modalVisible = ref(false)
const detailModalVisible = ref(false)
const replyModalVisible = ref(false)
const pageSize = ref(20)
const selectedRowKeys = ref<string[]>([])
const ticketData = ref<Ticket[]>([])
const selectedTicket = ref<Ticket | null>(null)
const editingTicket = ref<Ticket | null>(null)
const formRef = ref()

// 搜索表单
const searchForm = reactive<SearchForm>({
  ticketId: '',
  customer: '',
  status: undefined,
  category: undefined,
  priority: undefined,
  dateRange: undefined,
})

// 表单数据
const formData = reactive<FormData>({
  customerName: '',
  customerPhone: '',
  title: '',
  description: '',
  category: '',
  priority: '',
  orderId: undefined,
  assigneeId: undefined,
  attachments: undefined,
})

// 回复表单
const replyForm = reactive<ReplyForm>({
  content: '',
  type: 'public',
  attachments: undefined,
  notifyCustomer: true,
})

// 客服概览数据
const overview = ref<ServiceOverview>({
  totalTickets: 0,
  pendingTickets: 0,
  resolvedTickets: 0,
  resolutionRate: 0,
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

// 表单验证规则
const formRules = {
  customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  customerPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  title: [{ required: true, message: '请输入问题标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
  category: [{ required: true, message: '请选择问题类型', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
}

// 表格列配置
const tableColumns: TableColumnsType = [
  {
    title: '工单编号',
    key: 'ticketId',
    width: 120,
    fixed: 'left',
  },
  {
    title: '客户信息',
    key: 'customer',
    width: 150,
  },
  {
    title: '问题标题',
    dataIndex: 'title',
    key: 'title',
    width: 200,
    ellipsis: true,
  },
  {
    title: '问题类型',
    key: 'category',
    width: 100,
  },
  {
    title: '优先级',
    key: 'priority',
    width: 80,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '处理人',
    key: 'assignee',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160,
    sorter: true,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 160,
    sorter: true,
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
  },
]

// 计算属性
const modalTitle = computed(() => {
  return editingTicket.value ? '编辑工单' : '新建工单'
})

/**
 * 获取问题类型文本
 */
const getCategoryText = (category: string): string => {
  const categoryMap: Record<string, string> = {
    order: '订单问题',
    product: '商品问题',
    payment: '支付问题',
    refund: '退款问题',
    other: '其他问题',
  }
  return categoryMap[category] || category
}

/**
 * 获取问题类型颜色
 */
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    order: 'blue',
    product: 'green',
    payment: 'orange',
    refund: 'red',
    other: 'default',
  }
  return colorMap[category] || 'default'
}

/**
 * 获取优先级文本
 */
const getPriorityText = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急',
  }
  return priorityMap[priority] || priority
}

/**
 * 获取优先级颜色
 */
const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    low: 'default',
    medium: 'blue',
    high: 'orange',
    urgent: 'red',
  }
  return colorMap[priority] || 'default'
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭',
  }
  return statusMap[status] || status
}

/**
 * 获取状态颜色
 */
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    processing: 'blue',
    resolved: 'green',
    closed: 'default',
  }
  return colorMap[status] || 'default'
}

/**
 * 获取记录类型颜色
 */
const getRecordColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    create: 'blue',
    reply: 'green',
    assign: 'orange',
    resolve: 'green',
    close: 'red',
  }
  return colorMap[type] || 'default'
}

/**
 * 获取记录类型图标
 */
const getRecordIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    create: FileTextOutlined,
    reply: MessageOutlined,
    assign: UserOutlined,
    resolve: CheckOutlined,
    close: CloseOutlined,
    edit: EditOutlined,
    call: PhoneOutlined,
  }
  return iconMap[type] || FileTextOutlined
}

/**
 * 加载工单数据
 */
const loadTicketData = async (): Promise<void> => {
  tableLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟概览数据
    overview.value = {
      totalTickets: 1248,
      pendingTickets: 156,
      resolvedTickets: 1092,
      resolutionRate: 87.5,
    }
    
    // 模拟工单数据
    const mockData: Ticket[] = [
      {
        id: 'T001',
        ticketId: 'CS202401001',
        customerName: '张三',
        customerPhone: '13800138001',
        title: '订单支付失败',
        description: '订单号ORD123456支付时提示网络错误，已尝试多次仍无法完成支付',
        category: 'payment',
        priority: 'high',
        status: 'processing',
        orderId: 'ORD123456',
        assignee: {
          id: 'cs001',
          name: '张小明',
          avatar: '',
        },
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-15 14:20:00',
        records: [
          {
            id: 'R001',
            type: 'create',
            action: '创建工单',
            operator: '系统',
            time: '2024-01-15 10:30:00',
            content: '客户通过在线客服创建工单',
          },
          {
            id: 'R002',
            type: 'assign',
            action: '分配工单',
            operator: '客服主管',
            time: '2024-01-15 11:00:00',
            content: '工单已分配给张小明处理',
          },
          {
            id: 'R003',
            type: 'reply',
            action: '客服回复',
            operator: '张小明',
            time: '2024-01-15 14:20:00',
            content: '您好，我们已经联系技术部门检查支付系统，请稍后重试',
          },
        ],
      },
      {
        id: 'T002',
        ticketId: 'CS202401002',
        customerName: '李四',
        customerPhone: '13800138002',
        title: '商品质量问题',
        description: '购买的手机屏幕有划痕，要求退换货',
        category: 'product',
        priority: 'medium',
        status: 'pending',
        orderId: 'ORD123457',
        createTime: '2024-01-15 15:45:00',
        updateTime: '2024-01-15 15:45:00',
        records: [
          {
            id: 'R004',
            type: 'create',
            action: '创建工单',
            operator: '系统',
            time: '2024-01-15 15:45:00',
            content: '客户通过电话创建工单',
          },
        ],
      },
      {
        id: 'T003',
        ticketId: 'CS202401003',
        customerName: '王五',
        customerPhone: '13800138003',
        title: '申请退款',
        description: '商品不符合预期，申请全额退款',
        category: 'refund',
        priority: 'low',
        status: 'resolved',
        orderId: 'ORD123458',
        assignee: {
          id: 'cs002',
          name: '李小红',
          avatar: '',
        },
        createTime: '2024-01-14 09:20:00',
        updateTime: '2024-01-15 16:30:00',
        records: [
          {
            id: 'R005',
            type: 'create',
            action: '创建工单',
            operator: '系统',
            time: '2024-01-14 09:20:00',
          },
          {
            id: 'R006',
            type: 'assign',
            action: '分配工单',
            operator: '客服主管',
            time: '2024-01-14 10:00:00',
          },
          {
            id: 'R007',
            type: 'resolve',
            action: '解决工单',
            operator: '李小红',
            time: '2024-01-15 16:30:00',
            content: '已为客户办理退款，预计3-5个工作日到账',
          },
        ],
      },
      {
        id: 'T004',
        ticketId: 'CS202401004',
        customerName: '赵六',
        customerPhone: '13800138004',
        title: '订单配送延迟',
        description: '订单已发货3天，物流信息无更新',
        category: 'order',
        priority: 'medium',
        status: 'closed',
        orderId: 'ORD123459',
        assignee: {
          id: 'cs003',
          name: '王小强',
          avatar: '',
        },
        createTime: '2024-01-13 14:15:00',
        updateTime: '2024-01-15 10:00:00',
        records: [
          {
            id: 'R008',
            type: 'create',
            action: '创建工单',
            operator: '系统',
            time: '2024-01-13 14:15:00',
          },
          {
            id: 'R009',
            type: 'close',
            action: '关闭工单',
            operator: '王小强',
            time: '2024-01-15 10:00:00',
            content: '已联系物流公司，商品已正常配送',
          },
        ],
      },
      {
        id: 'T005',
        ticketId: 'CS202401005',
        customerName: '孙七',
        customerPhone: '13800138005',
        title: '账户登录问题',
        description: '忘记密码，无法登录账户',
        category: 'other',
        priority: 'urgent',
        status: 'pending',
        createTime: '2024-01-15 16:50:00',
        updateTime: '2024-01-15 16:50:00',
        records: [
          {
            id: 'R010',
            type: 'create',
            action: '创建工单',
            operator: '系统',
            time: '2024-01-15 16:50:00',
            content: '客户通过邮件创建工单',
          },
        ],
      },
    ]
    
    ticketData.value = mockData
    pagination.total = mockData.length
  } catch (error) {
    message.error('加载工单数据失败')
  } finally {
    tableLoading.value = false
  }
}

/**
 * 搜索处理
 */
const handleSearch = (): void => {
  pagination.current = 1
  loadTicketData()
}

/**
 * 重置搜索
 */
const resetSearch = (): void => {
  Object.assign(searchForm, {
    ticketId: '',
    customer: '',
    status: undefined,
    category: undefined,
    priority: undefined,
    dateRange: undefined,
  })
  handleSearch()
}

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 20
  loadTicketData()
}

/**
 * 处理页面大小变化
 */
const handlePageSizeChange = (size: number): void => {
  pageSize.value = size
  pagination.pageSize = size
  pagination.current = 1
  loadTicketData()
}

/**
 * 选择变化处理
 */
const onSelectChange = (keys: string[]): void => {
  selectedRowKeys.value = keys
}

/**
 * 显示新建弹窗
 */
const showCreateModal = (): void => {
  editingTicket.value = null
  resetForm()
  modalVisible.value = true
}

/**
 * 查看详情
 */
const viewDetail = (record: Ticket): void => {
  selectedTicket.value = record
  detailModalVisible.value = true
}

/**
 * 回复工单
 */
const replyTicket = (record: Ticket): void => {
  selectedTicket.value = record
  Object.assign(replyForm, {
    content: '',
    type: 'public',
    attachments: undefined,
    notifyCustomer: true,
  })
  replyModalVisible.value = true
}

/**
 * 菜单点击处理
 */
const handleMenuClick = (key: string, record: Ticket): void => {
  switch (key) {
    case 'assign':
      assignTicket(record)
      break
    case 'escalate':
      escalateTicket(record)
      break
    case 'resolve':
      resolveTicket(record)
      break
    case 'close':
      closeTicket(record)
      break
    case 'export':
      exportTicket(record)
      break
  }
}

/**
 * 分配工单
 */
const assignTicket = (record: Ticket): void => {
  message.success(`工单 ${record.ticketId} 已分配`)
  loadTicketData()
}

/**
 * 升级工单
 */
const escalateTicket = (record: Ticket): void => {
  message.success(`工单 ${record.ticketId} 已升级`)
  loadTicketData()
}

/**
 * 解决工单
 */
const resolveTicket = (record: Ticket): void => {
  message.success(`工单 ${record.ticketId} 已解决`)
  loadTicketData()
}

/**
 * 关闭工单
 */
const closeTicket = (record: Ticket): void => {
  message.success(`工单 ${record.ticketId} 已关闭`)
  loadTicketData()
}

/**
 * 导出工单
 */
const exportTicket = (record: Ticket): void => {
  message.success(`工单 ${record.ticketId} 导出成功`)
}

/**
 * 批量分配
 */
const batchAssign = (): void => {
  message.success(`已分配 ${selectedRowKeys.value.length} 个工单`)
  selectedRowKeys.value = []
  loadTicketData()
}

/**
 * 批量关闭
 */
const batchClose = (): void => {
  message.success(`已关闭 ${selectedRowKeys.value.length} 个工单`)
  selectedRowKeys.value = []
  loadTicketData()
}

/**
 * 处理回复
 */
const handleReply = (): void => {
  message.success('回复发送成功')
  replyModalVisible.value = false
  loadTicketData()
}

/**
 * 提交表单
 */
const handleSubmit = async (): Promise<void> => {
  try {
    await formRef.value.validate()
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const action = editingTicket.value ? '更新' : '创建'
    message.success(`${action}工单成功`)
    
    modalVisible.value = false
    loadTicketData()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

/**
 * 取消操作
 */
const handleCancel = (): void => {
  modalVisible.value = false
  resetForm()
}

/**
 * 重置表单
 */
const resetForm = (): void => {
  Object.assign(formData, {
    customerName: '',
    customerPhone: '',
    title: '',
    description: '',
    category: '',
    priority: '',
    orderId: undefined,
    assigneeId: undefined,
    attachments: undefined,
  })
  formRef.value?.resetFields()
}

/**
 * 显示在线客服
 */
const showOnlineChat = (): void => {
  message.info('在线客服功能开发中')
}

/**
 * 显示知识库
 */
const showKnowledgeBase = (): void => {
  message.info('知识库功能开发中')
}

/**
 * 显示客户反馈
 */
const showFeedbackList = (): void => {
  message.info('客户反馈功能开发中')
}

/**
 * 导出工单
 */
const exportTickets = (): void => {
  message.success('工单导出成功')
}

/**
 * 显示设置
 */
const showSettings = (): void => {
  message.info('客服设置功能开发中')
}

/**
 * 刷新数据
 */
const refreshData = (): void => {
  loadTicketData()
}

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  loadTicketData()
})
</script>

<style scoped lang="less">
.customer-service-view {
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

.quick-actions {
  margin-bottom: 24px;
}

.search-section {
  margin-bottom: 24px;
  
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
}

.table-section {
  .customer-info {
    .name {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .contact {
      font-size: 12px;
      color: #8c8c8c;
    }
  }
  
  .assignee-info {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .name {
      font-size: 12px;
    }
  }
  
  .unassigned {
    color: #8c8c8c;
    font-style: italic;
  }
}

.ticket-detail {
  .detail-card {
    margin-bottom: 16px;
  }
  
  .description-content {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .record-item {
    .record-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 4px;
      
      .action {
        font-weight: 600;
      }
      
      .operator {
        color: #1890ff;
      }
      
      .time {
        color: #8c8c8c;
        font-size: 12px;
      }
    }
    
    .record-content {
      color: #595959;
      font-size: 14px;
      padding-left: 16px;
      border-left: 2px solid #f0f0f0;
    }
  }
  
  .detail-actions {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .customer-service-view {
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
  
  .search-section {
    :deep(.ant-form) {
      .ant-form-item {
        display: block;
        width: 100%;
        
        .ant-form-item-control {
          width: 100%;
          
          .ant-input,
          .ant-select,
          .ant-range-picker {
            width: 100% !important;
          }
        }
      }
    }
  }
}
</style>