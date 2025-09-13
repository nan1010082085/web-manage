<template>
  <div class="help-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">帮助中心</h2>
        <p class="page-description">查找答案、获取帮助和联系支持团队</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button @click="refreshHelp">
            <ReloadOutlined />
            刷新
          </a-button>
          <a-button type="primary" @click="contactSupport">
            <CustomerServiceOutlined />
            联系支持
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <a-card>
        <div class="search-content">
          <h3>有什么可以帮助您的？</h3>
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索帮助文档、常见问题..."
            size="large"
            @search="handleSearch"
          >
            <template #enterButton>
              <a-button type="primary">
                <SearchOutlined />
                搜索
              </a-button>
            </template>
          </a-input-search>
          
          <!-- 热门搜索 -->
          <div class="hot-searches">
            <span class="hot-label">热门搜索：</span>
            <a-space wrap>
              <a-tag
                v-for="tag in hotSearches"
                :key="tag"
                @click="searchKeyword = tag; handleSearch(tag)"
                style="cursor: pointer"
              >
                {{ tag }}
              </a-tag>
            </a-space>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-section">
      <a-row :gutter="24">
        <!-- 左侧分类菜单 -->
        <a-col :span="6">
          <a-card class="category-menu">
            <h4>帮助分类</h4>
            <a-menu
              v-model:selectedKeys="selectedCategory"
              mode="vertical"
              @click="handleCategoryClick"
            >
              <a-menu-item key="all">
                <AppstoreOutlined />
                全部
              </a-menu-item>
              <a-menu-item key="getting-started">
                <RocketOutlined />
                快速入门
              </a-menu-item>
              <a-menu-item key="user-guide">
                <BookOutlined />
                用户指南
              </a-menu-item>
              <a-menu-item key="faq">
                <QuestionCircleOutlined />
                常见问题
              </a-menu-item>
              <a-menu-item key="api">
                <CodeOutlined />
                API文档
              </a-menu-item>
              <a-menu-item key="troubleshooting">
                <ToolOutlined />
                故障排除
              </a-menu-item>
              <a-menu-item key="video">
                <PlayCircleOutlined />
                视频教程
              </a-menu-item>
              <a-menu-item key="download">
                <DownloadOutlined />
                资源下载
              </a-menu-item>
            </a-menu>
          </a-card>
        </a-col>

        <!-- 右侧内容 -->
        <a-col :span="18">
          <!-- 搜索结果 -->
          <div v-if="showSearchResults" class="search-results">
            <a-card>
              <div class="results-header">
                <h4>搜索结果</h4>
                <span class="results-count">找到 {{ searchResults.length }} 个结果</span>
              </div>
              
              <div class="results-list">
                <div
                  v-for="result in searchResults"
                  :key="result.id"
                  class="result-item"
                  @click="viewArticle(result)"
                >
                  <div class="result-content">
                    <h5 class="result-title">{{ result.title }}</h5>
                    <p class="result-summary">{{ result.summary }}</p>
                    <div class="result-meta">
                      <a-space>
                        <a-tag :color="getCategoryColor(result.category)">{{ getCategoryName(result.category) }}</a-tag>
                        <span class="result-date">{{ formatDate(result.updatedAt) }}</span>
                        <span class="result-views">{{ result.views }} 次查看</span>
                      </a-space>
                    </div>
                  </div>
                  <div class="result-action">
                    <RightOutlined />
                  </div>
                </div>
              </div>
              
              <div v-if="searchResults.length === 0" class="no-results">
                <a-empty description="没有找到相关内容">
                  <template #image>
                    <SearchOutlined style="font-size: 48px; color: #d9d9d9" />
                  </template>
                </a-empty>
              </div>
            </a-card>
          </div>

          <!-- 分类内容 -->
          <div v-else class="category-content">
            <!-- 快速入门 -->
            <div v-if="activeCategory === 'getting-started'" class="help-section">
              <a-card>
                <h4>快速入门</h4>
                <div class="guide-steps">
                  <a-steps direction="vertical" :current="-1">
                    <a-step
                      v-for="step in gettingStartedSteps"
                      :key="step.id"
                      :title="step.title"
                      :description="step.description"
                    >
                      <template #icon>
                        <component :is="step.icon" />
                      </template>
                    </a-step>
                  </a-steps>
                </div>
                
                <div class="guide-actions">
                  <a-space>
                    <a-button type="primary" @click="startTour">
                      <PlayCircleOutlined />
                      开始引导
                    </a-button>
                    <a-button @click="downloadGuide">
                      <DownloadOutlined />
                      下载指南
                    </a-button>
                  </a-space>
                </div>
              </a-card>
            </div>

            <!-- 用户指南 -->
            <div v-if="activeCategory === 'user-guide'" class="help-section">
              <a-card>
                <h4>用户指南</h4>
                <div class="guide-grid">
                  <div
                    v-for="guide in userGuides"
                    :key="guide.id"
                    class="guide-item"
                    @click="viewGuide(guide)"
                  >
                    <div class="guide-icon">
                      <component :is="guide.icon" />
                    </div>
                    <div class="guide-content">
                      <h5>{{ guide.title }}</h5>
                      <p>{{ guide.description }}</p>
                    </div>
                    <div class="guide-meta">
                      <span>{{ guide.articles }} 篇文章</span>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>

            <!-- 常见问题 -->
            <div v-if="activeCategory === 'faq'" class="help-section">
              <a-card>
                <h4>常见问题</h4>
                <a-collapse v-model:activeKey="faqActiveKeys" ghost>
                  <a-collapse-panel
                    v-for="faq in faqs"
                    :key="faq.id"
                    :header="faq.question"
                  >
                    <div class="faq-answer" v-html="faq.answer"></div>
                    <div class="faq-actions">
                      <a-space>
                        <a-button size="small" @click="likeFaq(faq.id)">
                          <LikeOutlined :style="{ color: faq.liked ? '#1890ff' : '' }" />
                          有用 ({{ faq.likes }})
                        </a-button>
                        <a-button size="small" @click="dislikeFaq(faq.id)">
                          <DislikeOutlined :style="{ color: faq.disliked ? '#ff4d4f' : '' }" />
                          无用 ({{ faq.dislikes }})
                        </a-button>
                      </a-space>
                    </div>
                  </a-collapse-panel>
                </a-collapse>
              </a-card>
            </div>

            <!-- API文档 -->
            <div v-if="activeCategory === 'api'" class="help-section">
              <a-card>
                <h4>API文档</h4>
                <div class="api-sections">
                  <div
                    v-for="api in apiDocs"
                    :key="api.id"
                    class="api-item"
                    @click="viewApiDoc(api)"
                  >
                    <div class="api-method">
                      <a-tag :color="getMethodColor(api.method)">{{ api.method }}</a-tag>
                    </div>
                    <div class="api-content">
                      <h5>{{ api.title }}</h5>
                      <p class="api-path">{{ api.path }}</p>
                      <p class="api-desc">{{ api.description }}</p>
                    </div>
                    <div class="api-status">
                      <a-tag :color="api.status === 'stable' ? 'green' : 'orange'">
                        {{ api.status === 'stable' ? '稳定' : '测试' }}
                      </a-tag>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>

            <!-- 视频教程 -->
            <div v-if="activeCategory === 'video'" class="help-section">
              <a-card>
                <h4>视频教程</h4>
                <div class="video-grid">
                  <div
                    v-for="video in videos"
                    :key="video.id"
                    class="video-item"
                    @click="playVideo(video)"
                  >
                    <div class="video-thumbnail">
                      <img :src="video.thumbnail" :alt="video.title" />
                      <div class="video-overlay">
                        <PlayCircleOutlined class="play-icon" />
                      </div>
                      <div class="video-duration">{{ video.duration }}</div>
                    </div>
                    <div class="video-content">
                      <h5>{{ video.title }}</h5>
                      <p>{{ video.description }}</p>
                      <div class="video-meta">
                        <a-space>
                          <span>{{ video.views }} 次观看</span>
                          <span>{{ formatDate(video.createdAt) }}</span>
                        </a-space>
                      </div>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>

            <!-- 资源下载 -->
            <div v-if="activeCategory === 'download'" class="help-section">
              <a-card>
                <h4>资源下载</h4>
                <div class="download-list">
                  <div
                    v-for="resource in downloadResources"
                    :key="resource.id"
                    class="download-item"
                  >
                    <div class="download-icon">
                      <component :is="getFileIcon(resource.type)" />
                    </div>
                    <div class="download-content">
                      <h5>{{ resource.title }}</h5>
                      <p>{{ resource.description }}</p>
                      <div class="download-meta">
                        <a-space>
                          <span>{{ resource.size }}</span>
                          <span>{{ resource.downloads }} 次下载</span>
                          <span>{{ formatDate(resource.updatedAt) }}</span>
                        </a-space>
                      </div>
                    </div>
                    <div class="download-action">
                      <a-button type="primary" @click="downloadResource(resource)">
                        <DownloadOutlined />
                        下载
                      </a-button>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>

            <!-- 默认首页 -->
            <div v-if="activeCategory === 'all'" class="help-section">
              <!-- 热门文章 -->
              <a-card class="popular-articles">
                <h4>热门文章</h4>
                <div class="article-list">
                  <div
                    v-for="article in popularArticles"
                    :key="article.id"
                    class="article-item"
                    @click="viewArticle(article)"
                  >
                    <div class="article-content">
                      <h5>{{ article.title }}</h5>
                      <p>{{ article.summary }}</p>
                      <div class="article-meta">
                        <a-space>
                          <a-tag :color="getCategoryColor(article.category)">{{ getCategoryName(article.category) }}</a-tag>
                          <span>{{ article.views }} 次查看</span>
                        </a-space>
                      </div>
                    </div>
                    <div class="article-action">
                      <RightOutlined />
                    </div>
                  </div>
                </div>
              </a-card>

              <!-- 快捷入口 -->
              <a-card class="quick-access">
                <h4>快捷入口</h4>
                <div class="access-grid">
                  <div
                    v-for="access in quickAccess"
                    :key="access.id"
                    class="access-item"
                    @click="handleQuickAccess(access)"
                  >
                    <div class="access-icon">
                      <component :is="access.icon" />
                    </div>
                    <div class="access-content">
                      <h5>{{ access.title }}</h5>
                      <p>{{ access.description }}</p>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 联系支持弹窗 -->
    <a-modal
      v-model:open="supportModalVisible"
      title="联系支持"
      :footer="null"
      width="600px"
     ok-text="确定" cancel-text="取消">
      <a-tabs v-model:activeKey="supportActiveTab">
        <a-tab-pane key="ticket" tab="提交工单">
          <a-form
            :model="supportForm"
            layout="vertical"
            @finish="submitSupportTicket"
          >
            <a-form-item
              label="问题类型"
              name="type"
              :rules="[{ required: true, message: '请选择问题类型' }]"
            >
              <a-select v-model:value="supportForm.type" placeholder="请选择问题类型">
                <a-select-option value="bug">Bug反馈</a-select-option>
                <a-select-option value="feature">功能建议</a-select-option>
                <a-select-option value="question">使用问题</a-select-option>
                <a-select-option value="other">其他</a-select-option>
              </a-select>
            </a-form-item>
            
            <a-form-item
              label="优先级"
              name="priority"
              :rules="[{ required: true, message: '请选择优先级' }]"
            >
              <a-radio-group v-model:value="supportForm.priority">
                <a-radio value="low">低</a-radio>
                <a-radio value="medium">中</a-radio>
                <a-radio value="high">高</a-radio>
                <a-radio value="urgent">紧急</a-radio>
              </a-radio-group>
            </a-form-item>
            
            <a-form-item
              label="问题标题"
              name="title"
              :rules="[{ required: true, message: '请输入问题标题' }]"
            >
              <a-input v-model:value="supportForm.title" placeholder="请简要描述问题" />
            </a-form-item>
            
            <a-form-item
              label="问题描述"
              name="description"
              :rules="[{ required: true, message: '请输入问题描述' }]"
            >
              <a-textarea
                v-model:value="supportForm.description"
                placeholder="请详细描述问题，包括复现步骤、期望结果等"
                :rows="6"
              />
            </a-form-item>
            
            <a-form-item label="附件">
              <a-upload
                v-model:file-list="supportForm.attachments"
                :before-upload="() => false"
                multiple
              >
                <a-button>
                  <UploadOutlined />
                  上传文件
                </a-button>
              </a-upload>
            </a-form-item>
            
            <a-form-item>
              <a-space>
                <a-button type="primary" html-type="submit" :loading="supportSubmitting">
                  提交工单
                </a-button>
                <a-button @click="supportModalVisible = false">
                  取消
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        
        <a-tab-pane key="contact" tab="联系方式">
          <div class="contact-info">
            <div class="contact-item">
              <h5><PhoneOutlined /> 客服热线</h5>
              <p>400-123-4567</p>
              <p class="contact-time">工作时间：周一至周五 9:00-18:00</p>
            </div>
            
            <div class="contact-item">
              <h5><MailOutlined /> 邮箱支持</h5>
              <p>support@example.com</p>
              <p class="contact-time">24小时内回复</p>
            </div>
            
            <div class="contact-item">
              <h5><WechatOutlined /> 微信客服</h5>
              <p>扫描二维码添加客服微信</p>
              <div class="qr-code">
                <img src="/images/wechat-qr.png" alt="微信二维码" />
              </div>
            </div>
            
            <div class="contact-item">
              <h5><GlobalOutlined /> 在线客服</h5>
              <p>点击右下角客服图标开始对话</p>
              <a-button type="primary" @click="openLiveChat">
                开始对话
              </a-button>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <!-- 文章详情弹窗 -->
    <a-modal
      v-model:open="articleModalVisible"
      :title="currentArticle?.title"
      :footer="null"
      width="800px"
      class="article-modal"
     ok-text="确定" cancel-text="取消">
      <div v-if="currentArticle" class="article-detail">
        <div class="article-meta">
          <a-space>
            <a-tag :color="getCategoryColor(currentArticle.category)">{{ getCategoryName(currentArticle.category) }}</a-tag>
            <span>{{ formatDate(currentArticle.updatedAt) }}</span>
            <span>{{ currentArticle.views }} 次查看</span>
          </a-space>
        </div>
        
        <div class="article-content" v-html="currentArticle.content"></div>
        
        <div class="article-actions">
          <a-space>
            <a-button @click="likeArticle(currentArticle.id)">
              <LikeOutlined :style="{ color: currentArticle.liked ? '#1890ff' : '' }" />
              有用 ({{ currentArticle.likes }})
            </a-button>
            <a-button @click="shareArticle(currentArticle)">
              <ShareAltOutlined />
              分享
            </a-button>
            <a-button @click="printArticle(currentArticle)">
              <PrinterOutlined />
              打印
            </a-button>
          </a-space>
        </div>
      </div>
    </a-modal>

    <!-- 视频播放弹窗 -->
    <a-modal
      v-model:open="videoModalVisible"
      :title="currentVideo?.title"
      :footer="null"
      width="900px"
      class="video-modal"
     ok-text="确定" cancel-text="取消">
      <div v-if="currentVideo" class="video-player">
        <video
          ref="videoPlayer"
          :src="currentVideo.url"
          controls
          width="100%"
          height="500px"
        ></video>
        
        <div class="video-info">
          <p>{{ currentVideo.description }}</p>
          <div class="video-meta">
            <a-space>
              <span>时长：{{ currentVideo.duration }}</span>
              <span>观看：{{ currentVideo.views }} 次</span>
              <span>发布：{{ formatDate(currentVideo.createdAt) }}</span>
            </a-space>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  ReloadOutlined,
  CustomerServiceOutlined,
  SearchOutlined,
  AppstoreOutlined,
  RocketOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  CodeOutlined,
  ToolOutlined,
  PlayCircleOutlined,
  DownloadOutlined,
  RightOutlined,
  LikeOutlined,
  DislikeOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  WechatOutlined,
  GlobalOutlined,
  ShareAltOutlined,
  PrinterOutlined,
  UserOutlined,
  SettingOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileZipOutlined,
} from '@ant-design/icons-vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import dayjs from 'dayjs'
import { debounce, filter, get, truncate, trim, isString, isNumber } from 'lodash-es'

