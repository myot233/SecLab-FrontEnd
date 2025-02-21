<script setup lang="ts">
import { useRoute } from 'vue-router'
import MarkdownRenderer from "../../../components/MarkdownRenderer.vue";
import type { DisplayQuestionType } from '../../../types/Question';
import {ref, watch} from 'vue';

const route = useRoute();
// const moduleId = route.params.id;
route.params;
interface TaskPoint {
  id: number
  name: string
  description: string
  score: number
  document: string // Markdown格式的任务说明文档
  questions: DisplayQuestionType[]
}

interface Experiment {
  id: number
  name: string
  introduction: string
  difficulty: 1 | 2 | 3 | 4 | 5
  taskPoints: TaskPoint[]
  targetMachine?: {
    id: string

  }
  // operationMachine?: {
  //   id: string
  //   name: string
  //   status: 'running' | 'stopped' | 'failed'
  //   novncUrl?: string
  // }
}

// 模拟实验数据
const experiment: Experiment  = {
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
      id: 2,
      name: '实战SQL注入',
      description: '在靶机环境中实践SQL注入攻击',
      score: 30,
      document: '# 实战演练\n## 环境说明\n本实验提供了一个具有SQL注入漏洞的Web应用...',
      questions: [
        {
          id: 4,
          content: '请获取靶机中的flag值',
          score: 10,
          requiresTarget: true,
          type: 'open-ended-without-answer',
    
        },
        {
          id: 5,
          content: '以下哪个payload可以用来测试SQL注入漏洞？',
          score: 10,
          requiresTarget: false,
          type: 'single-choice',
          options: [
            '\'or \'1\'=\'1',
            'alert(1)',
             '&lt;script&gt;alert(1)&lt;/script&gt;',
            'rm -rf /'
          ],
          
        },
        {
          id: 6,
          content: '请详细描述你是如何获取flag的，包括使用的工具和具体步骤',
          score: 10,
          requiresTarget: true,
          type: 'open-ended-with-answer',
  
        }
      ],
    }
  ],
  targetMachine: {
    id: 'target-001'
  }
}

// 添加状态控制
const showNoVNC = ref(false)
const isOperationMachineRunning = ref(false)

// 修改启动/关闭操作环境函数
const toggleOperationMachine = () => {
  if (!isOperationMachineRunning.value) {
    // 启动操作环境
    isOperationMachineRunning.value = true
    showNoVNC.value = true
  } else {
    // 关闭操作环境
    isOperationMachineRunning.value = false
    showNoVNC.value = false
  }
}

// 启动靶机
const startTargetMachine = () => {

}

// 获取难度星级显示
const getDifficultyStars = (difficulty: number) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)

// 存储答案
const answers = ref<{[key:number]:{[key: number]: string | string[]}}>({})
experiment.taskPoints.forEach((x)=>{
  answers.value[x.id] = {}
  x.questions.forEach((y)=> {
    
    answers.value[x.id][y.id] = y.type == "multiple-choice" ? [] : ""
  })
})
watch(answers.value,(x)=>{
  console.log(x)
})
console.log(answers.value[1])
// 检查答案
const checkAnswer = (questionId: number) => {
  console.log('检查答案:', questionId, answers.value[questionId])
  // TODO: 实现答案检查逻辑
}

// 提交答案
const submitAnswer = (questionId: number) => {
  console.log('提交答案:', questionId, answers.value[questionId])
  // TODO: 实现答案提交逻辑
}
</script>

