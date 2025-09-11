<template>
  <div class="settings-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">系统设置</h2>
        <p class="page-description">管理系统配置、参数和偏好设置</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button @click="refreshSettings">
            <ReloadOutlined />
            刷新
          </a-button>
          <a-button type="primary" @click="saveAllSettings">
            <SaveOutlined />
            保存所有设置
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 设置内容 -->
    <div class="content-section">
      <a-row :gutter="24">
        <!-- 左侧设置菜单 -->
        <a-col :span="6">
          <a-card class="settings-menu">
            <a-menu
              v-model:selectedKeys="selectedKeys"
              mode="vertical"
              @click="handleMenuClick"
            >
              <a-menu-item key="basic">
                <SettingOutlined />
                基础设置
              </a-menu-item>
              <a-menu-item key="security">
                <SafetyOutlined />
                安全设置
              </a-menu-item>
              <a-menu-item key="notification">
                <BellOutlined />
                通知设置
              </a-menu-item>
              <a-menu-item key="email">
                <MailOutlined />
                邮件设置
              </a-menu-item>
              <a-menu-item key="storage">
                <CloudOutlined />
                存储设置
              </a-menu-item>
              <a-menu-item key="payment">
                <CreditCardOutlined />
                支付设置
              </a-menu-item>
              <a-menu-item key="api">
                <ApiOutlined />
                API设置
              </a-menu-item>
              <a-menu-item key="backup">
                <DatabaseOutlined />
                备份设置
              </a-menu-item>
            </a-menu>
          </a-card>
        </a-col>

        <!-- 右侧设置内容 -->
        <a-col :span="18">
          <a-card class="settings-content">
            <!-- 基础设置 -->
            <div v-if="activeTab === 'basic'" class="setting-panel">
              <h3 class="panel-title">基础设置</h3>
              <a-form
                :model="basicSettings"
                layout="vertical"
                @finish="saveBasicSettings"
              >
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="网站名称">
                      <a-input v-model:value="basicSettings.siteName" placeholder="请输入网站名称" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="网站域名">
                      <a-input v-model:value="basicSettings.siteDomain" placeholder="请输入网站域名" />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-form-item label="网站描述">
                  <a-textarea
                    v-model:value="basicSettings.siteDescription"
                    placeholder="请输入网站描述"
                    :rows="3"
                  />
                </a-form-item>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="默认语言">
                      <a-select v-model:value="basicSettings.defaultLanguage" placeholder="请选择默认语言">
                        <a-select-option value="zh-CN">简体中文</a-select-option>
                        <a-select-option value="en-US">English</a-select-option>
                        <a-select-option value="ja-JP">日本語</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="时区">
                      <a-select v-model:value="basicSettings.timezone" placeholder="请选择时区">
                        <a-select-option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</a-select-option>
                        <a-select-option value="America/New_York">America/New_York (UTC-5)</a-select-option>
                        <a-select-option value="Europe/London">Europe/London (UTC+0)</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="维护模式">
                      <a-switch
                        v-model:checked="basicSettings.maintenanceMode"
                        checked-children="开启"
                        un-checked-children="关闭"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="用户注册">
                      <a-switch
                        v-model:checked="basicSettings.allowRegistration"
                        checked-children="允许"
                        un-checked-children="禁止"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-form-item>
                  <a-button type="primary" html-type="submit">
                    保存基础设置
                  </a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- 安全设置 -->
            <div v-if="activeTab === 'security'" class="setting-panel">
              <h3 class="panel-title">安全设置</h3>
              <a-form
                :model="securitySettings"
                layout="vertical"
                @finish="saveSecuritySettings"
              >
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="密码最小长度">
                      <a-input-number
                        v-model:value="securitySettings.minPasswordLength"
                        :min="6"
                        :max="20"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="登录失败锁定次数">
                      <a-input-number
                        v-model:value="securitySettings.maxLoginAttempts"
                        :min="3"
                        :max="10"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="会话超时时间（分钟）">
                      <a-input-number
                        v-model:value="securitySettings.sessionTimeout"
                        :min="15"
                        :max="1440"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="密码过期天数">
                      <a-input-number
                        v-model:value="securitySettings.passwordExpireDays"
                        :min="30"
                        :max="365"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="启用双因子认证">
                      <a-switch
                        v-model:checked="securitySettings.enableTwoFactor"
                        checked-children="开启"
                        un-checked-children="关闭"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="强制HTTPS">
                      <a-switch
                        v-model:checked="securitySettings.forceHttps"
                        checked-children="开启"
                        un-checked-children="关闭"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-form-item label="IP白名单">
                  <a-textarea
                    v-model:value="securitySettings.ipWhitelist"
                    placeholder="每行一个IP地址或IP段，例如：192.168.1.1 或 192.168.1.0/24"
                    :rows="4"
                  />
                </a-form-item>
                
                <a-form-item>
                  <a-button type="primary" html-type="submit">
                    保存安全设置
                  </a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- 通知设置 -->
            <div v-if="activeTab === 'notification'" class="setting-panel">
              <h3 class="panel-title">通知设置</h3>
              <a-form
                :model="notificationSettings"
                layout="vertical"
                @finish="saveNotificationSettings"
              >
                <div class="notification-group">
                  <h4>系统通知</h4>
                  <a-row :gutter="16">
                    <a-col :span="8">
                      <a-form-item label="新用户注册">
                        <a-switch v-model:checked="notificationSettings.newUserRegistration" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item label="系统错误">
                        <a-switch v-model:checked="notificationSettings.systemError" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item label="安全警告">
                        <a-switch v-model:checked="notificationSettings.securityAlert" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
                
                <a-divider />
                
                <div class="notification-group">
                  <h4>业务通知</h4>
                  <a-row :gutter="16">
                    <a-col :span="8">
                      <a-form-item label="新订单">
                        <a-switch v-model:checked="notificationSettings.newOrder" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item label="库存不足">
                        <a-switch v-model:checked="notificationSettings.lowStock" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item label="客服工单">
                        <a-switch v-model:checked="notificationSettings.customerService" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
                
                <a-divider />
                
                <div class="notification-group">
                  <h4>通知方式</h4>
                  <a-row :gutter="16">
                    <a-col :span="8">
                      <a-form-item label="站内消息">
                        <a-switch v-model:checked="notificationSettings.inSiteMessage" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item label="邮件通知">
                        <a-switch v-model:checked="notificationSettings.emailNotification" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item label="短信通知">
                        <a-switch v-model:checked="notificationSettings.smsNotification" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
                
                <a-form-item>
                  <a-button type="primary" html-type="submit">
                    保存通知设置
                  </a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- 邮件设置 -->
            <div v-if="activeTab === 'email'" class="setting-panel">
              <h3 class="panel-title">邮件设置</h3>
              <a-form
                :model="emailSettings"
                layout="vertical"
                @finish="saveEmailSettings"
              >
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="SMTP服务器">
                      <a-input v-model:value="emailSettings.smtpHost" placeholder="请输入SMTP服务器地址" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="SMTP端口">
                      <a-input-number
                        v-model:value="emailSettings.smtpPort"
                        :min="1"
                        :max="65535"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="发件人邮箱">
                      <a-input v-model:value="emailSettings.fromEmail" placeholder="请输入发件人邮箱" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="发件人名称">
                      <a-input v-model:value="emailSettings.fromName" placeholder="请输入发件人名称" />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="用户名">
                      <a-input v-model:value="emailSettings.username" placeholder="请输入SMTP用户名" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="密码">
                      <a-input-password v-model:value="emailSettings.password" placeholder="请输入SMTP密码" />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="加密方式">
                      <a-select v-model:value="emailSettings.encryption" placeholder="请选择加密方式">
                        <a-select-option value="none">无加密</a-select-option>
                        <a-select-option value="ssl">SSL</a-select-option>
                        <a-select-option value="tls">TLS</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="启用邮件服务">
                      <a-switch
                        v-model:checked="emailSettings.enabled"
                        checked-children="开启"
                        un-checked-children="关闭"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-form-item>
                  <a-space>
                    <a-button type="primary" html-type="submit">
                      保存邮件设置
                    </a-button>
                    <a-button @click="testEmailConnection">
                      测试连接
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </div>

            <!-- 存储设置 -->
            <div v-if="activeTab === 'storage'" class="setting-panel">
              <h3 class="panel-title">存储设置</h3>
              <a-form
                :model="storageSettings"
                layout="vertical"
                @finish="saveStorageSettings"
              >
                <a-form-item label="存储驱动">
                  <a-radio-group v-model:value="storageSettings.driver">
                    <a-radio value="local">本地存储</a-radio>
                    <a-radio value="oss">阿里云OSS</a-radio>
                    <a-radio value="cos">腾讯云COS</a-radio>
                    <a-radio value="s3">Amazon S3</a-radio>
                  </a-radio-group>
                </a-form-item>
                
                <!-- 本地存储设置 -->
                <div v-if="storageSettings.driver === 'local'">
                  <a-form-item label="存储路径">
                    <a-input v-model:value="storageSettings.localPath" placeholder="请输入本地存储路径" />
                  </a-form-item>
                  
                  <a-form-item label="访问URL前缀">
                    <a-input v-model:value="storageSettings.localUrlPrefix" placeholder="请输入访问URL前缀" />
                  </a-form-item>
                </div>
                
                <!-- 云存储设置 -->
                <div v-if="storageSettings.driver !== 'local'">
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item label="Access Key">
                        <a-input v-model:value="storageSettings.accessKey" placeholder="请输入Access Key" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="Secret Key">
                        <a-input-password v-model:value="storageSettings.secretKey" placeholder="请输入Secret Key" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item label="存储桶名称">
                        <a-input v-model:value="storageSettings.bucket" placeholder="请输入存储桶名称" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="地域">
                        <a-input v-model:value="storageSettings.region" placeholder="请输入地域" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  
                  <a-form-item label="自定义域名">
                    <a-input v-model:value="storageSettings.customDomain" placeholder="请输入自定义域名（可选）" />
                  </a-form-item>
                </div>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="最大文件大小（MB）">
                      <a-input-number
                        v-model:value="storageSettings.maxFileSize"
                        :min="1"
                        :max="1024"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="允许的文件类型">
                      <a-select
                        v-model:value="storageSettings.allowedTypes"
                        mode="multiple"
                        placeholder="请选择允许的文件类型"
                      >
                        <a-select-option value="image">图片</a-select-option>
                        <a-select-option value="video">视频</a-select-option>
                        <a-select-option value="audio">音频</a-select-option>
                        <a-select-option value="document">文档</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-form-item>
                  <a-space>
                    <a-button type="primary" html-type="submit">
                      保存存储设置
                    </a-button>
                    <a-button @click="testStorageConnection">
                      测试连接
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </div>

            <!-- 支付设置 -->
            <div v-if="activeTab === 'payment'" class="setting-panel">
              <h3 class="panel-title">支付设置</h3>
              <a-form
                :model="paymentSettings"
                layout="vertical"
                @finish="savePaymentSettings"
              >
                <div class="payment-method">
                  <h4>支付宝</h4>
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item label="应用ID">
                        <a-input v-model:value="paymentSettings.alipay.appId" placeholder="请输入支付宝应用ID" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="启用支付宝">
                        <a-switch v-model:checked="paymentSettings.alipay.enabled" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  
                  <a-form-item label="私钥">
                    <a-textarea
                      v-model:value="paymentSettings.alipay.privateKey"
                      placeholder="请输入支付宝私钥"
                      :rows="3"
                    />
                  </a-form-item>
                  
                  <a-form-item label="公钥">
                    <a-textarea
                      v-model:value="paymentSettings.alipay.publicKey"
                      placeholder="请输入支付宝公钥"
                      :rows="3"
                    />
                  </a-form-item>
                </div>
                
                <a-divider />
                
                <div class="payment-method">
                  <h4>微信支付</h4>
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item label="商户号">
                        <a-input v-model:value="paymentSettings.wechat.mchId" placeholder="请输入微信支付商户号" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="启用微信支付">
                        <a-switch v-model:checked="paymentSettings.wechat.enabled" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item label="应用ID">
                        <a-input v-model:value="paymentSettings.wechat.appId" placeholder="请输入微信应用ID" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="API密钥">
                        <a-input-password v-model:value="paymentSettings.wechat.apiKey" placeholder="请输入API密钥" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
                
                <a-form-item>
                  <a-button type="primary" html-type="submit">
                    保存支付设置
                  </a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- API设置 -->
            <div v-if="activeTab === 'api'" class="setting-panel">
              <h3 class="panel-title">API设置</h3>
              <a-form
                :model="apiSettings"
                layout="vertical"
                @finish="saveApiSettings"
              >
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="API版本">
                      <a-select v-model:value="apiSettings.version" placeholder="请选择API版本">
                        <a-select-option value="v1">v1.0</a-select-option>
                        <a-select-option value="v2">v2.0</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="请求频率限制（次/分钟）">
                      <a-input-number
                        v-model:value="apiSettings.rateLimit"
                        :min="10"
                        :max="10000"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="启用API文档">
                      <a-switch
                        v-model:checked="apiSettings.enableDocs"
                        checked-children="开启"
                        un-checked-children="关闭"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="启用CORS">
                      <a-switch
                        v-model:checked="apiSettings.enableCors"
                        checked-children="开启"
                        un-checked-children="关闭"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-form-item label="允许的域名">
                  <a-textarea
                    v-model:value="apiSettings.allowedOrigins"
                    placeholder="每行一个域名，例如：https://example.com"
                    :rows="4"
                  />
                </a-form-item>
                
                <a-form-item label="API密钥">
                  <a-input-group compact>
                    <a-input
                      v-model:value="apiSettings.apiKey"
                      style="width: calc(100% - 100px)"
                      placeholder="API密钥"
                      readonly
                    />
                    <a-button @click="generateApiKey">
                      重新生成
                    </a-button>
                  </a-input-group>
                </a-form-item>
                
                <a-form-item>
                  <a-button type="primary" html-type="submit">
                    保存API设置
                  </a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- 备份设置 -->
            <div v-if="activeTab === 'backup'" class="setting-panel">
              <h3 class="panel-title">备份设置</h3>
              <a-form
                :model="backupSettings"
                layout="vertical"
                @finish="saveBackupSettings"
              >
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="自动备份">
                      <a-switch
                        v-model:checked="backupSettings.autoBackup"
                        checked-children="开启"
                        un-checked-children="关闭"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="备份频率">
                      <a-select v-model:value="backupSettings.frequency" placeholder="请选择备份频率">
                        <a-select-option value="daily">每日</a-select-option>
                        <a-select-option value="weekly">每周</a-select-option>
                        <a-select-option value="monthly">每月</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="保留备份数量">
                      <a-input-number
                        v-model:value="backupSettings.retentionCount"
                        :min="1"
                        :max="30"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="备份时间">
                      <a-time-picker
                        v-model:value="backupSettings.backupTime"
                        format="HH:mm"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-form-item label="备份内容">
                  <a-checkbox-group v-model:value="backupSettings.backupContent">
                    <a-row>
                      <a-col :span="8">
                        <a-checkbox value="database">数据库</a-checkbox>
                      </a-col>
                      <a-col :span="8">
                        <a-checkbox value="files">文件</a-checkbox>
                      </a-col>
                      <a-col :span="8">
                        <a-checkbox value="config">配置</a-checkbox>
                      </a-col>
                    </a-row>
                  </a-checkbox-group>
                </a-form-item>
                
                <a-form-item label="备份存储位置">
                  <a-radio-group v-model:value="backupSettings.storageLocation">
                    <a-radio value="local">本地存储</a-radio>
                    <a-radio value="cloud">云存储</a-radio>
                  </a-radio-group>
                </a-form-item>
                
                <a-form-item>
                  <a-space>
                    <a-button type="primary" html-type="submit">
                      保存备份设置
                    </a-button>
                    <a-button @click="createBackupNow">
                      立即备份
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  ReloadOutlined,
  SaveOutlined,
  SettingOutlined,
  SafetyOutlined,
  BellOutlined,
  MailOutlined,
  CloudOutlined,
  CreditCardOutlined,
  ApiOutlined,
  DatabaseOutlined,
} from '@ant-design/icons-vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'


