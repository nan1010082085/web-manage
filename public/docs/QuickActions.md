# QuickActions 快捷操作组件

高效的快捷操作面板组件，提供常用功能的快速访问入口，支持自定义操作、权限控制和智能推荐。

## 特性

- ✅ **快速访问**: 常用功能一键直达
- ✅ **智能推荐**: 基于使用频率的动态排序
- ✅ **权限控制**: 根据用户权限显示操作
- ✅ **自定义配置**: 支持个性化操作配置
- ✅ **分组管理**: 操作按类别分组显示
- ✅ **快捷键**: 支持键盘快捷操作
- ✅ **响应式**: 适配不同屏幕尺寸
- ✅ **拖拽排序**: 支持操作项拖拽重排
- ✅ **批量操作**: 支持多选批量处理

## 基础用法

### 简单快捷操作

```vue
<template>
  <QuickActions
    :actions="basicActions"
    @action-click="handleActionClick"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QuickActions from '@/components/common/QuickActions.vue'
import type { ActionItem } from '@/types/actions'

const basicActions = ref<ActionItem[]>([
  {
    key: 'create-order',
    label: '新建订单',
    icon: 'PlusOutlined',
    type: 'primary',
    description: '快速创建新订单'
  },
  {
    key: 'import-data',
    label: '导入数据',
    icon: 'UploadOutlined',
    type: 'default',
    description: '批量导入订单数据'
  },
  {
    key: 'export-report',
    label: '导出报表',
    icon: 'DownloadOutlined',
    type: 'default',
    description: '导出销售报表'
  },
  {
    key: 'refresh-data',
    label: '刷新数据',
    icon: 'ReloadOutlined',
    type: 'default',
    description: '刷新当前页面数据'
  }
])

const handleActionClick = (action: ActionItem) => {
  console.log('执行操作:', action.key)
  
  switch (action.key) {
    case 'create-order':
      router.push('/order/create')
      break
    case 'import-data':
      showImportDialog()
      break
    case 'export-report':
      exportReport()
      break
    case 'refresh-data':
      refreshCurrentData()
      break
  }
}
</script>
```

### 分组快捷操作

```vue
<template>
  <QuickActions
    :actions="groupedActions"
    :show-groups="true"
    :collapsible="true"
    @action-click="handleActionClick"
    @group-toggle="handleGroupToggle"
  />
</template>

<script setup lang="ts">
const groupedActions = ref<ActionGroup[]>([
  {
    key: 'data-operations',
    label: '数据操作',
    icon: 'DatabaseOutlined',
    collapsed: false,
    actions: [
      {
        key: 'create-order',
        label: '新建订单',
        icon: 'PlusOutlined',
        shortcut: 'Ctrl+N',
        badge: { count: 5, color: 'blue' }
      },
      {
        key: 'batch-edit',
        label: '批量编辑',
        icon: 'EditOutlined',
        shortcut: 'Ctrl+E',
        disabled: !hasSelectedItems
      },
      {
        key: 'batch-delete',
        label: '批量删除',
        icon: 'DeleteOutlined',
        shortcut: 'Delete',
        danger: true,
        disabled: !hasSelectedItems
      }
    ]
  },
  {
    key: 'import-export',
    label: '导入导出',
    icon: 'SwapOutlined',
    collapsed: false,
    actions: [
      {
        key: 'import-excel',
        label: '导入Excel',
        icon: 'FileExcelOutlined',
        loading: importLoading.value
      },
      {
        key: 'export-excel',
        label: '导出Excel',
        icon: 'DownloadOutlined',
        loading: exportLoading.value
      },
      {
        key: 'export-pdf',
        label: '导出PDF',
        icon: 'FilePdfOutlined'
      }
    ]
  },
  {
    key: 'system-tools',
    label: '系统工具',
    icon: 'ToolOutlined',
    collapsed: true,
    actions: [
      {
        key: 'clear-cache',
        label: '清除缓存',
        icon: 'ClearOutlined',
        confirm: {
          title: '确认清除缓存？',
          content: '清除缓存后需要重新加载数据'
        }
      },
      {
        key: 'system-settings',
        label: '系统设置',
        icon: 'SettingOutlined'
      }
    ]
  }
])

const hasSelectedItems = computed(() => selectedItems.value.length > 0)
const importLoading = ref(false)
const exportLoading = ref(false)

const handleGroupToggle = (groupKey: string, collapsed: boolean) => {
  const group = groupedActions.value.find(g => g.key === groupKey)
  if (group) {
    group.collapsed = collapsed
  }
}
</script>
```

