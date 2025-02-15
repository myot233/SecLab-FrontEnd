<script setup lang="ts">
import type { ModuleOverViewType } from './ModuleOverView.ts'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  module: ModuleOverViewType
}>()

const router = useRouter()

const getDifficultyStars = (difficulty: number) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)

const statusClass = computed(() => ({
  'badge-success': props.module.status === 'completed',
  'badge-warning': props.module.status === 'available',
  'badge-error': props.module.status === 'locked'
}))

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
</script>

<template>
  <div 
    class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
    :class="{ 'opacity-75': module.status === 'locked' }"
    @click="handleClick"
  >
    <div class="card-body">
      <div class="flex justify-between items-start">
        <h2 class="card-title">
          {{ module.name }}
          <div class="badge" :class="statusClass">{{ statusText }}</div>
        </h2>
        <div class="text-yellow-500 text-sm">
          {{ getDifficultyStars(module.difficulty) }}
        </div>
      </div>
      
      <p class="text-base-content/70">{{ module.description }}</p>
      
      <div class="flex flex-wrap gap-2 mt-2">
        <div class="badge badge-outline">{{ module.type }}</div>
        <div class="badge badge-outline">{{ module.estimatedTime }}</div>
        <div v-if="module.score" class="badge badge-primary">
          得分: {{ module.score }}
        </div>
      </div>
      
      <div v-if="module.prerequisites?.length" class="mt-2 text-sm text-base-content/60">
        前置要求: Module {{ module.prerequisites.join(', ') }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>