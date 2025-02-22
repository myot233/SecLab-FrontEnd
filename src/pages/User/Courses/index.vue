<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue';
import CourseOverView from './components/CourseOverView.vue';
import type { CourseOverViewType } from './components/CourseOverView';

function getCourseList():CourseOverViewType[] {
  return [
    {
      id: 1,
      name: "SQL注入攻防实战",
      image: "/1.SQL注入攻防实战.png",
      description: "深度解析字符型/数值型注入原理，涵盖联合查询注入、布尔盲注、时间盲注、报错注入等6大攻击类型，实验包含空格绕过、HEX编码绕过、注释符过滤突破等8种防御绕过技术",
      status: 'available',
      category: 'web',
      difficulty: 3,
      estimatedHours: 8,
      tags: ['SQL注入', 'Web安全'],
      totalStudents: 1200
    },
    {
      id: 2,
      name: "XSS漏洞深度解析",
      image: "/2.XSS漏洞深度解析.png",
      description: "构建反射型XSS钓鱼页面、存储型XSS持久化攻击、DOM型XSS前端漏洞利用三大实验场景，实战演示Cookie窃取、会话劫持、BeEF框架协同攻击",
      status: 'available',
      category: 'web',
      difficulty: 2,
      estimatedHours: 6
    },
    {
      id: 3,
      name: "文件上传漏洞突破",
      image: "/3.文件上传漏洞突破.png",
      description: "从客户端校验绕过到服务端检测突破，涵盖图片马制作、Content-Type伪造、.htaccess攻击、二次渲染对抗、竞争条件上传等全链条攻击手法",
      status: 'available',
      category: 'web',
      difficulty: 3,
      estimatedHours: 7
    },
    {
      id: 4,
      name: "中间件漏洞利用",
      image: "/4.中间件漏洞利用.png",
      description: "实战复现Weblogic反序列化漏洞(CVE-2023-21839)、Tomcat AJP协议漏洞(CVE-2020-1938)、JBoss JMXInvokerServlet反序列化三大经典漏洞",
      status: 'available',
      category: 'system',
      difficulty: 4,
      estimatedHours: 10
    },
    {
      id: 5,
      name: "组件漏洞挖掘",
      image: "/5.组件漏洞挖掘.png",
      description: "深入解析Shiro RememberMe反序列化、Fastjson JNDI注入、Log4j2远程代码执行(Log4Shell)三大组件漏洞的利用链构造与防御方案",
      status: 'available',
      category: 'system',
      difficulty: 4,
      estimatedHours: 9
    },
    { 
      id: 6,
      name: "框架漏洞利用",
      image: "/6.框架漏洞利用.png",
      description: "涵盖ThinkPHP多版本RCE漏洞利用、Struts2 OGNL表达式注入、Spring Cloud Gateway远程代码执行(CVE-2022-22947)等框架级漏洞实战",
      status: 'available',
      category: 'web',
      difficulty: 4,
      estimatedHours: 8
    },
    {
      id: 7,
      name: "业务逻辑漏洞实战",
      image: "/7.业务逻辑漏洞实战.png",
      description: "模拟电商平台实战环境，训练支付金额篡改、平行越权访问、短信炸弹攻击、验证码复用漏洞、空订单生成等12种典型业务场景漏洞挖掘",
      status: 'available',
      category: 'web',
      difficulty: 3,
      estimatedHours: 6
    },
    {
      id: 8,
      name: "内网渗透技术",
      image: "/8.内网渗透技术.png",
      description: "构建完整内网渗透链路：从CS/MSF木马植入→横向移动(PTH/PTT)→域控提权→隧道搭建(SSH/ICMP)→权限维持(黄金票据/影子账户)",
      status: 'available',
      category: 'network',
      difficulty: 5,
      estimatedHours: 12
    },
    {
      id: 9,
      name: "代码审计进阶",
      image: "/9.代码审计进阶.png",
      description: "基于真实CMS源码分析，训练SQL注入点定位、反序列化利用链构造、文件包含漏洞追踪、危险函数回溯等代码审计核心技能",
      status: 'available',
      category: 'web',
      difficulty: 4,
      estimatedHours: 10
    },
    {
      id: 10,
      name: "CTF综合实战",
      image: "/10.CTF攻防实战.png",
      description: "集成Web渗透、二进制逆向、密码破解、隐写分析等竞赛题型，包含2023年最新CTF赛题解析与自动化脚本开发技巧",
      status: 'available',
      category: 'crypto',
      difficulty: 5,
      estimatedHours: 15
    },
    {
      id: 11,
      name: "红队武器库",
      image: "/11.红队武器库.png",
      description: "深度使用Cobalt Strike 4.9进行协同作战，涵盖木马免杀(Shellcode混淆/内存加载)、钓鱼攻击、横向移动、痕迹清理等红队战术",
      status: 'available',
      category: 'network',
      difficulty: 5,
      estimatedHours: 14
    },
    {
      id: 12,
      name: "漏洞挖掘方法论",
      image: "/12.漏洞挖掘方法论.png",
      description: "从模糊测试到静态分析，完整漏洞挖掘流程实践：AFL智能模糊测试→IDA Pro逆向分析→GDB动态调试→PoC验证→CVE申请流程",
      status: 'available',
      category: 'system',
      difficulty: 5,
      estimatedHours: 16
    }
  ];
}





