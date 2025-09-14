<template>
  <div class="permission-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">权限管理</h2>
        <p class="page-description">管理系统角色、权限和用户访问控制</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button type="primary" @click="showCreateRoleModal">
            <PlusOutlined />
            新建角色
          </a-button>
          <a-button @click="refreshData">
            <ReloadOutlined />
            刷新
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 权限统计概览 -->
    <div class="overview-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="总角色数"
              :value="overview.totalRoles"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <TeamOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="权限节点"
              :value="overview.totalPermissions"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <SafetyOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="活跃用户"
              :value="overview.activeUsers"
              :value-style="{ color: '#fa8c16' }"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <a-statistic
              title="今日登录"
              :value="overview.todayLogins"
              :value-style="{ color: '#722ed1' }"
            >
              <template #prefix>
                <LoginOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 权限管理标签页 -->
    <div class="content-section">
      <a-card>
        <a-tabs v-model:activeKey="activeTab" type="card">
          <!-- 角色管理 -->
          <a-tab-pane key="roles" tab="角色管理">
            <div class="roles-section">
              <!-- 搜索筛选 -->
              <div class="search-section">
                <a-form layout="inline" :model="roleSearchForm">
                  <a-form-item label="角色名称">
                    <a-input
                      v-model:value="roleSearchForm.name"
                      placeholder="请输入角色名称"
                      allow-clear
                      @change="handleRoleSearch"
                    />
                  </a-form-item>
                  <a-form-item label="状态">
                    <a-select
                      v-model:value="roleSearchForm.status"
                      placeholder="请选择状态"
                      style="width: 120px"
                      allow-clear
                      @change="handleRoleSearch"
                    >
                      <a-select-option value="active">启用</a-select-option>
                      <a-select-option value="inactive">禁用</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-space>
                      <a-button type="primary" @click="handleRoleSearch">
                        <SearchOutlined />
                        搜索
                      </a-button>
                      <a-button @click="resetRoleSearch"> 重置 </a-button>
                    </a-space>
                  </a-form-item>
                </a-form>
              </div>

              <!-- 角色列表 -->
              <a-table
                :columns="roleColumns"
                :data-source="roleList"
                :loading="roleLoading"
                :pagination="rolePagination"
                @change="handleRoleTableChange"
                row-key="id"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'name'">
                    <div class="role-name">
                      <a-avatar :style="{ backgroundColor: record.color }" size="small">
                        {{ record.name.charAt(0) }}
                      </a-avatar>
                      <span style="margin-left: 8px">{{ record.name }}</span>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'status'">
                    <a-switch
                      v-model:checked="record.status"
                      :checked-value="'active'"
                      :un-checked-value="'inactive'"
                      @change="toggleRoleStatus(record)"
                    />
                  </template>

                  <template v-else-if="column.key === 'permissions'">
                    <a-space wrap>
                      <a-tag
                        v-for="permission in record.permissions.slice(0, 3)"
                        :key="permission"
                        color="blue"
                        size="small"
                      >
                        {{ getPermissionName(permission) }}
                      </a-tag>
                      <a-tag v-if="record.permissions.length > 3" color="default" size="small">
                        +{{ record.permissions.length - 3 }}
                      </a-tag>
                    </a-space>
                  </template>

                  <template v-else-if="column.key === 'userCount'">
                    <a-button type="link" @click="viewRoleUsers(record)">
                      {{ record.userCount }} 人
                    </a-button>
                  </template>

                  <template v-else-if="column.key === 'actions'">
                    <a-space>
                      <a-button type="link" size="small" @click="viewRole(record)"> 查看 </a-button>
                      <a-button type="link" size="small" @click="editRole(record)"> 编辑 </a-button>
                      <a-button type="link" size="small" @click="assignPermissions(record)">
                        分配权限
                      </a-button>
                      <a-popconfirm title="确定要删除这个角色吗？" @confirm="deleteRoleHandler(record)">
                        <a-button type="link" size="small" danger> 删除 </a-button>
                      </a-popconfirm>
                    </a-space>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>

          <!-- 权限管理 -->
          <a-tab-pane key="permissions" tab="权限管理">
            <div class="permissions-section">
              <!-- 权限树操作 -->
              <div class="permission-actions">
                <a-space>
                  <a-button type="primary" @click="showCreatePermissionModal">
                    <PlusOutlined />
                    新建权限
                  </a-button>
                  <a-button @click="expandAllPermissions">
                    <ExpandAltOutlined />
                    展开全部
                  </a-button>
                  <a-button @click="collapseAllPermissions">
                    <ShrinkOutlined />
                    收起全部
                  </a-button>
                  <a-button @click="refreshPermissions">
                    <ReloadOutlined />
                    刷新
                  </a-button>
                </a-space>
              </div>

              <!-- 权限树 -->
              <div class="permission-tree">
                <a-tree
                  v-model:expandedKeys="expandedKeys"
                  :tree-data="permissionTree"
                  :field-names="{ children: 'children', title: 'title', key: 'key' }"
                  show-line
                  :show-icon="true"
                >
                  <template #title="nodeData">
                    <div class="permission-node">
                      <div class="node-content">
                        <span class="node-title">{{ nodeData.title }}</span>
                        <a-tag :color="getPermissionTypeColor(nodeData.type)" size="small">
                          {{ getPermissionTypeName(nodeData.type) }}
                        </a-tag>
                        <a-badge
                          :status="nodeData.status === 'active' ? 'success' : 'default'"
                          :text="nodeData.status === 'active' ? '启用' : '禁用'"
                        />
                      </div>
                      <div class="node-description">{{ nodeData.description }}</div>
                      <div class="node-actions">
                        <a-space size="small">
                          <a-button type="link" size="small" @click="editPermission(nodeData)">
                            编辑
                          </a-button>
                          <a-button type="link" size="small" @click="addChildPermission(nodeData)">
                            添加子权限
                          </a-button>
                          <a-popconfirm
                            title="确定要删除这个权限吗？"
                            @confirm="deletePermissionHandler(nodeData)"
                          >
                            <a-button type="link" size="small" danger> 删除 </a-button>
                          </a-popconfirm>
                        </a-space>
                      </div>
                    </div>
                  </template>

                  <template #icon="nodeData">
                    <component :is="getPermissionIcon(nodeData.type)" />
                  </template>
                </a-tree>
              </div>
            </div>
          </a-tab-pane>

          <!-- 用户权限 -->
          <a-tab-pane key="users" tab="用户权限">
            <div class="users-section">
              <!-- 搜索筛选 -->
              <div class="search-section">
                <a-form layout="inline" :model="userSearchForm">
                  <a-form-item label="用户名">
                    <a-input
                      v-model:value="userSearchForm.username"
                      placeholder="请输入用户名"
                      allow-clear
                      @change="handleUserSearch"
                    />
                  </a-form-item>
                  <a-form-item label="角色">
                    <a-select
                      v-model:value="userSearchForm.role"
                      placeholder="请选择角色"
                      style="width: 150px"
                      allow-clear
                      @change="handleUserSearch"
                    >
                      <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">
                        {{ role.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="状态">
                    <a-select
                      v-model:value="userSearchForm.status"
                      placeholder="请选择状态"
                      style="width: 120px"
                      allow-clear
                      @change="handleUserSearch"
                    >
                      <a-select-option value="active">启用</a-select-option>
                      <a-select-option value="inactive">禁用</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-space>
                      <a-button type="primary" @click="handleUserSearch">
                        <SearchOutlined />
                        搜索
                      </a-button>
                      <a-button @click="resetUserSearch"> 重置 </a-button>
                    </a-space>
                  </a-form-item>
                </a-form>
              </div>

              <!-- 用户列表 -->
              <a-table
                :columns="userColumns"
                :data-source="userList"
                :loading="userLoading"
                :pagination="userPagination"
                @change="handleUserTableChange"
                row-key="id"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'user'">
                    <div class="user-info">
                      <a-avatar :src="record.avatar" size="small">
                        {{ record.username.charAt(0).toUpperCase() }}
                      </a-avatar>
                      <div class="user-details">
                        <div class="username">{{ record.username }}</div>
                        <div class="email">{{ record.email }}</div>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'roles'">
                    <a-space wrap>
                      <a-tag
                        v-for="role in record.roles"
                        :key="role.id"
                        :color="role.color"
                        size="small"
                      >
                        {{ role.name }}
                      </a-tag>
                    </a-space>
                  </template>

                  <template v-else-if="column.key === 'status'">
                    <a-switch
                      v-model:checked="record.status"
                      :checked-value="'active'"
                      :un-checked-value="'inactive'"
                      @change="toggleUserStatus(record)"
                    />
                  </template>

                  <template v-else-if="column.key === 'lastLogin'">
                    <span v-if="record.lastLogin">
                      {{ record.lastLogin }}
                    </span>
                    <span v-else style="color: #ccc">从未登录</span>
                  </template>

                  <template v-else-if="column.key === 'actions'">
                    <a-space>
                      <a-button type="link" size="small" @click="viewUser(record)"> 查看 </a-button>
                      <a-button type="link" size="small" @click="assignUserRoles(record)">
                        分配角色
                      </a-button>
                      <a-button type="link" size="small" @click="viewUserPermissions(record)">
                        查看权限
                      </a-button>
                    </a-space>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>

    <!-- 新建/编辑角色弹窗 -->
    <a-modal
      v-model:open="roleModalVisible"
      :title="editingRole ? '编辑角色' : '新建角色'"
      width="600px"
      @ok="handleRoleSubmit"
      @cancel="handleRoleCancel"
     ok-text="确定" cancel-text="取消">
      <a-form ref="roleFormRef" :model="roleForm" :rules="roleRules" layout="vertical">
        <a-form-item label="角色名称" name="name">
          <a-input v-model:value="roleForm.name" placeholder="请输入角色名称" />
        </a-form-item>

        <a-form-item label="角色描述">
          <a-textarea v-model:value="roleForm.description" placeholder="请输入角色描述" :rows="3" />
        </a-form-item>

        <a-form-item label="角色颜色">
          <div class="color-picker">
            <div
              v-for="color in colorOptions"
              :key="color"
              class="color-option"
              :class="{ active: roleForm.color === color }"
              :style="{ backgroundColor: color }"
              @click="roleForm.color = color"
            ></div>
          </div>
        </a-form-item>

        <a-form-item label="角色状态">
          <a-switch
            v-model:checked="roleForm.status"
            checked-children="启用"
            un-checked-children="禁用"
            :checked-value="'active'"
            :un-checked-value="'inactive'"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 权限分配弹窗 -->
    <a-modal
      v-model:open="permissionModalVisible"
      title="分配权限"
      width="800px"
      @ok="handlePermissionSubmit"
      @cancel="handlePermissionCancel"
     ok-text="确定" cancel-text="取消">
      <div v-if="currentRole" class="permission-assignment">
        <div class="role-info">
          <a-avatar :style="{ backgroundColor: currentRole.color }">
            {{ currentRole.name.charAt(0) }}
          </a-avatar>
          <span style="margin-left: 8px; font-weight: 500">{{ currentRole.name }}</span>
        </div>

        <a-divider />

        <div class="permission-tree-wrapper">
          <a-tree
            v-model:checkedKeys="checkedPermissions"
            :tree-data="permissionTree"
            :field-names="{ children: 'children', title: 'title', key: 'key' }"
            checkable
            :check-strictly="false"
            :expanded-keys="expandedKeys"
          >
            <template #title="{ title, type, description }">
              <div class="permission-item">
                <span class="permission-title">{{ title }}</span>
                <a-tag :color="getPermissionTypeColor(type)" size="small">
                  {{ getPermissionTypeName(type) }}
                </a-tag>
                <div class="permission-desc">{{ description }}</div>
              </div>
            </template>
          </a-tree>
        </div>
      </div>
    </a-modal>

    <!-- 新建/编辑权限弹窗 -->
    <a-modal
      v-model:open="createPermissionModalVisible"
      :title="editingPermission ? '编辑权限' : '新建权限'"
      width="600px"
      @ok="handleCreatePermissionSubmit"
      @cancel="handleCreatePermissionCancel"
     ok-text="确定" cancel-text="取消">
      <a-form
        ref="permissionFormRef"
        :model="permissionForm"
        :rules="permissionRules"
        layout="vertical"
      >
        <a-form-item label="权限名称" name="title">
          <a-input v-model:value="permissionForm.title" placeholder="请输入权限名称" />
        </a-form-item>

        <a-form-item label="权限类型" name="type">
          <a-select v-model:value="permissionForm.type" placeholder="请选择权限类型">
            <a-select-option value="menu">菜单</a-select-option>
            <a-select-option value="button">按钮</a-select-option>
            <a-select-option value="api">接口</a-select-option>
            <a-select-option value="data">数据</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="权限描述">
          <a-textarea
            v-model:value="permissionForm.description"
            placeholder="请输入权限描述"
            :rows="3"
          />
        </a-form-item>

        <a-form-item label="权限路径" v-if="permissionForm.type === 'menu'">
          <a-input v-model:value="permissionForm.path" placeholder="请输入路径" />
        </a-form-item>

        <a-form-item label="API地址" v-if="permissionForm.type === 'api'">
          <a-input v-model:value="permissionForm.apiUrl" placeholder="请输入API地址" />
        </a-form-item>

        <a-form-item label="父级权限">
          <a-tree-select
            v-model:value="permissionForm.parentId"
            :tree-data="permissionTree"
            :field-names="{ children: 'children', label: 'title', value: 'key' }"
            placeholder="请选择父级权限"
            allow-clear
            tree-default-expand-all
          />
        </a-form-item>

        <a-form-item label="排序">
          <a-input-number
            v-model:value="permissionForm.sort"
            :min="0"
            placeholder="排序值"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="状态">
          <a-switch
            v-model:checked="permissionForm.status"
            checked-children="启用"
            un-checked-children="禁用"
            :checked-value="'active'"
            :un-checked-value="'inactive'"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 用户角色分配弹窗 -->
    <a-modal
      v-model:open="userRoleModalVisible"
      title="分配角色"
      width="600px"
      @ok="handleUserRoleSubmit"
      @cancel="handleUserRoleCancel"
     ok-text="确定" cancel-text="取消">
      <div v-if="currentUser" class="user-role-assignment">
        <div class="user-info">
          <a-avatar :src="currentUser.avatar">
            {{ currentUser.username.charAt(0).toUpperCase() }}
          </a-avatar>
          <div class="user-details">
            <div class="username">{{ currentUser.username }}</div>
            <div class="email">{{ currentUser.email }}</div>
          </div>
        </div>

        <a-divider />

        <div class="role-selection">
          <a-checkbox-group v-model:value="selectedUserRoles">
            <a-row :gutter="[16, 16]">
              <a-col :span="12" v-for="role in roleList" :key="role.id">
                <a-checkbox :value="role.id">
                  <div class="role-option">
                    <a-avatar :style="{ backgroundColor: role.color }" size="small">
                      {{ role.name.charAt(0) }}
                    </a-avatar>
                    <div class="role-info">
                      <div class="role-name">{{ role.name }}</div>
                      <div class="role-desc">{{ role.description }}</div>
                    </div>
                  </div>
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  ReloadOutlined,
  TeamOutlined,
  SafetyOutlined,
  UserOutlined,
  LoginOutlined,
  SearchOutlined,
  ExpandAltOutlined,
  ShrinkOutlined,
  MenuOutlined,
  ApiOutlined,
  DatabaseOutlined,
  ControlOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnsType, TableProps, FormInstance } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import {
  getPermissionOverview,
  getPermissionTree,
  getRoleList,
  getUserList,
  createRole,
  updateRole,
  deleteRole,
  createPermission,
  updatePermission,
  deletePermission,
  assignUserRole,
} from '@/api/permission'
import { updateUser, type UpdateUserParams } from '@/api/user'
import type {
  PermissionOverview,
  Role,
  CreateRoleParams,
  UpdateRoleParams,
  Permission,
  CreatePermissionParams,
  UpdatePermissionParams,
  User,
  AssignUserRoleParams,
  RoleStatus,
  PermissionType,
} from '@/mock/permission'
import { UserStatus } from '@/mock/user'

/**
 * 权限管理页面
 */
interface RoleSearchForm {
  name: string
  status: RoleStatus | ''
}

interface UserSearchForm {
  username: string
  role: string
  status: UserStatus | ''
}

interface RoleForm {
  name: string
  description: string
  color: string
  status: RoleStatus
  permissions: string[]
}

interface PermissionForm {
  key?: string
  title: string
  type: PermissionType | ''
  description: string
  path: string
  apiUrl: string
  parentId: string
  sort: number
  status: 'active' | 'inactive'
}

// 响应式数据
const activeTab = ref('roles')
const roleLoading = ref(false)
const userLoading = ref(false)
const roleModalVisible = ref(false)
const permissionModalVisible = ref(false)
const createPermissionModalVisible = ref(false)
const userRoleModalVisible = ref(false)
const editingRole = ref<Role | null>(null)
const editingPermission = ref<Permission | null>(null)
const currentRole = ref<Role | null>(null)
const currentUser = ref<User | null>(null)
const roleFormRef = ref<FormInstance>()
const permissionFormRef = ref<FormInstance>()
const expandedKeys = ref<string[]>([])
const checkedPermissions = ref<string[]>([])
const selectedUserRoles = ref<string[]>([])

// 概览数据
const overview = ref<PermissionOverview>({
  totalRoles: 0,
  totalPermissions: 0,
  activeUsers: 0,
  todayLogins: 0,
  totalUsers: 0,
  onlineUsers: 0,
})

// 搜索表单
const roleSearchForm = reactive<RoleSearchForm>({
  name: '',
  status: '',
})

const userSearchForm = reactive<UserSearchForm>({
  username: '',
  role: '',
  status: '',
})

// 角色表单
const roleForm = reactive<RoleForm>({
  name: '',
  description: '',
  color: '#1890ff',
  status: 'active',
  permissions: [],
})

// 权限表单
const permissionForm = reactive<PermissionForm>({
  title: '',
  type: '',
  description: '',
  path: '',
  apiUrl: '',
  parentId: '',
  sort: 0,
  status: 'active',
})

// 表单验证规则
const roleRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
}

