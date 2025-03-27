<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { LoginForm, RegisterForm } from '../../types/auth'
import SideBrand from "./components/SideBrand.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import ForgotPassword from "./components/ForgotPassword.vue";
import ResetPassword from "./components/ResetPassword.vue";
import { login, register } from '../../api';
import { useCookie, showToast } from '../../common';   

const router = useRouter()
const isLogin = ref(true)
const isForgotPassword = ref(false)
const isResetPassword = ref(false)
const verifiedPhone = ref('')
const cookie = useCookie();

// 添加动画状态控制
const formVisible = ref(true)
const isLoaded = ref(false)

// 页面加载动画
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

// 切换登录/注册模式
const toggleMode = () => {
  formVisible.value = false
  setTimeout(() => {
    isLogin.value = !isLogin.value
    isForgotPassword.value = false
    isResetPassword.value = false
    formVisible.value = true
  }, 300)
}

// 处理忘记密码
const handleForgotPassword = () => {
  formVisible.value = false
  setTimeout(() => {
    isForgotPassword.value = true
    isLogin.value = false
    isResetPassword.value = false
    formVisible.value = true
  }, 300)
}

// 处理验证码验证并转到重置密码
const handleVerifyCode = (phone: string) => {
  formVisible.value = false
  setTimeout(() => {
    verifiedPhone.value = phone
    isForgotPassword.value = false
    isResetPassword.value = true
    formVisible.value = true
  }, 300)
}

// 密码重置成功处理
const handlePasswordReset = () => {
  formVisible.value = false
  setTimeout(() => {
    isResetPassword.value = false
    isLogin.value = true
    formVisible.value = true
    showToast('密码重置成功，请使用新密码登录')
  }, 300)
}

// 返回登录页面
const backToLogin = () => {
  formVisible.value = false
  setTimeout(() => {
    isForgotPassword.value = false
    isResetPassword.value = false
    isLogin.value = true
    formVisible.value = true
  }, 300)
}

// 登录处理
const handleLogin = async (loginForm: LoginForm) => {
  try {
    let resp = await login(loginForm);
    
    if (resp.isSuccess == 1) {
      console.log(resp.data.loginData.token);
      cookie.set('token', resp.data.loginData.token);
      showToast('登录成功');
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
const handleRegister = async (registerForm: RegisterForm) => {
  try {
    let resp = await register(registerForm);
    
    if (resp.isSuccess === 1) {
      showToast('注册成功');
      // 自动切换到登录
      setTimeout(() => toggleMode(), 1000);
    } else {
      showToast(resp.message); // Show error message from the response
    }
  } catch (error) {
    console.error('注册失败:', error);
    showToast('注册失败，请重试');
  }
}

</script>

<template>
  <div class="min-h-screen flex bg-gradient-to-br from-base-300 to-base-200 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
    
    <!-- 左侧品牌介绍 -->
    <SideBrand class="animate-slide-in-left" />

    <!-- 右侧登录/注册表单 -->
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl backdrop-blur-sm bg-opacity-95 
                  transition-all duration-500 hover:shadow-2xl border border-base-200"
           :class="{ 'translate-y-0 opacity-100': isLoaded, 'translate-y-8 opacity-0': !isLoaded }">
        <div class="card-body relative">
          <!-- Logo -->
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary 
                        flex items-center justify-center shadow-lg animate-float">
              <i class="fas fa-shield-alt text-2xl text-white"></i>
            </div>
          </div>

          <!-- 标题 -->
          <h2 class="card-title justify-center text-2xl mb-6">
            <div class="flex flex-col items-center gap-2">
              <span class="text-3xl font-bold bg-clip-text text-transparent 
                         bg-gradient-to-r from-primary via-secondary to-accent">
                {{ isLogin ? '欢迎回来' : isForgotPassword ? '找回密码' : isResetPassword ? '重置密码' : '加入我们' }}
              </span>
              <span class="text-base font-normal text-base-content/60">
                {{ isLogin ? '登录以继续你的安全之旅' : 
                   isForgotPassword ? '通过手机验证码重置密码' : 
                   isResetPassword ? '设置新的安全密码' : 
                   '创建账号开启你的安全学习' }}
              </span>
            </div>
          </h2>

          <!-- 表单切换动画 -->
          <Transition name="form-switch" mode="out-in">
            <div v-if="formVisible" class="animate-fade-in">
              <Login v-if="isLogin" @login="handleLogin" @forgot-password="handleForgotPassword" />
              <Register v-else-if="!isForgotPassword && !isResetPassword" @register="handleRegister" />
              <ForgotPassword v-else-if="isForgotPassword" @verify="handleVerifyCode" @back="backToLogin" />
              <ResetPassword v-else-if="isResetPassword" :phone="verifiedPhone" @reset="handlePasswordReset" @back="backToLogin" />
            </div>
          </Transition>

          <!-- 社交登录 -->
          <div v-if="isLogin" class="divider">或使用以下方式登录</div>
          <div v-if="isLogin" class="flex gap-4 justify-center">
            <button v-for="(icon, index) in ['fa-google', 'fa-github', 'fa-weixin']" 
                    :key="index"
                    class="btn btn-circle btn-outline hover:rotate-12 transition-all duration-300
                           hover:bg-gradient-to-br from-primary to-secondary hover:border-0
                           hover:text-white">
              <i :class="['fab', icon]"></i>
            </button>
          </div>

          <!-- 切换按钮 -->
          <div v-if="!isForgotPassword && !isResetPassword" class="text-center mt-6">
            <button 
              class="btn btn-link gap-2 transition-all duration-300 hover:gap-4"
              @click="toggleMode"
            >
              <span>{{ isLogin ? '没有账号？立即注册' : '已有账号？立即登录' }}</span>
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>

          <!-- 帮助链接 -->
          <div v-if="isLogin" class="text-center mt-4 text-sm text-base-content/60 space-x-4">
            <a href="#" class="link link-hover" @click.prevent="handleForgotPassword">忘记密码</a>
            <a href="#" class="link link-hover">帮助中心</a>
            <a href="#" class="link link-hover">联系我们</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 表单切换动画 */
.form-switch-enter-active,
.form-switch-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-switch-enter-from,
.form-switch-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 悬浮动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 渐入动画 */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 社交按钮动画 */
.btn-circle {
  transition: all 0.3s ease;
}

.btn-circle:hover {
  transform: translateY(-2px);
}

/* 分隔线样式 */
.divider {
  @apply my-6 text-base-content/40;
}

/* 链接悬浮效果 */
.link-hover {
  transition: all 0.3s ease;
}

.link-hover:hover {
  color: var(--color-primary);
  text-decoration: none;
}
</style> 