<template>
  <div class="user-list-container">
    <a-card title="用户列表" :bordered="false">
      <!-- 搜索和操作区域 -->
      <div class="search-section">
        <a-row :gutter="16" class="mb-4">
          <a-col :span="6">
            <a-input
              v-model:value="searchForm.username"
              placeholder="请输入用户名"
              allow-clear
              @press-enter="handleSearch"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-col>
          <a-col :span="6">
            <a-input
              v-model:value="searchForm.email"
              placeholder="请输入邮箱"
              allow-clear
              @press-enter="handleSearch"
            >
              <template #prefix>
                <MailOutlined />
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
              <a-select-option value="active">激活</a-select-option>
              <a-select-option value="inactive">禁用</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
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
            </a-space>
          </a-col>
        </a-row>
        
        <!-- 操作按钮 -->
        <div class="action-section mb-4">
          <a-space>
            <a-button type="primary" @click="handleAdd">
              <template #icon>
                <PlusOutlined />
              </template>
              新增用户
            </a-button>
            <a-button 
              type="primary" 
              danger 
              :disabled="!hasSelected"
              @click="handleBatchDelete"
            >
              <template #icon>
                <DeleteOutlined />
              </template>
              批量删除
            </a-button>
            <a-button @click="handleExport">
              <template #icon>
                <ExportOutlined />
              </template>
              导出数据
            </a-button>
          </a-space>
        </div>
      </div>

      <!-- 用户表格 -->
      <a-table
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        :pagination="pagination"
        :row-selection="rowSelection"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <a-avatar :src="record.avatar" :size="40">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </template>
          
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'green' : 'red'">
              {{ record.status === 'active' ? '激活' : '禁用' }}
            </a-tag>
          </template>
          
          <template v-else-if="column.key === 'role'">
            <a-tag color="blue">{{ record.role }}</a-tag>
          </template>
          
          <template v-else-if="column.key === 'lastLoginTime'">
            {{ formatDate(record.lastLoginTime) }}
          </template>
          
          <template v-else-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
          
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                查看
              </a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">
                编辑
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

    <!-- 用户详情抽屉 -->
    <a-drawer
      v-model:open="drawerVisible"
      title="用户详情"
      width="500"
      placement="right"
    >
      <div v-if="currentUser" class="user-detail">
        <div class="user-avatar-section">
          <a-avatar :src="currentUser.avatar" :size="80">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <h3>{{ currentUser.username }}</h3>
        </div>
        
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="用户ID">
            {{ currentUser.id }}
          </a-descriptions-item>
          <a-descriptions-item label="用户名">
            {{ currentUser.username }}
          </a-descriptions-item>
          <a-descriptions-item label="邮箱">
            {{ currentUser.email }}
          </a-descriptions-item>
          <a-descriptions-item label="手机号">
            {{ currentUser.phone || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="角色">
            <a-tag color="blue">{{ currentUser.role }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="currentUser.status === 'active' ? 'green' : 'red'">
              {{ currentUser.status === 'active' ? '激活' : '禁用' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="最后登录">
            {{ formatDate(currentUser.lastLoginTime) }}
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            {{ formatDate(currentUser.createdAt) }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  UserOutlined,
  MailOutlined,
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExportOutlined
} from '@ant-design/icons-vue'
import type { TableColumnsType, TableProps } from 'ant-design-vue'
import { getUserList, deleteUser, batchOperateUsers, exportUsers } from '@/api/user'
import { UserStatus, type User as MockUser, type UserSearchParams } from '@/mock/user'

interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  role: string
  status: UserStatus
  lastLoginTime: string
  createdAt: string
}

interface SearchForm {
  username: string
  email: string
  status?: UserStatus
}

// 响应式数据
const loading = ref(false)
const userList = ref<User[]>([])
const selectedRowKeys = ref<string[]>([])
const drawerVisible = ref(false)
const currentUser = ref<User | null>(null)

// 搜索表单
const searchForm = reactive<SearchForm>({
  username: '',
  email: '',
  status: undefined
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

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '头像',
    key: 'avatar',
    width: 80,
    align: 'center'
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    sorter: true
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '角色',
    key: 'role',
    width: 100
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    filters: [
      { text: '激活', value: 'active' },
      { text: '禁用', value: 'inactive' }
    ]
  },
  {
    title: '最后登录',
    key: 'lastLoginTime',
    width: 180,
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

// 行选择配置
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
  }
}

// 计算属性
const hasSelected = computed(() => selectedRowKeys.value.length > 0)

/**
 * 格式化日期
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

/**
 * 加载用户列表
 */
const loadUserList = async (): Promise<void> => {
  loading.value = true
  try {
    const params = {
      username: searchForm.username || undefined,
      email: searchForm.email || undefined,
      status: searchForm.status || undefined,
      page: pagination.current,
      pageSize: pagination.pageSize
    }
    
    const response = await getUserList(params)
    if (response.code === 200) {
      userList.value = response.data.list.map(item => ({
        id: item.id,
        username: item.username,
        email: item.email,
        phone: item.phone,
        avatar: item.avatar,
        role: item.role,
        status: item.status,
        lastLoginTime: item.lastLoginTime || '',
        createdAt: item.createdAt
      }))
      pagination.total = response.data.total
    } else {
      message.error(response.message || '加载用户列表失败')
    }
  } catch (error) {
    message.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索用户
 */
const handleSearch = (): void => {
  pagination.current = 1
  loadUserList()
}

/**
 * 重置搜索
 */
const handleReset = (): void => {
  Object.assign(searchForm, {
    username: '',
    email: '',
    status: undefined
  })
  handleSearch()
}

/**
 * 新增用户
 */
const handleAdd = (): void => {
  message.info('新增用户功能开发中...')
}

/**
 * 批量删除
 */
const handleBatchDelete = (): void => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的用户')
    return
  }
  
  Modal.confirm({
    title: '确认批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 个用户吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await batchOperateUsers({
          operation: 'delete',
          userIds: selectedRowKeys.value
        })
        if (response.code === 200) {
          message.success('批量删除成功')
          selectedRowKeys.value = []
          await loadUserList()
        } else {
          message.error(response.message || '批量删除失败')
        }
      } catch (error) {
        message.error('批量删除失败')
      }
    }
  })
}

