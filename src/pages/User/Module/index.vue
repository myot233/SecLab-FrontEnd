<script setup lang="ts">
import { useRoute } from 'vue-router'
import MarkdownRenderer from "../../../components/MarkdownRenderer.vue";
import type { DisplayQuestionType } from '../../../types/Question';
import { ref, watch, computed } from 'vue';
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
// 添加页面状态控制，用于切换做题和题解讨论页面
const currentTab = ref('practice') // 'practice'或'discussion'

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

// 添加已付费查看标记
const hasViewedDiscussion = ref(false)

// 查看题解讨论
const viewDiscussion = () => {
  if (!hasViewedDiscussion.value) {
    // 首次查看需要支付积分
    if (userPoints.value < solutionCost.value) {
      alert('积分不足，请先获取更多积分')
    return
  }
    
    // 显示确认对话框
  showCostModal.value = true
  } else {
    // 已经查看过，直接切换到讨论页面，不扣除积分
    currentTab.value = 'discussion'
  }
}

// 修改已有的确认查看题解的函数
const confirmViewDiscussion = () => {
  // 如果已查看过，不再扣费
  if (!hasViewedDiscussion.value) {
  userPoints.value -= solutionCost.value
    hasViewedDiscussion.value = true // 标记为已查看
  }
  currentTab.value = 'discussion'
  showCostModal.value = false
}