## 高级用法

### 智能推荐和权限控制

```vue
<template>
  <QuickActions
    :actions="smartActions"
    :show-recommendations="true"
    :max-recommendations="3"
    :permission-check="checkPermission"
    @action-click="handleActionClick"
    @recommendation-accept="handleRecommendationAccept"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useActionAnalytics } from '@/composables/useActionAnalytics'

const userStore = useUserStore()
const { getActionFrequency, recordActionUsage, getRecommendations } = useActionAnalytics()

// 基础操作配置
const baseActions = ref<ActionItem[]>([
  {
    key: 'create-order',
    label: '新建订单',
    icon: 'PlusOutlined',
    permissions: ['order:create'],
    category: 'order',
    priority: 1
  },
  {
    key: 'review-orders',
    label: '审核订单',
    icon: 'AuditOutlined',
    permissions: ['order:review'],
    category: 'order',
    priority: 2
  },
  {
    key: 'manage-inventory',
    label: '库存管理',
    icon: 'InboxOutlined',
    permissions: ['inventory:manage'],
    category: 'inventory',
    priority: 3
  },
  {
    key: 'financial-report',
    label: '财务报表',
    icon: 'BarChartOutlined',
    permissions: ['finance:view'],
    category: 'finance',
    priority: 4
  },
  {
    key: 'user-management',
    label: '用户管理',
    icon: 'UserOutlined',
    permissions: ['user:manage'],
    category: 'system',
    priority: 5
  }
])

// 权限检查函数
const checkPermission = (permissions: string[]) => {
  return permissions.every(permission => 
    userStore.permissions.includes(permission)
  )
}

// 智能排序的操作列表
const smartActions = computed(() => {
  return baseActions.value
    .filter(action => {
      // 权限过滤
      if (action.permissions) {
        return checkPermission(action.permissions)
      }
      return true
    })
    .map(action => {
      // 添加使用频率信息
      const frequency = getActionFrequency(action.key)
      return {
        ...action,
        frequency,
        lastUsed: getLastUsedTime(action.key)
      }
    })
    .sort((a, b) => {
      // 按使用频率和优先级排序
      const frequencyDiff = (b.frequency || 0) - (a.frequency || 0)
      if (frequencyDiff !== 0) return frequencyDiff
      return a.priority - b.priority
    })
})

// 推荐操作
const recommendations = computed(() => {
  return getRecommendations({
    userRole: userStore.role,
    currentPage: route.name,
    timeOfDay: new Date().getHours(),
    recentActions: getRecentActions()
  })
})

const handleActionClick = async (action: ActionItem) => {
  // 记录使用统计
  recordActionUsage(action.key)
  
  // 执行操作
  try {
    await executeAction(action)
    
    // 成功反馈
    message.success(`${action.label}执行成功`)
  } catch (error) {
    message.error(`${action.label}执行失败: ${error.message}`)
  }
}

const handleRecommendationAccept = (recommendation: ActionItem) => {
  // 将推荐操作添加到常用操作
  addToFavorites(recommendation)
  message.success(`已将"${recommendation.label}"添加到常用操作`)
}

const executeAction = async (action: ActionItem) => {
  switch (action.key) {
    case 'create-order':
      return await createNewOrder()
    case 'review-orders':
      return await openOrderReview()
    case 'manage-inventory':
      return await openInventoryManagement()
    case 'financial-report':
      return await generateFinancialReport()
    case 'user-management':
      return await openUserManagement()
    default:
      throw new Error('未知操作')
  }
}
</script>
```

### 自定义配置和拖拽排序

