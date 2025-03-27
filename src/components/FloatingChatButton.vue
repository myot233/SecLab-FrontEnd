<template>
  <div>
    <!-- 悬浮聊天按钮 -->
    <button 
      v-if="!chatVisible"
      @click="toggleChat" 
      class="fixed bottom-6 right-6 btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-300 z-30 w-14 h-14"
    >
      <i class="fas fa-comment-dots text-xl"></i>
    </button>
    
    <!-- 悬浮聊天窗口 -->
    <FloatingChat 
      v-if="chatVisible" 
      :initial-position="chatPosition"
      :compact="compact"
      @close="chatVisible = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FloatingChat from './FloatingChat.vue'

// 组件属性
const props = defineProps({
  compact: {
    type: Boolean,
    default: true
  },
  defaultPosition: {
    type: Object,
    default: () => ({ x: 20, y: 20 })
  }
})

// 聊天窗口状态
const chatVisible = ref(false)
const chatPosition = ref(props.defaultPosition)

// 切换聊天窗口显示状态
const toggleChat = () => {
  chatVisible.value = true
}
</script> 