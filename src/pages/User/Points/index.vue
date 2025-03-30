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
    image: 'https://img2.baidu.com/it/u=2684254800,3703445430&fm=253&fmt=auto&app=120&f=JPEG?w=667&h=500',
    description: '27寸2K高清显示器',
    stock: 1,
    sales: 12
  },
  {
    id: 5,
    name: '文具套装',
    price: 400,
    image: 'https://img0.baidu.com/it/u=291407898,4159006597&fm=253&app=138&f=JPEG?w=800&h=1067',
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
  { 
    name: '文具套装', 
    probability: 0.4, 
    price: 400, 
    
    imgUrl: 'https://img0.baidu.com/it/u=291407898,4159006597&fm=253&app=138&f=JPEG?w=800&h=1067'
  },
  { 
    name: '无线鼠标', 
    probability: 0.3, 
    price: 1500, 
    
    imgUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop'
  },
  { 
    name: '蓝牙耳机', 
    probability: 0.2, 
    price: 2000, 
    
    imgUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
  },
  { 
    name: '机械键盘', 
    probability: 0.08, 
    price: 3000, 
    
    imgUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop'
  },
  { 
    name: '显示器', 
    probability: 0.02, 
    price: 66666, 
    
    imgUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop'
  }
]

// 初始化转盘
let myLucky: any = null
const luckyConfig = ref({
  width: 400,
  height: 400,
  blocks: [{ padding: '1px', background: '#869cfa' }],
  prizes: [
    {
      name: wheelPrizes[0].name,
      background: '#FFE4E1',  // 浅粉红色
      borderColor: '#333333',
      borderWidth: '10px',
      imgs: [{ 
        src: wheelPrizes[0].imgUrl,
        width: '58%',
        height: '58%',
        rotate: true,
        clip: true
      }]
    },
    {
      name: wheelPrizes[1].name,
      background: '#FFE4C4',  // 淡青色
      borderColor: '#333333',
      borderWidth: '3px',
      imgs: [{ 
        src: wheelPrizes[1].imgUrl,
        width: '58%',
        height: '58%',

        rotate: true,
        clip: true
      }]
    },
    {
      name: wheelPrizes[2].name,
      background: '#ADD8E6',  // 淡绿色
      borderColor: '#333333',
      borderWidth: '3px',
      imgs: [{ 
        src: wheelPrizes[2].imgUrl,
        width: '58%',
        height: '58%',

        rotate: true,
        clip: true
      }]
    },
    {
      name: wheelPrizes[3].name,
      background: '#E6E6FA',  // 淡紫色
      borderColor: '#333333',
      borderWidth: '3px',
      imgs: [{ 
        src: wheelPrizes[3].imgUrl,
        width: '58%',
        height: '58%',

        rotate: true,
        clip: true
      }]
    },
    {
      name: wheelPrizes[4].name,
      background: '#FFE4B5',  // 淡黄色
      borderColor: '#333333',
      borderWidth: '3px',
      imgs: [{ 
        src: wheelPrizes[4].imgUrl,
        width: '58%',
        height: '58%',

        rotate: true,
        clip: true
      }]
    }
  ],
  buttons: [{
    radius: '15%',
    background: '#617df2',
    pointer: true,
    fonts: [{ text: '开始\n抽奖', top: '-20px' }]
  }],
  defaultConfig: {
    gutter: '1%',
    stopRange: 0.8,
    speed: 15,
    accelerationTime: 2500,
    decelerationTime: 2500,
    startCallback: () => {
      console.log('开始旋转')
    },
    endCallback: (prize: any) => {
      console.log(`恭喜获得：${prize.name}`)
    }
  },
  defaultStyle: {
    fontSize: '14px',
    fontColor: '#000',
    fontWeight: '500',
    lineHeight: '18px',
    background: '#fff',
    shadow: '0 5px 10px rgba(0,0,0,0.1)',
    fontStyle: 'normal',
    fontVertical: false
  }
})
onMounted(() => {
  if (!wheelRef.value) return
  

  // 绑定点击事件
  myLucky.onStart = () => {
    startSpin()
  }
})

// 添加提示框状态管理
const notification = ref({
  show: false,
  message: '',
  type: 'info', // 'success', 'error', 'info', 'warning'
  timeout: 3000
})

// 添加确认框状态
const confirmDialog = ref({
  show: false,
  title: '',
  message: '',
  confirmCallback: () => {},
  cancelCallback: () => {}
})

// 显示提示框
const showNotification = (message: string, type: string = 'info', timeout: number = 3000) => {
  notification.value = {
    show: true,
    message,
    type,
    timeout
  }
  
  // 自动关闭
  if (timeout > 0) {
    setTimeout(() => {
      notification.value.show = false
    }, timeout)
  }
}

// 显示确认对话框
const showConfirmDialog = (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
  confirmDialog.value = {
    show: true,
    title,
    message,
    confirmCallback: () => {
      onConfirm();
      confirmDialog.value.show = false;
    },
    cancelCallback: () => {
      if (onCancel) onCancel();
      confirmDialog.value.show = false;
    }
  }
}

