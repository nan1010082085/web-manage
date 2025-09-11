<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-message">
        <h2>页面未找到</h2>
        <p>抱歉，您访问的页面不存在或已被移除。</p>
      </div>
      <div class="error-actions">
        <a-button type="primary" size="large" @click="goHome">
          <template #icon>
            <HomeOutlined />
          </template>
          返回首页
        </a-button>
        <a-button size="large" @click="goBack" style="margin-left: 16px">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          返回上页
        </a-button>
      </div>
    </div>
    <div class="error-illustration">
      <svg viewBox="0 0 404 300" class="illustration-svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: #667eea; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #764ba2; stop-opacity: 1" />
          </linearGradient>
        </defs>
        <circle cx="202" cy="150" r="120" fill="url(#gradient)" opacity="0.1" />
        <text
          x="202"
          y="170"
          text-anchor="middle"
          font-size="80"
          font-weight="bold"
          fill="url(#gradient)"
          opacity="0.3"
        >
          404
        </text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()

/**
 * 返回首页
 */
const goHome = (): void => {
  router.push('/')
}

/**
 * 返回上一页
 */
const goBack = (): void => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.not-found-content {
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  position: relative;
  z-index: 2;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 20px;
}

.error-message h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.error-message p {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
}

.error-illustration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0.1;
}

.illustration-svg {
  width: 400px;
  height: 300px;
}

/* 固定样式设计 */
.not-found-content {
  padding: 60px 40px;
  margin: 40px;
}

.error-code {
  font-size: 120px;
}

.error-message h2 {
  font-size: 32px;
}

.error-message p {
  font-size: 16px;
}

.illustration-svg {
  width: 400px;
  height: 300px;
}
</style>
