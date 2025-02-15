<script setup lang="ts">
  
</script>

<template>
  <div class="navbar bg-base-100 glass">
    <div class="flex-1">
      <a class="btn btn-ghost text-3xl">Sec<span class="text-yellow-200">Lab</span></a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li><a href="/user/welcome">主页</a></li>
        <li><a href="/user/courses">课程</a></li>
        <li><a href="/user/modules">模块</a></li>
        <li><a href="/user/scoreboard">排行榜</a></li>
        <li><a href="/user/profile">个人中心</a></li>
        
<!--        <li>-->
<!--          <details>-->
<!--            <summary>Parent</summary>-->
<!--            <ul class="bg-base-100 rounded-t-none p-2 z-[9999]"> &lt;!&ndash; Increased z-index to ensure it's not covered by other elements &ndash;&gt;-->
<!--              <li><a>Link 1</a></li>-->
<!--              <li><a>Link 2</a></li>-->
<!--            </ul>-->
<!--          </details>-->
<!--        </li>-->
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>