// 开始抽奖
const startSpin = () => {
  if (isSpinning.value || !myLucky) return
  if (userPoints.value < 888) {
    // 积分不足提示
    showNotification('积分不足，快去完成任务获得更多积分吧！', 'error')
    return
  }

  // 添加抽奖前的确认对话框
  showConfirmDialog(
    '确认抽奖',
    `确认花费 888 积分参与幸运抽奖？`,
    () => {
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
          // 替换 alert
          showNotification(`恭喜获得 ${wheelPrizes[selectedIndex].name}！`, 'success')
        }, 800)
      }, 2500)
    }
  )
}

// 兑换商品
const exchangeProduct = (product: typeof products.value[0]) => {
  if (userPoints.value < product.price) {
    // 替换 alert
    showNotification('积分不足，快去完成任务获得更多积分吧！', 'error')
    return
  }
  
  // 使用自定义确认对话框替代 confirm
  showConfirmDialog(
    '确认兑换',
    `确认使用 ${product.price} 积分兑换 ${product.name}？`,
    () => {
      userPoints.value -= product.price
      showNotification('兑换成功！', 'success')
    }
  )
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
  <div class="container-fluid px-4 py-6 overflow-x-hidden">
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
          <div class="lucky-wheel-wrapper">
            <LuckyWheel
                ref="myLucky"
                width="400px"
                height="400px"
                :prizes="luckyConfig.prizes"
                :blocks="luckyConfig.blocks"
                :buttons="luckyConfig.buttons"
                :default-config="luckyConfig.defaultConfig"></LuckyWheel>
          </div>
          
          <button class="btn btn-primary mt-6"
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

    <!-- 自定义提示框 -->
    <div v-if="notification.show" 
         class="notification-container"
         :class="notification.type">
      <div class="notification-content">
        <div class="notification-icon">
          <i class="fas" :class="{
            'fa-check-circle': notification.type === 'success',
            'fa-exclamation-circle': notification.type === 'error',
            'fa-info-circle': notification.type === 'info',
            'fa-exclamation-triangle': notification.type === 'warning'
          }"></i>
        </div>
        <div class="notification-message">{{ notification.message }}</div>
        <div class="notification-close" @click="notification.show = false">
          <i class="fas fa-times"></i>
        </div>
      </div>
    </div>

    <!-- 确认对话框 -->
    <div v-if="confirmDialog.show" class="confirm-dialog-overlay">
      <div class="confirm-dialog-container">
        <div class="confirm-dialog-header">
          <h3 class="confirm-dialog-title">{{ confirmDialog.title }}</h3>
          <div class="confirm-dialog-close" @click="confirmDialog.cancelCallback">
            <i class="fas fa-times"></i>
          </div>
        </div>
        <div class="confirm-dialog-body">
          {{ confirmDialog.message }}
          <div class="flex justify-between items-center mt-4 pb-2 border-t pt-2">
            <span class="font-medium">当前积分余额:</span>
            <span class="text-success font-bold">{{ userPoints }} 积分</span>
          </div>
        </div>
        <div class="confirm-dialog-footer">
          <button class="btn" @click="confirmDialog.cancelCallback">取消</button>
          <button class="btn btn-primary" @click="confirmDialog.confirmCallback">确认</button>
        </div>
      </div>
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

.lucky-wheel-wrapper {
  width: 400px;
  height: 400px;
  position: relative;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.lucky-wheel-container {
  width: 400px;
  height: 400px;
  position: relative;
  margin: 0 auto;
}

/* 自定义提示框样式 */
.notification-container {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 300px;
  max-width: 80%;
  padding: 1.2rem;
  border-radius: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  animation: slideInDown 0.3s ease-out;
}

.notification-container.success {
  background-color: rgba(72, 187, 120, 0.85);
  color: white;
  background-color: rgba(52, 152, 219, 0.85);
}

.notification-container.error {
  background-color: rgba(245, 101, 101, 0.85);
  color: white;
  background-color: rgba(231, 76, 60, 0.85);
}

.notification-container.info {
  background-color: rgba(66, 153, 225, 0.85);
  color: white;
}

.notification-container.warning {
  background-color: rgba(237, 137, 54, 0.85);
  color: white;
  background-color: rgba(243, 156, 18, 0.85);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-message {
  flex-grow: 1;
  font-size: 1rem;
  line-height: 1.5;
}

.notification-close {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.notification-close:hover {
  opacity: 1;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%);
  }
}

/* 确认对话框样式 */
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease-out;
}

.confirm-dialog-container {
  width: 90%;
  max-width: 400px;
  background-color: var(--color-base-100, white);
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: scaleIn 0.3s ease-out;
}

.confirm-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.confirm-dialog-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-primary, #4a5568);
}

.confirm-dialog-close {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.confirm-dialog-close:hover {
  opacity: 1;
}

.confirm-dialog-body {
  padding: 1.5rem;
  line-height: 1.5;
  color: var(--color-base-content, #2d3748);
  font-weight: 500;
}

.confirm-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style> 