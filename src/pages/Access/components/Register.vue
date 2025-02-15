<script setup lang="ts">
import { reactive } from 'vue'
import type { RegisterForm } from '../../../types/auth'

const emit = defineEmits<{
  (e: 'register', form: RegisterForm): void;
}>();

const registerForm = reactive({
  userStudentNumber: '',
  userPassword: '',
  confirmPassword: '',
  userName: '',
  userEmail: '',
  userTel: '',
  userAcademy: '',
  classId: 0,
  userGender: 1
});

const errors = reactive({
  userStudentNumber: '',
  userPassword: '',
  confirmPassword: '',
  userName: '',
  userEmail: ''
});

// 注册处理
const handleRegister = () => {
  // 清空错误信息
  errors.userStudentNumber = '';
  errors.userPassword = '';
  errors.confirmPassword = '';
  errors.userName = '';
  errors.userEmail = '';

  // 表单验证
  if (!registerForm.userStudentNumber) {
    errors.userStudentNumber = '请输入学号';
    return;
  }
  if (!registerForm.userPassword) {
    errors.userPassword = '请输入密码';
    return;
  }
  if (registerForm.userPassword !== registerForm.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致';
    return;
  }
  if (!registerForm.userName) {
    errors.userName = '请输入姓名';
    return;
  }
  if (!registerForm.userEmail) {
    errors.userEmail = '请输入邮箱';
    return;
  }

  // 触发注册事件，移除 confirmPassword 字段
  const { confirmPassword, ...registerData } = registerForm;
  emit('register', registerData);
}
</script>

<template>
  <form @submit.prevent="handleRegister">
    <!-- 必填信息 -->
    <div class="text-sm text-base-content/60 mb-4">* 必填项</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">学号 *</span>
        </label>
        <input 
          type="text" 
          class="input input-bordered" 
          v-model="registerForm.userStudentNumber"
          :class="{ 'input-error': errors.userStudentNumber }"
        />
        <label class="label" v-if="errors.userStudentNumber">
          <span class="label-text-alt text-error">{{ errors.userStudentNumber }}</span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">姓名 *</span>
        </label>
        <input 
          type="text" 
          class="input input-bordered" 
          v-model="registerForm.userName"
          :class="{ 'input-error': errors.userName }"
        />
        <label class="label" v-if="errors.userName">
          <span class="label-text-alt text-error">{{ errors.userName }}</span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">密码 *</span>
        </label>
        <input 
          type="password" 
          class="input input-bordered" 
          v-model="registerForm.userPassword"
          :class="{ 'input-error': errors.userPassword }"
        />
        <label class="label" v-if="errors.userPassword">
          <span class="label-text-alt text-error">{{ errors.userPassword }}</span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">确认密码 *</span>
        </label>
        <input 
          type="password" 
          class="input input-bordered" 
          v-model="registerForm.confirmPassword"
          :class="{ 'input-error': errors.confirmPassword }"
        />
        <label class="label" v-if="errors.confirmPassword">
          <span class="label-text-alt text-error">{{ errors.confirmPassword }}</span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">邮箱 *</span>
        </label>
        <input 
          type="email" 
          class="input input-bordered" 
          v-model="registerForm.userEmail"
          :class="{ 'input-error': errors.userEmail }"
        />
        <label class="label" v-if="errors.userEmail">
          <span class="label-text-alt text-error">{{ errors.userEmail }}</span>
        </label>
      </div>

      <!-- 可选信息 -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">电话</span>
        </label>
        <input 
          type="tel" 
          class="input input-bordered" 
          v-model="registerForm.userTel"
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">学院</span>
        </label>
        <input 
          type="text" 
          class="input input-bordered" 
          v-model="registerForm.userAcademy"
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">班级</span>
        </label>
        <input 
          type="text" 
          class="input input-bordered" 
          v-model="registerForm.classId"
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">性别</span>
        </label>
        <select 
          class="select select-bordered" 
          v-model="registerForm.userGender"
        >
          <option :value="1">男</option>
          <option :value="0">女</option>
        </select>
      </div>
    </div>

    <div class="form-control mt-8">
      <button class="btn btn-primary">注册</button>
    </div>
  </form>
</template>

<style scoped>
.input-error {
  border-color: #f00; /* 红色边框表示错误 */
}
</style> 