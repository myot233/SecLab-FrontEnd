<script setup lang="ts">
// 定义课程接口

import {useRoute, useRouter} from "vue-router";
import { ref, onMounted, type Ref } from 'vue'
import ModuleDependencyGraph from "../../../components/ModuleDependencyGraph.vue";
import { CourseStatus } from "./index";
import type { Course } from "./index";
import {getCourseDetail} from "../../../api.ts";

const route = useRoute();
const router = useRouter();
const courseId = route.params.id;

// 添加错误提示状态
const errorMessage = ref<string | null>(null);

// 模拟课程数据
let course:Ref<Course> = ref({
  id: null,
  name: "",
  description: null,
  difficulty: null,
  type: null,
  tags: null,
  imageUrl: null,
  costTime: null,
  schedule: null,
  status: null,
  instructor: null,
  modules: []
})

// 用于模块依赖图的数据
const moduleItems = ref<any[]>([]);

// 添加学习进度
const learningProgress = ref(35);

// 添加课程资源
const courseResources = ref([
  { name: '课程PPT', type: 'pdf', icon: 'file-pdf', size: '2.5MB' },
  { name: '实验手册', type: 'doc', icon: 'file-word', size: '1.8MB' },
  { name: '参考资料', type: 'link', icon: 'link', url: '#' },
  { name: '课程视频', type: 'video', icon: 'video', size: '108MB' }
]);

// 添加相关课程
const relatedCourses = ref([
  { id: 1, name: '网络安全基础', similarity: 95, students: 1280 },
  { id: 2, name: '密码学原理', similarity: 82, students: 865 },
  { id: 3, name: '数据加密与解密', similarity: 78, students: 742 }
]);

onMounted( async ()=>{
  let result = await getCourseDetail(Number(courseId));
  if (result.message == "success"){
    course.value = result.data;
    // 更新模块依赖图数据
    moduleItems.value = course.value.modules.map(module => ({
      id: module.moduleId,
      name: module.moduleName,
      description: module.introduction,
      difficulty: module.difficulty,
      type: module.type ? module.type.join(', ') : "",
      status: 'available' as 'available' | 'completed' | 'locked',
      prerequisites: [], // 假设模块没有prerequisites属性
      estimatedTime: "2-3小时"
    }));
  }
})

// 选择模块时的跳转处理
const handleSelectModule = (moduleId: number) => {
  router.push(`/user/module/${moduleId}`);
};

// 获取课程状态对应的标签样式
const getStatusBadgeClass = (status: CourseStatus | null) => {
  if (!status) return 'badge-neutral';
  const classes = {
    [CourseStatus.ACTIVE]: 'badge-success',
    [CourseStatus.UPCOMING]: 'badge-warning',
    [CourseStatus.COMPLETED]: 'badge-neutral'
  }
  return classes[status];
}

// 获取状态的中文描述
const getStatusText = (status: CourseStatus | null) => {
  if (!status) return '未知';
  const text = {
    [CourseStatus.ACTIVE]: '进行中',
    [CourseStatus.UPCOMING]: '即将开始',
    [CourseStatus.COMPLETED]: '已结束'
  }
  return text[status];
}

// Add a helper function to render stars
const getDifficultyStars = (difficulty: number | null) => {
  if (difficulty === null) return '未知';
  return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
}

// 添加难度等级描述
const getDifficultyText = (difficulty: number | null) => {
  if (difficulty === null) return '未知';
  const levels = {
    1: '入门',
    2: '基础',
    3: '进阶',
    4: '困难',
    5: '专家'
  }
  return levels[difficulty as keyof typeof levels];
}

// 添加动画控制状态
const isPageLoaded = ref(false)
const isContentVisible = ref(false)

function onButtonClick(id:number | null){
  if (id === null) return;
  router.push(`/user/module/${id}`);
}

onMounted(() => {
  isPageLoaded.value = true
  setTimeout(() => {
    isContentVisible.value = true
  }, 100)
})
</script>

