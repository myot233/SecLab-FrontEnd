<script setup lang="ts">
import { useRoute } from 'vue-router'
import MarkdownRenderer from "../../../components/MarkdownRenderer.vue";
import type { DisplayQuestionType } from '../../../types/Question';
import { ref, watch } from 'vue';
import type {Experiment} from "../../../types/experiment.ts";
import type { Module } from './index.ts';

const route = useRoute();
const moduleId = route.params.id;


// 模拟实验数据
const experiment: Module = {
  id: 1,
  name: 'SQL注入基础实验',
  introduction: '本实验将帮助你理解SQL注入漏洞的原理和基本利用方法',
  difficulty: 3,
  taskPoints: [
    {
      id: 1,
      name: '理解SQL注入原理',
      description: '学习SQL注入的基本概念和原理',
      score: 20,
      document: '## SQL注入的背景和基本操作\n' +
        '\n' +
        '### 背景\n' +
        '\n' +
        '在互联网应用早期，开发者为了快速开发和方便操作数据库，常常直接将用户输入的数据拼接进SQL查询语句中。 这种做法在当时看似便捷，但随着网络安全意识的提升，人们逐渐意识到这种方式存在巨大的安全隐患，这就是 **SQL注入漏洞** 的根源。\n' +
        '\n' +
        '**核心问题：**  开发者**信任**并直接使用了用户输入的数据来构建SQL查询，而没有对这些数据进行充分的 **安全过滤和转义**。\n' +
        '\n' +
        '**想象一下一个场景：**\n' +
        '\n' +
        '你正在访问一个网站，网站有一个登录页面，需要你输入用户名和密码。网站后端可能会用类似这样的SQL语句来验证你的身份：\n' +
        '\n' +
        '```sql\n' +
        'SELECT * FROM users WHERE username = \'你输入的用户名\' AND password = \'你输入的密码\';\n' +
        '```\n' +
        '\n' +
        '如果开发者没有对 "你输入的用户名" 和 "你输入的密码" 进行安全处理，那么攻击者就可以利用这一点，构造特殊的输入，改变原本SQL语句的含义，从而达到非法目的。\n' +
        '\n' +
        '### 基本操作原理\n' +
        '\n' +
        'SQL注入的本质就是 **欺骗数据库服务器**，让它执行攻击者预期的恶意SQL代码，而不是开发者原本设定的查询逻辑。\n' +
        '\n' +
        '**攻击流程通常包括以下步骤：**\n' +
        '\n' +
        '1. **寻找注入点：** 攻击者首先需要找到应用程序中哪些地方接受用户输入，并且这些输入会被拼接到SQL查询语句中。常见的注入点包括：\n' +
        '    * **Web表单:**  例如登录表单、搜索框、注册表单等。\n' +
        '    * **URL参数:**  例如 `http://example.com/products.php?id=1` 中的 `id` 参数。\n' +
        '    * **HTTP头:**  例如 `User-Agent`、`Cookie` 等。\n' +
        '\n' +
        '2. **判断注入类型和漏洞：**  找到注入点后，攻击者会尝试输入一些特殊字符或SQL语句，观察应用程序的反应（例如错误信息、页面内容变化），以此来判断是否存在SQL注入漏洞，并尝试确定漏洞的类型（例如数字型、字符型、搜索型等）。\n' +
        '\n' +
        '3. **构造恶意SQL语句：**  根据注入点和漏洞类型，攻击者开始构造恶意的SQL语句。 常见的攻击目标包括：\n' +
        '    * **绕过身份验证:**  例如在登录页面，通过注入SQL语句绕过用户名和密码验证。\n' +
        '    * **获取敏感数据:**  例如查询数据库中的用户表、订单表等敏感信息。\n' +
        '    * **修改或删除数据:**  例如修改用户信息、删除订单数据等。\n' +
        '    * **执行系统命令:**  在某些情况下，攻击者甚至可以利用SQL注入漏洞执行操作系统命令，完全控制服务器。\n' +
        '\n' +
        '**一个简单的SQL注入例子 (针对字符型注入点)：**\n' +
        '\n' +
        '假设有如下易受攻击的 PHP 代码：\n' +
        '\n' +
        '```php\n' +
        '<?php\n' +
        '$username = $_GET[\'username\'];\n' +
        '$query = "SELECT * FROM users WHERE username = \'$username\'";\n' +
        '// ... 执行查询 ...\n' +
        '?>\n' +
        '```\n' +
        '\n' +
        '如果攻击者在 URL 中输入：\n' +
        '\n' +
        '`http://example.com/vulnerable.php?username=admin\' OR \'1\'=\'1`\n' +
        '\n' +
        '那么拼接后的 SQL 语句会变成：\n' +
        '\n' +
        '```sql\n' +
        'SELECT * FROM users WHERE username = \'admin\' OR \'1\'=\'1\'\n' +
        '```\n' +
        '\n' +
        '由于 `OR \'1\'=\'1\'` 永远为真，这条 SQL 语句会返回 `users` 表中所有的数据，即使攻击者不知道 `admin` 用户的密码，也能绕过身份验证，获取所有用户信息。\n' +
        '\n' +
        '**更进一步的例子 (获取数据库版本信息)：**\n' +
        '\n' +
        '攻击者可以在 `username` 参数中注入如下语句：\n' +
        '\n' +
        '`http://example.com/vulnerable.php?username=admin\' UNION SELECT version() --`\n' +
        '\n' +
        '拼接后的 SQL 语句可能变成 (取决于数据库类型)：\n' +
        '\n' +
        '```sql\n' +
        'SELECT * FROM users WHERE username = \'admin\' UNION SELECT version() --\'\n' +
        '```\n' +
        '\n' +
        '`UNION SELECT version()` 会将数据库版本信息作为结果集返回，攻击者就可以从中获取数据库类型和版本信息，为后续更深入的攻击做准备。 `--` 是 SQL 的注释符，用于注释掉后面的语句，防止语法错误。\n' +
        '\n' +
        '###  总结\n' +
        '\n' +
        'SQL注入是一种利用应用程序对用户输入处理不当，将恶意SQL代码注入到数据库查询语句中，从而达到非法目的的网络攻击手段。  理解其背景和基本操作原理，是防范SQL注入攻击的第一步。\n',
      questions: [
        {
          "id": 1,
          "content": "SQL注入漏洞产生的根本原因是？",
          "score": 10,
          "requiresTarget": false,
          "type": "multiple-choice",
          "options": [
            "数据库软件本身存在漏洞",
            "操作系统安全配置不足",
            "应用程序未对用户输入进行充分的安全处理",
            "网络防火墙配置不当"
          ]
        },
        {
          "id": 2,
          "content": "以下哪个是SQL注入攻击的主要目标？",
          "score": 5,
          "requiresTarget": false,
          "type": "multiple-choice",
          "options": [
            "数据库服务器",
            "Web服务器",
            "客户端浏览器",
            "操作系统"
          ]
        },
        {
          "id": 3,
          "content": "攻击者通过SQL注入可以实现以下哪些目的？",
          "score": 5,
          "requiresTarget": false,
          "type": "multiple-choice",
          "options": [
            "绕过身份验证",
            "获取数据库敏感数据",
            "修改或删除数据库数据",
            "以上所有"
          ]
        },
        {
          "id": 4,
          "content": "在URL参数 `http://example.com/products.php?id=1` 中，哪个部分最有可能成为SQL注入的注入点？",
          "score": 5,
          "requiresTarget": false,
          "type": "multiple-choice",
          "options": [
            "http://example.com",
            "products.php",
            "?",
            "id=1"
          ]
        },
        {
          "id": 5,
          "content": "为了有效防止SQL注入，开发者应该采取的主要措施是？",
          "score": 10,
          "requiresTarget": false,
          "type": "multiple-choice",
          "options": [
            "使用强密码",
            "使用参数化查询 (或预编译语句)",
            "安装防火墙",
            "定期备份数据"
          ]
        },
        {
          "id": 6,
          "content": "以下哪种SQL注入类型是利用 `UNION` 关键字来合并查询结果的？",
          "score": 5,
          "requiresTarget": false,
          "type": "multiple-choice",
          "options": [
            "盲注 (Blind SQL Injection)",
            "联合查询注入 (Union-based SQL Injection)",
            "报错注入 (Error-based SQL Injection)",
            "布尔盲注 (Boolean-based Blind SQL Injection)"
          ]
        },
        {
          "id": 7,
          "content": "在SQL注入语句中，`--` 的作用是？",
          "score": 5,
          "requiresTarget": false,
          "type": "multiple-choice",
          "options": [
            "执行SQL语句",
            "注释掉后面的SQL语句",
            "分隔SQL语句",
            "定义变量"
          ]
        },
        {
          "id": 8,
          "content": "如果在一个登录表单的用户名输入框中输入 `' OR '1'='1 --`，最有可能发生的情况是？",
          "score": 10,
          "requiresTarget": false,
          "type": "multiple-choice",
          "options": [
            "网站崩溃",
            "成功绕过登录验证",
            "账号被锁定",
            "输入被视为普通的用户名"
          ]
        },
        {
          "id": 9,
          "content": "以下哪个选项是SQL注入攻击的常见注入点之一？",
          "score": 5,
          "requiresTarget": false,
          "type": "multiple-choice",
          "options": [
            "Web表单的输入框",
            "网站的logo图片",
            "网站的静态HTML文件",
            "服务器的CPU型号"
          ]
        },
        {
          "id": 10,
          "content": "以下哪个选项 *不是* SQL注入攻击的常见后果？",
          "score": 5,
          "requiresTarget": false,
          "type": "multiple-choice",
          "options": [
            "数据泄露",
            "网站被篡改",
            "服务器被控制",
            "客户端电脑中毒"
          ]
        }
      ],
    },
    {
      "id": 100,
      "name": "SQL注入实验环境",
      "description": "本实验提供了一个安全的环境，帮助你理解和实践SQL注入技术。实验环境仅用于学习目的，所有操作都在受控环境中进行，不会对实际系统造成影响。",
      "score": 30,
      "document": `# SQL注入实验环境

## 实验简介

本实验环境提供了一个基础的用户查询系统，你将在这个环境中学习如何识别SQL注入漏洞，并尝试构造特定的输入来获取隐藏的信息。

**注意：本实验环境仅用于教育目的。** 所有操作都在受控环境中进行，这些技术在未经授权的情况下使用是违法的。

## 实验目标

1. 理解 SQL 注入的基本原理
2. 学习如何识别潜在的注入点
3. 掌握基本的 SQL 注入技术
4. 获取隐藏的 flag 值

## 实验环境说明

实验环境包含：
- 一个用于查询用户信息的输入框
- 一个显示查询结果的区域
- 一个包含 flag 的隐藏数据表

## 实验步骤

### 第一步：理解正常查询流程

1. 观察查询界面的基本功能
2. 注意查询结果区域显示的 SQL 语句
3. 使用正常用户名进行查询
4. 分析查询结果和执行的 SQL 语句

### 第二步：发现漏洞

系统会在你多次尝试后提供帮助：

1. 基础提示帮助你理解正常操作
2. 进阶提示指出潜在的漏洞
3. 高级提示协助你完成目标

### 第三步：漏洞利用尝试

在理解了基本原理后：

1. 尝试使用特殊字符测试系统响应
2. 观察系统的反馈信息
3. 根据反馈调整你的输入

### 第四步：获取 Flag

获取 flag 需要你：

1. 理解高级 SQL 查询语句的作用
2. 发现数据库中的其他表
3. 构造正确的查询语句

## 实验小贴士

- 仔细观察每次查询的结果
- 注意系统的警告信息
- 遇到困难时先多次尝试
- 记录并分析你的尝试过程

## 实验评分标准

实验评分基于以下几个方面：
1. 对注入原理的理解（10分）
2. 成功绕过验证（10分）
3. 成功获取 flag（10分）

## 安全提醒

请记住：
- 未经授权的注入测试是违法的
- 应该使用合法的渗透测试方法
- 发现漏洞要及时报告

现在，开始你的实验吧！`,
      "questions": [
        {
          "id": 1,
          "content": "请描述SQL注入的基本原理 (在本前端模拟实验的上下文中)",
          "score": 10,
          "requiresTarget": false,
          "type": "open-ended-without-answer"
        },
        {
          "id": 2,
          "content": "以下哪个payload可以成功绕过前端模拟的用户名验证，并至少显示 '用户存在!' 的结果？",
          "score": 10,
          "requiresTarget": false,
          "type": "single-choice",
          "options": [
            "' OR '1'='1",
            "testuser",
            "'; DROP TABLE users; --",
            "正常用户名"
          ]
        },
        {
          "id": 3,
          "content": "请使用 `UNION SELECT` 类型的 payload，尝试获取模拟的 flag 值。请写出你使用的 payload 和最终获取的 flag 值。",
          "score": 10,
          "requiresTarget": false,
          "type": "open-ended-with-answer"
        }
      ]
    }
  ],
  targetMachine: {
    id: '550e8400-e29b-41d4-a716-446655440000'
  }
}

