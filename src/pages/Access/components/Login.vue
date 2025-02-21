<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { LoginForm } from "../../../types/auth.ts";

const emit = defineEmits<{
  (e: 'login', form: LoginForm): void;
}>();

const loginForm = ref<LoginForm>({
  userStudentNumber: '',
  userPassword: '',
  remember: false
});

const errors = reactive({
  userStudentNumber: '',
  userPassword: ''
});

// 登录处理
const handleSubmit = () => {
  // 清空错误信息
  errors.userStudentNumber = '';
  errors.userPassword = '';

  // 表单验证
  if (!loginForm.value.userStudentNumber) {
    errors.userStudentNumber = '请输入学号';
    return;
  }
  if (!loginForm.value.userPassword) {
    errors.userPassword = '请输入密码';
    return;
  }
  
  // 触发登录事件
  emit('login', loginForm.value);
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="animate__animated animate__fadeIn">
    <div class="form-control animate__animated animate__fadeInLeft" style="--animate-delay: 0.2s">
      <label class="label">
        <span class="label-text flex items-center gap-2">
          <i class="fas fa-id-card text-primary"></i>
          学号
        </span>
      </label>
      <input
        type="text"
        v-model="loginForm.userStudentNumber"
        placeholder="请输入学号"
        class="input input-bordered bg-base-200/50 focus:bg-base-100 transition-all
               hover:input-primary focus:input-primary"
        required
        :class="{ 'input-error': errors.userStudentNumber }"
      />
      <label class="label" v-if="errors.userStudentNumber">
        <span class="label-text-alt text-error">{{ errors.userStudentNumber }}</span>
      </label>
    </div>

    <div class="form-control mt-4 animate__animated animate__fadeInLeft" style="--animate-delay: 0.3s">
      <label class="label">
        <span class="label-text flex items-center gap-2">
          <i class="fas fa-lock text-primary"></i>
          密码
        </span>
      </label>
      <input
        type="password"
        v-model="loginForm.userPassword"
        placeholder="请输入密码"
        class="input input-bordered bg-base-200/50 focus:bg-base-100 transition-all
               hover:input-primary focus:input-primary"
        required
        :class="{ 'input-error': errors.userPassword }"
      />
      <label class="label" v-if="errors.userPassword">
        <span class="label-text-alt text-error">{{ errors.userPassword }}</span>
      </label>
    </div>

    <div class="flex items-center justify-between mt-4 animate__animated animate__fadeInUp" 
         style="--animate-delay: 0.4s">
      <label class="label cursor-pointer gap-2">
        <input type="checkbox" class="checkbox checkbox-primary checkbox-sm" v-model="loginForm.remember">
        <span class="label-text">记住我</span>
      </label>
      <a href="#" class="text-sm link link-primary">忘记密码？</a>
    </div>

    <button 
      type="submit" 
      class="btn btn-primary w-full mt-6 animate__animated animate__bounceIn"
      style="--animate-delay: 0.5s"
    >
      <i class="fas fa-sign-in-alt mr-2"></i>
      登录
    </button>
  </form>
</template>

<style scoped>
/* 添加样式以增强用户体验 */
.input-error {
  border-color: #f00; /* 红色边框表示错误 */
}

.input {
  transition: all 0.3s ease;
}

.input:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.checkbox {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
</style>