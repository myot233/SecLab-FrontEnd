<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ModuleOverViewType } from './components/ModuleOverView.ts'
import ModuleOverView from './components/ModuleOverView.vue'

// 修改模块数据，添加分数计算
const calculateScore = (difficulty: number, time: string): number => {
  // 解析预计用时，提取小时数
  const hours = parseFloat(time.split('-')[1]?.split('小时')[0] || time.split('小时')[0])
  // 计算总分：难度基础分 + 时间加成，上限100分
  const score = Math.min(difficulty * 15 + hours * 5, 100)
  return Math.round(score)
}

// 模拟模块数据
const modules = ref<ModuleOverViewType[]>([
  {
    id: 1,
    name: 'SQL注入进阶',
    description: '深入学习SQL注入的各种技术和防御方法，包括盲注、时间注入等高级技巧。',
    difficulty: 4,
    type: 'Web安全',
    status: 'locked',
    prerequisites: [2],
    estimatedTime: '4-5小时',
    score: calculateScore(4, '4-5小时') // 85分：难度4×15 + 5小时×5
  },
  {
    id: 2,
    name: 'SQL注入基础实验',
    description: '学习Web安全的基本概念和常见漏洞类型，包括SQL注入、XSS等。适合安全学习的入门者。',
    difficulty: 3,
    type: 'Web安全',
    status: 'available',
    estimatedTime: '2-3小时',
    score: calculateScore(2, '2-3小时') // 45分：难度2×15 + 3小时×5
  },
  {
    id: 3,
    name: '密码学基础',
    description: '学习基本的密码学概念和常用加密算法，包括对称加密、非对称加密等。',
    difficulty: 3,
    type: '密码学',
    status: 'completed',
    estimatedTime: '3-4小时',
    score: calculateScore(3, '3-4小时') // 65分：难度3×15 + 4小时×5
  },  {
    id: 101,
    name: '字符型注入突破',
    description: '通过DVWA环境实践单引号闭合技巧，掌握order by判断字段数、union select数据回显等基础注入方法',
    difficulty: 2,
    type: 'sql-injection',
    status: 'available',
    estimatedTime: '2小时',
    score: calculateScore(2, '2小时') // 40分：难度2×15 + 2小时×5
  },
  {
    id: 102,
    name: '布尔盲注实战',
    description: '使用二分法逐字符爆破数据库信息，编写Python脚本实现自动化盲注攻击',
    difficulty: 3,
    type: 'sql-injection',
    status: 'available',
    prerequisites: [101],
    estimatedTime: '2小时',
    score: calculateScore(3, '2小时') // 55分：难度3×15 + 2小时×5
  },
  {
    id: 103,
    name: 'WAF绕过挑战',
    description: '利用特殊字符（/*!*/）、HEX编码、参数污染等技术突破安全狗/WAF防护规则',
    difficulty: 4,
    type: 'sql-injection',
    status: 'available',
    prerequisites: [102],
    estimatedTime: '2小时',
    score: calculateScore(4, '2小时') // 70分：难度4×15 + 2小时×5
  },
  {
    id: 104,
    name: '二阶注入攻击',
    description: '分析用户注册场景下的存储型注入漏洞，通过恶意数据存储触发二次查询攻击',
    difficulty: 4,
    type: 'sql-injection',
    status: 'available',
    prerequisites: [103],
    estimatedTime: '2小时',
    score: calculateScore(4, '2小时') // 70分：难度4×15 + 2小时×5
  }
])



onMounted(()=>{
  // getModuleList().then((res)=>{
  //   modules.value = res.data;
  // })
})

// 筛选条件
const filters = ref({
  type: '',
  difficulty: '',
  status: ''
})

// 类型列表 
const types = ['Web安全', '系统安全', '密码学', '网络攻防']

// 添加搜索关键词
const searchQuery = ref('')

