<template>
  <div class="system-settings-container">
    <a-card title="系统设置" :bordered="false">
      <a-tabs v-model:activeKey="activeTab" type="card">
        <!-- 基础设置 -->
        <a-tab-pane key="basic" tab="基础设置">
          <a-form
            ref="basicFormRef"
            :model="basicSettings"
            :rules="basicRules"
            layout="vertical"
            class="settings-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="系统名称" name="systemName">
                  <a-input v-model:value="basicSettings.systemName" placeholder="请输入系统名称" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="系统版本" name="systemVersion">
                  <a-input v-model:value="basicSettings.systemVersion" placeholder="请输入系统版本" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="公司名称" name="companyName">
                  <a-input v-model:value="basicSettings.companyName" placeholder="请输入公司名称" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="联系电话" name="contactPhone">
                  <a-input v-model:value="basicSettings.contactPhone" placeholder="请输入联系电话" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="联系邮箱" name="contactEmail">
                  <a-input v-model:value="basicSettings.contactEmail" placeholder="请输入联系邮箱" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="网站地址" name="websiteUrl">
                  <a-input v-model:value="basicSettings.websiteUrl" placeholder="请输入网站地址" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-form-item label="系统描述" name="systemDescription">
              <a-textarea 
                v-model:value="basicSettings.systemDescription" 
                :rows="4"
                placeholder="请输入系统描述"
              />
            </a-form-item>
            
            <a-form-item label="系统Logo" name="systemLogo">
              <a-upload
                v-model:file-list="logoFileList"
                name="logo"
                list-type="picture-card"
                class="logo-uploader"
                :show-upload-list="false"
                :before-upload="beforeUpload"
                @change="handleLogoChange"
              >
                <img v-if="basicSettings.systemLogo" :src="basicSettings.systemLogo" alt="logo" class="logo-image" />
                <div v-else class="upload-placeholder">
                  <PlusOutlined />
                  <div class="ant-upload-text">上传Logo</div>
                </div>
              </a-upload>
            </a-form-item>
            
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleBasicSubmit" :loading="basicLoading">
                  保存设置
                </a-button>
                <a-button @click="handleBasicReset">
                  重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        
        <!-- 安全设置 -->
        <a-tab-pane key="security" tab="安全设置">
          <a-form
            ref="securityFormRef"
            :model="securitySettings"
            :rules="securityRules"
            layout="vertical"
            class="settings-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="密码最小长度" name="minPasswordLength">
                  <a-input-number 
                    v-model:value="securitySettings.minPasswordLength" 
                    :min="6"
                    :max="20"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="密码复杂度要求" name="passwordComplexity">
                  <a-select v-model:value="securitySettings.passwordComplexity" style="width: 100%">
                    <a-select-option value="low">低（仅字母数字）</a-select-option>
                    <a-select-option value="medium">中（字母数字+特殊字符）</a-select-option>
                    <a-select-option value="high">高（大小写字母+数字+特殊字符）</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="登录失败锁定次数" name="maxLoginAttempts">
                  <a-input-number 
                    v-model:value="securitySettings.maxLoginAttempts" 
                    :min="3"
                    :max="10"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="账户锁定时间（分钟）" name="lockoutDuration">
                  <a-input-number 
                    v-model:value="securitySettings.lockoutDuration" 
                    :min="5"
                    :max="1440"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="会话超时时间（分钟）" name="sessionTimeout">
                  <a-input-number 
                    v-model:value="securitySettings.sessionTimeout" 
                    :min="30"
                    :max="1440"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="强制定期修改密码" name="forcePasswordChange">
                  <a-switch v-model:checked="securitySettings.forcePasswordChange" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="24" v-if="securitySettings.forcePasswordChange">
              <a-col :span="12">
                <a-form-item label="密码修改周期（天）" name="passwordChangeDays">
                  <a-input-number 
                    v-model:value="securitySettings.passwordChangeDays" 
                    :min="30"
                    :max="365"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="启用双因子认证" name="enableTwoFactor">
                  <a-switch v-model:checked="securitySettings.enableTwoFactor" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleSecuritySubmit" :loading="securityLoading">
                  保存设置
                </a-button>
                <a-button @click="handleSecurityReset">
                  重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        
        <!-- 邮件设置 -->
        <a-tab-pane key="email" tab="邮件设置">
          <a-form
            ref="emailFormRef"
            :model="emailSettings"
            :rules="emailRules"
            layout="vertical"
            class="settings-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="SMTP服务器" name="smtpHost">
                  <a-input v-model:value="emailSettings.smtpHost" placeholder="请输入SMTP服务器地址" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="SMTP端口" name="smtpPort">
                  <a-input-number 
                    v-model:value="emailSettings.smtpPort" 
                    :min="1"
                    :max="65535"
                    style="width: 100%"
                    placeholder="请输入SMTP端口"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="发件人邮箱" name="senderEmail">
                  <a-input v-model:value="emailSettings.senderEmail" placeholder="请输入发件人邮箱" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="发件人名称" name="senderName">
                  <a-input v-model:value="emailSettings.senderName" placeholder="请输入发件人名称" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="邮箱用户名" name="emailUsername">
                  <a-input v-model:value="emailSettings.emailUsername" placeholder="请输入邮箱用户名" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="邮箱密码" name="emailPassword">
                  <a-input-password v-model:value="emailSettings.emailPassword" placeholder="请输入邮箱密码" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="启用SSL" name="enableSsl">
                  <a-switch v-model:checked="emailSettings.enableSsl" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="启用邮件通知" name="enableEmailNotification">
                  <a-switch v-model:checked="emailSettings.enableEmailNotification" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleEmailSubmit" :loading="emailLoading">
                  保存设置
                </a-button>
                <a-button @click="handleEmailTest" :loading="emailTestLoading">
                  测试连接
                </a-button>
                <a-button @click="handleEmailReset">
                  重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        
        <!-- 存储设置 -->
        <a-tab-pane key="storage" tab="存储设置">
          <a-form
            ref="storageFormRef"
            :model="storageSettings"
            :rules="storageRules"
            layout="vertical"
            class="settings-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="文件存储方式" name="storageType">
                  <a-select v-model:value="storageSettings.storageType" style="width: 100%">
                    <a-select-option value="local">本地存储</a-select-option>
                    <a-select-option value="oss">阿里云OSS</a-select-option>
                    <a-select-option value="qiniu">七牛云</a-select-option>
                    <a-select-option value="aws">AWS S3</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="最大文件大小（MB）" name="maxFileSize">
                  <a-input-number 
                    v-model:value="storageSettings.maxFileSize" 
                    :min="1"
                    :max="1024"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-form-item label="允许的文件类型" name="allowedFileTypes">
              <a-select 
                v-model:value="storageSettings.allowedFileTypes" 
                mode="multiple"
                style="width: 100%"
                placeholder="请选择允许的文件类型"
              >
                <a-select-option value="jpg">JPG</a-select-option>
                <a-select-option value="png">PNG</a-select-option>
                <a-select-option value="gif">GIF</a-select-option>
                <a-select-option value="pdf">PDF</a-select-option>
                <a-select-option value="doc">DOC</a-select-option>
                <a-select-option value="docx">DOCX</a-select-option>
                <a-select-option value="xls">XLS</a-select-option>
                <a-select-option value="xlsx">XLSX</a-select-option>
                <a-select-option value="zip">ZIP</a-select-option>
                <a-select-option value="rar">RAR</a-select-option>
              </a-select>
            </a-form-item>
            
            <!-- 云存储配置 -->
            <div v-if="storageSettings.storageType !== 'local'">
              <a-divider>云存储配置</a-divider>
              
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="Access Key" name="accessKey">
                    <a-input v-model:value="storageSettings.accessKey" placeholder="请输入Access Key" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Secret Key" name="secretKey">
                    <a-input-password v-model:value="storageSettings.secretKey" placeholder="请输入Secret Key" />
                  </a-form-item>
                </a-col>
              </a-row>
              
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="存储桶名称" name="bucketName">
                    <a-input v-model:value="storageSettings.bucketName" placeholder="请输入存储桶名称" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="访问域名" name="domain">
                    <a-input v-model:value="storageSettings.domain" placeholder="请输入访问域名" />
                  </a-form-item>
                </a-col>
              </a-row>
              
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="地域" name="region">
                    <a-input v-model:value="storageSettings.region" placeholder="请输入地域" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="启用CDN" name="enableCdn">
                    <a-switch v-model:checked="storageSettings.enableCdn" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleStorageSubmit" :loading="storageLoading">
                  保存设置
                </a-button>
                <a-button @click="handleStorageTest" :loading="storageTestLoading" v-if="storageSettings.storageType !== 'local'">
                  测试连接
                </a-button>
                <a-button @click="handleStorageReset">
                  重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance, UploadChangeParam, UploadFile } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

