import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

/**
 * UnoCSS 配置文件
 * 配置原子化CSS框架的预设和转换器
 */
export default defineConfig({
  presets: [
    presetUno(), // 默认预设
    presetAttributify(), // 属性化模式
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [
    transformerDirectives(), // 启用 @apply 功能
    transformerVariantGroup(), // 启用 variant group 功能
  ],
  shortcuts: [
    // 按钮样式
    ['btn', 'px-4 py-2 rounded cursor-pointer border-0 transition-all duration-200 inline-flex items-center justify-center'],
    ['btn-primary', 'btn bg-blue-500 hover:bg-blue-600 text-white'],
    ['btn-secondary', 'btn bg-gray-500 hover:bg-gray-600 text-white'],
    ['btn-success', 'btn bg-green-500 hover:bg-green-600 text-white'],
    ['btn-warning', 'btn bg-yellow-500 hover:bg-yellow-600 text-white'],
    ['btn-danger', 'btn bg-red-500 hover:bg-red-600 text-white'],
    ['btn-ghost', 'btn bg-transparent border border-gray-300 hover:border-blue-500 hover:text-blue-500'],
    
    // 卡片样式
    ['card', 'bg-white rounded-lg shadow-sm border border-gray-200 p-4'],
    ['card-hover', 'card hover:shadow-md transition-shadow duration-200'],
    
    // 布局样式
    ['flex-center', 'flex items-center justify-center'],
    ['flex-between', 'flex items-center justify-between'],
    ['flex-start', 'flex items-center justify-start'],
    ['flex-end', 'flex items-center justify-end'],
    ['flex-col-center', 'flex flex-col items-center justify-center'],
    
    // 文本样式
    ['text-title', 'text-lg font-semibold text-gray-800'],
    ['text-subtitle', 'text-base font-medium text-gray-700'],
    ['text-body', 'text-sm text-gray-600'],
    ['text-caption', 'text-xs text-gray-500'],
    ['text-muted', 'text-gray-400'],
    
    // 状态样式
    ['status-success', 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs'],
    ['status-warning', 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs'],
    ['status-error', 'bg-red-100 text-red-800 px-2 py-1 rounded text-xs'],
    ['status-info', 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'],
    
    // 表单样式
    ['form-input', 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'],
    ['form-label', 'block text-sm font-medium text-gray-700 mb-1'],
    
    // 工具类
    ['scrollbar-hide', 'scrollbar-width-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'],
    ['transition-base', 'transition-all duration-200 ease-in-out'],
  ],
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
      danger: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
    },
    spacing: {
      '18': '4.5rem',
      '88': '22rem',
      '128': '32rem',
    },
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem' }],
      'sm': ['0.875rem', { lineHeight: '1.25rem' }],
      'base': ['1rem', { lineHeight: '1.5rem' }],
      'lg': ['1.125rem', { lineHeight: '1.75rem' }],
      'xl': ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    },
    boxShadow: {
      'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  },
  rules: [
    // 自定义规则
    [/^text-shadow-(.+)$/, ([, c]) => ({ 'text-shadow': `1px 1px 2px ${c}` })],
    ['text-shadow', { 'text-shadow': '1px 1px 2px rgba(0, 0, 0, 0.1)' }],
  ],
})