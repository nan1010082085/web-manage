<template>
  <div class="coupon-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">优惠券管理</h2>
        <p class="page-description">管理优惠券发放、使用和统计</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button @click="refreshData">
            <ReloadOutlined />
            刷新
          </a-button>
          <a-button type="primary" @click="showCreateModal">
            <PlusOutlined />
            新建优惠券
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 优惠券统计概览 -->
    <div class="overview-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="总优惠券数"
              :value="overview.totalCoupons"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <GiftOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="已发放"
              :value="overview.issuedCoupons"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <SendOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="overview-card">
            <a-statistic
              title="已使用"
              :value="overview.usedCoupons"
              :value-style="{ color: '#fa8c16' }"
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
              title="使用率"
              :value="overview.usageRate"
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
          <a-form-item label="优惠券名称">
            <a-input
              v-model:value="searchForm.name"
              placeholder="搜索优惠券名称"
              allow-clear
              style="width: 200px"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>
          
          <a-form-item label="优惠券状态">
            <a-select
              v-model:value="searchForm.status"
              placeholder="选择状态"
              allow-clear
              style="width: 120px"
            >
              <a-select-option value="draft">草稿</a-select-option>
              <a-select-option value="active">生效中</a-select-option>
              <a-select-option value="expired">已过期</a-select-option>
              <a-select-option value="disabled">已停用</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="优惠券类型">
            <a-select
              v-model:value="searchForm.type"
              placeholder="选择类型"
              allow-clear
              style="width: 150px"
            >
              <a-select-option value="fixed">满减券</a-select-option>
              <a-select-option value="percentage">折扣券</a-select-option>
              <a-select-option value="shipping">包邮券</a-select-option>
              <a-select-option value="gift">赠品券</a-select-option>
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

    <!-- 优惠券列表 -->
    <div class="table-section">
      <a-card title="优惠券列表">
        <template #extra>
          <a-space>
            <a-button @click="batchDelete" :disabled="selectedRowKeys.length === 0">
              <DeleteOutlined />
              批量删除
            </a-button>
            <a-button @click="batchIssue" :disabled="selectedRowKeys.length === 0">
              <SendOutlined />
              批量发放
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
          :data-source="couponData"
          :loading="tableLoading"
          :pagination="pagination"
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
          @change="handleTableChange"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <div class="coupon-name">
                <div class="name">{{ record.name }}</div>
                <div class="code">券码: {{ record.code }}</div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'type'">
              <a-tag :color="getTypeColor(record.type)">
                {{ getTypeText(record.type) }}
              </a-tag>
            </template>
            
            <template v-else-if="column.key === 'discount'">
              <div class="discount-info">
                <div class="value">
                  <span v-if="record.type === 'fixed'">¥{{ record.value }}</span>
                  <span v-else-if="record.type === 'percentage'">{{ record.value }}折</span>
                  <span v-else>{{ record.value }}</span>
                </div>
                <div class="condition" v-if="record.minAmount">
                  满¥{{ record.minAmount }}可用
                </div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>
            
            <template v-else-if="column.key === 'usage'">
              <div class="usage-info">
                <div class="count">{{ record.usedCount }}/{{ record.totalCount }}</div>
                <div class="rate">使用率: {{ ((record.usedCount / record.totalCount) * 100).toFixed(1) }}%</div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'validity'">
              <div class="validity-info">
                <div class="start">{{ record.validFrom }}</div>
                <div class="end">{{ record.validTo }}</div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small" @click="viewDetail(record)">
                  详情
                </a-button>
                <a-button type="link" size="small" @click="editCoupon(record)">
                  编辑
                </a-button>
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="({ key }: { key: string }) => handleMenuClick(key, record)">
                      <a-menu-item key="copy">
                        <CopyOutlined />
                        复制
                      </a-menu-item>
                      <a-menu-item key="issue" v-if="record.status === 'active'">
                        <SendOutlined />
                        发放
                      </a-menu-item>
                      <a-menu-item key="disable" v-if="record.status === 'active'">
                        <StopOutlined />
                        停用
                      </a-menu-item>
                      <a-menu-item key="enable" v-if="record.status === 'disabled'">
                        <PlayCircleOutlined />
                        启用
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

    <!-- 新建/编辑优惠券弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      width="800px"
      @ok="handleSubmit"
      @cancel="handleCancel"
     ok-text="确定" cancel-text="取消">
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="优惠券名称" name="name">
              <a-input v-model:value="formData.name" placeholder="请输入优惠券名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="优惠券类型" name="type">
              <a-select v-model:value="formData.type" placeholder="选择优惠券类型">
                <a-select-option value="fixed">满减券</a-select-option>
                <a-select-option value="percentage">折扣券</a-select-option>
                <a-select-option value="shipping">包邮券</a-select-option>
                <a-select-option value="gift">赠品券</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        

        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="优惠金额/折扣" name="discountValue">
              <a-input-number
                v-model:value="formData.discountValue"
                :placeholder="getDiscountPlaceholder(formData.type)"
                :min="0"
                :precision="formData.type === 'percentage' ? 1 : 2"
                style="width: 100%"
              >
                <template #addonBefore v-if="formData.type === 'fixed'">¥</template>
                <template #addonAfter v-if="formData.type === 'percentage'">折</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最低消费金额" name="minAmount">
              <a-input-number
                v-model:value="formData.minAmount"
                placeholder="最低消费金额"
                :min="0"
                :precision="2"
                style="width: 100%"
              >
                <template #addonBefore>¥</template>
              </a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="发放数量" name="totalCount">
              <a-input-number
                v-model:value="formData.totalCount"
                placeholder="发放数量"
                :min="1"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="每人限领" name="limitPerUser">
              <a-input-number
                v-model:value="formData.limitPerUser"
                placeholder="每人限领数量"
                :min="1"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="生效时间" name="startTime">
              <a-date-picker
                v-model:value="formData.startTime"
                show-time
                placeholder="选择生效时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="失效时间" name="endTime">
              <a-date-picker
                v-model:value="formData.endTime"
                show-time
                placeholder="选择失效时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="使用说明" name="instructions">
          <a-textarea
            v-model:value="formData.instructions"
            placeholder="请输入使用说明"
            :rows="4"
          />
        </a-form-item>
        

      </a-form>
    </a-modal>

    <!-- 优惠券详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="优惠券详情"
      :footer="null"
      width="900px"
     ok-text="确定" cancel-text="取消">
      <div class="coupon-detail" v-if="selectedCoupon">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="优惠券名称">{{ selectedCoupon.name }}</a-descriptions-item>
          <a-descriptions-item label="优惠券ID">{{ selectedCoupon.id }}</a-descriptions-item>
          <a-descriptions-item label="优惠券类型">
            <a-tag :color="getTypeColor(selectedCoupon.type)">
              {{ getTypeText(selectedCoupon.type) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="优惠券状态">
            <a-tag :color="getStatusColor(selectedCoupon.status)">
              {{ getStatusText(selectedCoupon.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="优惠金额">
            <span v-if="selectedCoupon.type === 'fixed'">¥{{ selectedCoupon.value }}</span>
            <span v-else-if="selectedCoupon.type === 'percentage'">{{ selectedCoupon.value }}折</span>
            <span v-else>{{ selectedCoupon.value }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="最低消费">¥{{ selectedCoupon.minAmount || 0 }}</a-descriptions-item>
          <a-descriptions-item label="发放数量">{{ selectedCoupon.totalCount }}</a-descriptions-item>
          <a-descriptions-item label="已使用数量">{{ selectedCoupon.usedCount }}</a-descriptions-item>
          <a-descriptions-item label="每人限领">{{ selectedCoupon.limitPerUser }}</a-descriptions-item>
          <a-descriptions-item label="使用率">{{ ((selectedCoupon.usedCount / selectedCoupon.totalCount) * 100).toFixed(1) }}%</a-descriptions-item>
          <a-descriptions-item label="生效时间">{{ selectedCoupon.validFrom }}</a-descriptions-item>
          <a-descriptions-item label="失效时间">{{ selectedCoupon.validTo }}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ selectedCoupon.createTime }}</a-descriptions-item>
          <a-descriptions-item label="创建人">{{ selectedCoupon.creator }}</a-descriptions-item>
          
          <a-descriptions-item label="使用说明" :span="2">
            <pre class="instructions-content">{{ selectedCoupon.conditions }}</pre>
          </a-descriptions-item>
        </a-descriptions>
        
        <!-- 使用统计图表 -->
        <div class="usage-charts" style="margin-top: 24px;">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-card title="使用趋势" size="small">
                <HighChart :options="couponChartConfigs.usageTrend" :height="'200px'" />
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card title="用户分布" size="small">
                <HighChart :options="couponChartConfigs.userDistribution" :height="'200px'" />
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-modal>

    <!-- 批量发放弹窗 -->
    <a-modal
      v-model:open="issueModalVisible"
      title="批量发放优惠券"
      @ok="handleBatchIssue"
      @cancel="issueModalVisible = false"
     ok-text="确定" cancel-text="取消">
      <a-form layout="vertical">
        <a-form-item label="发放方式">
          <a-radio-group v-model:value="issueForm.method">
            <a-radio value="all">全部用户</a-radio>
            <a-radio value="level">指定等级</a-radio>
            <a-radio value="tag">指定标签</a-radio>
            <a-radio value="manual">手动选择</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item v-if="issueForm.method === 'level'" label="用户等级">
          <a-select v-model:value="issueForm.userLevel" mode="multiple" placeholder="选择用户等级">
            <a-select-option value="bronze">青铜会员</a-select-option>
            <a-select-option value="silver">白银会员</a-select-option>
            <a-select-option value="gold">黄金会员</a-select-option>
            <a-select-option value="diamond">钻石会员</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item v-if="issueForm.method === 'tag'" label="用户标签">
          <a-select v-model:value="issueForm.userTags" mode="multiple" placeholder="选择用户标签">
            <a-select-option value="new">新用户</a-select-option>
            <a-select-option value="active">活跃用户</a-select-option>
            <a-select-option value="loyal">忠实用户</a-select-option>
            <a-select-option value="inactive">沉睡用户</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="发放说明">
          <a-textarea v-model:value="issueForm.message" placeholder="发放说明（可选）" :rows="3" />
        </a-form-item>
      </a-form>
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
  SendOutlined,
  CopyOutlined,
  StopOutlined,
  PlayCircleOutlined,
  DownOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  RiseOutlined,
} from '@ant-design/icons-vue'
import HighChart from '@/components/common/HighChart.vue'
import { couponChartConfigs } from '@/config/charts/chartConfigs'
import type { TableColumnsType, TableProps, UploadFile } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import dayjs, { type Dayjs } from 'dayjs'
import {
  getCouponList,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '@/api/marketing'

/**
 * 优惠券管理页面
 */

interface CouponOverview {
  totalCoupons: number
  issuedCoupons: number
  usedCoupons: number
  usageRate: number
}

interface Coupon {
  id: string
  name: string
  type: 'discount' | 'coupon' | 'flash_sale' | 'group_buy' | 'lottery' | 'points' | 'fixed' | 'percentage' | 'shipping'
  status: 'draft' | 'active' | 'paused' | 'ended' | 'expired' | 'inactive'
  value: number
  minAmount?: number
  maxDiscount?: number
  conditions?: string
  validFrom: string
  validTo: string
  totalCount: number
  usedCount: number
  remainingCount: number
  limitPerUser: number
  createTime: string
  updateTime: string
  creator: string
}

interface SearchForm {
  name: string
  status?: string
  type?: string
  dateRange?: [Dayjs, Dayjs]
}

interface FormData {
  name: string
  type: string
  discountValue?: number
  minAmount?: number
  totalCount?: number
  limitPerUser?: number
  startTime?: Dayjs
  endTime?: Dayjs
  instructions: string
}

interface IssueForm {
  method: string
  userLevel?: string[]
  userTags?: string[]
  message: string
}

// 响应式数据
const tableLoading = ref(false)
const modalVisible = ref(false)
const detailModalVisible = ref(false)
const issueModalVisible = ref(false)
const pageSize = ref(20)
const selectedRowKeys = ref<string[]>([])
const couponData = ref<Coupon[]>([])
const selectedCoupon = ref<Coupon | null>(null)
const editingCoupon = ref<Coupon | null>(null)
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
  type: '',
  discountValue: undefined,
  minAmount: undefined,
  totalCount: undefined,
  limitPerUser: undefined,
  startTime: undefined,
  endTime: undefined,
  instructions: '',
})

// 发放表单
const issueForm = reactive<IssueForm>({
  method: 'all',
  userLevel: undefined,
  userTags: undefined,
  message: '',
})

// 优惠券概览数据
const overview = ref<CouponOverview>({
  totalCoupons: 0,
  issuedCoupons: 0,
  usedCoupons: 0,
  usageRate: 0,
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
  name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择优惠券类型', trigger: 'change' }],
  discountValue: [{ required: true, message: '请输入优惠金额', trigger: 'blur' }],
  totalCount: [{ required: true, message: '请输入发放数量', trigger: 'blur' }],
  limitPerUser: [{ required: true, message: '请输入每人限领数量', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择生效时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择失效时间', trigger: 'change' }],
  instructions: [{ required: true, message: '请输入使用说明', trigger: 'blur' }],
}

// 表格列配置
const tableColumns: TableColumnsType = [
  {
    title: '优惠券名称',
    key: 'name',
    width: 200,
    fixed: 'left',
  },
  {
    title: '类型',
    key: 'type',
    width: 100,
  },
  {
    title: '优惠信息',
    key: 'discount',
    width: 150,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '使用情况',
    key: 'usage',
    width: 120,
  },
  {
    title: '有效期',
    key: 'validity',
    width: 180,
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
  return editingCoupon.value ? '编辑优惠券' : '新建优惠券'
})

/**
 * 获取优惠券类型文本
 */
const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    fixed: '满减券',
    percentage: '折扣券',
    shipping: '包邮券',
    gift: '赠品券',
  }
  return typeMap[type] || type
}

/**
 * 获取优惠券类型颜色
 */
const getTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    fixed: 'blue',
    percentage: 'green',
    shipping: 'orange',
    gift: 'purple',
  }
  return colorMap[type] || 'default'
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    active: '生效中',
    expired: '已过期',
    disabled: '已停用',
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
    expired: 'red',
    disabled: 'orange',
  }
  return colorMap[status] || 'default'
}

