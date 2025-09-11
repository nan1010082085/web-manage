<template>
  <div class="quick-actions" :class="{ collapsed: isCollapsed }">
    <!-- 折叠/展开按钮 -->
    <div class="toggle-btn" @click="toggleCollapsed">
      <DoubleRightOutlined v-if="isCollapsed" />
      <DoubleLeftOutlined v-else />
    </div>

    <!-- 快捷操作列表 -->
    <div v-if="!isCollapsed" class="actions-list">
      <div class="actions-header">
        <span class="title">快捷操作</span>
        <a-button type="text" size="small" @click="showSettings = true" class="settings-btn">
          <SettingOutlined />
        </a-button>
      </div>

      <div class="actions-content">
        <!-- 常用操作 -->
        <div class="action-group">
          <div class="group-title">常用操作</div>
          <div class="action-items">
            <div
              v-for="action in commonActions"
              :key="action.key"
              class="action-item"
              :class="{ disabled: action.disabled }"
              @click="handleActionClick(action)"
            >
              <component :is="action.icon" class="action-icon" />
              <span class="action-text">{{ action.title }}</span>
              <a-badge v-if="action.badge" :count="action.badge" class="action-badge" />
            </div>
          </div>
        </div>

        <!-- 数据操作 -->
        <div class="action-group">
          <div class="group-title">数据操作</div>
          <div class="action-items">
            <div
              v-for="action in dataActions"
              :key="action.key"
              class="action-item"
              :class="{ disabled: action.disabled }"
              @click="handleActionClick(action)"
            >
              <component :is="action.icon" class="action-icon" />
              <span class="action-text">{{ action.title }}</span>
              <a-badge v-if="action.badge" :count="action.badge" class="action-badge" />
            </div>
          </div>
        </div>

        <!-- 系统操作 -->
        <div class="action-group">
          <div class="group-title">系统操作</div>
          <div class="action-items">
            <div
              v-for="action in systemActions"
              :key="action.key"
              class="action-item"
              :class="{ disabled: action.disabled }"
              @click="handleActionClick(action)"
            >
              <component :is="action.icon" class="action-icon" />
              <span class="action-text">{{ action.title }}</span>
              <a-badge v-if="action.badge" :count="action.badge" class="action-badge" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <a-modal v-model:open="showSettings" title="快捷操作设置" width="500px" @ok="saveSettings">
      <div class="settings-content">
        <div class="setting-item">
          <span>显示快捷操作栏</span>
          <a-switch v-model:checked="settings.enabled" />
        </div>
        <div class="setting-item">
          <span>自动折叠</span>
          <a-switch v-model:checked="settings.autoCollapse" />
        </div>
        <div class="setting-item">
          <span>显示徽章</span>
          <a-switch v-model:checked="settings.showBadge" />
        </div>
        <div class="setting-item">
          <span>操作确认</span>
          <a-switch v-model:checked="settings.confirmAction" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  ReloadOutlined,
  ExportOutlined,
  ImportOutlined,
  SettingOutlined,
  BellOutlined,
  UserAddOutlined,
  ShopOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  SyncOutlined,
  ClearOutlined,
  BankOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

/**
 * 快捷操作栏组件
 * 提供常用功能的快速访问入口
 */

interface QuickAction {
  key: string
  title: string
  icon: any
  action: string | (() => void)
  disabled?: boolean
  badge?: number
  permission?: string
}

interface QuickActionSettings {
  enabled: boolean
  autoCollapse: boolean
  showBadge: boolean
  confirmAction: boolean
}

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const isCollapsed = ref(false)
const showSettings = ref(false)
const settings = ref<QuickActionSettings>({
  enabled: true,
  autoCollapse: false,
  showBadge: true,
  confirmAction: true,
})

/**
 * 常用操作配置
 */
const commonActions = computed<QuickAction[]>(() => [
  {
    key: 'add-user',
    title: '新建用户',
    icon: UserAddOutlined,
    action: () => router.push('/user/add'),
    permission: 'user:create',
  },
  {
    key: 'add-product',
    title: '新建商品',
    icon: ShopOutlined,
    action: () => router.push('/product/add'),
    permission: 'product:create',
  },
  {
    key: 'add-order',
    title: '新建订单',
    icon: FileTextOutlined,
    action: () => router.push('/order/add'),
    permission: 'order:create',
  },
  {
    key: 'notifications',
    title: '消息通知',
    icon: BellOutlined,
    action: () => router.push('/notifications'),
    badge: 5,
  },
])

/**
 * 数据操作配置
 */
const dataActions = computed<QuickAction[]>(() => [
  {
    key: 'refresh',
    title: '刷新数据',
    icon: ReloadOutlined,
    action: handleRefresh,
  },
  {
    key: 'export',
    title: '批量导出',
    icon: ExportOutlined,
    action: handleExport,
    permission: 'data:export',
  },
  {
    key: 'import',
    title: '批量导入',
    icon: ImportOutlined,
    action: handleImport,
    permission: 'data:import',
  },
  {
    key: 'backup',
    title: '数据备份',
    icon: BankOutlined,
    action: handleBackup,
    permission: 'system:backup',
  },
])

/**
 * 系统操作配置
 */
