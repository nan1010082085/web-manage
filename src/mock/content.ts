import { faker } from '@faker-js/faker'
import type { ApiResponse } from '@/api'
import type { Component } from 'vue'

/**
 * 内容概览数据接口
 */
export interface ContentOverview {
  /** 总内容数 */
  totalContent: number
  /** 已发布内容数 */
  publishedContent: number
  /** 草稿内容数 */
  draftContent: number
  /** 媒体文件数 */
  mediaFiles: number
}

/**
 * 内容数据接口
 */
export interface Content {
  /** 内容ID */
  id: string
  /** 标题 */
  title: string
  /** 内容类型 */
  type: 'article' | 'page' | 'banner' | 'notice' | 'help'
  /** 发布状态 */
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  /** 摘要 */
  summary?: string
  /** 内容正文 */
  content?: string
  /** 缩略图 */
  thumbnail?: string
  /** 作者 */
  author: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 发布时间 */
  publishTime?: string
  /** 浏览量 */
  views: number
  /** 是否置顶 */
  isTop: boolean
  /** 是否热门 */
  isHot: boolean
  /** 是否推荐 */
  isRecommend: boolean
  /** 允许评论 */
  allowComment: boolean
  /** SEO标题 */
  seoTitle?: string
  /** SEO关键词 */
  seoKeywords?: string
  /** SEO描述 */
  seoDescription?: string
}

/**
 * 内容分类接口
 */
export interface ContentCategory {
  /** 分类ID */
  id: string
  /** 分类名称 */
  name: string
  /** 分类图标 */
  icon: Component | string
  /** 内容数量 */
  count: number
}

/**
 * 内容搜索参数接口
 */
export interface ContentSearchParams {
  /** 标题 */
  title?: string
  /** 内容类型 */
  type?: string
  /** 发布状态 */
  status?: string
  /** 分类ID */
  categoryId?: string
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 创建内容参数接口
 */
export interface CreateContentParams {
  /** 标题 */
  title: string
  /** 内容类型 */
  type: string
  /** 摘要 */
  summary?: string
  /** 内容正文 */
  content: string
  /** 缩略图 */
  thumbnail?: string
  /** 是否置顶 */
  isTop?: boolean
  /** 是否推荐 */
  isRecommend?: boolean
  /** 允许评论 */
  allowComment?: boolean
  /** SEO标题 */
  seoTitle?: string
  /** SEO关键词 */
  seoKeywords?: string
  /** SEO描述 */
  seoDescription?: string
  /** 定时发布时间 */
  publishTime?: string
}

/**
 * 更新内容参数接口
 */
export interface UpdateContentParams extends Partial<CreateContentParams> {
  /** 内容ID */
  id?: string
}

/**
 * 批量操作参数接口
 */
export interface BatchContentParams {
  /** 内容ID列表 */
  ids: string[]
  /** 操作类型 */
  action: 'publish' | 'archive' | 'delete' | 'setTop' | 'setRecommend'
}

// 模拟数据生成
const contentTypes = ['article', 'page', 'banner', 'notice', 'help'] as const
const contentStatuses = ['draft', 'published', 'scheduled', 'archived'] as const
const authors = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']

/**
 * 生成随机内容数据
 */
const generateContent = (): Content => {
  const type = faker.helpers.arrayElement(contentTypes)
  const status = faker.helpers.arrayElement(contentStatuses)
  const createTime = faker.date.past({ years: 1 }).toISOString()
  const updateTime = faker.date.between({ from: createTime, to: new Date() }).toISOString()

  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    type,
    status,
    summary: faker.lorem.paragraph({ min: 1, max: 3 }),
    content: faker.lorem.paragraphs({ min: 3, max: 10 }, '\n\n'),
    thumbnail: faker.helpers.maybe(() => faker.image.url({ width: 400, height: 300 }), {
      probability: 0.7,
    }),
    author: faker.helpers.arrayElement(authors),
    createTime,
    updateTime,
    publishTime: status === 'published' ? updateTime : undefined,
    views: faker.number.int({ min: 0, max: 10000 }),
    isTop: faker.datatype.boolean({ probability: 0.1 }),
    isHot: faker.datatype.boolean({ probability: 0.2 }),
    isRecommend: faker.datatype.boolean({ probability: 0.3 }),
    allowComment: faker.datatype.boolean({ probability: 0.8 }),
    seoTitle: faker.helpers.maybe(() => faker.lorem.sentence({ min: 5, max: 10 }), {
      probability: 0.6,
    }),
    seoKeywords: faker.helpers.maybe(() => faker.lorem.words({ min: 3, max: 8 }), {
      probability: 0.6,
    }),
    seoDescription: faker.helpers.maybe(() => faker.lorem.paragraph({ min: 1, max: 2 }), {
      probability: 0.6,
    }),
  }
}