// 模拟题解讨论数据
const discussions = [
  {
    id: 1,
    author: {
      name: "王伟雪",
      avatar: "/student6.png"
    },
    content: "这道题的关键在于理解SQL注入的原理，我的解题思路是：\n1. 首先尝试最基本的单引号闭合\n2. 然后使用UNION SELECT语句\n3. 最后获取flag值",
    createdAt: "2024-03-20 14:30",
    likes: 25
  },
  {
    id: 2,
    author: {
      name: "徐建国",
      avatar: "/student7.png"
    },
    content: "补充一下，在做这道题时要注意以下几点：\n- 字符型注入需要注意闭合\n- 使用注释符号抵消后面的SQL语句\n- 可以使用order by判断字段数",
    createdAt: "2024-03-21 09:15",
    likes: 18
  },
  {
    id: 3,
    author: {
      name: "林宗恒",
      avatar: "/example.png"
    },
    content: "我使用了布尔盲注的方法解决这个问题，虽然花费时间长一些，但是更适合不能直接返回查询结果的情况。推荐参考《Web安全攻防》第三章的相关内容，对理解原理很有帮助。",
    createdAt: "2024-03-21 10:45",
    likes: 13
  },
  {
    id: 4,
    author: {
      name: "赵建国",
      avatar: "/student8.png"
    },
    content: "看到大家的解法都很复杂，其实这道题有一个简单的解法：\n\n```sql\n' OR '1'='1' --\n```\n\n这个payload可以绕过大多数简单的验证，原理是OR后面的条件永远为真，加上注释符号，可以直接获取flag。",
    createdAt: "2024-03-21 14:22",
    likes: 31
  },
  {
    id: 5,
    author: {
      name: "陈敏",
      avatar: "/student9.png"
    },
    content: "我写了一个Python脚本自动化提取flag，代码如下：\n\n```python\nimport requests\n\nurl = \"http://example.com/login\"\npayload = {\"username\": \"' UNION SELECT 1,2,flag FROM flags --\", \"password\": \"test\"}\n\nresponse = requests.post(url, data=payload)\nprint(response.text)\n```\n\n希望对大家有帮助！",
    createdAt: "2024-03-22 08:35",
    likes: 22
  },
  {
    id: 6,
    author: {
      name: "徐杰晓薇",
      avatar: "/student10.png"
    },
    content: "这个实验的关键是理解SQL查询的结构和注入点的位置。当你找到合适的注入点后，可以尝试使用不同的闭合方式，比如单引号、双引号或括号。我发现在这个实验中，使用单引号闭合最为有效。",
    createdAt: "2024-03-22 11:40",
    likes: 16
  },
  {
    id: 7,
    author: {
      name: "徐航娜",
      avatar: "/student11.png"
    },
    content: "我一开始做这道题非常困难，但后来发现问题出在我对SQL语法的理解上。建议大家先看一下SQL的基础语法，特别是SELECT语句的结构，对解题会有很大帮助。",
    createdAt: "2024-03-22 15:20",
    likes: 9
  },
  {
    id: 8,
    author: {
      name: "周杰",
      avatar: "/student12.png"
    },
    content: "我使用了时间盲注的方法，虽然效率不高，但是适用于没有直接回显的情况：\n\n```sql\n' OR IF(substr(flag,1,1)='f',sleep(3),0) --\n```\n\n通过控制延迟时间，可以逐位判断出flag的值。",
    createdAt: "2024-03-23 09:05",
    likes: 11
  },
  {
    id: 9,
    author: {
      name: "李娜",
      avatar: "/student13.png"
    },
    content: "我觉得做这类SQL注入题目，最重要的是要有一个系统的方法：\n1. 确定是否存在注入点\n2. 确定数据库类型\n3. 确定字段数\n4. 确定回显位置\n5. 利用注入获取数据\n\n按照这个流程，大部分SQL注入题目都能解决。",
    createdAt: "2024-03-23 14:15",
    likes: 27
  },
  {
    id: 10,
    author: {
      name: "张伟",
      avatar: "/student14.png"
    },
    content: "这道题的陷阱在于它会过滤一些常见的SQL关键词，比如SELECT。我通过大小写混合的方式绕过了过滤：\n\n```sql\n' UnIoN SeLeCt 1,2,flag FROM flags --\n```\n\n这种方法对于简单的字符串匹配过滤非常有效。",
    createdAt: "2024-03-23 17:30",
    likes: 15
  },
  {
    id: 11,
    author: {
      name: "王芳",
      avatar: "/student15.png"
    },
    content: "我做这道题的时候发现它对于空格有过滤，可以使用/**/来代替空格：\n\n```sql\n'/**/UNION/**/SELECT/**/1,2,flag/**/FROM/**/flags--\n```\n\n这种注释符替代空格的技巧在绕过WAF时非常有用。",
    createdAt: "2024-03-24 10:45",
    likes: 19
  },
  {
    id: 12,
    author: {
      name: "刘洋",
      avatar: "/student16.png"
    },
    content: "我建议初学者先从简单的单引号测试开始，看看系统是否有错误提示。有时候错误信息会包含数据库类型，表结构等关键信息，对解题非常有帮助。",
    createdAt: "2024-03-24 13:20",
    likes: 7
  },
  {
    id: 13,
    author: {
      name: "陈静",
      avatar: "/student17.png"
    },
    content: "除了常规的UNION SELECT方法，报错注入也是一个很好的选择，特别是在MySQL数据库上：\n\n```sql\n' AND extractvalue(1,concat(0x7e,(SELECT flag FROM flags),0x7e)) --\n```\n\n这个方法可以在没有直接回显的情况下获取数据。",
    createdAt: "2024-03-24 16:55",
    likes: 14
  },
  {
    id: 14,
    author: {
      name: "杨帆",
      avatar: "/student18.png"
    },
    content: "我在做这道题的时候发现，系统对一些特殊字符如单引号、双引号等有过滤，可以通过16进制编码绕过：\n\n```sql\n' UNION SELECT 1,2,0x73656372657420666C6167 --\n```\n\n其中0x73656372657420666C6167是'secret flag'的16进制表示。",
    createdAt: "2024-03-25 09:10",
    likes: 16
  },
  {
    id: 15,
    author: {
      name: "赵明",
      avatar: "/student19.png"
    },
    content: "对于这种SQL注入题目，我推荐使用SQLmap工具进行自动化测试，可以节省大量时间：\n\n```bash\nsqlmap -u \"http://example.com/login?id=1\" --dump\n```\n\n当然，在实际考试中可能不允许使用工具，但在练习时非常高效。",
    createdAt: "2024-03-25 13:45",
    likes: 21
  },
  {
    id: 16,
    author: {
      name: "王伟雪",
      avatar: "/student6.png"
    },
    content: "针对这道题，我总结了SQL注入的一些防御措施：\n1. 使用参数化查询\n2. 输入验证和过滤\n3. 最小权限原则\n4. 使用ORM框架\n\n希望大家在学习注入技术的同时，也要学习如何防御。",
    createdAt: "2024-03-25 16:30",
    likes: 28
  },
  {
    id: 17,
    author: {
      name: "徐建国",
      avatar: "/student7.png"
    },
    content: "在做这道题的时候，我遇到了一个问题：后端使用了预编译语句，但是在拼接ORDER BY子句时没有使用参数化查询，这就给了我们注入的机会。\n\n```sql\nid=1 ORDER BY (SELECT flag FROM flags)\n```\n\n通过这种方式，我成功获取了flag。",
    createdAt: "2024-03-26 08:20",
    likes: 17
  },
  {
    id: 18,
    author: {
      name: "林宗恒",
      avatar: "/example.png"
    },
    content: "对于这类题目，了解SQL语法的优先级很重要。例如，AND的优先级高于OR，所以可以构造类似这样的payload：\n\n```sql\nusername=' OR 1=1 AND username='admin\n```\n\n这样就能以admin身份登录系统。",
    createdAt: "2024-03-26 11:15",
    likes: 12
  },
  {
    id: 19,
    author: {
      name: "赵建国",
      avatar: "/student8.png"
    },
    content: "在SQL注入的学习过程中，我推荐大家搭建一个本地的靶场环境，比如DVWA或SQLi-labs，这样可以更深入地理解各种注入类型和防御措施。",
    createdAt: "2024-03-26 14:40",
    likes: 23
  },
  {
    id: 20,
    author: {
      name: "陈敏",
      avatar: "/student9.png"
    },
    content: "我发现这道题的一个隐藏考点是堆叠注入，通过分号可以执行多条SQL语句：\n\n```sql\n'; DROP TABLE users; --\n```\n\n当然，在本实验环境中不会真的删除表，但这种技术在实际攻击中非常危险，也是我们需要防范的。",
    createdAt: "2024-03-26 17:25",
    likes: 18
  },
  {
    id: 21,
    author: {
      name: "徐杰晓薇",
      avatar: "/student10.png"
    },
    content: "我认为学习SQL注入不仅要会技术，还要理解其背后的原理。SQL注入本质上是程序对用户输入的信任问题，这一点适用于所有的安全问题，值得我们深思。",
    createdAt: "2024-03-27 09:30",
    likes: 29
  },
  {
    id: 22,
    author: {
      name: "徐航娜",
      avatar: "/student11.png"
    },
    content: "这道题目我使用了sqlmap工具进行测试，发现了一个有趣的现象：系统对UNION关键词进行了过滤，但对UNION前面添加注释后就能绕过：\n\n```sql\n'/*!UNION*/ SELECT 1,2,flag FROM flags --\n```\n\n这是MySQL特有的注释语法，在注释中的代码仍然会被执行。",
    createdAt: "2024-03-27 13:15",
    likes: 15
  },
  {
    id: 23,
    author: {
      name: "周杰",
      avatar: "/student12.png"
    },
    content: "在进行SQL注入测试时，合理利用回显位置非常重要。如果发现某个位置可以回显注入结果，就可以通过构造查询语句获取任意信息。比如在这道题中，第二个字段可以回显，所以可以用：\n\n```sql\n' UNION SELECT 1,database(),3 --\n```\n\n来获取当前数据库名。",
    createdAt: "2024-03-27 16:50",
    likes: 11
  },
  {
    id: 24,
    author: {
      name: "李娜",
      avatar: "/student13.png"
    },
    content: "我觉得学习SQL注入的一个好方法是阅读OWASP的SQL注入备忘单，上面有很多实用的技巧和payload，对应不同的数据库类型和场景。强烈推荐给初学者参考！",
    createdAt: "2024-03-28 10:20",
    likes: 26
  },
  {
    id: 25,
    author: {
      name: "张伟",
      avatar: "/student14.png"
    },
    content: "如果遇到过滤了很多关键词和特殊字符的情况，可以考虑使用ASCII编码绕过：\n\n```sql\n' UNION SELECT 1,2,ASCII(115) --\n```\n\n这样可以避开对字符的直接过滤。更复杂的情况可以使用CHAR()函数连接多个ASCII码。",
    createdAt: "2024-03-28 13:45",
    likes: 14
  },
  {
    id: 26,
    author: {
      name: "王芳",
      avatar: "/student15.png"
    },
    content: "我发现在做SQL注入题目时，了解数据库的一些内置表和函数很有帮助。比如在MySQL中，information_schema库包含了所有表和列的信息，可以用来查找敏感表：\n\n```sql\n' UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES --\n```",
    createdAt: "2024-03-28 16:30",
    likes: 19
  },
  {
    id: 27,
    author: {
      name: "刘洋",
      avatar: "/student16.png"
    },
    content: "我在解决这道题时，发现一个技巧：当你不知道表名和列名时，可以先查询information_schema.tables和information_schema.columns这两个表，获取数据库结构，再进行有针对性的注入。这是一个系统性的方法，适用于大多数SQL注入场景。",
    createdAt: "2024-03-28 21:01",
    likes: 12
  },
  {
    id: 28,
    author: {
      name: "陈静",
      avatar: "/student17.png"
    },
    content: "对于这种带有WAF的环境，可以尝试一些绕过技术，比如大小写混合、注释符号插入、等价替换等。我发现使用CHAR函数代替字符串，可以有效绕过对单引号的过滤：\n\n```sql\n' UNION SELECT 1,2,CHAR(102,108,97,103) --\n```\n\n其中CHAR(102,108,97,103)相当于'flag'。",
    createdAt: "2024-03-29 09:12",
    likes: 17
  },
  {
    id: 29,
    author: {
      name: "杨帆",
      avatar: "/student18.png"
    },
    content: "我想分享一个小技巧：在SQL注入中，如果你不确定查询返回的字段数量，可以使用ORDER BY子句来判断：\n\n```sql\n' ORDER BY 1 --\n' ORDER BY 2 --\n' ORDER BY 3 --\n```\n\n一直尝试递增数字，直到出现错误，就可以知道字段的数量了。",
    createdAt: "2024-03-29 11:15",
    likes: 21
  },
  {
    id: 30,
    author: {
      name: "赵明",
      avatar: "/student19.png"
    },
    content: "我发现这道题的一个难点是它使用了预编译语句，但在处理LIKE查询时，仍然用字符串拼接构造了通配符：\n\n```sql\nSELECT * FROM users WHERE username LIKE '%{input}%'\n```\n\n这种情况下，可以通过注入改变LIKE条件的含义，例如：\n\n```\n%' OR username LIKE 'admin\n```\n\n这会变成：\n```sql\nSELECT * FROM users WHERE username LIKE '%' OR username LIKE 'admin%'\n```",
    createdAt: "2024-03-29 15:28",
    likes: 18
  },
  {
    id: 31,
    author: {
      name: "王伟雪",
      avatar: "/student6.png"
    },
    content: "在学习SQL注入的过程中，我觉得重要的是要理解SQL语句的语法结构。一个SQL语句包括SELECT、FROM、WHERE等子句，而注入就是利用语法的灵活性来改变原始查询的含义。理解了这一点，就能更有创造性地构造payload。",
    createdAt: "2024-03-29 19:43",
    likes: 23
  },
  {
    id: 32,
    author: {
      name: "徐建国",
      avatar: "/student7.png"
    },
    content: "我在解决这类SQL注入题目时，总是先尝试一些简单的测试payload，例如：\n- `'` 或 `\"`：测试是否存在注入点\n- `' OR 1=1 --`：测试是否能绕过认证\n- `' UNION SELECT 1,2,3 --`：测试UNION注入\n\n通过这些基础测试，可以初步判断注入类型和可能的攻击向量。",
    createdAt: "2024-03-30 08:09",
    likes: 19
  },
  {
    id: 33,
    author: {
      name: "林宗恒",
      avatar: "/example.png"
    },
    content: "我想谈谈SQL注入的防御措施，因为学习安全不仅是为了攻击，更是为了防御：\n\n1. 参数化查询是最有效的防御方法，它将SQL结构和数据分离\n2. 输入验证应该在服务器端进行，客户端验证容易被绕过\n3. 错误信息不应该直接返回给用户，应该记录在日志中\n4. 使用最小权限原则，数据库账户只应拥有必要的权限\n\n希望这些知识对同学们有所帮助！",
    createdAt: "2024-03-30 11:24",
    likes: 31
  },
  {
    id: 34,
    author: {
      name: "赵建国",
      avatar: "/student8.png"
    },
    content: "SQL注入的本质是代码注入的一种，其他类似的注入还有命令注入、XSS等。理解了一种注入的原理，对学习其他类型的注入也会有帮助。所有注入的共同点是：程序没有正确处理用户输入，导致输入被解释为代码执行。",
    createdAt: "2024-03-30 14:21",
    likes: 25
  },
  {
    id: 35,
    author: {
      name: "陈敏",
      avatar: "/student9.png"
    },
    content: "针对这道题，我想补充一点：在实际场景中，有时候不同的数据库系统需要使用不同的注入技术。例如：\n\n- MySQL: `UNION SELECT 1,2,3`\n- Oracle: `UNION SELECT 1,2,3 FROM dual`\n- SQL Server: `UNION SELECT 1,2,3 --`\n- PostgreSQL: `UNION SELECT 1,2,3;`\n\n了解不同数据库的特性对SQL注入非常重要。",
    createdAt: "2024-03-30 18:36",
    likes: 20
  },
  {
    id: 36,
    author: {
      name: "徐杰晓薇",
      avatar: "/student10.png"
    },
    content: "我刚开始学习SQL注入时，发现有些概念理解起来比较困难。后来我采用了一种方法：自己搭建环境，编写有漏洞的代码，然后尝试攻击它。这样不仅能深入理解漏洞原理，还能从开发者视角思考如何防御。强烈推荐大家尝试这种学习方法！",
    createdAt: "2024-03-31 09:57",
    likes: 27
  },
  {
    id: 37,
    author: {
      name: "徐航娜",
      avatar: "/student11.png"
    },
    content: "想分享一个经验：在做题时遇到困难，不要立即放弃或者查看答案，可以尝试分解问题。例如，先确定是否能注入，再确定数据库类型，然后尝试不同的注入方式。这种系统性的方法不仅适用于SQL注入，也适用于其他安全挑战。坚持独立思考，会让你的技能提升更快！",
    createdAt: "2024-03-31 13:28",
    likes: 22
  }
]
</script>

