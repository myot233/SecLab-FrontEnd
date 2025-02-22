<script setup lang="ts">
import { ref } from 'vue';

interface User {
  id: number;
  username: string;
  password: string;
}

interface Flag {
  id: number;
  flag: string;
}

const users: User[] = [
  { id: 1, username: 'testuser', password: 'password123' },
  { id: 2, username: 'admin', password: 'adminpass' }
];

const flags: Flag[] = [
  { id: 1, flag: 'FLAG{Frontend_Simulated_SQL_Injection}' }
];

// 添加提示状态控制
const showHints = ref(false)
const currentHintLevel = ref(0)
const maxHints = 3

// 显示下一个提示
const showNextHint = () => {
  if (currentHintLevel.value < maxHints) {
    currentHintLevel.value++
  }
}

// 重置提示
const resetHints = () => {
  showHints.value = false
  currentHintLevel.value = 0
}

// 修改查询函数，添加尝试次数追踪
let attemptCount = ref(0)
const maxAttemptsBeforeHint = 3

const simulateQuery = (usernameInput: string): string => {
  attemptCount.value++
  let resultText = "";
  
  // 在多次失败尝试后显示提示按钮
  if (attemptCount.value >= maxAttemptsBeforeHint && !showHints.value) {
    showHints.value = true
  }

  // 模拟 SQL 注入检测
  if (usernameInput.includes("'")) {
    // 检测到可能的 SQL 注入尝试
    resultText += "<p class='text-warning'>⚠️ 检测到特殊字符 ' </p>";
  }

  // 模拟 "后端查询逻辑"
  let simulatedSQL = `SELECT * FROM users WHERE username = '${usernameInput}'`;
  resultText += `<p class="font-mono bg-base-300 p-2 rounded my-2">执行SQL: ${simulatedSQL}</p>`;

  // 模拟 SQL 注入漏洞
  if (usernameInput.toLowerCase().includes("' or '1'='1")) {
    // 模拟 OR 注入成功
    resultText += "<p class='text-success'>✓ 查询成功！显示所有用户：</p>";
    users.forEach(user => {
      resultText += `<p class="ml-4">👤 用户名: ${user.username}</p>`;
    });
    return resultText;
  }

  // 模拟 UNION SELECT 注入
  if (usernameInput.toLowerCase().includes("union select")) {
    resultText += "<p class='text-info'>ℹ️ 检测到 UNION SELECT 查询</p>";
    
    if (usernameInput.toLowerCase().includes("from flags")) {
      resultText += "<p class='text-success'>🎯 成功查询 flags 表！</p>";
      flags.forEach(flag => {
        resultText += `<p class="ml-4 text-success font-bold">🚩 Flag: ${flag.flag}</p>`;
      });
      return resultText;
    }
  }

  // 正常查询逻辑
  const matchedUser = users.find(user => user.username === usernameInput);
  if (matchedUser) {
    resultText += `<p class='text-success'>✓ 找到用户：${matchedUser.username}</p>`;
  } else {
    resultText += "<p class='text-error'>✗ 未找到用户</p>";
  }

  return resultText;
}

const handleQuery = () => {
  const usernameInput = (document.getElementById('username') as HTMLInputElement).value;
  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    resultDiv.innerHTML = simulateQuery(usernameInput);
  }
}
</script>

<template>
  <div class="container mx-auto p-8">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="card-title text-2xl mb-6">
          <i class="fas fa-database text-primary mr-2"></i>
          SQL 注入实验环境
        </h1>

        <div class="alert alert-info mb-4">
          <i class="fas fa-info-circle"></i>
          <span>这是一个模拟的SQL注入环境，用于学习和理解SQL注入原理。尝试使用不同的payload来获取flag！</span>
        </div>

        <div class="form-control w-full max-w-xl mb-4">
          <label class="label">
            <span class="label-text">用户名查询：</span>
            <!-- 移除直接显示的提示 -->
          </label>
          <div class="input-group">
            <input type="text" id="username" class="input input-bordered w-full" 
                   placeholder="输入用户名..."/>
            <button class="btn btn-primary" @click="handleQuery">
              <i class="fas fa-search mr-2"></i>
              查询
            </button>
          </div>
        </div>

        <div class="divider">查询结果</div>

        <div id="result" class="min-h-[200px] p-4 bg-base-200 rounded-lg">
          <p class="text-base-content/70">
            <i class="fas fa-arrow-up"></i>
            在上方输入框中输入内容并点击查询按钮...
          </p>
        </div>

        <!-- 提示系统 -->
        <div v-if="showHints" class="mt-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-warning">
              <i class="fas fa-lightbulb mr-1"></i>
              需要帮助？
            </span>
            <button @click="showNextHint" class="btn btn-sm btn-warning" 
                    :disabled="currentHintLevel >= maxHints">
              显示下一个提示
            </button>
          </div>
          
          <!-- 渐进式提示 -->
          <div class="space-y-2 text-sm text-base-content/70">
            <div v-if="currentHintLevel >= 1" class="alert alert-warning bg-opacity-50">
              <i class="fas fa-lightbulb text-warning"></i>
              <span>提示 1: 尝试输入普通用户名 "testuser" 观察正常查询结果</span>
            </div>
            
            <div v-if="currentHintLevel >= 2" class="alert alert-warning bg-opacity-50">
              <i class="fas fa-lightbulb text-warning"></i>
              <span>提示 2: SQL查询中的单引号 (') 可能会改变查询语句的结构</span>
            </div>
            
            <div v-if="currentHintLevel >= 3" class="alert alert-warning bg-opacity-50">
              <i class="fas fa-lightbulb text-warning"></i>
              <span>提示 3: 尝试使用 "UNION SELECT" 语句来查询其他表，比如 "flags" 表</span>
            </div>
          </div>
        </div>

        <!-- 重置按钮 -->
        <div v-if="showHints" class="mt-4 text-center">
          <button @click="resetHints" class="btn btn-sm btn-ghost">
            <i class="fas fa-redo mr-1"></i>
            重置提示
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: sans-serif;
}

#result {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 50px;
}
</style>
