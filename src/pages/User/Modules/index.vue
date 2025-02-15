<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ModuleOverViewType } from './components/ModuleOverView.ts'
import ModuleOverView from './components/ModuleOverView.vue'
import { getModuleList } from '../../../api.ts'

// 模拟模块数据
const modules = ref<ModuleOverViewType[]>([
  {
    id: 1,
    name: 'Web安全基础',
    description: '学习Web安全的基本概念和常见漏洞类型，包括SQL注入、XSS等。适合安全学习的入门者。',
    difficulty: 2,
    type: 'Web安全',
    status: 'available',
    estimatedTime: '2-3小时',
  },
  {
    id: 2,
    name: 'SQL注入进阶',
    description: '深入学习SQL注入的各种技术和防御方法，包括盲注、时间注入等高级技巧。',
    difficulty: 4,
    type: 'Web安全',
    status: 'locked',
    prerequisites: [1],
    estimatedTime: '4-5小时',
  },
  {
    id: 3,
    name: '密码学基础',
    description: '学习基本的密码学概念和常用加密算法，包括对称加密、非对称加密等。',
    difficulty: 3,
    type: '密码学',
    status: 'completed',
    estimatedTime: '3-4小时',
    score: 95
  }
])

onMounted(()=>{
  getModuleList().then((res)=>{
    modules.value = res.data;
  })
})

// 筛选条件
const filters = ref({
  type: '',
  difficulty: '',
  status: ''
})

// 类型列表
const types = ['Web安全', '系统安全', '密码学', '网络攻防']

// 过滤模块
const filteredModules = computed(() => {
  return modules.value.filter(module => {
    if (filters.value.type && module.type !== filters.value.type) return false
    if (filters.value.status && module.status !== filters.value.status) return false
    if (filters.value.difficulty && module.difficulty !== parseInt(filters.value.difficulty)) return false
    return true
  })
})
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 筛选器 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="flex flex-wrap gap-4">
          <!-- 类型筛选 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">类型</span>
            </label>
            <select 
              class="select select-bordered"
              v-model="filters.type"
            >
              <option value="">全部</option>
              <option v-for="type in types" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- 难度筛选 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">难度</span>
            </label>
            <select 
              class="select select-bordered"
              v-model="filters.difficulty"
            >
              <option value="">全部</option>
              <option v-for="n in 5" :key="n" :value="n">
                {{ n }} 星
              </option>
            </select>
          </div>

          <!-- 状态筛选 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">状态</span>
            </label>
            <select 
              class="select select-bordered"
              v-model="filters.status"
            >
              <option value="">全部</option>
              <option value="available">可开始</option>
              <option value="locked">未解锁</option>
              <option value="completed">已完成</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ModuleOverView 
        v-for="module in filteredModules" 
        :key="module.id"
        :module="module"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style> 