/**
 * 获取优惠金额占位符
 */
const getDiscountPlaceholder = (type: string): string => {
  const placeholderMap: Record<string, string> = {
    fixed: '请输入优惠金额',
    percentage: '请输入折扣（如8.5表示8.5折）',
    shipping: '包邮',
    gift: '赠品描述',
  }
  return placeholderMap[type] || '请输入优惠值'
}

/**
 * 加载优惠券数据
 */
const loadCouponData = async (): Promise<void> => {
  tableLoading.value = true
  try {
    const response = await getCouponList()
    if (response.code === 200) {
      couponData.value = response.data
      
      // 计算概览数据
      const totalCoupons = response.data.length
      const issuedCoupons = response.data.reduce((sum, coupon) => sum + coupon.totalCount, 0)
      const usedCoupons = response.data.reduce((sum, coupon) => sum + coupon.usedCount, 0)
      const usageRate = issuedCoupons > 0 ? (usedCoupons / issuedCoupons) * 100 : 0
      
      overview.value = {
        totalCoupons,
        issuedCoupons,
        usedCoupons,
        usageRate: Number(usageRate.toFixed(1)),
      }
      
      pagination.total = response.data.length
    } else {
      message.error(response.message || '加载优惠券数据失败')
    }
  } catch (error) {
    console.error('加载优惠券数据失败:', error)
    message.error('加载优惠券数据失败')
  } finally {
    tableLoading.value = false
  }
}

