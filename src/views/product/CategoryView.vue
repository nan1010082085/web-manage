<template>
  <div class="category-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">商品分类管理</h2>
        <p class="page-description">管理商品分类层级结构，支持无限级分类</p>
      </div>
      <div class="header-actions">
        <a-button type="primary" @click="showAddModal = true">
          <PlusOutlined />
          新建分类
        </a-button>
        <a-button @click="expandAll">
          <ExpandAltOutlined />
          展开全部
        </a-button>
        <a-button @click="collapseAll">
          <ShrinkOutlined />
          收起全部
        </a-button>
      </div>
    </div>

    <!-- 搜索筛选 -->
    <div class="search-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-input
            v-model:value="searchForm.name"
            placeholder="分类名称"
            allow-clear
            @change="handleSearch"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </a-col>
        <a-col :span="6">
          <a-select
            v-model:value="searchForm.status"
            placeholder="状态"
            allow-clear
            @change="handleSearch"
          >
            <a-select-option value="1">启用</a-select-option>
            <a-select-option value="0">禁用</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-select
            v-model:value="searchForm.level"
            placeholder="分类级别"
            allow-clear
            @change="handleSearch"
          >
            <a-select-option value="1">一级分类</a-select-option>
            <a-select-option value="2">二级分类</a-select-option>
            <a-select-option value="3">三级分类</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-button type="primary" @click="handleSearch">
            <SearchOutlined />
            搜索
          </a-button>
          <a-button @click="resetSearch" style="margin-left: 8px"> 重置 </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 分类树表格 -->
    <div class="table-section">
      <a-table
        :columns="columns"
        :data-source="categoryData"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1200 }"
        :expanded-row-keys="expandedKeys"
        @expand="handleExpand"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="category-name">
              <a-avatar
                v-if="record.icon"
                :src="record.icon"
                size="small"
                style="margin-right: 8px"
              />
              <FolderOutlined v-else style="margin-right: 8px; color: #faad14" />
              <span>{{ record.name }}</span>
              <a-tag v-if="record.isHot" color="red" size="small" style="margin-left: 8px">
                热门
              </a-tag>
            </div>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checked-value="1"
              :un-checked-value="0"
              @change="handleStatusChange(record)"
            />
          </template>

          <template v-else-if="column.key === 'sort'">
            <a-input-number
              v-model:value="record.sort"
              :min="0"
              :max="9999"
              size="small"
              @change="handleSortChange(record)"
            />
          </template>

          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)"> 编辑 </a-button>
              <a-button type="link" size="small" @click="handleAddChild(record)">
                添加子分类
              </a-button>
              <a-popconfirm title="确定要删除这个分类吗？" @confirm="handleDelete(record)">
                <a-button type="link" size="small" danger> 删除 </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新建/编辑分类弹窗 -->
    <a-modal
      v-model:open="showAddModal"
      :title="editingCategory ? '编辑分类' : '新建分类'"
      width="600px"
      @ok="handleSubmit"
      @cancel="handleCancel"
      ok-text="确定"
      cancel-text="取消"
    >
      <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="分类名称" name="name">
              <a-input v-model:value="formData.name" placeholder="请输入分类名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="分类编码" name="code">
              <a-input v-model:value="formData.code" placeholder="请输入分类编码" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="上级分类" name="parentId">
              <a-tree-select
                v-model:value="formData.parentId"
                :tree-data="categoryTreeData"
                :field-names="{ label: 'name', value: 'id', children: 'children' }"
                placeholder="请选择上级分类"
                allow-clear
                tree-default-expand-all
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排序" name="sort">
              <a-input-number
                v-model:value="formData.sort"
                :min="0"
                :max="9999"
                placeholder="排序值"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="分类图标" name="icon">
          <div class="icon-upload">
            <a-upload
              v-model:file-list="iconFileList"
              :before-upload="beforeUpload"
              :custom-request="handleIconUpload"
              list-type="picture-card"
              :max-count="1"
            >
              <div v-if="!formData.icon">
                <PlusOutlined />
                <div style="margin-top: 8px">上传图标</div>
              </div>
            </a-upload>
          </div>
        </a-form-item>

        <a-form-item label="分类描述" name="description">
          <a-textarea v-model:value="formData.description" :rows="3" placeholder="请输入分类描述" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="状态" name="status">
              <a-switch
                v-model:checked="formData.status"
                :checked-value="1"
                :un-checked-value="0"
                checked-children="启用"
                un-checked-children="禁用"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="热门分类" name="isHot">
              <a-switch
                v-model:checked="formData.isHot"
                checked-children="是"
                un-checked-children="否"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="显示在首页" name="showInHome">
              <a-switch
                v-model:checked="formData.showInHome"
                checked-children="是"
                un-checked-children="否"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  ExpandAltOutlined,
  ShrinkOutlined,
  FolderOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, FormInstance, UploadFile } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import {
  getProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  type ProductCategory,
} from '@/api/product'

