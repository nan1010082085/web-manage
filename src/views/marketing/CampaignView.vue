<template>
  <div class="campaign-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">营销活动</h2>
        <p class="page-description">管理营销活动，提升用户参与度和转化率</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button @click="refreshData">
            <ReloadOutlined />
            刷新
          </a-button>
          <a-button type="primary" @click="showCreateModal">
            <PlusOutlined />
            新建活动
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 活动统计概览 -->
    <div class="overview-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="总活动数"
              :value="overview.totalCampaigns"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <CampaignOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="进行中"
              :value="overview.activeCampaigns"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <PlayCircleOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="总参与人数"
              :value="overview.totalParticipants"
              :value-style="{ color: '#fa8c16' }"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="转化率"
              :value="overview.conversionRate"
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

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <a-card>
        <a-form layout="inline" :model="searchForm" @finish="handleSearch">
          <a-form-item label="活动名称">
            <a-input
              v-model:value="searchForm.name"
              placeholder="搜索活动名称"
              allow-clear
              style="width: 200px"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="活动状态">
            <a-select
              v-model:value="searchForm.status"
              placeholder="选择状态"
              allow-clear
              style="width: 120px"
            >
              <a-select-option value="draft">草稿</a-select-option>
              <a-select-option value="active">进行中</a-select-option>
              <a-select-option value="paused">已暂停</a-select-option>
              <a-select-option value="ended">已结束</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="活动类型">
            <a-select
              v-model:value="searchForm.type"
              placeholder="选择类型"
              allow-clear
              style="width: 150px"
            >
              <a-select-option value="discount">优惠券</a-select-option>
              <a-select-option value="flash_sale">限时抢购</a-select-option>
              <a-select-option value="group_buy">团购</a-select-option>
              <a-select-option value="lottery">抽奖</a-select-option>
              <a-select-option value="points">积分活动</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="创建时间">
            <a-range-picker v-model:value="searchForm.dateRange" style="width: 240px" />
          </a-form-item>

          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit">
                <SearchOutlined />
                搜索
              </a-button>
              <a-button @click="resetSearch"> 重置 </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>
    </div>

    <!-- 活动列表 -->
    <div class="table-section">
      <a-card title="活动列表">
        <template #extra>
          <a-space>
            <a-button @click="batchDelete" :disabled="selectedRowKeys.length === 0">
              <DeleteOutlined />
              批量删除
            </a-button>
            <a-select v-model:value="pageSize" @change="handlePageSizeChange" style="width: 100px">
              <a-select-option :value="10">10条/页</a-select-option>
              <a-select-option :value="20">20条/页</a-select-option>
              <a-select-option :value="50">50条/页</a-select-option>
            </a-select>
          </a-space>
        </template>

        <a-table
          :columns="tableColumns"
          :data-source="campaignData"
          :loading="tableLoading"
          :pagination="pagination"
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
          @change="handleTableChange"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <div class="campaign-name">
                <a-avatar :src="record.image" size="small" style="margin-right: 8px">
                  <template #icon>
                    <CampaignOutlined />
                  </template>
                </a-avatar>
                <div>
                  <div class="name">{{ record.name }}</div>
                  <div class="description">{{ record.description }}</div>
                </div>
              </div>
            </template>

            <template v-else-if="column.key === 'type'">
              <a-tag :color="getTypeColor(record.type)">
                {{ getTypeText(record.type) }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'participants'">
              <div class="participants-info">
                <div class="count">{{ record.participants }}</div>
                <div class="target">目标: {{ record.targetParticipants }}</div>
              </div>
            </template>

            <template v-else-if="column.key === 'conversion'">
              <div class="conversion-info">
                <div class="rate">{{ record.conversionRate }}%</div>
                <div class="count">{{ record.conversions }} 转化</div>
              </div>
            </template>

            <template v-else-if="column.key === 'budget'">
              <div class="budget-info">
                <div class="used">已用: ¥{{ record.usedBudget }}</div>
                <div class="total">总计: ¥{{ record.totalBudget }}</div>
              </div>
            </template>

            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small" @click="viewDetail(record)"> 详情 </a-button>
                <a-button type="link" size="small" @click="editCampaign(record)"> 编辑 </a-button>
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="({ key }: { key: string }) => handleMenuClick(key, record)">
                      <a-menu-item key="copy">
                        <CopyOutlined />
                        复制
                      </a-menu-item>
                      <a-menu-item key="pause" v-if="record.status === 'active'">
                        <PauseCircleOutlined />
                        暂停
                      </a-menu-item>
                      <a-menu-item key="resume" v-if="record.status === 'paused'">
                        <PlayCircleOutlined />
                        恢复
                      </a-menu-item>
                      <a-menu-item key="end" v-if="['active', 'paused'].includes(record.status)">
                        <StopOutlined />
                        结束
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="delete" danger>
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
      </a-card>
    </div>

    <!-- 新建/编辑活动弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      width="800px"
      @ok="handleSubmit"
      @cancel="handleCancel"
     ok-text="确定" cancel-text="取消">
      <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="活动名称" name="name">
              <a-input v-model:value="formData.name" placeholder="请输入活动名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="活动类型" name="type">
              <a-select v-model:value="formData.type" placeholder="选择活动类型">
                <a-select-option value="discount">优惠券</a-select-option>
                <a-select-option value="flash_sale">限时抢购</a-select-option>
                <a-select-option value="group_buy">团购</a-select-option>
                <a-select-option value="lottery">抽奖</a-select-option>
                <a-select-option value="points">积分活动</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="活动描述" name="description">
          <a-textarea v-model:value="formData.description" placeholder="请输入活动描述" :rows="3" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="开始时间" name="startTime">
              <a-date-picker
                v-model:value="formData.startTime"
                show-time
                placeholder="选择开始时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束时间" name="endTime">
              <a-date-picker
                v-model:value="formData.endTime"
                show-time
                placeholder="选择结束时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="目标参与人数" name="targetParticipants">
              <a-input-number
                v-model:value="formData.targetParticipants"
                placeholder="目标参与人数"
                :min="1"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="预算金额" name="totalBudget">
              <a-input-number
                v-model:value="formData.totalBudget"
                placeholder="预算金额"
                :min="0"
                :precision="2"
                style="width: 100%"
              >
                <template #addonBefore>¥</template>
              </a-input-number>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="活动规则" name="rules">
          <a-textarea v-model:value="formData.rules" placeholder="请输入活动规则" :rows="4" />
        </a-form-item>

        <a-form-item label="活动图片">
          <a-upload
            v-model:file-list="fileList"
            list-type="picture-card"
            :before-upload="beforeUpload"
            @preview="handlePreview"
          >
            <div v-if="fileList.length < 1">
              <PlusOutlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 活动详情弹窗 -->
    <a-modal v-model:open="detailModalVisible" title="活动详情" :footer="null" width="900px" ok-text="确定" cancel-text="取消">
      <div class="campaign-detail" v-if="selectedCampaign">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="活动名称">{{ selectedCampaign.name }}</a-descriptions-item>
          <a-descriptions-item label="活动类型">
            <a-tag :color="getTypeColor(selectedCampaign.type)">
              {{ getTypeText(selectedCampaign.type) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="活动状态">
            <a-tag :color="getStatusColor(selectedCampaign.status)">
              {{ getStatusText(selectedCampaign.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">{{
            selectedCampaign.createTime
          }}</a-descriptions-item>
          <a-descriptions-item label="开始时间">{{
            selectedCampaign.startTime
          }}</a-descriptions-item>
          <a-descriptions-item label="结束时间">{{ selectedCampaign.endTime }}</a-descriptions-item>
          <a-descriptions-item label="参与人数">{{
            selectedCampaign.participants
          }}</a-descriptions-item>
          <a-descriptions-item label="目标人数">{{
            selectedCampaign.targetParticipants
          }}</a-descriptions-item>
          <a-descriptions-item label="转化人数">{{
            selectedCampaign.conversions
          }}</a-descriptions-item>
          <a-descriptions-item label="转化率"
            >{{ selectedCampaign.conversionRate }}%</a-descriptions-item
          >
          <a-descriptions-item label="已用预算"
            >¥{{ selectedCampaign.usedBudget }}</a-descriptions-item
          >
          <a-descriptions-item label="总预算"
            >¥{{ selectedCampaign.totalBudget }}</a-descriptions-item
          >
          <a-descriptions-item label="活动描述" :span="2">
            {{ selectedCampaign.description }}
          </a-descriptions-item>
          <a-descriptions-item label="活动规则" :span="2">
            <pre class="rules-content">{{ selectedCampaign.rules }}</pre>
          </a-descriptions-item>
        </a-descriptions>

        <!-- 活动数据图表 -->
        <div class="campaign-charts" style="margin-top: 24px">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-card title="参与趋势" size="small">
                <HighChart :options="campaignChartConfigs.participantTrend" :height="'200px'" />
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card title="转化分析" size="small">
                <HighChart :options="campaignChartConfigs.conversionAnalysis" :height="'200px'" />
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import {
  ReloadOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  CopyOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
  DownOutlined,
  ApiOutlined as CampaignOutlined,
  UserOutlined,
  RiseOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, TableProps, UploadFile } from 'ant-design-vue'
import HighChart from '@/components/common/HighChart.vue'
import { campaignChartConfigs } from '@/config/charts/chartConfigs'
import {
  getCampaignOverview,
  getCampaignList,
  getCampaignDetail,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  toggleCampaign,
} from '@/api/marketing'
import type { Campaign } from '@/mock/marketing'

import dayjs, { type Dayjs } from 'dayjs'

/**
 * 营销活动管理页面
 */

interface CampaignOverview {
  totalCampaigns: number
  activeCampaigns: number
  totalParticipants: number
  conversionRate: number
}



interface SearchForm {
  name: string
  status?: string
  type?: string
  dateRange?: [Dayjs, Dayjs]
}

interface FormData {
  name: string
  description: string
  type: string
  startTime?: Dayjs
  endTime?: Dayjs
  targetParticipants?: number
  totalBudget?: number
  rules: string
}

// 响应式数据
const tableLoading = ref(false)
const modalVisible = ref(false)
const detailModalVisible = ref(false)
const pageSize = ref(20)
const selectedRowKeys = ref<string[]>([])
const campaignData = ref<Campaign[]>([])
const selectedCampaign = ref<Campaign | null>(null)
const editingCampaign = ref<Campaign | null>(null)
const fileList = ref<UploadFile[]>([])
const formRef = ref()

// 图表引用已移除，使用HighChart组件

// 搜索表单
const searchForm = reactive<SearchForm>({
  name: '',
  status: undefined,
  type: undefined,
  dateRange: undefined,
})

// 表单数据
const formData = reactive<FormData>({
  name: '',
  description: '',
  type: '',
  startTime: undefined,
  endTime: undefined,
  targetParticipants: undefined,
  totalBudget: undefined,
  rules: '',
})

// 活动概览数据
const overview = ref<CampaignOverview>({
  totalCampaigns: 0,
  activeCampaigns: 0,
  totalParticipants: 0,
  conversionRate: 0,
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
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入活动描述', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  targetParticipants: [{ required: true, message: '请输入目标参与人数', trigger: 'blur' }],
  totalBudget: [{ required: true, message: '请输入预算金额', trigger: 'blur' }],
  rules: [{ required: true, message: '请输入活动规则', trigger: 'blur' }],
}

// 表格列配置
const tableColumns: TableColumnsType = [
  {
    title: '活动名称',
    key: 'name',
    width: 250,
    fixed: 'left',
  },
  {
    title: '活动类型',
    key: 'type',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '活动时间',
    dataIndex: 'startTime',
    key: 'startTime',
    width: 160,
    sorter: true,
  },
  {
    title: '参与情况',
    key: 'participants',
    width: 120,
  },
  {
    title: '转化情况',
    key: 'conversion',
    width: 120,
  },
  {
    title: '预算使用',
    key: 'budget',
    width: 140,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
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
  return editingCampaign.value ? '编辑活动' : '新建活动'
})

/**
 * 获取活动类型文本
 */
const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    discount: '优惠券',
    flash_sale: '限时抢购',
    group_buy: '团购',
    lottery: '抽奖',
    points: '积分活动',
  }
  return typeMap[type] || type
}

/**
 * 获取活动类型颜色
 */
const getTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    discount: 'blue',
    flash_sale: 'red',
    group_buy: 'green',
    lottery: 'purple',
    points: 'orange',
  }
  return colorMap[type] || 'default'
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    active: '进行中',
    paused: '已暂停',
    ended: '已结束',
  }
  return statusMap[status] || status
}