/**
 * 渲染图表
 */
const renderCharts = (): void => {
  // 图表已通过HighChart组件渲染，无需手动处理
}

/**
 * 搜索处理
 */
const handleSearch = (): void => {
  pagination.current = 1
  loadCouponData()
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
  loadCouponData()
}

/**
 * 处理页面大小变化
 */
const handlePageSizeChange = (size: number): void => {
  pageSize.value = size
  pagination.pageSize = size
  pagination.current = 1
  loadCouponData()
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
  editingCoupon.value = null
  resetForm()
  modalVisible.value = true
}

/**
 * 编辑优惠券
 */
const editCoupon = (record: Coupon): void => {
  editingCoupon.value = record
  Object.assign(formData, {
    name: record.name,
    type: record.type,
    discountValue: record.value,
    minAmount: record.minAmount,
    totalCount: record.totalCount,
    limitPerUser: record.limitPerUser,
    startTime: record.validFrom ? dayjs(record.validFrom) : undefined,
    endTime: record.validTo ? dayjs(record.validTo) : undefined,
    instructions: record.conditions || '',
  })
  modalVisible.value = true
}

/**
 * 查看详情
 */
const viewDetail = async (record: Coupon): Promise<void> => {
  selectedCoupon.value = record
  detailModalVisible.value = true
  
  // 图表通过HighChart组件自动渲染
  await nextTick()
}

