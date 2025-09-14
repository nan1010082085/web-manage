<template>
  <div class="product-manage">
    <!-- 页面头部 -->
    <div class="page-header mb-6">
      <div class="flex-between">
        <div>
          <h1 class="text-title mb-2">商品管理</h1>
          <p class="text-body">管理商品信息，包括商品的创建、编辑、删除和库存管理</p>
        </div>
        <a-space>
          <a-button @click="exportProducts">
            <template #icon>
              <ExportOutlined />
            </template>
            导出
          </a-button>
          <a-button type="primary" @click="showAddModal">
            <template #icon>
              <PlusOutlined />
            </template>
            新增商品
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="card mb-6">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item label="商品名称">
          <a-input
            v-model:value="searchForm.name"
            placeholder="请输入商品名称"
            allow-clear
            class="w-48"
          />
        </a-form-item>
        <a-form-item label="商品编码">
          <a-input
            v-model:value="searchForm.code"
            placeholder="请输入商品编码"
            allow-clear
            class="w-48"
          />
        </a-form-item>
        <a-form-item label="分类">
          <a-select
            v-model:value="searchForm.category"
            placeholder="请选择分类"
            allow-clear
            class="w-32"
          >
            <a-select-option value="electronics">电子产品</a-select-option>
            <a-select-option value="clothing">服装</a-select-option>
            <a-select-option value="books">图书</a-select-option>
            <a-select-option value="home">家居</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            allow-clear
            class="w-32"
          >
            <a-select-option value="active">上架</a-select-option>
            <a-select-option value="inactive">下架</a-select-option>
            <a-select-option value="draft">草稿</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="价格区间">
          <a-input-group compact class="w-48">
            <a-input-number
              v-model:value="searchForm.minPrice"
              placeholder="最低价"
              :min="0"
              class="w-1/2"
            />
            <a-input-number
              v-model:value="searchForm.maxPrice"
              placeholder="最高价"
              :min="0"
              class="w-1/2"
            />
          </a-input-group>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
            <a-button @click="resetSearch">
              <template #icon>
                <ReloadOutlined />
              </template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <!-- 数据表格 -->
    <div class="card">
      <div class="flex-between mb-4">
        <div class="flex items-center space-x-4">
          <a-checkbox
            v-model:checked="selectAll"
            :indeterminate="indeterminate"
            @change="handleSelectAll"
          >
            全选
          </a-checkbox>
          <a-button v-if="selectedRowKeys.length > 0" type="primary" danger @click="batchDelete">
            批量删除 ({{ selectedRowKeys.length }})
          </a-button>
        </div>
        <div class="text-body">共 {{ pagination.total }} 条记录</div>
      </div>

      <a-table
        :columns="columns"
        :data-source="productList"
        :loading="loading"
        :pagination="pagination"
        :row-selection="rowSelection"
        @change="handleTableChange"
        row-key="id"
      >
        <!-- 商品图片列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image
              :width="60"
              :height="60"
              :src="record.image"
              :alt="record.name"
              class="rounded"
              :preview="{ mask: '预览' }"
            />
          </template>

          <!-- 商品名称列 -->
          <template v-else-if="column.key === 'name'">
            <div>
              <div class="font-medium text-gray-900">{{ record.name }}</div>
              <div class="text-sm text-gray-500">{{ record.code }}</div>
            </div>
          </template>

          <!-- 价格列 -->
          <template v-else-if="column.key === 'price'">
            <div class="text-right">
              <div class="text-lg font-semibold text-red-500">¥{{ record.price }}</div>
              <div
                v-if="record.originalPrice && record.originalPrice > record.price"
                class="text-sm text-gray-400 line-through"
              >
                ¥{{ record.originalPrice }}
              </div>
            </div>
          </template>

          <!-- 库存列 -->
          <template v-else-if="column.key === 'stock'">
            <div class="text-center">
              <div
                :class="{
                  'text-red-500': record.stock < 10,
                  'text-yellow-500': record.stock >= 10 && record.stock < 50,
                  'text-green-500': record.stock >= 50,
                }"
              >
                {{ record.stock }}
              </div>
              <div class="text-xs text-gray-400">件</div>
            </div>
          </template>

          <!-- 分类列 -->
          <template v-else-if="column.key === 'category'">
            <a-tag :color="getCategoryColor(record.category)">
              {{ getCategoryText(record.category) }}
            </a-tag>
          </template>

          <!-- 状态列 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewProduct(record)">
                <template #icon>
                  <EyeOutlined />
                </template>
                查看
              </a-button>
              <a-button type="link" size="small" @click="showEditModal(record)">
                <template #icon>
                  <EditOutlined />
                </template>
                编辑
              </a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="copy" @click="copyProduct(record)">
                      <CopyOutlined /> 复制
                    </a-menu-item>
                    <a-menu-item key="stock" @click="showStockModal(record)">
                      <InboxOutlined /> 库存管理
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item
                      key="delete"
                      @click="deleteProductAction(record.id)"
                      class="text-red-500"
                    >
                      <DeleteOutlined /> 删除
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button type="link" size="small">
                  <template #icon>
                    <MoreOutlined />
                  </template>
                </a-button>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 商品编辑/新增弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      ok-text="保存"
      cancel-text="取消"
      width="800px"
      :body-style="{ maxHeight: '70vh', overflow: 'auto' }"
    >
      <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="商品名称" name="name">
              <a-input v-model:value="formData.name" placeholder="请输入商品名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="商品编码" name="code">
              <a-input v-model:value="formData.code" placeholder="请输入商品编码" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="分类" name="category">
              <a-select v-model:value="formData.category" placeholder="请选择分类">
                <a-select-option value="electronics">电子产品</a-select-option>
                <a-select-option value="clothing">服装</a-select-option>
                <a-select-option value="books">图书</a-select-option>
                <a-select-option value="home">家居</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="售价" name="price">
              <a-input-number
                v-model:value="formData.price"
                placeholder="请输入售价"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="原价" name="originalPrice">
              <a-input-number
                v-model:value="formData.originalPrice"
                placeholder="请输入原价"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="库存" name="stock">
              <a-input-number
                v-model:value="formData.stock"
                placeholder="请输入库存"
                :min="0"
                class="w-full"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="重量(kg)" name="weight">
              <a-input-number
                v-model:value="formData.weight"
                placeholder="请输入重量"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="状态" name="status">
              <a-select v-model:value="formData.status" placeholder="请选择状态">
                <a-select-option value="active">上架</a-select-option>
                <a-select-option value="inactive">下架</a-select-option>
                <a-select-option value="draft">草稿</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="商品图片" name="image">
          <a-upload
            v-model:file-list="fileList"
            list-type="picture-card"
            :before-upload="beforeUpload"
            @preview="handlePreview"
            @remove="handleRemove"
          >
            <div v-if="fileList.length < 5">
              <PlusOutlined />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="商品描述" name="description">
          <a-textarea v-model:value="formData.description" placeholder="请输入商品描述" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 库存管理弹窗 -->
    <a-modal
      v-model:open="stockModalVisible"
      title="库存管理"
      :confirm-loading="stockModalLoading"
      @ok="handleStockModalOk"
      @cancel="stockModalVisible = false"
      ok-text="确定"
      cancel-text="取消"
      width="500px"
    >
      <div class="mb-4">
        <h3 class="text-lg font-medium">{{ currentProduct?.name }}</h3>
        <p class="text-gray-500">当前库存：{{ currentProduct?.stock }} 件</p>
      </div>

      <a-form layout="vertical">
        <a-form-item label="操作类型">
          <a-radio-group v-model:value="stockOperation">
            <a-radio value="add">入库</a-radio>
            <a-radio value="subtract">出库</a-radio>
            <a-radio value="set">设置</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="数量">
          <a-input-number
            v-model:value="stockAmount"
            placeholder="请输入数量"
            :min="1"
            class="w-full"
          />
        </a-form-item>

        <a-form-item label="备注">
          <a-textarea v-model:value="stockRemark" placeholder="请输入操作备注" :rows="3" />
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
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  CopyOutlined,
  InboxOutlined,
  MoreOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, FormInstance, UploadFile } from 'ant-design-vue'
