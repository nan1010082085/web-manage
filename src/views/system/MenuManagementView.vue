<template>
  <div class="menu-management-container">
    <a-card title="菜单管理" :bordered="false">
      <!-- 操作区域 -->
      <div class="action-section">
        <a-row :gutter="16" class="mb-4">
          <a-col :span="12">
            <a-input
              v-model:value="searchKeyword"
              placeholder="请输入菜单名称或路径"
              allow-clear
              @press-enter="handleSearch"
            >
              <template #prefix>
                <MenuOutlined />
              </template>
            </a-input>
          </a-col>
          <a-col :span="12">
            <a-space>
              <a-button type="primary" @click="handleSearch">
                <template #icon>
                  <SearchOutlined />
                </template>
                搜索
              </a-button>
              <a-button @click="handleReset">
                <template #icon>
                  <ReloadOutlined />
                </template>
                重置
              </a-button>
              <a-button type="primary" @click="handleAdd">
                <template #icon>
                  <PlusOutlined />
                </template>
                新增菜单
              </a-button>
              <a-button @click="handleExpandAll">
                <template #icon>
                  <ExpandOutlined />
                </template>
                {{ expandAll ? '收起' : '展开' }}全部
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </div>

      <!-- 菜单树表格 -->
      <a-table
        :columns="columns"
        :data-source="menuList"
        :loading="loading"
        :pagination="false"
        :default-expand-all-rows="expandAll"
        row-key="id"
        :indent-size="20"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <a-space>
              <component :is="record.icon" v-if="record.icon" />
              <span>{{ record.title }}</span>
            </a-space>
          </template>
          
          <template v-else-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">
              {{ getTypeText(record.type) }}
            </a-tag>
          </template>
          
          <template v-else-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checked-value="'active'"
              :un-checked-value="'inactive'"
              @change="handleStatusChange(record)"
            />
          </template>
          
          <template v-else-if="column.key === 'visible'">
            <a-switch
              v-model:checked="record.visible"
              @change="handleVisibleChange(record)"
            />
          </template>
          
          <template v-else-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
          
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-button 
                type="link" 
                size="small" 
                @click="handleAddChild(record)"
                v-if="record.type !== 'button'"
              >
                新增子菜单
              </a-button>
              <a-button 
                type="link" 
                size="small" 
                danger 
                @click="handleDelete(record)"
              >
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑菜单模态框 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑菜单' : '新增菜单'"
      width="700px"
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
            <a-form-item label="菜单类型" name="type">
              <a-radio-group v-model:value="formData.type" @change="handleTypeChange">
                <a-radio value="menu">菜单</a-radio>
                <a-radio value="directory">目录</a-radio>
                <a-radio value="button">按钮</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="上级菜单" name="parentId">
              <a-tree-select
                v-model:value="formData.parentId"
                :tree-data="parentMenuOptions"
                placeholder="请选择上级菜单"
                allow-clear
                tree-default-expand-all
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="菜单名称" name="title">
              <a-input v-model:value="formData.title" placeholder="请输入菜单名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="菜单图标" name="icon">
              <a-input v-model:value="formData.icon" placeholder="请输入图标名称">
                <template #addonAfter>
                  <a-button size="small" @click="showIconSelector">
                    选择
                  </a-button>
                </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16" v-if="formData.type !== 'button'">
          <a-col :span="12">
            <a-form-item label="路由路径" name="path">
              <a-input v-model:value="formData.path" placeholder="请输入路由路径" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="组件路径" name="component" v-if="formData.type === 'menu'">
              <a-input v-model:value="formData.component" placeholder="请输入组件路径" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="权限标识" name="permission">
              <a-input v-model:value="formData.permission" placeholder="请输入权限标识" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排序" name="sort">
              <a-input-number 
                v-model:value="formData.sort" 
                :min="0"
                style="width: 100%"
                placeholder="请输入排序值"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="状态" name="status">
              <a-radio-group v-model:value="formData.status">
                <a-radio value="active">启用</a-radio>
                <a-radio value="inactive">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否显示" name="visible">
              <a-switch v-model:checked="formData.visible" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否缓存" name="keepAlive" v-if="formData.type === 'menu'">
              <a-switch v-model:checked="formData.keepAlive" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="备注" name="remark">
          <a-textarea 
            v-model:value="formData.remark" 
            :rows="3"
            placeholder="请输入备注信息"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 图标选择器模态框 -->
    <a-modal
      v-model:open="iconSelectorVisible"
      title="选择图标"
      width="800px"
      @ok="handleIconSelect"
      @cancel="iconSelectorVisible = false"
     ok-text="确定" cancel-text="取消">
      <div class="icon-selector">
        <a-row :gutter="[16, 16]">
          <a-col 
            :span="4" 
            v-for="icon in iconList" 
            :key="icon.name"
            class="icon-item"
            :class="{ active: selectedIcon === icon.name }"
            @click="selectedIcon = icon.name"
          >
            <div class="icon-wrapper">
              <component :is="icon.component" />
              <div class="icon-name">{{ icon.name }}</div>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import {
  MenuOutlined,
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  ExpandOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  BarChartOutlined,
  TeamOutlined,
  SafetyOutlined,
  DatabaseOutlined
} from '@ant-design/icons-vue'

