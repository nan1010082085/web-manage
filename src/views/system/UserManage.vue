<template>
  <div class="user-manage">
    <!-- 页面头部 -->
    <div class="page-header mb-6">
      <div class="flex-between">
        <div>
          <h1 class="text-title mb-2">用户管理</h1>
          <p class="text-body">管理系统用户信息，包括用户的创建、编辑、删除和权限分配</p>
        </div>
        <a-button type="primary" @click="showAddModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增用户
        </a-button>
      </div>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="card mb-6">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item label="用户名">
          <a-input
            v-model:value="searchForm.username"
            placeholder="请输入用户名"
            allow-clear
            class="w-48"
          />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input
            v-model:value="searchForm.email"
            placeholder="请输入邮箱"
            allow-clear
            class="w-48"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            allow-clear
            class="w-32"
          >
            <a-select-option value="active">启用</a-select-option>
            <a-select-option value="inactive">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="角色">
          <a-select
            v-model:value="searchForm.role"
            placeholder="请选择角色"
            allow-clear
            class="w-32"
          >
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="guest">访客</a-select-option>
          </a-select>
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
      <a-table
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <!-- 头像列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <a-avatar :src="record.avatar" :alt="record.username">
              {{ record.username?.charAt(0)?.toUpperCase() }}
            </a-avatar>
          </template>

          <!-- 状态列 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'success' : 'error'">
              {{ record.status === 'active' ? '启用' : '禁用' }}
            </a-tag>
          </template>

          <!-- 角色列 -->
          <template v-else-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">
              {{ getRoleText(record.role) }}
            </a-tag>
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showEditModal(record)">
                <template #icon>
                  <EditOutlined />
                </template>
                编辑
              </a-button>
              <a-button
                type="link"
                size="small"
                :danger="record.status === 'active'"
                @click="toggleUserStatus(record)"
              >
                <template #icon>
                  <component :is="record.status === 'active' ? StopOutlined : PlayCircleOutlined" />
                </template>
                {{ record.status === 'active' ? '禁用' : '启用' }}
              </a-button>
              <a-popconfirm
                title="确定要删除这个用户吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deleteUser(record.id)"
              >
                <a-button type="link" size="small" danger>
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 用户编辑/新增弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      width="600px"
    >
      <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="用户名" name="username">
              <a-input v-model:value="formData.username" placeholder="请输入用户名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="手机号" name="phone">
              <a-input v-model:value="formData.phone" placeholder="请输入手机号" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色" name="role">
              <a-select v-model:value="formData.role" placeholder="请选择角色">
                <a-select-option value="admin">管理员</a-select-option>
                <a-select-option value="user">普通用户</a-select-option>
                <a-select-option value="guest">访客</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="formData.status">
            <a-radio value="active">启用</a-radio>
            <a-radio value="inactive">禁用</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="formData.remark" placeholder="请输入备注信息" :rows="3" />
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
  StopOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, FormInstance } from 'ant-design-vue'
import type { UserInfo } from '@/types'

/**
 * 用户管理页面
 */

// 响应式数据
const loading = ref(false)
const modalVisible = ref(false)
const modalLoading = ref(false)
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive({
  username: '',
  email: '',
  status: undefined as string | undefined,
  role: undefined as string | undefined,
})

// 用户列表数据
const userList = ref<UserInfo[]>([])

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
    title: '头像',
    key: 'avatar',
    width: 80,
    align: 'center',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 200,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: 130,
  },
  {
    title: '角色',
    key: 'role',
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
    width: 200,
    align: 'center',
    fixed: 'right',
  },
]

// 表单数据
const formData = reactive<Partial<UserInfo>>({
  username: '',
  email: '',
  phone: '',
  role: 'user',
  status: 'active',
  remark: '',
})

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

// 计算属性
const modalTitle = computed(() => {
  return formData.id ? '编辑用户' : '新增用户'
})

// 方法
/**
 * 获取角色颜色
 */
const getRoleColor = (role: string) => {
  const colorMap: Record<string, string> = {
    admin: 'red',
    user: 'blue',
    guest: 'default',
  }
  return colorMap[role] || 'default'
}

/**
 * 获取角色文本
 */
const getRoleText = (role: string) => {
  const textMap: Record<string, string> = {
    admin: '管理员',
    user: '普通用户',
    guest: '访客',
  }
  return textMap[role] || role
}

/**
 * 加载用户列表
 */
const loadUserList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟数据
    const mockData: UserInfo[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        phone: '13800138000',
        role: 'admin',
        status: 'active',
        avatar: '',
        permissions: ['read', 'write', 'delete'],
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        remark: '系统管理员',
      },
      {
        id: '2',
        username: 'user1',
        email: 'user1@example.com',
        phone: '13800138001',
        role: 'user',
        status: 'active',
        avatar: '',
        permissions: ['read', 'write'],
        createTime: '2024-01-02 10:00:00',
        updateTime: '2024-01-02 10:00:00',
        remark: '普通用户',
      },
      {
        id: '3',
        username: 'guest1',
        email: 'guest1@example.com',
        phone: '13800138002',
        role: 'guest',
        status: 'inactive',
        avatar: '',
        permissions: ['read'],
        createTime: '2024-01-03 10:00:00',
        updateTime: '2024-01-03 10:00:00',
        remark: '访客用户',
      },
    ]

    userList.value = mockData
    pagination.total = mockData.length
  } catch (error) {
    message.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索用户
 */
const handleSearch = () => {
  pagination.current = 1
  loadUserList()
}

/**
 * 重置搜索
 */
const resetSearch = () => {
  Object.assign(searchForm, {
    username: '',
    email: '',
    status: undefined,
    role: undefined,
  })
  handleSearch()
}

/**
 * 表格变化处理
 */
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadUserList()
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
const showEditModal = (record: UserInfo) => {
  Object.assign(formData, record)
  modalVisible.value = true
}

/**
 * 重置表单数据
 */
const resetFormData = () => {
  Object.assign(formData, {
    id: undefined,
    username: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    remark: '',
  })
  formRef.value?.resetFields()
}

/**
 * 弹窗确定
 */
const handleModalOk = async () => {
  try {
    await formRef.value?.validate()
    modalLoading.value = true

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    message.success(formData.id ? '编辑成功' : '新增成功')
    modalVisible.value = false
    loadUserList()
  } catch (error) {
    console.error('表单验证失败:', error)
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
 * 切换用户状态
 */
const toggleUserStatus = async (record: UserInfo) => {
  try {
    loading.value = true

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newStatus = record.status === 'active' ? 'inactive' : 'active'
    record.status = newStatus

    message.success(`用户已${newStatus === 'active' ? '启用' : '禁用'}`)
  } catch (error) {
    message.error('操作失败')
  } finally {
    loading.value = false
  }
}

/**
 * 删除用户
 */
const deleteUser = async (id: string) => {
  try {
    loading.value = true

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = userList.value.findIndex((user) => user.id === id)
    if (index > -1) {
      userList.value.splice(index, 1)
      pagination.total--
    }

    message.success('删除成功')
  } catch (error) {
    message.error('删除失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadUserList()
})
</script>

<style scoped>
.user-manage {
  padding: 24px;
}

.page-header {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.ant-table) {
  .ant-table-thead > tr > th {
    background-color: #fafafa;
    font-weight: 600;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