// 更新筛选逻辑
// 更新筛选逻辑
const filteredModules = computed(() => {
  // 首先进行筛选
  const filtered = modules.value.filter(module => {
    // 搜索过滤
    if (searchQuery.value && !module.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        !module.description.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    // 现有的筛选条件
    if (filters.value.type && module.type !== filters.value.type) return false
    if (filters.value.status && module.status !== filters.value.status) return false
    if (filters.value.difficulty && module.difficulty !== parseInt(filters.value.difficulty)) return false
    return true
  })

  // 然后按照状态排序
  return filtered.sort((a, b) => {
    const statusOrder = {
      'available': 0,  // 可开始 排第一
      'locked': 1,     // 未解锁 排第二
      'completed': 2   // 可进行 排第三
    }
    return statusOrder[a.status] - statusOrder[b.status]
  })
})

// 重置筛选器
const resetFilters = () => {
  filters.value = {
    type: '',
    difficulty: '',
    status: ''
  }
  searchQuery.value = ''
}

// 获取统计信息
const stats = computed(() => ({
  total: modules.value.length,
  completed: modules.value.filter(m => m.status === 'completed').length,
  available: modules.value.filter(m => m.status === 'available').length,
  locked: modules.value.filter(m => m.status === 'locked').length
}))
</script>

<template>
  <div class="container-fluid px-4 py-6 overflow-x-hidden">
    <!-- 统计信息 -->
    <div class="stats shadow w-full mb-6">
      <div class="stat">
        <div class="stat-figure text-primary">
          <i class="fas fa-cube text-3xl"></i>
        </div>
        <div class="stat-title">总模块数</div>
        <div class="stat-value text-primary">{{ stats.total }}</div>
      </div>
      
      <div class="stat">
        <div class="stat-figure text-success">
          <i class="fas fa-check-circle text-3xl"></i>
        </div>
        <div class="stat-title">已完成</div>
        <div class="stat-value text-success">{{ stats.completed }}</div>
      </div>
      
      <div class="stat">
        <div class="stat-figure text-warning">
          <i class="fas fa-unlock text-3xl"></i>
        </div>
        <div class="stat-title">可开始</div>
        <div class="stat-value text-warning">{{ stats.available }}</div>
      </div>
      
      <div class="stat">
        <div class="stat-figure text-error">
          <i class="fas fa-lock text-3xl"></i>
        </div>
        <div class="stat-title">未解锁</div>
        <div class="stat-value text-error">{{ stats.locked }}</div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="card bg-base-100 shadow-xl mb-6 overflow-hidden">
      <!-- 搜索区域 -->

      <div class="card-body pt-4">

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- 类型筛选 -->
          <div class="form-control">
            <label class="label cursor-pointer gap-2 pb-2">
              <i class="fas fa-tags text-primary"></i>
              <span class="label-text">类型</span>
            </label>
            <select 
              class="select select-bordered w-full bg-base-100/70 hover:bg-base-100 transition-colors"
              v-model="filters.type"
            >
              <option value="">全部类型</option>
              <option v-for="type in types" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- 难度筛选 -->
          <div class="form-control">
            <label class="label cursor-pointer gap-2 pb-2">
              <i class="fas fa-signal text-primary"></i>
              <span class="label-text">难度</span>
            </label>
            <select 
              class="select select-bordered w-full bg-base-100/70 hover:bg-base-100 transition-colors"
              v-model="filters.difficulty"
            >
              <option value="">全部难度</option>
              <option v-for="n in 5" :key="n" :value="n" class="py-1">
                <span class="text-yellow-500">{{ '★'.repeat(n) }}</span>
                <span class="text-base-content/30">{{ '★'.repeat(5-n) }}</span>
              </option>
            </select>
          </div>

          <!-- 状态筛选 -->
          <div class="form-control">
            <label class="label cursor-pointer gap-2 pb-2">
              <i class="fas fa-circle-check text-primary"></i>
              <span class="label-text">状态</span>
            </label>
            <select 
              class="select select-bordered w-full bg-base-100/70 hover:bg-base-100 transition-colors"
              v-model="filters.status"
            >
              <option value="">全部状态</option>
              <option value="available" class="text-warning">可开始</option>
              <option value="locked" class="text-error">未解锁</option>
              <option value="completed" class="text-success">已完成</option>
            </select>
            
          </div>
          <div class="form-control">
            <label class="label cursor-pointer gap-2 pb-2">
              <i class="fas fa-circle-check text-primary"></i>
              <span class="label-text">搜索</span>
            </label>
            <input
              type="text" 
              placeholder="搜索模块名称或描述..." 
              class="input input-bordered w-full pl-11 pr-4 bg-base-100/70 focus:bg-base-100
                     transition-all duration-300 shadow-sm hover:shadow focus:shadow-md"
              v-model="searchQuery"
            > 
          </div>
        </div>
      </div>
    </div>

    <!-- 模块列表 -->
    <div v-if="filteredModules.length" 
         class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      <ModuleOverView 
        v-for="module in filteredModules" 
        :key="module.id"
        :module="module"
      />
    </div>
    
    <!-- 无结果提示 -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4 text-base-content/30">
        <i class="fas fa-search"></i>
      </div>
      <h3 class="text-xl font-semibold mb-2">未找到匹配的模块</h3>
      <p class="text-base-content/70">
        试试调整筛选条件或重置筛选器
      </p>
      <button 
        class="btn btn-primary btn-sm mt-4"
        @click="resetFilters"
      >
        重置筛选器
      </button>
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

.input-group > span {
  padding: 0 1rem;
  display: flex;
  align-items: center;
  color: var(--color-base-content/50);
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 统计卡片动画 */
.stat {
  transition: all 0.3s ease;
}

.stat:hover {
  transform: translateY(-2px);
}

.stat-figure {
  transition: transform 0.3s ease;
}

.stat:hover .stat-figure {
  transform: scale(1.1);
}

/* 搜索框样式 */
.input {
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* 下拉框样式 */
.select {
  transition: all 0.3s ease;
}

.select:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* 选项悬停效果 */
.select option {
  padding: 0.5rem;
}

.select option:hover {
  background-color: var(--color-primary);
  color: white;
}

/* 卡片内部边框 */
.border-b {
  border-bottom-width: 1px;
  border-color: rgba(var(--color-base-content), 0.1);
}

/* 磨砂玻璃效果 */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style> 