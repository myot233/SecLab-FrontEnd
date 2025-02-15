<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UserScore, ScoreboardFilters } from './types.ts'

// 模拟用户数据
const scores = ref<UserScore[]>([
  {
    id: 1,
    username: "张三",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    totalScore: 950,
    completedTasks: 15,
    class: "网络安全1班",
    rank: 1,
    recentActivity: {
      date: "2024-03-15",
      experimentName: "SQL注入实验",
      score: 95
    }
  },
  // ... 更多用户数据
])

// 筛选条件
const filters = ref<ScoreboardFilters>({
  timeRange: 'all',
  experimentType: undefined,
  className: undefined
})

// 当前用户（模拟数据）
const currentUser = ref<UserScore>({
  id: 2,
  username: "当前用户",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  totalScore: 850,
  completedTasks: 12,
  class: "网络安全1班",
  rank: 3
})

// 实验类型列表（模拟数据）
const experimentTypes = [
  "Web安全",
  "系统安全",
  "密码学",
  "网络攻防"
]

// 班级列表（模拟数据）
const classes = [
  "网络安全1班",
  "网络安全2班",
  "信息安全1班"
]

// 过滤后的排行榜数据
const filteredScores = computed(() => {
  let result = [...scores.value]
  
  if (filters.value.experimentType) {
    // 按实验类型筛选的逻辑
  }
  
  if (filters.value.className) {
    result = result.filter(score => score.class === filters.value.className)
  }
  
  return result
})

// 更新筛选条件
const updateFilters = (newFilters: Partial<ScoreboardFilters>) => {
  filters.value = { ...filters.value, ...newFilters }
}
updateFilters;
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 个人得分卡片 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="flex items-center gap-4">
          <img :src="currentUser.avatar" alt="avatar" class="w-16 h-16 rounded-full">
          <div>
            <h2 class="card-title">{{ currentUser.username }}</h2>
            <p class="text-sm">{{ currentUser.class }}</p>
          </div>
          <div class="ml-auto text-right">
            <div class="text-2xl font-bold">第 {{ currentUser.rank }} 名</div>
            <div class="text-sm">总分: {{ currentUser.totalScore }}</div>
            <div class="text-sm">完成任务: {{ currentUser.completedTasks }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="flex flex-wrap gap-4">
          <!-- 时间范围选择 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">时间范围</span>
            </label>
            <select 
              class="select select-bordered"
              v-model="filters.timeRange"
            >
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="all">全部</option>
            </select>
          </div>

          <!-- 实验类型选择 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">实验类型</span>
            </label>
            <select 
              class="select select-bordered"
              v-model="filters.experimentType"
            >
              <option value="">全部</option>
              <option v-for="type in experimentTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- 班级选择 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">班级</span>
            </label>
            <select 
              class="select select-bordered"
              v-model="filters.className"
            >
              <option value="">全部</option>
              <option v-for="class_ in classes" :key="class_" :value="class_">
                {{ class_ }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 排行榜 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">排行榜</h2>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>排名</th>
                <th>用户</th>
                <th>班级</th>
                <th>总分</th>
                <th>完成任务数</th>
                <th>最近活动</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="score in filteredScores" :key="score.id" 
                  :class="{ 'bg-base-200': score.id === currentUser.id }">
                <td>
                  <div class="font-bold" :class="{
                    'text-yellow-500': score.rank === 1,
                    'text-gray-400': score.rank === 2,
                    'text-amber-600': score.rank === 3
                  }">
                    {{ score.rank }}
                  </div>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <img :src="score.avatar" alt="avatar" class="w-8 h-8 rounded-full">
                    <span>{{ score.username }}</span>
                  </div>
                </td>
                <td>{{ score.class }}</td>
                <td>{{ score.totalScore }}</td>
                <td>{{ score.completedTasks }}</td>
                <td v-if="score.recentActivity">
                  <div class="text-sm">
                    <div>{{ score.recentActivity.experimentName }}</div>
                    <div class="text-gray-500">{{ score.recentActivity.date }}</div>
                  </div>
                </td>
                <td v-else>-</td>
              </tr>
            </tbody>
          </table>
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