/**
 * 系统设置页面
 */

interface BasicSettings {
  siteName: string
  siteDomain: string
  siteDescription: string
  defaultLanguage: string
  timezone: string
  maintenanceMode: boolean
  allowRegistration: boolean
}

interface SecuritySettings {
  minPasswordLength: number
  maxLoginAttempts: number
  sessionTimeout: number
  passwordExpireDays: number
  enableTwoFactor: boolean
  forceHttps: boolean
  ipWhitelist: string
}

interface NotificationSettings {
  newUserRegistration: boolean
  systemError: boolean
  securityAlert: boolean
  newOrder: boolean
  lowStock: boolean
  customerService: boolean
  inSiteMessage: boolean
  emailNotification: boolean
  smsNotification: boolean
}

interface EmailSettings {
  smtpHost: string
  smtpPort: number
  fromEmail: string
  fromName: string
  username: string
  password: string
  encryption: string
  enabled: boolean
}

interface StorageSettings {
  driver: string
  localPath: string
  localUrlPrefix: string
  accessKey: string
  secretKey: string
  bucket: string
  region: string
  customDomain: string
  maxFileSize: number
  allowedTypes: string[]
}

interface PaymentSettings {
  alipay: {
    appId: string
    privateKey: string
    publicKey: string
    enabled: boolean
  }
  wechat: {
    mchId: string
    appId: string
    apiKey: string
    enabled: boolean
  }
}