// 添加状态控制
const showNoVNC = ref(false)
const isOperationMachineRunning = ref(false)

// 添加加载状态
const isTargetLoading = ref(false)

// 添加操作环境加载状态
const isOperationLoading = ref(false)

// 添加答案状态
const answerStatus = ref<{ [key: number]: { [key: number]: boolean | null } }>({})
experiment.taskPoints.forEach((x) => {
  answerStatus.value[x.id] = {}
  x.questions.forEach((y) => {
    answerStatus.value[x.id][y.id] = null
  })
})

// 修改启动/关闭操作环境函数
const toggleOperationMachine = async () => {
  if (!isOperationMachineRunning.value) {
    // 启动操作环境
    isOperationLoading.value = true

    // 模拟启动延迟
    await new Promise(resolve => setTimeout(resolve, 2000))

    isOperationMachineRunning.value = true
    showNoVNC.value = true
    isOperationLoading.value = false
  } else {
    // 关闭操作环境
    isOperationMachineRunning.value = false
    showNoVNC.value = false
  }
}

// 修改启动靶机函数
const startTargetMachine = async () => {
  if (experiment.targetMachine?.id) {
    isTargetLoading.value = true

    // 模拟启动延迟
    await new Promise(resolve => setTimeout(resolve, 2000))

    window.open(`/container/${experiment.targetMachine.id}`, '_blank')
    isTargetLoading.value = false
  }
}