interface BasicSettings {
  systemName: string
  systemVersion: string
  companyName: string
  contactPhone: string
  contactEmail: string
  websiteUrl: string
  systemDescription: string
  systemLogo: string
}

interface SecuritySettings {
  minPasswordLength: number
  passwordComplexity: 'low' | 'medium' | 'high'
  maxLoginAttempts: number
  lockoutDuration: number
  sessionTimeout: number
  forcePasswordChange: boolean
  passwordChangeDays: number
  enableTwoFactor: boolean
}

interface EmailSettings {
  smtpHost: string
  smtpPort: number
  senderEmail: string
  senderName: string
  emailUsername: string
  emailPassword: string
  enableSsl: boolean
  enableEmailNotification: boolean
}

interface StorageSettings {
  storageType: 'local' | 'oss' | 'qiniu' | 'aws'
  maxFileSize: number
  allowedFileTypes: string[]
  accessKey: string
  secretKey: string
  bucketName: string
  domain: string
  region: string
  enableCdn: boolean
}

// 响应式数据
const activeTab = ref('basic')
const basicLoading = ref(false)
const securityLoading = ref(false)
const emailLoading = ref(false)
const emailTestLoading = ref(false)
const storageLoading = ref(false)
const storageTestLoading = ref(false)
const logoFileList = ref<UploadFile[]>([])