interface ApiSettings {
  version: string
  rateLimit: number
  enableDocs: boolean
  enableCors: boolean
  allowedOrigins: string
  apiKey: string
}

interface BackupSettings {
  autoBackup: boolean
  frequency: string
  retentionCount: number
  backupTime: any
  backupContent: string[]
  storageLocation: string
}

// 响应式数据
const selectedKeys = ref(['basic'])
const activeTab = ref('basic')

// 基础设置
const basicSettings = reactive<BasicSettings>({
  siteName: '',
  siteDomain: '',
  siteDescription: '',
  defaultLanguage: 'zh-CN',
  timezone: 'Asia/Shanghai',
  maintenanceMode: false,
  allowRegistration: true,
})

// 安全设置
const securitySettings = reactive<SecuritySettings>({
  minPasswordLength: 8,
  maxLoginAttempts: 5,
  sessionTimeout: 120,
  passwordExpireDays: 90,
  enableTwoFactor: false,
  forceHttps: true,
  ipWhitelist: '',
})

// 通知设置
const notificationSettings = reactive<NotificationSettings>({
  newUserRegistration: true,
  systemError: true,
  securityAlert: true,
  newOrder: true,
  lowStock: true,
  customerService: true,
  inSiteMessage: true,
  emailNotification: true,
  smsNotification: false,
})