```vue
<template>
  <div class="quick-actions-container">
    <div class="actions-header">
      <h3>快捷操作</h3>
      <div class="header-actions">
        <a-button 
          size="small" 
          @click="showCustomizeModal = true"
        >
          <SettingOutlined /> 自定义
        </a-button>
        <a-button 
          size="small" 
          @click="resetToDefault"
        >
          <ReloadOutlined /> 重置
        </a-button>
      </div>
    </div>
    
    <QuickActions
      :actions="customizedActions"
      :draggable="editMode"
      :show-edit-mode="editMode"
      @action-click="handleActionClick"
      @actions-reorder="handleActionsReorder"
      @action-remove="handleActionRemove"
    />
    
    <!-- 自定义配置弹窗 -->
    <a-modal
      v-model:visible="showCustomizeModal"
      title="自定义快捷操作"
      width="800px"
      @ok="saveCustomization"
    >
      <div class="customize-content">
        <div class="available-actions">
          <h4>可用操作</h4>
          <div class="action-list">
            <div
              v-for="action in availableActions"
              :key="action.key"
              class="action-item"
              :class="{ disabled: !checkPermission(action.permissions) }"
              @click="addToCustomActions(action)"
            >
              <component :is="action.icon" />
              <span>{{ action.label }}</span>
              <PlusOutlined class="add-icon" />
            </div>
          </div>
        </div>
        
        <div class="selected-actions">
          <h4>已选操作</h4>
          <draggable
            v-model="tempCustomActions"
            class="action-list"
            item-key="key"
          >
            <template #item="{ element }">
              <div class="action-item selected">
                <component :is="element.icon" />
                <span>{{ element.label }}</span>
                <DeleteOutlined 
                  class="remove-icon" 
                  @click="removeFromCustomActions(element.key)"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { useLocalStorage } from '@vueuse/core'

const showCustomizeModal = ref(false)
const editMode = ref(false)
const tempCustomActions = ref<ActionItem[]>([])

// 使用本地存储保存自定义配置
const customActionsConfig = useLocalStorage('quick-actions-config', [])

// 所有可用的操作
const availableActions = ref<ActionItem[]>([
  {
    key: 'create-order',
    label: '新建订单',
    icon: 'PlusOutlined',
    permissions: ['order:create'],
    category: 'order'
  },
  {
    key: 'search-order',
    label: '搜索订单',
    icon: 'SearchOutlined',
    permissions: ['order:view'],
    category: 'order'
  },
  {
    key: 'export-data',
    label: '导出数据',
    icon: 'DownloadOutlined',
    permissions: ['data:export'],
    category: 'data'
  },
  {
    key: 'import-data',
    label: '导入数据',
    icon: 'UploadOutlined',
    permissions: ['data:import'],
    category: 'data'
  },
  {
    key: 'system-monitor',
    label: '系统监控',
    icon: 'MonitorOutlined',
    permissions: ['system:monitor'],
    category: 'system'
  }
])

// 当前自定义的操作列表
const customizedActions = computed(() => {
  if (customActionsConfig.value.length === 0) {
    // 默认显示前4个有权限的操作
    return availableActions.value
      .filter(action => checkPermission(action.permissions))
      .slice(0, 4)
  }
  
  return customActionsConfig.value
    .map(configItem => {
      const action = availableActions.value.find(a => a.key === configItem.key)
      return action ? { ...action, ...configItem } : null
    })
    .filter(Boolean)
    .filter(action => checkPermission(action.permissions))
})

const handleActionsReorder = (newOrder: ActionItem[]) => {
  customActionsConfig.value = newOrder.map((action, index) => ({
    key: action.key,
    order: index
  }))
}

const handleActionRemove = (actionKey: string) => {
  customActionsConfig.value = customActionsConfig.value.filter(
    item => item.key !== actionKey
  )
}

const addToCustomActions = (action: ActionItem) => {
  if (!checkPermission(action.permissions)) {
    message.warning('您没有权限使用此操作')
    return
  }
  
  if (tempCustomActions.value.find(a => a.key === action.key)) {
    message.warning('该操作已存在')
    return
  }
  
  tempCustomActions.value.push(action)
}

const removeFromCustomActions = (actionKey: string) => {
  tempCustomActions.value = tempCustomActions.value.filter(
    action => action.key !== actionKey
  )
}

const saveCustomization = () => {
  customActionsConfig.value = tempCustomActions.value.map((action, index) => ({
    key: action.key,
    order: index
  }))
  
  showCustomizeModal.value = false
  message.success('自定义配置已保存')
}

const resetToDefault = () => {
  customActionsConfig.value = []
  message.success('已重置为默认配置')
}

// 打开自定义弹窗时初始化临时数据
watch(showCustomizeModal, (visible) => {
  if (visible) {
    tempCustomActions.value = [...customizedActions.value]
  }
})
</script>

<style scoped>
.quick-actions-container {
  .actions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
    
    .header-actions {
      display: flex;
      gap: 8px;
    }
  }
}

.customize-content {
  display: flex;
  gap: 24px;
  height: 400px;
  
  .available-actions,
  .selected-actions {
    flex: 1;
    
    h4 {
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 500;
    }
  }
  
  .action-list {
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    padding: 8px;
    height: 320px;
    overflow-y: auto;
    
    .action-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      margin-bottom: 4px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background-color: #f5f5f5;
      }
      
      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      &.selected {
        background-color: #e6f7ff;
        border: 1px solid #91d5ff;
      }
      
      span {
        flex: 1;
        margin-left: 8px;
      }
      
      .add-icon,
      .remove-icon {
        opacity: 0.6;
        
        &:hover {
          opacity: 1;
        }
      }
      
      .remove-icon {
        color: #ff4d4f;
      }
    }
  }
}
</style>
```

