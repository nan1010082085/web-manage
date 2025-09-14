<template>
  <div class="user-profile-container">
    <a-row :gutter="24">
      <!-- 左侧个人信息卡片 -->
      <a-col :span="8">
        <a-card title="个人信息" :bordered="false">
          <div class="profile-header">
            <div class="avatar-section">
              <a-avatar :size="100" :src="userInfo.avatar">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <a-button type="link" @click="handleAvatarUpload">
                <template #icon>
                  <CameraOutlined />
                </template>
                更换头像
              </a-button>
            </div>
            <div class="user-basic-info">
              <h3>{{ userInfo.username }}</h3>
              <p class="user-role">
                <a-tag color="blue">{{ userInfo.role }}</a-tag>
              </p>
              <p class="user-status">
                <a-tag :color="userInfo.status === 'active' ? 'green' : 'red'">
                  {{ userInfo.status === 'active' ? '在线' : '离线' }}
                </a-tag>
              </p>
            </div>
          </div>

          <a-divider />

          <div class="profile-stats">
            <a-row :gutter="16">
              <a-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ userStats.loginCount }}</div>
                  <div class="stat-label">登录次数</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ userStats.onlineDays }}</div>
                  <div class="stat-label">在线天数</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ userStats.taskCount }}</div>
                  <div class="stat-label">完成任务</div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-card>

        <!-- 快捷操作 -->
        <a-card title="快捷操作" :bordered="false" class="mt-4">
          <a-space direction="vertical" style="width: 100%">
            <a-button block @click="handleChangePassword">
              <template #icon>
                <LockOutlined />
              </template>
              修改密码
            </a-button>
            <a-button block @click="handleSecuritySettings">
              <template #icon>
                <SafetyOutlined />
              </template>
              安全设置
            </a-button>
            <a-button block @click="handleNotificationSettings">
              <template #icon>
                <BellOutlined />
              </template>
              通知设置
            </a-button>
          </a-space>
        </a-card>
      </a-col>

      <!-- 右侧详细信息 -->
      <a-col :span="16">
        <a-card title="详细资料" :bordered="false">
          <a-tabs v-model:activeKey="activeTab">
            <!-- 基本信息 -->
            <a-tab-pane key="basic" tab="基本信息">
              <a-form
                ref="basicFormRef"
                :model="basicForm"
                :rules="basicRules"
                layout="vertical"
                @finish="handleBasicSubmit"
              >
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="用户名" name="username">
                      <a-input v-model:value="basicForm.username" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="邮箱" name="email">
                      <a-input v-model:value="basicForm.email" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="手机号" name="phone">
                      <a-input v-model:value="basicForm.phone" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="性别" name="gender">
                      <a-select v-model:value="basicForm.gender" placeholder="请选择性别">
                        <a-select-option value="male">男</a-select-option>
                        <a-select-option value="female">女</a-select-option>
                        <a-select-option value="other">其他</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="生日" name="birthday">
                      <a-date-picker
                        v-model:value="basicForm.birthday"
                        style="width: 100%"
                        placeholder="请选择生日"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="部门" name="department">
                      <a-input v-model:value="basicForm.department" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="个人简介" name="bio">
                  <a-textarea
                    v-model:value="basicForm.bio"
                    :rows="4"
                    placeholder="请输入个人简介"
                  />
                </a-form-item>

                <a-form-item>
                  <a-space>
                    <a-button type="primary" html-type="submit" :loading="saving">
                      保存修改
                    </a-button>
                    <a-button @click="handleReset">重置</a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </a-tab-pane>

            <!-- 登录记录 -->
            <a-tab-pane key="loginHistory" tab="登录记录">
              <a-table
                :columns="loginColumns"
                :data-source="loginHistory"
                :loading="loginLoading"
                :pagination="{ pageSize: 10 }"
                row-key="id"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'status'">
                    <a-tag :color="record.status === 'success' ? 'green' : 'red'">
                      {{ record.status === 'success' ? '成功' : '失败' }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'loginTime'">
                    {{ formatDate(record.loginTime) }}
                  </template>
                </template>
              </a-table>
            </a-tab-pane>

            <!-- 操作日志 -->
            <a-tab-pane key="operationLog" tab="操作日志">
              <a-table
                :columns="operationColumns"
                :data-source="operationLog"
                :loading="operationLoading"
                :pagination="{ pageSize: 10 }"
                row-key="id"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'type'">
                    <a-tag :color="getOperationTypeColor(record.type)">
                      {{ record.type }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'operationTime'">
                    {{ formatDate(record.operationTime) }}
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>

    <!-- 修改密码模态框 -->
    <a-modal
      v-model:open="passwordModalVisible"
      title="修改密码"
      @ok="handlePasswordSubmit"
      @cancel="handlePasswordCancel"
      ok-text="确认修改"
      cancel-text="取消"
    >
      <a-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" layout="vertical">
        <a-form-item label="当前密码" name="currentPassword">
          <a-input-password v-model:value="passwordForm.currentPassword" />
        </a-form-item>
        <a-form-item label="新密码" name="newPassword">
          <a-input-password v-model:value="passwordForm.newPassword" />
        </a-form-item>
        <a-form-item label="确认新密码" name="confirmPassword">
          <a-input-password v-model:value="passwordForm.confirmPassword" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import {
  UserOutlined,
  CameraOutlined,
  LockOutlined,
  SafetyOutlined,
  BellOutlined,
} from '@ant-design/icons-vue'
import { getUserInfo, updateBasicInfo, changePassword, getActivityLog, uploadAvatar } from '@/api/profile'
import { getUserLoginRecords, getUserOperationRecords } from '@/api/user'

interface UserInfo {
  id: string
  username: string
  email: string
  phone: string
  avatar: string
  role: string
  status: 'active' | 'inactive'
  gender?: 'male' | 'female' | 'other'
  birthday?: string
  department?: string
  bio?: string
  createdAt: string
}

interface UserStats {
  loginCount: number
  onlineDays: number
  taskCount: number
}

interface LoginRecord {
  id: string
  ip: string
  location: string
  device: string
  status: 'success' | 'failed'
  loginTime: string
}

interface OperationRecord {
  id: string
  type: string
  description: string
  ip: string
  operationTime: string
}

// 响应式数据
const activeTab = ref('basic')
const saving = ref(false)
const loginLoading = ref(false)
const operationLoading = ref(false)
const passwordModalVisible = ref(false)

// 表单引用
const basicFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

// 用户信息
const userInfo = ref<UserInfo>({
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  phone: '13800138000',
  avatar: '',
  role: '超级管理员',
  status: 'active',
  createdAt: '2024-01-01 09:00:00',
})

// 用户统计
const userStats = ref<UserStats>({
  loginCount: 156,
  onlineDays: 89,
  taskCount: 234,
})

// 基本信息表单
const basicForm = reactive({
  username: '',
  email: '',
  phone: '',
  gender: undefined,
  birthday: undefined,
  department: '',
  bio: '',
})

// 密码表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 登录记录
const loginHistory = ref<LoginRecord[]>([])

// 操作日志
const operationLog = ref<OperationRecord[]>([])

// 表单验证规则
const basicRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
}

const passwordRules = {
  currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string) => {
        if (value !== passwordForm.newPassword) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
}

// 登录记录表格列
const loginColumns: TableColumnsType = [
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
  },
  {
    title: '登录地点',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '设备信息',
    dataIndex: 'device',
    key: 'device',
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '登录时间',
    key: 'loginTime',
    width: 180,
  },
]

