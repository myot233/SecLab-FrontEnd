<script setup lang="ts">
import type { ModuleOverViewType } from './ModuleOverView.ts'
import { computed, ref } from 'vue'
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

// 计算查看题解所需积分
const getSolutionCost = (difficulty: number) => {
  const costs = {
    1: 0,    // 1星免费
    2: 40,   // 2星40分
    3: 80,   // 3星80分
    4: 120,  // 4星120分
    5: 180   // 5星180分
  }
  return costs[difficulty as keyof typeof costs]
}

// 显示积分确认弹窗
const showCostModal = ref(false)
const solutionCost = computed(() => getSolutionCost(props.module.difficulty))

// 模拟用户积分余额
const userPoints = ref(5000)

const handleViewSolution = () => {
  if (solutionCost.value > userPoints.value) {
    alert('积分不足，快去完成任务获得更多积分吧！')
    return
  }
  showCostModal.value = true
}

const confirmViewSolution = () => {
  userPoints.value -= solutionCost.value
  showCostModal.value = false
  // TODO: 跳转到题解页面
  router.push(`/user/module/${props.module.id}/solution`)
}

// 计算模块对应的积分值
const getModulePoints = (difficulty: number) => {
  const points = {
    1: 40,   // 1星40分
    2: 80,   // 2星80分
    3: 140,  // 3星140分
    4: 180,  // 4星180分
    5: 250   // 5星250分
  }
  return points[difficulty as keyof typeof points]
}

// 用于显示的积分值
const modulePoints = computed(() => getModulePoints(props.module.difficulty))
</script>

<template>
  <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
    :class="{ 
      'opacity-75 hover:opacity-85': module.status === 'locked',
      'transform hover:-translate-y-1': module.status !== 'locked'
    }"
    @click="handleClick"
  >
    <div class="card-body p-5">
      <!-- 标题栏 -->
      <div class="flex justify-between items-start mb-3">
        <!-- 左侧：标题和ID -->
        <div class="flex items-center gap-2 max-w-[75%]">
          <div class="flex items-center gap-1">
            <i class="fas fa-cube text-base text-primary"></i>
            <span class="text-xs font-mono text-base-content/70">#{{ module.id }}</span>
          </div>
          <h2 class="card-title text-xl truncate">{{ module.name }}</h2>
        </div>
        
        <!-- 右侧：只保留状态 -->
        <div class="flex items-center shrink-0">
          <div class="badge badge-sm px-2" :class="statusClass">
            <i :class="['fas', statusIcon]" class="text-xs mr-0.5"></i>
            <span class="text-xs">{{ statusText }}</span>
          </div>
        </div>
      </div>

      <!-- 信息栏：难度、时间、类型、分数 -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <!-- 难度 -->
          <div class="flex items-center gap-1 whitespace-nowrap">
            <i class="fas fa-signal text-xs text-primary"></i>
            <span :title="getDifficultyText(module.difficulty)" class="text-yellow-500 text-xs">
              {{ getDifficultyStars(module.difficulty) }}
            </span>
          </div>
          <!-- 用时 -->
          <div class="flex items-center gap-1 whitespace-nowrap">
            <i class="fas fa-clock text-xs text-primary"></i>
            <span class="text-xs text-base-content/70">{{ module.estimatedTime }}</span>
          </div>
          <!-- 类型标签 -->
          <div class="badge badge-sm badge-outline text-xs whitespace-nowrap max-w-[80px] truncate px-1.5">
            {{ module.type }}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- 积分标签 -->
          <div class="badge badge-secondary badge-sm whitespace-nowrap px-1.5">
            <i class="fas fa-coins text-xs mr-0.5"></i>
            <span class="text-xs">{{ modulePoints }}积分</span>
          </div>
          <!-- 分数标签 -->
          <div v-if="module.score" class="badge badge-primary badge-sm whitespace-nowrap px-1.5">
            <i class="fas fa-star text-xs mr-0.5"></i>
            <span class="text-xs">{{ module.score }}分</span>
          </div>
        </div>
      </div>

      <!-- 描述 -->
      <p class="text-sm text-base-content/70 leading-relaxed line-clamp-2">{{ module.description }}</p>

      <!-- 前置要求 -->
      <div v-if="module.prerequisites?.length" 
           class="mt-3 border-t border-base-200 pt-2">
        <div class="flex items-center gap-1 mb-1">
          <i class="fas fa-diagram-project text-xs text-primary"></i>
          <span class="text-xs font-medium">前置模块</span>
        </div>
        <div class="flex flex-wrap gap-1">
          <div v-for="prereq in formatPrerequisites" 
               :key="prereq.id"
               class="badge badge-outline badge-sm gap-1 px-2 py-0.5"
          >
            <i class="fas fa-cube text-xs"></i>
            <span class="font-mono text-xs">#{{ prereq.id }}</span>
            <i class="fas fa-check-circle text-xs text-success"></i>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="card-actions justify-end mt-3">
        <button 
          class="btn btn-sm btn-primary gap-1 px-3"
          :class="{ 'btn-disabled': module.status === 'locked' }"
        >
          <i class="fas text-xs" :class="module.status === 'locked' ? 'fa-lock' : 'fa-arrow-right'"></i>
          <span class="text-xs">{{ module.status === 'locked' ? '未解锁' : '开始学习' }}</span>
        </button>
      </div>
    </div>

    <!-- 积分确认弹窗 -->
    <dialog :class="{'modal': true, 'modal-open': showCostModal}">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">确认查看题解</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span>所需积分：</span>
            <span class="text-primary font-bold">{{ solutionCost }}分</span>
          </div>
          <div class="flex justify-between items-center">
            <span>当前积分：</span>
            <span class="text-success font-bold">{{ userPoints }}分</span>
          </div>
          <div class="text-sm text-base-content/70">
            查看题解后将扣除相应积分，是否继续？
          </div>
        </div>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="showCostModal = false">取消</button>
          <button class="btn btn-primary" @click="confirmViewSolution">确认查看</button>
        </div>
      </div>
    </dialog>
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
  height: 1.5rem;
  min-height: 1.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
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

/* 文本截断相关样式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.whitespace-nowrap {
  white-space: nowrap;
}

/* 调整卡片内容最大宽度 */
.card-body {
  max-width: 100%;
}

/* 确保标题最大 */
.card-title {
  font-size: 1.25rem;
  line-height: 1.5rem;
}

/* 调整徽章大小 */
.badge {
  height: 1.5rem;
  min-height: 1.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

/* 调整按钮大小 */
.btn-sm {
  height: 1.75rem;
  min-height: 1.75rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

/* 导航栏样式 */
.tabs {
  border-radius: 0.5rem 0.5rem 0 0;
}

.tab {
  transition: all 0.3s ease;
}

.tab:hover {
  background-color: var(--color-base-100);
}

.tab-active {
  background-color: var(--color-primary);
  color: white;
}

/* 弹窗样式 */
.modal-box {
  max-width: 400px;
  padding: 1.5rem;
}

.modal-action {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>