import type { ProductInfo } from '@/mock/product'
import {
  getProductList,
  createProduct,
  updateProduct,
  deleteProduct,
  batchDeleteProducts,
  updateProductStock,
} from '@/api/product'

/**
 * 商品管理页面
 */

// 商品接口定义
interface Product extends ProductInfo {
  /** 是否选中 */
  checked?: boolean
}

// 响应式数据
const loading = ref(false)
const modalVisible = ref(false)
const modalLoading = ref(false)
const stockModalVisible = ref(false)
const stockModalLoading = ref(false)
const formRef = ref<FormInstance>()
const fileList = ref<UploadFile[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  code: '',
  category: undefined as string | undefined,
  status: undefined as string | undefined,
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
})

// 商品列表数据
const productList = ref<Product[]>([])

// 选择相关
const selectedRowKeys = ref<string[]>([])
const selectAll = ref(false)
const indeterminate = ref(false)

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) =>
    `共 ${total} 条记录，当前显示 ${range[0]}-${range[1]} 条`,
})

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '商品图片',
    key: 'image',
    width: 100,
    align: 'center',
  },
  {
    title: '商品信息',
    key: 'name',
    width: 200,
  },
  {
    title: '分类',
    key: 'category',
    width: 100,
    align: 'center',
  },
  {
    title: '价格',
    key: 'price',
    width: 120,
    align: 'right',
  },
  {
    title: '库存',
    key: 'stock',
    width: 100,
    align: 'center',
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center',
    fixed: 'right',
  },
]

