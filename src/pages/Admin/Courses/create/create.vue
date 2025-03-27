<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Course } from '../../../../types/course'

const router = useRouter()
const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

// 表单数据
const formData = ref({
  name: '',
  description: '',
  cover: '',
  difficulty: 3,
  category: '',
  status: 'draft',
  tags: [] as string[],
  prerequisites: [] as string[],
  objectives: [] as string[],
  targetAudience: '',
  duration: '',
  maxStudents: 100
})

// 课程分类选项
const categories = ['Web安全', '系统安全', '密码学', '网络攻防', '移动安全']

// 标签选项
const tagOptions = ['实战', '入门', '进阶', '认证', '竞赛', '工具使用', '漏洞分析', '渗透测试']

// 表单验证
const errors = ref({
  name: '',
  description: '',
  category: '',
  targetAudience: '',
  duration: '',
  maxStudents: ''
})

// 添加标签
const addTag = (tag: string) => {
  if (!formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
  }
}

// 移除标签
const removeTag = (tag: string) => {
  formData.value.tags = formData.value.tags.filter((t) => t !== tag)
}

// 添加学习目标
const addObjective = () => {
  formData.value.objectives.push('')
}

// 移除学习目标
const removeObjective = (index: number) => {
  formData.value.objectives.splice(index, 1)
}

// 添加前置要求
const addPrerequisite = () => {
  formData.value.prerequisites.push('')
}

// 移除前置要求
const removePrerequisite = (index: number) => {
  formData.value.prerequisites.splice(index, 1)
}

// 验证表单
const validateForm = () => {
  errors.value = {
    name: '',
    description: '',
    category: '',
    targetAudience: '',
    duration: '',
    maxStudents: ''
  }

  let isValid = true

  if (!formData.value.name.trim()) {
    errors.value.name = '课程名称不能为空'
    isValid = false
  }

  if (!formData.value.description.trim()) {
    errors.value.description = '课程描述不能为空'
    isValid = false
  }

  if (!formData.value.category) {
    errors.value.category = '请选择课程分类'
    isValid = false
  }

  if (!formData.value.targetAudience.trim()) {
    errors.value.targetAudience = '请填写目标受众'
    isValid = false
  }

  if (!formData.value.duration.trim()) {
    errors.value.duration = '请填写课程时长'
    isValid = false
  }

  if (!formData.value.maxStudents || formData.value.maxStudents < 1) {
    errors.value.maxStudents = '请填写有效的最大学生数'
    isValid = false
  }

  return isValid
}

// 处理表单提交
const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    // TODO: 调用API创建课程
    console.log('创建课程:', formData.value)
    // 创建成功后跳转回课程列表
    router.push('/admin/courses')
  } catch (error) {
    console.error('创建课程失败:', error)
  }
}

// 处理取消
const handleCancel = () => {
  const isConfirmed = window.confirm('你确定要取消吗？所有未保存的更改将会丢失。')
  if (isConfirmed) {
    router.back()
  }
}
</script>

