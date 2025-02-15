<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '../../../types/user'
import { getUserInfo, updateUserInfoByToken } from '../../../api'
import { showToast, useCookie } from '../../../common'

const router = useRouter()
router.currentRoute;
// 模拟用户数据
const user = ref<User>({
  userId: 0,
  userStudentNumber: "",
  userTel: "",
  userImage: "",
  userName: "",
  userAcademy: "",
  userClass: "",
  userEmail: "",
  userGender: 0,
  classId: 0,
  createTime: ""
})
const cookie = useCookie()

getUserInfo(cookie.get('token')).then((res) => {
  user.value = res.data
})

// 性别显示
const genderText = computed(() => user.value.userGender === 1 ? '男' : '女')
genderText;
// 编辑模式
const isEditing = ref(false)
const editedUser = ref<User>({ ...user.value })

// 开始编辑
const startEdit = () => {
  editedUser.value = { ...user.value }
  isEditing.value = true
}

// 保存编辑
const isLoading = ref(false)
const saveEdit = async () => {
  isLoading.value = true
  try {
    await updateUserInfoByToken(editedUser.value, cookie.get('token'))
    user.value = { ...editedUser.value }
    isEditing.value = false
    showToast('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    showToast('保存失败' + error)
  } finally {
    isLoading.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <!-- 头部信息 -->
        <div class="flex items-center gap-6 mb-8">
          <div class="avatar">
            <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img :src="user.userImage" alt="用户头像" />
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold">{{ user.userName }}</h1>
            <p class="text-base-content/70">{{ user.userStudentNumber }}</p>
          </div>
          <button 
            v-if="!isEditing"
            class="btn btn-primary ml-auto"
            @click="startEdit"
          >
            编辑资料
          </button>
          <div v-else class="ml-auto space-x-2">
            <button 
              class="btn btn-primary" 
              @click="saveEdit" 
              :disabled="isLoading"
            >
              <span v-if="isLoading">加载中...</span>
              <span v-else>保存</span>
            </button>
            <button class="btn" @click="cancelEdit">取消</button>
          </div>
        </div>

        <!-- 个人信息表单 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 基本信息 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">姓名</span>
            </label>
            <input 
              type="text" 
              class="input input-bordered" 
              :value="user.userName"
              :readonly="!isEditing"
            >
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">学号</span>
            </label>
            <input 
              type="text" 
              class="input input-bordered" 
              :value="user.userStudentNumber"
              readonly
            >
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">电话</span>
            </label>
            <input 
              type="tel" 
              class="input input-bordered" 
              :value="user.userTel"
              :readonly="!isEditing"

            >
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">邮箱</span>
            </label>
            <input 
              type="email" 
              class="input input-bordered" 

              :readonly="!isEditing"
              v-model="editedUser.userEmail"
            >
          </div>

          <!-- 学院信息 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">学院</span>
            </label>
            <input 
              type="text" 
              class="input input-bordered" 
              :value="user.userAcademy"
              :readonly="!isEditing"
            >
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">班级</span>
            </label>
            <input 
              type="text" 
              class="input input-bordered" 
              :value="user.userClass"
              :readonly="!isEditing"
            >
          </div>

          <!-- 其他信息 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">性别</span>
            </label>
            <select 
              class="select select-bordered"
              :disabled="!isEditing"
              v-model="editedUser.userGender"
            >
              <option :value="1">男</option>
              <option :value="0">女</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style> 