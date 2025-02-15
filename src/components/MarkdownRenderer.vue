<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'

const props = defineProps<{
  content: string
}>()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const renderedContent = computed(() => {
  return md.render(props.content)
})
</script>

<template>
  <div class="markdown-body" v-html="renderedContent"></div>
</template>

<style scoped>
.markdown-body {
  @apply prose prose-slate max-w-none;
}

.markdown-body :deep(h1) {
  @apply text-2xl font-bold mb-4;
}

.markdown-body :deep(h2) {
  @apply text-xl font-bold mb-3;
}

.markdown-body :deep(p) {
  @apply mb-4;
}

.markdown-body :deep(ul) {
  @apply list-disc pl-5 mb-4;
}

.markdown-body :deep(code) {
  @apply bg-base-200 px-1 rounded;
}

.markdown-body :deep(pre) {
  @apply bg-base-200 p-4 rounded mb-4;
}
</style> 