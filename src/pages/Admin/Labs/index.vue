<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Experiment } from '../../../types/experiment'

// 实验列表数据
const experiments = ref<Experiment[]>([
  {
    id: 1,
    name: "SQL注入基础实验",
    description: "通过实践了解SQL注入的原理和基本利用方法",
    difficulty: 3,
    courseId: 1,
    courseName: "Web安全基础",
    status: 'published',
    taskPoints: [
      {
        id: 1,
        name: "SQL注入原理",
        score: 30,
        description: "理解SQL注入的基本概念"
      },
      {
        id: 2,
        name: "SQL注入实战",
        score: 70,
        description: "在靶机环境中实践SQL注入"
      }
    ],
    environment: {
      targetMachine: {
        image: "sqli-labs:latest",
        port: 80,
        memory: "512MB"
      },
      operationMachine: {
        image: "kali-tools:latest",
        port: 6080,
        memory: "1GB"
      }
    },
    studentCount: 120,
    completionRate: 75,
    averageScore: 85,
    createTime: "2024-03-15 10:00:00"
  },
  {
    id: 101,
    name: "字符型注入突破",
    description: "通过DVWA环境实践单引号闭合技巧，掌握order by判断字段数、union select数据回显等基础注入方法",
    difficulty: 2,
    courseId: 1,
    courseName: "Web安全基础",
    status: 'published',
    taskPoints: [
      {
        id: 201,
        name: "字符型注入原理",
        score: 20,
        description: "理解字符型SQL注入的原理与特点"
      },
      {
        id: 202,
        name: "单引号闭合实战",
        score: 20,
        description: "在DVWA环境中实践单引号闭合注入"
      }
    ],
    environment: {
      targetMachine: {
        image: "dvwa:latest",
        port: 80,
        memory: "512MB"
      },
      operationMachine: {
        image: "kali-tools:latest",
        port: 6080,
        memory: "1GB"
      }
    },
    studentCount: 98,
    completionRate: 82,
    averageScore: 78,
    createTime: "2024-03-18 09:30:00"
  },
  {
    id: 102,
    name: "布尔盲注实战",
    description: "使用二分法逐字符爆破数据库信息，编写Python脚本实现自动化盲注攻击",
    difficulty: 3,
    courseId: 1,
    courseName: "Web安全基础",
    status: 'published',
    taskPoints: [
      {
        id: 203,
        name: "布尔盲注原理",
        score: 25,
        description: "理解布尔盲注的原理与实现方式"
      },
      {
        id: 204,
        name: "Python自动化脚本",
        score: 30,
        description: "编写Python脚本实现自动化布尔盲注"
      }
    ],
    environment: {
      targetMachine: {
        image: "sqli-labs:latest",
        port: 80,
        memory: "512MB"
      },
      operationMachine: {
        image: "kali-python:latest",
        port: 6080,
        memory: "1GB"
      }
    },
    studentCount: 85,
    completionRate: 68,
    averageScore: 72,
    createTime: "2024-03-20 14:15:00"
  },
  {
    id: 103,
    name: "WAF绕过挑战",
    description: "利用特殊字符（/*!*/）、HEX编码、参数污染等技术突破安全狗/WAF防护规则",
    difficulty: 4,
    courseId: 1,
    courseName: "Web安全基础",
    status: 'published',
    taskPoints: [
      {
        id: 205,
        name: "WAF防护机制分析",
        score: 30,
        description: "分析常见WAF的防护规则与机制"
      },
      {
        id: 206,
        name: "绕过技术实战",
        score: 40,
        description: "实践HEX编码、参数污染等绕过技术"
      }
    ],
    environment: {
      targetMachine: {
        image: "waf-lab:latest",
        port: 80,
        memory: "768MB"
      },
      operationMachine: {
        image: "kali-advanced:latest",
        port: 6080,
        memory: "1.5GB"
      }
    },
    studentCount: 62,
    completionRate: 55,
    averageScore: 68,
    createTime: "2024-03-25 11:40:00"
  },
  {
    id: 104,
    name: "二阶注入攻击",
    description: "分析用户注册场景下的存储型注入漏洞，通过恶意数据存储触发二次查询攻击",
    difficulty: 4,
    courseId: 1,
    courseName: "Web安全基础",
    status: 'published',
    taskPoints: [
      {
        id: 207,
        name: "二阶注入原理",
        score: 35,
        description: "理解存储型SQL注入与二阶注入的区别"
      },
      {
        id: 208,
        name: "注册场景实战",
        score: 35,
        description: "在注册场景中实践二阶注入攻击"
      }
    ],
    environment: {
      targetMachine: {
        image: "user-register-vuln:latest",
        port: 80,
        memory: "768MB"
      },
      operationMachine: {
        image: "kali-tools:latest",
        port: 6080,
        memory: "1GB"
      }
    },
    studentCount: 55,
    completionRate: 48,
    averageScore: 65,
    createTime: "2024-04-01 15:20:00"
  },
  {
    id: 105,
    name: "XSS攻击实战",
    description: "学习跨站脚本攻击的各种类型（存储型、反射型、DOM型）及其防御方法",
    difficulty: 3,
    courseId: 1,
    courseName: "Web安全基础",
    status: 'published',
    taskPoints: [
      {
        id: 209,
        name: "XSS类型与原理",
        score: 30,
        description: "理解不同类型XSS攻击的原理与特点"
      },
      {
        id: 210,
        name: "XSS实战与防御",
        score: 30,
        description: "实践XSS payload构造与防御措施"
      }
    ],
    environment: {
      targetMachine: {
        image: "xss-labs:latest",
        port: 80,
        memory: "512MB"
      },
      operationMachine: {
        image: "kali-web:latest",
        port: 6080,
        memory: "1GB"
      }
    },
    studentCount: 110,
    completionRate: 80,
    averageScore: 82,
    createTime: "2024-03-28 13:00:00"
  },
  {
    id: 201,
    name: "网络嗅探技术",
    description: "使用Wireshark分析网络流量，捕获和解析各种协议的数据包，提取有价值的信息",
    difficulty: 2,
    courseId: 2,
    courseName: "网络攻防基础",
    status: 'published',
    taskPoints: [
      {
        id: 301,
        name: "Wireshark基础",
        score: 20,
        description: "掌握Wireshark的基本使用方法"
      },
      {
        id: 302,
        name: "协议分析实战",
        score: 20,
        description: "分析HTTP、TCP等协议的数据包"
      }
    ],
    environment: {
      targetMachine: {
        image: "network-traffic:latest",
        port: 80,
        memory: "512MB"
      },
      operationMachine: {
        image: "wireshark-kali:latest",
        port: 6080,
        memory: "1GB"
      }
    },
    studentCount: 135,
    completionRate: 90,
    averageScore: 88,
    createTime: "2024-03-10 09:00:00"
  },
  {
    id: 301,
    name: "Linux权限提升",
    description: "学习Linux系统中常见的权限提升技术，包括配置错误利用、内核漏洞利用等",
    difficulty: 3,
    courseId: 3,
    courseName: "系统安全",
    status: 'published',
    taskPoints: [
      {
        id: 401,
        name: "Linux权限机制",
        score: 30,
        description: "理解Linux系统权限模型与机制"
      },
      {
        id: 402,
        name: "提权漏洞利用",
        score: 30,
        description: "实践SUID、内核漏洞等提权技术"
      }
    ],
    environment: {
      targetMachine: {
        image: "linux-privesc:latest",
        port: 22,
        memory: "768MB"
      },
      operationMachine: {
        image: "kali-tools:latest",
        port: 6080,
        memory: "1GB"
      }
    },
    studentCount: 92,
    completionRate: 65,
    averageScore: 75,
    createTime: "2024-03-22 10:30:00"
  },
  {
    id: 401,
    name: "古典密码破解",
    description: "学习凯撒密码、维吉尼亚密码等古典密码算法的加解密和破解技术",
    difficulty: 1,
    courseId: 4,
    courseName: "密码学",
    status: 'published',
    taskPoints: [
      {
        id: 501,
        name: "古典密码原理",
        score: 10,
        description: "理解凯撒密码、维吉尼亚密码的原理"
      },
      {
        id: 502,
        name: "手动破解实战",
        score: 10,
        description: "手动破解给定的古典密码示例"
      }
    ],
    environment: {
      targetMachine: {
        image: "crypto-classic:latest",
        port: 80,
        memory: "256MB"
      },
      operationMachine: {
        image: "crypto-tools:latest",
        port: 6080,
        memory: "512MB"
      }
    },
    studentCount: 150,
    completionRate: 95,
    averageScore: 92,
    createTime: "2024-03-05 08:45:00"
  }
])