const permissionRules = {
  title: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
}

// 颜色选项
const colorOptions = [
  '#1890ff',
  '#52c41a',
  '#fa8c16',
  '#f5222d',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
  '#faad14',
]

// 角色列表
const roleList = ref<Role[]>([])

// 用户列表
const userList = ref<User[]>([])

// 权限树
const permissionTree = ref<Permission[]>([])

// 分页配置
const rolePagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

const userPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 角色表格列配置
const roleColumns: TableColumnsType = [
  {
    title: '角色名称',
    key: 'name',
    width: 200,
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 250,
  },
  {
    title: '权限',
    key: 'permissions',
    width: 300,
  },
  {
    title: '用户数',
    key: 'userCount',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 160,
  },
  {
    title: '操作',
    key: 'actions',
    width: 250,
    fixed: 'right',
  },
]

// 用户表格列配置
const userColumns: TableColumnsType = [
  {
    title: '用户信息',
    key: 'user',
    width: 200,
  },
  {
    title: '角色',
    key: 'roles',
    width: 200,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '最后登录',
    key: 'lastLogin',
    width: 160,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 160,
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
  },
]

/**
 * 获取权限名称
 */
const getPermissionName = (permissionKey: string): string => {
  const findPermission = (permissions: Permission[], key: string): Permission | null => {
    for (const permission of permissions) {
      if (permission.key === key) {
        return permission
      }
      if (permission.children) {
        const found = findPermission(permission.children, key)
        if (found) return found
      }
    }
    return null
  }

  const permission = findPermission(permissionTree.value, permissionKey)
  return permission?.title || permissionKey
}

