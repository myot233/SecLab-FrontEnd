<script setup lang="ts">
import MarkdownIt from "markdown-it";
import { computed } from 'vue'
import hljs from "highlight.js/lib/core";
const props = defineProps<{
  content: string
}>()

const md = new MarkdownIt({
  html: true,
  linkify: true, 
  typographer: true,
  highlight(str, lang, _attrs) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  },
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
  @apply text-2xl font-bold mb-3 mt-2;
}

.markdown-body :deep(h2) {
  @apply text-xl font-bold mb-2 mt-3;
}

.markdown-body :deep(h3) {
  @apply text-lg font-bold mb-2 mt-3;
}

.markdown-body :deep(p) {
  @apply mb-3 leading-relaxed;
}

.markdown-body :deep(ul), .markdown-body :deep(ol) {
  @apply mb-3 pl-5;
}

.markdown-body :deep(ul) {
  @apply list-disc;
}

.markdown-body :deep(ol) {
  @apply list-decimal;
}

.markdown-body :deep(li) {
  @apply mb-1;
}

.markdown-body :deep(code) {
  @apply bg-base-200 px-1 py-0.5 rounded text-sm;
}

.markdown-body :deep(pre) {
  @apply bg-base-200 p-3 rounded mb-3 overflow-x-auto text-sm;
}

.markdown-body :deep(pre code) {
  @apply bg-transparent p-0;
}

.markdown-body :deep(blockquote) {
  @apply pl-4 border-l-4 border-base-300 italic my-3 text-base-content/80;
}

.markdown-body :deep(a) {
  @apply text-primary underline hover:text-primary/80 transition-colors;
}

.markdown-body :deep(table) {
  @apply w-full mb-3 text-sm;
}

.markdown-body :deep(th), .markdown-body :deep(td) {
  @apply p-2 border border-base-300;
}

.markdown-body :deep(th) {
  @apply bg-base-200;
}

/* 确保代码块内的文本不会换行 */
.markdown-body :deep(pre code) {
  white-space: pre;
}

/* 代码块最大高度，超出时显示滚动条 */
.markdown-body :deep(pre) {
  max-height: 400px;
}
</style> 