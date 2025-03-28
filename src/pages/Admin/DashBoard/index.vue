<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'

// 核心统计数据
const stats = ref({
  totalUsers: 1247,
  activeUsers: 892,
  totalCourses: 24,
  totalExperiments: 42,
  completionRate: 67.8,
  averageScore: 78.4,
  // 新增统计
  newUsersToday: 23,
  onlineUsers: 168,
  totalSubmissions: 3845,
  systemUptime: '99.9%',
  storageUsage: '156.7GB',
  cpuUsage: 46,
  memoryUsage: 62,
  networkSpeed: '78.5MB/s'
})

// 用户活跃度数据
const userActivityData = {
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  datasets: [{
    label: '日活跃用户',
    data: [245, 286, 312, 298, 276, 187, 156],
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1,
    fill: true,
    backgroundColor: 'rgba(75, 192, 192, 0.1)'
  }]
}

// 实验完成情况分布
const experimentCompletionData = {
  labels: ['优秀', '良好', '及格', '不及格'],
  datasets: [{
    data: [15, 42, 28, 15],
    backgroundColor: [
      'rgba(52, 211, 153, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(251, 191, 36, 0.8)',
      'rgba(239, 68, 68, 0.8)'
    ]
  }]
}

// 课程参与度排名
const courseEngagementData = ref([
  { name: 'Web渗透测试基础', participants: 286, completion: 72, rating: 4.5 },
  { name: '网络安全防护实践', participants: 245, completion: 68, rating: 4.3 },
  { name: '密码学与数据安全', participants: 198, completion: 82, rating: 4.7 },
  { name: '安全编程实践', participants: 167, completion: 58, rating: 4.2 },
  { name: '应急响应与取证', participants: 142, completion: 64, rating: 4.4 }
])

// 系统性能指标
const performanceMetrics = ref({
  cpu: [46, 48, 52, 58, 62, 56, 49, 45, 42, 46],
  memory: [62, 65, 68, 72, 75, 71, 68, 64, 62, 65],
  network: [45, 52, 58, 62, 65, 60, 55, 48, 52, 56]
})

// 最近活动
const recentActivities = ref([
  {
    type: 'user',
    content: '新用户注册: 计算机学院-王明',
    time: '10分钟前',
    icon: 'fa-user-plus',
    details: '2023级网络空间安全专业'
  },
  {
    type: 'experiment',
    content: '实验完成: XSS跨站脚本攻击防护',
    time: '30分钟前',
    icon: 'fa-flask',
    details: '得分：88分，用时：67分钟'
  },
  {
    type: 'course',
    content: '课程更新: CSRF攻击与防御',
    time: '1小时前',
    icon: 'fa-book',
    details: '更新防护策略实验，新增Token验证模块'
  },
  {
    type: 'system',
    content: '系统维护: 漏洞修复',
    time: '2小时前',
    icon: 'fa-cog',
    details: '修复了Docker容器逃逸漏洞'
  },
  {
    type: 'alert',
    content: '安全告警: 检测到异常访问',
    time: '3小时前',
    icon: 'fa-exclamation-triangle',
    details: '来自IP: 192.168.1.45的暴力破解尝试'
  }
])
//1
// 安全事件统计
const securityEvents = ref({
  total: 47,
  critical: 2,
  warning: 8,
  info: 37,
  recentIssues: [
    { type: 'critical', content: '检测到疑似远程代码执行攻击', time: '15分钟前' },
    { type: 'warning', content: '检测到异常文件上传', time: '1小时前' },
    { type: 'info', content: 'WAF规则更新完成', time: '2小时前' }
  ]
})

