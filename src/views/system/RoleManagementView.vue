<template>
  <div class="role-management-container">
    <a-card title="角色管理" :bordered="false">
      <!-- 搜索和操作区域 -->
      <div class="search-section">
        <a-row :gutter="16" class="mb-4">
          <a-col :span="6">
            <a-input
              v-model:value="searchForm.roleName"
              placeholder="请输入角色名称"
              allow-clear
              @press-enter="handleSearch"
            >
              <template #prefix>
                <TeamOutlined />
              </template>
            </a-input>
          </a-col>
          <a-col :span="6">
            <a-select
              v-model:value="searchForm.status"
              placeholder="请选择状态"
              allow-clear
              style="width: 100%"
            >
              <a-select-option value="active">启用</a-select-option>
              <a-select-option value="inactive">禁用</a-select-option>
            </a-select>
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
                新增角色
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </div>

      <!-- 角色表格 -->
      <a-table
        :columns="columns"
        :data-source="roleList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checked-value="'active'"
              :un-checked-value="'inactive'"
              @change="handleStatusChange(record)"
            />
          </template>
          
          <template v-else-if="column.key === 'permissions'">
            <a-space wrap>
              <a-tag
                v-for="permission in record.permissions.slice(0, 3)"
                :key="permission"
                color="blue"
              >
                {{ permission }}
              </a-tag>
              <a-tag v-if="record.permissions.length > 3" color="default">
                +{{ record.permissions.length - 3 }}
              </a-tag>
            </a-space>
          </template>
          
          <template v-else-if="column.key === 'userCount'">
            <a-button type="link" @click="handleViewUsers(record)">
              {{ record.userCount }} 人
            </a-button>
          </template>
          
          <template v-else-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
          
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-button type="link" size="small" @click="handlePermissions(record)">
                权限
              </a-button>
              <a-button 
                type="link" 
                size="small" 
                danger 
                :disabled="record.isSystem"
                @click="handleDelete(record)"
              >
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑角色模态框 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑角色' : '新增角色'"
      width="600px"
      @ok="handleSubmit"
      @cancel="handleCancel"
     ok-text="确定" cancel-text="取消">
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
      >
        <a-form-item label="角色名称" name="name">
          <a-input v-model:value="formData.name" placeholder="请输入角色名称" />
        </a-form-item>
        
        <a-form-item label="角色编码" name="code">
          <a-input 
            v-model:value="formData.code" 
            placeholder="请输入角色编码"
            :disabled="isEdit"
          />
        </a-form-item>
        
        <a-form-item label="角色描述" name="description">
          <a-textarea 
            v-model:value="formData.description" 
            :rows="3"
            placeholder="请输入角色描述"
          />
        </a-form-item>
        
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="formData.status">
            <a-radio value="active">启用</a-radio>
            <a-radio value="inactive">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item label="排序" name="sort">
          <a-input-number 
            v-model:value="formData.sort" 
            :min="0"
            style="width: 100%"
            placeholder="请输入排序值"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 权限配置模态框 -->
    <a-modal
      v-model:open="permissionModalVisible"
      title="权限配置"
      width="800px"
      @ok="handlePermissionSubmit"
      @cancel="handlePermissionCancel"
     ok-text="保存" cancel-text="取消">
      <div v-if="currentRole">
        <h4>{{ currentRole.name }} - 权限配置</h4>
        <a-tree
          v-model:checkedKeys="checkedPermissions"
          :tree-data="permissionTree"
          checkable
          :default-expand-all="true"
          :check-strictly="false"
        >
          <template #title="{ title }">
            <span>{{ title }}</span>
          </template>
        </a-tree>
      </div>
    </a-modal>

    <!-- 用户列表抽屉 -->
    <a-drawer
      v-model:open="userDrawerVisible"
      title="角色用户列表"
      width="600"
      placement="right"
    >
      <div v-if="currentRole">
        <h4>{{ currentRole.name }} - 用户列表</h4>
        <a-list
          :data-source="roleUsers"
          :loading="userLoading"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                :title="item.username"
                :description="item.email"
              >
                <template #avatar>
                  <a-avatar :src="item.avatar">
                    <template #icon>
                      <UserOutlined />
                    </template>
                  </a-avatar>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a-button type="link" size="small" danger @click="handleRemoveUser(item)">
                  移除
                </a-button>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance, TableColumnsType, TableProps, TreeProps } from 'ant-design-vue'
import {
  TeamOutlined,
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  UserOutlined
} from '@ant-design/icons-vue'

interface Role {
  id: string
  name: string
  code: string
  description: string
  status: 'active' | 'inactive'
  permissions: string[]
  userCount: number
  sort: number
  isSystem: boolean
  createdAt: string
}

interface SearchForm {
  roleName: string
  status?: 'active' | 'inactive'
}

interface FormData {
  name: string
  code: string
  description: string
  status: 'active' | 'inactive'
  sort: number
}

interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

interface PermissionNode {
  title: string
  key: string
  children?: PermissionNode[]
}

// 响应式数据
const loading = ref(false)
const modalVisible = ref(false)
const permissionModalVisible = ref(false)
const userDrawerVisible = ref(false)
const userLoading = ref(false)
const isEdit = ref(false)
const roleList = ref<Role[]>([])
const currentRole = ref<Role | null>(null)
const roleUsers = ref<User[]>([])
const checkedPermissions = ref<string[]>([])

// 表单引用
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive<SearchForm>({
  roleName: '',
  status: undefined
})