/**
 * 获取权限类型颜色
 */
const getPermissionTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    menu: 'blue',
    button: 'green',
    api: 'orange',
    data: 'purple',
  }
  return colorMap[type] || 'default'
}

/**
 * 获取权限类型名称
 */
const getPermissionTypeName = (type: string): string => {
  const nameMap: Record<string, string> = {
    menu: '菜单',
    button: '按钮',
    api: '接口',
    data: '数据',
  }
  return nameMap[type] || type
}

/**
 * 获取权限图标
 */
const getPermissionIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    menu: MenuOutlined,
    button: ControlOutlined,
    api: ApiOutlined,
    data: DatabaseOutlined,
  }
  return iconMap[type] || MenuOutlined
}

/**
 * 加载概览数据
 */
const loadOverviewData = async (): Promise<void> => {
  try {
    const response = await getPermissionOverview()
    if (response.code === 200) {
      overview.value = response.data
    } else {
      message.error(response.message || '加载概览数据失败')
    }
  } catch (error) {
    message.error('加载概览数据失败')
  }
}

/**
 * 加载角色列表
 */
const loadRoleList = async (): Promise<void> => {
  roleLoading.value = true
  try {
    const params = {
      page: rolePagination.current,
      pageSize: rolePagination.pageSize,
      name: roleSearchForm.name,
      status: roleSearchForm.status || undefined,
    }
    
    const response = await getRoleList(params)
    if (response.code === 200) {
      roleList.value = response.data.list
      rolePagination.total = response.data.total
    } else {
       message.error(response.message || '加载角色列表失败')
     }
   } catch (error) {
     message.error('加载角色列表失败')
   } finally {
     roleLoading.value = false
   }
 }