// 初始化图表
onMounted(() => {
  // 用户活跃度趋势图
  const activityCtx = document.getElementById('activityChart') as HTMLCanvasElement
  new Chart(activityCtx, {
    type: 'line',
    data: userActivityData,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: '用户活跃度趋势' }
      }
    }
  })

  // 实验完成情况分布图
  const completionCtx = document.getElementById('completionChart') as HTMLCanvasElement
  new Chart(completionCtx, {
    type: 'doughnut',
    data: experimentCompletionData,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right' }
      }
    }
  })

  // 系统性能监控图
  const performanceCtx = document.getElementById('performanceChart') as HTMLCanvasElement
  new Chart(performanceCtx, {
    type: 'line',
    data: {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [
        {
          label: 'CPU使用率',
          data: performanceMetrics.value.cpu,
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.4
        },
        {
          label: '内存使用率',
          data: performanceMetrics.value.memory,
          borderColor: 'rgb(251, 191, 36)',
          tension: 0.4
        },
        {
          label: '网络使用率',
          data: performanceMetrics.value.network,
          borderColor: 'rgb(52, 211, 153)',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: '系统性能监控' }
      }
    }
  })
})
</script>

<template>
  <div class="p-2 m-4 overflow-y-auto">
    <!-- 页面标题 -->
    <div class="flex items-center gap-4 mb-8 animate__animated animate__fadeIn">
      <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <i class="fas fa-chart-line text-2xl text-primary"></i>
      </div>
      <div>
        <h1 class="text-2xl font-bold">控制台</h1>
        <p class="text-base-content/60">系统运行状态概览</p>
      </div>
    </div>

    <!-- 快速统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- 用户统计 -->
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-primary">
            <i class="fas fa-users text-3xl"></i>
          </div>
          <div class="stat-title">总用户数</div>
          <div class="stat-value">{{ stats.totalUsers }}</div>
          <div class="stat-desc text-success">
            <i class="fas fa-arrow-up"></i> 今日新增 {{ stats.newUsersToday }}
          </div>
        </div>
      </div>

      <!-- 在线用户 -->
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-secondary">
            <i class="fas fa-signal text-3xl"></i>
          </div>
          <div class="stat-title">当前在线</div>
          <div class="stat-value text-secondary">{{ stats.onlineUsers }}</div>
          <div class="stat-desc">占总用户 {{ (stats.onlineUsers/stats.totalUsers*100).toFixed(1) }}%</div>
        </div>
      </div>

      <!-- 系统状态 -->
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-success">
            <i class="fas fa-server text-3xl"></i>
          </div>
          <div class="stat-title">系统运行时间</div>
          <div class="stat-value text-success">{{ stats.systemUptime }}</div>
          <div class="stat-desc">存储使用: {{ stats.storageUsage }}</div>
        </div>
      </div>

      <!-- 实验统计 -->
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-info">
            <i class="fas fa-flask text-3xl"></i>
          </div>
          <div class="stat-title">实验提交</div>
          <div class="stat-value text-info">{{ stats.totalSubmissions }}</div>
          <div class="stat-desc">平均分 {{ stats.averageScore }}</div>
        </div>
      </div>
    </div>

    <!-- 系统性能监控 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="lg:col-span-2 card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">
            <i class="fas fa-microchip text-primary mr-2"></i>
            系统性能监控
          </h2>
          <canvas id="performanceChart"></canvas>
        </div>
      </div>

      <!-- 系统资源使用 -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">
            <i class="fas fa-server text-primary mr-2"></i>
            资源使用情况
          </h2>
          <div class="space-y-4">
            <!-- CPU使用率 -->
            <div>
              <div class="flex justify-between mb-1">
                <span>CPU使用率</span>
                <span>{{ stats.cpuUsage }}%</span>
              </div>
              <div class="w-full bg-base-200 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full transition-all duration-300"
                     :style="{ width: `${stats.cpuUsage}%` }"></div>
              </div>
            </div>

            <!-- 内存使用率 -->
            <div>
              <div class="flex justify-between mb-1">
                <span>内存使用率</span>
                <span>{{ stats.memoryUsage }}%</span>
              </div>
              <div class="w-full bg-base-200 rounded-full h-2">
                <div class="bg-secondary h-2 rounded-full transition-all duration-300"
                     :style="{ width: `${stats.memoryUsage}%` }"></div>
              </div>
            </div>

            <!-- 网络速度 -->
            <div>
              <div class="flex justify-between mb-1">
                <span>网络速度</span>
                <span>{{ stats.networkSpeed }}</span>
              </div>
              <div class="w-full bg-base-200 rounded-full h-2">
                <div class="bg-success h-2 rounded-full transition-all duration-300"
                     style="width: 65%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程和实验数据 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 实验完成情况分布 -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">
            <i class="fas fa-chart-pie text-primary mr-2"></i>
            实验完成情况分布
          </h2>
          <canvas id="completionChart"></canvas>
        </div>
      </div>

      <!-- 课程参与度排名 -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">
            <i class="fas fa-trophy text-primary mr-2"></i>
            课程参与度排名
          </h2>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>课程名称</th>
                  <th>参与人数</th>
                  <th>完成率</th>
                  <th>评分</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="course in courseEngagementData" :key="course.name"
                    class="hover">
                  <td>{{ course.name }}</td>
                  <td>{{ course.participants }}</td>
                  <td>
                    <div class="flex items-center gap-2">
                      <div class="w-20 bg-base-200 rounded-full h-2">
                        <div class="bg-primary h-2 rounded-full"
                             :style="{ width: `${course.completion}%` }"></div>
                      </div>
                      <span>{{ course.completion }}%</span>
                    </div>
                  </td>
                  <td>
                    <div class="rating rating-sm">
                      <input type="radio" class="mask mask-star-2 bg-orange-400" 
                             :checked="Math.round(course.rating) >= i"
                             v-for="i in 5" :key="i" disabled/>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动日志和安全事件 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 最近活动 -->
      <div class="lg:col-span-2 card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">
            <i class="fas fa-history text-primary mr-2"></i>
            最近活动
          </h2>
          <div class="space-y-4">
            <div v-for="(activity, index) in recentActivities" 
                 :key="index"
                 class="flex items-start gap-3 p-3 rounded-lg hover:bg-base-200 transition-all">
              <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <i :class="['fas', activity.icon, 'text-primary']"></i>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium">{{ activity.content }}</div>
                <div class="text-xs text-base-content/60 mt-1">{{ activity.time }}</div>
                <div class="text-xs text-base-content/70 mt-1">{{ activity.details }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全事件 -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">
            <i class="fas fa-shield-alt text-primary mr-2"></i>
            安全事件
          </h2>
          <div class="stats stats-vertical shadow">
            <div class="stat">
              <div class="stat-title">总事件数</div>
              <div class="stat-value">{{ securityEvents.total }}</div>
              <div class="stat-desc">过去24小时</div>
            </div>
            <div class="stat">
              <div class="stat-title">严重程度分布</div>
              <div class="stat-desc flex gap-4 mt-2">
                <span class="text-error">
                  严重 {{ securityEvents.critical }}
                </span>
                <span class="text-warning">
                  警告 {{ securityEvents.warning }}
                </span>
                <span class="text-info">
                  信息 {{ securityEvents.info }}
                </span>
              </div>
            </div>
          </div>
          <div class="divider">最近事件</div>
          <div class="space-y-2">
            <div v-for="(issue, index) in securityEvents.recentIssues" 
                 :key="index"
                 class="flex items-center gap-2 text-sm">
              <div class="w-2 h-2 rounded-full"
                   :class="{
                     'bg-error': issue.type === 'critical',
                     'bg-warning': issue.type === 'warning',
                     'bg-info': issue.type === 'info'
                   }"></div>
              <span>{{ issue.content }}</span>
              <span class="text-xs text-base-content/60 ml-auto">{{ issue.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate__animated {
  animation-duration: 0.8s;
}

.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-2px);
}

/* 图标动画 */
.fas {
  transition: transform 0.3s ease;
}

.card:hover .fas {
  transform: scale(1.1);
}

/* 活动项悬浮效果 */
.hover\:bg-base-200:hover {
  transform: translateX(4px);
}

/* 进度条动画 */
.bg-primary, .bg-secondary, .bg-success {
  transition: width 1s ease-in-out;
}

/* 表格行悬浮效果 */
.table tr.hover:hover {
  transform: translateX(4px);
  transition: all 0.3s ease;
}

/* 统计卡片动画 */
.stats {
  transition: all 0.3s ease;
}

.stats:hover {
  transform: translateY(-2px);
}

/* 安全事件指示器动画 */
.rounded-full {
  transition: all 0.3s ease;
}

.rounded-full:hover {
  transform: scale(1.2);
}
</style>
