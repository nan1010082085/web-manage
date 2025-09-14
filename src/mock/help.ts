import type { ApiResponse } from '@/api'
import { faker } from '@faker-js/faker'

/**
 * 帮助文章接口
 */
export interface HelpArticle {
  /** 文章ID */
  id: string
  /** 文章标题 */
  title: string
  /** 文章摘要 */
  summary: string
  /** 文章内容 */
  content: string
  /** 文章分类 */
  category: string
  /** 浏览量 */
  views: number
  /** 点赞数 */
  likes: number
  /** 点踩数 */
  dislikes?: number
  /** 是否已点赞 */
  liked?: boolean
  /** 是否已点踩 */
  disliked?: boolean
  /** 更新时间 */
  updatedAt: string
  /** 创建时间 */
  createdAt: string
}

/**
 * 常见问题接口
 */
export interface FAQ {
  /** 问题ID */
  id: string
  /** 问题 */
  question: string
  /** 答案 */
  answer: string
  /** 点赞数 */
  likes: number
  /** 点踩数 */
  dislikes: number
  /** 是否已点赞 */
  liked?: boolean
  /** 是否已点踩 */
  disliked?: boolean
}

/**
 * API文档接口
 */
export interface APIDoc {
  /** 文档ID */
  id: string
  /** 接口标题 */
  title: string
  /** 接口路径 */
  path: string
  /** 请求方法 */
  method: string
  /** 接口描述 */
  description: string
  /** 接口状态 */
  status: string
}

/**
 * 视频教程接口
 */
export interface Video {
  /** 视频ID */
  id: string
  /** 视频标题 */
  title: string
  /** 视频描述 */
  description: string
  /** 视频URL */
  url: string
  /** 缩略图 */
  thumbnail: string
  /** 视频时长 */
  duration: string
  /** 观看次数 */
  views: number
  /** 创建时间 */
  createdAt: string
}

/**
 * 下载资源接口
 */
