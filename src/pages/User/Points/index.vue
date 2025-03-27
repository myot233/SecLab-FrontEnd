<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {LuckyWheel} from "@lucky-canvas/vue";

// 模拟用户积分余额
const userPoints = ref(5000)

// 商品数据
const products = ref([
  {
    id: 1,
    name: '无线蓝牙耳机',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    description: '高品质无线蓝牙耳机，支持主动降噪',
    stock: 5,
    sales: 128
  },
  {
    id: 2,
    name: '机械键盘',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop',
    description: 'RGB背光机械键盘，青轴',
    stock: 3,
    sales: 89
  },
  {
    id: 3,
    name: '无线鼠标',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
    description: '高精度无线游戏鼠标',
    stock: 8,
    sales: 256
  },
  {
    id: 4,
    name: '显示器',
    price: 66666,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
    description: '27寸2K高清显示器',
    stock: 1,
    sales: 12
  },
  {
    id: 5,
    name: '文具套装',
    price: 400,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop',
    description: '精美文具套装，包含钢笔、笔记本等',
    stock: 20,
    sales: 512
  }
])

// 转盘相关
const wheelRef = ref<HTMLCanvasElement | null>(null)
const isSpinning = ref(false)

// 转盘奖品配置
const wheelPrizes = [
  { name: '文具套装', probability: 0.4, price: 400, background: '#FFE4E1' },
  { name: '无线鼠标', probability: 0.3, price: 1500, background: '#E0FFFF' },
  { name: '蓝牙耳机', probability: 0.2, price: 2000, background: '#F0FFF0' },
  { name: '机械键盘', probability: 0.08, price: 3000, background: '#FFF0F5' },
  { name: '显示器', probability: 0.02, price: 66666, background: '#FFE4B5' }
]

// 初始化转盘
let myLucky: any = null
const luckyConfig = ref({
  width: 300,
  height: 300,
  blocks: [{ padding: '18px', background: '#869cfa' }],
  prizes: wheelPrizes.map(prize => ({
    name: prize.name,
    background: prize.background,
    fonts: [{ text: prize.name, top: '10%' }]
  })),
  buttons: [{
    radius: '35%',
    background: '#617df2',
    pointer: true,
    fonts: [{ text: '开始\n抽奖', top: '-10px' }]
  }],
  defaultConfig: {
    gutter: '8px'
  },
  defaultStyle: {
    fontSize: '14px',
    fontColor: '#000',
    fontWeight: '500',
    lineHeight: '18px',
    background: '#fff',
    shadow: '0 5px 10px rgba(0,0,0,0.1)'
  }
})
onMounted(() => {
  if (!wheelRef.value) return
  

  // 绑定点击事件
  myLucky.onStart = () => {
    startSpin()
  }
})

// 开始抽奖
const startSpin = () => {
  if (isSpinning.value || !myLucky) return
  if (userPoints.value < 888) {
    alert('积分不足，快去完成任务获得更多积分吧！')
    return
  }

  isSpinning.value = true
  
  // 随机选择奖品
  const random = Math.random()
  let sum = 0
  let selectedIndex = 0
  
  for (let i = 0; i < wheelPrizes.length; i++) {
    sum += wheelPrizes[i].probability
    if (random <= sum) {
      selectedIndex = i
      break
    }
  }

  // 开始抽奖动画
  myLucky.play()
  
  // 设置中奖索引
  setTimeout(() => {
    myLucky?.stop(selectedIndex)
    
    // 动画结束后扣除积分
    setTimeout(() => {
      isSpinning.value = false
      userPoints.value -= 888
      alert(`恭喜获得 ${wheelPrizes[selectedIndex].name}！`)
    }, 800)
  }, 2500)
}

// 兑换商品
const exchangeProduct = (product: typeof products.value[0]) => {
  if (userPoints.value < product.price) {
    alert('积分不足，快去完成任务获得更多积分吧！')
    return
  }
  
  if (confirm(`确认使用 ${product.price} 积分兑换 ${product.name}？`)) {
    userPoints.value -= product.price
    alert('兑换成功！')
  }
}

// 积分获取方式
const pointWays = [
  {
    title: '完成实验',
    description: '完成每个实验可获得相应积分奖励',
    icon: 'fa-flask',
    points: '10-100'
  },
  {
    title: '每日签到',
    description: '每日签到可获得随机积分奖励',
    icon: 'fa-calendar-check',
    points: '5-50'
  },
  {
    title: '分享经验',
    description: '在社区分享解题经验可获得积分',
    icon: 'fa-share-alt',
    points: '20-200'
  },
  {
    title: '帮助他人',
    description: '回答其他用户的问题可获得积分',
    icon: 'fa-hands-helping',
    points: '10-100'
  }
]