// 操作日志表格列
const operationColumns: TableColumnsType = [
  {
    title: '操作类型',
    key: 'type',
    width: 120,
  },
  {
    title: '操作描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    width: 150,
  },
  {
    title: '操作时间',
    key: 'operationTime',
    width: 180,
  },
]

/**
 * 格式化日期
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

/**
 * 获取操作类型颜色
 */
const getOperationTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    登录: 'green',
    登出: 'blue',
    修改: 'orange',
    删除: 'red',
    创建: 'purple',
  }
  return colorMap[type] || 'default'
}

/**
 * 初始化表单数据
 */
const initFormData = (): void => {
  Object.assign(basicForm, {
    username: userInfo.value.username,
    email: userInfo.value.email,
    phone: userInfo.value.phone,
    gender: userInfo.value.gender,
    birthday: userInfo.value.birthday,
    department: userInfo.value.department,
    bio: userInfo.value.bio,
  })
}

/**
 * 加载登录记录
 */
const loadLoginHistory = async (): Promise<void> => {
  loginLoading.value = true
  try {
    const response = await getUserLoginRecords(userInfo.value.id)
    if (response.code === 200) {
      loginHistory.value = response.data.list.map(item => ({
        id: item.id,
        ip: item.ip,
        location: item.location,
        device: item.device,
        status: item.status,
        loginTime: item.loginTime
      }))
    } else {
      message.error(response.message || '加载登录记录失败')
    }
  } catch (error) {
    message.error('加载登录记录失败')
  } finally {
    loginLoading.value = false
  }
}

