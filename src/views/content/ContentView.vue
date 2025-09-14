<template>
  <div class="content-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">内容管理</h2>
        <p class="page-description">管理网站内容、文章、页面和媒体资源</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button type="primary" @click="showCreateModal">
            <PlusOutlined />
            新建内容
          </a-button>
          <a-button @click="refreshContent">
            <ReloadOutlined />
            刷新
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 内容统计概览 -->
    <div class="overview-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="总内容数"
              :value="overview.totalContent"
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
              title="已发布"
              :value="overview.publishedContent"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <CheckCircleOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="草稿"
              :value="overview.draftContent"
              :value-style="{ color: '#fa8c16' }"
            >
              <template #prefix>
                <EditOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="媒体文件"
              :value="overview.mediaFiles"
              :value-style="{ color: '#722ed1' }"
            >
              <template #prefix>
                <PictureOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 内容分类标签 -->
    <div class="category-section">
      <a-card title="内容分类">
        <a-space wrap>
          <a-tag
            v-for="category in categories"
            :key="category.id"
            :color="selectedCategory === category.id ? 'blue' : 'default'"
            :class="{ 'category-tag-active': selectedCategory === category.id }"
            @click="selectCategory(category.id)"
            style="cursor: pointer; margin-bottom: 8px"
          >
            <component :is="category.icon" style="margin-right: 4px" />
            {{ category.name }}
            <span class="category-count">({{ category.count }})</span>
          </a-tag>
        </a-space>
      </a-card>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <a-card>
        <a-form layout="inline" :model="searchForm">
          <a-form-item label="内容标题">
            <a-input
              v-model:value="searchForm.title"
              placeholder="请输入内容标题"
              allow-clear
              @change="handleSearch"
            />
          </a-form-item>
          <a-form-item label="内容类型">
            <a-select
              v-model:value="searchForm.type"
              placeholder="请选择内容类型"
              style="width: 150px"
              allow-clear
              @change="handleSearch"
            >
              <a-select-option value="article">文章</a-select-option>
              <a-select-option value="page">页面</a-select-option>
              <a-select-option value="banner">轮播图</a-select-option>
              <a-select-option value="notice">公告</a-select-option>
              <a-select-option value="help">帮助文档</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="发布状态">
            <a-select
              v-model:value="searchForm.status"
              placeholder="请选择状态"
              style="width: 120px"
              allow-clear
              @change="handleSearch"
            >
              <a-select-option value="draft">草稿</a-select-option>
              <a-select-option value="published">已发布</a-select-option>
              <a-select-option value="scheduled">定时发布</a-select-option>
              <a-select-option value="archived">已归档</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="创建时间">
            <a-range-picker v-model:value="searchForm.dateRange" @change="handleSearch" />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSearch">
                <SearchOutlined />
                搜索
              </a-button>
              <a-button @click="resetSearch"> 重置 </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>
    </div>

    <!-- 内容列表 -->
    <div class="table-section">
      <a-card>
        <template #title>
          <span>内容列表</span>
          <a-tag color="blue" style="margin-left: 8px"> 共 {{ pagination.total }} 条 </a-tag>
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
            <a-button @click="batchPublish">
              <GlobalOutlined />
              批量发布
            </a-button>
            <a-button @click="exportContent">
              <ExportOutlined />
              导出
            </a-button>
          </a-space>
        </template>

        <!-- 表格视图 -->
        <a-table
          v-if="viewMode === 'table'"
          :columns="columns"
          :data-source="contentList"
          :loading="loading"
          :pagination="pagination"
          :row-selection="rowSelection"
          @change="handleTableChange"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'title'">
              <div class="content-title">
                <a @click="viewContent(record)">{{ record.title }}</a>
                <div class="content-meta">
                  <a-tag v-if="record.isTop" color="red" size="small">置顶</a-tag>
                  <a-tag v-if="record.isHot" color="orange" size="small">热门</a-tag>
                  <a-tag v-if="record.isRecommend" color="green" size="small">推荐</a-tag>
                </div>
              </div>
            </template>

            <template v-else-if="column.key === 'type'">
              <a-tag :color="getTypeColor(record.type)">
                {{ getTypeName(record.type) }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'status'">
              <a-badge
                :status="getStatusBadge(record.status)"
                :text="getStatusText(record.status)"
              />
            </template>

            <template v-else-if="column.key === 'thumbnail'">
              <div class="thumbnail-wrapper">
                <a-image
                  v-if="record.thumbnail"
                  :src="record.thumbnail"
                  :width="60"
                  :height="40"
                  :preview="false"
                  style="object-fit: cover; border-radius: 4px"
                />
                <div v-else class="no-thumbnail">
                  <PictureOutlined />
                </div>
              </div>
            </template>

            <template v-else-if="column.key === 'views'">
              <span>{{ formatNumber(record.views) }}</span>
            </template>

            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small" @click="viewContent(record)"> 查看 </a-button>
                <a-button type="link" size="small" @click="editContent(record)"> 编辑 </a-button>
                <a-button
                  type="link"
                  size="small"
                  @click="publishContent(record)"
                  v-if="record.status === 'draft'"
                >
                  发布
                </a-button>
                <a-dropdown>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="duplicateContent(record)">
                        <CopyOutlined />
                        复制
                      </a-menu-item>
                      <a-menu-item @click="setContentTop(record)">
                        <VerticalAlignTopOutlined />
                        {{ record.isTop ? '取消置顶' : '设为置顶' }}
                      </a-menu-item>
                      <a-menu-item @click="setContentRecommend(record)">
                        <StarOutlined />
                        {{ record.isRecommend ? '取消推荐' : '设为推荐' }}
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item @click="archiveContent(record)" style="color: #faad14">
                        <InboxOutlined />
                        归档
                      </a-menu-item>
                      <a-menu-item @click="deleteContent(record)" style="color: #ff4d4f">
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
            <a-col :span="8" v-for="content in contentList" :key="content.id">
              <a-card class="content-card" hoverable>
                <template #cover>
                  <div class="card-cover">
                    <a-image
                      v-if="content.thumbnail"
                      :src="content.thumbnail"
                      :height="160"
                      :preview="false"
                      style="object-fit: cover"
                    />
                    <div v-else class="no-cover">
                      <PictureOutlined style="font-size: 48px; color: #d9d9d9" />
                    </div>

                    <div class="card-overlay">
                      <a-space>
                        <a-button type="primary" size="small" @click="viewContent(content)">
                          <EyeOutlined />
                        </a-button>
                        <a-button size="small" @click="editContent(content)">
                          <EditOutlined />
                        </a-button>
                      </a-space>
                    </div>
                  </div>
                </template>

                <template #title>
                  <div class="card-title">
                    <span class="title-text">{{ content.title }}</span>
                    <a-tag :color="getTypeColor(content.type)" size="small">
                      {{ getTypeName(content.type) }}
                    </a-tag>
                  </div>
                </template>

                <div class="card-content">
                  <p class="content-summary">{{ content.summary || '暂无摘要' }}</p>

                  <div class="content-tags">
                    <a-tag v-if="content.isTop" color="red" size="small">置顶</a-tag>
                    <a-tag v-if="content.isHot" color="orange" size="small">热门</a-tag>
                    <a-tag v-if="content.isRecommend" color="green" size="small">推荐</a-tag>
                  </div>

                  <div class="content-meta">
                    <div class="meta-item">
                      <span class="meta-label">状态:</span>
                      <a-badge
                        :status="getStatusBadge(content.status)"
                        :text="getStatusText(content.status)"
                      />
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">作者:</span>
                      <span>{{ content.author }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">浏览:</span>
                      <span>{{ formatNumber(content.views) }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">更新:</span>
                      <span>{{ content.updateTime }}</span>
                    </div>
                  </div>

                  <div class="card-actions">
                    <a-button
                      type="primary"
                      size="small"
                      @click="publishContent(content)"
                      v-if="content.status === 'draft'"
                    >
                      <GlobalOutlined />
                      发布
                    </a-button>
                    <a-button size="small" @click="editContent(content)"> 编辑内容 </a-button>
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

    <!-- 新建/编辑内容弹窗 -->
    <a-modal
      v-model:open="createModalVisible"
      :title="editingContent ? '编辑内容' : '新建内容'"
      width="1000px"
      @ok="handleCreateSubmit"
      @cancel="handleCreateCancel"
      ok-text="确定"
      cancel-text="取消"
    >
      <a-form ref="createFormRef" :model="createForm" :rules="createRules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="内容标题" name="title">
              <a-input v-model:value="createForm.title" placeholder="请输入内容标题" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="内容类型" name="type">
              <a-select v-model:value="createForm.type" placeholder="请选择内容类型">
                <a-select-option value="article">文章</a-select-option>
                <a-select-option value="page">页面</a-select-option>
                <a-select-option value="banner">轮播图</a-select-option>
                <a-select-option value="notice">公告</a-select-option>
                <a-select-option value="help">帮助文档</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="内容摘要">
          <a-textarea v-model:value="createForm.summary" placeholder="请输入内容摘要" :rows="3" />
        </a-form-item>

        <a-form-item label="缩略图">
          <a-upload
            v-model:file-list="createForm.thumbnailList"
            list-type="picture-card"
            :max-count="1"
            :before-upload="beforeUpload"
            @preview="handlePreview"
          >
            <div v-if="createForm.thumbnailList.length < 1">
              <PlusOutlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="内容正文" name="content">
          <a-textarea v-model:value="createForm.content" placeholder="请输入内容正文" :rows="10" />
        </a-form-item>

        <a-form-item label="SEO设置">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-input v-model:value="createForm.seoTitle" placeholder="SEO标题" />
            </a-col>
            <a-col :span="12">
              <a-input v-model:value="createForm.seoKeywords" placeholder="SEO关键词" />
            </a-col>
          </a-row>
          <a-textarea
            v-model:value="createForm.seoDescription"
            placeholder="SEO描述"
            :rows="2"
            style="margin-top: 8px"
          />
        </a-form-item>

        <a-form-item label="发布设置">
          <a-space direction="vertical" style="width: 100%">
            <a-checkbox v-model:checked="createForm.isTop"> 设为置顶 </a-checkbox>
            <a-checkbox v-model:checked="createForm.isRecommend"> 设为推荐 </a-checkbox>
            <a-checkbox v-model:checked="createForm.allowComment"> 允许评论 </a-checkbox>
            <a-checkbox v-model:checked="createForm.enableSchedule"> 定时发布 </a-checkbox>
          </a-space>
        </a-form-item>

        <a-form-item v-if="createForm.enableSchedule" label="发布时间">
          <a-date-picker
            v-model:value="createForm.publishTime"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 内容详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="内容详情"
      width="800px"
      :footer="null"
      ok-text="确定"
      cancel-text="取消"
    >
      <div v-if="currentContent" class="content-detail">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="标题" :span="2">
            {{ currentContent.title }}
          </a-descriptions-item>
          <a-descriptions-item label="类型">
            <a-tag :color="getTypeColor(currentContent.type)">
              {{ getTypeName(currentContent.type) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-badge
              :status="getStatusBadge(currentContent.status)"
              :text="getStatusText(currentContent.status)"
            />
          </a-descriptions-item>
          <a-descriptions-item label="作者">
            {{ currentContent.author }}
          </a-descriptions-item>
          <a-descriptions-item label="浏览量">
            {{ formatNumber(currentContent.views) }}
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            {{ currentContent.createTime }}
          </a-descriptions-item>
          <a-descriptions-item label="更新时间">
            {{ currentContent.updateTime }}
          </a-descriptions-item>
          <a-descriptions-item label="摘要" :span="2">
            {{ currentContent.summary || '暂无摘要' }}
          </a-descriptions-item>
          <a-descriptions-item label="内容" :span="2">
            <div class="content-preview">
              {{ currentContent.content || '暂无内容' }}
            </div>
          </a-descriptions-item>
        </a-descriptions>

        <div class="detail-actions">
          <a-space>
            <a-button type="primary" @click="editContent(currentContent)">
              <EditOutlined />
              编辑
            </a-button>
            <a-button @click="duplicateContent(currentContent)">
              <CopyOutlined />
              复制
            </a-button>
            <a-button
              @click="publishContent(currentContent)"
              v-if="currentContent.status === 'draft'"
            >
              <GlobalOutlined />
              发布
            </a-button>
          </a-space>
        </div>
      </div>
    </a-modal>

    <!-- 图片预览弹窗 -->
    <a-modal v-model:open="previewVisible" :footer="null" ok-text="确定" cancel-text="取消">
      <img alt="preview" style="width: 100%" :src="previewImage" />
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
  CheckCircleOutlined,
  EditOutlined,
  PictureOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  ExportOutlined,
  CopyOutlined,
  VerticalAlignTopOutlined,
  StarOutlined,
  InboxOutlined,
  DeleteOutlined,
  DownOutlined,
  EyeOutlined,
  BookOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  BankOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, TableProps, FormInstance, UploadFile } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import { type Dayjs } from 'dayjs'
import type { ContentOverview, Content, ContentCategory } from '@/mock/content'
import {
  getContentOverview,
  getContentList,
  getContentCategories,
  createContent,
  updateContent,
  deleteContent as apiDeleteContent,
  publishContent as apiPublishContent,
  archiveContent as apiArchiveContent,
  duplicateContent as apiDuplicateContent,
  setContentTop as apiSetContentTop,
  setContentRecommend as apiSetContentRecommend,
  exportContentList,
} from '@/api/content'

/**
 * 内容管理页面
 */

interface SearchForm {
  title: string
  type: string
  status: string
  dateRange: [Dayjs, Dayjs] | null
}

interface CreateForm {
  title: string
  type: string
  summary: string
  content: string
  thumbnailList: UploadFile[]
  seoTitle: string
  seoKeywords: string
  seoDescription: string
  isTop: boolean
  isRecommend: boolean
  allowComment: boolean
  enableSchedule: boolean
  publishTime: Dayjs | null
}

// 响应式数据
const loading = ref(false)
const viewMode = ref('table')
const createModalVisible = ref(false)
const detailModalVisible = ref(false)
const previewVisible = ref(false)
const previewImage = ref('')
const editingContent = ref<Content | null>(null)
const currentContent = ref<Content | null>(null)
const createFormRef = ref<FormInstance>()
const selectedCategory = ref('all')

// 概览数据
const overview = ref<ContentOverview>({
  totalContent: 0,
  publishedContent: 0,
  draftContent: 0,
  mediaFiles: 0,
})

// 分类数据
const categories = ref<ContentCategory[]>([
  { id: 'all', name: '全部', icon: FileTextOutlined, count: 0 },
  { id: 'article', name: '文章', icon: BookOutlined, count: 0 },
  { id: 'page', name: '页面', icon: BankOutlined, count: 0 },
  { id: 'banner', name: '轮播图', icon: PictureOutlined, count: 0 },
  { id: 'notice', name: '公告', icon: BellOutlined, count: 0 },
  { id: 'help', name: '帮助', icon: QuestionCircleOutlined, count: 0 },
])

// 搜索表单
const searchForm = reactive<SearchForm>({
  title: '',
  type: '',
  status: '',
  dateRange: null,
})

// 新建表单
const createForm = reactive<CreateForm>({
  title: '',
  type: '',
  summary: '',
  content: '',
  thumbnailList: [],
  seoTitle: '',
  seoKeywords: '',
  seoDescription: '',
  isTop: false,
  isRecommend: false,
  allowComment: true,
  enableSchedule: false,
  publishTime: null,
})

// 表单验证规则
const createRules = {
  title: [{ required: true, message: '请输入内容标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择内容类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容正文', trigger: 'blur' }],
}

// 内容列表
const contentList = ref<Content[]>([])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 行选择配置
const rowSelection = {
  type: 'checkbox',
  selectedRowKeys: ref<string[]>([]),
  onChange: (selectedRowKeys: string[]) => {
    rowSelection.selectedRowKeys.value = selectedRowKeys
  },
}

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '缩略图',
    key: 'thumbnail',
    width: 80,
  },
  {
    title: '标题',
    key: 'title',
    width: 250,
    fixed: 'left',
  },
  {
    title: '类型',
    key: 'type',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '作者',
    dataIndex: 'author',
    width: 100,
  },
  {
    title: '浏览量',
    key: 'views',
    width: 100,
    sorter: true,
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
    article: 'blue',
    page: 'green',
    banner: 'orange',
    notice: 'red',
    help: 'purple',
  }
  return colorMap[type] || 'default'
}

/**
 * 获取类型名称
 */
const getTypeName = (type: string): string => {
  const nameMap: Record<string, string> = {
    article: '文章',
    page: '页面',
    banner: '轮播图',
    notice: '公告',
    help: '帮助文档',
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
    scheduled: '定时发布',
    archived: '已归档',
  }
  return textMap[status] || status
}

/**
 * 格式化数字
 */
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

/**
 * 加载概览数据
 */
const loadOverviewData = async (): Promise<void> => {
  try {
    const [overviewRes, categoriesRes] = await Promise.all([
      getContentOverview(),
      getContentCategories(),
    ])

    if (overviewRes.code === 200) {
      overview.value = overviewRes.data
    }

    if (categoriesRes.code === 200) {
      // 添加全部分类
      const allCategory = {
        id: 'all',
        name: '全部',
        icon: FileTextOutlined,
        count: overviewRes.data?.totalContent || 0,
      }

      // 映射分类图标
      const iconMap: Record<string, any> = {
        article: BookOutlined,
        page: BankOutlined,
        banner: PictureOutlined,
        notice: BellOutlined,
        help: QuestionCircleOutlined,
      }

      const mappedCategories = categoriesRes.data.map((cat) => ({
        ...cat,
        icon: iconMap[cat.id] || FileTextOutlined,
      }))

      categories.value = [allCategory, ...mappedCategories]
    }
  } catch (error) {
    console.error('加载概览数据失败:', error)
    message.error('加载概览数据失败')
  }
}

/**
 * 加载内容列表
 */
const loadContentList = async (): Promise<void> => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      title: searchForm.title || undefined,
      type: searchForm.type || undefined,
      status: searchForm.status || undefined,
      startDate: searchForm.dateRange?.[0]?.format('YYYY-MM-DD') || undefined,
      endDate: searchForm.dateRange?.[1]?.format('YYYY-MM-DD') || undefined,
    }

    const response = await getContentList(params)

    if (response.code === 200) {
      contentList.value = response.data.list
      pagination.total = response.data.total
    } else {
      message.error(response.message || '加载内容列表失败')
    }
  } catch (error) {
    console.error('加载内容列表失败:', error)
    message.error('加载内容列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 选择分类
 */
const selectCategory = (categoryId: string): void => {
  selectedCategory.value = categoryId
  searchForm.type = categoryId === 'all' ? '' : categoryId
  handleSearch()
}

/**
 * 搜索处理
 */
const handleSearch = debounce((): void => {
  pagination.current = 1
  loadContentList()
}, 300)

/**
 * 重置搜索
 */
const resetSearch = (): void => {
  Object.assign(searchForm, {
    title: '',
    type: '',
    status: '',
    dateRange: null,
  })
  selectedCategory.value = 'all'
  handleSearch()
}

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
  loadContentList()
}

/**
 * 显示新建弹窗
 */
const showCreateModal = (): void => {
  editingContent.value = null
  Object.assign(createForm, {
    title: '',
    type: '',
    summary: '',
    content: '',
    thumbnailList: [],
    seoTitle: '',
    seoKeywords: '',
    seoDescription: '',
    isTop: false,
    isRecommend: false,
    allowComment: true,
    enableSchedule: false,
    publishTime: null,
  })
  createModalVisible.value = true
}

/**
 * 新建提交处理
 */
const handleCreateSubmit = async (): Promise<void> => {
  try {
    await createFormRef.value?.validate()

    const formData = {
      title: createForm.title,
      type: createForm.type,
      summary: createForm.summary,
      content: createForm.content,
      thumbnail: createForm.thumbnailList[0]?.url || '',
      seoTitle: createForm.seoTitle,
      seoKeywords: createForm.seoKeywords,
      seoDescription: createForm.seoDescription,
      isTop: createForm.isTop,
      isRecommend: createForm.isRecommend,
      allowComment: createForm.allowComment,
      publishTime: createForm.enableSchedule
        ? createForm.publishTime?.format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    }

    let response
    if (editingContent.value) {
      response = await updateContent(editingContent.value.id, formData)
    } else {
      response = await createContent(formData)
    }

    if (response.code === 200) {
      message.success(editingContent.value ? '内容更新成功' : '内容创建成功')
      createModalVisible.value = false
      loadContentList()
      loadOverviewData()
    } else {
      message.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
    message.error('请检查表单填写')
  }
}

/**
 * 新建取消处理
 */
const handleCreateCancel = (): void => {
  createModalVisible.value = false
  editingContent.value = null
}

/**
 * 上传前处理
 */
const beforeUpload = (file: File): boolean => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
  }
  return isJpgOrPng && isLt2M
}