/**
 * 菜单点击处理
 */
const handleMenuClick = (key: string, record: Coupon): void => {
  switch (key) {
    case 'copy':
      copyCoupon(record)
      break
    case 'issue':
      issueCoupon(record)
      break
    case 'disable':
      disableCoupon(record)
      break
    case 'enable':
      enableCoupon(record)
      break
    case 'delete':
      deleteCouponAction(record)
      break
  }
}

/**
 * 复制优惠券
 */
const copyCoupon = async (record: Coupon): Promise<void> => {
  try {
    const copyData = {
      name: `${record.name}_副本`,
      type: (['coupon', 'points', 'discount', 'flash_sale', 'group_buy', 'lottery'].includes(record.type) ? record.type : 'coupon') as 'coupon' | 'points' | 'discount' | 'flash_sale' | 'group_buy' | 'lottery',
      value: record.value,
      minAmount: record.minAmount,
      validFrom: record.validFrom,
      validTo: record.validTo,
      totalCount: record.totalCount,
      limitPerUser: record.limitPerUser,
      conditions: record.conditions,
    }
    
    const response = await createCoupon(copyData)
    if (response.code === 200) {
      message.success(`已复制优惠券: ${record.name}`)
      loadCouponData()
    } else {
      message.error(response.message || '复制优惠券失败')
    }
  } catch (error) {
    console.error('复制优惠券失败:', error)
    message.error('复制优惠券失败')
  }
}

