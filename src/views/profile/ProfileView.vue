<template>
  <div class="profile-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">个人中心</h2>
        <p class="page-description">管理个人信息、安全设置和偏好配置</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button @click="refreshProfile">
            <ReloadOutlined />
            刷新
          </a-button>
          <a-button type="primary" @click="saveAllChanges">
            <SaveOutlined />
            保存所有更改
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 个人资料卡片 -->
    <div class="profile-card">
      <a-card>
        <div class="profile-header">
          <div class="avatar-section">
            <a-avatar :size="80" :src="userInfo.avatar">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <a-upload
              :show-upload-list="false"
              :before-upload="beforeAvatarUpload"
              @change="handleAvatarChange"
            >
              <a-button size="small" class="upload-btn">
                <UploadOutlined />
                更换头像
              </a-button>
            </a-upload>
          </div>
          <div class="user-info">
            <h3>{{ userInfo.name }}</h3>
            <p class="user-role">{{ userInfo.role }}</p>
            <p class="user-email">{{ userInfo.email }}</p>
            <div class="user-stats">
              <a-space>
                <span>最后登录：{{ formatDate(userInfo.lastLogin) }}</span>
                <a-divider type="vertical" />
                <span>注册时间：{{ formatDate(userInfo.createdAt) }}</span>
              </a-space>
            </div>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-section">
      <a-row :gutter="24">
        <!-- 左侧菜单 -->
        <a-col :span="6">
          <a-card class="profile-menu">
            <a-menu
              v-model:selectedKeys="selectedKeys"
              mode="vertical"
              @click="handleMenuClick"
            >
              <a-menu-item key="basic">
                <UserOutlined />
                基本信息
              </a-menu-item>
              <a-menu-item key="security">
                <SafetyOutlined />
                安全设置
              </a-menu-item>
              <a-menu-item key="notification">
                <BellOutlined />
                通知偏好
              </a-menu-item>
              <a-menu-item key="appearance">
                <SkinOutlined />
                外观设置
              </a-menu-item>
              <a-menu-item key="privacy">
                <EyeInvisibleOutlined />
                隐私设置
              </a-menu-item>
              <a-menu-item key="activity">
                <HistoryOutlined />
                活动记录
              </a-menu-item>
            </a-menu>
          </a-card>
        </a-col>

        <!-- 右侧内容 -->
        <a-col :span="18">
          <a-card class="profile-content">
            <!-- 基本信息 -->
            <div v-if="activeTab === 'basic'" class="profile-panel">
              <h3 class="panel-title">基本信息</h3>
              <a-form
                :model="basicInfo"
                layout="vertical"
                @finish="saveBasicInfo"
              >
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="姓名" name="name" :rules="[{ required: true, message: '请输入姓名' }]">
                      <a-input v-model:value="basicInfo.name" placeholder="请输入姓名" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="昵称" name="nickname">
                      <a-input v-model:value="basicInfo.nickname" placeholder="请输入昵称" />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="邮箱" name="email" :rules="[{ required: true, type: 'email', message: '请输入有效的邮箱地址' }]">
                      <a-input v-model:value="basicInfo.email" placeholder="请输入邮箱" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="手机号" name="phone">
                      <a-input v-model:value="basicInfo.phone" placeholder="请输入手机号" />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="性别" name="gender">
                      <a-select v-model:value="basicInfo.gender" placeholder="请选择性别">
                        <a-select-option value="male">男</a-select-option>
                        <a-select-option value="female">女</a-select-option>
                        <a-select-option value="other">其他</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="生日" name="birthday">
                      <a-date-picker
                        v-model:value="basicInfo.birthday"
                        style="width: 100%"
                        placeholder="请选择生日"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-form-item label="个人简介" name="bio">
                  <a-textarea
                    v-model:value="basicInfo.bio"
                    placeholder="请输入个人简介"
                    :rows="4"
                    :maxlength="200"
                    show-count
                  />
                </a-form-item>
                
                <a-form-item label="地址" name="address">
                  <a-input v-model:value="basicInfo.address" placeholder="请输入地址" />
                </a-form-item>
                
                <a-form-item>
                  <a-button type="primary" html-type="submit">
                    保存基本信息
                  </a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- 安全设置 -->
            <div v-if="activeTab === 'security'" class="profile-panel">
              <h3 class="panel-title">安全设置</h3>
              
              <!-- 修改密码 -->
              <div class="security-section">
                <h4>修改密码</h4>
                <a-form
                  :model="passwordForm"
                  layout="vertical"
                  @finish="changePassword"
                >
                  <a-form-item
                    label="当前密码"
                    name="currentPassword"
                    :rules="[{ required: true, message: '请输入当前密码' }]"
                  >
                    <a-input-password v-model:value="passwordForm.currentPassword" placeholder="请输入当前密码" />
                  </a-form-item>
                  
                  <a-form-item
                    label="新密码"
                    name="newPassword"
                    :rules="[{ required: true, min: 6, message: '密码至少6位' }]"
                  >
                    <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码" />
                  </a-form-item>
                  
                  <a-form-item
                    label="确认新密码"
                    name="confirmPassword"
                    :rules="[{ required: true, validator: validateConfirmPassword }]"
                  >
                    <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请确认新密码" />
                  </a-form-item>
                  
                  <a-form-item>
                    <a-button type="primary" html-type="submit">
                      修改密码
                    </a-button>
                  </a-form-item>
                </a-form>
              </div>
              
              <a-divider />
              
              <!-- 双因子认证 -->
              <div class="security-section">
                <h4>双因子认证</h4>
                <div class="two-factor-item">
                  <div class="item-info">
                    <p><strong>Google Authenticator</strong></p>
                    <p class="item-desc">使用Google Authenticator应用生成验证码</p>
                  </div>
                  <div class="item-action">
                    <a-switch
                      v-model:checked="securitySettings.googleAuth"
                      @change="toggleGoogleAuth"
                    />
                  </div>
                </div>
                
                <div class="two-factor-item">
                  <div class="item-info">
                    <p><strong>短信验证</strong></p>
                    <p class="item-desc">通过短信接收验证码</p>
                  </div>
                  <div class="item-action">
                    <a-switch
                      v-model:checked="securitySettings.smsAuth"
                      @change="toggleSmsAuth"
                    />
                  </div>
                </div>
              </div>
              
              <a-divider />
              
              <!-- 登录设备 -->
              <div class="security-section">
                <h4>登录设备</h4>
                <div class="device-list">
                  <div v-for="device in loginDevices" :key="device.id" class="device-item">
                    <div class="device-info">
                      <div class="device-icon">
                        <DesktopOutlined v-if="device.type === 'desktop'" />
                        <MobileOutlined v-else />
                      </div>
                      <div class="device-details">
                        <p class="device-name">{{ device.name }}</p>
                        <p class="device-meta">{{ device.location }} • {{ formatDate(device.lastActive) }}</p>
                      </div>
                    </div>
                    <div class="device-actions">
                      <a-tag v-if="device.current" color="green">当前设备</a-tag>
                      <a-button v-else size="small" danger @click="removeDevice(device.id)">
                        移除
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 通知偏好 -->
            <div v-if="activeTab === 'notification'" class="profile-panel">
              <h3 class="panel-title">通知偏好</h3>
              
              <div class="notification-section">
                <h4>邮件通知</h4>
                <div class="notification-item">
                  <div class="item-info">
                    <p><strong>系统通知</strong></p>
                    <p class="item-desc">接收系统重要通知和更新</p>
                  </div>
                  <a-switch v-model:checked="notificationSettings.emailSystem" />
                </div>
                
                <div class="notification-item">
                  <div class="item-info">
                    <p><strong>订单通知</strong></p>
                    <p class="item-desc">接收订单状态变更通知</p>
                  </div>
                  <a-switch v-model:checked="notificationSettings.emailOrder" />
                </div>
                
                <div class="notification-item">
                  <div class="item-info">
                    <p><strong>营销推广</strong></p>
                    <p class="item-desc">接收优惠活动和产品推荐</p>
                  </div>
                  <a-switch v-model:checked="notificationSettings.emailMarketing" />
                </div>
              </div>
              
              <a-divider />
              
              <div class="notification-section">
                <h4>站内消息</h4>
                <div class="notification-item">
                  <div class="item-info">
                    <p><strong>实时通知</strong></p>
                    <p class="item-desc">在浏览器中显示实时通知</p>
                  </div>
                  <a-switch v-model:checked="notificationSettings.browserNotification" />
                </div>
                
                <div class="notification-item">
                  <div class="item-info">
                    <p><strong>声音提醒</strong></p>
                    <p class="item-desc">新消息时播放提示音</p>
                  </div>
                  <a-switch v-model:checked="notificationSettings.soundNotification" />
                </div>
              </div>
              
              <a-divider />
              
              <div class="notification-section">
                <h4>通知时间</h4>
                <a-form layout="vertical">
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item label="开始时间">
                        <a-time-picker
                          v-model:value="notificationSettings.startTime"
                          format="HH:mm"
                          style="width: 100%"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="结束时间">
                        <a-time-picker
                          v-model:value="notificationSettings.endTime"
                          format="HH:mm"
                          style="width: 100%"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
              
              <a-button type="primary" @click="saveNotificationSettings">
                保存通知设置
              </a-button>
            </div>

            <!-- 外观设置 -->
            <div v-if="activeTab === 'appearance'" class="profile-panel">
              <h3 class="panel-title">外观设置</h3>
              
              <div class="appearance-section">
                <h4>主题设置</h4>
                <a-radio-group v-model:value="appearanceSettings.theme" @change="changeTheme">
                  <a-radio value="light">浅色主题</a-radio>
                  <a-radio value="dark">深色主题</a-radio>
                  <a-radio value="auto">跟随系统</a-radio>
                </a-radio-group>
              </div>
              
              <a-divider />
              
              <div class="appearance-section">
                <h4>语言设置</h4>
                <a-select
                  v-model:value="appearanceSettings.language"
                  style="width: 200px"
                  @change="changeLanguage"
                >
                  <a-select-option value="zh-CN">简体中文</a-select-option>
                  <a-select-option value="en-US">English</a-select-option>
                  <a-select-option value="ja-JP">日本語</a-select-option>
                </a-select>
              </div>
              
              <a-divider />
              
              <div class="appearance-section">
                <h4>布局设置</h4>
                <div class="layout-item">
                  <div class="item-info">
                    <p><strong>紧凑模式</strong></p>
                    <p class="item-desc">减少页面元素间距，显示更多内容</p>
                  </div>
                  <a-switch v-model:checked="appearanceSettings.compactMode" />
                </div>
                
                <div class="layout-item">
                  <div class="item-info">
                    <p><strong>侧边栏折叠</strong></p>
                    <p class="item-desc">默认折叠左侧导航栏</p>
                  </div>
                  <a-switch v-model:checked="appearanceSettings.sidebarCollapsed" />
                </div>
              </div>
              
              <a-button type="primary" @click="saveAppearanceSettings">
                保存外观设置
              </a-button>
            </div>

            <!-- 隐私设置 -->
            <div v-if="activeTab === 'privacy'" class="profile-panel">
              <h3 class="panel-title">隐私设置</h3>
              
              <div class="privacy-section">
                <h4>个人信息可见性</h4>
                <div class="privacy-item">
                  <div class="item-info">
                    <p><strong>显示真实姓名</strong></p>
                    <p class="item-desc">在个人资料中显示真实姓名</p>
                  </div>
                  <a-switch v-model:checked="privacySettings.showRealName" />
                </div>
                
                <div class="privacy-item">
                  <div class="item-info">
                    <p><strong>显示邮箱地址</strong></p>
                    <p class="item-desc">允许其他用户查看邮箱地址</p>
                  </div>
                  <a-switch v-model:checked="privacySettings.showEmail" />
                </div>
                
                <div class="privacy-item">
                  <div class="item-info">
                    <p><strong>显示手机号</strong></p>
                    <p class="item-desc">允许其他用户查看手机号</p>
                  </div>
                  <a-switch v-model:checked="privacySettings.showPhone" />
                </div>
              </div>
              
              <a-divider />
              
              <div class="privacy-section">
                <h4>活动记录</h4>
                <div class="privacy-item">
                  <div class="item-info">
                    <p><strong>记录登录历史</strong></p>
                    <p class="item-desc">保存登录时间和设备信息</p>
                  </div>
                  <a-switch v-model:checked="privacySettings.recordLoginHistory" />
                </div>
                
                <div class="privacy-item">
                  <div class="item-info">
                    <p><strong>记录操作日志</strong></p>
                    <p class="item-desc">保存用户操作记录</p>
                  </div>
                  <a-switch v-model:checked="privacySettings.recordActivityLog" />
                </div>
              </div>
              
              <a-divider />
              
              <div class="privacy-section">
                <h4>数据管理</h4>
                <a-space direction="vertical" style="width: 100%">
                  <a-button @click="exportData">
                    <DownloadOutlined />
                    导出个人数据
                  </a-button>
                  <a-button danger @click="showDeleteAccountModal">
                    <DeleteOutlined />
                    删除账户
                  </a-button>
                </a-space>
              </div>
              
              <a-button type="primary" @click="savePrivacySettings">
                保存隐私设置
              </a-button>
            </div>

            <!-- 活动记录 -->
            <div v-if="activeTab === 'activity'" class="profile-panel">
              <h3 class="panel-title">活动记录</h3>
              
              <div class="activity-filters">
                <a-space>
                  <a-select v-model:value="activityFilter.type" placeholder="活动类型" style="width: 120px">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="login">登录</a-select-option>
                    <a-select-option value="operation">操作</a-select-option>
                    <a-select-option value="security">安全</a-select-option>
                  </a-select>
                  
                  <a-range-picker v-model:value="activityFilter.dateRange" />
                  
                  <a-button @click="loadActivityLog">
                    <SearchOutlined />
                    查询
                  </a-button>
                </a-space>
              </div>
              
              <div class="activity-list">
                <a-timeline>
                  <a-timeline-item
                    v-for="activity in activityLog"
                    :key="activity.id"
                    :color="getActivityColor(activity.type)"
                  >
                    <div class="activity-item">
                      <div class="activity-content">
                        <p class="activity-title">{{ activity.title }}</p>
                        <p class="activity-desc">{{ activity.description }}</p>
                        <div class="activity-meta">
                          <span>{{ formatDate(activity.createdAt) }}</span>
                          <a-divider type="vertical" />
                          <span>{{ activity.ip }}</span>
                          <a-divider type="vertical" />
                          <span>{{ activity.device }}</span>
                        </div>
                      </div>
                    </div>
                  </a-timeline-item>
                </a-timeline>
              </div>
              
              <div class="activity-pagination">
                <a-pagination
                  v-model:current="activityPagination.current"
                  v-model:page-size="activityPagination.pageSize"
                  :total="activityPagination.total"
                  show-size-changer
                  @change="loadActivityLog"
                />
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 删除账户确认弹窗 -->
    <a-modal
      v-model:open="deleteAccountVisible"
      title="删除账户"
      :confirm-loading="deleteAccountLoading"
      @ok="deleteAccount"
    >
      <a-alert
        message="警告"
        description="删除账户是不可逆操作，将永久删除您的所有数据。请谨慎操作。"
        type="warning"
        show-icon
        style="margin-bottom: 16px"
      />
      
      <a-form layout="vertical">
        <a-form-item label="请输入您的密码以确认删除">
          <a-input-password v-model:value="deleteAccountPassword" placeholder="请输入密码" />
        </a-form-item>
        
        <a-form-item>
          <a-checkbox v-model:checked="deleteAccountConfirm">
            我已了解删除账户的后果，确认删除
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  ReloadOutlined,
  SaveOutlined,
  UserOutlined,
  UploadOutlined,
  SafetyOutlined,
  BellOutlined,
  SkinOutlined,
  EyeInvisibleOutlined,
  HistoryOutlined,
  DesktopOutlined,
  MobileOutlined,
  DownloadOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import type { UploadChangeParam } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import dayjs from 'dayjs'

