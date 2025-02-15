<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Course } from '../../../types/course'

// 课程列表数据
const courses = ref<Course[]>([
  {
    id: 1,
    name: "Web安全基础",
    description: "本课程介绍Web安全的基本概念和常见漏洞...",
    cover: "https://picsum.photos/300/200",
    difficulty: 3,
    category: "Web安全",
    status: 'published',
    studentCount: 156,
    experimentCount: 8,
    createTime: "2024-03-15 10:00:00"
  },
  {
    id: 2,
    name: "密码学原理",
    description: "介绍现代密码学的基本原理和应用...",
    cover: "https://picsum.photos/300/200",
    difficulty: 4,
    category: "密码学",
    status: 'published',
    studentCount: 89,
    experimentCount: 6,
    createTime: "2024-03-14 15:30:00"
  }
])

// 搜索和筛选条件
const filters = ref({
  search: '',
  category: '',
  difficulty: '',
  status: ''
})

// 课程分类
const categories = [
  "Web安全",
  "系统安全",
  "密码学",
  "网络攻防",
  "移动安全"
]

// 过滤后的课程列表
const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    if (filters.value.search && 
        !course.name.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false
    }
    if (filters.value.category && course.category !== filters.value.category) {
      return false
    }
    if (filters.value.difficulty && course.difficulty !== parseInt(filters.value.difficulty)) {
      return false
    }
    if (filters.value.status && course.status !== filters.value.status) {
      return false
    }
    return true
  })
})

// 获取难度星级显示
const getDifficultyStars = (difficulty: number) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)

// 获取状态标签样式
const getStatusBadgeClass = (status: Course['status']) => ({
  'badge-success': status === 'published',
  'badge-warning': status === 'draft',
  'badge-error': status === 'archived'
})

// 获取状态文本
const getStatusText = (status: Course['status']) => ({
  published: '已发布',
  draft: '草稿',
  archived: '已归档'
}[status])

// 处理课程操作
const handleEdit = (course: Course) => {
  console.log('编辑课程:', course)
}

const handleDelete = (course: Course) => {
  console.log('删除课程:', course)
}

const handleExperiments = (course: Course) => {
  console.log('管理实验:', course)
}

const handleStudents = (course: Course) => {
  console.log('管理学生:', course)
}
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">课程管理</h1>
      <button class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        创建课程
      </button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">搜索</span>
            </label>
            <input 
              type="text" 
              class="input input-bordered" 
              placeholder="搜索课程名称"
              v-model="filters.search"
            >
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">分类</span>
            </label>
            <select class="select select-bordered" v-model="filters.category">
              <option value="">全部</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">难度</span>
            </label>
            <select class="select select-bordered" v-model="filters.difficulty">
              <option value="">全部</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} 星</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">状态</span>
            </label>
            <select class="select select-bordered" v-model="filters.status">
              <option value="">全部</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
              <option value="archived">已归档</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in filteredCourses" :key="course.id" 
           class="card bg-base-100 shadow-xl">
        <!-- 课程封面 -->
        <figure class="relative">
          <img :src="course.cover" :alt="course.name" class="w-full h-48 object-cover">
          <div class="absolute top-2 right-2">
            <div class="badge" :class="getStatusBadgeClass(course.status)">
              {{ getStatusText(course.status) }}
            </div>
          </div>
        </figure>

        <div class="card-body">
          <!-- 课程信息 -->
          <h2 class="card-title">
            {{ course.name }}
            <div class="text-sm font-normal text-yellow-500">
              {{ getDifficultyStars(course.difficulty) }}
            </div>
          </h2>
          <p class="text-base-content/70">{{ course.description }}</p>

          <!-- 课程统计 -->
          <div class="flex gap-4 my-2 text-sm text-base-content/60">
            <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{{ course.studentCount }} 名学生</span>
            </div>
            <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>{{ course.experimentCount }} 个实验</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions justify-end mt-4">
            <button 
              class="btn btn-sm btn-ghost"
              @click="handleStudents(course)"
            >
              学生
            </button>
            <button 
              class="btn btn-sm btn-ghost"
              @click="handleExperiments(course)"
            >
              实验
            </button>
            <button 
              class="btn btn-sm btn-ghost"
              @click="handleEdit(course)"
            >
              编辑
            </button>
            <button 
              class="btn btn-sm btn-ghost text-error"
              @click="handleDelete(course)"
            >
              删除
            </button>
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