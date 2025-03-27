<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isLoaded = ref(false);

// 导航项配置
const navItems = [
  { path: '/#/user/welcome', label: '主页', icon: 'fa-home' },
  { path: '/#/user/courses', label: '课程', icon: 'fa-book-open' },
  { path: '/#/user/modules', label: '模块', icon: 'fa-cube' },
  { path: '/#/user/community', label: '社区', icon: 'fa-comments' },
  { path: '/#/user/scoreboard', label: '排行榜', icon: 'fa-trophy' },
  { path: '/#/user/points', label: '积分商城', icon: 'fa-coins' },
  { path: '/#/user/profile', label: '个人中心', icon: 'fa-user' },
  { path: '/#/user/chat', label: 'AI助手', icon: 'fa-robot' }

];

onMounted(() => {
  isLoaded.value = true;
});

// 判断当前路由
const isActive = (path: string) => route.path === path;
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
       :class="{ 'translate-y-0 opacity-100': isLoaded, '-translate-y-full opacity-0': !isLoaded }">
    <div class="navbar bg-base-100 shadow-lg backdrop-blur-md bg-opacity-90 px-4">
      <!-- Logo区域 -->
      <div class="flex-1">
        <a href="/user/welcome" 
           class="btn btn-ghost gap-2 text-2xl font-bold normal-case transition-all duration-300
                 hover:scale-105 group">
          <div class="relative">
            <i class="fas fa-shield-alt text-primary"></i>
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full 
                        opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span>Sec</span>
          <span class="text-primary">Lab</span>
        </a>
      </div>

      <!-- 导航菜单 -->
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1 gap-1">
          <li v-for="item in navItems" :key="item.path">
            <a :href="item.path"
               class="group relative px-4 py-2 transition-all duration-300"
               :class="{ 'text-primary font-medium': isActive(item.path) }">
              <!-- 背景效果 -->
              <div class="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 
                          transition-transform origin-center"></div>
              <!-- 激活指示器 -->
              <div v-if="isActive(item.path)"
                   class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
              
              <!-- 内容 -->
              <div class="relative flex items-center gap-2">
                <i :class="['fas', item.icon, 'group-hover:scale-110 transition-transform']"></i>
                <span>{{ item.label }}</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 底部装饰线 -->
    <div class="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
  </div>

  <!-- 占位符，防止内容被固定导航栏遮挡 -->
  <div class="h-16"></div>
</template>

<style scoped>
.navbar {
  border-bottom: 1px solid rgba(var(--color-base-content), 0.1);
}

/* 菜单项悬浮效果 */
.menu-horizontal > li > a {
  position: relative;
  overflow: hidden;
}

.menu-horizontal > li > a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: all 0.3s ease;
  transform: translateX(-50%);
  opacity: 0;
}

.menu-horizontal > li > a:hover::after,
.menu-horizontal > li > a.active::after {
  width: 60%;
  opacity: 1;
}

/* Logo动画 */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.btn-ghost:hover i {
  animation: pulse 1s infinite;
}

/* 玻璃拟态效果 */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .menu-horizontal {
    gap: 0;
  }
  
  .menu-horizontal > li > a {
    padding: 0.5rem;
  }
  
  .menu-horizontal > li > a span {
    display: none;
  }
  
  .menu-horizontal > li > a i {
    font-size: 1.2rem;
  }
}
</style>