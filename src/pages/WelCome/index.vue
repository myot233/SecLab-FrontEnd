<script setup lang="ts">
import { useRouter } from 'vue-router';
import IntroductionCard from './component/IntroductionCard.vue';

const router = useRouter();

const navigateToCourses = () => {
  router.push('/user/courses');
};

// 定义卡片数据
const cards = [
  {
    title: '课程学习',
    description: '探索我们精心设计的课程体系，从基础到进阶，循序渐进地掌握网络安全知识。',
    svgPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    buttonText: '开始学习',
    buttonClass: 'btn-primary',
    onClick: navigateToCourses
  },
  {
    title: '实践演练',
    description: '通过真实的案例和模拟环境，将理论知识转化为实践技能。',
    svgPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    buttonText: '即将推出',
    buttonClass: 'btn-secondary'
  },
  {
    title: '学习社区',
    description: '加入我们的学习社区，与其他学习者交流经验，分享心得。',
    svgPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    buttonText: '即将推出',
    buttonClass: 'btn-secondary'
  }
];
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <!-- 欢迎区域 -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold mb-4">欢迎来到网络安全学习平台</h1>
      <p class="text-xl text-base-content/80 max-w-2xl mx-auto">
        在这里，你将开启一段精彩的网络安全学习之旅。我们提供专业的课程内容和实践机会，
        帮助你掌握必要的网络安全技能。
      </p>
    </div>

    <!-- 功能卡片区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
      <IntroductionCard
        v-for="(card, index) in cards"
        :key="index"
        v-bind="card"
      />
    </div>
  </div>
</template>

<style scoped>
.card {
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}
</style> 