### 批量操作支持

```vue
<template>
  <QuickActions
    :actions="batchActions"
    :batch-mode="batchMode"
    :selected-count="selectedItems.length"
    @action-click="handleBatchAction"
    @batch-mode-change="handleBatchModeChange"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBatchOperations } from '@/composables/useBatchOperations'

const { selectedItems, batchMode, toggleBatchMode } = useBatchOperations()

const batchActions = computed(() => {
  const baseActions = [
    {
      key: 'select-all',
      label: '全选',
      icon: 'CheckSquareOutlined',
      type: 'default',
      show: batchMode.value
    },
    {
      key: 'batch-edit',
      label: `批量编辑 (${selectedItems.value.length})`,
      icon: 'EditOutlined',
      type: 'primary',
      disabled: selectedItems.value.length === 0,
      show: batchMode.value
    },
    {
      key: 'batch-delete',
      label: `批量删除 (${selectedItems.value.length})`,
      icon: 'DeleteOutlined',
      type: 'danger',
      disabled: selectedItems.value.length === 0,
      show: batchMode.value,
      confirm: {
        title: '确认批量删除？',
        content: `将删除 ${selectedItems.value.length} 个项目，此操作不可恢复。`
      }
    },
    {
      key: 'batch-export',
      label: `导出选中 (${selectedItems.value.length})`,
      icon: 'DownloadOutlined',
      type: 'default',
      disabled: selectedItems.value.length === 0,
      show: batchMode.value
    },
    {
      key: 'exit-batch',
      label: '退出批量模式',
      icon: 'CloseOutlined',
      type: 'default',
      show: batchMode.value
    }
  ]
  
  return baseActions.filter(action => action.show !== false)
})

const handleBatchAction = async (action: ActionItem) => {
  switch (action.key) {
    case 'select-all':
      selectAllItems()
      break
    case 'batch-edit':
      await showBatchEditDialog()
      break
    case 'batch-delete':
      await performBatchDelete()
      break
    case 'batch-export':
      await performBatchExport()
      break
    case 'exit-batch':
      toggleBatchMode(false)
      break
  }
}

const handleBatchModeChange = (enabled: boolean) => {
  toggleBatchMode(enabled)
  if (!enabled) {
    clearSelection()
  }
}

const selectAllItems = () => {
  // 选择当前页面所有项目
  const allItems = getCurrentPageItems()
  selectedItems.value = allItems
  message.success(`已选择 ${allItems.length} 个项目`)
}

const showBatchEditDialog = async () => {
  // 显示批量编辑对话框
  const result = await openBatchEditModal(selectedItems.value)
  if (result) {
    message.success(`批量编辑 ${selectedItems.value.length} 个项目成功`)
    refreshData()
  }
}

const performBatchDelete = async () => {
  try {
    await batchDeleteItems(selectedItems.value.map(item => item.id))
    message.success(`成功删除 ${selectedItems.value.length} 个项目`)
    selectedItems.value = []
    refreshData()
  } catch (error) {
    message.error('批量删除失败')
  }
}

const performBatchExport = async () => {
  try {
    const exportData = await prepareExportData(selectedItems.value)
    downloadFile(exportData, 'batch-export.xlsx')
    message.success(`成功导出 ${selectedItems.value.length} 个项目`)
  } catch (error) {
    message.error('批量导出失败')
  }
}
</script>
```