/**
 * 生成内容列表
 */
const generateContentList = (count: number): Content[] => {
  return Array.from({ length: count }, generateContent)
}

// 模拟数据存储
const mockContentList = generateContentList(100)

/**
 * 获取内容概览数据
 */
export const mockGetContentOverview = (): Promise<ApiResponse<ContentOverview>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const overview: ContentOverview = {
        totalContent: mockContentList.length,
        publishedContent: mockContentList.filter((item) => item.status === 'published').length,
        draftContent: mockContentList.filter((item) => item.status === 'draft').length,
        mediaFiles: faker.number.int({ min: 50, max: 200 }),
      }

      console.log('Mock: 获取内容概览数据', overview)
      resolve({
        code: 200,
        message: '获取成功',
        data: overview,
      })
    }, 300)
  })
}

/**
 * 获取内容分类列表
 */
export const mockGetContentCategories = (): Promise<ApiResponse<ContentCategory[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories: ContentCategory[] = [
        {
          id: 'all',
          name: '全部',
          icon: 'FileTextOutlined',
          count: mockContentList.length,
        },
        {
          id: 'article',
          name: '文章',
          icon: 'BookOutlined',
          count: mockContentList.filter((item) => item.type === 'article').length,
        },
        {
          id: 'page',
          name: '页面',
          icon: 'BankOutlined',
          count: mockContentList.filter((item) => item.type === 'page').length,
        },
        {
          id: 'banner',
          name: '轮播图',
          icon: 'PictureOutlined',
          count: mockContentList.filter((item) => item.type === 'banner').length,
        },
        {
          id: 'notice',
          name: '公告',
          icon: 'BellOutlined',
          count: mockContentList.filter((item) => item.type === 'notice').length,
        },
        {
          id: 'help',
          name: '帮助',
          icon: 'QuestionCircleOutlined',
          count: mockContentList.filter((item) => item.type === 'help').length,
        },
      ]

      console.log('Mock: 获取内容分类列表', categories)
      resolve({
        code: 200,
        message: '获取成功',
        data: categories,
      })
    }, 200)
  })
}

/**
 * 获取内容列表
 */
export const mockGetContentList = (
  params: ContentSearchParams = {},
): Promise<ApiResponse<{ list: Content[]; total: number }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockContentList]

      // 筛选逻辑
      if (params.title) {
        filteredList = filteredList.filter((item) =>
          item.title.toLowerCase().includes(params.title!.toLowerCase()),
        )
      }

      if (params.type) {
        filteredList = filteredList.filter((item) => item.type === params.type)
      }

      if (params.status) {
        filteredList = filteredList.filter((item) => item.status === params.status)
      }

      if (params.categoryId && params.categoryId !== 'all') {
        filteredList = filteredList.filter((item) => item.type === params.categoryId)
      }

      // 排序
      if (params.sortField) {
        filteredList.sort((a, b) => {
          const aValue = a[params.sortField as keyof Content]
          const bValue = b[params.sortField as keyof Content]
          const order = params.sortOrder === 'desc' ? -1 : 1

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue) * order
          }

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return (aValue - bValue) * order
          }

          return 0
        })
      }

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedList = filteredList.slice(startIndex, endIndex)

      console.log('Mock: 获取内容列表', {
        params,
        total: filteredList.length,
        count: paginatedList.length,
      })
      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: paginatedList,
          total: filteredList.length,
        },
      })
    }, 500)
  })
}

/**
 * 获取内容详情
 */
export const mockGetContentDetail = (id: string): Promise<ApiResponse<Content | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const content = mockContentList.find((item) => item.id === id)

      if (content) {
        console.log('Mock: 获取内容详情', { id, title: content.title })
        resolve({
          code: 200,
          message: '获取成功',
          data: content,
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null,
        })
      }
    }, 300)
  })
}

