<template>
          <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
        <div class="card-body">
          <h2 class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    :d="svgPath" />
            </svg>
            {{ title }}
          </h2>
          <p>{{ description }}</p>
          <div class="card-actions justify-end">
            <button class="btn" :class="buttonClass" @click="handleClick">{{ buttonText }}</button>
          </div>
        </div>
      </div>
</template>

<script setup lang="ts">
import type { Props } from './IntroductionCard';



const props = withDefaults(defineProps<Props>(), {
  buttonClass: 'btn-secondary',
  onClick: () => {}
});

const handleClick = () => {
  props.onClick();
};
</script>