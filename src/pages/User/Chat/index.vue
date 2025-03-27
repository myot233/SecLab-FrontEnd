<template>
  <div class="min-h-screen flex flex-col mt-16">
    <!-- 顶部装饰线 -->
    <div class="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    
    <div class="w-full mx-auto flex-grow flex flex-col px-0 py-0 sm:p-4">
      <div class="card bg-base-100 shadow-xl sm:border border-base-200 flex-grow flex flex-col h-[calc(100vh-2px)]">
        <div class="card-body p-0 flex flex-col flex-grow">
          <!-- 顶部栏 -->
          <div class="flex items-center justify-between p-4 border-b border-base-200 bg-base-100/90 backdrop-blur-sm sticky top-0 z-10">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <i class="fas fa-shield-alt text-xl text-white"></i>
              </div>
              <div>
                <div class="flex items-center gap-1">
                  <h2 class="text-xl font-bold">Sec<span class="text-primary">Lab</span> AI</h2>
                  <div class="badge badge-primary badge-sm">Beta</div>
                </div>
                <p class="text-xs text-base-content/60">安全知识智能助手</p>
              </div>
            </div>
            <div class="flex gap-2">
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-sm btn-ghost">
                  <i class="fas fa-cog"></i>
                </label>
                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <a @click="clearMessages">
                      <i class="fas fa-trash-alt mr-2"></i>清空对话
                    </a>
                  </li>
                  <li>
                    <a @click="toggleTheme">
                      <i class="fas fa-moon mr-2"></i>切换主题
                    </a>
                  </li>
                  <li>
                    <a @click="switchToFloatingMode">
                      <i class="fas fa-external-link-alt mr-2"></i>悬浮窗模式
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- 聊天消息区域 - 修复高度设置 -->
          <div ref="chatContainer" class="flex-grow overflow-y-auto p-2 sm:p-4 space-y-4 bg-base-200/30" style="height: calc(100vh - 13rem);">
            <div v-if="messages.length === 0" class="flex flex-col items-center justify-start h-full text-center text-base-content/50">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 
                          flex items-center justify-center mb-4 animate-pulse">
                <i class="fas fa-shield-alt text-3xl sm:text-4xl text-primary"></i>
              </div>
              <h3 class="text-xl sm:text-2xl font-bold mb-2 bg-clip-text text-transparent 
                         bg-gradient-to-r from-primary via-secondary to-accent">
                SecLab AI 智能助手
              </h3>
              <div class="max-w-sm mt-2 text-base-content/70 px-4 text-sm sm:text-base">
                您的网络安全学习伙伴，可以解答安全知识、辅助安全学习、提供实验指导
              </div>
              
              <!-- 快速问题建议 - 改进响应式布局 -->
              <div class="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-2xl px-4">
                <button 
                  v-for="(suggestion, index) in suggestions" 
                  :key="index"
                  class="btn btn-outline btn-sm border-base-content/20 justify-start normal-case font-normal
                         hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 text-xs sm:text-sm"
                  @click="askSuggestion(suggestion)"
                >
                  <i class="fas fa-question-circle text-primary/70 mr-2"></i>
                  {{ suggestion }}
                </button>
              </div>
            </div>
            
            <template v-else>
              <div
                v-for="(message, index) in messages"
                :key="index"
                class="mb-4 sm:mb-6" 
              >
                <!-- 用户消息 -->
                <div 
                  v-if="message.role === 'user'"
                  class="chat chat-end"
                >
                  <div class="chat-image avatar">
                    <div class="w-8 sm:w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                        alt="用户"
                      />
                    </div>
                  </div>
                  <div class="chat-bubble chat-bubble-primary">
                    {{ message.content }}
                  </div>
                  <div class="chat-footer opacity-50 flex gap-2 text-xs">
                    <span>{{ formatTime(message.timestamp) }}</span>
                  </div>
                </div>

                <!-- AI回复 -->
                <div 
                  v-else
                  class="chat chat-start"
                >
                  <div class="chat-image avatar">
                    <div class="w-8 sm:w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                      <i class="fas fa-shield-alt text-xs sm:text-sm text-white"></i>
                    </div>
                  </div>
                  <div class="chat-bubble chat-bubble-neutral p-0">
                    <!-- 思考过程部分 - 可折叠面板 -->
                    <div v-if="message.thinking && message.showThinking" class="collapse collapse-arrow bg-base-200/30 mb-3 rounded-lg">
                      <input type="checkbox" class="min-h-0" checked /> 
                      <div class="collapse-title py-2 px-3 min-h-0 flex items-center gap-2 text-base-content/70 text-xs font-medium">
                        <i class="fas fa-brain text-secondary"></i>
                        <span>思考过程</span>
                      </div>
                      <div class="collapse-content px-3 sm:px-4 pt-0">
                        <div class="text-xs sm:text-sm text-base-content/70 thinking-content p-3 sm:p-4">
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
                    <div class="p-3 sm:p-4" v-if="message.content || message.streamContent">
                      <div v-if="message.isStreaming">
                        <MarkdownRenderer :content="message.streamContent || ''" />
                      </div>
                      <div v-else>
                        <MarkdownRenderer :content="message.content" />
                      </div>
                    </div>
                    <div v-else class="flex items-center gap-2 p-3 sm:p-4">
                      <span class="loading loading-dots loading-sm"></span>
                      <span>思考中...</span>
                    </div>
                  </div>
                  <div class="chat-footer opacity-50 flex gap-2 text-xs">
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
              <!-- 添加底部额外空间确保最后的消息可见 -->
              <div class="h-24 sm:h-32 md:h-40"></div>
            </template>
          </div>

          <!-- 输入区域 - 改进响应式设计 -->
          <div class="border-t border-base-200 p-3 pt-4 sm:p-4 bg-base-100 sticky bottom-0">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 mb-2">
                <div class="flex items-center tooltip tooltip-right" data-tip="启用后，AI将展示推理思考过程">
                  <button
                    class="btn btn-sm btn-outline rounded-full gap-1 px-3 border-base-content/30"
                    :class="{'btn-primary': enableThinking, 'border-primary': enableThinking}"
                    @click="enableThinking = !enableThinking"
                  >
                    <i class="fas fa-brain text-xs"></i>
                    <span class="text-xs">深度思考</span>
                    <div class="badge badge-xs" :class="enableThinking ? 'badge-primary' : 'badge-ghost'"></div>
                  </button>
                </div>
                <div v-if="enableThinking" class="text-xs text-base-content/60">
                  已开启深度思考模式，AI将展示分析过程
                </div>
              </div>
              <div class="join w-full">
                <textarea
                  class="textarea textarea-bordered join-item flex-1 min-h-[60px] max-h-[120px] resize-none focus:outline-primary text-sm sm:text-base"
                  placeholder="输入您的问题，例如：什么是XSS攻击？如何防范SQL注入？..."
                  v-model="inputMessage"
                  @keydown.enter.ctrl="handleSendMessage"
                  ref="inputField"
                ></textarea>
              </div>
              <div class="flex justify-between items-center">
                <div class="text-xs text-base-content/60">
                  按Ctrl+Enter发送
                </div>
                <div class="flex items-center gap-2">
                  <button
                    class="btn btn-sm btn-ghost" 
                    @click="clearInput"
                    title="清空输入"
                  >
                    <i class="fas fa-eraser"></i>
                  </button>
                  <button
                    class="btn btn-sm sm:btn-md btn-primary"
                    @click="handleSendMessage"
                    :disabled="isLoading || !inputMessage.trim()"
                  >
                    <i class="fas fa-paper-plane mr-2"></i>
                    发送
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部装饰线 -->
    <div class="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import DOMPurify from 'dompurify'