// 搜索和筛选条件
const filters = ref({
  search: '',
  difficulty: '',
  status: '',
  courseId: ''
})

// 获取难度星级显示
const getDifficultyStars = (difficulty: number) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)

// 获取状态标签样式
const getStatusBadgeClass = (status: Experiment['status']) => ({
  'badge-success': status === 'published',
  'badge-warning': status === 'draft',
  'badge-error': status === 'archived'
})

// 获取状态文本
const getStatusText = (status: Experiment['status']) => ({
  published: '已发布',
  draft: '草稿',
  archived: '已归档'
}[status])

// 过滤后的实验列表
const filteredExperiments = computed(() => {
  return experiments.value.filter(exp => {
    if (filters.value.search && 
        !exp.name.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false
    }
    if (filters.value.difficulty && exp.difficulty !== parseInt(filters.value.difficulty)) {
      return false
    }
    if (filters.value.status && exp.status !== filters.value.status) {
      return false
    }
    return true
  })
})

// 处理实验操作
const handleEdit = (experiment: Experiment) => {
  console.log('编辑实验:', experiment)
}

const handleDelete = (experiment: Experiment) => {
  console.log('删除实验:', experiment)
}

const handleTaskPoints = (experiment: Experiment) => {
  console.log('管理任务点:', experiment)
}

