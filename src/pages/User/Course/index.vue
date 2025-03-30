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
          </div>
        </div>
      </div>

      <!-- 右侧信息卡片（目前没有内容，可以后续扩展）-->
      <div class="lg:col-span-1">
        <!-- 可以添加教师信息等右侧内容 -->
      </div>
    </div>

    <!-- 模块列表 -->
    <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
         :class="{ 'slide-in-right': isContentVisible }">
      <div class="card-body">
        <div class="flex items-center gap-2 mb-4">
          <i class="fas fa-flask text-xl text-primary"></i>
          <h2 class="text-xl font-semibold">课程模块</h2>
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
                  </div>
                </div>
                <button @click="onButtonClick(module.moduleId)" class="btn btn-primary btn-sm gap-2 hover:scale-105 transition-transform duration-200">
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