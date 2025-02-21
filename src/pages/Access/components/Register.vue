<script setup lang="ts">
import { ref } from 'vue'
import type { RegisterForm } from '../../../types/auth'

const emit = defineEmits(['register'])

const registerForm = ref<RegisterForm>({
  userStudentNumber: '',
  userPassword: '',
  userName: '',
  userEmail: '',
  userTel: '',
  userGender: 1
})

const handleSubmit = () => {
  emit('register', registerForm.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="animate__animated animate__fadeIn">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 基本信息 -->
      <div class="form-control animate__animated animate__fadeInLeft" style="--animate-delay: 0.2s">
        <label class="label">
          <span class="label-text flex items-center gap-2">
            <i class="fas fa-user text-primary"></i>
            姓名
          </span>
        </label>
        <input 
          type="text" 
          v-model="registerForm.userName"
          placeholder="请输入姓名" 
          class="input input-bordered bg-base-200/50 focus:bg-base-100 transition-all
                 hover:input-primary focus:input-primary"
          required
        >
      </div>

      <div class="form-control animate__animated animate__fadeInRight" style="--animate-delay: 0.3s">
        <label class="label">
          <span class="label-text flex items-center gap-2">
            <i class="fas fa-id-card text-primary"></i>
            学号
          </span>
        </label>
        <input 
          type="text" 
          v-model="registerForm.userStudentNumber"
          placeholder="请输入学号" 
          class="input input-bordered bg-base-200/50 focus:bg-base-100 transition-all
                 hover:input-primary focus:input-primary"
          required
        >
      </div>

      <!-- 联系方式 -->
      <div class="form-control animate__animated animate__fadeInLeft" style="--animate-delay: 0.4s">
        <label class="label">
          <span class="label-text flex items-center gap-2">
            <i class="fas fa-envelope text-primary"></i>
            邮箱
          </span>
        </label>
        <input 
          type="email" 
          v-model="registerForm.userEmail"
          placeholder="请输入邮箱" 
          class="input input-bordered bg-base-200/50 focus:bg-base-100 transition-all
                 hover:input-primary focus:input-primary"
          required
        >
      </div>

      <div class="form-control animate__animated animate__fadeInRight" style="--animate-delay: 0.5s">
        <label class="label">
          <span class="label-text flex items-center gap-2">
            <i class="fas fa-phone text-primary"></i>
            电话
          </span>
        </label>
        <input 
          type="tel" 
          v-model="registerForm.userTel"
          placeholder="请输入电话" 
          class="input input-bordered bg-base-200/50 focus:bg-base-100 transition-all
                 hover:input-primary focus:input-primary"
          required
        >
      </div>

      <!-- 密码和性别 -->
      <div class="form-control animate__animated animate__fadeInLeft" style="--animate-delay: 0.6s">
        <label class="label">
          <span class="label-text flex items-center gap-2">
            <i class="fas fa-lock text-primary"></i>
            密码
          </span>
        </label>
        <input 
          type="password" 
          v-model="registerForm.userPassword"
          placeholder="请输入密码" 
          class="input input-bordered bg-base-200/50 focus:bg-base-100 transition-all
                 hover:input-primary focus:input-primary"
          required
        >
      </div>

      <div class="form-control animate__animated animate__fadeInRight" style="--animate-delay: 0.7s">
        <label class="label">
          <span class="label-text flex items-center gap-2">
            <i class="fas fa-venus-mars text-primary"></i>
            性别
          </span>
        </label>
        <select 
          v-model="registerForm.userGender"
          class="select select-bordered bg-base-200/50 focus:bg-base-100 transition-all
                 hover:select-primary focus:select-primary"
        >
          <option :value="1">男</option>
          <option :value="0">女</option>
        </select>
      </div>
    </div>

    <!-- 注册按钮 -->
    <button 
      type="submit" 
      class="btn btn-primary w-full mt-6 animate__animated animate__bounceIn"
      style="--animate-delay: 0.8s"
    >
      <i class="fas fa-user-plus mr-2"></i>
      注册
    </button>
  </form>
</template>

<style scoped>
.input, .select {
  transition: all 0.3s ease;
}

.input:focus, .select:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 输入框图标动画 */
.label-text i {
  transition: transform 0.3s ease;
}

.input:focus + .label-text i,
.select:focus + .label-text i {
  transform: scale(1.2);
}
</style> 