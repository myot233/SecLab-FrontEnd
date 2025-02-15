<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Experiment } from '../../../types/experiment'

// 实验列表数据
const experiments = ref<Experiment[]>([
  {
    id: 1,
    name: "SQL注入基础实验",
    description: "通过实践了解SQL注入的原理和基本利用方法",
    difficulty: 3,
    courseId: 1,
    courseName: "Web安全基础",
    status: 'published',
    taskPoints: [
      {
        id: 1,
        name: "SQL注入原理",
        score: 30,
        description: "理解SQL注入的基本概念"
      },
      {
        id: 2,
        name: "SQL注入实战",
        score: 70,
        description: "在靶机环境中实践SQL注入"
      }
    ],
    environment: {
      targetMachine: {
        image: "sqli-labs:latest",
        port: 80,
        memory: "512MB"
      },
      operationMachine: {
        image: "kali-tools:latest",
        port: 6080,
        memory: "1GB"
      }
    },
    studentCount: 120,
    completionRate: 75,
    averageScore: 85,
    createTime: "2024-03-15 10:00:00"
  }
])

// 搜索和筛选条件
const filters = ref({
  search: '',
  difficulty: '',
  status: '',
  courseId: ''
})

// 获取难度星级显示
const getDifficultyStars = (difficulty: number) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)

// 获取状态标签样式
const getStatusBadgeClass = (status: Experiment['status']) => ({
  'badge-success': status === 'published',
  'badge-warning': status === 'draft',
  'badge-error': status === 'archived'
})

// 获取状态文本
const getStatusText = (status: Experiment['status']) => ({
  published: '已发布',
  draft: '草稿',
  archived: '已归档'
}[status])

// 过滤后的实验列表
const filteredExperiments = computed(() => {
  return experiments.value.filter(exp => {
    if (filters.value.search && 
        !exp.name.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false
    }
    if (filters.value.difficulty && exp.difficulty !== parseInt(filters.value.difficulty)) {
      return false
    }
    if (filters.value.status && exp.status !== filters.value.status) {
      return false
    }
    return true
  })
})

// 处理实验操作
const handleEdit = (experiment: Experiment) => {
  console.log('编辑实验:', experiment)
}

const handleDelete = (experiment: Experiment) => {
  console.log('删除实验:', experiment)
}

const handleTaskPoints = (experiment: Experiment) => {
  console.log('管理任务点:', experiment)
}

const handleEnvironment = (experiment: Experiment) => {
  console.log('管理环境:', experiment)
}
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">实验管理</h1>
      <button class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        创建实验
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
              placeholder="搜索实验名称"
              v-model="filters.search"
            >
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

    <!-- 实验列表 -->
    <div class="grid grid-cols-1 gap-6">
      <div v-for="experiment in filteredExperiments" :key="experiment.id" 
           class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <!-- 实验标题和状态 -->
          <div class="flex justify-between items-start">
            <div>
              <h2 class="card-title">
                {{ experiment.name }}
                <div class="badge" :class="getStatusBadgeClass(experiment.status)">
                  {{ getStatusText(experiment.status) }}
                </div>
              </h2>
              <div class="text-sm text-base-content/60 mt-1">
                所属课程: {{ experiment.courseName }}
              </div>
            </div>
            <div class="text-yellow-500">
              难度: {{ getDifficultyStars(experiment.difficulty) }}
            </div>
          </div>

          <!-- 实验描述 -->
          <p class="text-base-content/70 mt-2">{{ experiment.description }}</p>

          <!-- 任务点列表 -->
          <div class="mt-4">
            <h3 class="font-semibold mb-2">任务点</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="task in experiment.taskPoints" :key="task.id" 
                   class="card bg-base-200">
                <div class="card-body p-4">
                  <div class="flex justify-between items-center">
                    <h4 class="font-medium">{{ task.name }}</h4>
                    <span class="badge badge-primary">{{ task.score }}分</span>
                  </div>
                  <p class="text-sm text-base-content/70">{{ task.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 环境配置 -->
          <div class="mt-4">
            <h3 class="font-semibold mb-2">实验环境</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="experiment.environment.targetMachine" class="card bg-base-200">
                <div class="card-body p-4">
                  <h4 class="font-medium">靶机环境</h4>
                  <div class="text-sm">
                    <div>镜像: {{ experiment.environment.targetMachine.image }}</div>
                    <div>端口: {{ experiment.environment.targetMachine.port }}</div>
                    <div>内存: {{ experiment.environment.targetMachine.memory }}</div>
                  </div>
                </div>
              </div>
              <div v-if="experiment.environment.operationMachine" class="card bg-base-200">
                <div class="card-body p-4">
                  <h4 class="font-medium">操作环境</h4>
                  <div class="text-sm">
                    <div>镜像: {{ experiment.environment.operationMachine.image }}</div>
                    <div>端口: {{ experiment.environment.operationMachine.port }}</div>
                    <div>内存: {{ experiment.environment.operationMachine.memory }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 统计信息 -->
          <div class="flex gap-6 mt-4 text-sm text-base-content/60">
            <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{{ experiment.studentCount }} 名学生</span>
            </div>
            <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>完成率 {{ experiment.completionRate }}%</span>
            </div>
            <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>平均分 {{ experiment.averageScore }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions justify-end mt-4">
            <button 
              class="btn btn-sm btn-ghost"
              @click="handleTaskPoints(experiment)"
            >
              任务点
            </button>
            <button 
              class="btn btn-sm btn-ghost"
              @click="handleEnvironment(experiment)"
            >
              环境配置
            </button>
            <button 
              class="btn btn-sm btn-ghost"
              @click="handleEdit(experiment)"
            >
              编辑
            </button>
            <button 
              class="btn btn-sm btn-ghost text-error"
              @click="handleDelete(experiment)"
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