/**
 * 导出数据
 */
const handleExport = async (): Promise<void> => {
  try {
    const params: UserSearchParams = {
      username: searchForm.username || undefined,
      email: searchForm.email || undefined,
      status: searchForm.status || undefined
    }
    
    const response = await exportUsers(params)
    if (response.code === 200) {
      // 直接使用下载链接
      const link = document.createElement('a')
      link.href = response.data.downloadUrl
      link.download = `用户列表_${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      message.success('导出成功')
    } else {
      message.error(response.message || '导出失败')
    }
  } catch (error) {
    message.error('导出失败')
  }
}

/**
 * 查看用户详情
 */
const handleView = (record: User): void => {
  currentUser.value = record
  drawerVisible.value = true
}

/**
 * 编辑用户
 */
const handleEdit = (record: User): void => {
  message.info(`编辑用户: ${record.username}`)
}

/**
 * 删除用户
 */
const handleDelete = (record: User): void => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户 "${record.username}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await deleteUser(record.id)
        if (response.code === 200) {
          message.success('删除成功')
          await loadUserList()
        } else {
          message.error(response.message || '删除失败')
        }
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pag, _filters, _sorter) => {
  if (pag) {
    pagination.current = pag.current || 1
    pagination.pageSize = pag.pageSize || 10
  }
  loadUserList()
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserList()
})
</script>

<style scoped>
.user-list-container {
  padding: 24px;
}

.search-section {
  background: #fafafa;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-detail {
  text-align: center;
}

.user-avatar-section {
  margin-bottom: 24px;
}

.user-avatar-section h3 {
  margin-top: 12px;
  margin-bottom: 0;
}

.mb-4 {
  margin-bottom: 16px;
}

:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
}

:deep(.ant-descriptions-item-label) {
  font-weight: 600;
}
</style>