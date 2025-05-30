<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { UserScore, ScoreboardFilters } from './types.ts'
import a from './test_users.json'

// 模拟用户数据 - 按照总分由高到低排序
const initialScores = ref(a.sort((a, b) => b.totalScore - a.totalScore))
const scores = ref<UserScore[]>([...initialScores.value])

// 重新计算排名
const recalculateRanks = (userList: UserScore[]) => {
  return userList.map((user, index) => {
    return {
      ...user,
      rank: index + 1
    }
  })
}

// 初始排序
scores.value = recalculateRanks(scores.value)

// 筛选条件 - 默认设置为"全部"
const filters = ref<ScoreboardFilters>({
  timeRange: 'all',
  experimentType: '',
  className: ''
})

// 当前用户（与个人中心页面同步）
const currentUser = ref<UserScore>({
  id: 3,
  username: '林宗恒',
  avatar: '/example.png',
  totalScore: 874,
  completedTasks: 18,
  class: '网络安全232班',
  rank: 3,
  recentActivity: {
    date: '2025-03-20',
    experimentName: '逆向工程实验',
    score: 90
  }
})

// 实验类型列表
const experimentTypes = ['Web安全', '系统安全', '密码学', '网络攻防', '漏洞扫描', '逆向工程']

// 班级列表
const classes = ['网络安全232班', '网络安全231班', '信息安全231班', '信息安全232班', '物联网安全231班']

// 过滤后的排行榜数据
const filteredScores = computed(() => {
  let result = [...scores.value]

  if (filters.value.experimentType) {
    // 在真实情况下，这里会根据实验类型进行过滤
    // 模拟过滤
    result = result.filter((score) => score.recentActivity && score.recentActivity.experimentName.includes(filters.value.experimentType || ''))
  }

  if (filters.value.className) {
    result = result.filter((score) => score.class === filters.value.className)
  }

  // 根据过滤后的结果重新计算排名
  return recalculateRanks(result)
})

// 监听筛选条件变化，更新排名
watch(
  filters,
  () => {
    console.log('过滤条件变化，重新计算排名')
  },
  { deep: true }
)

// 更新筛选条件
const updateFilters = (newFilters: Partial<ScoreboardFilters>) => {
  filters.value = { ...filters.value, ...newFilters }
}

// 添加动画控制
const isLoaded = ref(false)
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

// 获取排名样式
const getRankStyle = (rank: number) => {
  const styles = {
    1: 'bg-gradient-to-r from-yellow-500 to-yellow-300',
    2: 'bg-gradient-to-r from-gray-400 to-gray-300',
    3: 'bg-gradient-to-r from-amber-600 to-amber-500'
  }
  return styles[rank as keyof typeof styles]
}
</script>