interface MenuItem {
  id: string
  title: string
  path?: string
  component?: string
  icon?: string
  type: 'menu' | 'directory' | 'button'
  permission?: string
  parentId?: string
  sort: number
  status: 'active' | 'inactive'
  visible: boolean
  keepAlive?: boolean
  remark?: string
  createdAt: string
  children?: MenuItem[]
}

interface FormData {
  title: string
  path: string
  component: string
  icon: string
  type: 'menu' | 'directory' | 'button'
  permission: string
  parentId?: string
  sort: number
  status: 'active' | 'inactive'
  visible: boolean
  keepAlive: boolean
  remark: string
}

interface IconItem {
  name: string
  component: any
}

// 响应式数据
const loading = ref(false)
const modalVisible = ref(false)
const iconSelectorVisible = ref(false)
const isEdit = ref(false)
const expandAll = ref(false)
const searchKeyword = ref('')
const menuList = ref<MenuItem[]>([])
const selectedIcon = ref('')

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<FormData>({
  title: '',
  path: '',
  component: '',
  icon: '',
  type: 'menu',
  permission: '',
  parentId: undefined,
  sort: 0,
  status: 'active',
  visible: true,
  keepAlive: false,
  remark: ''
})

// 图标列表
const iconList: IconItem[] = [
  { name: 'HomeOutlined', component: HomeOutlined },
  { name: 'UserOutlined', component: UserOutlined },
  { name: 'SettingOutlined', component: SettingOutlined },
  { name: 'ShopOutlined', component: ShopOutlined },
  { name: 'ShoppingCartOutlined', component: ShoppingCartOutlined },
  { name: 'FileTextOutlined', component: FileTextOutlined },
  { name: 'BarChartOutlined', component: BarChartOutlined },
  { name: 'TeamOutlined', component: TeamOutlined },
  { name: 'SafetyOutlined', component: SafetyOutlined },
  { name: 'DatabaseOutlined', component: DatabaseOutlined },
  { name: 'MenuOutlined', component: MenuOutlined }
]

// 上级菜单选项
const parentMenuOptions = computed(() => {
  const buildOptions = (menus: MenuItem[]): any[] => {
    return menus
      .filter(menu => menu.type !== 'button')
      .map(menu => ({
        title: menu.title,
        value: menu.id,
        children: menu.children ? buildOptions(menu.children) : undefined
      }))
  }
  return buildOptions(menuList.value)
})

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '菜单名称',
    key: 'title',
    width: 200
  },
  {
    title: '类型',
    key: 'type',
    width: 80,
    align: 'center'
  },
  {
    title: '路由路径',
    dataIndex: 'path',
    key: 'path',
    width: 150
  },
  {
    title: '组件路径',
    dataIndex: 'component',
    key: 'component',
    width: 200,
    ellipsis: true
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    key: 'permission',
    width: 150
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 80,
    align: 'center'
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    align: 'center'
  },
  {
    title: '显示',
    key: 'visible',
    width: 80,
    align: 'center'
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 150
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

// 表单验证规则
const formRules = {
  title: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' }
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

/**
 * 获取类型颜色
 */
const getTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    menu: 'blue',
    directory: 'green',
    button: 'orange'
  }
  return colorMap[type] || 'default'
}