/**
 * 图片预览处理
 */
const handlePreview = (file: UploadFile): void => {
  previewImage.value = file.url || file.thumbUrl || ''
  previewVisible.value = true
}

/**
 * 查看内容
 */
const viewContent = (content: Content): void => {
  currentContent.value = content
  detailModalVisible.value = true
}

/**
 * 编辑内容
 */
const editContent = (content: Content): void => {
  editingContent.value = content
  Object.assign(createForm, {
    title: content.title,
    type: content.type,
    summary: content.summary || '',
    content: content.content || '',
    thumbnailList: content.thumbnail
      ? [
          {
            uid: '-1',
            name: 'thumbnail.jpg',
            status: 'done',
            url: content.thumbnail,
          },
        ]
      : [],
    seoTitle: content.seoTitle || '',
    seoKeywords: content.seoKeywords || '',
    seoDescription: content.seoDescription || '',
    isTop: content.isTop,
    isRecommend: content.isRecommend,
    allowComment: content.allowComment,
    enableSchedule: false,
    publishTime: null,
  })
  createModalVisible.value = true
}

/**
 * 发布内容
 */
const publishContent = async (content: Content): Promise<void> => {
  try {
    const response = await apiPublishContent(content.id)

    if (response.code === 200) {
      message.success('内容发布成功')
      loadContentList()
      loadOverviewData()
    } else {
      message.error(response.message || '内容发布失败')
    }
  } catch (error) {
    console.error('发布内容失败:', error)
    message.error('内容发布失败')
  }
}