## API 参考

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| actions | `ActionItem[] \| ActionGroup[]` | `[]` | 操作项列表 |
| showGroups | `boolean` | `false` | 是否显示分组 |
| collapsible | `boolean` | `false` | 分组是否可折叠 |
| draggable | `boolean` | `false` | 是否支持拖拽排序 |
| batchMode | `boolean` | `false` | 是否为批量操作模式 |
| selectedCount | `number` | `0` | 选中项数量 |
| maxVisible | `number` | `8` | 最大显示数量 |
| size | `'small' \| 'middle' \| 'large'` | `'middle'` | 按钮大小 |
| layout | `'horizontal' \| 'vertical' \| 'grid'` | `'horizontal'` | 布局方式 |
| showRecommendations | `boolean` | `false` | 是否显示推荐操作 |
| maxRecommendations | `number` | `3` | 最大推荐数量 |
| permissionCheck | `(permissions: string[]) => boolean` | - | 权限检查函数 |
| theme | `'light' \| 'dark'` | `'light'` | 主题 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| action-click | `(action: ActionItem)` | 操作点击事件 |
| group-toggle | `(groupKey: string, collapsed: boolean)` | 分组折叠切换事件 |
| actions-reorder | `(newOrder: ActionItem[])` | 操作重排序事件 |
| action-remove | `(actionKey: string)` | 操作移除事件 |
| batch-mode-change | `(enabled: boolean)` | 批量模式切换事件 |
| recommendation-accept | `(recommendation: ActionItem)` | 推荐操作接受事件 |
| customize-open | - | 自定义配置打开事件 |

### 方法

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| executeAction | `(actionKey: string)` | `Promise<void>` | 执行指定操作 |
| addAction | `(action: ActionItem)` | `void` | 添加操作 |
| removeAction | `(actionKey: string)` | `void` | 移除操作 |
| updateAction | `(actionKey: string, updates: Partial<ActionItem>)` | `void` | 更新操作 |
| reorderActions | `(newOrder: string[])` | `void` | 重排序操作 |
| toggleBatchMode | `(enabled?: boolean)` | `void` | 切换批量模式 |
| getActionUsageStats | - | `ActionStats[]` | 获取操作使用统计 |

### 类型定义

```typescript
// 操作项接口
interface ActionItem {
  /** 操作键值 */
  key: string
  /** 操作标签 */
  label: string
  /** 图标 */
  icon?: string
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link' | 'danger'
  /** 描述 */
  description?: string
  /** 快捷键 */
  shortcut?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 是否危险操作 */
  danger?: boolean
  /** 权限要求 */
  permissions?: string[]
  /** 分类 */
  category?: string
  /** 优先级 */
  priority?: number
  /** 使用频率 */
  frequency?: number
  /** 最后使用时间 */
  lastUsed?: Date
  /** 徽章 */
  badge?: {
    count?: number
    color?: string
    text?: string
  }
  /** 确认配置 */
  confirm?: {
    title: string
    content: string
    okText?: string
    cancelText?: string
  }
  /** 是否显示 */
  show?: boolean
}

// 操作分组接口
interface ActionGroup {
  /** 分组键值 */
  key: string
  /** 分组标签 */
  label: string
  /** 分组图标 */
  icon?: string
  /** 是否折叠 */
  collapsed?: boolean
  /** 操作列表 */
  actions: ActionItem[]
  /** 权限要求 */
  permissions?: string[]
}

// 操作统计接口
interface ActionStats {
  /** 操作键值 */
  actionKey: string
  /** 使用次数 */
  usageCount: number
  /** 最后使用时间 */
  lastUsed: Date
  /** 平均执行时间 */
  avgExecutionTime: number
  /** 成功率 */
  successRate: number
}

// 推荐配置接口
interface RecommendationConfig {
  /** 用户角色 */
  userRole: string
  /** 当前页面 */
  currentPage: string
  /** 时间段 */
  timeOfDay: number
  /** 最近操作 */
  recentActions: string[]
}
```

## 样式定制

### CSS 变量