// 邮件设置
const emailSettings = reactive<EmailSettings>({
  smtpHost: '',
  smtpPort: 587,
  fromEmail: '',
  fromName: '',
  username: '',
  password: '',
  encryption: 'tls',
  enabled: false,
})

// 存储设置
const storageSettings = reactive<StorageSettings>({
  driver: 'local',
  localPath: '/uploads',
  localUrlPrefix: '/storage',
  accessKey: '',
  secretKey: '',
  bucket: '',
  region: '',
  customDomain: '',
  maxFileSize: 10,
  allowedTypes: ['image', 'document'],
})

// 支付设置
const paymentSettings = reactive<PaymentSettings>({
  alipay: {
    appId: '',
    privateKey: '',
    publicKey: '',
    enabled: false,
  },
  wechat: {
    mchId: '',
    appId: '',
    apiKey: '',
    enabled: false,
  },
})

// API设置
const apiSettings = reactive<ApiSettings>({
  version: 'v1',
  rateLimit: 1000,
  enableDocs: true,
  enableCors: true,
  allowedOrigins: '',
  apiKey: '',
})

// 备份设置
const backupSettings = reactive<BackupSettings>({
  autoBackup: true,
  frequency: 'daily',
  retentionCount: 7,
  backupTime: null,
  backupContent: ['database', 'files'],
  storageLocation: 'local',
})