/**
 * 获取状态颜色
 */
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    draft: 'default',
    active: 'green',
    paused: 'orange',
    ended: 'red',
  }
  return colorMap[status] || 'default'
}

/**
 * 加载活动数据
 */
const loadCampaignData = async (): Promise<void> => {
  tableLoading.value = true
  try {
    // 获取概览数据
    const overviewResponse = await getCampaignOverview()
    if (overviewResponse.code === 200) {
      overview.value = overviewResponse.data
    }

    // 获取活动列表
    const params = {
      name: searchForm.name,
      status: searchForm.status,
      type: searchForm.type,
      startDate: searchForm.dateRange?.[0]?.format('YYYY-MM-DD'),
      endDate: searchForm.dateRange?.[1]?.format('YYYY-MM-DD'),
      page: pagination.current,
      pageSize: pagination.pageSize,
    }

    const response = await getCampaignList(params)
    if (response.code === 200) {
      campaignData.value = response.data.list
      pagination.total = response.data.total
    } else {
      message.error(response.message || '加载活动数据失败')
    }
  } catch (error) {
    console.error('加载活动数据失败:', error)
    message.error('加载活动数据失败')
  } finally {
    tableLoading.value = false
  }
}

/**
 * 渲染图表
 */
const renderCharts = (): void => {
    // 图表已通过HighChart组件渲染，无需手动更新
  }

