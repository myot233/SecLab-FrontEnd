<script setup lang="ts">
// 定义课程接口

import {useRoute} from "vue-router";
import { ref, onMounted } from 'vue'

const route = useRoute();
const courseId = route.params.id;
courseId;


interface Course {
  id: number
  name: string
  description: string
  schedule: string
  status: 'active' | 'upcoming' | 'completed'
  instructor: {
    name: string
    title: string
  }
  experiments: Array<{
    id: number
    title: string
    deadline: string
    difficulty: 1 | 2 | 3 | 4 | 5  // 1-5 stars difficulty rating
    introduction: string
  }>
}

// 模拟课程数据
const course: Course =  {
  id: 1,
  name: "SQL注入攻防实战",
  description: `本课程系统解析6大SQL注入类型与8种防御绕过技术，配套DVWA、SQLi-Labs等实验环境。
  核心内容：
  - 注入原理：字符型/数值型注入差异分析
  - 攻击手法：联合查询/报错注入/布尔盲注/时间盲注/堆叠注入/二阶注入
  - 绕过技术：空格替代/HEX编码/注释符过滤/特殊字符绕过
  - 防御方案：预编译原理/输入过滤策略/SQL监控日志分析`,
  schedule: '每周三 19:00-21:00（理论） / 每周六 14:00-17:00（靶场实战）',
  status: 'active',
  instructor: {
    name: '王安全',
    title: '网络安全高级研究员',
  },
  experiments: [
    {
      id: 101,
      title: '字符型注入突破',
      deadline: '2024-06-15',
      difficulty: 2,
      introduction: '通过DVWA环境实践单引号闭合技巧，掌握order by判断字段数、union select数据回显等基础注入方法'
    },
    {
      id: 102,
      title: '布尔盲注实战',
      deadline: '2024-06-22',
      difficulty: 3,
      introduction: '使用二分法逐字符爆破数据库信息，编写Python脚本实现自动化盲注攻击'
    },
    {
      id: 103,
      title: 'WAF绕过挑战',
      deadline: '2024-06-29',
      difficulty: 4,
      introduction: '利用特殊字符（/*!*/）、HEX编码、参数污染等技术突破安全狗/WAF防护规则'
    },
    {
      id: 104,
      title: '二阶注入攻击',
      deadline: '2024-07-06',
      difficulty: 4,
      introduction: '分析用户注册场景下的存储型注入漏洞，通过恶意数据存储触发二次查询攻击'
    }
  ]
}

// 获取课程状态对应的标签样式
const getStatusBadgeClass = (status: Course['status']) => {
  const classes = {
    active: 'badge-success',
    upcoming: 'badge-warning',
    completed: 'badge-neutral'
  }
  return classes[status]
}

// 获取状态的中文描述
const getStatusText = (status: Course['status']) => {
  const text = {
    active: '进行中',
    upcoming: '即将开始',
    completed: '已结束'
  }
  return text[status]
}

// Add a helper function to render stars
const getDifficultyStars = (difficulty: number) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)

// 添加难度等级描述
const getDifficultyText = (difficulty: number) => {
  const levels = {
    1: '入门',
    2: '基础',
    3: '进阶',
    4: '困难',
    5: '专家'
  }
  return levels[difficulty as keyof typeof levels]
}

// 添加动画控制状态
const isPageLoaded = ref(false)
const isContentVisible = ref(false)

onMounted(() => {
  isPageLoaded.value = true
  setTimeout(() => {
    isContentVisible.value = true
  }, 100)
})
</script>