/**
 * 加载用户列表
 */
const loadUserList = async (): Promise<void> => {
  userLoading.value = true
  try {
    const params = {
      page: userPagination.current,
      pageSize: userPagination.pageSize,
      username: userSearchForm.username,
      role: userSearchForm.role,
      status: userSearchForm.status ? userSearchForm.status as any : undefined,
    }
    
    const response = await getUserList(params)
    if (response.code === 200) {
      userList.value = response.data.list
      userPagination.total = response.data.total
    } else {
      message.error(response.message || '加载用户列表失败')
    }
  } catch (error) {
    message.error('加载用户列表失败')
  } finally {
    userLoading.value = false
  }
}

/**
 * 加载权限树
 */
const loadPermissionTree = async (): Promise<void> => {
  try {
    const response = await getPermissionTree()
    if (response.code === 200) {
      permissionTree.value = response.data
      
      // 默认展开所有节点
      const getAllKeys = (permissions: Permission[]): string[] => {
        const keys: string[] = []
        permissions.forEach((permission) => {
          keys.push(permission.key)
          if (permission.children) {
            keys.push(...getAllKeys(permission.children))
          }
        })
        return keys
      }
      
      expandedKeys.value = getAllKeys(permissionTree.value)
    } else {
      message.error(response.message || '加载权限树失败')
    }
  } catch (error) {
    message.error('加载权限树失败')
  }
}