// 表单数据
const formData = reactive<Partial<Product>>({
  name: '',
  code: '',
  category: 'electronics',
  price: 0,
  originalPrice: 0,
  stock: 0,
  weight: 0,
  status: 'draft',
  images: '',
  description: '',
})

// 库存操作相关
const currentProduct = ref<Product | null>(null)
const stockOperation = ref<'add' | 'subtract' | 'set'>('add')
const stockAmount = ref<number>(1)
const stockRemark = ref<string>('')

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [
    { required: true, message: '请输入售价', trigger: 'blur' },
    { type: 'number', min: 0, message: '售价不能小于0', trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' },
  ],
}

// 行选择配置
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
    updateSelectAllState()
  },
  onSelectAll: (selected: boolean, selectedRows: Product[], changeRows: Product[]) => {
    updateSelectAllState()
  },
}

// 计算属性
const modalTitle = computed(() => {
  return formData.id ? '编辑商品' : '新增商品'
})

// 方法
/**
 * 更新全选状态
 */
const updateSelectAllState = () => {
  const total = productList.value.length
  const selected = selectedRowKeys.value.length

  selectAll.value = selected === total && total > 0
  indeterminate.value = selected > 0 && selected < total
}

/**
 * 全选处理
 */
const handleSelectAll = (e: { target: { checked: boolean } }) => {
  if (e.target.checked) {
    selectedRowKeys.value = productList.value.map((item) => item.id!).filter(Boolean)
  } else {
    selectedRowKeys.value = []
  }
  updateSelectAllState()
}

/**
 * 获取分类颜色
 */
const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    electronics: 'blue',
    clothing: 'purple',
    books: 'green',
    home: 'orange',
  }
  return colorMap[category] || 'default'
}

/**
 * 获取分类文本
 */
const getCategoryText = (category: string) => {
  const textMap: Record<string, string> = {
    electronics: '电子产品',
    clothing: '服装',
    books: '图书',
    home: '家居',
  }
  return textMap[category] || category
}

/**
 * 获取状态颜色
 */
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    active: 'success',
    inactive: 'error',
    draft: 'warning',
  }
  return colorMap[status] || 'default'
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '上架',
    inactive: '下架',
    draft: '草稿',
  }
  return textMap[status] || status
}

/**
 * 加载商品列表
 */