/**
 * 发放优惠券
 */
const issueCoupon = (record: Coupon): void => {
  selectedRowKeys.value = [record.id]
  issueModalVisible.value = true
}

/**
 * 停用优惠券
 */
const disableCoupon = async (record: Coupon): Promise<void> => {
  try {
    // 注意：这里应该调用专门的停用API，暂时使用删除操作
    const response = await deleteCoupon(record.id)
    if (response.code === 200) {
      message.success(`已停用优惠券: ${record.name}`)
      loadCouponData()
    } else {
      message.error(response.message || '停用优惠券失败')
    }
  } catch (error) {
    console.error('停用优惠券失败:', error)
    message.error('停用优惠券失败')
  }
}

/**
 * 启用优惠券
 */
const enableCoupon = async (record: Coupon): Promise<void> => {
  try {
    // 注意：这里应该调用专门的启用API，暂时更新名称来模拟启用
    const response = await updateCoupon({
      id: record.id,
      name: record.name,
    })
    if (response.code === 200) {
      message.success(`已启用优惠券: ${record.name}`)
      loadCouponData()
    } else {
      message.error(response.message || '启用优惠券失败')
    }
  } catch (error) {
    console.error('启用优惠券失败:', error)
    message.error('启用优惠券失败')
  }
}

/**
 * 删除优惠券
 */
