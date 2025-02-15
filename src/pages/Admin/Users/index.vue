<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '../../../types/user'

// 用户列表数据
const users = ref<User[]>([
  {
    userId: 1,
    userStudentNumber: "2021123456789",
    userName: "张三",
    userEmail: "zhangsan@example.com",
    userTel: "13800138000",
    userAcademy: "计算机科学与技术学院",
    userClass: "网络安全1班",
    userGender: 1,
    createTime: "2024-03-15 10:00:00"
  },
  // ... 更多用户数据
])

// 搜索和筛选条件
const filters = ref({
  search: '',
  academy: '',
  class: '',
  gender: ''
})

// 分页
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100
})

// 学院列表
const academies = [
  "计算机科学与技术学院",
  "信息工程学院",
  "网络空间安全学院"
]

// 班级列表
const classes = [
  "网络安全1班",
  "网络安全2班",
  "信息安全1班"
]

// 过滤后的用户列表
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    if (filters.value.search && 
        !user.userName.includes(filters.value.search) && 
        !user.userStudentNumber.includes(filters.value.search)) {
      return false
    }
    if (filters.value.academy && user.userAcademy !== filters.value.academy) {
      return false
    }
    if (filters.value.class && user.userClass !== filters.value.class) {
      return false
    }
    if (filters.value.gender && user.userGender !== parseInt(filters.value.gender)) {
      return false
    }
    return true
  })
})

// 处理用户操作
const handleEdit = (user: User) => {
  // TODO: 实现编辑功能
  console.log('编辑用户:', user)
}

const handleDelete = (user: User) => {
  // TODO: 实现删除功能
  console.log('删除用户:', user)
}

const handleResetPassword = (user: User) => {
  // TODO: 实现重置密码功能
  console.log('重置密码:', user)
}
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">用户管理</h1>
      <button class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        添加用户
      </button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- 搜索框 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">搜索</span>
            </label>
            <input 
              type="text" 
              class="input input-bordered" 
              placeholder="搜索用户名或学号"
              v-model="filters.search"
            >
          </div>

          <!-- 学院筛选 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">学院</span>
            </label>
            <select class="select select-bordered" v-model="filters.academy">
              <option value="">全部</option>
              <option v-for="academy in academies" :key="academy" :value="academy">
                {{ academy }}
              </option>
            </select>
          </div>

          <!-- 班级筛选 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">班级</span>
            </label>
            <select class="select select-bordered" v-model="filters.class">
              <option value="">全部</option>
              <option v-for="class_ in classes" :key="class_" :value="class_">
                {{ class_ }}
              </option>
            </select>
          </div>

          <!-- 性别筛选 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">性别</span>
            </label>
            <select class="select select-bordered" v-model="filters.gender">
              <option value="">全部</option>
              <option value="1">男</option>
              <option value="0">女</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>邮箱</th>
                <th>电话</th>
                <th>学院</th>
                <th>班级</th>
                <th>性别</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.userId">
                <td>{{ user.userStudentNumber }}</td>
                <td>{{ user.userName }}</td>
                <td>{{ user.userEmail }}</td>
                <td>{{ user.userTel }}</td>
                <td>{{ user.userAcademy }}</td>
                <td>{{ user.userClass }}</td>
                <td>{{ user.userGender === 1 ? '男' : '女' }}</td>
                <td>{{ user.createTime }}</td>
                <td>
                  <div class="flex gap-2">
                    <button 
                      class="btn btn-sm btn-ghost"
                      @click="handleEdit(user)"
                    >
                      编辑
                    </button>
                    <button 
                      class="btn btn-sm btn-ghost text-warning"
                      @click="handleResetPassword(user)"
                    >
                      重置密码
                    </button>
                    <button 
                      class="btn btn-sm btn-ghost text-error"
                      @click="handleDelete(user)"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="flex justify-between items-center mt-4">
          <div class="text-sm text-base-content/60">
            共 {{ pagination.total }} 条记录
          </div>
          <div class="join">
            <button class="join-item btn">«</button>
            <button class="join-item btn">1</button>
            <button class="join-item btn btn-active">2</button>
            <button class="join-item btn">3</button>
            <button class="join-item btn">»</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
}
</style> 