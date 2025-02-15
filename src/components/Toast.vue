<template>
  <teleport to="body">
    <div v-if="visible" class="toast">
      <div class="alert alert-info">
        <span>{{ message }}</span>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useToast } from '../common';

const { toastMessage, toastVisible } = useToast();

const message = computed(() => toastMessage.value);
const visible = computed(() => toastVisible.value);
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}
</style> 