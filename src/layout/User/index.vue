<script setup lang="ts">
import Header from "./Header.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const isChatPage = computed(() => route.path === '/user/chat' || route.path === '/user/chat/');
</script>

<template>
    <div class="fixed w-full h-full flex flex-col bg-base-200">
        <Header></Header>
        <div class="w-full relative"  :class="{ 'overflow-y-auto': !isChatPage,'px-8 pt-8': !isChatPage }">
          <RouterView v-slot="{ Component }">
            <transition 
              name="page" 
              mode="out-in"
              appear
            >
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
    </div>
</template>

<style scoped>
/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.page-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 确保动画期间内容不会溢出 */


/* 防止页面闪烁 */
.page-leave-active {
  position: absolute;
}
</style>