// 创建防抖搜索函数
const createDebouncedSearch = <T extends (...args: any[]) => any>(
  searchFn: T,
  delay = 300
): any => {
  return debounce(searchFn, delay)
}

// 搜索过滤器
const searchFilter = <T extends Record<string, any>>(
  items: T[],
  searchText: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchText || !searchText.trim()) return items

  const lowerSearchText = searchText.toLowerCase().trim()
  
  return filter(items, (item) => {
    return searchFields.some((field) => {
      const value = get(item, field as string)
      if (isString(value)) {
        return value.toLowerCase().includes(lowerSearchText)
      }
      if (isNumber(value)) {
        return value.toString().includes(lowerSearchText)
      }
      return false
    })
  })
}

// 安全获取对象属性值
const safeGet = <T, R = any>(
  obj: T,
  path: string,
  defaultValue?: R
): any => {
  return get(obj, path, defaultValue)
}

// 格式化文本
const formatText = (
  text: string,
  maxLength = 50,
  suffix = '...'
): string => {
  if (!isString(text)) return ''
  return truncate(trim(text), { length: maxLength, omission: suffix })
}

/**
 * 帮助中心页面
 */

interface HelpArticle {
  id: string
  title: string
  summary: string
  content: string
  category: string
  views: number
  likes: number
  dislikes?: number
  liked?: boolean
  disliked?: boolean
  updatedAt: string
  createdAt: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  likes: number
  dislikes: number
  liked?: boolean
  disliked?: boolean
}