/**
 * 创建内容
 */
export const mockCreateContent = (params: CreateContentParams): Promise<ApiResponse<Content>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newContent: Content = {
        id: faker.string.uuid(),
        title: params.title,
        type: params.type as Content['type'],
        status: params.publishTime ? 'scheduled' : 'draft',
        summary: params.summary,
        content: params.content,
        thumbnail: params.thumbnail,
        author: faker.helpers.arrayElement(authors),
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        publishTime: params.publishTime,
        views: 0,
        isTop: params.isTop || false,
        isHot: false,
        isRecommend: params.isRecommend || false,
        allowComment: params.allowComment !== false,
        seoTitle: params.seoTitle,
        seoKeywords: params.seoKeywords,
        seoDescription: params.seoDescription,
      }

      mockContentList.unshift(newContent)

      console.log('Mock: 创建内容', { id: newContent.id, title: newContent.title })
      resolve({
        code: 200,
        message: '创建成功',
        data: newContent,
      })
    }, 800)
  })
}

/**
 * 更新内容
 */
export const mockUpdateContent = (
  id: string,
  params: UpdateContentParams,
): Promise<ApiResponse<Content | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockContentList.findIndex((item) => item.id === params.id)

      if (index !== -1) {
        const updatedContent = {
          ...mockContentList[index],
          ...params,
          updateTime: new Date().toISOString(),
        }

        mockContentList[index] = updatedContent as Content

        console.log('Mock: 更新内容', { id: params.id, title: updatedContent.title })
        resolve({
          code: 200,
          message: '更新成功',
          data: updatedContent as Content,
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null,
        })
      }
    }, 600)
  })
}

/**
 * 删除内容
 */
export const mockDeleteContent = (id: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockContentList.findIndex((item) => item.id === id)

      if (index !== -1) {
        const deletedContent = mockContentList.splice(index, 1)[0]

        console.log('Mock: 删除内容', { id, title: deletedContent.title })
        resolve({
          code: 200,
          message: '删除成功',
          data: null,
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null,
        })
      }
    }, 400)
  })
}

/**
 * 发布内容
 */
export const mockPublishContent = (id: string): Promise<ApiResponse<Content | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockContentList.findIndex((item) => item.id === id)

      if (index !== -1) {
        const publishedContent = {
          ...mockContentList[index],
          status: 'published' as const,
          publishTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
        }

        mockContentList[index] = publishedContent

        console.log('Mock: 发布内容', { id, title: publishedContent.title })
        resolve({
          code: 200,
          message: '发布成功',
          data: publishedContent,
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null,
        })
      }
    }, 500)
  })
}

/**
 * 批量操作内容
 */
export const mockBatchContentOperation = (
  params: BatchContentParams,
): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { ids, action } = params
      let successCount = 0

      ids.forEach((id) => {
        const index = mockContentList.findIndex((item) => item.id === id)
        if (index !== -1) {
          const content = mockContentList[index]

          switch (action) {
            case 'publish':
              content.status = 'published'
              content.publishTime = new Date().toISOString()
              break
            case 'archive':
              content.status = 'archived'
              break
            case 'setTop':
              content.isTop = !content.isTop
              break
            case 'setRecommend':
              content.isRecommend = !content.isRecommend
              break
            case 'delete':
              mockContentList.splice(index, 1)
              break
          }

          if (action !== 'delete') {
            content.updateTime = new Date().toISOString()
          }

          successCount++
        }
      })

      console.log('Mock: 批量操作内容', { action, total: ids.length, success: successCount })
      resolve({
        code: 200,
        message: `批量${action === 'publish' ? '发布' : action === 'archive' ? '归档' : action === 'delete' ? '删除' : action === 'setTop' ? '置顶' : '推荐'}成功，共处理 ${successCount} 条记录`,
        data: null,
      })
    }, 1000)
  })
}

/**
 * 导出内容
 */
export const mockExportContent = (
  params: ContentSearchParams = {},
): Promise<ApiResponse<{ url: string }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 导出内容', params)

      // 模拟生成导出文件URL
      const exportUrl = `https://example.com/exports/content_${Date.now()}.xlsx`

      resolve({
        code: 200,
        message: '导出成功',
        data: { url: exportUrl },
      })
    }, 2000)
  })
}