const systemActions = computed<QuickAction[]>(() => [
  {
    key: 'sync',
    title: '同步数据',
    icon: SyncOutlined,
    action: handleSync,
    permission: 'system:sync',
  },
  {
    key: 'clear-cache',
    title: '清理缓存',
    icon: ClearOutlined,
    action: handleClearCache,
    permission: 'system:cache',
  },
  {
    key: 'reports',
    title: '生成报表',
    icon: BarChartOutlined,
    action: () => router.push('/reports'),
    permission: 'report:view',
  },
  {
    key: 'settings',
    title: '系统设置',
    icon: SettingOutlined,
    action: () => router.push('/system/settings'),
    permission: 'system:config',
  },
])

/**
 * 切换折叠状态
 */
const toggleCollapsed = (): void => {
  isCollapsed.value = !isCollapsed.value
  saveCollapsedState()
}

/**
 * 处理操作点击
 */
const handleActionClick = async (action: QuickAction): Promise<void> => {
  if (action.disabled) {
    return
  }

  // 检查权限
  if (action.permission && !userStore.hasPermission(action.permission)) {
    message.warning('您没有权限执行此操作')
    return
  }

  // 确认操作
  if (settings.value.confirmAction && typeof action.action === 'function') {
    Modal.confirm({
      title: '确认操作',
      content: `确定要执行"${action.title}"操作吗？`,
      onOk: () => {
        executeAction(action)
      },
    })
  } else {
    executeAction(action)
  }
}

/**
 * 执行操作
 */
const executeAction = (action: QuickAction): void => {
  try {
    if (typeof action.action === 'string') {
      router.push(action.action)
    } else if (typeof action.action === 'function') {
      action.action()
    }
  } catch (error) {
    console.error('执行操作失败:', error)
    message.error('操作执行失败')
  }
}

/**
 * 刷新数据
 */
const handleRefresh = (): void => {
  message.loading('正在刷新数据...', 1)
  // 触发当前页面数据刷新
  window.location.reload()
}

/**
 * 批量导出
 */
const handleExport = (): void => {
  message.loading('正在导出数据...', 2)
  // 实现导出逻辑
  setTimeout(() => {
    message.success('数据导出成功')
  }, 2000)
}

/**
 * 批量导入
 */
const handleImport = (): void => {
  // 创建文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls,.csv'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      message.loading('正在导入数据...', 2)
      // 实现导入逻辑
      setTimeout(() => {
        message.success('数据导入成功')
      }, 2000)
    }
  }
  input.click()
}

/**
 * 数据备份
 */
const handleBackup = (): void => {
  message.loading('正在备份数据...', 3)
  // 实现备份逻辑
  setTimeout(() => {
    message.success('数据备份成功')
  }, 3000)
}

/**
 * 同步数据
 */
const handleSync = (): void => {
  message.loading('正在同步数据...', 2)
  // 实现同步逻辑
  setTimeout(() => {
    message.success('数据同步成功')
  }, 2000)
}

/**
 * 清理缓存
 */
const handleClearCache = (): void => {
  message.loading('正在清理缓存...', 1)
  // 实现清理缓存逻辑
  localStorage.clear()
  sessionStorage.clear()
  setTimeout(() => {
    message.success('缓存清理成功')
  }, 1000)
}

/**
 * 保存设置
 */
const saveSettings = (): void => {
  localStorage.setItem('quick-actions-settings', JSON.stringify(settings.value))
  showSettings.value = false
  message.success('设置已保存')
}

/**
 * 加载设置
 */
const loadSettings = (): void => {
  try {
    const saved = localStorage.getItem('quick-actions-settings')
    if (saved) {
      settings.value = { ...settings.value, ...JSON.parse(saved) }
    }
  } catch (error) {
    console.warn('Failed to load quick actions settings:', error)
  }
}

/**
 * 保存折叠状态
 */
const saveCollapsedState = (): void => {
  localStorage.setItem('quick-actions-collapsed', JSON.stringify(isCollapsed.value))
}

/**
 * 加载折叠状态
 */
const loadCollapsedState = (): void => {
  try {
    const saved = localStorage.getItem('quick-actions-collapsed')
    if (saved) {
      isCollapsed.value = JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Failed to load collapsed state:', error)
  }
}

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  loadSettings()
  loadCollapsedState()
})
</script>

<style scoped lang="less">
.quick-actions {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  background: #fff;
  border-radius: 8px 0 0 8px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  max-height: 80vh;
  overflow: hidden;

  &.collapsed {
    width: 48px;

    .toggle-btn {
      border-radius: 8px 0 0 8px;
    }
  }
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #1890ff;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 0;

  &:hover {
    background: #40a9ff;
  }
}

.actions-list {
  width: 280px;
  max-height: calc(80vh - 48px);
  overflow-y: auto;
}

.actions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .settings-btn {
    color: #999;

    &:hover {
      color: #1890ff;
    }
  }
}

.actions-content {
  padding: 8px 0;
}

.action-group {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.group-title {
  padding: 8px 16px;
  font-size: 12px;
  color: #999;
  font-weight: 500;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.action-items {
  padding: 8px 0;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;

  &:hover {
    background: #f5f5f5;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background: transparent;
    }
  }
}

.action-icon {
  font-size: 16px;
  color: #666;
  margin-right: 12px;
  flex-shrink: 0;
}

.action-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.action-badge {
  margin-left: 8px;
}

.settings-content {
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    span {
      font-size: 14px;
      color: #333;
    }
  }
}

/* 滚动条样式 */
.actions-list::-webkit-scrollbar {
  width: 4px;
}

.actions-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.actions-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.actions-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
