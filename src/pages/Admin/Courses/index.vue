<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Course } from '../../../types/course'
import { useRouter } from 'vue-router'

const router = useRouter()

// 添加动画控制状态
const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

// 课程列表数据
const courses = ref<Course[]>([
  {
    id: 1,
    name: 'SQL注入攻防实战',
    description: '深度解析字符型/数值型注入原理，涵盖联合查询注入、布尔盲注、时间盲注、报错注入等6大攻击类型，实验包含空格绕过、HEX编码绕过、注释符过滤突破等8种防御绕过技术',
    cover: '/1.SQL注入攻防实战.png',
    difficulty: 3,
    category: 'Web安全',
    status: 'published',
    studentCount: 120,
    experimentCount: 8,
    createTime: '2024-03-15 10:00:00'
  },
  {
    id: 2,
    name: 'XSS漏洞深度解析',
    description: '构建反射型XSS钓鱼页面、存储型XSS持久化攻击、DOM型XSS前端漏洞利用三大实验场景，实战演示Cookie窃取、会话劫持、BeEF框架协同攻击',
    cover: '/2.XSS漏洞深度解析.png',
    difficulty: 2,
    category: 'Web安全',
    status: 'published',
    studentCount: 83,
    experimentCount: 6,
    createTime: '2024-03-14 15:30:00'
  },
  {
    id: 3,
    name: '文件上传漏洞突破',
    description: '从客户端校验绕过到服务端检测突破，涵盖图片马制作、Content-Type伪造、.htaccess攻击、二次渲染对抗、竞争条件上传等全链条攻击手法',
    cover: '/3.文件上传漏洞突破.png',
    difficulty: 3,
    category: 'Web安全',
    status: 'published',
    studentCount: 62,
    experimentCount: 7,
    createTime: '2024-03-13 09:15:00'
  },
  {
    id: 4,
    name: '中间件漏洞利用',
    description: '实战复现Weblogic反序列化漏洞(CVE-2023-21839)、Tomcat AJP协议漏洞(CVE-2020-1938)、JBoss JMXInvokerServlet反序列化三大经典漏洞',
    cover: '/4.中间件漏洞利用.png',
    difficulty: 4,
    category: '系统安全',
    status: 'published',
    studentCount: 40,
    experimentCount: 10,
    createTime: '2024-03-12 14:20:00'
  },
  {
    id: 5,
    name: '组件漏洞挖掘',
    description: '深入解析Shiro RememberMe反序列化、Fastjson JNDI注入、Log4j2远程代码执行(Log4Shell)三大组件漏洞的利用链构造与防御方案',
    cover: '/5.组件漏洞挖掘.png',
    difficulty: 4,
    category: '系统安全',
    status: 'published',
    studentCount: 42,
    experimentCount: 9,
    createTime: '2024-03-11 11:30:00'
  },
  {
    id: 6,
    name: '框架漏洞利用',
    description: '涵盖ThinkPHP多版本RCE漏洞利用、Struts2 OGNL表达式注入、Spring Cloud Gateway远程代码执行(CVE-2022-22947)等框架级漏洞实战',
    cover: '/6.框架漏洞利用.png',
    difficulty: 4,
    category: 'Web安全',
    status: 'published',
    studentCount: 51,
    experimentCount: 8,
    createTime: '2024-03-10 16:45:00'
  },
  {
    id: 7,
    name: '业务逻辑漏洞实战',
    description: '模拟电商平台实战环境，训练支付金额篡改、平行越权访问、短信炸弹攻击、验证码复用漏洞、空订单生成等12种典型业务场景漏洞挖掘',
    cover: '/7.业务逻辑漏洞实战.png',
    difficulty: 3,
    category: 'Web安全',
    status: 'published',
    studentCount: 55,
    experimentCount: 6,
    createTime: '2024-03-09 13:15:00'
  },
  {
    id: 8,
    name: '内网渗透技术',
    description: '构建完整内网渗透链路：从CS/MSF木马植入→横向移动(PTH/PTT)→域控提权→隧道搭建(SSH/ICMP)→权限维持(黄金票据/影子账户)',
    cover: '/8.内网渗透技术.png',
    difficulty: 5,
    category: '网络安全',
    status: 'published',
    studentCount: 35,
    experimentCount: 12,
    createTime: '2024-03-08 10:30:00'
  },
  {
    id: 9,
    name: '代码审计进阶',
    description: '基于真实CMS源码分析，训练SQL注入点定位、反序列化利用链构造、文件包含漏洞追踪、危险函数回溯等代码审计核心技能',
    cover: '/9.代码审计进阶.png',
    difficulty: 4,
    category: 'Web安全',
    status: 'published',
    studentCount: 44,
    experimentCount: 10,
    createTime: '2024-03-07 15:20:00'
  },
  {
    id: 10,
    name: 'CTF综合实战',
    description: '集成Web渗透、二进制逆向、密码破解、隐写分析等竞赛题型，包含2023年最新CTF赛题解析与自动化脚本开发技巧',
    cover: '/10.CTF攻防实战.png',
    difficulty: 5,
    category: '密码学',
    status: 'published',
    studentCount: 56,
    experimentCount: 15,
    createTime: '2024-03-06 09:45:00'
  },
  {
    id: 11,
    name: '红队武器库',
    description: '深度使用Cobalt Strike 4.9进行协同作战，涵盖木马免杀(Shellcode混淆/内存加载)、钓鱼攻击、横向移动、痕迹清理等红队战术',
    cover: '/11.红队武器库.png',
    difficulty: 5,
    category: '网络安全',
    status: 'published',
    studentCount: 38,
    experimentCount: 14,
    createTime: '2024-03-05 14:30:00'
  },
  {
    id: 12,
    name: '漏洞挖掘方法论',
    description: '从模糊测试到静态分析，完整漏洞挖掘流程实践：AFL智能模糊测试→IDA Pro逆向分析→GDB动态调试→PoC验证→CVE申请流程',
    cover: '/12.漏洞挖掘方法论.png',
    difficulty: 5,
    category: '系统安全',
    status: 'published',
    studentCount: 24,
    experimentCount: 16,
    createTime: '2024-03-04 11:20:00'
  }
])

