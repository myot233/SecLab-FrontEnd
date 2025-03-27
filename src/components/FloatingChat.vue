<template>
  <div class="floating-chat" 
       :class="{ 'minimized': isMinimized, 'maximized': isMaximized }"
       :style="{ right: position.x + 'px', bottom: position.y + 'px' }">
    
    <!-- 拖动条 -->
    <div class="drag-handle" @mousedown="startDragging">
      <div class="flex items-center justify-between w-full px-2">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
            <i class="fas fa-shield-alt text-xs text-white"></i>
          </div>
          <div v-if="!isMinimized">
            <h3 class="text-sm font-bold">Sec<span class="text-primary">Lab</span> AI</h3>
          </div>
        </div>
        <div class="flex gap-1">
          <button @click="toggleMinimize" class="btn btn-ghost btn-xs px-1">
            <i :class="isMinimized ? 'fas fa-expand-alt' : 'fas fa-minus'"></i>
          </button>
          <button @click="toggleMaximize" class="btn btn-ghost btn-xs px-1" v-if="!isMinimized">
            <i :class="isMaximized ? 'fas fa-compress-alt' : 'fas fa-expand'"></i>
          </button>
          <button @click="closeChat" class="btn btn-ghost btn-xs px-1 text-error" v-if="!isMinimized">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 聊天内容区域 -->
    <div v-if="!isMinimized" class="chat-container">
      <!-- 消息区域 -->
      <div ref="chatContainer" class="messages-container">
        <div v-if="messages.length === 0" class="empty-state">
          <div class="flex flex-col items-center justify-center h-full text-center text-base-content/50 py-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 
                      flex items-center justify-center mb-2 animate-pulse">
              <i class="fas fa-shield-alt text-xl text-primary"></i>
            </div>
            <h3 class="text-sm font-bold mb-1">
              SecLab AI 助手
            </h3>
            <div class="max-w-xs text-xs text-base-content/70 px-2">
              您的网络安全学习伙伴
            </div>
          </div>
        </div>
            
        <template v-else>
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="mb-2" 
          >
            <!-- 用户消息 -->
            <div 
              v-if="message.role === 'user'"
              class="chat chat-end"
            >
              <div class="chat-image avatar">
                <div class="w-6 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                    alt="用户"
                  />
                </div>
              </div>
              <div class="chat-bubble chat-bubble-primary text-xs">
                {{ message.content }}
              </div>
              <div class="chat-footer opacity-50 text-xs">
                <span>{{ formatTime(message.timestamp) }}</span>
              </div>
            </div>

            <!-- AI回复 -->
            <div 
              v-else
              class="chat chat-start"
            >
              <div class="chat-image avatar">
                <div class="w-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                  <i class="fas fa-shield-alt text-xs text-white"></i>
                </div>
              </div>
              <div class="chat-bubble chat-bubble-neutral p-0 text-xs">
                <!-- 思考过程部分 - 可折叠面板 -->
                <div v-if="message.thinking && message.showThinking" class="collapse collapse-arrow bg-base-200/30 mb-2 rounded-lg">
                  <input type="checkbox" class="min-h-0" checked /> 
                  <div class="collapse-title py-1 px-2 min-h-0 flex items-center gap-2 text-base-content/70 text-xs font-medium">
                    <i class="fas fa-brain text-secondary text-xs"></i>
                    <span class="text-xs">思考过程</span>
                  </div>
                  <div class="collapse-content px-2 pt-0">
                    <div class="text-xs text-base-content/70 thinking-content p-2">
                      <div v-if="message.isStreaming">
                        <MarkdownRenderer :content="message.thinking || ''" />
                        <span v-if="message.thinking" class="inline-block ml-1">
                          <span class="loading loading-dots loading-xs"></span>
                        </span>
                      </div>
                      <div v-else>
                        <MarkdownRenderer :content="message.thinking || ''" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 回复内容 -->
                <div class="p-2" v-if="message.content || message.streamContent">
                  <div v-if="message.isStreaming">
                    <MarkdownRenderer :content="message.streamContent || ''" />
                  </div>
                  <div v-else>
                    <MarkdownRenderer :content="message.content" />
                  </div>
                </div>
                <div v-else class="flex items-center gap-2 p-2">
                  <span class="loading loading-dots loading-xs"></span>
                  <span class="text-xs">思考中...</span>
                </div>
              </div>
              <div class="chat-footer opacity-50 flex gap-1 text-xs">
                <span>{{ formatTime(message.timestamp) }}</span>
                <button 
                  v-if="message.content" 
                  class="opacity-50 hover:opacity-100" 
                  @click="copyToClipboard(message.content)"
                  title="复制内容"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="h-6"></div>
        </template>
      </div>

      <!-- 输入区域 -->
      <div class="input-container">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-1 mb-1" v-if="!isCompact">
            <div class="flex items-center tooltip tooltip-top" data-tip="启用后，AI将展示推理思考过程">
              <button
                class="btn btn-xs btn-outline rounded-full gap-1 px-2 border-base-content/30"
                :class="{'btn-primary': enableThinking, 'border-primary': enableThinking}"
                @click="enableThinking = !enableThinking"
              >
                <i class="fas fa-brain text-xs"></i>
                <span class="text-xs">深度思考</span>
                <div class="badge badge-xs" :class="enableThinking ? 'badge-primary' : 'badge-ghost'"></div>
              </button>
            </div>
          </div>
          <div class="join w-full">
            <textarea
              class="textarea textarea-bordered join-item flex-1 min-h-[40px] max-h-[80px] resize-none focus:outline-primary text-xs"
              placeholder="输入您的问题..."
              v-model="inputMessage"
              @keydown.enter.ctrl="handleSendMessage"
              ref="inputField"
            ></textarea>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-xs text-base-content/60">
              Ctrl+Enter
            </div>
            <button
              class="btn btn-xs btn-primary"
              @click="handleSendMessage"
              :disabled="isLoading || !inputMessage.trim()"
            >
              <i class="fas fa-paper-plane mr-1"></i>
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, defineEmits, defineProps } from 'vue'
import OpenAI from 'openai'
import MarkdownRenderer from './MarkdownRenderer.vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  thinking?: string
  streamContent?: string
  isStreaming?: boolean
  showThinking?: boolean
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  compact: {
    type: Boolean,
    default: false
  },
  initialPosition: {
    type: Object,
    default: () => ({ x: 20, y: 20 })
  }
})