/**
 * 个人中心页面
 */

interface UserInfo {
  id: string
  name: string
  nickname: string
  email: string
  phone: string
  avatar: string
  role: string
  lastLogin: string
  createdAt: string
}

interface BasicInfo {
  name: string
  nickname: string
  email: string
  phone: string
  gender: string
  birthday: any
  bio: string
  address: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface SecuritySettings {
  googleAuth: boolean
  smsAuth: boolean
}

interface LoginDevice {
  id: string
  name: string
  type: string
  location: string
  lastActive: string
  current: boolean
}

interface NotificationSettings {
  emailSystem: boolean
  emailOrder: boolean
  emailMarketing: boolean
  browserNotification: boolean
  soundNotification: boolean
  startTime: any
  endTime: any
}

interface AppearanceSettings {
  theme: string
  language: string
  compactMode: boolean
  sidebarCollapsed: boolean
}

interface PrivacySettings {
  showRealName: boolean
  showEmail: boolean
  showPhone: boolean
  recordLoginHistory: boolean
  recordActivityLog: boolean
}

interface ActivityItem {
  id: string
  type: string
  title: string
  description: string
  ip: string
  device: string
  createdAt: string
}

interface ActivityFilter {
  type: string
  dateRange: any[]
}

interface ActivityPagination {
  current: number
  pageSize: number
  total: number
}

// 响应式数据
const selectedKeys = ref(['basic'])
const activeTab = ref('basic')

// 用户信息
const userInfo = reactive<UserInfo>({
  id: '',
  name: '',
  nickname: '',
  email: '',
  phone: '',
  avatar: '',
  role: '',
  lastLogin: '',
  createdAt: '',
})

// 基本信息表单
const basicInfo = reactive<BasicInfo>({
  name: '',
  nickname: '',
  email: '',
  phone: '',
  gender: '',
  birthday: null,
  bio: '',
  address: '',
})

// 密码修改表单
const passwordForm = reactive<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 安全设置
const securitySettings = reactive<SecuritySettings>({
  googleAuth: false,
  smsAuth: false,
})

// 登录设备
const loginDevices = ref<LoginDevice[]>([])

// 通知设置
const notificationSettings = reactive<NotificationSettings>({
  emailSystem: true,
  emailOrder: true,
  emailMarketing: false,
  browserNotification: true,
  soundNotification: true,
  startTime: null,
  endTime: null,
})

// 外观设置
const appearanceSettings = reactive<AppearanceSettings>({
  theme: 'light',
  language: 'zh-CN',
  compactMode: false,
  sidebarCollapsed: false,
})

// 隐私设置
const privacySettings = reactive<PrivacySettings>({
  showRealName: true,
  showEmail: false,
  showPhone: false,
  recordLoginHistory: true,
  recordActivityLog: true,
})

// 活动记录
const activityLog = ref<ActivityItem[]>([])
const activityFilter = reactive<ActivityFilter>({
  type: '',
  dateRange: [],
})
const activityPagination = reactive<ActivityPagination>({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 删除账户相关
const deleteAccountVisible = ref(false)
const deleteAccountLoading = ref(false)
const deleteAccountPassword = ref('')
const deleteAccountConfirm = ref(false)

/**
 * 菜单点击处理
 */
const handleMenuClick = (info: MenuInfo): void => {
  activeTab.value = info.key as string
  selectedKeys.value = [info.key as string]
  
  if (info.key === 'activity') {
    loadActivityLog()
  }
}

/**
 * 格式化日期
 */
const formatDate = (date: string): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 头像上传前验证
 */
const beforeAvatarUpload = (file: File): boolean => {
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
 * 头像上传处理
 */
const handleAvatarChange = (info: UploadChangeParam): void => {
  if (info.file.status === 'done') {
    // 模拟上传成功
    userInfo.avatar = URL.createObjectURL(info.file.originFileObj!)
    message.success('头像上传成功')
  } else if (info.file.status === 'error') {
    message.error('头像上传失败')
  }
}

/**
 * 加载用户资料
 */
const loadProfile = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 加载用户信息
    Object.assign(userInfo, {
      id: '1',
      name: '张三',
      nickname: 'zhangsan',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      avatar: '',
      role: '系统管理员',
      lastLogin: '2024-01-15 10:30:00',
      createdAt: '2023-06-01 09:00:00',
    })
    
    // 同步基本信息
    Object.assign(basicInfo, {
      name: userInfo.name,
      nickname: userInfo.nickname,
      email: userInfo.email,
      phone: userInfo.phone,
      gender: 'male',
      birthday: dayjs('1990-01-01'),
      bio: '这是一段个人简介',
      address: '北京市朝阳区',
    })
    
    // 加载登录设备
    loginDevices.value = [
      {
        id: '1',
        name: 'Windows PC - Chrome',
        type: 'desktop',
        location: '北京市',
        lastActive: '2024-01-15 10:30:00',
        current: true,
      },
      {
        id: '2',
        name: 'iPhone 15 - Safari',
        type: 'mobile',
        location: '上海市',
        lastActive: '2024-01-14 18:20:00',
        current: false,
      },
    ]
    
    // 设置通知时间默认值
    notificationSettings.startTime = dayjs('09:00', 'HH:mm')
    notificationSettings.endTime = dayjs('22:00', 'HH:mm')
    
    message.success('个人资料加载成功')
  } catch (__error) {
    message.error('个人资料加载失败')
  }
}

/**
 * 保存基本信息
 */
const saveBasicInfo = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新用户信息
    userInfo.name = basicInfo.name
    userInfo.nickname = basicInfo.nickname
    userInfo.email = basicInfo.email
    userInfo.phone = basicInfo.phone
    
    message.success('基本信息保存成功')
  } catch (__error) {
    message.error('基本信息保存失败')
  }
}