// 表单引用
const basicFormRef = ref<FormInstance>()
const securityFormRef = ref<FormInstance>()
const emailFormRef = ref<FormInstance>()
const storageFormRef = ref<FormInstance>()

// 基础设置
const basicSettings = reactive<BasicSettings>({
  systemName: '商城管理系统',
  systemVersion: '1.0.0',
  companyName: '示例科技有限公司',
  contactPhone: '400-123-4567',
  contactEmail: 'admin@example.com',
  websiteUrl: 'https://www.example.com',
  systemDescription: '一个功能完善的商城管理系统',
  systemLogo: ''
})

// 安全设置
const securitySettings = reactive<SecuritySettings>({
  minPasswordLength: 8,
  passwordComplexity: 'medium',
  maxLoginAttempts: 5,
  lockoutDuration: 30,
  sessionTimeout: 120,
  forcePasswordChange: false,
  passwordChangeDays: 90,
  enableTwoFactor: false
})

// 邮件设置
const emailSettings = reactive<EmailSettings>({
  smtpHost: '',
  smtpPort: 587,
  senderEmail: '',
  senderName: '',
  emailUsername: '',
  emailPassword: '',
  enableSsl: true,
  enableEmailNotification: true
})

// 存储设置
const storageSettings = reactive<StorageSettings>({
  storageType: 'local',
  maxFileSize: 10,
  allowedFileTypes: ['jpg', 'png', 'gif', 'pdf'],
  accessKey: '',
  secretKey: '',
  bucketName: '',
  domain: '',
  region: '',
  enableCdn: false
})

