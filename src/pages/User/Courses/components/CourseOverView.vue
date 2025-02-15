<script setup lang="ts">

import type {CourseOverViewType} from "./CourseOverView.ts";
const emit = defineEmits<{
  startLearn:[CourseOverViewType]
}>()
const props = defineProps<CourseOverViewType>();

</script>

<template>
  <div class="card  card-side bg-base-100 shadow-xl">
    <figure>
      <img
          :src="image"
          alt="课程图片" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
      <p>{{description}}</p>
      <div class="card-actions justify-end">
        <button type="button" class="btn btn-primary" @click='emit("startLearn",props)'>开始学习</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>