/**
 * 角色搜索处理
 */
const handleRoleSearch = debounce((): void => {
  rolePagination.current = 1
  loadRoleList()
}, 300)

/**
 * 重置角色搜索
 */
const resetRoleSearch = (): void => {
  Object.assign(roleSearchForm, {
    name: '',
    status: '',
  })
  handleRoleSearch()
}

/**
 * 用户搜索处理
 */
const handleUserSearch = debounce((): void => {
  userPagination.current = 1
  loadUserList()
}, 300)

/**
 * 重置用户搜索
 */
const resetUserSearch = (): void => {
  Object.assign(userSearchForm, {
    username: '',
    role: '',
    status: '',
  })
  handleUserSearch()
}

/**
 * 角色表格变化处理
 */
const handleRoleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  rolePagination.current = pag.current || 1
  rolePagination.pageSize = pag.pageSize || 10
  loadRoleList()
}

/**
 * 用户表格变化处理
 */
const handleUserTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  userPagination.current = pag.current || 1
  userPagination.pageSize = pag.pageSize || 10
  loadUserList()
}

/**
 * 显示新建角色弹窗
 */
const showCreateRoleModal = (): void => {
  editingRole.value = null
  Object.assign(roleForm, {
    name: '',
    description: '',
    color: '#1890ff',
    status: 'active',
    permissions: [],
  })
  roleModalVisible.value = true
}