// 表单验证规则
const basicRules = {
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' }
  ],
  systemVersion: [
    { required: true, message: '请输入系统版本', trigger: 'blur' }
  ],
  companyName: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  contactEmail: [
    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const securityRules = {
  minPasswordLength: [
    { required: true, message: '请设置密码最小长度', trigger: 'blur' }
  ],
  passwordComplexity: [
    { required: true, message: '请选择密码复杂度要求', trigger: 'change' }
  ],
  maxLoginAttempts: [
    { required: true, message: '请设置登录失败锁定次数', trigger: 'blur' }
  ],
  lockoutDuration: [
    { required: true, message: '请设置账户锁定时间', trigger: 'blur' }
  ],
  sessionTimeout: [
    { required: true, message: '请设置会话超时时间', trigger: 'blur' }
  ]
}

const emailRules = {
  smtpHost: [
    { required: true, message: '请输入SMTP服务器地址', trigger: 'blur' }
  ],
  smtpPort: [
    { required: true, message: '请输入SMTP端口', trigger: 'blur' }
  ],
  senderEmail: [
    { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  emailUsername: [
    { required: true, message: '请输入邮箱用户名', trigger: 'blur' }
  ],
  emailPassword: [
    { required: true, message: '请输入邮箱密码', trigger: 'blur' }
  ]
}

const storageRules = {
  storageType: [
    { required: true, message: '请选择文件存储方式', trigger: 'change' }
  ],
  maxFileSize: [
    { required: true, message: '请设置最大文件大小', trigger: 'blur' }
  ],
  allowedFileTypes: [
    { required: true, message: '请选择允许的文件类型', trigger: 'change' }
  ]
}

/**
 * 文件上传前检查
 */
const beforeUpload = (file: UploadFile): boolean => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  const isLt2M = (file.size || 0) / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

/**
 * 处理Logo上传
 */
const handleLogoChange = (info: UploadChangeParam): void => {
  if (info.file.status === 'uploading') {
    return
  }
  if (info.file.status === 'done') {
    // 模拟获取上传后的URL
    basicSettings.systemLogo = URL.createObjectURL(info.file.originFileObj as File)
    message.success('Logo上传成功')
  }
  if (info.file.status === 'error') {
    message.error('Logo上传失败')
  }
}

/**
 * 加载系统设置
 */
const loadSettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里可以从API加载实际的设置数据
    message.success('设置加载成功')
  } catch (__error) {
    message.error('设置加载失败')
  }
}

/**
 * 保存基础设置
 */
const handleBasicSubmit = async (): Promise<void> => {
  try {
    await basicFormRef.value?.validate()
    basicLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('基础设置保存成功')
  } catch (__error) {
    // 验证失败
  } finally {
    basicLoading.value = false
  }
}

/**
 * 重置基础设置
 */
const handleBasicReset = (): void => {
  basicFormRef.value?.resetFields()
}

/**
 * 保存安全设置
 */
const handleSecuritySubmit = async (): Promise<void> => {
  try {
    await securityFormRef.value?.validate()
    securityLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('安全设置保存成功')
  } catch (__error) {
    // 验证失败
  } finally {
    securityLoading.value = false
  }
}

/**
 * 重置安全设置
 */
const handleSecurityReset = (): void => {
  securityFormRef.value?.resetFields()
}

/**
 * 保存邮件设置
 */
const handleEmailSubmit = async (): Promise<void> => {
  try {
    await emailFormRef.value?.validate()
    emailLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('邮件设置保存成功')
  } catch (__error) {
    // 验证失败
  } finally {
    emailLoading.value = false
  }
}

/**
 * 测试邮件连接
 */
const handleEmailTest = async (): Promise<void> => {
  try {
    await emailFormRef.value?.validate()
    emailTestLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    message.success('邮件连接测试成功')
  } catch (__error) {
    message.error('邮件连接测试失败')
  } finally {
    emailTestLoading.value = false
  }
}

/**
 * 重置邮件设置
 */
const handleEmailReset = (): void => {
  emailFormRef.value?.resetFields()
}

/**
 * 保存存储设置
 */
const handleStorageSubmit = async (): Promise<void> => {
  try {
    await storageFormRef.value?.validate()
    storageLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('存储设置保存成功')
  } catch (__error) {
    // 验证失败
  } finally {
    storageLoading.value = false
  }
}

/**
 * 测试存储连接
 */
const handleStorageTest = async (): Promise<void> => {
  try {
    await storageFormRef.value?.validate()
    storageTestLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    message.success('存储连接测试成功')
  } catch (__error) {
    message.error('存储连接测试失败')
  } finally {
    storageTestLoading.value = false
  }
}

/**
 * 重置存储设置
 */
const handleStorageReset = (): void => {
  storageFormRef.value?.resetFields()
}

// 组件挂载时加载设置
onMounted(() => {
  loadSettings()
})
</script>

<style scoped lang="less">
.system-settings-container {
  padding: @spacing-xxl;
}

.settings-form {
  max-width: @container-lg;
}

.logo-uploader {
  display: block;
}

.logo-image {
  .avatar-style(100px, @border-radius-md);
  object-fit: cover;
}

.upload-placeholder {
  .center-flex();
  .flex-column();
  .avatar-style(100px, @border-radius-md);
  border: 1px dashed @border-color;
  background: @bg-color-light;
  cursor: pointer;
  transition: @transition-base;
  
  &:hover {
    border-color: @primary-color;
  }
  
  .anticon {
    font-size: @font-size-xxl;
    color: @text-color-disabled;
    margin-bottom: @spacing-sm;
  }
}

.ant-upload-text {
  color: @text-color-secondary;
  font-size: @font-size-xs;
}

:deep(.ant-tabs-card .ant-tabs-content) {
  margin-top: @spacing-lg;
}

:deep(.ant-form-item) {
  margin-bottom: @spacing-xxl;
}

:deep(.ant-divider) {
  margin: @spacing-xxl 0;
}
</style>