/**
 * 验证确认密码
 */
const validateConfirmPassword = (_rule: any, value: string): Promise<void> => {
  if (value && value !== passwordForm.newPassword) {
    return Promise.reject(new Error('两次输入的密码不一致'))
  }
  return Promise.resolve()
}

/**
 * 修改密码
 */
const changePassword = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 重置表单
    Object.assign(passwordForm, {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    
    message.success('密码修改成功')
  } catch (__error) {
    message.error('密码修改失败')
  }
}

/**
 * 切换Google认证
 */
const toggleGoogleAuth = (checked: boolean): void => {
  if (checked) {
    message.info('Google认证已开启')
  } else {
    message.info('Google认证已关闭')
  }
}

/**
 * 切换短信认证
 */
const toggleSmsAuth = (checked: boolean): void => {
  if (checked) {
    message.info('短信认证已开启')
  } else {
    message.info('短信认证已关闭')
  }
}

/**
 * 移除登录设备
 */
const removeDevice = async (deviceId: string): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    loginDevices.value = loginDevices.value.filter(device => device.id !== deviceId)
    message.success('设备移除成功')
  } catch (__error) {
    message.error('设备移除失败')
  }
}

/**
 * 保存通知设置
 */
const saveNotificationSettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('通知设置保存成功')
  } catch (__error) {
    message.error('通知设置保存失败')
  }
}