// 积分历史记录
const pointHistory = ref([
  {
    type: '获得',
    amount: 100,
    reason: '完成实验：SQL注入基础',
    time: '2024-03-26 14:30'
  },
  {
    type: '获得',
    amount: 50,
    reason: '每日签到奖励',
    time: '2024-03-26 09:00'
  },
  {
    type: '使用',
    amount: -888,
    reason: '积分抽奖',
    time: '2024-03-25 16:45'
  }
])
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 积分余额 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-primary">{{ userPoints }}</h2>
            <p class="text-sm text-base-content/70">快去做题获得积分吧！</p>
          </div>
          <div class="text-4xl">
            <i class="fas fa-coins text-yellow-500"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 积分获取方式 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div v-for="way in pointWays" 
           :key="way.title"
           class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div class="card-body">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <i :class="['fas', way.icon, 'text-2xl text-primary']"></i>
            </div>
            <div>
              <h3 class="font-bold">{{ way.title }}</h3>
              <p class="text-sm text-base-content/70">{{ way.description }}</p>
              <span class="text-xs text-primary">{{ way.points }}积分</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 积分转盘 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <h3 class="card-title mb-4">积分转盘</h3>
        <div class="flex flex-col items-center">
          <LuckyWheel
              ref="myLucky"
              width="300px"
              height="300px"
              :prizes="luckyConfig.prizes"
              :blocks="luckyConfig.blocks"
              
              :buttons="luckyConfig.buttons"></LuckyWheel>
<!--              @start="@"-->
<!--              @end="endCallback"-->
          
          <button class="btn btn-primary mt-4" 
                  :disabled="isSpinning"
                  @click="startSpin">
            <i class="fas fa-sync-alt mr-2"></i>
            开始抽奖 (888积分)
          </button>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div v-for="product in products" 
           :key="product.id"
           class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
        <figure class="px-4 pt-4">
          <img :src="product.image" 
               :alt="product.name"
               class="w-full h-48 object-cover rounded-lg" />
        </figure>
        <div class="card-body">
          <h3 class="card-title">{{ product.name }}</h3>
          <p class="text-sm text-base-content/70">{{ product.description }}</p>
          <div class="flex items-center justify-between mt-4">
            <div>
              <span class="text-primary font-bold">{{ product.price }} 积分</span>
              <div class="text-xs text-base-content/70 mt-1">
                库存: {{ product.stock }} | 已兑换: {{ product.sales }}
              </div>
            </div>
            <button class="btn btn-primary btn-sm"
                    :disabled="product.stock === 0"
                    @click="exchangeProduct(product)">
              立即兑换
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 积分历史 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title mb-4">积分历史</h3>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>时间</th>
                <th>类型</th>
                <th>积分</th>
                <th>原因</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in pointHistory" :key="record.time">
                <td>{{ record.time }}</td>
                <td>
                  <span :class="record.type === '获得' ? 'text-success' : 'text-error'">
                    {{ record.type }}
                  </span>
                </td>
                <td>
                  <span :class="record.type === '获得' ? 'text-success' : 'text-error'">
                    {{ record.type === '获得' ? '+' : '' }}{{ record.amount }}
                  </span>
                </td>
                <td>{{ record.reason }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}



/* 商品卡片悬停效果 */
.card:hover {
  transform: translateY(-5px);
}


/* 商品图片悬停效果 */
.card figure img {
  transition: transform 0.3s ease;
}

.card:hover figure img {
  transform: scale(1.05);
}

/* 积分历史表格样式 */
.table th {
  font-weight: 600;
  color: var(--color-base-content);
}

.table td {
  color: var(--color-base-content/80);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .card {
    margin-bottom: 1rem;
  }
}

/* 转盘文字样式 */
.wheel-text {
  position: absolute;
  width: 100%;
  text-align: center;
  font-weight: bold;
  color: #333;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* 转盘指针动画 */
@keyframes pointerPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.wheel-pointer {
  animation: pointerPulse 2s infinite;
}

canvas {
  pointer-events: none;
}

.lucky-wheel-container {
  width: 300px;
  height: 300px;
  position: relative;
  margin: 0 auto;
}

.lucky-wheel-container canvas {
  width: 100%;
  height: 100%;
  pointer-events: auto;
}
</style> 