/**
 * 客服相关 Mock 数据
 */

import {
  createSuccessResponse,
  createErrorResponse,
  createPaginationData,
  generateId,
  randomNumber,
  randomDate,
  randomChoice,
  mockDelay,
  mockLog,
  type MockResponse,
  type PaginationData,
} from './index'

/**
 * 工单记录接口
 */
export interface TicketRecord {
  id: string
  type: 'create' | 'assign' | 'reply' | 'status' | 'close' | 'edit' | 'call'
  action: string
  operator: string
  time: string
  content: string
}

/**
 * 客服人员接口
 */
export interface ServiceAgent {
  id: string
  name: string
  avatar: string
}

/**
 * 工单接口
 */
export interface Ticket {
  id: string
  ticketId: string
  customerName: string
  customerPhone: string
  title: string
  description: string
  category: 'payment' | 'product' | 'shipping' | 'refund' | 'complaint' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'processing' | 'resolved' | 'closed'
  orderId?: string
  assignee?: ServiceAgent
  createTime: string
  updateTime: string
  records: TicketRecord[]
}

/**
 * 客服概览数据接口
 */
export interface ServiceOverview {
  totalTickets: number
  pendingTickets: number
  resolvedTickets: number
  resolutionRate: number
}

/**
 * 工单查询参数接口
 */
export interface TicketListParams {
  page?: number
  pageSize?: number
  keyword?: string
  category?: string
  priority?: string
  status?: string
  assignee?: string
  startTime?: string
  endTime?: string
}

/**
 * 创建工单参数接口
 */
export interface CreateTicketParams {
  customerName: string
  customerPhone: string
  title: string
  description: string
  category: string
  priority: string
  orderId?: string
}

/**
 * 更新工单参数接口
 */
export interface UpdateTicketParams {
  id: string
  title?: string
  description?: string
  category?: string
  priority?: string
  status?: string
  assignee?: string
}

/**
 * 搜索表单接口
 */
export interface SearchForm {
  ticketId: string
  customer: string
  status?: string
  category?: string
  priority?: string
  dateRange?: [string, string] | string[] // 日期范围类型
}

/**
 * 表单数据接口
 */
export interface FormData {
  customerName: string
  customerPhone: string
  title: string
  description: string
  category: string
  priority: string
  orderId?: string
  assigneeId?: string
  attachments?: File[] | string[] // 文件附件类型
}

/**
 * 回复表单接口
 */
export interface ReplyForm {
  content: string
  type: string
  attachments?: File[] | string[] // 文件附件类型
  notifyCustomer: boolean
}

/**
 * 分配工单参数接口
 */
export interface AssignTicketParams {
  id: string
  agentId: string
}

/**
 * 解决工单参数接口
 */
export interface ResolveTicketParams {
  id: string
}

/**
 * 关闭工单参数接口
 */
export interface CloseTicketParams {
  id: string
}

/**
 * 添加回复参数接口
 */
export interface AddReplyParams {
  ticketId: string
  content: string
  type: string
  attachments?: string[]
}

/**
 * 客服人员数据
 */
const mockAgents: ServiceAgent[] = [
  { id: 'cs001', name: '张小明', avatar: 'https://avatars.githubusercontent.com/u/1?v=4' },
  { id: 'cs002', name: '李小红', avatar: 'https://avatars.githubusercontent.com/u/2?v=4' },
  { id: 'cs003', name: '王小强', avatar: 'https://avatars.githubusercontent.com/u/3?v=4' },
  { id: 'cs004', name: '赵小美', avatar: 'https://avatars.githubusercontent.com/u/4?v=4' },
  { id: 'cs005', name: '刘小刚', avatar: 'https://avatars.githubusercontent.com/u/5?v=4' },
]

/**
 * 工单分类
 */
const categories = ['payment', 'product', 'shipping', 'refund', 'complaint', 'other'] as const

/**
 * 优先级
 */
const priorities = ['low', 'medium', 'high', 'urgent'] as const

/**
 * 状态
 */
const statuses = ['pending', 'processing', 'resolved', 'closed'] as const

/**
 * 生成随机工单记录
 */
const generateTicketRecords = (ticketId: string): TicketRecord[] => {
  const records: TicketRecord[] = [
    {
      id: generateId('record'),
      type: 'create',
      action: '创建工单',
      operator: '系统',
      time: randomDate(new Date(2024, 0, 1), new Date()),
      content: '客户通过在线客服创建工单',
    },
  ]

  // 随机添加更多记录
  const recordCount = randomNumber(1, 5)
  for (let i = 0; i < recordCount; i++) {
    const recordType = randomChoice(['assign', 'reply', 'status', 'edit'] as const)
    const agent = randomChoice(mockAgents)

    records.push({
      id: generateId('record'),
      type: recordType,
      action: getActionByType(recordType),
      operator: recordType === 'assign' ? '客服主管' : agent.name,
      time: randomDate(new Date(records[records.length - 1].time), new Date()),
      content: getContentByType(recordType, agent.name),
    })
  }

  return records.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
}