/**
 * 切换主题
 */
const changeTheme = (e: any): void => {
  const theme = e.target.value
  message.info(`已切换到${theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '自动'}主题`)
}

/**
 * 切换语言
 */
const changeLanguage = (language: string): void => {
  const languageMap: Record<string, string> = {
    'zh-CN': '简体中文',
    'en-US': 'English',
    'ja-JP': '日本語',
  }
  message.info(`语言已切换为${languageMap[language]}`)
}

/**
 * 保存外观设置
 */
const saveAppearanceSettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('外观设置保存成功')
  } catch (__error) {
    message.error('外观设置保存失败')
  }
}

/**
 * 保存隐私设置
 */
const savePrivacySettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('隐私设置保存成功')
  } catch (__error) {
    message.error('隐私设置保存失败')
  }
}

/**
 * 导出个人数据
 */
const exportData = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('个人数据导出成功，请检查下载文件')
  } catch (__error) {
    message.error('个人数据导出失败')
  }
}

/**
 * 显示删除账户弹窗
 */
const showDeleteAccountModal = (): void => {
  deleteAccountVisible.value = true
  deleteAccountPassword.value = ''
  deleteAccountConfirm.value = false
}

/**
 * 删除账户
 */
const deleteAccount = async (): Promise<void> => {
  if (!deleteAccountPassword.value) {
    message.error('请输入密码')
    return
  }
  
  if (!deleteAccountConfirm.value) {
    message.error('请确认删除操作')
    return
  }
  
  deleteAccountLoading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    message.success('账户删除成功')
    deleteAccountVisible.value = false
  } catch (__error) {
    message.error('账户删除失败')
  } finally {
    deleteAccountLoading.value = false
  }
}