import OpenAI from 'openai'
import MarkdownRenderer from '../../../components/MarkdownRenderer.vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  thinking?: string
  streamContent?: string
  isStreaming?: boolean
  showThinking?: boolean  // 添加标记，指示这条消息是否要显示思考过程
}

// OpenAI客户端实例
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '', // 从环境变量获取API密钥
  dangerouslyAllowBrowser: true, // 允许在浏览器中使用（仅开发环境）
  baseURL:import.meta.env.VITE_BASE_URL || ''
})

const messages = ref<Message[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)
const inputField = ref<HTMLTextAreaElement | null>(null)
const enableThinking = ref(false)
const showThinking = ref(false)

// 监听enableThinking变化，同步更新showThinking
watch(enableThinking, (newValue) => {
  showThinking.value = newValue
})

// 快速问题建议
const suggestions = [
  "什么是XSS攻击？",
  "如何防范SQL注入？",
  "请介绍常见的网络安全威胁",
  "什么是CSRF攻击？",
  "密码学基础知识有哪些？",
  "如何进行安全的代码审计？"
]

// 使用建议问题
const askSuggestion = (question: string) => {
  inputMessage.value = question
  handleSendMessage()
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 格式化消息内容，支持markdown - 这个方法可以保留但不再使用
const formatMessageContent = (content: string) => {
  return content
}

// 复制到剪贴板
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      // 可以添加toast通知用户复制成功
      console.log('复制成功')
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}