/**
 * 角色提交处理
 */
const handleRoleSubmit = async (): Promise<void> => {
  try {
    await roleFormRef.value?.validate()

    const roleData: CreateRoleParams = {
      ...roleForm,
      permissions: roleForm.permissions || []
    }

    const response = editingRole.value 
      ? await updateRole({ id: editingRole.value.id, ...roleData } as UpdateRoleParams)
      : await createRole(roleData)
    
    if (response.code === 200) {
      message.success(editingRole.value ? '角色更新成功' : '角色创建成功')
      roleModalVisible.value = false
      loadRoleList()
      loadOverviewData()
    } else {
      message.error(response.message || (editingRole.value ? '角色更新失败' : '角色创建失败'))
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

/**
 * 角色取消处理
 */
const handleRoleCancel = (): void => {
  roleModalVisible.value = false
  editingRole.value = null
}

/**
 * 查看角色
 */
const viewRole = (role: Role): void => {
  message.info(`查看角色: ${role.name}`)
}

/**
 * 编辑角色
 */
const editRole = (role: Role): void => {
  editingRole.value = role
  Object.assign(roleForm, {
    name: role.name,
    description: role.description,
    color: role.color,
    status: role.status,
    permissions: role.permissions,
  })
  roleModalVisible.value = true
}

/**
 * 删除角色
 */
const deleteRoleHandler = async (role: Role): Promise<void> => {
  try {
    const response = await deleteRole(role.id)
    if (response.code === 200) {
      message.success('角色删除成功')
      loadRoleList()
      loadOverviewData()
    } else {
      message.error(response.message || '角色删除失败')
    }
  } catch (error) {
    message.error('角色删除失败')
  }
}

/**
 * 切换角色状态
 */
const toggleRoleStatus = async (role: Role): Promise<void> => {
  try {
    const newStatus = role.status === 'active' ? 'inactive' : 'active'
    const updateData: UpdateRoleParams = {
      id: role.id,
      name: role.name,
      description: role.description,
      color: role.color,
      status: newStatus,
      permissions: role.permissions
    }
    const response = await updateRole(updateData)
    if (response.code === 200) {
      message.success(`角色${newStatus === 'active' ? '启用' : '禁用'}成功`)
      loadRoleList()
    } else {
      message.error(response.message || '状态切换失败')
    }
  } catch (error) {
    message.error('状态切换失败')
  }
}

/**
 * 分配权限
 */
const assignPermissions = (role: Role): void => {
  currentRole.value = role
  checkedPermissions.value = role.permissions
  permissionModalVisible.value = true
}

/**
 * 权限分配提交
 */
const handlePermissionSubmit = async (): Promise<void> => {
  try {
    const updateData: UpdateRoleParams = {
      id: currentRole.value!.id,
      permissions: checkedPermissions.value
    }
    const response = await updateRole(updateData)
    if (response.code === 200) {
      message.success('权限分配成功')
      permissionModalVisible.value = false
      loadRoleList()
    } else {
      message.error(response.message || '权限分配失败')
    }
  } catch (error) {
    message.error('权限分配失败')
  }
}

/**
 * 权限分配取消
 */
const handlePermissionCancel = (): void => {
  permissionModalVisible.value = false
  currentRole.value = null
  checkedPermissions.value = []
}

/**
 * 查看角色用户
 */
const viewRoleUsers = (role: Role): void => {
  message.info(`查看角色 ${role.name} 的用户列表`)
}

/**
 * 显示新建权限弹窗
 */
const showCreatePermissionModal = (): void => {
  editingPermission.value = null
  Object.assign(permissionForm, {
    title: '',
    type: '',
    description: '',
    path: '',
    apiUrl: '',
    parentId: '',
    sort: 0,
    status: 'active',
  })
  createPermissionModalVisible.value = true
}

/**
 * 权限创建提交
 */
const handleCreatePermissionSubmit = async (): Promise<void> => {
  try {
    await permissionFormRef.value?.validate()

    const permissionData = {
      ...permissionForm,
      key: permissionForm.key || `perm_${Date.now()}`,
      type: permissionForm.type as PermissionType
    }

    const response = editingPermission.value 
      ? await updatePermission({ id: editingPermission.value.id, ...permissionData })
      : await createPermission(permissionData)
    
    if (response.code === 200) {
      message.success(editingPermission.value ? '权限更新成功' : '权限创建成功')
      createPermissionModalVisible.value = false
      loadPermissionTree()
      loadOverviewData()
    } else {
      message.error(response.message || (editingPermission.value ? '权限更新失败' : '权限创建失败'))
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

/**
 * 权限创建取消
 */
const handleCreatePermissionCancel = (): void => {
  createPermissionModalVisible.value = false
  editingPermission.value = null
}

/**
 * 编辑权限
 */
const editPermission = (permission: Permission): void => {
  editingPermission.value = permission
  Object.assign(permissionForm, {
    title: permission.title,
    type: permission.type,
    description: permission.description,
    path: permission.path || '',
    apiUrl: permission.apiUrl || '',
    parentId: permission.parentId || '',
    sort: permission.sort,
    status: permission.status,
  })
  createPermissionModalVisible.value = true
}

/**
 * 添加子权限
 */
const addChildPermission = (permission: Permission): void => {
  editingPermission.value = null
  Object.assign(permissionForm, {
    title: '',
    type: '',
    description: '',
    path: '',
    apiUrl: '',
    parentId: permission.key,
    sort: 0,
    status: 'active',
  })
  createPermissionModalVisible.value = true
}

/**
 * 删除权限
 */
const deletePermissionHandler = async (permission: Permission): Promise<void> => {
  try {
    const response = await deletePermission(permission.id)
    if (response.code === 200) {
      message.success('权限删除成功')
      loadPermissionTree()
      loadOverviewData()
    } else {
      message.error(response.message || '权限删除失败')
    }
  } catch (error) {
    message.error('权限删除失败')
  }
}

/**
 * 展开所有权限
 */
const expandAllPermissions = (): void => {
  const getAllKeys = (permissions: Permission[]): string[] => {
    const keys: string[] = []
    permissions.forEach((permission) => {
      keys.push(permission.key)
      if (permission.children) {
        keys.push(...getAllKeys(permission.children))
      }
    })
    return keys
  }

  expandedKeys.value = getAllKeys(permissionTree.value)
}

/**
 * 收起所有权限
 */
const collapseAllPermissions = (): void => {
  expandedKeys.value = []
}

/**
 * 刷新权限
 */
const refreshPermissions = (): void => {
  loadPermissionTree()
}

/**
 * 查看用户
 */
const viewUser = (user: User): void => {
  message.info(`查看用户: ${user.username}`)
}

/**
 * 分配用户角色
 */
const assignUserRoles = (user: User): void => {
  currentUser.value = user
  selectedUserRoles.value = user.roles.map((role) => role.id)
  userRoleModalVisible.value = true
}

/**
 * 用户角色分配提交
 */
const handleUserRoleSubmit = async (): Promise<void> => {
  try {
    const params: AssignUserRoleParams = {
      userId: currentUser.value!.id,
      roleIds: selectedUserRoles.value
    }
    const response = await assignUserRole(params)
    if (response.code === 200) {
      message.success('用户角色分配成功')
      userRoleModalVisible.value = false
      loadUserList()
    } else {
      message.error(response.message || '用户角色分配失败')
    }
  } catch (error) {
    message.error('用户角色分配失败')
  }
}

/**
 * 用户角色分配取消
 */
const handleUserRoleCancel = (): void => {
  userRoleModalVisible.value = false
  currentUser.value = null
  selectedUserRoles.value = []
}

/**
 * 查看用户权限
 */
const viewUserPermissions = (user: User): void => {
  message.info(`查看用户 ${user.username} 的权限`)
}

/**
 * 切换用户状态
 */
const toggleUserStatus = async (user: User): Promise<void> => {
  try {
    const newStatus: UserStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE
    const updateData: UpdateUserParams = {
      status: newStatus
    }
    const response = await updateUser(user.id, updateData)
    if (response.code === 200) {
      message.success(`用户${newStatus === UserStatus.ACTIVE ? '启用' : '禁用'}成功`)
      loadUserList()
    } else {
      message.error(response.message || '状态切换失败')
    }
  } catch (error) {
    message.error('状态切换失败')
  }
}

/**
 * 刷新数据
 */
const refreshData = (): void => {
  loadOverviewData()
  loadRoleList()
  loadUserList()
  loadPermissionTree()
}

// 组件挂载时加载数据
onMounted(() => {
  loadOverviewData()
  loadRoleList()
  loadUserList()
  loadPermissionTree()
})
</script>

<style scoped lang="less">
.permission-view {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .header-content {
      .page-title {
        margin: 0 0 8px 0;
        font-size: 24px;
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
      .ant-btn {
        margin-left: 8px;
      }
    }
  }

  .overview-section {
    margin-bottom: 24px;

    .stat-card {
      text-align: center;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .content-section {
    .ant-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .search-section {
      margin-bottom: 16px;
      padding: 16px;
      background: #fafafa;
      border-radius: 6px;
    }

    .roles-section,
    .permissions-section,
    .users-section {
      .role-name {
        display: flex;
        align-items: center;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .user-details {
          .username {
            font-weight: 500;
            color: #262626;
          }

          .email {
            font-size: 12px;
            color: #8c8c8c;
          }
        }
      }
    }

    .permission-actions {
      margin-bottom: 16px;
      padding: 16px;
      background: #fafafa;
      border-radius: 6px;
    }

    .permission-tree {
      .permission-node {
        .node-content {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;

          .node-title {
            font-weight: 500;
            color: #262626;
          }
        }

        .node-description {
          font-size: 12px;
          color: #8c8c8c;
          margin-bottom: 8px;
        }

        .node-actions {
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        &:hover .node-actions {
          opacity: 1;
        }
      }
    }
  }

  .color-picker {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .color-option {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.1);
      }

      &.active {
        border-color: #1890ff;
        transform: scale(1.1);
      }
    }
  }

  .permission-assignment {
    .role-info {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
    }

    .permission-tree-wrapper {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      padding: 16px;

      .permission-item {
        .permission-title {
          font-weight: 500;
          margin-right: 8px;
        }

        .permission-desc {
          font-size: 12px;
          color: #8c8c8c;
          margin-top: 4px;
        }
      }
    }
  }

  .user-role-assignment {
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .user-details {
        .username {
          font-size: 16px;
          font-weight: 500;
          color: #262626;
        }

        .email {
          font-size: 14px;
          color: #8c8c8c;
        }
      }
    }

    .role-selection {
      .role-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: 6px;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #f5f5f5;
        }

        .role-info {
          .role-name {
            font-weight: 500;
            color: #262626;
          }

          .role-desc {
            font-size: 12px;
            color: #8c8c8c;
          }
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    padding: 16px;

    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;

      .header-actions {
        align-self: flex-end;
      }
    }

    .overview-section {
      .ant-col {
        margin-bottom: 16px;
      }
    }

    .search-section {
      .ant-form {
        .ant-form-item {
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style>