/**
 * 加载活动记录
 */
const loadActivityLog = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    activityLog.value = [
      {
        id: '1',
        type: 'login',
        title: '用户登录',
        description: '通过用户名密码登录系统',
        ip: '192.168.1.100',
        device: 'Windows PC - Chrome',
        createdAt: '2024-01-15 10:30:00',
      },
      {
        id: '2',
        type: 'operation',
        title: '修改个人信息',
        description: '更新了个人简介和联系方式',
        ip: '192.168.1.100',
        device: 'Windows PC - Chrome',
        createdAt: '2024-01-15 09:45:00',
      },
      {
        id: '3',
        type: 'security',
        title: '修改密码',
        description: '成功修改登录密码',
        ip: '192.168.1.100',
        device: 'Windows PC - Chrome',
        createdAt: '2024-01-14 16:20:00',
      },
    ]
    
    activityPagination.total = 50
  } catch (__error) {
    message.error('活动记录加载失败')
  }
}

/**
 * 获取活动类型颜色
 */
const getActivityColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    login: 'green',
    operation: 'blue',
    security: 'orange',
  }
  return colorMap[type] || 'gray'
}

/**
 * 刷新个人资料
 */
const refreshProfile = (): void => {
  loadProfile()
}

/**
 * 保存所有更改
 */