interface APIDoc {
  id: string
  title: string
  path: string
  method: string
  description: string
  status: string
}

interface Video {
  id: string
  title: string
  description: string
  url: string
  thumbnail: string
  duration: string
  views: number
  createdAt: string
}

interface DownloadResource {
  id: string
  title: string
  description: string
  type: string
  size: string
  downloads: number
  url: string
  updatedAt: string
}

interface SupportForm {
  type: string
  priority: string
  title: string
  description: string
  attachments: any[]
}

interface GettingStartedStep {
  id: string
  title: string
  description: string
  icon: string
}

interface UserGuide {
  id: string
  title: string
  description: string
  icon: string
  articles: number
}

interface QuickAccess {
  id: string
  title: string
  description: string
  icon: string
  action: string
}

// 响应式数据
const searchKeyword = ref('')
const selectedCategory = ref(['all'])
const activeCategory = ref('all')
const showSearchResults = ref(false)
const searchResults = ref<HelpArticle[]>([])
const faqActiveKeys = ref<string[]>([])

// 弹窗状态
const supportModalVisible = ref(false)
const supportActiveTab = ref('ticket')
const supportSubmitting = ref(false)
const articleModalVisible = ref(false)
const videoModalVisible = ref(false)

// 当前查看的内容
const currentArticle = ref<HelpArticle | null>(null)
const currentVideo = ref<Video | null>(null)

