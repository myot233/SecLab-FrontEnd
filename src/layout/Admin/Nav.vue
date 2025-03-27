<script setup lang="ts">
import NavMenuItem from '../../components/NavMenuItem.vue'
import { 
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon 
} from '../../components/icons'

// 定义菜单项配置
const menuItems = [
  {
    icon: HomeIcon,
    title: '控制台',
    to: '/admin/dashboard',
    badge: "",
    description: '系统概览和关键指标'
  },
  {
    icon: UsersIcon,
    title: '用户管理',
    to: '/admin/user',
    badge: '99+',
    description: '管理用户账号和权限'
  },
  {
    icon: BookOpenIcon,
    title: '课程管理',
    to: '/admin/course',
    badge: "",
    description: '管理课程内容和进度'
  },
  {
    icon: ShieldCheckIcon,
    title: '模块管理',
    to: '/admin/lab',
    badge: "",
    description: '管理模块环境和任务'
  },
  {
    icon: ChartBarIcon,
    title: '数据统计',
    to: '/admin/statistics',
    badge: "",
    description: '查看系统运行数据'
  },
  {
    icon: CogIcon,
    title: '系统设置',
    to: '/admin/settings',
    badge: "",
    description: '配置系统参数'
  }
]
</script>

<template>
  <div class="w-64 h-full bg-base-100 border-r border-base-200 flex flex-col
              shadow-lg relative group">
    <!-- Logo -->
    <div class="px-6 py-4 border-b border-base-200">
      <div class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center
                    transform transition-all duration-300 group-hover:scale-110
                    group-hover:rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-6 w-6 text-primary transition-colors duration-300" 
               fill="none" 
               viewBox="0 0 24 24" 
               stroke="currentColor">
            <path stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-lg font-bold bg-gradient-to-r from-primary to-secondary 
                       bg-clip-text text-transparent">
            SecLab Admin
          </span>
          <span class="text-xs text-base-content/60">安全实验管理系统</span>
        </div>
      </div>
    </div>

    <!-- 菜单分组 -->
    <div class="flex-1 p-4 overflow-y-auto custom-scrollbar">
      <div class="mb-6">
        <h3 class="px-4 text-xs font-semibold text-base-content/60 uppercase mb-3
                   flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
          主要功能
        </h3>
        <nav class="space-y-1">
          <NavMenuItem 
            v-for="item in menuItems.slice(0, 4)" 
            :key="item.to"
            v-bind="item"
            class="animate-fade-in"
            :style="{ animationDelay: `${menuItems.indexOf(item) * 0.1}s` }"
          />
        </nav>
      </div>

      <div class="mb-6">
        <h3 class="px-4 text-xs font-semibold text-base-content/60 uppercase mb-3
                   flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-secondary"></div>
          系统管理
        </h3>
        <nav class="space-y-1">
          <NavMenuItem 
            v-for="item in menuItems.slice(4)" 
            :key="item.to"
            v-bind="item"
            class="animate-fade-in"
            :style="{ animationDelay: `${(menuItems.indexOf(item) + 4) * 0.1}s` }"
          />
        </nav>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="p-4 border-t border-base-200 bg-base-200/50 backdrop-blur-sm">
      <div class="flex items-center gap-3 px-4 py-3 bg-base-100 rounded-xl
                  hover:shadow-md transition-all duration-300">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          <span class="text-sm text-base-content/70">系统运行正常</span>
        </div>
        <div class="flex-1 flex justify-end">
          <button class="btn btn-ghost btn-xs">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-primary);
  border-radius: 20px;
}

/* 渐入动画 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
  opacity: 0;
}

/* 悬浮效果 */
.router-link-active {
  @apply bg-base-200;
  position: relative;
}

.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, var(--color-primary), var(--color-secondary));
  border-radius: 0 4px 4px 0;
}

/* Logo动画 */
.logo-container {
  transition: all 0.3s ease;
}

.logo-container:hover svg {
  transform: scale(1.1) rotate(10deg);
}
</style>