<template>
  <div class="container-fluid px-4 py-6 overflow-x-hidden">
    <!-- 个人得分卡片 -->
    <div class="card bg-gradient-to-br from-primary/10 to-transparent shadow-xl mb-6 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl" :class="{ 'translate-y-0 opacity-100': isLoaded, 'translate-y-4 opacity-0': !isLoaded }">
      <div class="card-body">
        <div class="flex items-center gap-6">
          <div class="relative">
            <img :src="currentUser.avatar" alt="avatar" class="w-20 h-20 rounded-full ring-2 ring-primary/20 object-cover" />
            <div class="absolute -bottom-2 -right-2 bg-base-100 rounded-full p-1 shadow-lg">
              <div class="badge badge-primary">Lv.{{ Math.floor(currentUser.totalScore / 100) }}</div>
            </div>
          </div>
          <div class="flex-1">
            <h2 class="card-title text-2xl mb-1">{{ currentUser.username }}</h2>
            <div class="flex items-center gap-4 text-base-content/70">
              <div class="flex items-center gap-2">
                <i class="fas fa-users text-primary"></i>
                <span>{{ currentUser.class }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-tasks text-primary"></i>
                <span>完成任务: {{ currentUser.completedTasks }}</span>
              </div>
            </div>
          </div>
          <div class="text-center px-6 py-3 bg-base-200 rounded-xl">
            <div class="text-4xl font-bold text-primary mb-1">#{{ currentUser.rank }}</div>
            <div class="text-sm text-base-content/70">当前排名</div>
          </div>
          <div class="text-center px-6 py-3 bg-base-200 rounded-xl">
            <div class="text-4xl font-bold text-primary mb-1">{{ currentUser.totalScore }}</div>
            <div class="text-sm text-base-content/70">总分</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="card bg-base-100 shadow-xl mb-6 overflow-hidden transition-all duration-300 hover:shadow-2xl" :class="{ 'translate-y-0 opacity-100': isLoaded, 'translate-y-4 opacity-0': !isLoaded }">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 时间范围选择 -->
          <div class="form-control">
            <label class="label cursor-pointer gap-2">
              <i class="fas fa-calendar text-primary"></i>
              <span class="label-text">时间范围</span>
            </label>
            <select class="select select-bordered w-full bg-base-100/70 hover:bg-base-100 transition-colors" v-model="filters.timeRange">
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="all">全部</option>
            </select>
          </div>

          <!-- 实验类型选择 -->
          <div class="form-control">
            <label class="label cursor-pointer gap-2">
              <i class="fas fa-flask text-primary"></i>
              <span class="label-text">实验类型</span>
            </label>
            <select class="select select-bordered w-full bg-base-100/70 hover:bg-base-100 transition-colors" v-model="filters.experimentType">
              <option value="">全部</option>
              <option v-for="type in experimentTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- 班级选择 -->
          <div class="form-control">
            <label class="label cursor-pointer gap-2">
              <i class="fas fa-users text-primary"></i>
              <span class="label-text">班级</span>
            </label>
            <select class="select select-bordered w-full bg-base-100/70 hover:bg-base-100 transition-colors" v-model="filters.className">
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
    <div class="card bg-base-100 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl" :class="{ 'translate-y-0 opacity-100': isLoaded, 'translate-y-4 opacity-0': !isLoaded }">
      <div class="p-6 border-b border-base-200">
        <h2 class="card-title flex items-center gap-3">
          <i class="fas fa-trophy text-primary"></i>
          排行榜
          <span v-if="filters.className" class="badge badge-primary">{{ filters.className }}</span>
          <span v-if="filters.experimentType" class="badge badge-secondary">{{ filters.experimentType }}</span>
        </h2>
      </div>

      <div>
        <table class="table table-zebra">
          <thead class="bg-base-200/50">
            <tr>
              <th class="text-center">排名</th>
              <th>用户</th>
              <th>班级</th>
              <th class="text-center">总分</th>
              <th class="text-center">完成任务数</th>
              <th>最近活动</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(score, index) in filteredScores"
              :key="score.id"
              class="transition-colors hover:bg-base-200"
              :class="{
                'bg-primary/5': score.username === currentUser.username,
                'animate-slide-in': isLoaded
              }"
              :style="{
                animationDelay: `${index * 0.1}s`,
                borderLeft: score.rank <= 3 ? '4px solid' : '',
                borderLeftColor: score.rank === 1 ? '#fbbf24' : score.rank === 2 ? '#94a3b8' : score.rank === 3 ? '#d97706' : ''
              }"
            >
              <td class="text-center">
                <div v-if="score.rank <= 3" class="w-8 h-8 rounded-full flex items-center justify-center mx-auto text-white font-bold" :class="getRankStyle(score.rank)">
                  {{ score.rank }}
                </div>
                <div v-else class="font-mono">{{ score.rank }}</div>
              </td>
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar">
                    <div class="w-12 h-12 rounded-full">
                      <img :src="score.avatar" alt="Avatar" class="object-cover" />
                    </div>
                  </div>
                  <div>
                    <div class="font-bold">{{ score.username }}</div>
                    <div v-if="score.username === currentUser.username" class="text-xs opacity-70">(我)</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge badge-ghost">{{ score.class }}</span>
              </td>
              <td class="text-center font-bold">
                {{ score.totalScore }}
              </td>
              <td class="text-center">
                <div class="badge badge-primary">{{ score.completedTasks }}</div>
              </td>
              <td v-if="score.recentActivity">
                <div class="text-sm">
                  <div class="font-medium">{{ score.recentActivity.experimentName }}</div>
                  <div class="text-base-content/50 flex items-center gap-1">
                    <i class="fas fa-calendar-alt text-xs"></i>
                    {{ score.recentActivity.date }}
                    <i class="fas fa-star text-yellow-500 text-xs ml-2"></i>
                    {{ score.recentActivity.score }}
                  </div>
                </div>
              </td>
              <td v-else>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-fluid {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

html,
body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  width: 100%;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 表格样式 */
.table th {
  @apply text-base-content/70 font-medium;
}

.table td {
  @apply py-4;
}

/* 头像效果 */
img.rounded-full {
  transition: transform 0.3s ease;
}

tr:hover img.rounded-full {
  transform: scale(1.1);
}

/* 徽章动画 */
.badge {
  transition: all 0.3s ease;
}

tr:hover .badge {
  transform: scale(1.05);
}

/* 卡片渐变背景 */
.from-primary\/10 {
  --tw-gradient-from: rgb(var(--color-primary) / 0.1);
  --tw-gradient-to: transparent;
}
</style>