/**
 * 获取类型文本
 */
const getTypeText = (type: string): string => {
  const textMap: Record<string, string> = {
    menu: '菜单',
    directory: '目录',
    button: '按钮'
  }
  return textMap[type] || type
}

/**
 * 格式化日期
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

/**
 * 加载菜单列表
 */
const loadMenuList = async (): Promise<void> => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    const mockData: MenuItem[] = [
      {
        id: '1',
        title: '系统管理',
        path: '/system',
        icon: 'SettingOutlined',
        type: 'directory',
        permission: 'system',
        sort: 1,
        status: 'active',
        visible: true,
        createdAt: '2024-01-01 09:00:00',
        children: [
          {
            id: '1-1',
            title: '用户管理',
            path: '/system/user',
            component: 'system/UserManagement',
            icon: 'UserOutlined',
            type: 'menu',
            permission: 'system:user',
            parentId: '1',
            sort: 1,
            status: 'active',
            visible: true,
            keepAlive: true,
            createdAt: '2024-01-01 09:00:00'
          },
          {
            id: '1-2',
            title: '角色管理',
            path: '/system/role',
            component: 'system/RoleManagement',
            icon: 'TeamOutlined',
            type: 'menu',
            permission: 'system:role',
            parentId: '1',
            sort: 2,
            status: 'active',
            visible: true,
            keepAlive: true,
            createdAt: '2024-01-01 09:00:00'
          },
          {
            id: '1-3',
            title: '菜单管理',
            path: '/system/menu',
            component: 'system/MenuManagement',
            icon: 'MenuOutlined',
            type: 'menu',
            permission: 'system:menu',
            parentId: '1',
            sort: 3,
            status: 'active',
            visible: true,
            keepAlive: true,
            createdAt: '2024-01-01 09:00:00'
          }
        ]
      },
      {
        id: '2',
        title: '商品管理',
        path: '/product',
        icon: 'ShopOutlined',
        type: 'directory',
        permission: 'product',
        sort: 2,
        status: 'active',
        visible: true,
        createdAt: '2024-01-01 09:00:00',
        children: [
          {
            id: '2-1',
            title: '商品列表',
            path: '/product/list',
            component: 'product/ProductList',
            icon: 'ShopOutlined',
            type: 'menu',
            permission: 'product:list',
            parentId: '2',
            sort: 1,
            status: 'active',
            visible: true,
            keepAlive: true,
            createdAt: '2024-01-01 09:00:00'
          }
        ]
      },
      {
        id: '3',
        title: '订单管理',
        path: '/order',
        icon: 'ShoppingCartOutlined',
        type: 'directory',
        permission: 'order',
        sort: 3,
        status: 'active',
        visible: true,
        createdAt: '2024-01-01 09:00:00',
        children: [
          {
            id: '3-1',
            title: '订单列表',
            path: '/order/list',
            component: 'order/OrderList',
            icon: 'FileTextOutlined',
            type: 'menu',
            permission: 'order:list',
            parentId: '3',
            sort: 1,
            status: 'active',
            visible: true,
            keepAlive: true,
            createdAt: '2024-01-01 09:00:00'
          }
        ]
      }
    ]
    
    menuList.value = mockData
  } catch (__error) {
    message.error('加载菜单列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索菜单
 */
const handleSearch = (): void => {
  loadMenuList()
}

/**
 * 重置搜索
 */
const handleReset = (): void => {
  searchKeyword.value = ''
  handleSearch()
}

/**
 * 展开/收起全部
 */
const handleExpandAll = (): void => {
  expandAll.value = !expandAll.value
}

/**
 * 新增菜单
 */
const handleAdd = (): void => {
  isEdit.value = false
  Object.assign(formData, {
    title: '',
    path: '',
    component: '',
    icon: '',
    type: 'menu',
    permission: '',
    parentId: undefined,
    sort: 0,
    status: 'active',
    visible: true,
    keepAlive: false,
    remark: ''
  })
  modalVisible.value = true
}

/**
 * 新增子菜单
 */
const handleAddChild = (record: MenuItem): void => {
  isEdit.value = false
  Object.assign(formData, {
    title: '',
    path: '',
    component: '',
    icon: '',
    type: 'menu',
    permission: '',
    parentId: record.id,
    sort: 0,
    status: 'active',
    visible: true,
    keepAlive: false,
    remark: ''
  })
  modalVisible.value = true
}

/**
 * 编辑菜单
 */
const handleEdit = (record: MenuItem): void => {
  isEdit.value = true
  Object.assign(formData, {
    title: record.title,
    path: record.path || '',
    component: record.component || '',
    icon: record.icon || '',
    type: record.type,
    permission: record.permission || '',
    parentId: record.parentId,
    sort: record.sort,
    status: record.status,
    visible: record.visible,
    keepAlive: record.keepAlive || false,
    remark: record.remark || ''
  })
  modalVisible.value = true
}

/**
 * 删除菜单
 */
const handleDelete = (record: MenuItem): void => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除菜单 "${record.title}" 吗？`,
    onOk: () => {
      message.success('删除成功')
      loadMenuList()
    }
  })
}

/**
 * 状态变更
 */
const handleStatusChange = (record: MenuItem): void => {
  const status = record.status === 'active' ? '启用' : '禁用'
  message.success(`${status}成功`)
}

/**
 * 显示状态变更
 */
const handleVisibleChange = (record: MenuItem): void => {
  const visible = record.visible ? '显示' : '隐藏'
  message.success(`${visible}成功`)
}

/**
 * 菜单类型变更
 */
const handleTypeChange = (): void => {
  // 根据类型清空相关字段
  if (formData.type === 'button') {
    formData.path = ''
    formData.component = ''
    formData.keepAlive = false
  } else if (formData.type === 'directory') {
    formData.component = ''
  }
}

/**
 * 显示图标选择器
 */
const showIconSelector = (): void => {
  selectedIcon.value = formData.icon
  iconSelectorVisible.value = true
}

/**
 * 选择图标
 */
const handleIconSelect = (): void => {
  formData.icon = selectedIcon.value
  iconSelectorVisible.value = false
}

/**
 * 提交表单
 */
const handleSubmit = async (): Promise<void> => {
  try {
    await formRef.value?.validate()
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success(isEdit.value ? '编辑成功' : '新增成功')
    modalVisible.value = false
    loadMenuList()
  } catch (__error) {
    // 验证失败
  }
}

/**
 * 取消表单
 */
const handleCancel = (): void => {
  modalVisible.value = false
}

// 组件挂载时加载数据
onMounted(() => {
  loadMenuList()
})
</script>

<style scoped>
.menu-management-container {
  padding: 24px;
}

.action-section {
  background: #fafafa;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
}

.icon-selector {
  max-height: 400px;
  overflow-y: auto;
}

.icon-item {
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover,
.icon-item.active {
  background: #e6f7ff;
  border-radius: 6px;
}

.icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  text-align: center;
}

.icon-wrapper .anticon {
  font-size: 24px;
  margin-bottom: 8px;
  color: #1890ff;
}

.icon-name {
  font-size: 12px;
  color: #666;
  word-break: break-all;
}

.icon-item.active .icon-wrapper {
  background: #1890ff;
  color: white;
  border-radius: 4px;
}

.icon-item.active .icon-wrapper .anticon {
  color: white;
}

.icon-item.active .icon-name {
  color: white;
}
</style>