// 获取难度星级显示
const getDifficultyStars = (difficulty: number) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)

// 存储答案
const answers = ref<{ [key: number]: { [key: number]: string | string[] } }>({})
experiment.taskPoints.forEach((x) => {
  answers.value[x.id] = {}
  x.questions.forEach((y) => {

    answers.value[x.id][y.id] = y.type == "multiple-choice" ? [] : ""
  })
})
watch(answers.value, (x) => {
  console.log(x)
})
console.log(answers.value[1])
// 检查答案
const checkAnswer = (taskId: number, questionId: number) => {
  console.log('检查答案:', questionId, answers.value[taskId][questionId])
  // 模拟答案检查 - 这里应该替换为实际的答案检查逻辑
  answerStatus.value[taskId][questionId] = true
}

// 提交答案
const submitAnswer = (questionId: number) => {
  console.log('提交答案:', questionId, answers.value[questionId])
  // TODO: 实现答案提交逻辑
}

// 修改计算积分的方法
const calculatePoints = computed(() => {
  // 难度基础分：每星30分（5星最高150分）
  const difficultyPoints = experiment.difficulty * 30
  
  // 时间加成：每小时10分（最长5小时，最高50分）
  const totalHours = experiment.taskPoints.reduce((total, task) => {
    return total + task.score / 10  // 假设每10分的任务需要1小时
  }, 0)
  // 限制最大计算时长为5小时
  const timePoints = Math.min(Math.round(totalHours * 10), 50)
  
  // 总分 = 难度分 + 时间分（自然限制在200分以内）
  return difficultyPoints + timePoints
})

