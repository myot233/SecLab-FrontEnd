<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const editedUser = ref<User>({ ...user.value })
getUserInfo(cookie.get('token')).then((res) => {
  user.value = res.data
  editedUser.value = res.data
  

})
// 性别显示

// const genderText = computed(() => user.value.userGender === 1 ? '男' : '女')
// 编辑模式
const isEditing = ref(false)

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

// 添加动画控制
const isLoaded = ref(false)
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

// 添加统计数据（可以根据实际需求修改）
const userStats = ref({
  completedCourses: 12,
  totalScore: 850,
  ranking: 23,
  activeStreak: 7
})
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 个人资料卡片 -->
    <div class="card bg-base-100 shadow-xl backdrop-blur-sm border border-base-200 
                transition-all duration-500 overflow-hidden"
         :class="{ 'translate-y-0 opacity-100': isLoaded, 'translate-y-4 opacity-0': !isLoaded }">
      <div class="card-body p-0">
        <!-- 顶部背景装饰 -->
        <div class="h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 relative">
          <div class="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        </div>

        <!-- 主要内容 -->
        <div class="px-6 pb-6 -mt-16">
          <!-- 头像和基本信息 -->
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div class="relative group">
              <div class="avatar">
                <div class="w-32 h-32 rounded-full ring-4 ring-base-100">
                  <img :src="user.userImage" alt="用户头像" 
                       class="transition-transform duration-300 group-hover:scale-105" />
                </div>
              </div>
              <div class="absolute -bottom-2 -right-2 bg-base-100 rounded-full p-1 shadow-lg">
                <div class="badge badge-primary">学生</div>
              </div>
            </div>

            <div class="flex-1">
              <h1 class="text-3xl font-bold mb-2 flex items-center gap-3">
                {{ user.userName }}
                <i class="fas fa-check-circle text-primary text-xl"></i>
              </h1>
              <div class="flex flex-wrap gap-4 text-base-content/70">
                <div class="flex items-center gap-2">
                  <i class="fas fa-id-card text-primary/70"></i>
                  <span>{{ user.userStudentNumber }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="fas fa-graduation-cap text-primary/70"></i>
                  <span>{{ user.userAcademy }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="fas fa-users text-primary/70"></i>
                  <span>{{ user.userClass }}</span>
                </div>
              </div>
            </div>

            <button 
              v-if="!isEditing"
              class="btn btn-primary gap-2"
              @click="startEdit"
            >
              <i class="fas fa-edit"></i>
              编辑资料
            </button>
            <div v-else class="space-x-2">
              <button 
                class="btn btn-primary" 
                @click="saveEdit" 
                :disabled="isLoading"
              >
                <i class="fas" :class="isLoading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
                <span>{{ isLoading ? '保存中...' : '保存' }}</span>
              </button>
              <button class="btn btn-ghost" @click="cancelEdit">取消</button>
            </div>
          </div>

          <!-- 统计卡片 -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="stat bg-base-200/50 rounded-box p-4">
              <div class="stat-figure text-primary">
                <i class="fas fa-book-reader text-3xl"></i>
              </div>
              <div class="stat-title">完成课程</div>
              <div class="stat-value text-primary">{{ userStats.completedCourses }}</div>
            </div>
            <div class="stat bg-base-200/50 rounded-box p-4">
              <div class="stat-figure text-secondary">
                <i class="fas fa-star text-3xl"></i>
              </div>
              <div class="stat-title">总分</div>
              <div class="stat-value text-secondary">{{ userStats.totalScore }}</div>
            </div>
            <div class="stat bg-base-200/50 rounded-box p-4">
              <div class="stat-figure text-accent">
                <i class="fas fa-trophy text-3xl"></i>
              </div>
              <div class="stat-title">排名</div>
              <div class="stat-value text-accent">#{{ userStats.ranking }}</div>
            </div>
            <div class="stat bg-base-200/50 rounded-box p-4">
              <div class="stat-figure text-success">
                <i class="fas fa-fire text-3xl"></i>
              </div>
              <div class="stat-title">连续学习</div>
              <div class="stat-value text-success">{{ userStats.activeStreak }}天</div>
            </div>
          </div>

          <!-- 个人信息表单 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(field, key) in [
              { key: 'userName' as keyof User, label: '姓名', icon: 'fa-user', type: 'text' },
              { key: 'userStudentNumber' as keyof User, label: '学号', icon: 'fa-id-card', type: 'text', readonly: true },
              { key: 'userTel' as keyof User, label: '电话', icon: 'fa-phone', type: 'tel' },
              { key: 'userEmail' as keyof User, label: '邮箱', icon: 'fa-envelope', type: 'email' },
              { key: 'userAcademy' as keyof User, label: '学院', icon: 'fa-university', type: 'text' },
              { key: 'userClass' as keyof User, label: '班级', icon: 'fa-users', type: 'text' }
            ]" :key="key"
            class="form-control">
              <label class="label">
                <span class="label-text flex items-center gap-2">
                  <i :class="['fas', field.icon, 'text-primary/70']"></i>
                  {{ field.label }}
                </span>
              </label>
              <input 
                :type="field.type"
                class="input input-bordered bg-base-200/50 focus:bg-base-100 transition-colors"
                v-model="editedUser[field.key]"
                :readonly="!isEditing || field.readonly"
                :class="{ 'input-disabled': !isEditing || field.readonly }"
              >
            </div>

            <!-- 性别选择 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text flex items-center gap-2">
                  <i class="fas fa-venus-mars text-primary/70"></i>
                  性别
                </span>
              </label>
              <select 
                class="select select-bordered bg-base-200/50"
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
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
}

/* 输入框动画 */
.input, .select {
  transition: all 0.3s ease;
}

.input:focus, .select:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 统计卡片动画 */
.stat {
  transition: all 0.3s ease;
}

.stat:hover {
  transform: translateY(-2px);
}

.stat-figure {
  transition: transform 0.3s ease;
}

.stat:hover .stat-figure {
  transform: scale(1.1);
}

/* 头像悬浮效果 */
.avatar img {
  transition: all 0.3s ease;
}

.avatar:hover img {
  transform: scale(1.05);
}
</style> 