/**
 * 根据记录类型获取操作名称
 */
const getActionByType = (type: TicketRecord['type']): string => {
  const actionMap = {
    create: '创建工单',
    assign: '分配工单',
    reply: '客服回复',
    status: '状态变更',
    close: '关闭工单',
    edit: '编辑工单',
    call: '电话联系',
  }
  return actionMap[type]
}

/**
 * 根据记录类型获取内容
 */
const getContentByType = (type: TicketRecord['type'], agentName: string): string => {
  const contentMap = {
    create: '客户通过在线客服创建工单',
    assign: `工单已分配给${agentName}处理`,
    reply: '客服已回复客户问题，请查看详情',
    status: '工单状态已更新',
    close: '工单已关闭',
    edit: '工单信息已更新',
    call: `${agentName}已电话联系客户`,
  }
  return contentMap[type]
}

/**
 * 生成模拟工单数据
 */
const generateMockTickets = (count: number): Ticket[] => {
  const tickets: Ticket[] = []
  const customerNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const titles = [
    '订单支付失败',
    '商品质量问题',
    '申请退款',
    '物流配送延迟',
    '账户登录异常',
    '优惠券使用问题',
    '商品信息错误',
    '客服态度投诉',
  ]

  for (let i = 0; i < count; i++) {
    const ticketId = `CS${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(i + 1).padStart(3, '0')}`
    const customerName = randomChoice(customerNames)
    const title = randomChoice(titles)
    const category = randomChoice<Ticket['category']>([...categories])
    const priority = randomChoice<Ticket['priority']>([...priorities])
    const status = randomChoice<Ticket['status']>([...statuses])
    const createTime = randomDate(new Date(2024, 0, 1), new Date())

    const ticket: Ticket = {
      id: generateId('ticket'),
      ticketId,
      customerName,
      customerPhone: `138${String(randomNumber(10000000, 99999999))}`,
      title,
      description: `关于${title}的详细描述，客户反馈的具体问题内容...`,
      category,
      priority,
      status,
      orderId: Math.random() > 0.3 ? `ORD${randomNumber(100000, 999999)}` : undefined,
      assignee: status !== 'pending' ? randomChoice(mockAgents) : undefined,
      createTime,
      updateTime: randomDate(new Date(createTime), new Date()),
      records: generateTicketRecords(ticketId),
    }

    tickets.push(ticket)
  }

  return tickets.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
}

/**
 * 模拟工单数据
 */
const mockTickets = generateMockTickets(50)

/**
 * 获取客服概览数据
 */
export const mockGetServiceOverview = async (): Promise<MockResponse<ServiceOverview>> => {
  await mockDelay()
  mockLog('GET', '/api/service/overview', {})

  const totalTickets = mockTickets.length
  const pendingTickets = mockTickets.filter((t) => t.status === 'pending').length
  const resolvedTickets = mockTickets.filter((t) => t.status === 'resolved').length
  const resolutionRate = totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0

  const overview: ServiceOverview = {
    totalTickets,
    pendingTickets,
    resolvedTickets,
    resolutionRate: Math.round(resolutionRate * 100) / 100,
  }

  return createSuccessResponse(overview, '获取概览数据成功')
}

/**
 * 获取工单列表
 */
export const mockGetTicketList = async (
  params: TicketListParams = {},
): Promise<MockResponse<PaginationData<Ticket>>> => {
  await mockDelay()
  mockLog('GET', '/api/service/tickets', params)

  const {
    page = 1,
    pageSize = 10,
    keyword,
    category,
    priority,
    status,
    assignee,
    startTime,
    endTime,
  } = params

  let filteredTickets = [...mockTickets]

  // 关键词搜索
  if (keyword) {
    filteredTickets = filteredTickets.filter(
      (ticket) =>
        ticket.ticketId.toLowerCase().includes(keyword.toLowerCase()) ||
        ticket.customerName.includes(keyword) ||
        ticket.title.includes(keyword) ||
        ticket.description.includes(keyword),
    )
  }

  // 分类筛选
  if (category) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.category === category)
  }

  // 优先级筛选
  if (priority) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.priority === priority)
  }

  // 状态筛选
  if (status) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.status === status)
  }

  // 客服筛选
  if (assignee) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.assignee?.id === assignee)
  }

  // 时间范围筛选
  if (startTime) {
    filteredTickets = filteredTickets.filter(
      (ticket) => new Date(ticket.createTime) >= new Date(startTime),
    )
  }
  if (endTime) {
    filteredTickets = filteredTickets.filter(
      (ticket) => new Date(ticket.createTime) <= new Date(endTime),
    )
  }

  const paginationData = createPaginationData(filteredTickets, page, pageSize)
  return createSuccessResponse(paginationData, '获取工单列表成功')
}

/**
 * 获取工单详情
 */