// 支持表单
const supportForm = reactive<SupportForm>({
  type: '',
  priority: 'medium',
  title: '',
  description: '',
  attachments: [],
})

// 热门搜索
const hotSearches = ref([
  '如何创建订单',
  '支付问题',
  '账户设置',
  '数据导出',
  '权限管理',
  'API接口',
])

// 快速入门步骤
const gettingStartedSteps = ref<GettingStartedStep[]>([
  {
    id: '1',
    title: '注册账户',
    description: '创建您的账户并完成邮箱验证',
    icon: 'UserOutlined',
  },
  {
    id: '2',
    title: '基础设置',
    description: '配置基本信息和偏好设置',
    icon: 'SettingOutlined',
  },
  {
    id: '3',
    title: '创建第一个项目',
    description: '开始使用系统创建您的第一个项目',
    icon: 'RocketOutlined',
  },
  {
    id: '4',
    title: '邀请团队成员',
    description: '邀请同事加入您的团队',
    icon: 'UserOutlined',
  },
])

// 用户指南
const userGuides = ref<UserGuide[]>([
  {
    id: '1',
    title: '订单管理',
    description: '学习如何创建、编辑和管理订单',
    icon: 'ShoppingOutlined',
    articles: 12,
  },
  {
    id: '2',
    title: '用户管理',
    description: '了解用户注册、权限和角色管理',
    icon: 'UserOutlined',
    articles: 8,
  },
  {
    id: '3',
    title: '数据分析',
    description: '掌握数据统计和报表功能',
    icon: 'BarChartOutlined',
    articles: 15,
  },
  {
    id: '4',
    title: '系统设置',
    description: '配置系统参数和个性化设置',
    icon: 'SettingOutlined',
    articles: 6,
  },
])

