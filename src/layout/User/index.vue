<script setup lang="ts">

import Header from "./Header.vue";

</script>

<template>
    <div class="fixed w-full h-full flex flex-col bg-base-200">
        <Header></Header>
        <div class="w-full px-8 pt-8 overflow-y-auto">
          <RouterView></RouterView>
        </div>
    </div>
</template>

<style scoped>

</style>