/**
 * 菜单点击处理
 */
const handleMenuClick = (info: MenuInfo): void => {
  activeTab.value = info.key as string
  selectedKeys.value = [info.key as string]
}

/**
 * 加载设置数据
 */
const loadSettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 加载基础设置
    Object.assign(basicSettings, {
      siteName: '商城管理系统',
      siteDomain: 'https://shop.example.com',
      siteDescription: '专业的电商管理平台',
      defaultLanguage: 'zh-CN',
      timezone: 'Asia/Shanghai',
      maintenanceMode: false,
      allowRegistration: true,
    })
    
    // 生成API密钥
    if (!apiSettings.apiKey) {
      apiSettings.apiKey = generateRandomKey()
    }
    
    message.success('设置加载成功')
  } catch (__error) {
    message.error('设置加载失败')
  }
}

/**
 * 生成随机密钥
 */
const generateRandomKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 保存基础设置
 */
const saveBasicSettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('基础设置保存成功')
  } catch (__error) {
    message.error('基础设置保存失败')
  }
}

/**
 * 保存安全设置
 */
const saveSecuritySettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('安全设置保存成功')
  } catch (__error) {
    message.error('安全设置保存失败')
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
 * 保存邮件设置
 */
const saveEmailSettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('邮件设置保存成功')
  } catch (__error) {
    message.error('邮件设置保存失败')
  }
}