<template>
  <div class="container mx-auto p-2" :class="{ 'fade-in': isPageLoaded }">
    <!-- 课程标题和状态 -->
    <div class="flex justify-between items-center mb-6 slide-in-top">
      <div class="flex items-center gap-3">
        <i class="fas fa-graduation-cap text-3xl text-primary"></i>
        <h1 class="text-3xl font-bold hover:scale-105 transition-transform">{{ course.name }}</h1>
      </div>
      <div class="badge badge-lg animate-pulse" :class="getStatusBadgeClass(course.status)">
        <i class="fas fa-circle text-xs mr-2"></i>
        {{ getStatusText(course.status) }}
      </div>
    </div>

    <!-- 课程信息卡片 -->
    <div class="card bg-base-100 shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300"
         :class="{ 'slide-in-left': isContentVisible }">
      <div class="card-body">
        <!-- 课程简介 -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <i class="fas fa-info-circle text-xl text-primary"></i>
            <h2 class="text-xl font-semibold">课程简介</h2>
          </div>
          <div class="pl-7 space-y-2">
            <p class="whitespace-pre-line text-gray-600">{{ course.description }}</p>
          </div>
        </div>

        <!-- 课程详情 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 授课时间 -->
          <div class="flex items-start gap-3">
            <i class="fas fa-clock text-xl text-primary mt-1"></i>
            <div>
              <h3 class="font-semibold mb-2">授课时间</h3>
              <div class="text-gray-600">
                <div class="flex items-center gap-2 mb-1">
                  <i class="fas fa-chalkboard-teacher text-sm"></i>
                  <span>理论课：每周三 19:00-21:00</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="fas fa-laptop-code text-sm"></i>
                  <span>实战课：每周六 14:00-17:00</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 授课教师 -->
          <div class="flex items-start gap-3">
            <i class="fas fa-user-tie text-xl text-primary mt-1"></i>
            <div>
              <h3 class="font-semibold mb-2">授课教师</h3>
              <div class="flex items-center gap-2 text-gray-600">
                <span>{{ course.instructor.name }}</span>
                <span class="text-sm badge badge-outline">{{ course.instructor.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实验列表 -->
    <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
         :class="{ 'slide-in-right': isContentVisible }">
      <div class="card-body">
        <div class="flex items-center gap-2 mb-4">
          <i class="fas fa-flask text-xl text-primary"></i>
          <h2 class="text-xl font-semibold">相关实验</h2>
        </div>
        <div class="grid gap-4">
          <div v-for="(experiment, index) in course.experiments" 
               :key="experiment.id"
               class="card bg-base-200 hover:bg-base-300 transition-all duration-200 fade-in-row"
               :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="card-body p-4">
              <div class="flex justify-between items-start">
                <div class="space-y-2">
                  <h3 class="text-lg font-medium flex items-center gap-2">
                    <i class="fas fa-terminal text-primary"></i>
                    {{ experiment.title }}
                  </h3>
                  <p class="text-sm text-gray-500">{{ experiment.introduction }}</p>
                  <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-1">
                      <i class="fas fa-calendar-alt text-primary"></i>
                      <span>{{ experiment.deadline }}</span>
                    </div>
                    <div class="flex items-center gap-1" :title="getDifficultyText(experiment.difficulty)">
                      <i class="fas fa-signal text-primary"></i>
                      <span class="text-yellow-500">{{ getDifficultyStars(experiment.difficulty) }}</span>
                    </div>
                  </div>
                </div>
                <button class="btn btn-primary btn-sm gap-2 hover:scale-105 transition-transform duration-200">
                  <i class="fas fa-arrow-right text-sm"></i>
                  进入实验
                </button>
              </div>
            </div>
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

/* 基础淡入动画 */
.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* 从上滑入动画 */
.slide-in-top {
  animation: slideInTop 0.5s ease-out;
}

/* 从左滑入动画 */
.slide-in-left {
  animation: slideInLeft 0.5s ease-out;
}

/* 从右滑入动画 */
.slide-in-right {
  animation: slideInRight 0.5s ease-out;
}

/* 表格行淡入动画 */
.fade-in-row {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInTop {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 添加图标悬停效果 */
.fas {
  transition: transform 0.2s ease;
}

.fas:hover {
  transform: scale(1.1);
}

/* 调整卡片过渡效果 */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}
</style>