/**
 * 加载操作日志
 */
const loadOperationLog = async (): Promise<void> => {
  operationLoading.value = true
  try {
    const response = await getUserOperationRecords(userInfo.value.id)
    if (response.code === 200) {
      operationLog.value = response.data.list.map(item => ({
        id: item.id,
        type: item.type,
        description: item.description,
        ip: item.ip,
        operationTime: item.operationTime
      }))
    } else {
      message.error(response.message || '加载操作日志失败')
    }
  } catch (error) {
    message.error('加载操作日志失败')
  } finally {
    operationLoading.value = false
  }
}

/**
 * 头像上传
 */
const handleAvatarUpload = (): void => {
  message.info('头像上传功能开发中...')
}

/**
 * 提交基本信息
 */
const handleBasicSubmit = async (): Promise<void> => {
  saving.value = true
  try {
    const params = {
      name: basicForm.username,
      nickname: basicForm.username,
      email: basicForm.email,
      phone: basicForm.phone,
      gender: basicForm.gender || 'other',
      birthday: basicForm.birthday || '',
      bio: basicForm.bio || '',
      address: basicForm.department || ''
    }
    
    const response = await updateBasicInfo(params)
    if (response.code === 200) {
      message.success('保存成功')
      // 更新本地用户信息
      Object.assign(userInfo.value, {
        email: basicForm.email,
        phone: basicForm.phone
      })
    } else {
      message.error(response.message || '保存失败')
    }
  } catch (error) {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

/**
 * 重置表单
 */
const handleReset = (): void => {
  initFormData()
}

/**
 * 修改密码
 */
const handleChangePassword = (): void => {
  passwordModalVisible.value = true
}

/**
 * 提交密码修改
 */
const handlePasswordSubmit = async (): Promise<void> => {
  try {
    await passwordFormRef.value?.validate()
    
    const params = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    }
    
    const response = await changePassword(params)
    if (response.code === 200) {
      message.success('密码修改成功')
      passwordModalVisible.value = false
      Object.assign(passwordForm, {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } else {
      message.error(response.message || '密码修改失败')
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'errorFields' in error) {
      // 表单验证失败
      return
    }
    message.error('密码修改失败')
  }
}

/**
 * 取消密码修改
 */
const handlePasswordCancel = (): void => {
  passwordModalVisible.value = false
  Object.assign(passwordForm, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
}

/**
 * 安全设置
 */
const handleSecuritySettings = (): void => {
  message.info('安全设置功能开发中...')
}

/**
 * 通知设置
 */
const handleNotificationSettings = (): void => {
  message.info('通知设置功能开发中...')
}

// 组件挂载时初始化数据
onMounted(() => {
  initFormData()
  loadLoginHistory()
  loadOperationLog()
})
</script>

<style scoped>
.user-profile-container {
  padding: 24px;
}

.profile-header {
  text-align: center;
}

.avatar-section {
  margin-bottom: 16px;
}

.user-basic-info h3 {
  margin: 16px 0 8px;
  font-size: 20px;
}

.user-role,
.user-status {
  margin: 4px 0;
}

.profile-stats {
  margin-top: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.mt-4 {
  margin-top: 16px;
}

:deep(.ant-card-head-title) {
  font-weight: 600;
}

:deep(.ant-tabs-tab) {
  font-weight: 500;
}
</style>