// 创建防抖搜索函数
const createDebouncedSearch = <T extends (...args: any[]) => any>(
  searchFn: T,
  delay = 300,
): any => {
  return debounce(searchFn, delay)
}

/**
 * 商品分类管理页面
 */

// 使用ProductCategory类型别名
type Category = ProductCategory

interface SearchForm {
  name: string
  status?: number
  level?: number
}

interface CategoryForm {
  name: string
  code: string
  parentId?: string
  sort: number
  icon?: string
  description?: string
  status: number
  isHot: boolean
  showInHome: boolean
}

// 响应式数据
const loading = ref(false)
const showAddModal = ref(false)
const editingCategory = ref<Category | null>(null)
const expandedKeys = ref<string[]>([])
const categoryData = ref<Category[]>([])
const iconFileList = ref<UploadFile[]>([])
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive<SearchForm>({
  name: '',
  status: undefined,
  level: undefined,
})

// 表单数据
const formData = reactive<CategoryForm>({
  name: '',
  code: '',
  parentId: undefined,
  sort: 0,
  icon: '',
  description: '',
  status: 1,
  isHot: false,
  showInHome: false,
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '分类名称长度在2-50个字符', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: '编码只能包含字母、数字、下划线和横线',
      trigger: 'blur',
    },
  ],
  sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
}

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '分类名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    fixed: 'left',
  },
  {
    title: '分类编码',
    dataIndex: 'code',
    key: 'code',
    width: 120,
  },
  {
    title: '级别',
    dataIndex: 'level',
    key: 'level',
    width: 80,
    customRender: ({ text }) => `${text}级`,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 100,
  },
  {
    title: '商品数量',
    dataIndex: 'productCount',
    key: 'productCount',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
]

// 计算属性
const categoryTreeData = computed(() => {
  return buildTreeData(categoryData.value)
})

/**
 * 构建树形数据
 */
const buildTreeData = (data: Category[]): Category[] => {
  const result: Category[] = []
  const map = new Map<string, Category>()

  // 创建映射
  data.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })

  // 构建树形结构
  data.forEach((item) => {
    const node = map.get(item.id)!
    if (item.parentId && map.has(item.parentId)) {
      const parent = map.get(item.parentId)!
      if (!parent.children) parent.children = []
      parent.children.push(node)
    } else {
      result.push(node)
    }
  })

  return result
}

/**
 * 加载分类数据
 */
