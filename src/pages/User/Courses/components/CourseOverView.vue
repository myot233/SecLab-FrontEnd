<script setup lang="ts">
import { computed } from 'vue';
import type { CourseOverViewType } from './CourseOverView';
import { useRouter } from 'vue-router';

const props = defineProps<{
  course: CourseOverViewType;
}>();

const router = useRouter();

const statusConfig = computed(() => ({
  'in-progress': {
    icon: 'fa-spinner fa-spin',
    text: '进行中',
    class: 'badge-info'
  },
  'completed': {
    icon: 'fa-check-circle',
    text: '已完成',
    class: 'badge-success'
  },
  'available': {
    icon: 'fa-unlock',
    text: '可开始',
    class: 'badge-warning'
  }
}[props.course.status]));

const getDifficultyStars = (difficulty: number) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);

const handleClick = () => {
  router.push(`/user/course/${props.course.id}`);
};
</script>

<template>
  <div class="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-500 group 
              backdrop-blur-sm border border-base-200 hover:border-primary/20 h-full"
       @click="handleClick">
    <!-- 课程图片 -->
    <figure class="relative overflow-hidden aspect-video">
      <img :src="course.image" 
           :alt="course.name"
           class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
      <div class="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent opacity-60"></div>
      
      <!-- 状态标签 -->
      <div class="absolute top-3 right-3">
        <div :class="['badge', 'badge-md', statusConfig.class, 'gap-1']">
          <i :class="['fas', statusConfig.icon]"></i>
          {{ statusConfig.text }}
        </div>
      </div>
    </figure>

    <div class="card-body p-3">
      <!-- 标题和难度 -->
      <div class="flex justify-between items-start mb-1">
        <h2 class="card-title text-lg group-hover:text-primary transition-colors">
          {{ course.name }}
        </h2>
        <div class="text-yellow-500 text-sm" :title="`难度: ${course.difficulty}/5`">
          {{ getDifficultyStars(course.difficulty) }}
        </div>
      </div>

      <!-- 描述 -->
      <p class="text-base-content/70 text-sm line-clamp-2 mb-2">{{ course.description }}</p>

      <!-- 课程信息 -->
      <div class="mt-2 flex flex-wrap gap-2 text-sm text-base-content/60">
        <div class="flex items-center gap-1">
          <i class="fas fa-clock text-primary/70"></i>
          <span>{{ course.estimatedHours }}小时</span>
        </div>
        <div v-if="course.totalStudents" class="flex items-center gap-1">
          <i class="fas fa-users text-primary/70"></i>
          <span>{{ course.totalStudents }}人学习</span>
        </div>
        <div class="flex items-center gap-1">
          <i class="fas fa-tag text-primary/70"></i>
          <span>{{ course.category }}</span>
        </div>
      </div>

      <!-- 进度条 -->
      <div v-if="course.status === 'in-progress' && course.progress !== undefined" 
           class="mt-3">
        <div class="flex justify-between text-sm mb-1">
          <span class="text-base-content/70">学习进度</span>
          <span class="text-primary">{{ course.progress }}%</span>
        </div>
        <div class="w-full bg-base-200 rounded-full h-2">
          <div class="bg-primary h-2 rounded-full transition-all duration-300"
               :style="{ width: `${course.progress}%` }"></div>
        </div>
      </div>

      <!-- 讲师信息 -->
      <div v-if="course.instructor" 
           class="mt-3 flex items-center gap-2 p-2 bg-base-200/50 rounded-lg">
        <img :src="course.instructor.avatar" 
             :alt="course.instructor.name"
             class="w-8 h-8 rounded-full">
        <div>
          <div class="font-medium text-sm">{{ course.instructor.name }}</div>
          <div class="text-xs text-base-content/60">{{ course.instructor.title }}</div>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="course.tags?.length" class="card-actions justify-start mt-3">
        <div v-for="tag in course.tags" 
             :key="tag" 
             class="badge badge-outline badge-sm">{{ tag }}</div>
      </div>

      <!-- 操作按钮 -->
      <div class="card-actions justify-end mt-3">
        <button class="btn btn-primary btn-sm gap-1 group-hover:scale-105 transition-transform">
          <span>{{ course.status === 'in-progress' ? '继续学习' : '开始学习' }}</span>
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.card:hover {
  transform: translateY(-3px);
}

/* 渐变边框效果 */
.card:hover {
  border-color: transparent;
  background-image: linear-gradient(var(--color-base-100), var(--color-base-100)),
                    linear-gradient(to right bottom, var(--color-primary), transparent);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

/* 图标动画 */
.fas {
  transition: transform 0.3s ease;
}

.card:hover .fas {
  transform: scale(1.1);
}

/* 标签动画 */
.badge {
  transition: all 0.3s ease;
}

.badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* 进度条动画 */
.bg-primary {
  transition: width 1s ease-in-out;
}
</style>