```css
.quick-actions {
  --action-bg: #ffffff;
  --action-border: #d9d9d9;
  --action-text: #000000d9;
  --action-hover-bg: #f5f5f5;
  --action-hover-border: #40a9ff;
  --action-active-bg: #e6f7ff;
  --action-disabled-bg: #f5f5f5;
  --action-disabled-text: #00000040;
  
  /* 分组样式 */
  --group-bg: #fafafa;
  --group-border: #f0f0f0;
  --group-header-bg: #f5f5f5;
  --group-header-text: #000000d9;
  
  /* 批量模式样式 */
  --batch-bg: #fff7e6;
  --batch-border: #ffd591;
  --batch-text: #d46b08;
  
  /* 推荐样式 */
  --recommendation-bg: #f6ffed;
  --recommendation-border: #b7eb8f;
  --recommendation-text: #52c41a;
}

/* 深色主题 */
[data-theme='dark'] .quick-actions {
  --action-bg: #141414;
  --action-border: #434343;
  --action-text: #ffffffd9;
  --action-hover-bg: #262626;
  --action-hover-border: #177ddc;
  --action-active-bg: #111b26;
  --action-disabled-bg: #262626;
  --action-disabled-text: #ffffff25;
  
  --group-bg: #1f1f1f;
  --group-border: #303030;
  --group-header-bg: #262626;
  --group-header-text: #ffffffd9;
  
  --batch-bg: #2b2111;
  --batch-border: #594214;
  --batch-text: #d89614;
  
  --recommendation-bg: #162312;
  --recommendation-border: #274916;
  --recommendation-text: #52c41a;
}
```

### 响应式设计

```css
.quick-actions {
  /* 桌面端 */
  @media (min-width: 1024px) {
    .action-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
    }
    
    .action-item {
      min-height: 80px;
      flex-direction: column;
      text-align: center;
    }
  }
  
  /* 平板端 */
  @media (max-width: 768px) {
    .action-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 8px;
    }
    
    .action-item {
      min-height: 60px;
      font-size: 12px;
    }
    
    .group-header {
      font-size: 14px;
    }
  }
  
  /* 移动端 */
  @media (max-width: 576px) {
    .action-list {
      flex-direction: column;
      gap: 8px;
    }
    
    .action-item {
      width: 100%;
      justify-content: flex-start;
      padding: 12px 16px;
    }
    
    .action-icon {
      margin-right: 12px;
    }
    
    .batch-toolbar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--batch-bg);
      border-top: 1px solid var(--batch-border);
      padding: 12px 16px;
    }
  }
}
```

## 最佳实践

### 1. 操作分类和优先级

```typescript
// 操作分类配置
const ACTION_CATEGORIES = {
  PRIMARY: {
    key: 'primary',
    label: '主要操作',
    priority: 1,
    maxCount: 3
  },
  SECONDARY: {
    key: 'secondary',
    label: '次要操作',
    priority: 2,
    maxCount: 5
  },
  UTILITY: {
    key: 'utility',
    label: '工具操作',
    priority: 3,
    maxCount: 8
  }
}

// 智能排序函数
const sortActionsByPriority = (actions: ActionItem[]) => {
  return actions.sort((a, b) => {
    // 1. 按分类优先级排序
    const categoryA = ACTION_CATEGORIES[a.category?.toUpperCase()]
    const categoryB = ACTION_CATEGORIES[b.category?.toUpperCase()]
    
    if (categoryA && categoryB) {
      const categoryDiff = categoryA.priority - categoryB.priority
      if (categoryDiff !== 0) return categoryDiff
    }
    
    // 2. 按使用频率排序
    const frequencyDiff = (b.frequency || 0) - (a.frequency || 0)
    if (frequencyDiff !== 0) return frequencyDiff
    
    // 3. 按操作优先级排序
    return (a.priority || 999) - (b.priority || 999)
  })
}
```

### 2. 权限管理

```typescript
// composables/useActionPermissions.ts
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

export function useActionPermissions() {
  const userStore = useUserStore()
  
  const checkPermission = (permissions: string[] = []) => {
    if (permissions.length === 0) return true
    
    return permissions.every(permission => {
      // 支持通配符权限
      if (permission.includes('*')) {
        const prefix = permission.replace('*', '')
        return userStore.permissions.some(p => p.startsWith(prefix))
      }
      
      return userStore.permissions.includes(permission)
    })
  }
  
  const filterActionsByPermission = (actions: ActionItem[]) => {
    return actions.filter(action => checkPermission(action.permissions))
  }
  
  const getPermissionLevel = (permissions: string[]) => {
    const levels = {
      'admin': 1,
      'manager': 2,
      'user': 3,
      'guest': 4
    }
    
    const userLevel = levels[userStore.role] || 999
    const requiredLevel = Math.min(
      ...permissions.map(p => {
        const level = Object.keys(levels).find(l => p.includes(l))
        return level ? levels[level] : 999
      })
    )
    
    return userLevel <= requiredLevel
  }
  
  return {
    checkPermission,
    filterActionsByPermission,
    getPermissionLevel
  }
}
```

