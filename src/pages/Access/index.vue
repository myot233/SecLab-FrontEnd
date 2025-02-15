<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { LoginForm, RegisterForm } from '../../types/auth'
import SideBrand from "./components/SideBrand.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import { login, register } from '../../api';
import { useCookie } from '../../common';   
import { showToast } from '../../common';

const router = useRouter()
const isLogin = ref(true)
const cookie = useCookie();
// 登录表单

// 注册表单

// 表单错误信息

// 切换登录/注册
const toggleMode = () => {
  isLogin.value = !isLogin.value
}

// 登录处理
const handleLogin = async (loginForm: LoginForm) => {
  try {
    let resp = await login(loginForm);
    
    if (resp.isSuccess == 1) {
      console.log(resp.data.loginData.token);
      cookie.set('token', resp.data.loginData.token);
      router.push('/user/courses');
    } else {
      showToast(resp.message); // 显示错误消息
    }
  } catch (error) {
    console.error('登录失败:', error);
    showToast('登录失败，请重试。'); // 显示通用错误消息
  }
}

// 注册处理
 // Start of Selection
const handleRegister = async (registerForm: RegisterForm) => {
  // Ensure all required fields are present in the registerForm

  // Call the register API with the provided registerForm
  let resp = await register(registerForm);
  
  // Check if the registration was successful
  if (resp.isSuccess === 1) {
    showToast('注册成功'); // Show success message
  } else {
    showToast(resp.message); // Show error message from the response
  }
}

</script>

<template>
  <div class="min-h-screen flex bg-gradient-to-br from-base-300 to-base-200">
    <!-- 左侧品牌介绍 -->
    <SideBrand></SideBrand>
    <!-- 右侧登录/注册表单 -->
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl backdrop-blur-sm bg-opacity-95">
        <div class="card-body">
          <!-- Logo -->
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 rounded-full bg-neutral flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-neutral-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <!-- 标题 -->
          <h2 class="card-title justify-center text-2xl mb-6">
            {{ isLogin ? '登录' : '注册' }}
            <span class="text-base font-normal text-base-content/60">
              {{ isLogin ? '开始你的安全之旅' : '加入我们的安全社区' }}
            </span>
          </h2>

          <!-- 登录表单 -->
          <Login v-if="isLogin" @login="handleLogin"></Login>

          <!-- 注册表单 -->
          <Register v-else @register="handleRegister"></Register>

          <!-- 添加社交登录选项 -->
          <div v-if="isLogin" class="divider">或</div>
          <div v-if="isLogin" class="flex gap-4 justify-center">
            <button class="btn btn-circle btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
              </svg>
            </button>
            <button class="btn btn-circle btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button class="btn btn-circle btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
          </div>

          <!-- 切换登录/注册 -->
          <div class="text-center mt-6">
            <a 
              href="#" 
              class="link link-primary"
              @click.prevent="toggleMode"
            >
              {{ isLogin ? '没有账号？立即注册' : '已有账号？立即登录' }}
            </a>
          </div>

          <!-- 帮助链接 -->
          <div class="text-center mt-4 text-sm text-base-content/60">
            <a href="#" class="link link-hover">忘记密码？</a>
            <span class="mx-2">·</span>
            <a href="#" class="link link-hover">需要帮助？</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.divider {
  @apply my-4;
}
</style> 