// 清空消息
const clearMessages = () => {
  if (messages.value.length > 0 && confirm('确定要清空所有对话记录吗？')) {
    messages.value = []
  }
}

// 清空输入
const clearInput = () => {
  inputMessage.value = ''
  inputField.value?.focus()
}

// 切换主题
const toggleTheme = () => {
  const html = document.querySelector('html')
  if (html) {
    const currentTheme = html.getAttribute('data-theme')
    html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark')
  }
}

// 切换到悬浮窗模式
const switchToFloatingMode = () => {
  // 将当前消息存储到本地存储，以便悬浮窗可以加载
  localStorage.setItem('chatMessages', JSON.stringify(messages.value))
  // 导航到悬浮窗演示页面
  window.location.href = '#/user/floating-chat-demo'
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatContainer.value) {
    // 使用更长的延时确保DOM完全更新
    setTimeout(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight + 200
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
      content: '你是SecLab安全实验平台的AI助手，专注于网络安全领域知识。你擅长解答安全相关问题，提供安全学习指导，并协助用户理解安全概念和实验。回答要专业、准确，如不确定，请诚实地说不知道。'
    } as any)

    // 构建请求参数
    const requestParams: any = {
      model: enableThinking.value ? 'deepseek-reasoner' : 'deepseek-chat',
      messages: messageHistory,
      temperature: 0.7,
      stream: true,
    }
    
    // 使用OpenAI SDK的流式API
    const stream = await openai.chat.completions.create(requestParams)

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
  // 再次确保滚动到底部（解决某些浏览器渲染延迟问题）
  setTimeout(scrollToBottom, 100)
  setTimeout(scrollToBottom, 300)
  
  // 调用OpenAI API
  callOpenAI(userQuestion, responseIndex)
    .finally(() => {
      isLoading.value = false
      // 回答完成后再次滚动到底部
      scrollToBottom()
      setTimeout(scrollToBottom, 100)
    })
}

// 优化监听消息变化的滚动处理
watch(messages, () => {
  // 使用nextTick确保DOM更新后再滚动
  nextTick(() => {
    scrollToBottom()
    // 再次滚动，确保内容完全可见
    setTimeout(() => {
      scrollToBottom()
    }, 200)
  })
}, { deep: true })

// 组件挂载后，聚焦输入框
onMounted(() => {
  inputField.value?.focus()
  // 确保聊天记录显示在底部
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
:deep(.chat-bubble) {
  max-width: 80%; /* 修改气泡最大宽度 */
  word-break: break-word;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); /* 添加轻微阴影 */
}

:deep(.chat-bubble a) {
  color: var(--p);
  text-decoration: underline;
}

:deep(.chat-bubble pre) {
  background-color: hsl(var(--n) / 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

:deep(.chat-bubble code) {
  background-color: hsl(var(--n) / 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.9em;

}


:deep(.chat-bubble ul, .chat-bubble ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(.chat-bubble ul) {
  list-style-type: disc;
}

:deep(.chat-bubble ol) {
  list-style-type: decimal;
}

/* 机器人图标居中样式 */
.avatar .rounded-full {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.avatar .fas.fa-shield-alt, .avatar .fas.fa-brain {
  display: block;
  line-height: 1;
  margin: 0;
  padding: 0;
}

/* 思考过程样式 */
.collapse-arrow .collapse-title:after {
  top: 1.2rem;
  right: 1rem;
}

.thinking-content :deep(p) {
  margin-bottom: 0.5rem;
}

.thinking-content :deep(ol), .thinking-content :deep(ul) {
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
}

/* 确保折叠面板内部内容缩进和样式正确 */
.collapse-content {
  padding-bottom: 0.5rem;
}

.collapse .collapse-title {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

/* 确保聊天区域和输入区域没有重叠 */
.chat-start:last-child,
.chat-end:last-child {
  margin-bottom: 1rem;
}

/* 确保气泡底部内容可见 */
.chat-bubble {
  margin-bottom: 0.25rem;
}

/* 添加响应式布局样式 */
@media (max-width: 640px) {
  :deep(.chat-bubble) {
    max-width: 88%;
  }
  
  .card {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
  }
  
  :deep(.markdown-body) {
    font-size: 0.9rem;
  }
  
  /* 修复移动端底部内边距 */
  .chat-start:last-child,
  .chat-end:last-child {
    margin-bottom: 0.75rem;
  }
}
</style> 