// 控制题解讨论弹窗的显示状态
const showDiscussionModal = ref(false)

// 计算查看题解所需积分
const getSolutionCost = (difficulty: number) => {
  const costs = {
    1: 0,    // 1星免费
    2: 40,   // 2星40分
    3: 80,   // 3星80分
    4: 120,  // 4星120分
    5: 180   // 5星180分
  }
  return costs[difficulty as keyof typeof costs]
}

// 显示积分确认弹窗
const showCostModal = ref(false)
const solutionCost = computed(() => getSolutionCost(experiment.difficulty))

// 模拟用户积分余额
const userPoints = ref(1000)

const handleViewDiscussion = () => {
  if (solutionCost.value > userPoints.value) {
    alert('积分不足，快去完成任务获得更多积分吧！')
    return
  }
  showCostModal.value = true
}

const confirmViewDiscussion = () => {
  userPoints.value -= solutionCost.value
  showCostModal.value = false
  showDiscussionModal.value = true
}

// 模拟题解讨论数据
const discussions = [
  {
    id: 1,
    author: {
      name: "张安全",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
    },
    content: "这道题的关键在于理解SQL注入的原理，我的解题思路是：\n1. 首先尝试最基本的单引号闭合\n2. 然后使用UNION SELECT语句\n3. 最后获取flag值",
    createdAt: "2024-03-20 14:30",
    likes: 15
  },
  {
    id: 2,
    author: {
      name: "李渗透",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2"
    },
    content: "补充一下，在做这道题时要注意以下几点：\n- 字符型注入需要注意闭合\n- 使用注释符号抵消后面的SQL语句\n- 可以使用order by判断字段数",
    createdAt: "2024-03-21 09:15",
    likes: 8
  }
]
</script>

