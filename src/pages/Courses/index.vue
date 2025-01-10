<script setup lang="ts">

import type {MergeId} from "../../common.ts";
import type {CourseOverViewType} from "./components/CourseOverView.ts";
import {ref, type Ref} from "vue";
import CourseOverView from "./components/CourseOverView.vue";

const courses: Ref<MergeId<CourseOverViewType>[]> = ref([{
  id: 1,
  name: "Web安全基础入门",
  image: "https://img-blog.csdnimg.cn/20210423100545296.jpg",
  description: "学习Web安全的基础知识，包括常见漏洞类型、攻击手段和防御方法。适合网络安全初学者。"
},
{
  id: 2,
  name: "渗透测试实战", 
  image: "https://img-blog.csdnimg.cn/20210423100545297.jpg",
  description: "通过实际案例学习渗透测试方法和工具使用，包括信息收集、漏洞扫描、漏洞利用等。"
},
{
  id: 3,
  name: "代码审计技术",
  image: "https://img-blog.csdnimg.cn/20210423100545298.jpg",
  description: "深入学习代码审计技术，找出代码中的安全漏洞。涵盖PHP、Java等常见语言的代码审计方法。"
},
{
  id: 4,
  name: "网络攻防实践",
  image: "https://img-blog.csdnimg.cn/20210423100545299.jpg", 
  description: "通过CTF比赛形式，在实战环境中提升网络安全技能。包含Web、Pwn、Crypto等多个方向。"
},
{
  id: 5,
  name: "安全开发生命周期",
  image: "https://img-blog.csdnimg.cn/20210423100545300.jpg",
  description: "学习如何在软件开发过程中融入安全实践，构建安全的应用程序。适合开发人员学习。"
}
]);

</script>

<template>
  <div class="flex flex-col gap-4">
    <CourseOverView v-for="course in courses" :key="course.id" :image="course.image" :name="course.name" :description="course.description"></CourseOverView>
  </div>
</template>