const handleEnvironment = (experiment: Experiment) => {
  console.log('管理环境:', experiment)
}
</script>

<template>
  <div class="container-fluid px-4 py-6 overflow-x-hidden">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">实验管理</h1>
      <button class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        创建实验
      </button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">搜索</span>
            </label>
            <input 
              type="text" 
              class="input input-bordered" 
              placeholder="搜索实验名称"
              v-model="filters.search"
            >
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">难度</span>
            </label>
            <select class="select select-bordered" v-model="filters.difficulty">
              <option value="">全部</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} 星</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">状态</span>
            </label>
            <select class="select select-bordered" v-model="filters.status">
              <option value="">全部</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
              <option value="archived">已归档</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 实验列表 -->
    <div class="grid grid-cols-1 gap-4">
      <div v-for="experiment in filteredExperiments" :key="experiment.id" 
           class="card bg-base-100 shadow-xl compact-card">
        <div class="card-body p-4">
          <!-- 实验标题和状态 -->
          <div class="flex justify-between items-start">
            <div>
              <h2 class="card-title text-base">
                {{ experiment.name }}
                <div class="badge" :class="getStatusBadgeClass(experiment.status)">
                  {{ getStatusText(experiment.status) }}
                </div>
              </h2>
              <div class="text-xs text-base-content/60">
                所属课程: {{ experiment.courseName }}
              </div>
            </div>
            <div class="text-yellow-500 text-sm">
              难度: {{ getDifficultyStars(experiment.difficulty) }}
            </div>
          </div>

          <!-- 实验描述 -->
          <p class="text-sm text-base-content/70 my-1">{{ experiment.description }}</p>

          <!-- 任务点列表 -->
          <div class="mt-2">
            <details class="cursor-pointer">
              <summary class="font-semibold text-sm mb-1">任务点</summary>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div v-for="task in experiment.taskPoints" :key="task.id" 
                    class="card bg-base-200">
                  <div class="card-body p-2">
                    <div class="flex justify-between items-center">
                      <h4 class="font-medium text-sm">{{ task.name }}</h4>
                      <span class="badge badge-primary text-xs">{{ task.score }}分</span>
                    </div>
                    <p class="text-xs text-base-content/70">{{ task.description }}</p>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <!-- 环境配置 -->
          <div class="mt-2">
            <details class="cursor-pointer">
              <summary class="font-semibold text-sm mb-1">实验环境</summary>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div v-if="experiment.environment.targetMachine" class="card bg-base-200">
                  <div class="card-body p-2">
                    <h4 class="font-medium text-sm">靶机环境</h4>
                    <div class="text-xs">
                      <div>镜像: {{ experiment.environment.targetMachine.image }}</div>
                      <div>端口: {{ experiment.environment.targetMachine.port }}</div>
                      <div>内存: {{ experiment.environment.targetMachine.memory }}</div>
                    </div>
                  </div>
                </div>
                <div v-if="experiment.environment.operationMachine" class="card bg-base-200">
                  <div class="card-body p-2">
                    <h4 class="font-medium text-sm">操作环境</h4>
                    <div class="text-xs">
                      <div>镜像: {{ experiment.environment.operationMachine.image }}</div>
                      <div>端口: {{ experiment.environment.operationMachine.port }}</div>
                      <div>内存: {{ experiment.environment.operationMachine.memory }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <!-- 统计信息 -->
          <div class="flex gap-4 mt-2 text-xs text-base-content/60">
            <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{{ experiment.studentCount }} 名学生</span>
            </div>
            <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>完成率 {{ experiment.completionRate }}%</span>
            </div>
            <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>平均分 {{ experiment.averageScore }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions justify-end mt-2">
            <button 
              class="btn btn-xs btn-ghost"
              @click="handleTaskPoints(experiment)"
            >
              任务点
            </button>
            <button 
              class="btn btn-xs btn-ghost"
              @click="handleEnvironment(experiment)"
            >
              环境配置
            </button>
            <button 
              class="btn btn-xs btn-ghost"
              @click="handleEdit(experiment)"
            >
              编辑
            </button>
            <button 
              class="btn btn-xs btn-ghost text-error"
              @click="handleDelete(experiment)"
            >
              删除
            </button>
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

/* 压缩卡片样式 */
.compact-card {
  margin-bottom: 0.5rem;
}

.compact-card .card-body {
  padding: 1rem;
}

.compact-card details summary {
  list-style: none;
  display: flex;
  align-items: center;
}

.compact-card details summary::after {
  content: '▼';
  font-size: 0.7rem;
  margin-left: 0.5rem;
}

.compact-card details[open] summary::after {
  content: '▲';
}
</style> 