const loadCategoryData = async (): Promise<void> => {
  loading.value = true
  try {
    const response = await getProductCategories()

    if (response.code === 200) {
      categoryData.value = response.data
      // 默认展开第一级
      expandedKeys.value = categoryData.value.map((item: Category) => item.id)
    } else {
      message.error(response.message || '加载分类数据失败')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '加载分类数据失败'
    console.error('加载分类数据失败:', error)
    message.error(errorMessage)
  } finally {
    loading.value = false
  }
}

/**
 * 搜索处理
 */
const handleSearch = createDebouncedSearch((): void => {
  loadCategoryData()
}, 300)

/**
 * 重置搜索
 */
const resetSearch = (): void => {
  Object.assign(searchForm, {
    name: '',
    status: undefined,
    level: undefined,
  })
  handleSearch()
}

/**
 * 展开全部
 */
const expandAll = (): void => {
  const getAllKeys = (data: Category[]): string[] => {
    const keys: string[] = []
    data.forEach((item) => {
      keys.push(item.id)
      if (item.children) {
        keys.push(...getAllKeys(item.children))
      }
    })
    return keys
  }
  expandedKeys.value = getAllKeys(categoryData.value)
}

/**
 * 收起全部
 */
const collapseAll = (): void => {
  expandedKeys.value = []
}

/**
 * 处理展开/收起
 */
const handleExpand = (expanded: boolean, record: Category): void => {
  if (expanded) {
    expandedKeys.value.push(record.id)
  } else {
    const index = expandedKeys.value.indexOf(record.id)
    if (index > -1) {
      expandedKeys.value.splice(index, 1)
    }
  }
}

/**
 * 处理状态变更
 */
const handleStatusChange = async (record: Category): Promise<void> => {
  try {
    const response = await updateProductCategory(record.id, {
      ...record,
      status: record.status,
    })

    if (response.code === 200) {
      message.success('状态更新成功')
    } else {
      // 回滚状态
      record.status = record.status === 1 ? 0 : 1
      message.error(response.message || '状态更新失败')
    }
  } catch (error) {
    console.error('状态更新失败:', error)
    // 回滚状态
    record.status = record.status === 1 ? 0 : 1
    message.error('状态更新失败')
  }
}

/**
 * 处理排序变更
 */
const handleSortChange = async (record: Category): Promise<void> => {
  try {
    const response = await updateProductCategory(record.id, {
      ...record,
      sort: record.sort,
    })

    if (response.code === 200) {
      message.success('排序更新成功')
    } else {
      message.error(response.message || '排序更新失败')
    }
  } catch (error) {
    console.error('排序更新失败:', error)
    message.error('排序更新失败')
  }
}

/**
 * 处理编辑
 */
const handleEdit = (record: Category): void => {
  editingCategory.value = record
  Object.assign(formData, {
    name: record.name,
    code: record.code,
    parentId: record.parentId,
    sort: record.sort,
    icon: record.icon,
    description: record.description,
    status: record.status,
    isHot: record.isHot,
    showInHome: record.showInHome,
  })
  showAddModal.value = true
}

/**
 * 处理添加子分类
 */
const handleAddChild = (record: Category): void => {
  editingCategory.value = null
  Object.assign(formData, {
    name: '',
    code: '',
    parentId: record.id,
    sort: 0,
    icon: '',
    description: '',
    status: 1,
    isHot: false,
    showInHome: false,
  })
  showAddModal.value = true
}

/**
 * 处理删除
 */
const handleDelete = async (record: Category): Promise<void> => {
  try {
    const response = await deleteProductCategory(record.id)

    if (response.code === 200) {
      message.success('删除成功')
      loadCategoryData()
    } else {
      message.error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败')
  }
}

/**
 * 处理表单提交
 */
const handleSubmit = async (): Promise<void> => {
  try {
    await formRef.value?.validate()

    let response
    if (editingCategory.value) {
      response = await updateProductCategory(editingCategory.value.id, formData)
    } else {
      response = await createProductCategory(formData)
    }

    if (response.code === 200) {
      message.success(editingCategory.value ? '更新成功' : '创建成功')
      showAddModal.value = false
      loadCategoryData()
    } else {
      message.error(response.message || (editingCategory.value ? '更新失败' : '创建失败'))
    }
  } catch (error: any) {
    if (error.errorFields) {
      message.error('请检查表单输入')
    } else {
      console.error('操作失败:', error)
      message.error(editingCategory.value ? '更新失败' : '创建失败')
    }
  }
}

/**
 * 处理取消
 */
const handleCancel = (): void => {
  showAddModal.value = false
  editingCategory.value = null
  formRef.value?.resetFields()
  iconFileList.value = []
}

/**
 * 上传前检查
 */
const beforeUpload = (file: File): boolean => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件')
    return false
  }

  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB')
    return false
  }

  return false // 阻止自动上传
}

/**
 * 处理图标上传
 */
const handleIconUpload = async (options: any): Promise<void> => {
  try {
    const formDataUpload = new FormData()
    formDataUpload.append('file', options.file)

    // 这里应该调用真实的文件上传API
    // const response = await uploadFile(formDataUpload)
    // if (response.success) {
    //   formData.icon = response.data.url
    //   message.success('图标上传成功')
    // } else {
    //   message.error(response.message || '图标上传失败')
    // }

    // 临时使用本地预览，实际项目中应替换为真实上传API
    const imageUrl = URL.createObjectURL(options.file)
    formData.icon = imageUrl
    message.success('图标上传成功（本地预览）')
  } catch (error) {
    console.error('图标上传失败:', error)
    message.error('图标上传失败')
  }
}

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  loadCategoryData()
})
</script>

<style scoped lang="less">
.category-view {
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
}

.search-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.table-section {
  .category-name {
    display: flex;
    align-items: center;
  }
}

.icon-upload {
  :deep(.ant-upload-select) {
    width: 80px;
    height: 80px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .category-view {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .search-section {
    .ant-col {
      margin-bottom: 16px;
    }
  }
}
</style>