<template>
  <div class="flex">
    <div class="flex-1 flex flex-col">
      <!-- 顶部区域 -->
      <div class="bg-base-200 p-4 shadow-lg space-y-4">
        <!-- 标题和难度行 -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="fas fa-flask text-primary text-2xl"></i>
            <h1 class="text-2xl font-bold">{{ experiment.name }}</h1>
          </div>
          <div class="text-yellow-500">
            <i class="fas fa-star mr-2"></i>
            难度: {{ getDifficultyStars(experiment.difficulty) }}
          </div>
        </div>

        <!-- 环境控制行 -->
        <div class="flex justify-between items-center">
          <!-- 靶机控制 -->
          <div class="flex items-center gap-8">
            <div class="flex items-center gap-4">
              <i class="fas fa-server text-info"></i>
              <span>靶机环境</span>
              <span class="badge badge-sm badge-warning">未启动</span>
              <button 
                class="btn btn-sm btn-primary"
                @click="startTargetMachine"
                :disabled="true"
              >
                <i class="fas fa-play mr-1"></i>
                启动靶机
              </button>
            </div>

            <!-- 操作环境控制 -->
            <div class="flex items-center gap-4">
              <i class="fas fa-desktop text-info"></i>
              <span>操作环境</span>
              <span class="badge badge-sm" :class="isOperationMachineRunning ? 'badge-success' : 'badge-warning'">
                {{ isOperationMachineRunning ? '运行中' : '未启动' }}
              </span>
              <button 
                class="btn btn-sm"
                :class="isOperationMachineRunning ? 'btn-error' : 'btn-primary'"
                @click="toggleOperationMachine"
              >
                <i :class="isOperationMachineRunning ? 'fas fa-stop' : 'fas fa-play'" class="mr-1"></i>
                {{ isOperationMachineRunning ? '关闭操作环境' : '启动操作环境' }}
              </button>
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
              <div v-for="task in experiment.taskPoints" :key="task.id" class="collapse collapse-arrow border-base-300 bg-base-200 border">
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
                    <div v-for="question in task.questions" :key="question.id" 
                         class="card bg-base-300">
                      <div class="card-body">
                        <div class="flex justify-between items-center">
                          <p>{{ question.content }}</p>
                          <span class="badge">{{ question.score }}分</span>
                        </div>
                        <div class="mt-2">
                          <!-- 带答案的开放题 -->
                          <div v-if="question.type === 'open-ended-with-answer'" class="space-y-2">
                            <textarea 
                              v-model="answers[task.id][question.id]"
                              placeholder="请输入答案"
                              class="textarea textarea-bordered w-full h-24" />
                            <button 
                              @click="checkAnswer(question.id)"
                              class="btn btn-primary">
                              检查答案
                            </button>
                          </div>

                          <!-- 无答案的开放题 -->
                          <div v-else-if="question.type === 'open-ended-without-answer'" class="space-y-2">
                            <textarea 
                              v-model="answers[task.id][question.id]"
                              placeholder="请输入答案"
                              class="textarea textarea-bordered w-full h-24" />
                            <button 
                              @click="submitAnswer(question.id)"
                              class="btn btn-primary">
                              提交答案
                            </button>
                          </div>
                          
                          <!-- 单选题 -->
                          <div v-else-if="question.type === 'single-choice'" class="space-y-2">
                            <div v-for="(option, index) in question.options" :key="index"
                                 class="flex items-center gap-2">
                              <input type="radio"
                                     v-model="answers[task.id][question.id]"
                                     :name="'q'+question.id" 
                                     :value="option"
                                     class="radio radio-primary" />
                              <span>{{ option }}</span>
                            </div>
                            <button 
                              @click="checkAnswer(question.id)"
                              class="btn btn-primary mt-2">
                              检查答案
                            </button>
                          </div>
                          
                          <!-- 多选题 -->
                          <div v-else-if="question.type === 'multiple-choice'" class="space-y-2">
                            <div v-for="(option, index) in question.options" :key="index"
                                 class="flex items-center gap-2">
                              <input type="checkbox" 
                                     v-model="answers[task.id][question.id]"
                                     :value="option"
                                     class="checkbox checkbox-primary" />
                              <span>{{ option }}</span>
                            </div>
                            <button 
                              @click="checkAnswer(question.id)"
                              class="btn btn-primary mt-2">
                              检查答案
                            </button>
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

    <!-- noVNC 区域 -->
    <div v-if="showNoVNC" 
         class="w-[60%] bg-base-300 transition-all duration-300 border-l border-base-300">
      <div class="flex justify-between items-center p-4 border-b border-base-300">
        <h3 class="font-semibold">
          <i class="fas fa-desktop text-primary mr-2"></i>
          操作环境
          <span class="badge badge-sm badge-success ml-2">运行中</span>
        </h3>
        <button 
          class="btn btn-sm btn-ghost"
          @click="showNoVNC = false"
        >
          <i class="fas fa-minimize"></i>
        </button>
      </div>
      <div class="p-4">
        <!-- 这里放置 noVNC 内容 -->
        <div class="bg-base-200 h-full min-h-[600px] rounded-lg flex items-center justify-center">
          <span class="text-gray-500">noVNC 将在此处显示</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
}
</style>