export interface DownloadResource {
  /** 资源ID */
  id: string
  /** 资源标题 */
  title: string
  /** 资源描述 */
  description: string
  /** 文件类型 */
  type: string
  /** 文件大小 */
  size: string
  /** 下载次数 */
  downloads: number
  /** 下载URL */
  url: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 支持工单接口
 */
export interface SupportTicket {
  /** 工单ID */
  id: string
  /** 工单类型 */
  type: string
  /** 优先级 */
  priority: string
  /** 工单标题 */
  title: string
  /** 工单描述 */
  description: string
  /** 工单状态 */
  status: string
  /** 附件列表 */
  attachments: string[]
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 快速入门步骤接口
 */
export interface GettingStartedStep {
  /** 步骤ID */
  id: string
  /** 步骤标题 */
  title: string
  /** 步骤描述 */
  description: string
  /** 步骤图标 */
  icon: string
}

/**
 * 用户指南接口
 */
export interface UserGuide {
  /** 指南ID */
  id: string
  /** 指南标题 */
  title: string
  /** 指南描述 */
  description: string
  /** 指南图标 */
  icon: string
  /** 文章数量 */
  articles: number
}

/**
 * 快速访问接口
 */
export interface QuickAccess {
  /** 访问ID */
  id: string
  /** 访问标题 */
  title: string
  /** 访问描述 */
  description: string
  /** 访问图标 */
  icon: string
  /** 访问动作 */
  action: string
}

/**
 * 搜索参数接口
 */
export interface HelpSearchParams {
  /** 搜索关键词 */
  keyword?: string
  /** 分类 */
  category?: string
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 创建支持工单参数接口
 */
export interface CreateSupportTicketParams {
  /** 工单类型 */
  type: string
  /** 优先级 */
  priority: string
  /** 工单标题 */
  title: string
  /** 工单描述 */
  description: string
  /** 附件列表 */
  attachments?: string[]
}

// 模拟数据生成
const categories = [
  'getting-started',
  'user-guide',
  'faq',
  'api',
  'troubleshooting',
  'video',
  'download',
]
const categoryNames = [
  '快速入门',
  '用户指南',
  '常见问题',
  'API文档',
  '故障排除',
  '视频教程',
  '资源下载',
]
const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const apiStatuses = ['stable', 'beta']
const ticketTypes = ['technical', 'billing', 'feature', 'bug', 'other']
const priorities = ['low', 'medium', 'high', 'urgent']
const ticketStatuses = ['open', 'in-progress', 'resolved', 'closed']
const fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar']
const icons = [
  'UserOutlined',
  'SettingOutlined',
  'ShoppingOutlined',
  'FileTextOutlined',
  'ToolOutlined',
  'PlayCircleOutlined',
  'DownloadOutlined',
]

/**
 * 生成帮助文章
 */
const generateHelpArticle = (): HelpArticle => {
  const category = faker.helpers.arrayElement(categories)

  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    summary: faker.lorem.paragraph({ min: 1, max: 3 }),
    content: faker.lorem.paragraphs({ min: 3, max: 8 }, '\n\n'),
    category,
    views: faker.number.int({ min: 0, max: 10000 }),
    likes: faker.number.int({ min: 0, max: 500 }),
    dislikes: faker.number.int({ min: 0, max: 50 }),
    liked: faker.datatype.boolean({ probability: 0.1 }),
    disliked: faker.datatype.boolean({ probability: 0.05 }),
    updatedAt: faker.date.recent().toISOString(),
    createdAt: faker.date.past().toISOString(),
  }
}

/**
 * 生成常见问题
 */
const generateFAQ = (): FAQ => {
  return {
    id: faker.string.uuid(),
    question: faker.lorem.sentence() + '？',
    answer: faker.lorem.paragraphs({ min: 1, max: 3 }, '<br><br>'),
    likes: faker.number.int({ min: 0, max: 100 }),
    dislikes: faker.number.int({ min: 0, max: 20 }),
    liked: faker.datatype.boolean({ probability: 0.1 }),
    disliked: faker.datatype.boolean({ probability: 0.05 }),
  }
}

/**
 * 生成API文档
 */
const generateAPIDoc = (): APIDoc => {
  const method = faker.helpers.arrayElement(httpMethods)
  const resource = faker.helpers.arrayElement([
    'users',
    'orders',
    'products',
    'payments',
    'analytics',
  ])

  return {
    id: faker.string.uuid(),
    title: `${method === 'GET' ? '获取' : method === 'POST' ? '创建' : method === 'PUT' ? '更新' : method === 'DELETE' ? '删除' : '修改'}${resource === 'users' ? '用户' : resource === 'orders' ? '订单' : resource === 'products' ? '商品' : resource === 'payments' ? '支付' : '分析'}`,
    path: `/api/v1/${resource}${method === 'GET' && faker.datatype.boolean() ? '/{id}' : ''}`,
    method,
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(apiStatuses),
  }
}

/**
 * 生成视频教程
 */
const generateVideo = (): Video => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 3, max: 6 }),
    description: faker.lorem.paragraph(),
    url: faker.internet.url(),
    thumbnail: faker.image.url({ width: 320, height: 180 }),
    duration: `${faker.number.int({ min: 1, max: 30 })}:${faker.number.int({ min: 10, max: 59 })}`,
    views: faker.number.int({ min: 0, max: 50000 }),
    createdAt: faker.date.past().toISOString(),
  }
}

/**
 * 生成下载资源
 */
const generateDownloadResource = (): DownloadResource => {
  const type = faker.helpers.arrayElement(fileTypes)

  return {
    id: faker.string.uuid(),
    title: faker.lorem.words({ min: 2, max: 5 }),
    description: faker.lorem.sentence(),
    type,
    size: `${faker.number.float({ min: 0.1, max: 50, fractionDigits: 1 })} MB`,
    downloads: faker.number.int({ min: 0, max: 5000 }),
    url: faker.internet.url(),
    updatedAt: faker.date.recent().toISOString(),
  }
}

/**
 * 生成支持工单
 */
const generateSupportTicket = (): SupportTicket => {
  return {
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(ticketTypes),
    priority: faker.helpers.arrayElement(priorities),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraphs({ min: 1, max: 3 }),
    status: faker.helpers.arrayElement(ticketStatuses),
    attachments: faker.helpers.maybe(() => [faker.internet.url()], { probability: 0.3 }) || [],
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }
}

// 模拟数据存储
const mockHelpArticles = Array.from({ length: 50 }, () => generateHelpArticle())
const mockFAQs = Array.from({ length: 20 }, () => generateFAQ())
const mockAPIDocs = Array.from({ length: 30 }, () => generateAPIDoc())
const mockVideos = Array.from({ length: 15 }, () => generateVideo())
const mockDownloadResources = Array.from({ length: 10 }, () => generateDownloadResource())
const mockSupportTickets = Array.from({ length: 25 }, () => generateSupportTicket())