export const mockGetTicketDetail = async (id: string): Promise<MockResponse<Ticket | null>> => {
  await mockDelay()
  mockLog('GET', `/api/service/tickets/${id}`, { id })

  const ticket = mockTickets.find((t) => t.id === id)
  if (!ticket) {
    return createErrorResponse('工单不存在', 404)
  }

  return createSuccessResponse(ticket, '获取工单详情成功')
}

/**
 * 创建工单
 */
export const mockCreateTicket = async (
  params: CreateTicketParams,
): Promise<MockResponse<Ticket>> => {
  await mockDelay()
  mockLog('POST', '/api/service/tickets', params)

  const ticketId = `CS${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(mockTickets.length + 1).padStart(3, '0')}`
  const now = new Date().toISOString()

  const newTicket: Ticket = {
    id: generateId('ticket'),
    ticketId,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    title: params.title,
    description: params.description,
    category: params.category as Ticket['category'],
    priority: params.priority as Ticket['priority'],
    status: 'pending',
    orderId: params.orderId,
    createTime: now,
    updateTime: now,
    records: [
      {
        id: generateId('record'),
        type: 'create',
        action: '创建工单',
        operator: '系统',
        time: now,
        content: '工单已创建，等待客服处理',
      },
    ],
  }

  mockTickets.unshift(newTicket)
  return createSuccessResponse(newTicket, '创建工单成功')
}

/**
 * 更新工单
 */
export const mockUpdateTicket = async (
  params: UpdateTicketParams,
): Promise<MockResponse<Ticket | null>> => {
  await mockDelay()
  mockLog('PUT', `/api/service/tickets/${params.id}`, params)

  const ticketIndex = mockTickets.findIndex((t) => t.id === params.id)
  if (ticketIndex === -1) {
    return createErrorResponse('工单不存在', 404)
  }

  const ticket = mockTickets[ticketIndex]
  const now = new Date().toISOString()

  // 更新工单信息
  if (params.title) ticket.title = params.title
  if (params.description) ticket.description = params.description
  if (params.category) ticket.category = params.category as Ticket['category']
  if (params.priority) ticket.priority = params.priority as Ticket['priority']
  if (params.status) ticket.status = params.status as Ticket['status']
  if (params.assignee) {
    const agent = mockAgents.find((a) => a.id === params.assignee)
    if (agent) ticket.assignee = agent
  }

  ticket.updateTime = now

  // 添加更新记录
  ticket.records.push({
    id: generateId('record'),
    type: 'edit',
    action: '编辑工单',
    operator: '客服',
    time: now,
    content: '工单信息已更新',
  })

  return createSuccessResponse(ticket, '更新工单成功')
}

/**
 * 删除工单
 */
export const mockDeleteTicket = async (id: string): Promise<MockResponse<null>> => {
  await mockDelay()
  mockLog('DELETE', `/api/service/tickets/${id}`, { id })

  const ticketIndex = mockTickets.findIndex((t) => t.id === id)
  if (ticketIndex === -1) {
    return createErrorResponse('工单不存在', 404)
  }

  mockTickets.splice(ticketIndex, 1)
  return createSuccessResponse(null, '删除工单成功')
}

/**
 * 获取客服人员列表
 */
export const mockGetAgentList = async (): Promise<MockResponse<ServiceAgent[]>> => {
  await mockDelay()
  mockLog('GET', '/api/service/agents', {})

  return createSuccessResponse(mockAgents, '获取客服人员列表成功')
}

/**
 * 导出工单
 */
export const mockExportTickets = async (
  params: TicketListParams,
): Promise<MockResponse<{ url: string }>> => {
  await mockDelay()
  mockLog('POST', '/api/service/tickets/export', params)

  // 模拟生成导出文件URL
  const timestamp = Date.now()
  const filename = `tickets_export_${timestamp}.xlsx`
  const url = `/downloads/${filename}`

  return createSuccessResponse({ url }, '导出工单成功')
}

/**
 * 分配工单
 */
export const mockAssignTicket = async (
  ticketId: string,
  agentId: string,
): Promise<MockResponse<Ticket | null>> => {
  await mockDelay()
  mockLog('POST', `/api/service/tickets/${ticketId}/assign`, { agentId })

  const ticket = mockTickets.find((t) => t.id === ticketId)
  if (!ticket) {
    return createErrorResponse('工单不存在', 404)
  }

  const agent = mockAgents.find((a) => a.id === agentId)
  if (!agent) {
    return createErrorResponse('客服人员不存在', 404)
  }

  const now = new Date().toISOString()
  ticket.assignee = agent
  ticket.status = 'processing'
  ticket.updateTime = now

  // 添加分配记录
  ticket.records.push({
    id: generateId('record'),
    type: 'assign',
    action: '分配工单',
    operator: '客服主管',
    time: now,
    content: `工单已分配给${agent.name}处理`,
  })

  return createSuccessResponse(ticket, '分配工单成功')
}
