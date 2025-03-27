<script setup lang="ts">
// 定义课程接口

import {useRoute, useRouter} from "vue-router";
import { ref, onMounted } from 'vue'
import ModuleDependencyGraph from "../../../components/ModuleDependencyGraph.vue";

const route = useRoute();
const router = useRouter();
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
    prerequisites?: number[]  // 前置需求
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
      title: 'SQL注入基础实验',
      deadline: '2024-06-15',
      difficulty: 2,
      introduction: '帮助用户理解sql注入的基本原理,同时结合实战,让用户对sql注入有初步的理论和实'
    },
    {
      id: 102,
      title: '布尔盲注实战',
      deadline: '2024-06-22',
      difficulty: 3,
      prerequisites: [101],
      introduction: '使用二分法逐字符爆破数据库信息，编写Python脚本实现自动化盲注攻击'
    },
    {
      id: 103,
      title: 'WAF绕过挑战',
      deadline: '2024-06-29',
      difficulty: 4,
      prerequisites: [102],
      introduction: '利用特殊字符（/*!*/）、HEX编码、参数污染等技术突破安全狗/WAF防护规则'
    },
    {
      id: 104,
      title: '二阶注入攻击',
      deadline: '2024-07-06',
      difficulty: 4,
      prerequisites: [103],
      introduction: '分析用户注册场景下的存储型注入漏洞，通过恶意数据存储触发二次查询攻击'
    }
  ]
}

// 将课程实验数据转换为模块依赖图需要的格式
const moduleItems = ref(course.experiments.map(exp => ({
  id: exp.id,
  name: exp.title,
  description: exp.introduction,
  difficulty: exp.difficulty,
  type: "SQL注入",
  status: 'available' as 'available' | 'completed' | 'locked', // 修改这里，限制类型
  prerequisites: exp.prerequisites,
  estimatedTime: "2-3小时"
})));

// 选择模块时的跳转处理
const handleSelectModule = (moduleId: number) => {
  router.push(`/user/module/${moduleId}`);
};

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

function onButtonClick(id:number){
  id
  router.push(`/user/module/${id}`)
}

onMounted(() => {
  isPageLoaded.value = true
  setTimeout(() => {
    isContentVisible.value = true
  }, 100)
})
</script>

