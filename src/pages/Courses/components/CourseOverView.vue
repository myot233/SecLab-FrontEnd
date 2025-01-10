<script setup lang="ts">

import type {CourseOverViewType} from "./CourseOverView.ts";
defineProps<CourseOverViewType>();

</script>

<template>
  <div class="card -z-50 card-side bg-base-100 shadow-xl">
    <figure>
      <img
          :src="image"
          alt="课程图片" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
      <p>{{description}}</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary">开始学习</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>