/**
 * 复制内容
 */
const duplicateContent = async (content: Content): Promise<void> => {
  try {
    const response = await apiDuplicateContent(content.id)

    if (response.code === 200) {
      message.success('内容复制成功')
      loadContentList()
      loadOverviewData()
    } else {
      message.error(response.message || '内容复制失败')
    }
  } catch (error) {
    console.error('复制内容失败:', error)
    message.error('内容复制失败')
  }
}

/**
 * 设置置顶
 */
const setContentTop = async (content: Content): Promise<void> => {
  try {
    const response = await apiSetContentTop(content.id, !content.isTop)

    if (response.code === 200) {
      message.success(content.isTop ? '取消置顶成功' : '设置置顶成功')
      loadContentList()
    } else {
      message.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('设置置顶失败:', error)
    message.error('操作失败')
  }
}

/**
 * 设置推荐
 */
const setContentRecommend = async (content: Content): Promise<void> => {
  try {
    const response = await apiSetContentRecommend(content.id, !content.isRecommend)

    if (response.code === 200) {
      message.success(content.isRecommend ? '取消推荐成功' : '设置推荐成功')
      loadContentList()
    } else {
      message.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('设置推荐失败:', error)
    message.error('操作失败')
  }
}

/**
 * 归档内容
 */
const archiveContent = async (content: Content): Promise<void> => {
  try {
    const response = await apiArchiveContent(content.id)

    if (response.code === 200) {
      message.success('内容归档成功')
      loadContentList()
      loadOverviewData()
    } else {
      message.error(response.message || '内容归档失败')
    }
  } catch (error) {
    console.error('归档内容失败:', error)
    message.error('内容归档失败')
  }
}

/**
 * 删除内容
 */
const deleteContent = async (content: Content): Promise<void> => {
  try {
    const response = await apiDeleteContent(content.id)

    if (response.code === 200) {
      message.success('内容删除成功')
      loadContentList()
      loadOverviewData()
    } else {
      message.error(response.message || '内容删除失败')
    }
  } catch (error) {
    console.error('删除内容失败:', error)
    message.error('内容删除失败')
  }
}

/**
 * 批量发布
 */
const batchPublish = async (): Promise<void> => {
  if (rowSelection.selectedRowKeys.value.length === 0) {
    message.warning('请选择要发布的内容')
    return
  }

  try {
    const promises = rowSelection.selectedRowKeys.value.map((id) => apiPublishContent(id))
    const responses = await Promise.all(promises)

    const successCount = responses.filter((res) => res.code === 200).length
    const failCount = responses.length - successCount

    if (failCount === 0) {
      message.success(`成功发布 ${successCount} 条内容`)
    } else {
      message.warning(`成功发布 ${successCount} 条内容，失败 ${failCount} 条`)
    }

    rowSelection.selectedRowKeys.value = []
    loadContentList()
    loadOverviewData()
  } catch (error) {
    console.error('批量发布失败:', error)
    message.error('批量发布失败')
  }
}

/**
 * 导出内容
 */
const exportContent = async (): Promise<void> => {
  try {
    const params = {
      title: searchForm.title || undefined,
      type: searchForm.type || undefined,
      status: searchForm.status || undefined,
      startDate: searchForm.dateRange?.[0]?.format('YYYY-MM-DD') || undefined,
      endDate: searchForm.dateRange?.[1]?.format('YYYY-MM-DD') || undefined,
    }

    const response = await exportContentList(params)

    if (response.code === 200) {
      // 创建下载链接
      const blob = new Blob([JSON.stringify(response.data)], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `内容列表_${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      message.success('导出成功')
    } else {
      message.error(response.message || '导出失败')
    }
  } catch (error) {
    console.error('导出内容失败:', error)
    message.error('导出失败')
  }
}

/**
 * 刷新内容
 */
const refreshContent = async (): Promise<void> => {
  try {
    await Promise.all([loadOverviewData(), loadContentList()])
    message.success('刷新成功')
  } catch (error) {
    console.error('刷新数据失败:', error)
    message.error('刷新失败')
  }
}

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  loadOverviewData()
  loadContentList()
})
</script>

<style scoped lang="less">
.content-view {
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

.category-section {
  margin-bottom: 24px;

  .category-tag-active {
    background-color: #1890ff !important;
    color: #fff !important;
  }

  .category-count {
    margin-left: 4px;
    font-size: 12px;
    opacity: 0.8;
  }
}

.search-section {
  margin-bottom: 24px;
}

.table-section {
  margin-bottom: 24px;

  .content-title {
    .content-meta {
      margin-top: 4px;
    }
  }

  .thumbnail-wrapper {
    .no-thumbnail {
      width: 60px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 4px;
      color: #d9d9d9;
    }
  }
}

.card-view {
  .content-card {
    .card-cover {
      position: relative;
      overflow: hidden;

      .no-cover {
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
      }

      .card-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover .card-overlay {
        opacity: 1;
      }
    }

    .card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title-text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 8px;
      }
    }

    .card-content {
      .content-summary {
        color: #8c8c8c;
        font-size: 12px;
        margin-bottom: 12px;
        min-height: 36px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .content-tags {
        margin-bottom: 12px;
        min-height: 22px;
      }

      .content-meta {
        margin-bottom: 16px;

        .meta-item {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          font-size: 12px;

          .meta-label {
            color: #8c8c8c;
            margin-right: 8px;
            min-width: 40px;
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

.content-detail {
  .content-preview {
    max-height: 200px;
    overflow-y: auto;
    padding: 8px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.5;
  }

  .detail-actions {
    margin-top: 24px;
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .content-view {
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