<template>
  <div class="container mx-auto p-4 min-h-screen">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center mb-6" :class="{ 'animate-fade-in': isLoaded }">
      <h1 class="text-2xl font-bold flex items-center gap-2">
        <i class="fas fa-book text-primary"></i>
        创建课程
      </h1>
      <button class="btn btn-ghost" @click="handleCancel">
        <i class="fas fa-arrow-left mr-2"></i>
        返回
      </button>
    </div>

    <!-- 创建课程表单 -->
    <div class="card bg-base-100 shadow-xl" :class="{ 'animate-slide-up': isLoaded }">
      <div class="card-body">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 基本信息部分 -->
          <div class="divider text-lg font-semibold">基本信息</div>

          <!-- 课程名称 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">课程名称</span>
            </label>
            <input type="text" class="input input-bordered" v-model="formData.name" :class="{ 'input-error': errors.name }" placeholder="请输入课程名称" />
            <label class="label" v-if="errors.name">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>

          <!-- 课程描述 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">课程描述</span>
            </label>
            <textarea class="textarea textarea-bordered h-32" v-model="formData.description" :class="{ 'textarea-error': errors.description }" placeholder="请输入课程描述"></textarea>
            <label class="label" v-if="errors.description">
              <span class="label-text-alt text-error">{{ errors.description }}</span>
            </label>
          </div>

          <!-- 课程封面 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">课程封面</span>
            </label>
            <div class="flex items-center gap-4">
              <div class="w-48 h-32 border-2 border-dashed rounded-lg flex items-center justify-center hover:border-primary transition-colors cursor-pointer">
                <i class="fas fa-image text-4xl text-base-content/30"></i>
              </div>
              <button class="btn btn-outline">
                <i class="fas fa-upload mr-2"></i>
                上传封面
              </button>
            </div>
          </div>

          <!-- 课程分类 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">课程分类</span>
            </label>
            <select class="select select-bordered" v-model="formData.category" :class="{ 'select-error': errors.category }">
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <label class="label" v-if="errors.category">
              <span class="label-text-alt text-error">{{ errors.category }}</span>
            </label>
          </div>

          <!-- 课程难度 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">课程难度</span>
            </label>
            <div class="flex items-center gap-2">
              <div class="rating rating-md">
                <input v-for="n in 5" :key="n" type="radio" name="rating-8" class="mask mask-star-2 bg-yellow-400" :checked="formData.difficulty === n" @change="formData.difficulty = n" />
              </div>
              <span class="text-sm text-base-content/70">{{ formData.difficulty }} 星</span>
            </div>
          </div>

          <!-- 课程标签 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">课程标签</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <button v-for="tag in tagOptions" :key="tag" class="btn btn-sm" :class="formData.tags.includes(tag) ? 'btn-primary' : 'btn-ghost'" @click="formData.tags.includes(tag) ? removeTag(tag) : addTag(tag)">
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- 课程状态 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">课程状态</span>
            </label>
            <select class="select select-bordered" v-model="formData.status">
              <option value="draft">草稿</option>
              <option value="published">发布</option>
              <option value="archived">归档</option>
            </select>
          </div>

          <!-- 课程设置部分 -->
          <div class="divider text-lg font-semibold">课程设置</div>

          <!-- 目标受众 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">目标受众</span>
            </label>
            <input type="text" class="input input-bordered" v-model="formData.targetAudience" :class="{ 'input-error': errors.targetAudience }" placeholder="例如：安全工程师、在校学生等" />
            <label class="label" v-if="errors.targetAudience">
              <span class="label-text-alt text-error">{{ errors.targetAudience }}</span>
            </label>
          </div>

          <!-- 课程时长 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">课程时长</span>
            </label>
            <input type="text" class="input input-bordered" v-model="formData.duration" :class="{ 'input-error': errors.duration }" placeholder="例如：40课时" />
            <label class="label" v-if="errors.duration">
              <span class="label-text-alt text-error">{{ errors.duration }}</span>
            </label>
          </div>

          <!-- 最大学生数 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">最大学生数</span>
            </label>
            <input type="number" class="input input-bordered" v-model="formData.maxStudents" :class="{ 'input-error': errors.maxStudents }" min="1" />
            <label class="label" v-if="errors.maxStudents">
              <span class="label-text-alt text-error">{{ errors.maxStudents }}</span>
            </label>
          </div>

          <!-- 学习目标 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">学习目标</span>
            </label>
            <div class="space-y-2">
              <div v-for="(objective, index) in formData.objectives" :key="index" class="flex gap-2">
                <input type="text" class="input input-bordered flex-1" v-model="formData.objectives[index]" placeholder="请输入学习目标" />
                <button type="button" class="btn btn-square btn-ghost text-error" @click="removeObjective(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <button type="button" class="btn btn-ghost btn-sm gap-2" @click="addObjective">
                <i class="fas fa-plus"></i>
                添加学习目标
              </button>
            </div>
          </div>

          <!-- 前置要求 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">前置要求</span>
            </label>
            <div class="space-y-2">
              <div v-for="(prerequisite, index) in formData.prerequisites" :key="index" class="flex gap-2">
                <input type="text" class="input input-bordered flex-1" v-model="formData.prerequisites[index]" placeholder="请输入前置要求" />
                <button type="button" class="btn btn-square btn-ghost text-error" @click="removePrerequisite(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <button type="button" class="btn btn-ghost btn-sm gap-2" @click="addPrerequisite">
                <i class="fas fa-plus"></i>
                添加前置要求
              </button>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end gap-4 mt-8">
            <button type="button" class="btn btn-ghost" @click="handleCancel">取消</button>
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save mr-2"></i>
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  height: 100%;
  overflow-y: auto;
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-up {
  opacity: 0;
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表单样式优化 */
.form-control {
  transition: all 0.3s ease;
}

.form-control:hover {
  transform: translateX(4px);
}

/* 标签按钮样式 */
.btn-sm {
  transition: all 0.3s ease;
}

.btn-sm:hover {
  transform: translateY(-2px);
}

/* 输入框焦点效果 */
.input:focus,
.textarea:focus,
.select:focus {
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

/* 分割线样式 */
.divider {
  position: relative;
  margin: 2rem 0;
  padding: 0 1rem;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.2), transparent);
}

.divider::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 0 1rem;
  background: var(--color-base-100);
}
</style>