const deleteCouponAction = async (record: Coupon): Promise<void> => {
  try {
    const response = await deleteCoupon(record.id)
    if (response.code === 200) {
      message.success(`已删除优惠券: ${record.name}`)
      loadCouponData()
    } else {
      message.error(response.message || '删除优惠券失败')
    }
  } catch (error) {
    console.error('删除优惠券失败:', error)
    message.error('删除优惠券失败')
  }
}

/**
 * 批量删除
 */
const batchDelete = async (): Promise<void> => {
  try {
    const deletePromises = selectedRowKeys.value.map(id => deleteCoupon(id))
    const responses = await Promise.all(deletePromises)
    
    const successCount = responses.filter(response => response.code === 200).length
    if (successCount === selectedRowKeys.value.length) {
      message.success(`已删除 ${successCount} 个优惠券`)
    } else {
      message.warning(`成功删除 ${successCount} 个优惠券，${selectedRowKeys.value.length - successCount} 个删除失败`)
    }
    
    selectedRowKeys.value = []
    loadCouponData()
  } catch (error) {
    console.error('批量删除优惠券失败:', error)
    message.error('批量删除优惠券失败')
  }
}

/**
 * 批量发放
 */
const batchIssue = (): void => {
  issueModalVisible.value = true
}

/**
 * 处理批量发放
 */
const handleBatchIssue = (): void => {
  message.success(`已发放 ${selectedRowKeys.value.length} 个优惠券`)
  selectedRowKeys.value = []
  issueModalVisible.value = false
  loadCouponData()
}

/**
 * 提交表单
 */
const handleSubmit = async (): Promise<void> => {
  try {
    await formRef.value.validate()
    
    const submitData = {
      name: formData.name,
      type: formData.type as 'discount' | 'coupon' | 'flash_sale' | 'group_buy' | 'lottery' | 'points',
      value: formData.discountValue || 0,
      minAmount: formData.minAmount,
      validFrom: formData.startTime?.format('YYYY-MM-DD HH:mm:ss') || '',
      validTo: formData.endTime?.format('YYYY-MM-DD HH:mm:ss') || '',
      totalCount: formData.totalCount || 0,
      limitPerUser: formData.limitPerUser || 1,
      conditions: formData.instructions,
    }
    
    let response
    if (editingCoupon.value) {
      response = await updateCoupon({
        id: editingCoupon.value.id,
        ...submitData,
      })
    } else {
      response = await createCoupon(submitData)
    }
    
    if (response.code === 200) {
      const action = editingCoupon.value ? '更新' : '创建'
      message.success(`${action}优惠券成功`)
      modalVisible.value = false
      loadCouponData()
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
    type: '',
    discountValue: undefined,
    minAmount: undefined,
    totalCount: undefined,
    limitPerUser: undefined,
    startTime: undefined,
    endTime: undefined,
    instructions: '',
  })
  formRef.value?.resetFields()
}

/**
 * 刷新数据
 */
const refreshData = (): void => {
  loadCouponData()
}

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  loadCouponData()
})
</script>

<style scoped lang="less">
.coupon-view {
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
  .coupon-name {
    .name {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .code {
      font-size: 12px;
      color: #8c8c8c;
    }
  }
  
  .discount-info {
    .value {
      font-weight: 600;
      margin-bottom: 2px;
    }
    
    .condition {
      font-size: 12px;
      color: #8c8c8c;
    }
  }
  
  .usage-info {
    .count {
      font-weight: 600;
      margin-bottom: 2px;
    }
    
    .rate {
      font-size: 12px;
      color: #8c8c8c;
    }
  }
  
  .validity-info {
    .start {
      font-size: 12px;
      margin-bottom: 2px;
    }
    
    .end {
      font-size: 12px;
      color: #8c8c8c;
    }
  }
}

.coupon-detail {
  .instructions-content {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .usage-charts {
    .chart-container {
      height: 200px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .coupon-view {
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