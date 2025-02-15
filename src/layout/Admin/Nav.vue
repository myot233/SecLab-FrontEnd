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
    badge:""
  },
  {
    icon: UsersIcon,
    title: '用户管理',
    to: '/admin/user',
    badge: '99+'
  },
  {
    icon: BookOpenIcon,
    title: '课程管理',
    to: '/admin/course',
    badge:""
  },
  {
    icon: ShieldCheckIcon,
    title: '实验管理',
    to: '/admin/lab',
    badge:""
  },
  {
    icon: ChartBarIcon,
    title: '数据统计',
    to: '/admin/statistics',
    badge:""
  },
  {
    icon: CogIcon,
    title: '系统设置',
    to: '/admin/settings',
    badge:""
  }
]
</script>

<template>
  <div class="w-64 h-full bg-base-100 border-r border-base-200">
    <!-- Logo -->
    <div class="px-6 py-4 border-b border-base-200">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span class="text-lg font-bold">SecLab Admin</span>
      </div>
    </div>

    <!-- 菜单分组 -->
    <div class="p-4">
      <div class="mb-4">
        <h3 class="px-4 text-xs font-semibold text-base-content/60 uppercase mb-2">
          主要功能
        </h3>
        <nav class="space-y-1">
          <NavMenuItem 
            v-for="item in menuItems.slice(0, 4)" 
            :key="item.to"
            v-bind="item"
          ></NavMenuItem>
        </nav>
      </div>

      <div class="mb-4">
        <h3 class="px-4 text-xs font-semibold text-base-content/60 uppercase mb-2">
          系统管理
        </h3>
        <nav class="space-y-1">
          <NavMenuItem 
            v-for="item in menuItems.slice(4)" 
            :key="item.to"
            v-bind="item"
          />
        </nav>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="absolute bottom-0 w-full p-4 border-t border-base-200">
      <div class="flex items-center gap-3 px-4 py-2 text-sm text-base-content/60">
        <div class="w-2 h-2 rounded-full bg-success"></div>
        <span>系统运行正常</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply bg-base-200;
}
</style>