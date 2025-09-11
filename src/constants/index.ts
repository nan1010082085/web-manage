/**
 * 应用常量定义
 */

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  THEME_CONFIG: 'themeConfig',
  MENU_COLLAPSED: 'menuCollapsed',
  VISITED_VIEWS: 'visitedViews',
} as const



/**
 * 主题常量
 */
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#1890ff',
  LAYOUT_TYPES: {
    SIDE: 'side',
    TOP: 'top',
    MIX: 'mix',
  },
  THEME_TYPES: {
    LIGHT: 'light',
    DARK: 'dark',
  },
} as const