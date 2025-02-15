<script setup lang="ts">
import { reactive } from 'vue'
import type { LoginForm } from "../../../types/auth.ts";

const emit = defineEmits<{
  (e: 'login', form: LoginForm): void;
}>();

const loginForm = reactive<LoginForm>({
  userStudentNumber: '',
  userPassword: '',
  remember: false
});

const errors = reactive({
  userStudentNumber: '',
  userPassword: ''
});

// 登录处理
const handleLogin = () => {
  // 清空错误信息
  errors.userStudentNumber = '';
  errors.userPassword = '';

  // 表单验证
  if (!loginForm.userStudentNumber) {
    errors.userStudentNumber = '请输入学号';
    return;
  }
  if (!loginForm.userPassword) {
    errors.userPassword = '请输入密码';
    return;
  }
  
  // 触发登录事件
  emit('login', loginForm);
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <div class="form-control">
      <label class="label">
        <span class="label-text">学号</span>
      </label>
      <input
        type="text"
        class="input input-bordered"
        v-model="loginForm.userStudentNumber"
        :class="{ 'input-error': errors.userStudentNumber }"
      />
      <label class="label" v-if="errors.userStudentNumber">
        <span class="label-text-alt text-error">{{ errors.userStudentNumber }}</span>
      </label>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">密码</span>
      </label>
      <input
        type="password"
        class="input input-bordered"
        v-model="loginForm.userPassword"
        :class="{ 'input-error': errors.userPassword }"
      />
      <label class="label" v-if="errors.userPassword">
        <span class="label-text-alt text-error">{{ errors.userPassword }}</span>
      </label>
    </div>

    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">记住我</span>
        <input type="checkbox" class="checkbox" v-model="loginForm.remember" />
      </label>
    </div>

    <div class="form-control mt-6">
      <button class="btn btn-primary">登录</button>
    </div>
  </form>
</template>

<style scoped>
/* 添加样式以增强用户体验 */
.input-error {
  border-color: #f00; /* 红色边框表示错误 */
}
</style>