<template>
  <div class="flex">
    <div class="flex-1 flex flex-col">
      <!-- 导航栏 -->
      <div class="bg-base-100 border-b border-base-300">
        <div class="flex items-center gap-6 px-6 py-3">
          <div class="flex items-center gap-2 text-primary cursor-pointer">
            <i class="fas fa-code"></i>
            <span class="font-semibold">做题</span>
          </div>
          <div class="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
               @click="handleViewDiscussion">
            <i class="fas fa-comments"></i>
            <span>题解讨论</span>
            <span v-if="solutionCost > 0" class="badge badge-xs badge-primary ml-1">
              {{ solutionCost }}分
            </span>
          </div>
        </div>
      </div>

      <!-- 原有内容 -->
      <div class="flex-1 flex flex-col">
        <!-- 顶部区域 -->
        <div class="bg-base-200 p-4 shadow-lg space-y-4">
          <!-- 标题和难度行 -->
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <i class="fas fa-flask text-primary text-2xl"></i>
              <h1 class="text-2xl font-bold">{{ experiment.name }}</h1>
            </div>
            <div class="flex items-center gap-4">
              <!-- 添加积分显示 -->
              <div class="flex items-center gap-2 text-secondary">
                <i class="fas fa-coins"></i>
                <span class="font-semibold">{{ calculatePoints }}积分</span>
              </div>
              <!-- 原有的难度显示 -->
              <div class="text-yellow-500">
                <i class="fas fa-star mr-2"></i>
                难度: {{ getDifficultyStars(experiment.difficulty) }}
              </div>
            </div>
          </div>

          <!-- 环境控制行 -->
          <div class="flex justify-between items-center">
            <!-- 靶机控制 -->
            <div class="flex items-center gap-4">
              <i class="fas fa-server text-info"></i>
              <span>靶机环境</span>
              <span class="badge badge-sm" :class="isTargetLoading ? 'badge-info' : 'badge-warning'">
                {{ isTargetLoading ? '启动中' : '未启动' }}
              </span>
              <button class="btn btn-sm btn-primary" @click="startTargetMachine"
                :disabled="!experiment.targetMachine?.id || isTargetLoading">
                <span class="loading loading-spinner loading-xs" v-if="isTargetLoading"></span>
                <i class="fas fa-play mr-1" v-else></i>
                {{ isTargetLoading ? '正在启动靶机...' : '启动靶机' }}
              </button>
              <div v-if="isTargetLoading" class="text-sm text-info">
                靶机环境正在准备中，请稍候...
              </div>
            </div>

            <!-- 操作环境控制 -->
            <div class="flex items-center gap-4">
              <i class="fas fa-desktop text-info"></i>
              <span>操作环境</span>
              <span class="badge badge-sm"
                :class="isOperationLoading ? 'badge-info' : isOperationMachineRunning ? 'badge-success' : 'badge-warning'">
                {{ isOperationLoading ? '启动中' : isOperationMachineRunning ? '运行中' : '未启动' }}
              </span>
              <button class="btn btn-sm" :class="isOperationMachineRunning ? 'btn-error' : 'btn-primary'"
                @click="toggleOperationMachine" :disabled="isOperationLoading">
                <span class="loading loading-spinner loading-xs" v-if="isOperationLoading"></span>
                <i :class="isOperationMachineRunning ? 'fas fa-stop' : 'fas fa-play'" class="mr-1" v-else></i>
                {{ isOperationLoading ? '正在启动...' : isOperationMachineRunning ? '关闭操作环境' : '启动操作环境' }}
              </button>
              <div v-if="isOperationLoading" class="text-sm text-info">
                操作环境正在准备中，请稍候...
              </div>
            </div>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="transition-all duration-300 p-4 overflow-y-auto flex-1 w-full">
          <!-- 实验介绍 -->
          <div class="card bg-base-100 shadow-xl mb-6">
            <div class="card-body">
              <h2 class="text-xl font-semibold mb-2">
                <i class="fas fa-info-circle text-primary mr-2"></i>
                实验介绍
              </h2>
              <p>{{ experiment.introduction }}</p>
            </div>
          </div>

          <!-- 任务点列表 -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="text-xl font-semibold mb-4">
                <i class="fas fa-tasks text-primary mr-2"></i>
                任务点
              </h2>
              <div class="space-y-4">
                <div v-for="task in experiment.taskPoints" :key="task.id"
                  class="collapse collapse-arrow border-base-300 bg-base-200 border">
                  <input type="checkbox" />
                  <div class="collapse-title text-xl font-semibold flex items-center gap-2">
                    <i class="fas fa-tasks"></i>
                    {{ task.name }}
                    <div class="badge badge-primary badge-lg">
                      <span class="font-bold">{{ task.score }}</span>分
                    </div>
                  </div>
                  <div class="collapse-content">
                    <p>{{ task.description }}</p>

                    <!-- 添加Markdown文档渲染 -->
                    <div class="mt-4">
                      <h4 class="font-semibold mb-2">任务说明</h4>
                      <div class="card bg-base-100 p-4">
                        <MarkdownRenderer :content="task.document" />
                      </div>
                    </div>

                    <!-- 任务问题列表 -->
                    <div class="mt-4 space-y-2">
                      <div v-for="question in task.questions" :key="question.id" class="card bg-base-300">
                        <div class="card-body">
                          <div class="flex justify-between items-center">
                            <p>{{ question.content }}</p>
                            <span class="badge">{{ question.score }}分</span>
                          </div>
                          <div class="mt-2">
                            <!-- 带答案的开放题 -->
                            <div v-if="question.type === 'open-ended-with-answer'" class="space-y-2">
                              <textarea v-model="answers[task.id][question.id]" placeholder="请输入答案"
                                class="textarea textarea-bordered w-full h-24" />
                              <div class="flex items-center gap-2">
                                <button @click="checkAnswer(task.id, question.id)" class="btn btn-primary">
                                  检查答案
                                </button>
                                <span v-if="answerStatus[task.id][question.id] !== null" 
                                  :class="answerStatus[task.id][question.id] ? 'text-success' : 'text-error'"
                                  class="flex items-center">
                                  <i :class="answerStatus[task.id][question.id] ? 'fa-check' : 'fa-times'" class="fas mr-1"></i>
                                  {{ answerStatus[task.id][question.id] ? '答案正确' : '答案错误' }}
                                </span>
                              </div>
                            </div>

                            <!-- 无答案的开放题 -->
                            <div v-else-if="question.type === 'open-ended-without-answer'" class="space-y-2">
                              <textarea v-model="answers[task.id][question.id]" placeholder="请输入答案"
                                class="textarea textarea-bordered w-full h-24" />
                              <button @click="submitAnswer(question.id)" class="btn btn-primary">
                                提交答案
                              </button>
                            </div>

                            <!-- 单选题 -->
                            <div v-else-if="question.type === 'single-choice'" class="space-y-2">
                              <div v-for="(option, index) in question.options" :key="index"
                                class="flex items-center gap-2">
                                <input type="radio" v-model="answers[task.id][question.id]" :name="'q' + question.id"
                                  :value="option" class="radio radio-primary" />
                                <span>{{ option }}</span>
                              </div>
                              <div class="flex items-center gap-2 mt-2">
                                <button @click="checkAnswer(task.id, question.id)" class="btn btn-primary">
                                  检查答案
                                </button>
                                <span v-if="answerStatus[task.id][question.id] !== null" 
                                  :class="answerStatus[task.id][question.id] ? 'text-success' : 'text-error'"
                                  class="flex items-center">
                                  <i :class="answerStatus[task.id][question.id] ? 'fa-check' : 'fa-times'" class="fas mr-1"></i>
                                  {{ answerStatus[task.id][question.id] ? '答案正确' : '答案错误' }}
                                </span>
                              </div>
                            </div>

                            <!-- 多选题 -->
                            <div v-else-if="question.type === 'multiple-choice'" class="space-y-2">
                              <div v-for="(option, index) in question.options" :key="index"
                                class="flex items-center gap-2">
                                <input type="checkbox" v-model="answers[task.id][question.id]" :value="option"
                                  class="checkbox checkbox-primary" />
                                <span>{{ option }}</span>
                              </div>
                              <div class="flex items-center gap-2 mt-2">
                                <button @click="checkAnswer(task.id, question.id)" class="btn btn-primary">
                                  检查答案
                                </button>
                                <span v-if="answerStatus[task.id][question.id] !== null" 
                                  :class="answerStatus[task.id][question.id] ? 'text-success' : 'text-error'"
                                  class="flex items-center">
                                  <i :class="answerStatus[task.id][question.id] ? 'fa-check' : 'fa-times'" class="fas mr-1"></i>
                                  {{ answerStatus[task.id][question.id] ? '答案正确' : '答案错误' }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- code-server -->
    <div v-if="showNoVNC" class="w-[60%] bg-base-300 transition-all duration-300 border-l border-base-300">
      <iframe src="http://127.0.0.1:8443" width="100%" height="100%"></iframe>
    </div>

    <!-- 题解讨论弹窗 -->
    <dialog :class="{'modal': true, 'modal-open': showDiscussionModal}">
      <div class="modal-box w-11/12 max-w-4xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">题解讨论</h3>
          <button class="btn btn-sm btn-circle btn-ghost" @click="showDiscussionModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- 讨论列表 -->
        <div class="space-y-4">
          <div v-for="discussion in discussions" :key="discussion.id" 
               class="card bg-base-200">
            <div class="card-body">
              <div class="flex items-start gap-4">
                <!-- 用户头像 -->
                <div class="avatar">
                  <div class="w-12 h-12 rounded-full">
                    <img :src="discussion.author.avatar" alt="avatar" />
                  </div>
                </div>
                
                <!-- 讨论内容 -->
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-semibold">{{ discussion.author.name }}</span>
                    <span class="text-sm text-base-content/70">{{ discussion.createdAt }}</span>
                  </div>
                  <div class="whitespace-pre-line">{{ discussion.content }}</div>
                  
                  <!-- 点赞按钮 -->
                  <div class="flex items-center gap-2 mt-3">
                    <button class="btn btn-sm btn-ghost gap-2">
                      <i class="fas fa-thumbs-up"></i>
                      <span>{{ discussion.likes }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 添加讨论输入框 -->
        <div class="mt-6">
          <textarea class="textarea textarea-bordered w-full h-24" 
                    placeholder="分享你的解题思路..."></textarea>
          <div class="flex justify-end mt-2">
            <button class="btn btn-primary">
              <i class="fas fa-paper-plane mr-2"></i>
              发布讨论
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showDiscussionModal = false">关闭</button>
      </form>
    </dialog>

    <!-- 积分确认弹窗 -->
    <dialog :class="{'modal': true, 'modal-open': showCostModal}">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">确认查看题解</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span>所需积分：</span>
            <span class="text-primary font-bold">{{ solutionCost }}分</span>
          </div>
          <div class="flex justify-between items-center">
            <span>当前积分：</span>
            <span class="text-success font-bold">{{ userPoints }}分</span>
          </div>
          <div class="text-sm text-base-content/70">
            查看题解后将扣除相应积分，是否继续？
          </div>
        </div>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="showCostModal = false">取消</button>
          <button class="btn btn-primary" @click="confirmViewDiscussion">确认查看</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
}
</style>