// 表单数据
const formData = reactive<FormData>({
  name: '',
  code: '',
  description: '',
  status: 'active',
  sort: 0
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`
})

// 权限树数据
const permissionTree = ref<PermissionNode[]>([
  {
    title: '系统管理',
    key: 'system',
    children: [
      { title: '用户管理', key: 'system:user' },
      { title: '角色管理', key: 'system:role' },
      { title: '菜单管理', key: 'system:menu' },
      { title: '系统设置', key: 'system:settings' }
    ]
  },
  {
    title: '商品管理',
    key: 'product',
    children: [
      { title: '商品列表', key: 'product:list' },
      { title: '商品分类', key: 'product:category' },
      { title: '库存管理', key: 'product:stock' }
    ]
  },
  {
    title: '订单管理',
    key: 'order',
    children: [
      { title: '订单列表', key: 'order:list' },
      { title: '订单统计', key: 'order:statistics' },
      { title: '退款管理', key: 'order:refund' }
    ]
  }
])

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
    sorter: true
  },
  {
    title: '角色编码',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true
  },
  {
    title: '权限',
    key: 'permissions',
    width: 200
  },
  {
    title: '用户数',
    key: 'userCount',
    width: 100,
    align: 'center'
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    align: 'center'
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 80,
    align: 'center',
    sorter: true
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 180,
    sorter: true
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
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '角色编码只能包含字母、数字和下划线，且以字母开头', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

/**
 * 格式化日期
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

/**
 * 加载角色列表
 */
const loadRoleList = async (): Promise<void> => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    const mockData: Role[] = [
      {
        id: '1',
        name: '超级管理员',
        code: 'super_admin',
        description: '拥有系统所有权限',
        status: 'active',
        permissions: ['system:user', 'system:role', 'system:menu', 'product:list', 'order:list'],
        userCount: 1,
        sort: 1,
        isSystem: true,
        createdAt: '2024-01-01 09:00:00'
      },
      {
        id: '2',
        name: '管理员',
        code: 'admin',
        description: '系统管理员角色',
        status: 'active',
        permissions: ['system:user', 'product:list', 'order:list'],
        userCount: 3,
        sort: 2,
        isSystem: false,
        createdAt: '2024-01-02 10:00:00'
      },
      {
        id: '3',
        name: '普通用户',
        code: 'user',
        description: '普通用户角色',
        status: 'active',
        permissions: ['product:list'],
        userCount: 15,
        sort: 3,
        isSystem: false,
        createdAt: '2024-01-03 11:00:00'
      }
    ]
    
    roleList.value = mockData
    pagination.total = mockData.length
  } catch (__error) {
    message.error('加载角色列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索角色
 */
const handleSearch = (): void => {
  pagination.current = 1
  loadRoleList()
}

/**
 * 重置搜索
 */
const handleReset = (): void => {
  Object.assign(searchForm, {
    roleName: '',
    status: undefined
  })
  handleSearch()
}

/**
 * 新增角色
 */
const handleAdd = (): void => {
  isEdit.value = false
  Object.assign(formData, {
    name: '',
    code: '',
    description: '',
    status: 'active',
    sort: 0
  })
  modalVisible.value = true
}

/**
 * 编辑角色
 */
const handleEdit = (record: Role): void => {
  isEdit.value = true
  Object.assign(formData, {
    name: record.name,
    code: record.code,
    description: record.description,
    status: record.status,
    sort: record.sort
  })
  currentRole.value = record
  modalVisible.value = true
}

/**
 * 删除角色
 */
const handleDelete = (record: Role): void => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除角色 "${record.name}" 吗？`,
    onOk: () => {
      message.success('删除成功')
      loadRoleList()
    }
  })
}

/**
 * 状态变更
 */
const handleStatusChange = (record: Role): void => {
  const status = record.status === 'active' ? '启用' : '禁用'
  message.success(`${status}成功`)
}

/**
 * 权限配置
 */
const handlePermissions = (record: Role): void => {
  currentRole.value = record
  checkedPermissions.value = record.permissions
  permissionModalVisible.value = true
}

/**
 * 查看用户
 */
const handleViewUsers = async (record: Role): Promise<void> => {
  currentRole.value = record
  userDrawerVisible.value = true
  
  userLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    roleUsers.value = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        avatar: ''
      },
      {
        id: '2',
        username: 'user001',
        email: 'user001@example.com',
        avatar: ''
      }
    ]
  } catch (__error) {
    message.error('加载用户列表失败')
  } finally {
    userLoading.value = false
  }
}

/**
 * 移除用户
 */
const handleRemoveUser = (user: User): void => {
  Modal.confirm({
    title: '确认移除',
    content: `确定要将用户 "${user.username}" 从当前角色中移除吗？`,
    onOk: () => {
      message.success('移除成功')
      // 重新加载用户列表
      handleViewUsers(currentRole.value!)
    }
  })
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
    loadRoleList()
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

/**
 * 提交权限配置
 */
const handlePermissionSubmit = (): void => {
  message.success('权限配置成功')
  permissionModalVisible.value = false
  loadRoleList()
}

/**
 * 取消权限配置
 */
const handlePermissionCancel = (): void => {
  permissionModalVisible.value = false
}

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  if (pag) {
    pagination.current = pag.current || 1
    pagination.pageSize = pag.pageSize || 10
  }
  loadRoleList()
}

// 组件挂载时加载数据
onMounted(() => {
  loadRoleList()
})
</script>

<style scoped>
.role-management-container {
  padding: 24px;
}

.search-section {
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

:deep(.ant-tree .ant-tree-node-content-wrapper) {
  padding: 4px 8px;
}

:deep(.ant-list-item-meta-title) {
  margin-bottom: 4px;
}
</style>