/**
 * 搜索处理
 */
const handleSearch = (): void => {
  pagination.current = 1
  loadCampaignData()
}

/**
 * 重置搜索
 */
const resetSearch = (): void => {
  Object.assign(searchForm, {
    name: '',
    status: undefined,
    type: undefined,
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
  loadCampaignData()
}

/**
 * 处理页面大小变化
 */
const handlePageSizeChange = (size: number): void => {
  pageSize.value = size
  pagination.pageSize = size
  pagination.current = 1
  loadCampaignData()
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
  editingCampaign.value = null
  resetForm()
  modalVisible.value = true
}

/**
 * 编辑活动
 */
const editCampaign = (record: Campaign): void => {
  editingCampaign.value = record
  Object.assign(formData, {
    name: record.name,
    description: record.description,
    type: record.type,
    startTime: dayjs(record.startTime),
    endTime: dayjs(record.endTime),
    targetParticipants: record.targetParticipants,
    totalBudget: record.totalBudget,
    rules: record.rules,
  })
  modalVisible.value = true
}

/**
 * 查看详情
 */
const viewDetail = async (record: Campaign): Promise<void> => {
  try {
    const response = await getCampaignDetail(record.id)
    if (response.code === 200) {
      selectedCampaign.value = response.data
      detailModalVisible.value = true
    } else {
      message.error(response.message || '获取活动详情失败')
    }
  } catch (error) {
    console.error('获取活动详情失败:', error)
    message.error('获取活动详情失败')
  }
}

/**
 * 菜单点击处理
 */
const handleMenuClick = (key: string, record: Campaign): void => {
  switch (key) {
    case 'copy':
      copyCampaign(record)
      break
    case 'pause':
      pauseCampaign(record)
      break
    case 'resume':
      resumeCampaign(record)
      break
    case 'end':
      endCampaign(record)
      break
    case 'delete':
      deleteCampaignAction(record)
      break
  }
}

/**
 * 复制活动
 */
const copyCampaign = async (record: Campaign): Promise<void> => {
  try {
    const copyParams = {
      name: `${record.name} - 副本`,
      type: record.type as 'coupon' | 'points' | 'discount' | 'flash_sale' | 'group_buy' | 'lottery',
      description: record.description,
      cover: record.cover,
      startTime: record.startTime,
      endTime: record.endTime,
      budget: record.budget,
      targetProducts: record.targetProducts,
      targetAudience: record.targetAudience,
      rules: record.rules || {},
      targetParticipants: record.targetParticipants,
      totalBudget: record.totalBudget,
    }
    const response = await createCampaign(copyParams)
    if (response.code === 200) {
      message.success(`已复制活动: ${record.name}`)
      loadCampaignData()
    } else {
      message.error(response.message || '复制活动失败')
    }
  } catch (error) {
    console.error('复制活动失败:', error)
    message.error('复制活动失败')
  }
}

/**
 * 暂停活动
 */
const pauseCampaign = async (record: Campaign): Promise<void> => {
  try {
    const response = await toggleCampaign(record.id)
    if (response.code === 200) {
      message.success(`已暂停活动: ${record.name}`)
      loadCampaignData()
    } else {
      message.error(response.message || '暂停活动失败')
    }
  } catch (error) {
    console.error('暂停活动失败:', error)
    message.error('暂停活动失败')
  }
}

/**
 * 恢复活动
 */
const resumeCampaign = async (record: Campaign): Promise<void> => {
  try {
    const response = await toggleCampaign(record.id)
    if (response.code === 200) {
      message.success(`已恢复活动: ${record.name}`)
      loadCampaignData()
    } else {
      message.error(response.message || '恢复活动失败')
    }
  } catch (error) {
    console.error('恢复活动失败:', error)
    message.error('恢复活动失败')
  }
}

/**
 * 结束活动
 */
const endCampaign = async (record: Campaign): Promise<void> => {
  try {
    const response = await updateCampaign({ id: record.id, name: record.name })
    if (response.code === 200) {
      message.success(`已结束活动: ${record.name}`)
      loadCampaignData()
    } else {
      message.error(response.message || '结束活动失败')
    }
  } catch (error) {
    console.error('结束活动失败:', error)
    message.error('结束活动失败')
  }
}

/**
 * 删除活动
 */
const deleteCampaignAction = async (record: Campaign): Promise<void> => {
  try {
    const response = await deleteCampaign(record.id)
    if (response.code === 200) {
      message.success(`已删除活动: ${record.name}`)
      loadCampaignData()
    } else {
      message.error(response.message || '删除活动失败')
    }
  } catch (error) {
    console.error('删除活动失败:', error)
    message.error('删除活动失败')
  }
}

/**
 * 批量删除
 */
const batchDelete = async (): Promise<void> => {
  try {
    const deletePromises = selectedRowKeys.value.map(id => deleteCampaign(id))
    const responses = await Promise.all(deletePromises)
    
    const successCount = responses.filter(res => res.code === 200).length
    if (successCount === selectedRowKeys.value.length) {
      message.success(`已删除 ${successCount} 个活动`)
    } else {
      message.warning(`成功删除 ${successCount} 个活动，${selectedRowKeys.value.length - successCount} 个删除失败`)
    }
    
    selectedRowKeys.value = []
    loadCampaignData()
  } catch (error) {
    console.error('批量删除失败:', error)
    message.error('批量删除失败')
  }
}

/**
 * 提交表单
 */
const handleSubmit = async (): Promise<void> => {
  try {
    await formRef.value.validate()

    const params = {
      ...formData,
      type: formData.type as 'coupon' | 'points' | 'discount' | 'flash_sale' | 'group_buy' | 'lottery',
      startTime: formData.startTime?.format('YYYY-MM-DD HH:mm:ss') || '',
      endTime: formData.endTime?.format('YYYY-MM-DD HH:mm:ss') || '',
      rules: formData.rules ? JSON.parse(formData.rules) : {},
    }

    let response
    if (editingCampaign.value) {
      response = await updateCampaign({ ...params, id: editingCampaign.value.id })
    } else {
      response = await createCampaign(params)
    }

    if (response.code === 200) {
      const action = editingCampaign.value ? '更新' : '创建'
      message.success(`${action}活动成功`)
      modalVisible.value = false
      loadCampaignData()
    } else {
      message.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('提交表单失败:', error)
    message.error('提交表单失败')
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
    name: '',
    description: '',
    type: '',
    startTime: undefined,
    endTime: undefined,
    targetParticipants: undefined,
    totalBudget: undefined,
    rules: '',
  })
  fileList.value = []
  formRef.value?.resetFields()
}

/**
 * 上传前处理
 */
const beforeUpload = (file: File): boolean => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }

  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }

  return false // 阻止自动上传
}

/**
 * 预览图片
 */
const handlePreview = (file: UploadFile): void => {
  // 预览图片逻辑
  console.log('预览图片:', file)
}

/**
 * 刷新数据
 */
const refreshData = (): void => {
  loadCampaignData()
}

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  loadCampaignData()
})
</script>

<style scoped lang="less">
.campaign-view {
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

.search-section {
  margin-bottom: 24px;

  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
}

.table-section {
  .campaign-name {
    display: flex;
    align-items: center;

    .name {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .description {
      font-size: 12px;
      color: #8c8c8c;
    }
  }

  .participants-info,
  .conversion-info,
  .budget-info {
    .count,
    .rate,
    .used {
      font-weight: 600;
      margin-bottom: 2px;
    }

    .target,
    .total {
      font-size: 12px;
      color: #8c8c8c;
    }
  }
}

.campaign-detail {
  .rules-content {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 200px;
    overflow-y: auto;
  }

  .campaign-charts {
    .chart-container {
      height: 200px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .campaign-view {
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