// 固定的快速入门步骤
const mockGettingStartedSteps: GettingStartedStep[] = [
  {
    id: '1',
    title: '注册账户',
    description: '创建您的账户并完成邮箱验证',
    icon: 'UserOutlined',
  },
  {
    id: '2',
    title: '完善资料',
    description: '填写基本信息和企业资料',
    icon: 'SettingOutlined',
  },
  {
    id: '3',
    title: '创建商品',
    description: '添加您的第一个商品',
    icon: 'ShoppingOutlined',
  },
  {
    id: '4',
    title: '处理订单',
    description: '学习如何管理和处理订单',
    icon: 'FileTextOutlined',
  },
]

// 固定的用户指南
const mockUserGuides: UserGuide[] = [
  {
    id: '1',
    title: '商品管理',
    description: '学习如何添加、编辑和管理商品',
    icon: 'ShoppingOutlined',
    articles: 12,
  },
  {
    id: '2',
    title: '订单处理',
    description: '掌握订单管理和处理流程',
    icon: 'FileTextOutlined',
    articles: 8,
  },
  {
    id: '3',
    title: '用户管理',
    description: '了解用户管理和权限设置',
    icon: 'UserOutlined',
    articles: 6,
  },
  {
    id: '4',
    title: '系统设置',
    description: '配置系统参数和个性化设置',
    icon: 'SettingOutlined',
    articles: 10,
  },
]

// 固定的快速访问
const mockQuickAccess: QuickAccess[] = [
  {
    id: '1',
    title: '技术支持',
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
]
/**
 * 搜索帮助文章
 */
export const mockSearchHelpArticles = (
  params: HelpSearchParams = {},
): Promise<ApiResponse<{ list: HelpArticle[]; total: number }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockHelpArticles]

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredList = filteredList.filter(
          (item) =>
            item.title.toLowerCase().includes(keyword) ||
            item.summary.toLowerCase().includes(keyword) ||
            item.content.toLowerCase().includes(keyword),
        )
      }

      // 分类筛选
      if (params.category && params.category !== 'all') {
        filteredList = filteredList.filter((item) => item.category === params.category)
      }

      // 按浏览量排序
      filteredList.sort((a, b) => b.views - a.views)

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedList = filteredList.slice(startIndex, endIndex)

      console.log('Mock: 搜索帮助文章', {
        params,
        total: filteredList.length,
        count: paginatedList.length,
      })
      resolve({
        code: 200,
        message: '搜索成功',
        data: {
          list: paginatedList,
          total: filteredList.length,
        },
      })
    }, 300)
  })
}

/**
 * 获取帮助文章详情
 */
export const mockGetHelpArticleDetail = (id: string): Promise<ApiResponse<HelpArticle | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const article = mockHelpArticles.find((item) => item.id === id)

      if (article) {
        // 增加浏览量
        article.views++

        console.log('Mock: 获取帮助文章详情', { id, title: article.title })
        resolve({
          code: 200,
          message: '获取成功',
          data: article,
        })
      } else {
        resolve({
          code: 404,
          message: '文章不存在',
          data: null,
        })
      }
    }, 200)
  })
}

/**
 * 获取常见问题列表
 */
export const mockGetFAQList = (): Promise<ApiResponse<FAQ[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取常见问题列表', { count: mockFAQs.length })
      resolve({
        code: 200,
        message: '获取成功',
        data: mockFAQs,
      })
    }, 200)
  })
}

/**
 * 获取API文档列表
 */
export const mockGetAPIDocList = (): Promise<ApiResponse<APIDoc[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取API文档列表', { count: mockAPIDocs.length })
      resolve({
        code: 200,
        message: '获取成功',
        data: mockAPIDocs,
      })
    }, 200)
  })
}

/**
 * 获取视频教程列表
 */
export const mockGetVideoList = (): Promise<ApiResponse<Video[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取视频教程列表', { count: mockVideos.length })
      resolve({
        code: 200,
        message: '获取成功',
        data: mockVideos,
      })
    }, 200)
  })
}

/**
 * 获取下载资源列表
 */
export const mockGetDownloadResourceList = (): Promise<ApiResponse<DownloadResource[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取下载资源列表', { count: mockDownloadResources.length })
      resolve({
        code: 200,
        message: '获取成功',
        data: mockDownloadResources,
      })
    }, 200)
  })
}

/**
 * 获取快速入门步骤
 */
export const mockGetGettingStartedSteps = (): Promise<ApiResponse<GettingStartedStep[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取快速入门步骤', { count: mockGettingStartedSteps.length })
      resolve({
        code: 200,
        message: '获取成功',
        data: mockGettingStartedSteps,
      })
    }, 200)
  })
}