<template>
  <div class="container-fluid px-4 py-6 overflow-x-hidden">
  <div class="flex">
    <div class="flex-1 flex flex-col">
      <!-- 导航栏 -->
      <div class="bg-base-100 border-b border-base-300">
        <div class="flex items-center gap-6 px-6 py-3">
            <div 
              class="flex items-center gap-2 cursor-pointer"
              :class="currentTab === 'practice' ? 'text-primary font-semibold' : 'hover:text-primary transition-colors'"
              @click="currentTab = 'practice'">
            <i class="fas fa-code"></i>
              <span>做题</span>
          </div>
            <div 
              class="flex items-center gap-2 cursor-pointer"
              :class="currentTab === 'discussion' ? 'text-primary font-semibold' : 'hover:text-primary transition-colors'"
              @click="viewDiscussion()">
            <i class="fas fa-comments"></i>
            <span>题解讨论</span>
              <span v-if="!hasViewedDiscussion" class="badge badge-xs badge-primary ml-1">
              {{ solutionCost }}分
            </span>
          </div>
        </div>
      </div>

        <!-- 做题页面 -->
        <div v-if="currentTab === 'practice'" class="flex-1 flex flex-col">
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

      <!-- 题解讨论页面 -->
      <div v-if="currentTab === 'discussion'" class="flex-1 flex flex-col relative min-h-[70vh]">
        <div class="bg-base-200 p-4 shadow-lg mb-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <i class="fas fa-comments text-primary text-2xl"></i>
              <h1 class="text-2xl font-bold">题解讨论</h1>
            </div>
            <div class="flex items-center gap-2 text-secondary">
              <i class="fas fa-coins"></i>
              <span class="font-semibold">{{ userPoints }} 积分</span>
            </div>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 relative">
          <!-- 讨论列表区域，设置最大高度和滚动 -->
          <div class="discussion-list overflow-y-auto pb-24">
            <div v-for="discussion in discussions" :key="discussion.id" class="mb-6">
              <div class="flex items-start">
                <div class="avatar">
                  <div class="w-10 h-10 rounded-full bg-base-300 overflow-hidden">
                    <img :src="discussion.author.avatar" :alt="discussion.author.name" class="w-full h-full object-cover">
                  </div>
                </div>
                <div class="ml-3 flex-1">
                  <div class="flex items-center">
                    <span class="font-bold">{{ discussion.author.name }}</span>
                    <span class="text-xs text-base-content/60 ml-2">{{ discussion.createdAt }}</span>
                  </div>
                  <div class="mt-2 text-sm break-words whitespace-pre-line" v-html="discussion.content"></div>
                  <div class="mt-2 flex items-center">
                    <button class="btn btn-ghost btn-xs">
                      <i class="fas fa-thumbs-up mr-1"></i>
                      <span>{{ discussion.likes }}</span>
                    </button>
                    <button class="btn btn-ghost btn-xs ml-2">
                      <i class="fas fa-reply mr-1"></i>
                      <span>回复</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 悬浮的讨论输入框 -->
          <div class="discussion-input-fixed">
            <div class="discussion-input-container">
              <div class="flex items-start">
                <div class="avatar">
                  <div class="w-10 h-10 rounded-full bg-base-300 overflow-hidden">
                    <img src="/example.png" alt="Your Avatar" class="w-full h-full object-cover">
                  </div>
                </div>
                <div class="ml-3 flex-1">
                  <textarea 
                    class="textarea textarea-bordered w-full" 
                    rows="2" 
                    placeholder="分享你的解题思路和见解..."></textarea>
                  <div class="flex justify-start items-center mt-2">
                    <button class="btn btn-primary btn-sm mr-2">
                      <i class="fas fa-paper-plane mr-1"></i>
                      发布
                    </button>
                    <div>
                      <button class="btn btn-sm btn-circle btn-ghost">
                        <i class="fas fa-image"></i>
                      </button>
                      <button class="btn btn-sm btn-circle btn-ghost ml-1">
                        <i class="fas fa-code"></i>
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

    <!-- code-server -->
    <div v-if="showNoVNC" class="w-[60%] bg-base-300 transition-all duration-300 border-l border-base-300">
      <iframe src="http://127.0.0.1:8443" width="100%" height="100%"></iframe>
    </div>

      <!-- 积分确认弹窗 -->
      <dialog :class="{'modal': true, 'modal-open': showCostModal}">
        <div class="modal-box">
          <h3 class="font-bold text-lg">确认查看题解</h3>
          <p class="py-4">
            确认使用 {{ solutionCost }} 积分查看题解讨论吗？
            <span v-if="hasViewedDiscussion" class="text-success">
              (您已经支付过，无需再次支付)
            </span>
          </p>
        <div class="modal-action">
            <button class="btn" @click="showCostModal = false">取消</button>
            <button class="btn btn-primary" @click="confirmViewDiscussion">确认</button>
        </div>
      </div>
    </dialog>
    </div>
  </div>
</template>

<style scoped>
.container-fluid {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

html, body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  width: 100%;
}

/* 悬浮讨论输入框样式 */
.discussion-input-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: var(--color-base-300, #1a1a2e);
  border-top: 2px solid var(--color-primary);
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.discussion-input-container {
  background-color: var(--color-base-200, #222738);
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 2px solid var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
}

.discussion-input-container::before {
  content: "发表你的题解";
  position: absolute;
  top: -12px;
  left: 20px;
  background-color: var(--color-base-300, #1a1a2e);
  padding: 0 10px;
  font-size: 14px;
  font-weight: bold;
  color: var(--color-primary);
}

/* 讨论列表区域样式 */
.discussion-list {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-base-100);
  margin-bottom: 100px; /* 为底部固定输入框留出更多空间 */
}
</style>