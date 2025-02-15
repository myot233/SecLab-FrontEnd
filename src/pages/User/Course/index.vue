<script setup lang="ts">
// 定义课程接口

import {useRoute} from "vue-router";

const route = useRoute();
const courseId = route.params.id;
courseId;


interface Course {
  id: number
  name: string
  description: string
  schedule: string
  status: 'active' | 'upcoming' | 'completed'
  instructor: {
    name: string
    title: string
  }
  experiments: Array<{
    id: number
    title: string
    deadline: string
    difficulty: 1 | 2 | 3 | 4 | 5  // 1-5 stars difficulty rating
    introduction: string
  }>
}

// 模拟课程数据
const course: Course = {
  id: 1,
  name: '数据结构与算法',
  description: '本课程介绍基础数据结构和算法，包括数组、链表、树、图等数据结构，以及排序、搜索等经典算法。',
  schedule: '每周二 14:00-16:00',
  status: 'active',
  instructor: {
    name: '张教授',
    title: '计算机科学系副教授'
  },
  experiments: [
    {
      id: 1,
      title: '链表操作实验',
      deadline: '2024-04-20',
      difficulty: 2,
      introduction: '通过实现单链表的基本操作，掌握链表数据结构的核心概念和操作方法。'
    },
    {
      id: 2,
      title: '二叉树遍历实验',
      deadline: '2024-05-01',
      difficulty: 3,
      introduction: '学习并实现二叉树的前序、中序、后序遍历算法，深入理解树形结构的遍历方式。'
    }
  ]
}

// 获取课程状态对应的标签样式
const getStatusBadgeClass = (status: Course['status']) => {
  const classes = {
    active: 'badge-success',
    upcoming: 'badge-warning',
    completed: 'badge-neutral'
  }
  return classes[status]
}

// 获取状态的中文描述
const getStatusText = (status: Course['status']) => {
  const text = {
    active: '进行中',
    upcoming: '即将开始',
    completed: '已结束'
  }
  return text[status]
}

// Add a helper function to render stars
const getDifficultyStars = (difficulty: number) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 课程标题和状态 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">{{ course.name }}</h1>
      <div class="badge badge-lg" :class="getStatusBadgeClass(course.status)">
        {{ getStatusText(course.status) }}
      </div>
    </div>

    <!-- 课程信息卡片 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <!-- 课程简介 -->
        <div class="mb-4">
          <h2 class="text-xl font-semibold mb-2">课程简介</h2>
          <p>{{ course.description }}</p>
        </div>

        <!-- 课程详情 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 授课时间 -->
          <div>
            <h3 class="font-semibold mb-1">授课时间</h3>
            <p>{{ course.schedule }}</p>
          </div>

          <!-- 授课教师 -->
          <div>
            <h3 class="font-semibold mb-1">授课教师</h3>
            <p>{{ course.instructor.name }} - {{ course.instructor.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 实验列表 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="text-xl font-semibold mb-4">相关实验</h2>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>实验名称</th>
                <th>难度</th>
                <th>截止日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="experiment in course.experiments" :key="experiment.id">
                <td>
                  <div>
                    <div class="font-medium">{{ experiment.title }}</div>
                    <div class="text-sm text-gray-500">{{ experiment.introduction }}</div>
                  </div>
                </td>
                <td>
                  <span class="text-yellow-500">{{ getDifficultyStars(experiment.difficulty) }}</span>
                </td>
                <td>{{ experiment.deadline }}</td>
                <td>
                  <button class="btn btn-primary btn-sm">查看详情</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>