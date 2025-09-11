<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1 class="login-title">商城管理系统</h1>
        <p class="login-subtitle">欢迎登录</p>
      </div>

      <a-form :model="loginForm" :rules="rules" @finish="handleLogin" class="login-form">
        <a-form-item name="username">
          <a-input
            v-model:value="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            class="login-input"
          >
            <template #prefix>
              <UserOutlined class="text-gray-400" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password">
          <a-input-password
            v-model:value="loginForm.password"
            placeholder="请输入密码"
            size="large"
            class="login-input"
          >
            <template #prefix>
              <LockOutlined class="text-gray-400" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="remember">
          <a-checkbox v-model:checked="loginForm.remember"> 记住密码 </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            class="login-button"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>

      <div class="login-footer">
        <p class="text-gray-500 text-sm">
          还没有账号？
          <a href="#" class="text-primary-600 hover:text-primary-700"> 立即注册 </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'

interface LoginForm {
  username: string
  password: string
  remember: boolean
}

const router = useRouter()
const loading = ref(false)

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  remember: false,
})

const rules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
}

/**
 * 处理登录
 */
const handleLogin = async (values: LoginForm) => {
  try {
    loading.value = true

    // 模拟登录API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟登录成功
    if (values.username === 'admin' && values.password === '123456') {
      message.success('登录成功')

      // 存储用户信息到localStorage
      const userInfo = {
        id: 1,
        username: values.username,
        name: '管理员',
        role: 'admin',
        token: 'mock-token-' + Date.now(),
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      localStorage.setItem('token', userInfo.token)

      // 跳转到首页
      router.push({ name: 'Dashboard' })
    } else {
      message.error('用户名或密码错误')
    }
  } catch (error) {
    console.error('登录失败:', error)
    message.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  @apply min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx=".5" cy=".5" r=".5"><stop offset="0%" stop-color="%23ffffff" stop-opacity=".1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23a)"/></svg>');
}

.login-box {
  @apply bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md;
  backdrop-filter: blur(10px);
}

.login-header {
  @apply text-center mb-8;
}

.login-title {
  @apply text-3xl font-bold text-gray-800 mb-2;
}

.login-subtitle {
  @apply text-gray-600 text-lg;
}

.login-form {
  @apply space-y-4;
}

.login-input {
  @apply rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500;
}

.login-button {
  @apply w-full h-12 rounded-lg font-semibold text-lg;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.login-button:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.login-footer {
  @apply text-center mt-6;
}

/* 固定样式设计 */
.login-box {
  @apply mx-8 p-8;
}

.login-title {
  @apply text-3xl;
}
</style>