// 常见问题
const faqs = ref<FAQ[]>([
  {
    id: '1',
    question: '如何重置密码？',
    answer: '您可以在登录页面点击"忘记密码"链接，输入您的邮箱地址，系统会发送重置密码的邮件到您的邮箱。',
    likes: 25,
    dislikes: 2,
    liked: false,
    disliked: false,
  },
  {
    id: '2',
    question: '如何修改个人信息？',
    answer: '登录后点击右上角头像，选择"个人中心"，在基本信息页面可以修改您的个人信息。',
    likes: 18,
    dislikes: 1,
    liked: false,
    disliked: false,
  },
  {
    id: '3',
    question: '支持哪些支付方式？',
    answer: '我们支持支付宝、微信支付、银行卡支付等多种支付方式，具体可在支付页面查看。',
    likes: 32,
    dislikes: 0,
    liked: false,
    disliked: false,
  },
])

// API文档
const apiDocs = ref<APIDoc[]>([
  {
    id: '1',
    title: '用户认证',
    path: '/api/auth/login',
    method: 'POST',
    description: '用户登录接口',
    status: 'stable',
  },
  {
    id: '2',
    title: '获取用户信息',
    path: '/api/user/profile',
    method: 'GET',
    description: '获取当前用户的详细信息',
    status: 'stable',
  },
  {
    id: '3',
    title: '创建订单',
    path: '/api/orders',
    method: 'POST',
    description: '创建新的订单',
    status: 'beta',
  },
])

// 视频教程
const videos = ref<Video[]>([
  {
    id: '1',
    title: '系统概览介绍',
    description: '了解系统的主要功能和界面布局',
    url: '/videos/overview.mp4',
    thumbnail: '/images/video-thumb-1.jpg',
    duration: '05:30',
    views: 1250,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    title: '订单管理教程',
    description: '学习如何创建和管理订单',
    url: '/videos/orders.mp4',
    thumbnail: '/images/video-thumb-2.jpg',
    duration: '08:45',
    views: 980,
    createdAt: '2024-01-08',
  },
])

// 下载资源
const downloadResources = ref<DownloadResource[]>([
  {
    id: '1',
    title: '用户手册',
    description: '完整的用户操作手册PDF版本',
    type: 'pdf',
    size: '2.5MB',
    downloads: 1520,
    url: '/downloads/user-manual.pdf',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'API文档',
    description: '开发者API接口文档',
    type: 'zip',
    size: '1.8MB',
    downloads: 680,
    url: '/downloads/api-docs.zip',
    updatedAt: '2024-01-12',
  },
])

// 热门文章
const popularArticles = ref<HelpArticle[]>([
  {
    id: '1',
    title: '快速入门指南',
    summary: '帮助新用户快速了解和使用系统的基本功能',
    content: '<h3>快速入门指南</h3><p>欢迎使用我们的系统...</p>',
    category: 'getting-started',
    views: 2580,
    likes: 45,
    updatedAt: '2024-01-15',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: '订单管理最佳实践',
    summary: '介绍订单管理的最佳实践和常见问题解决方案',
    content: '<h3>订单管理最佳实践</h3><p>订单管理是系统的核心功能...</p>',
    category: 'user-guide',
    views: 1890,
    likes: 32,
    updatedAt: '2024-01-14',
    createdAt: '2024-01-05',
  },
])

// 快捷入口
const quickAccess = ref<QuickAccess[]>([
  {
    id: '1',
    title: '提交工单',
    description: '遇到问题？立即提交支持工单',
    icon: 'CustomerServiceOutlined',
    action: 'support',
  },
  {
    id: '2',
    title: '视频教程',
    description: '观看视频快速学习系统使用',
    icon: 'PlayCircleOutlined',
    action: 'video',
  },
  {
    id: '3',
    title: 'API文档',
    description: '查看完整的API接口文档',
    icon: 'CodeOutlined',
    action: 'api',
  },
  {
    id: '4',
    title: '下载资源',
    description: '下载用户手册和相关资料',
    icon: 'DownloadOutlined',
    action: 'download',
  },
])

/**
 * 分类点击处理
 */
const handleCategoryClick = (info: MenuInfo): void => {
  activeCategory.value = info.key as string
  selectedCategory.value = [info.key as string]
  showSearchResults.value = false
}

/**
 * 搜索处理
 */
const handleSearch = createDebouncedSearch((keyword: string): void => {
  if (!keyword.trim()) {
    showSearchResults.value = false
    return
  }
  
  // 使用 lodash 搜索过滤器
  searchResults.value = searchFilter(
    popularArticles.value,
    keyword,
    ['title', 'summary']
  )
  
  showSearchResults.value = true
  message.success(`找到 ${searchResults.value.length} 个相关结果`)
}, 300)

/**
 * 格式化日期
 */
const formatDate = (date: string): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * 获取分类颜色
 */
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'getting-started': 'green',
    'user-guide': 'blue',
    'faq': 'orange',
    'api': 'purple',
    'troubleshooting': 'red',
    'video': 'cyan',
    'download': 'magenta',
  }
  return colorMap[category] || 'default'
}

/**
 * 获取分类名称
 */