const saveAllChanges = async (): Promise<void> => {
  try {
    await Promise.all([
      saveBasicInfo(),
      saveNotificationSettings(),
      saveAppearanceSettings(),
      savePrivacySettings(),
    ])
    
    message.success('所有设置保存成功')
  } catch (__error) {
    message.error('设置保存失败')
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadProfile()
})
</script>

<style scoped lang="scss">
.profile-view {
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

  .profile-card {
    margin-bottom: 24px;

    .profile-header {
      display: flex;
      align-items: center;
      gap: 24px;

      .avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        .upload-btn {
          font-size: 12px;
        }
      }

      .user-info {
        flex: 1;

        h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #262626;
        }

        .user-role {
          margin: 0 0 4px 0;
          color: #1890ff;
          font-weight: 500;
        }

        .user-email {
          margin: 0 0 12px 0;
          color: #8c8c8c;
        }

        .user-stats {
          color: #8c8c8c;
          font-size: 14px;
        }
      }
    }
  }

  .content-section {
    .profile-menu {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .ant-menu {
        border: none;
        background: transparent;

        .ant-menu-item {
          margin: 0;
          border-radius: 6px;
          margin-bottom: 4px;

          &:hover {
            background-color: #f5f5f5;
          }

          &.ant-menu-item-selected {
            background-color: #e6f7ff;
            color: #1890ff;
          }
        }
      }
    }

    .profile-content {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .profile-panel {
        .panel-title {
          margin: 0 0 24px 0;
          font-size: 18px;
          font-weight: 600;
          color: #262626;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 12px;
        }

        .security-section {
          margin-bottom: 24px;

          h4 {
            margin: 0 0 16px 0;
            font-size: 14px;
            font-weight: 600;
            color: #595959;
          }

          .two-factor-item,
          .device-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border: 1px solid #f0f0f0;
            border-radius: 6px;
            margin-bottom: 8px;

            .item-info {
              flex: 1;

              p {
                margin: 0;

                &.item-desc {
                  color: #8c8c8c;
                  font-size: 12px;
                  margin-top: 4px;
                }
              }
            }

            .item-action {
              margin-left: 16px;
            }
          }

          .device-item {
            .device-info {
              display: flex;
              align-items: center;
              gap: 12px;

              .device-icon {
                font-size: 20px;
                color: #8c8c8c;
              }

              .device-details {
                .device-name {
                  font-weight: 500;
                }

                .device-meta {
                  color: #8c8c8c;
                  font-size: 12px;
                  margin-top: 4px;
                }
              }
            }

            .device-actions {
              display: flex;
              align-items: center;
            }
          }

          .device-list {
            max-height: 300px;
            overflow-y: auto;
          }
        }

        .notification-section,
        .appearance-section,
        .privacy-section {
          margin-bottom: 24px;

          h4 {
            margin: 0 0 16px 0;
            font-size: 14px;
            font-weight: 600;
            color: #595959;
          }

          .notification-item,
          .layout-item,
          .privacy-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f5f5f5;

            &:last-child {
              border-bottom: none;
            }

            .item-info {
              flex: 1;

              p {
                margin: 0;

                &.item-desc {
                  color: #8c8c8c;
                  font-size: 12px;
                  margin-top: 4px;
                }
              }
            }
          }
        }

        .activity-filters {
          margin-bottom: 24px;
          padding: 16px;
          background: #fafafa;
          border-radius: 6px;
        }

        .activity-list {
          margin-bottom: 24px;

          .activity-item {
            .activity-content {
              .activity-title {
                margin: 0 0 4px 0;
                font-weight: 500;
                color: #262626;
              }

              .activity-desc {
                margin: 0 0 8px 0;
                color: #8c8c8c;
                font-size: 14px;
              }

              .activity-meta {
                color: #bfbfbf;
                font-size: 12px;
              }
            }
          }
        }

        .activity-pagination {
          text-align: center;
        }

        .ant-form-item {
          margin-bottom: 16px;
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

    .profile-card {
      .profile-header {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }
    }

    .content-section {
      .ant-col {
        margin-bottom: 16px;
      }
    }
  }
}
</style>