const emit = defineEmits(['close', 'toggle-visibility'])

// 悬浮窗状态
const isMinimized = ref(false)
const isMaximized = ref(false)
const isCompact = ref(props.compact)
const position = ref(props.initialPosition)
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// 聊天状态
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)
const inputField = ref<HTMLTextAreaElement | null>(null)
const enableThinking = ref(false)

// OpenAI客户端实例
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true,
  baseURL: import.meta.env.VITE_BASE_URL || ''
})

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 复制到剪贴板
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('复制成功')
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatContainer.value) {
    setTimeout(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight + 100
      }
    }, 100)
  }
}

// 调用OpenAI API
const callOpenAI = async (userQuestion: string, messageIndex: number) => {
  if (!openai.apiKey) {
    messages.value[messageIndex].content = '错误：未配置API密钥，请联系管理员设置VITE_OPENAI_API_KEY环境变量。'
    return
  }

  messages.value[messageIndex].isStreaming = true
  messages.value[messageIndex].streamContent = ''
  
  // 初始化思考过程流内容并记录消息的思考显示状态
  messages.value[messageIndex].showThinking = enableThinking.value
  if (enableThinking.value) {
    messages.value[messageIndex].thinking = ''
  }
  
  try {
    // 构建消息历史
    const messageHistory = messages.value
      .slice(0, messageIndex)
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    
    // 添加系统消息
    messageHistory.unshift({
      role: 'system',
      content: '你是SecLab安全实验平台的AI助手，专注于网络安全领域知识。你擅长解答安全相关问题，提供安全学习指导，并协助用户理解安全概念和实验。回答要专业、准确，如不确定，请诚实地说不知道。请尽量简短回答，适合在小窗口中显示。'
    } as any)

    // 构建请求参数
    const requestParams: any = {
      model: enableThinking.value ? 'deepseek-reasoner' : 'deepseek-chat',
      messages: messageHistory,
      temperature: 0.7,
      stream: true,
    }
    
    // 使用OpenAI SDK的流式API
    const stream = await openai.chat.completions.create(requestParams) as unknown as AsyncIterable<any>

    let completeResponse = ''
    let completeThinking = ''
    
    // 处理流式响应
    for await (const chunk of stream) {
      // 处理普通内容
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        completeResponse += content
        messages.value[messageIndex].streamContent = completeResponse
        // 在每次更新内容后都滚动到底部
        nextTick(() => {
          scrollToBottom()
        })
      }
      
      // 处理思考过程
      if (enableThinking.value) {
        const reasoningContent = chunk.choices[0]?.delta?.reasoning_content || ''
        if (reasoningContent) {
          completeThinking += reasoningContent
          messages.value[messageIndex].thinking = completeThinking
        }
      }
    }
    
    // 更新最终完整回答
    messages.value[messageIndex].content = completeResponse
    messages.value[messageIndex].isStreaming = false
    
  } catch (error: any) {
    messages.value[messageIndex].streamContent = ''
    messages.value[messageIndex].content = `调用API时出错: ${error.message || '未知错误'}`
    messages.value[messageIndex].isStreaming = false
  }
}