const getCategoryName = (category: string): string => {
  const nameMap: Record<string, string> = {
    'getting-started': '快速入门',
    'user-guide': '用户指南',
    'faq': '常见问题',
    'api': 'API文档',
    'troubleshooting': '故障排除',
    'video': '视频教程',
    'download': '资源下载',
  }
  return nameMap[category] || category
}

/**
 * 获取HTTP方法颜色
 */
const getMethodColor = (method: string): string => {
  const colorMap: Record<string, string> = {
    'GET': 'green',
    'POST': 'blue',
    'PUT': 'orange',
    'DELETE': 'red',
    'PATCH': 'purple',
  }
  return colorMap[method] || 'default'
}

/**
 * 获取文件图标
 */
const getFileIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    'pdf': 'FilePdfOutlined',
    'doc': 'FileWordOutlined',
    'docx': 'FileWordOutlined',
    'xls': 'FileExcelOutlined',
    'xlsx': 'FileExcelOutlined',
    'zip': 'FileZipOutlined',
    'rar': 'FileZipOutlined',
  }
  return iconMap[type] || 'FileTextOutlined'
}

/**
 * 查看文章
 */
const viewArticle = (article: HelpArticle): void => {
  currentArticle.value = article
  articleModalVisible.value = true
  
  // 增加浏览量
  article.views++
}

/**
 * 查看用户指南
 */