<template>
  <div class="container mx-auto px-4 py-6 max-w-6xl" :class="{ 'fade-in': isPageLoaded }">
    <!-- 页面顶部：课程标题和状态 -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 slide-in-top">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <i class="fas fa-graduation-cap text-2xl text-primary"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold hover:scale-[1.02] transition-transform">{{ course.name }}</h1>
          <p class="text-base-content/60 text-sm mt-1">课程ID: #{{ course.id }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div :class="[
          'badge badge-lg py-3 px-4 gap-2 transition-all animate-pulse', 
          getStatusBadgeClass(course.status)
        ]">
          <span class="w-2 h-2 rounded-full bg-current"></span>
          <span class="font-medium">{{ getStatusText(course.status) }}</span>
        </div>
        <button class="btn btn-primary btn-sm gap-2 hidden md:flex">
          <i class="fas fa-bookmark"></i>
          收藏课程
        </button>
      </div>
    </div>

    <!-- 课程信息卡片 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- 左侧：课程简介 -->
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full"
            :class="{ 'slide-in-left': isContentVisible }">
          <div class="card-body">
            <!-- 课程简介 -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <i class="fas fa-info-circle text-xl text-primary"></i>
                </div>
                <h2 class="text-xl font-semibold">课程简介</h2>
              </div>
              <div class="pl-2 space-y-2 text-base-content/80">
                <p class="whitespace-pre-line">{{ course.description }}</p>
              </div>
            </div>

            <!-- 课程详情 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 授课时间 -->
              <div class="flex items-start gap-3 group">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                  <i class="fas fa-clock text-lg text-primary"></i>
                </div>
                <div>
                  <h3 class="font-semibold mb-2">授课时间</h3>
                  <div class="text-base-content/70">
                    <div class="flex items-center gap-2 mb-2 p-2 rounded-lg bg-base-200/50">
                      <i class="fas fa-chalkboard-teacher text-sm text-primary/80"></i>
                      <span>理论课：每周三 19:00-21:00</span>
                    </div>
                    <div class="flex items-center gap-2 p-2 rounded-lg bg-base-200/50">
                      <i class="fas fa-laptop-code text-sm text-primary/80"></i>
                      <span>实战课：每周六 14:00-17:00</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 授课教师 -->
              <div class="flex items-start gap-3 group">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                  <i class="fas fa-user-tie text-lg text-primary"></i>
                </div>
                <div>
                  <h3 class="font-semibold mb-2">授课教师</h3>
                  <div class="flex flex-col gap-2 p-3 rounded-lg bg-base-200/50">
                    <div class="flex items-center gap-2">
                      <div class="avatar">
                        <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span class="text-primary font-bold">{{ course.instructor.name.charAt(0) }}</span>
                        </div>
                      </div>
                      <div>
                        <div class="font-medium">{{ course.instructor.name }}</div>
                        <div class="badge badge-sm badge-outline mt-1">{{ course.instructor.title }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：课程统计 -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full"
            :class="{ 'slide-in-right': isContentVisible }">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <i class="fas fa-chart-bar text-xl text-primary"></i>
              </div>
              <h2 class="text-xl font-semibold">课程统计</h2>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- 模块数量 -->
              <div class="stat bg-base-200/50 rounded-box p-3">
                <div class="stat-figure text-primary">
                  <i class="fas fa-cube text-2xl"></i>
                </div>
                <div class="stat-title text-xs">模块数量</div>
                <div class="stat-value text-primary text-2xl">{{ course.experiments.length }}</div>
              </div>

              <!-- 总学时 -->
              <div class="stat bg-base-200/50 rounded-box p-3">
                <div class="stat-figure text-secondary">
                  <i class="fas fa-clock text-2xl"></i>
                </div>
                <div class="stat-title text-xs">总学时</div>
                <div class="stat-value text-secondary text-2xl">12h</div>
              </div>

              <!-- 难度 -->
              <div class="stat bg-base-200/50 rounded-box p-3">
                <div class="stat-figure text-warning">
                  <i class="fas fa-signal text-2xl"></i>
                </div>
                <div class="stat-title text-xs">平均难度</div>
                <div class="stat-value text-warning text-xl">★★★☆☆</div>
              </div>

              <!-- 进度 -->
              <div class="stat bg-base-200/50 rounded-box p-3">
                <div class="stat-figure text-success">
                  <i class="fas fa-tasks text-2xl"></i>
                </div>
                <div class="stat-title text-xs">完成进度</div>
                <div class="stat-value text-success text-2xl">25%</div>
              </div>
            </div>

            <div class="mt-6">
              <button class="btn btn-primary w-full gap-2">
                <i class="fas fa-play-circle"></i>
                继续学习
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块依赖图 -->
    <div class="card bg-base-100 shadow-xl mb-8 hover:shadow-2xl transition-all duration-300" 
         :class="{ 'slide-in-bottom': isContentVisible }">
      <div class="card-body">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <i class="fas fa-project-diagram text-xl text-primary"></i>
          </div>
          <h2 class="text-xl font-semibold">模块学习路径</h2>
        </div>
        
        <div class="card-content">
          <div class="bg-base-200 rounded-xl p-4 mb-4">
            <div class="flex items-center gap-2 text-base-content/70">
              <i class="fas fa-lightbulb text-warning"></i>
              <p class="text-sm">
                下图展示了课程各模块之间的依赖关系，点击任意模块可直接进入学习。不同颜色代表不同难度，连线表示前置依赖。
              </p>
            </div>
          </div>
          
          <ModuleDependencyGraph 
            :modules="moduleItems" 
            :onSelectModule="handleSelectModule"
          />
        </div>
      </div>
    </div>

    <!-- 实验列表 -->
    <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
         :class="{ 'slide-in-right': isContentVisible }">
      <div class="card-body">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <i class="fas fa-flask text-xl text-primary"></i>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-semibold">实验模块</h2>
            <p class="text-sm text-base-content/60 mt-1">按照推荐顺序完成以下实验获得最佳学习体验</p>
          </div>
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-sm btn-ghost btn-circle">
              <i class="fas fa-ellipsis-v"></i>
            </label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a><i class="fas fa-sort-amount-up mr-2"></i>按难度排序</a></li>
              <li><a><i class="fas fa-calendar-alt mr-2"></i>按截止日期排序</a></li>
              <li><a><i class="fas fa-filter mr-2"></i>仅显示未完成</a></li>
            </ul>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="(experiment, index) in course.experiments" 
               :key="experiment.id"
               class="card bg-base-200 hover:bg-base-200/80 transition-all duration-300 overflow-hidden border border-base-300 group"
               :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="card-body p-0">
              <!-- 序号指示器 -->
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-70"></div>
              
              <div class="p-5">
                <div class="flex items-start gap-4">
                  <!-- 左侧：序号和难度 -->
                  <div class="flex flex-col items-center">
                    <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                      <span class="font-semibold">{{ index + 1 }}</span>
                    </div>
                    <div class="difficulty-indicator" :title="getDifficultyText(experiment.difficulty)">
                      <span class="text-warning text-xs">{{ getDifficultyStars(experiment.difficulty) }}</span>
                    </div>
                  </div>
                  
                  <!-- 右侧：内容 -->
                  <div class="flex-1 space-y-2">
                    <h3 class="text-lg font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                      {{ experiment.title }}
                      <div v-if="index === 0" class="badge badge-sm badge-success">当前</div>
                    </h3>
                    
                    <p class="text-sm text-base-content/70">{{ experiment.introduction }}</p>
                    
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                      <div class="flex items-center gap-1">
                        <i class="fas fa-calendar-alt text-primary"></i>
                        <span>截止: {{ experiment.deadline }}</span>
                      </div>
                      
                      <div v-if="experiment.prerequisites && experiment.prerequisites.length > 0" 
                          class="flex items-center gap-1">
                        <i class="fas fa-link text-primary"></i>
                        <span>前置: {{ experiment.prerequisites.join(', ') }}</span>
                      </div>
                      
                      <div class="flex items-center gap-1">
                        <i class="fas fa-users text-primary"></i>
                        <span>已完成: 65 人</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 按钮 -->
                  <div class="flex flex-col gap-2 ml-2">
                    <button @click="onButtonClick(experiment.id)" 
                            class="btn btn-primary btn-sm gap-2 min-w-24 group-hover:scale-105 transition-transform">
                      <i class="fas fa-play text-xs"></i>
                      开始实验
                    </button>
                    <button class="btn btn-ghost btn-sm gap-2 min-w-24">
                      <i class="fas fa-info-circle text-xs"></i>
                      详情
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 进度条 -->
              <div class="w-full h-1 bg-base-300">
                <div class="h-full bg-primary" :style="{width: index === 0 ? '25%' : '0%'}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础淡入动画 */
.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 从顶部滑入 */
.slide-in-top {
  animation: slideInTop 0.7s ease-out;
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

/* 从左侧滑入 */
.slide-in-left {
  animation: slideInLeft 0.7s ease-out;
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

/* 从右侧滑入 */
.slide-in-right {
  animation: slideInRight 0.7s ease-out;
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

/* 从底部滑入 */
.slide-in-bottom {
  animation: slideInBottom 0.7s ease-out;
}

@keyframes slideInBottom {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 难度指示器 */
.difficulty-indicator {
  padding: 4px 6px;
  border-radius: 6px;
  background-color: var(--color-base-300);
  text-align: center;
}
</style>