// 发送消息
const handleSendMessage = () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  // 如果窗口最小化，先还原
  if (isMinimized.value) {
    isMinimized.value = false
  }

  const newMessage: Message = {
    role: 'user',
    content: inputMessage.value,
    timestamp: new Date()
  }

  messages.value.push(newMessage)
  const userQuestion = inputMessage.value
  inputMessage.value = ''
  
  // 自动滚动到底部
  scrollToBottom()
  
  // 添加加载状态的消息
  isLoading.value = true
  const responseIndex = messages.value.length
  messages.value.push({
    role: 'assistant',
    content: '',
    timestamp: new Date()
  })
  
  // 确保滚动到底部
  scrollToBottom()
  
  // 调用OpenAI API
  callOpenAI(userQuestion, responseIndex)
    .finally(() => {
      isLoading.value = false
      // 回答完成后再次滚动到底部
      scrollToBottom()
    })
}

// 悬浮窗控制函数
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
  if (isMinimized.value) {
    isMaximized.value = false
  }
}

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value
}

const closeChat = () => {
  emit('close')
}

// 拖动功能
const startDragging = (event: MouseEvent) => {
  // 如果点击的是控制按钮，不启动拖动
  if ((event.target as HTMLElement).closest('button')) {
    return
  }
  
  isDragging.value = true
  const chatElement = (event.currentTarget as HTMLElement).parentElement as HTMLElement
  const rect = chatElement.getBoundingClientRect()
  
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDragging)
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const chatElement = document.querySelector('.floating-chat') as HTMLElement
  const width = chatElement.offsetWidth
  const height = chatElement.offsetHeight
  
  // 计算新位置，确保不超出视口
  const newX = Math.max(0, Math.min(viewportWidth - width, event.clientX - dragOffset.value.x))
  const newY = Math.max(0, Math.min(viewportHeight - height, event.clientY - dragOffset.value.y))
  
  // 转换为right和bottom定位
  position.value = {
    x: viewportWidth - newX - width,
    y: viewportHeight - newY - height
  }
}

const stopDragging = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDragging)
}

// 监听消息变化
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

// 从localStorage加载聊天记录
const loadMessagesFromStorage = () => {
  try {
    const savedMessages = localStorage.getItem('chatMessages')
    if (savedMessages) {
      // 需要将JSON字符串中的日期字符串转换回Date对象
      const parsedMessages = JSON.parse(savedMessages, (key, value) => {
        if (key === 'timestamp' && value) {
          return new Date(value)
        }
        return value
      })
      messages.value = parsedMessages
    }
  } catch (error) {
    console.error('加载聊天记录失败:', error)
  }
}

// 组件挂载
onMounted(() => {
  // 加载聊天记录
  loadMessagesFromStorage()
  
  // 聚焦输入框
  if (!isMinimized.value) {
    inputField.value?.focus()
  }
  
  // 监听窗口大小变化，确保悬浮窗不超出视口
  window.addEventListener('resize', () => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const chatElement = document.querySelector('.floating-chat') as HTMLElement
    
    if (chatElement) {
      const width = chatElement.offsetWidth
      const height = chatElement.offsetHeight
      
      position.value = {
        x: Math.min(position.value.x, viewportWidth - width),
        y: Math.min(position.value.y, viewportHeight - height)
      }
    }
  })
})
</script>

<style scoped>
.floating-chat {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 450px;
  background-color: var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity, 1)));
  border-radius: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
  border: 1px solid var(--b3);
}

.floating-chat.minimized {
  width: 200px;
  height: 40px;
}

.floating-chat.maximized {
  width: 450px;
  height: 650px;
}

.drag-handle {
  height: 40px;
  width: 100%;
  cursor: move;
  display: flex;
  align-items: center;
  background-color: var(--b2);
  border-bottom: 1px solid var(--b3);
  user-select: none;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0.5rem;
  background-color: var(--b1, #131414);
}

.input-container {
  padding: 0.5rem;
  border-top: 1px solid var(--b3);
  background-color: var(--b2);
}

:deep(.chat-bubble) {
  max-width: 85%;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

:deep(.chat-bubble a) {
  color: var(--p);
  text-decoration: underline;
}

:deep(.chat-bubble pre) {
  background-color: hsl(var(--n) / 0.1);
  padding: 0.5rem;
  border-radius: 0.3rem;
  overflow-x: auto;
  margin: 0.5rem 0;
  font-size: 0.7rem;
}

:deep(.chat-bubble code) {
  background-color: hsl(var(--n) / 0.1);
  padding: 0.1rem 0.2rem;
  border-radius: 0.2rem;
  font-size: 0.7rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style> 