const loadProductList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      name: searchForm.name,
      code: searchForm.code,
      category: searchForm.category,
      status: searchForm.status,
      minPrice: searchForm.minPrice,
      maxPrice: searchForm.maxPrice,
    }

    const response = await getProductList(params)

    if (response.code === 200) {
      productList.value = response.data.list
      pagination.total = response.data.total
    } else {
      message.error(response.message || '加载商品列表失败')
    }
  } catch (error) {
    console.error('加载商品列表失败:', error)
    message.error('加载商品列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索商品
 */
const handleSearch = () => {
  pagination.current = 1
  loadProductList()
}

/**
 * 重置搜索
 */
const resetSearch = () => {
  Object.assign(searchForm, {
    name: '',
    code: '',
    category: undefined,
    status: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  })
  handleSearch()
}

/**
 * 表格变化处理
 */
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadProductList()
}

/**
 * 显示新增弹窗
 */
const showAddModal = () => {
  resetFormData()
  modalVisible.value = true
}

/**
 * 显示编辑弹窗
 */
const showEditModal = (record: Product) => {
  Object.assign(formData, record)
  modalVisible.value = true
}

/**
 * 重置表单数据
 */
const resetFormData = () => {
  Object.assign(formData, {
    id: undefined,
    name: '',
    code: '',
    category: 'electronics',
    price: 0,
    originalPrice: 0,
    stock: 0,
    weight: 0,
    status: 'draft',
    image: '',
    description: '',
  })
  fileList.value = []
  formRef.value?.resetFields()
}

/**
 * 弹窗确定
 */
const handleModalOk = async () => {
  try {
    await formRef.value?.validate()
    modalLoading.value = true

    const productData = {
      name: formData.name,
      code: formData.code,
      category: formData.category,
      price: formData.price,
      originalPrice: formData.originalPrice,
      stock: formData.stock,
      weight: formData.weight,
      status: formData.status,
      images: formData.images,
      description: formData.description,
    }

    let response
    if (formData.id) {
      response = await updateProduct(formData.id, productData)
    } else {
      response = await createProduct(productData)
    }

    if (response.code === 200) {
      message.success(formData.id ? '编辑成功' : '新增成功')
      modalVisible.value = false
      loadProductList()
    } else {
      message.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
    message.error('操作失败')
  } finally {
    modalLoading.value = false
  }
}

/**
 * 弹窗取消
 */
const handleModalCancel = () => {
  modalVisible.value = false
  resetFormData()
}

/**
 * 查看商品
 */
const viewProduct = (record: Product) => {
  message.info(`查看商品：${record.name}`)
}

/**
 * 复制商品
 */
const copyProduct = (record: Product) => {
  const newProduct = { ...record }
  Reflect.defineProperty(newProduct, 'id', { value: undefined })
  newProduct.name = `${record.name} - 副本`
  newProduct.code = `${record.code}_COPY`
  newProduct.status = 'draft'

  Object.assign(formData, newProduct)
  modalVisible.value = true
}

/**
 * 显示库存管理弹窗
 */
const showStockModal = (record: Product) => {
  currentProduct.value = record
  stockOperation.value = 'add'
  stockAmount.value = 1
  stockRemark.value = ''
  stockModalVisible.value = true
}

/**
 * 库存管理确定
 */
const handleStockModalOk = async () => {
  if (!currentProduct.value || !stockAmount.value) {
    message.error('请输入有效的数量')
    return
  }

  try {
    stockModalLoading.value = true

    let newStock = currentProduct.value.stock

    switch (stockOperation.value) {
      case 'add':
        newStock += stockAmount.value
        break
      case 'subtract':
        newStock = Math.max(0, newStock - stockAmount.value)
        break
      case 'set':
        newStock = stockAmount.value
        break
    }

    const response = await updateProductStock(currentProduct.value.id!, newStock)

    if (response.code === 200) {
      currentProduct.value.stock = newStock
      message.success('库存更新成功')
      stockModalVisible.value = false
    } else {
      message.error(response.message || '库存更新失败')
    }
  } catch (error) {
    console.error('库存更新失败:', error)
    message.error('库存更新失败')
  } finally {
    stockModalLoading.value = false
  }
}

/**
 * 删除商品
 */
const deleteProductAction = async (id: string) => {
  try {
    loading.value = true

    const response = await deleteProduct(id)

    if (response.code === 200) {
      message.success('删除成功')
      loadProductList()
    } else {
      message.error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败')
  } finally {
    loading.value = false
  }
}

/**
 * 批量删除
 */
const batchDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的商品')
    return
  }

  try {
    loading.value = true

    const response = await batchDeleteProducts(selectedRowKeys.value as string[])

    if (response.code === 200) {
      message.success('批量删除成功')
      selectedRowKeys.value = []
      updateSelectAllState()
      loadProductList()
    } else {
      message.error(response.message || '批量删除失败')
    }
  } catch (error) {
    console.error('批量删除失败:', error)
    message.error('批量删除失败')
  } finally {
    loading.value = false
  }
}

/**
 * 导出商品
 */
const exportProducts = () => {
  message.success('导出功能开发中...')
}

/**
 * 上传前处理
 */
const beforeUpload = (file: File) => {
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
const handlePreview = (file: UploadFile) => {
  console.log('预览图片:', file)
}

/**
 * 移除图片
 */
const handleRemove = (file: UploadFile) => {
  const index = fileList.value.indexOf(file)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
}

// 生命周期
onMounted(() => {
  loadProductList()
})
</script>

<style scoped lang="less">
.product-manage {
  padding: @spacing-xxl;
}

.page-header {
  .card-style();
}

:deep(.ant-table) {
  .ant-table-thead > tr > th {
    background-color: @bg-color-light;
    font-weight: @font-weight-semibold;
  }
}

:deep(.ant-form-item) {
  margin-bottom: @spacing-lg;
}

:deep(.ant-upload-select-picture-card) {
  .avatar-style(80px, @border-radius-lg);
}

:deep(.ant-upload-list-picture-card .ant-upload-list-item) {
  .avatar-style(80px, @border-radius-lg);
}
</style>
