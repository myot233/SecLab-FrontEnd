<script setup lang="ts">
import type { ModuleOverViewType } from './ModuleOverView.ts'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  module: ModuleOverViewType
}>()

const router = useRouter()

const getDifficultyStars = (difficulty: number) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)

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

const statusClass = computed(() => ({
  'badge-success': props.module.status === 'completed',
  'badge-warning': props.module.status === 'available',
  'badge-error': props.module.status === 'locked'
}))

const statusIcon = computed(() => ({
  completed: 'fa-check-circle',
  available: 'fa-unlock',
  locked: 'fa-lock'
}[props.module.status]))

const statusText = computed(() => ({
  completed: '已完成',
  available: '可开始',
  locked: '未解锁'
}[props.module.status]))

const handleClick = () => {
  if (props.module.status !== 'locked') {
    router.push(`/user/module/${props.module.id}`)
  }
}

// 格式化前置模块ID
const formatPrerequisites = computed(() => {
  return props.module.prerequisites?.map(id => ({
    id,
    status: 'completed' // 这里可以根据实际情况判断前置模块的状态
  }))
})
</script>

<template>
  <div 
    class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
    :class="{ 
      'opacity-75 hover:opacity-85': module.status === 'locked',
      'transform hover:-translate-y-1': module.status !== 'locked'
    }"
    @click="handleClick"
  >
    <div class="card-body p-5">
      <!-- 标题栏 -->
      <div class="flex justify-between items-start mb-3">
        <div class="flex items-center gap-3">
          <div class="relative">
            <i class="fas fa-cube text-2xl text-primary"></i>
            <span class="absolute -top-2 -right-2 text-xs font-mono bg-base-200 rounded-full px-1.5 py-0.5 
                       border border-base-300 text-base-content/70">
              #{{ module.id }}
            </span>
          </div>
          <div>
            <h2 class="card-title flex items-center gap-2">
              {{ module.name }}
              <div class="badge badge-lg" :class="statusClass">
                <i :class="['fas', statusIcon, 'mr-1']"></i>
                {{ statusText }}
              </div>
            </h2>
            <div class="flex items-center gap-3 mt-1 text-sm text-base-content/70">
              <div class="flex items-center gap-1">
                <i class="fas fa-signal text-primary"></i>
                <span :title="getDifficultyText(module.difficulty)" class="text-yellow-500">
                  {{ getDifficultyStars(module.difficulty) }}
                </span>
              </div>
              <div class="flex items-center gap-1">
                <i class="fas fa-clock text-primary"></i>
                <span>{{ module.estimatedTime }}</span>
              </div>
              <div class="badge badge-outline">{{ module.type }}</div>
            </div>
          </div>
        </div>
        
        <div v-if="module.score" class="badge badge-primary badge-lg">
          <i class="fas fa-star mr-1"></i>
          {{ module.score }} 分
        </div>
      </div>

      <!-- 描述 -->
      <p class="text-base-content/70 leading-relaxed">{{ module.description }}</p>

      <!-- 前置要求 - 重新设计 -->
      <div v-if="module.prerequisites?.length" 
           class="mt-4 border-t border-base-200 pt-3">
        <div class="flex items-center gap-2 mb-2">
          <i class="fas fa-diagram-project text-primary"></i>
          <span class="text-sm font-medium">前置模块</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <div v-for="prereq in formatPrerequisites" 
               :key="prereq.id"
               class="badge badge-outline gap-1 py-3 px-3 hover:badge-primary transition-colors duration-200
                      cursor-help"
               :title="'查看模块 #' + prereq.id"
          >
            <i class="fas fa-cube text-xs"></i>
            <span class="font-mono">#{{ prereq.id }}</span>
            <i class="fas fa-check-circle text-xs text-success"></i>
          </div>
          <div class="tooltip tooltip-right" data-tip="完成所有前置模块后解锁">
            <i class="fas fa-circle-info text-base-content/50 hover:text-primary transition-colors"></i>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="card-actions justify-end mt-4">
        <button 
          class="btn btn-primary btn-sm gap-2"
          :class="{ 'btn-disabled': module.status === 'locked' }"
        >
          <i class="fas" :class="module.status === 'locked' ? 'fa-lock' : 'fa-arrow-right'"></i>
          {{ module.status === 'locked' ? '未解锁' : '开始学习' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--color-base-content), 0.1);
}

.card.opacity-75 {
  cursor: not-allowed;
}

/* 添加渐变边框效果 */
.card:not(.opacity-75):hover {
  border-color: transparent;
  background-image: linear-gradient(var(--color-base-100), var(--color-base-100)),
                    linear-gradient(to right bottom, var(--color-primary), transparent);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

/* 图标动画 */
.fas {
  transition: transform 0.2s ease;
}

.card:hover .fas {
  transform: scale(1.1);
}

/* 徽章动画 */
.badge {
  transition: all 0.3s ease;
}

.card:hover .badge {
  transform: scale(1.05);
}

/* 按钮动画 */
.btn {
  transition: all 0.3s ease;
}

.btn:not(.btn-disabled):hover {
  transform: translateX(5px);
}

/* 添加ID标签的悬停效果 */
.card:hover .fa-cube + span {
  border-color: var(--color-primary);
  background-color: var(--color-base-100);
  transform: scale(1.1);
}

/* ID标签的过渡效果 */
.fa-cube + span {
  transition: all 0.3s ease;
}

/* 前置模块徽章动画 */
.badge {
  transition: all 0.3s ease;
}

.badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 分隔线渐变效果 */
.border-t {
  background-image: linear-gradient(to right, 
    transparent, 
    var(--color-base-300) 15%, 
    var(--color-base-300) 85%, 
    transparent
  );
  background-size: 100% 1px;
  background-position: 0 0;
  background-repeat: no-repeat;
}

/* 工具提示样式 */
.tooltip::before {
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  background-color: var(--color-base-300);
  color: var(--color-base-content);
  border-radius: 0.375rem;
}

.tooltip::after {
  border-color: var(--color-base-300) transparent transparent transparent;
}
</style>