### 3. 性能优化

```vue
<script setup lang="ts">
import { ref, computed, shallowRef, markRaw } from 'vue'
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

// 使用 shallowRef 减少深度响应式开销
const actions = shallowRef<ActionItem[]>([])

// 使用 markRaw 标记静态配置
const staticConfig = markRaw({
  maxVisible: 8,
  debounceDelay: 300,
  animationDuration: 200
})

// 防抖处理搜索
const debouncedSearch = useDebounceFn((keyword: string) => {
  searchActions(keyword)
}, staticConfig.debounceDelay)

// 节流处理拖拽
const throttledDrag = useThrottleFn((event: DragEvent) => {
  handleDragMove(event)
}, 16) // 60fps

// 虚拟滚动优化
const visibleActions = computed(() => {
  const start = Math.max(0, scrollTop.value - 100)
  const end = Math.min(actions.value.length, start + staticConfig.maxVisible + 2)
  return actions.value.slice(start, end)
})

// 懒加载操作图标
const loadActionIcon = async (iconName: string) => {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)
  }
  
  try {
    const icon = await import(`@ant-design/icons-vue/${iconName}`)
    iconCache.set(iconName, icon.default)
    return icon.default
  } catch (error) {
    console.warn(`图标 ${iconName} 加载失败:`, error)
    return null
  }
}
</script>
```

## 常见问题

### Q: 如何实现操作的条件显示？

A: 使用计算属性和条件判断：

```typescript
const conditionalActions = computed(() => {
  return baseActions.value.filter(action => {
    // 根据当前状态决定是否显示
    switch (action.key) {
      case 'approve-order':
        return currentOrder.value?.status === 'pending'
      case 'cancel-order':
        return ['pending', 'processing'].includes(currentOrder.value?.status)
      case 'refund-order':
        return currentOrder.value?.status === 'completed'
      default:
        return true
    }
  })
})
```

### Q: 如何实现操作的异步执行和状态管理？

A: 使用状态管理和错误处理：

```typescript
const executeActionWithState = async (action: ActionItem) => {
  // 设置加载状态
  action.loading = true
  
  try {
    // 执行前置检查
    await preExecutionCheck(action)
    
    // 执行操作
    const result = await performAction(action)
    
    // 处理结果
    handleActionResult(action, result)
    
    // 更新UI状态
    updateUIState(action, 'success')
    
  } catch (error) {
    // 错误处理
    handleActionError(action, error)
    updateUIState(action, 'error')
    
  } finally {
    // 清除加载状态
    action.loading = false
  }
}
```

### Q: 如何实现操作的撤销功能？

A: 实现操作历史和撤销机制：

```typescript
// composables/useActionHistory.ts
export function useActionHistory() {
  const actionHistory = ref<ActionHistoryItem[]>([])
  const maxHistorySize = 50
  
  const recordAction = (action: ActionItem, context: any) => {
    const historyItem: ActionHistoryItem = {
      id: generateId(),
      action: { ...action },
      context: { ...context },
      timestamp: new Date(),
      undoable: action.undoable !== false
    }
    
    actionHistory.value.unshift(historyItem)
    
    // 限制历史记录大小
    if (actionHistory.value.length > maxHistorySize) {
      actionHistory.value = actionHistory.value.slice(0, maxHistorySize)
    }
  }
  
  const undoLastAction = async () => {
    const lastAction = actionHistory.value.find(item => 
      item.undoable && !item.undone
    )
    
    if (!lastAction) {
      message.warning('没有可撤销的操作')
      return
    }
    
    try {
      await performUndo(lastAction)
      lastAction.undone = true
      message.success(`已撤销操作: ${lastAction.action.label}`)
    } catch (error) {
      message.error('撤销操作失败')
    }
  }
  
  return {
    actionHistory,
    recordAction,
    undoLastAction
  }
}
```

## 更新日志

### v2.0.0
- 重构组件架构，提升性能
- 添加智能推荐功能
- 支持拖拽排序
- 增强权限控制

### v1.5.0
- 添加批量操作支持
- 优化响应式设计
- 增加快捷键功能

### v1.0.0
- 初始版本发布
- 基础快捷操作功能
- 分组和自定义支持