<template>
  <div class="container-fluid px-4 py-6 overflow-x-hidden" :class="{ 'fade-in': isPageLoaded }">
    <!-- 错误提示 -->
    <div v-if="errorMessage" class="alert alert-error mb-4">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ errorMessage }}</span>
    </div>
    
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
              <!-- 课程属性信息 -->
              <div class="flex items-start gap-3">
                <i class="fas fa-clipboard-list text-xl text-primary mt-1"></i>
                <div>
                  <h3 class="font-semibold mb-2">课程信息</h3>
                  <div class="text-gray-600">
                    <div class="flex items-center gap-2 mb-1">
                      <i class="fas fa-tag text-sm"></i>
                      <span>类型：{{ course.type }}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-1">
                      <i class="fas fa-signal text-sm"></i>
                      <span>难度：{{ getDifficultyText(course.difficulty) }} {{ getDifficultyStars(course.difficulty) }}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-1">
                      <i class="fas fa-clock text-sm"></i>
                      <span>预计学时：{{ course.costTime }}小时</span>
                    </div>
                    <div v-if="course.tags && course.tags.length > 0" class="flex items-center gap-2 flex-wrap mt-2">
                      <span v-for="tag in course.tags" :key="tag" class="badge badge-primary badge-outline">{{ tag }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 授课时间 -->
              <div class="flex items-start gap-3">
                <i class="fas fa-calendar-alt text-xl text-primary mt-1"></i>
                <div>
                  <h3 class="font-semibold mb-2">授课安排</h3>
                  <div class="text-gray-600">
                    <div class="flex items-center gap-2 mb-1">
                      <i class="fas fa-chalkboard-teacher text-sm"></i>
                      <span>{{ course.schedule }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 讲师信息部分 -->
            <div v-if="course.instructor" class="mt-6 pt-4 border-t border-base-300">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <i class="fas fa-chalkboard-teacher text-xl text-primary"></i>
                </div>
                <h2 class="text-xl font-semibold">讲师信息</h2>
              </div>
              <div class="flex items-center gap-4 pl-2">
                <div class="avatar">
                  <div class="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <i class="fas fa-user text-xl text-primary"></i>
                  </div>
                </div>
                <div>
                  <div class="text-lg font-medium">讲师 #{{ course.instructor }}</div>
                  <div class="text-sm text-base-content/70">信息学院教师</div>
                  <div class="flex items-center gap-3 mt-1">
                    <div class="flex items-center text-yellow-500">
                      <i class="fas fa-star text-xs"></i>
                      <span class="ml-1 text-sm">4.8</span>
                    </div>
                    <div class="text-xs text-base-content/60">
                      <i class="fas fa-user-graduate"></i>
                      <span class="ml-1">100+ 学生</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 学习进度部分 -->
            <div class="mt-6 pt-4 border-t border-base-300">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <i class="fas fa-chart-line text-xl text-primary"></i>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold">学习进度</h2>
                    <span class="text-primary font-bold">{{ learningProgress }}%</span>
                  </div>
                </div>
              </div>
              <div class="w-full bg-base-300 rounded-full h-3 mt-1">
                <div class="bg-primary h-3 rounded-full" :style="`width: ${learningProgress}%`"></div>
              </div>
              <div class="text-sm text-base-content/70 mt-2 flex justify-between">
                <span>完成模块: {{ Math.ceil(course.modules.length * learningProgress / 100) }}/{{ course.modules.length }}</span>
                <span>预计完成: {{ course.costTime ? Math.ceil(course.costTime * (100 - learningProgress) / 100) : '未知' }} 小时</span>
              </div>
            </div>
            
            <!-- 课程资源部分 -->
            <div class="mt-6 pt-4 border-t border-base-300">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <i class="fas fa-file-alt text-xl text-primary"></i>
                </div>
                <h2 class="text-xl font-semibold">课程资源</h2>
              </div>
              <div class="space-y-2 pl-2">
                <div v-for="(resource, index) in courseResources" :key="index"
                     class="flex items-center justify-between p-2 bg-base-200/50 rounded-lg hover:bg-base-200 transition-colors">
                  <div class="flex items-center gap-2">
                    <i :class="`fas fa-${resource.icon} text-primary`"></i>
                    <span>{{ resource.name }}</span>
                  </div>
                  <div class="flex items-center">
                    <span v-if="resource.size" class="text-xs text-base-content/60 mr-2">{{ resource.size }}</span>
                    <button class="btn btn-xs btn-ghost btn-circle">
                      <i class="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧信息卡片（目前没有内容，可以后续扩展）-->
      <div class="lg:col-span-1">
        <div class="space-y-4">
          <!-- 模块依赖图卡片 -->
          <div class="card bg-primary/15 shadow-xl hover:shadow-2xl transition-all duration-300 h-full"
               :class="{ 'slide-in-right': isContentVisible }">
            <div class="card-body p-4">
              <div class="flex items-center gap-2 mb-2">
                <i class="fas fa-project-diagram text-xl text-primary"></i>
                <h2 class="text-lg font-semibold">模块依赖图</h2>
              </div>
              <p class="text-sm text-base-content/70 mb-3">下图展示了课程模块之间的依赖关系，请按推荐路径学习</p>
              <div class="bg-primary/10 p-3 rounded-xl min-h-[400px] flex items-center justify-center">
                <ModuleDependencyGraph :modules="moduleItems" />
              </div>
              <div class="flex justify-between text-xs text-base-content/60 mt-3">
                <div class="flex items-center gap-1">
                  <span class="w-3 h-3 rounded-full bg-success"></span>
                  <span>已完成</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-3 h-3 rounded-full bg-primary"></span>
                  <span>当前可学</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-3 h-3 rounded-full bg-base-300"></span>
                  <span>待解锁</span>
                </div>
              </div>
              
              <!-- 学习建议 -->
              <div class="mt-4 p-3 bg-info/10 rounded-lg text-sm">
                <div class="flex items-start gap-2">
                  <i class="fas fa-lightbulb text-info mt-0.5"></i>
                  <div>
                    <p class="font-medium text-info mb-1">学习建议</p>
                    <p class="text-base-content/70">按照依赖图中的推荐路径学习，可以获得最佳的学习体验。先掌握基础模块，再逐步学习高级内容。</p>
                  </div>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="grid grid-cols-2 gap-2 mt-4">
                <button class="btn btn-sm btn-outline btn-primary">
                  <i class="fas fa-expand-arrows-alt"></i>
                  放大查看
                </button>
                <button class="btn btn-sm btn-outline">
                  <i class="fas fa-download"></i>
                  导出路线图
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块列表 -->
    <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
         :class="{ 'slide-in-right': isContentVisible }">
      <div class="card-body">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div class="flex items-center gap-2">
            <i class="fas fa-flask text-xl text-primary"></i>
            <h2 class="text-xl font-semibold">课程模块</h2>
            <span class="badge badge-primary">{{ course.modules.length }}个</span>
          </div>
          
          <!-- 筛选和搜索 -->
          <div class="flex flex-wrap gap-2">
            <div class="join">
              <button class="btn btn-sm join-item btn-active">全部</button>
              <button class="btn btn-sm join-item">实验</button>
              <button class="btn btn-sm join-item">理论</button>
            </div>
            <div class="form-control">
              <div class="input-group input-group-sm">
                <input type="text" placeholder="搜索模块..." class="input input-sm input-bordered" />
                <button class="btn btn-sm btn-square">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 相关课程建议 -->
        <div class="bg-primary/10 p-4 rounded-lg mb-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-graduation-cap text-primary"></i>
              <h3 class="font-medium">相关推荐课程</h3>
            </div>
            <button class="btn btn-sm btn-ghost">查看全部</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div v-for="course in relatedCourses" :key="course.id" 
                 class="flex items-center gap-2 p-2 bg-base-200/70 rounded-md hover:bg-base-200 transition-colors">
              <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <i class="fas fa-book"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{{ course.name }}</div>
                <div class="flex items-center gap-2 text-xs text-base-content/60">
                  <span>{{ course.students }}+ 学生</span>
                  <span>相似度: {{ course.similarity }}%</span>
                </div>
              </div>
              <button class="btn btn-xs btn-ghost btn-circle">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="grid gap-4">
          <div v-for="(module, index) in course.modules" 
               :key="module.moduleId || index"
               class="card bg-base-200 hover:bg-base-300 transition-all duration-200 fade-in-row"
               :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="card-body p-4">
              <div class="flex justify-between items-start">
                <div class="space-y-2">
                  <h3 class="text-lg font-medium flex items-center gap-2">
                    <i class="fas fa-terminal text-primary"></i>
                    {{ module.moduleName }}
                    <span class="badge badge-sm" :class="index === 0 ? 'badge-accent' : ''">
                      {{ index === 0 ? '推荐开始' : `模块 ${index + 1}` }}
                    </span>
                  </h3>
                  <p class="text-sm text-gray-500">{{ module.introduction }}</p>
                  <div class="flex items-center gap-4 text-sm flex-wrap">
                    <div v-if="module.type && module.type.length > 0" class="flex items-center gap-1">
                      <i class="fas fa-bookmark text-primary"></i>
                      <span>{{ module.type.join(', ') }}</span>
                    </div>
                    <div class="flex items-center gap-1" :title="getDifficultyText(module.difficulty)">
                      <i class="fas fa-signal text-primary"></i>
                      <span class="text-yellow-500">{{ getDifficultyStars(module.difficulty) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <i class="fas fa-clock text-primary"></i>
                      <span>预计 {{ module.difficulty ? `${module.difficulty}-${module.difficulty + 1}小时` : '未知' }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2 items-end">
                  <div class="badge" :class="index < Math.ceil(course.modules.length * learningProgress / 100) ? 'badge-success' : 'badge-outline'">
                    {{ index < Math.ceil(course.modules.length * learningProgress / 100) ? '已完成' : '待完成' }}
                  </div>
                  <button @click="onButtonClick(module.moduleId)" class="btn btn-primary btn-sm gap-2 hover:scale-105 transition-transform duration-200 mt-2">
                    <i class="fas fa-arrow-right text-sm"></i>
                    进入模块
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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

html, body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  width: 100%;
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