/**
 * 获取用户指南列表
 */
export const mockGetUserGuideList = (): Promise<ApiResponse<UserGuide[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取用户指南列表', { count: mockUserGuides.length })
      resolve({
        code: 200,
        message: '获取成功',
        data: mockUserGuides,
      })
    }, 200)
  })
}

/**
 * 获取快速访问列表
 */
export const mockGetQuickAccessList = (): Promise<ApiResponse<QuickAccess[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 获取快速访问列表', { count: mockQuickAccess.length })
      resolve({
        code: 200,
        message: '获取成功',
        data: mockQuickAccess,
      })
    }, 200)
  })
}

/**
 * 创建支持工单
 */
export const mockCreateSupportTicket = (
  params: CreateSupportTicketParams,
): Promise<ApiResponse<SupportTicket>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: faker.string.uuid(),
        type: params.type,
        priority: params.priority,
        title: params.title,
        description: params.description,
        status: 'open',
        attachments: params.attachments || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockSupportTickets.unshift(newTicket)

      console.log('Mock: 创建支持工单', { id: newTicket.id, title: newTicket.title })
      resolve({
        code: 200,
        message: '工单创建成功',
        data: newTicket,
      })
    }, 800)
  })
}

/**
 * 点赞帮助文章
 */
export const mockLikeHelpArticle = (id: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const article = mockHelpArticles.find((item) => item.id === id)

      if (article) {
        if (article.liked) {
          article.likes--
          article.liked = false
        } else {
          article.likes++
          article.liked = true
          if (article.disliked) {
            article.dislikes = (article.dislikes || 0) - 1
            article.disliked = false
          }
        }

        console.log('Mock: 点赞帮助文章', { id, liked: article.liked, likes: article.likes })
        resolve({
          code: 200,
          message: article.liked ? '点赞成功' : '取消点赞',
          data: null,
        })
      } else {
        resolve({
          code: 404,
          message: '文章不存在',
          data: null,
        })
      }
    }, 300)
  })
}

/**
 * 点踩帮助文章
 */
export const mockDislikeHelpArticle = (id: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const article = mockHelpArticles.find((item) => item.id === id)

      if (article) {
        if (article.disliked) {
          article.dislikes = (article.dislikes || 0) - 1
          article.disliked = false
        } else {
          article.dislikes = (article.dislikes || 0) + 1
          article.disliked = true
          if (article.liked) {
            article.likes--
            article.liked = false
          }
        }

        console.log('Mock: 点踩帮助文章', {
          id,
          disliked: article.disliked,
          dislikes: article.dislikes,
        })
        resolve({
          code: 200,
          message: article.disliked ? '点踩成功' : '取消点踩',
          data: null,
        })
      } else {
        resolve({
          code: 404,
          message: '文章不存在',
          data: null,
        })
      }
    }, 300)
  })
}

/**
 * 点赞FAQ
 */
export const mockLikeFAQ = (id: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const faq = mockFAQs.find((item) => item.id === id)

      if (faq) {
        if (faq.liked) {
          faq.likes--
          faq.liked = false
        } else {
          faq.likes++
          faq.liked = true
          if (faq.disliked) {
            faq.dislikes--
            faq.disliked = false
          }
        }

        console.log('Mock: 点赞FAQ', { id, liked: faq.liked, likes: faq.likes })
        resolve({
          code: 200,
          message: faq.liked ? '点赞成功' : '取消点赞',
          data: null,
        })
      } else {
        resolve({
          code: 404,
          message: 'FAQ不存在',
          data: null,
        })
      }
    }, 300)
  })
}

/**
 * 点踩FAQ
 */
export const mockDislikeFAQ = (id: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const faq = mockFAQs.find((item) => item.id === id)

      if (faq) {
        if (faq.disliked) {
          faq.dislikes--
          faq.disliked = false
        } else {
          faq.dislikes++
          faq.disliked = true
          if (faq.liked) {
            faq.likes--
            faq.liked = false
          }
        }

        console.log('Mock: 点踩FAQ', { id, disliked: faq.disliked, dislikes: faq.dislikes })
        resolve({
          code: 200,
          message: faq.disliked ? '点踩成功' : '取消点踩',
          data: null,
        })
      } else {
        resolve({
          code: 404,
          message: 'FAQ不存在',
          data: null,
        })
      }
    }, 300)
  })
}