const isLoaded = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');

// 课程分类
const categories = [
  { id: 'web', name: 'Web安全', icon: 'fa-globe' },
  { id: 'system', name: '系统安全', icon: 'fa-desktop' },
  { id: 'network', name: '网络安全', icon: 'fa-network-wired' },
  { id: 'crypto', name: '密码学', icon: 'fa-key' }
];

// 课程统计
const stats = computed(() => ({
  total: courses.value.length,
  inProgress: courses.value.filter(c => c.status === 'in-progress').length,
  completed: courses.value.filter(c => c.status === 'completed').length,
  available: courses.value.filter(c => c.status === 'available').length
}));

// 过滤课程
const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    if (searchQuery.value && !course.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false;
    }
    if (selectedCategory.value && course.category !== selectedCategory.value) {
      return false;
    }
    return true;
  });
});

const courses: Ref<CourseOverViewType[]> = ref([]);

onMounted(async () => {
  try {
    const res = await getCourseList();
    courses.value = res;
    setTimeout(() => {
      isLoaded.value = true;
    }, 100);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  }
});
</script>

<template>
  <div class="container mx-auto p-4 min-h-screen">
    <!-- 页面标题 -->
    <div class="text-center mb-8" :class="{ 'animate-fade-in': isLoaded }">
      <h1 class="text-4xl font-bold mb-2 bg-clip-text text-transparent 
                 bg-gradient-to-r from-primary via-secondary to-accent">
        探索课程
      </h1>
      <p class="text-base-content/70">发现精心设计的安全课程，开启你的学习之旅</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats shadow w-full mb-8 bg-base-100 backdrop-blur-sm"
         :class="{ 'animate-slide-up': isLoaded }">
      <div class="stat">
        <div class="stat-figure text-primary">
          <i class="fas fa-book-open text-3xl"></i>
        </div>
        <div class="stat-title">总课程</div>
        <div class="stat-value text-primary">{{ stats.total }}</div>
      </div>
      
      <div class="stat">
        <div class="stat-figure text-info">
          <i class="fas fa-spinner text-3xl"></i>
        </div>
        <div class="stat-title">进行中</div>
        <div class="stat-value text-info">{{ stats.inProgress }}</div>
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
          <i class="fas fa-lock-open text-3xl"></i>
        </div>
        <div class="stat-title">可开始</div>
        <div class="stat-value text-warning">{{ stats.available }}</div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="flex flex-col md:flex-row gap-4 mb-8"
         :class="{ 'animate-slide-up': isLoaded }"
         style="animation-delay: 0.2s">
      <!-- 搜索框 -->
      <div class="flex-1 relative">
        <input 
          type="text" 
          placeholder="搜索课程..." 
          class="input input-bordered w-full pl-10 pr-4 bg-base-100/70 focus:bg-base-100
                 transition-all duration-300 shadow-sm hover:shadow focus:shadow-md"
          v-model="searchQuery"
        >
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50"></i>
      </div>

      <!-- 分类选择 -->
      <div class="flex gap-2">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="btn btn-ghost gap-2"
          :class="{ 'btn-active': selectedCategory === category.id }"
          @click="selectedCategory = selectedCategory === category.id ? '' : category.id"
        >
          <i :class="['fas', category.icon]"></i>
          <span>{{ category.name }}</span>
        </button>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
         :class="{ 'animate-fade-in': isLoaded }"
         style="animation-delay: 0.3s">
      <template v-if="filteredCourses.length">
        <div v-for="(course, index) in filteredCourses" 
             :key="course.id"
             :style="{ animationDelay: `${index * 0.1}s` }"
             class="animate-slide-up">
          <CourseOverView :course="course" />
        </div>
      </template>
      <div v-else class="col-span-full text-center py-12">
        <div class="text-6xl mb-4 text-base-content/30">
          <i class="fas fa-search"></i>
        </div>
        <h3 class="text-xl font-semibold mb-2">未找到匹配的课程</h3>
        <p class="text-base-content/70">
          试试调整搜索条件
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

/* 分类按钮样式 */
.btn-ghost {
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.btn-ghost.btn-active {
  background: var(--color-primary);
  color: white;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stats {
    flex-direction: column;
  }
  
  .btn-ghost span {
    display: none;
  }
}
</style>