const viewGuide = (guide: UserGuide): void => {
  // 将UserGuide转换为HelpArticle格式
  const article: HelpArticle = {
    id: guide.id,
    title: guide.title,
    summary: guide.description,
    content: `这是${guide.title}的详细内容...`,
    category: '用户指南',
    views: 0,
    likes: 0,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
  viewArticle(article)
}

/**
 * 查看API文档
 */
const viewApiDoc = (api: APIDoc): void => {
  // 跳转到API文档页面或打开新窗口
  window.open(`/api-docs/${api.id}`, '_blank')
}

/**
 * 播放视频
 */
const playVideo = (video: Video): void => {
  currentVideo.value = video
  videoModalVisible.value = true
  
  // 增加观看量
  video.views++
}

/**
 * 下载资源
 */
const downloadResource = (resource: DownloadResource): void => {
  // 创建下载链接
  const link = document.createElement('a')
  link.href = resource.url
  link.download = resource.title
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // 增加下载量
  resource.downloads++
  message.success('下载开始')
}

/**
 * 点赞FAQ
 */
const likeFaq = (faqId: string): void => {
  const faq = faqs.value.find(f => f.id === faqId)
  if (faq) {
    if (faq.liked) {
      faq.likes--
      faq.liked = false
    } else {
      faq.likes++
      faq.liked = true
      if (faq.disliked) {
        faq.dislikes!--
        faq.disliked = false
      }
    }
  }
}

/**
 * 踩FAQ
 */
const dislikeFaq = (faqId: string): void => {
  const faq = faqs.value.find(f => f.id === faqId)
  if (faq) {
    if (faq.disliked) {
      faq.dislikes!--
      faq.disliked = false
    } else {
      faq.dislikes!++
      faq.disliked = true
      if (faq.liked) {
        faq.likes--
        faq.liked = false
      }
    }
  }
}

/**
 * 点赞文章
 */
const likeArticle = (articleId: string): void => {
  const article = currentArticle.value
  if (article && article.id === articleId) {
    if (article.liked) {
      article.likes--
      article.liked = false
    } else {
      article.likes++
      article.liked = true
    }
  }
}

/**
 * 分享文章
 */
const shareArticle = (article: HelpArticle): void => {
  // 复制链接到剪贴板
  const url = `${window.location.origin}/help/article/${article.id}`
  navigator.clipboard.writeText(url).then(() => {
    message.success('链接已复制到剪贴板')
  })
}

/**
 * 打印文章
 */
const printArticle = (article: HelpArticle): void => {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${article.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${article.title}</h1>
          <div class="meta">更新时间：${formatDate(article.updatedAt)}</div>
          <div>${article.content}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

/**
 * 开始引导
 */
const startTour = (): void => {
  message.info('引导功能开发中...')
}

/**
 * 下载指南
 */
const downloadGuide = (): void => {
  message.success('指南下载开始')
}

/**
 * 快捷入口处理
 */
const handleQuickAccess = (access: QuickAccess): void => {
  switch (access.action) {
    case 'support':
      contactSupport()
      break
    case 'video':
      activeCategory.value = 'video'
      selectedCategory.value = ['video']
      showSearchResults.value = false
      break
    case 'api':
      activeCategory.value = 'api'
      selectedCategory.value = ['api']
      showSearchResults.value = false
      break
    case 'download':
      activeCategory.value = 'download'
      selectedCategory.value = ['download']
      showSearchResults.value = false
      break
  }
}

/**
 * 联系支持
 */
const contactSupport = (): void => {
  supportModalVisible.value = true
  supportActiveTab.value = 'ticket'
}

/**
 * 提交支持工单
 */
const submitSupportTicket = async (): Promise<void> => {
  supportSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('工单提交成功，我们会尽快处理')
    supportModalVisible.value = false
    
    // 重置表单
    Object.assign(supportForm, {
      type: '',
      priority: 'medium',
      title: '',
      description: '',
      attachments: [],
    })
  } catch (__error) {
    message.error('工单提交失败，请重试')
  } finally {
    supportSubmitting.value = false
  }
}

/**
 * 打开在线客服
 */
const openLiveChat = (): void => {
  message.info('在线客服功能开发中...')
}

/**
 * 刷新帮助
 */
const refreshHelp = (): void => {
  message.success('帮助内容已刷新')
}

// 组件挂载时加载数据
onMounted(() => {
  // 初始化数据已在响应式变量中定义
})
</script>

<style scoped lang="scss">
.help-view {
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
  }

  .search-section {
    margin-bottom: 24px;

    .search-content {
      text-align: center;
      padding: 40px 20px;

      h3 {
        margin: 0 0 24px 0;
        font-size: 20px;
        color: #262626;
      }

      .ant-input-search {
        max-width: 600px;
        margin: 0 auto 20px;
      }

      .hot-searches {
        .hot-label {
          color: #8c8c8c;
          margin-right: 8px;
        }

        .ant-tag {
          margin: 4px;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }

  .content-section {
    .category-menu {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      h4 {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 600;
        color: #262626;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 8px;
      }

      .ant-menu {
        border: none;
        background: transparent;

        .ant-menu-item {
          margin: 0 0 4px 0;
          border-radius: 6px;
          transition: all 0.3s;

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

    .search-results,
    .help-section {
      .ant-card {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 16px;
      }
    }

    .search-results {
      .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;

        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .results-count {
          color: #8c8c8c;
          font-size: 14px;
        }
      }

      .results-list {
        .result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border: 1px solid #f0f0f0;
          border-radius: 6px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #1890ff;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
          }

          .result-content {
            flex: 1;

            .result-title {
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 500;
              color: #262626;
            }

            .result-summary {
              margin: 0 0 8px 0;
              color: #8c8c8c;
              font-size: 14px;
              line-height: 1.5;
            }

            .result-meta {
              .result-date,
              .result-views {
                color: #bfbfbf;
                font-size: 12px;
              }
            }
          }

          .result-action {
            color: #bfbfbf;
            font-size: 16px;
          }
        }
      }

      .no-results {
        text-align: center;
        padding: 40px 20px;
      }
    }

    .help-section {
      h4 {
        margin: 0 0 20px 0;
        font-size: 18px;
        font-weight: 600;
        color: #262626;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 12px;
      }

      .guide-steps {
        margin-bottom: 24px;

        .ant-steps {
          .ant-steps-item {
            .ant-steps-item-content {
              .ant-steps-item-title {
                font-weight: 500;
              }
            }
          }
        }
      }

      .guide-actions {
        text-align: center;
      }

      .guide-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 16px;

        .guide-item {
          display: flex;
          align-items: center;
          padding: 20px;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          margin-bottom: 12px;
          transition: all 0.3s;

          &:hover {
            border-color: #1890ff;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
          }

          .download-icon {
            font-size: 32px;
            color: #1890ff;
            margin-right: 16px;
          }

          .download-content {
            flex: 1;

            h5 {
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 500;
            }

            p {
              margin: 0 0 8px 0;
              color: #8c8c8c;
              font-size: 14px;
            }

            .download-meta {
              color: #bfbfbf;
              font-size: 12px;
            }
          }

          .download-action {
            margin-left: 16px;
          }
        }
      }

      .popular-articles {
        margin-bottom: 20px;

        .article-list {
          .article-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border: 1px solid #f0f0f0;
            border-radius: 6px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              border-color: #1890ff;
              box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
            }

            .article-content {
              flex: 1;

              h5 {
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 500;
                color: #262626;
              }

              p {
                margin: 0 0 8px 0;
                color: #8c8c8c;
                font-size: 14px;
                line-height: 1.5;
              }

              .article-meta {
                color: #bfbfbf;
                font-size: 12px;
              }
            }

            .article-action {
              color: #bfbfbf;
              font-size: 16px;
            }
          }
        }
      }

      .quick-access {
        .access-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;

          .access-item {
            display: flex;
            align-items: center;
            padding: 20px;
            border: 1px solid #f0f0f0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              border-color: #1890ff;
              box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
              transform: translateY(-2px);
            }

            .access-icon {
              font-size: 32px;
              color: #1890ff;
              margin-right: 16px;
            }

            .access-content {
              h5 {
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 500;
              }

              p {
                margin: 0;
                color: #8c8c8c;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}

// 弹窗样式
:deep(.ant-modal) {
  .ant-modal-content {
    border-radius: 8px;
  }

  .ant-modal-header {
    border-radius: 8px 8px 0 0;
  }
}

// 联系支持弹窗
.contact-info {
  .contact-item {
    margin-bottom: 24px;
    padding: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;

    h5 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 500;
      color: #262626;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    p {
      margin: 0 0 4px 0;
      color: #595959;
    }

    .contact-time {
      color: #8c8c8c;
      font-size: 12px;
    }

    .qr-code {
      margin-top: 12px;
      text-align: center;

      img {
        width: 120px;
        height: 120px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
      }
    }
  }
}

// 文章详情弹窗
.article-modal {
  .article-detail {
    .article-meta {
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .article-content {
      margin-bottom: 20px;
      line-height: 1.6;
      color: #262626;

      h1, h2, h3, h4, h5, h6 {
        margin: 20px 0 12px 0;
        color: #262626;
      }

      p {
        margin: 12px 0;
      }

      ul, ol {
        margin: 12px 0;
        padding-left: 20px;
      }

      code {
        background: #f5f5f5;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
      }

      pre {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 12px 0;

        code {
          background: none;
          padding: 0;
        }
      }
    }

    .article-actions {
      border-top: 1px solid #f0f0f0;
      padding-top: 16px;
    }
  }
}

// 视频播放弹窗
.video-modal {
  .video-player {
    video {
      border-radius: 6px;
      margin-bottom: 16px;
    }

    .video-info {
      p {
        margin: 0 0 12px 0;
        color: #595959;
        line-height: 1.5;
      }

      .video-meta {
        color: #8c8c8c;
        font-size: 14px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .help-view {
    .content-section {
      .ant-col:first-child {
        margin-bottom: 20px;
      }
    }
  }
}

@media (max-width: 768px) {
  .help-view {
    padding: 16px;

    .page-header {
      flex-direction: column;
      gap: 16px;
      padding: 20px;

      .header-actions {
        width: 100%;
        
        .ant-space {
          width: 100%;
          justify-content: center;
        }
      }
    }

    .search-section {
      .search-content {
        padding: 30px 16px;

        h3 {
          font-size: 18px;
        }

        .ant-input-search {
          max-width: 100%;
        }
      }
    }

    .content-section {
      .ant-row {
        flex-direction: column;
      }

      .category-menu {
        margin-bottom: 16px;

        .ant-menu {
          display: flex;
          overflow-x: auto;
          white-space: nowrap;

          .ant-menu-item {
            flex-shrink: 0;
          }
        }
      }

      .help-section {
        .guide-grid,
        .video-grid {
          grid-template-columns: 1fr;
        }

        .access-grid {
          grid-template-columns: 1fr;
        }

        .api-item,
        .download-item,
        .result-item,
        .article-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;

          .api-method,
          .download-action,
          .result-action,
          .article-action {
            margin: 0;
            align-self: flex-end;
          }
        }
      }
    }
  }

  // 弹窗在移动端的适配
  :deep(.ant-modal) {
    margin: 0;
    max-width: 100vw;
    top: 0;
    padding-bottom: 0;

    .ant-modal-content {
      border-radius: 0;
      min-height: 100vh;
    }
  }

  .contact-info {
    .contact-item {
      padding: 16px;
    }
  }
}

@media (max-width: 480px) {
  .help-view {
    padding: 12px;

    .page-header {
      padding: 16px;

      .page-title {
        font-size: 20px;
      }
    }

    .search-section {
      .search-content {
        padding: 20px 12px;

        h3 {
          font-size: 16px;
        }
      }
    }

    .help-section {
      .guide-item,
      .access-item {
        padding: 16px;

        .guide-icon,
        .access-icon {
          font-size: 24px;
        }
      }

      .video-item {
        .video-thumbnail {
          height: 150px;
        }
      }
    }
  }
}
</style>px;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #1890ff;
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
          }

          .guide-icon {
            font-size: 32px;
            color: #1890ff;
            margin-right: 16px;
          }

          .guide-content {
            flex: 1;

            h5 {
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 500;
            }

            p {
              margin: 0;
              color: #8c8c8c;
              font-size: 14px;
            }
          }

          .guide-meta {
            color: #bfbfbf;
            font-size: 12px;
          }
        }
      }

      .ant-collapse {
        .ant-collapse-item {
          .ant-collapse-header {
            font-weight: 500;
          }

          .ant-collapse-content {
            .faq-answer {
              margin-bottom: 12px;
              line-height: 1.6;
            }

            .faq-actions {
              border-top: 1px solid #f0f0f0;
              padding-top: 12px;
            }
          }
        }
      }

      .api-sections {
        .api-item {
          display: flex;
          align-items: center;
          padding: 16px;
          border: 1px solid #f0f0f0;
          border-radius: 6px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #1890ff;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
          }

          .api-method {
            margin-right: 16px;
          }

          .api-content {
            flex: 1;

            h5 {
              margin: 0 0 4px 0;
              font-size: 16px;
              font-weight: 500;
            }

            .api-path {
              margin: 0 0 4px 0;
              font-family: 'Courier New', monospace;
              color: #8c8c8c;
              font-size: 14px;
            }

            .api-desc {
              margin: 0;
              color: #8c8c8c;
              font-size: 14px;
            }
          }

          .api-status {
            margin-left: 16px;
          }
        }
      }

      .video-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;

        .video-item {
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #1890ff;
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
          }

          .video-thumbnail {
            position: relative;
            width: 100%;
            height: 180px;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .video-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.3s;

              .play-icon {
                font-size: 48px;
                color: white;
              }
            }

            &:hover .video-overlay {
              opacity: 1;
            }

            .video-duration {
              position: absolute;
              bottom: 8px;
              right: 8px;
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 12px;
            }
          }

          .video-content {
            padding: 16px;

            h5 {
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 500;
            }

            p {
              margin: 0 0 8px 0;
              color: #8c8c8c;
              font-size: 14px;
              line-height: 1.5;
            }

            .video-meta {
              color: #bfbfbf;
              font-size: 12px;
            }
          }
        }
      }

      .download-list {
        .download-item {
          display: flex;
          align-items: center;
          padding: 20