// 搜索和筛选条件
const filters = ref({
  search: '',
  category: '',
  difficulty: '',
  status: ''
})

// 课程分类
const categories = ['Web安全', '系统安全', '密码学', '网络攻防', '移动安全']

// 过滤后的课程列表
const filteredCourses = computed(() => {
  return courses.value.filter((course) => {
    if (filters.value.search && !course.name.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false
    }
    if (filters.value.category && course.category !== filters.value.category) {
      return false
    }
    if (filters.value.difficulty && course.difficulty !== parseInt(filters.value.difficulty)) {
      return false
    }
    if (filters.value.status && course.status !== filters.value.status) {
      return false
    }
    return true
  })
})

// 获取难度星级显示
const getDifficultyStars = (difficulty: number) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)

// 获取状态标签样式
const getStatusBadgeClass = (status: Course['status']) => ({
  'badge-success': status === 'published',
  'badge-warning': status === 'draft',
  'badge-error': status === 'archived'
})

// 获取状态文本
const getStatusText = (status: Course['status']) =>
  ({
    published: '已发布',
    draft: '草稿',
    archived: '已归档'
  }[status])

// 处理课程操作
const handleCreateCourse = () => {
  router.push('/admin/course/create')
}

const handleEdit = (course: Course) => {
  console.log('编辑课程:', course)
}

const handleDelete = (course: Course) => {
  console.log('删除课程:', course)
}

const handleExperiments = (course: Course) => {
  console.log('管理实验:', course)
}

const handleStudents = (course: Course) => {
  console.log('管理学生:', course)
}
</script>

<template>
  <div class="container mx-auto p-4 min-h-screen">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center mb-6" :class="{ 'animate-fade-in': isLoaded }">
      <h1 class="text-2xl font-bold">课程管理</h1>
      <button class="btn btn-primary" @click="handleCreateCourse">
        <i class="fas fa-plus mr-2"></i>
        创建课程
      </button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card bg-base-100 shadow-xl mb-6" :class="{ 'animate-slide-up': isLoaded }" style="animation-delay: 0.2s">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">搜索</span>
            </label>
            <input type="text" class="input input-bordered" placeholder="搜索课程名称" v-model="filters.search" />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">分类</span>
            </label>
            <select class="select select-bordered" v-model="filters.category">
              <option value="">全部</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
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

    <!-- 课程列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8" :class="{ 'animate-fade-in': isLoaded }" style="animation-delay: 0.3s">
      <div v-for="(course, index) in filteredCourses" :key="course.id" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 group backdrop-blur-sm" :style="{ animationDelay: `${index * 0.1}s` }" :class="{ 'animate-slide-up': isLoaded }">
        <!-- 课程封面 -->
        <figure class="relative overflow-hidden aspect-video">
          <img :src="course.cover" :alt="course.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent opacity-60"></div>
          <div class="absolute top-2 right-2">
            <div class="badge" :class="getStatusBadgeClass(course.status)">
              {{ getStatusText(course.status) }}
            </div>
          </div>
        </figure>

        <div class="card-body">
          <!-- 课程信息 -->
          <h2 class="card-title group-hover:text-primary transition-colors">
            {{ course.name }}
            <div class="text-sm font-normal text-yellow-500">
              {{ getDifficultyStars(course.difficulty) }}
            </div>
          </h2>
          <p class="text-base-content/70">{{ course.description }}</p>

          <!-- 课程统计 -->
          <div class="flex gap-4 my-2 text-sm text-base-content/60">
            <div class="flex items-center gap-1">
              <i class="fas fa-users text-primary/70"></i>
              <span>{{ course.studentCount }} 名学生</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="fas fa-flask text-primary/70"></i>
              <span>{{ course.experimentCount }} 个实验</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions justify-end mt-4">
            <div class="flex gap-2">
              <button class="btn btn-sm btn-ghost gap-1 group-hover:scale-105 transition-transform">
                <i class="fas fa-users"></i>
                学生
              </button>
              <button class="btn btn-sm btn-ghost gap-1 group-hover:scale-105 transition-transform">
                <i class="fas fa-flask"></i>
                实验
              </button>
              <button class="btn btn-sm btn-ghost gap-1 group-hover:scale-105 transition-transform">
                <i class="fas fa-edit"></i>
                编辑
              </button>
              <button class="btn btn-sm btn-ghost gap-1 group-hover:scale-105 transition-transform text-error">
                <i class="fas fa-trash"></i>
                删除
              </button>
            </div>
          </div>
        </div>
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

/* 卡片悬停效果 */
.card {
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  will-change: transform;
  border: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 242, 254, 0.3);
  background: linear-gradient(45deg, rgba(0, 242, 254, 0.05), rgba(79, 172, 254, 0.05));
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
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