/**
 * 测试邮件连接
 */
const testEmailConnection = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('邮件连接测试成功')
  } catch (__error) {
    message.error('邮件连接测试失败')
  }
}

/**
 * 保存存储设置
 */
const saveStorageSettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('存储设置保存成功')
  } catch (__error) {
    message.error('存储设置保存失败')
  }
}

/**
 * 测试存储连接
 */
const testStorageConnection = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('存储连接测试成功')
  } catch (__error) {
    message.error('存储连接测试失败')
  }
}

/**
 * 保存支付设置
 */
const savePaymentSettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('支付设置保存成功')
  } catch (__error) {
    message.error('支付设置保存失败')
  }
}

/**
 * 保存API设置
 */
const saveApiSettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('API设置保存成功')
  } catch (__error) {
    message.error('API设置保存失败')
  }
}

/**
 * 生成API密钥
 */
const generateApiKey = (): void => {
  apiSettings.apiKey = generateRandomKey()
  message.success('API密钥已重新生成')
}

/**
 * 保存备份设置
 */
const saveBackupSettings = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('备份设置保存成功')
  } catch (__error) {
    message.error('备份设置保存失败')
  }
}

/**
 * 立即创建备份
 */
const createBackupNow = async (): Promise<void> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    message.success('备份创建成功')
  } catch (__error) {
    message.error('备份创建失败')
  }
}

/**
 * 刷新设置
 */
const refreshSettings = (): void => {
  loadSettings()
}

/**
 * 保存所有设置
 */
const saveAllSettings = async (): Promise<void> => {
  try {
    // 模拟保存所有设置
    await Promise.all([
      saveBasicSettings(),
      saveSecuritySettings(),
      saveNotificationSettings(),
      saveEmailSettings(),
      saveStorageSettings(),
      savePaymentSettings(),
      saveApiSettings(),
      saveBackupSettings(),
    ])
    
    message.success('所有设置保存成功')
  } catch (__error) {
    message.error('设置保存失败')
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadSettings()
})
</script>

<style scoped lang="scss">
.settings-view {
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

  .content-section {
    .settings-menu {
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

    .settings-content {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .setting-panel {
        .panel-title {
          margin: 0 0 24px 0;
          font-size: 18px;
          font-weight: 600;
          color: #262626;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 12px;
        }

        .notification-group {
          margin-bottom: 24px;

          h4 {
            margin: 0 0 16px 0;
            font-size: 14px;
            font-weight: 600;
            color: #595959;
          }
        }

        .payment-method {
          margin-bottom: 24px;

          h4 {
            margin: 0 0 16px 0;
            font-size: 14px;
            font-weight: 600;
            color: #595959;
          }
        }

        .ant-form-item {
          margin-bottom: 16px;
        }

        .ant-input-group {
          .ant-btn {
            border-left: 0;
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

    .content-section {
      .ant-col {
        margin-bottom: 16px;
      }
    }
  }
}
</style>