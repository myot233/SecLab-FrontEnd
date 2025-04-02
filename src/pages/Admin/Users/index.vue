<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { User } from '../../../types/user'

// 用户列表数据
const users = ref<User[]>([
  {
    userId: 1,
    userStudentNumber: '2021123456789',
    userName: '林宗恒',
    userEmail: 'linzh@example.com',
    userTel: '13800138000',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:00:00'
  },
  {
    userId: 2,
    userStudentNumber: '2021123456790',
    userName: '陈思远',
    userEmail: 'chensy@example.com',
    userTel: '13800138001',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 1,
    createTime: '2024-03-15 10:01:00'
  },
  {
    userId: 3,
    userStudentNumber: '2021123456791',
    userName: '张雨晨',
    userEmail: 'zhangyc@example.com',
    userTel: '13800138002',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 0,
    createTime: '2024-03-15 10:02:00'
  },
  {
    userId: 4,
    userStudentNumber: '2021123456792',
    userName: '王浩宇',
    userEmail: 'wanghy@example.com',
    userTel: '13800138003',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:03:00'
  },
  {
    userId: 5,
    userStudentNumber: '2021123456793',
    userName: '李梓萱',
    userEmail: 'lizx@example.com',
    userTel: '13800138004',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 0,
    createTime: '2024-03-15 10:04:00'
  },
  {
    userId: 6,
    userStudentNumber: '2021123456794',
    userName: '刘子轩',
    userEmail: 'liuzx@example.com',
    userTel: '13800138005',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:05:00'
  },
  {
    userId: 7,
    userStudentNumber: '2021123456795',
    userName: '周雪莹',
    userEmail: 'zhouxy@example.com',
    userTel: '13800138006',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 0,
    createTime: '2024-03-15 10:06:00'
  },
  {
    userId: 8,
    userStudentNumber: '2021123456796',
    userName: '吴承远',
    userEmail: 'wucy@example.com',
    userTel: '13800138007',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 1,
    createTime: '2024-03-15 10:07:00'
  },
  {
    userId: 9,
    userStudentNumber: '2021123456797',
    userName: '郑博文',
    userEmail: 'zhengbw@example.com',
    userTel: '13800138008',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:08:00'
  },
  {
    userId: 10,
    userStudentNumber: '2021123456798',
    userName: '黄语嫣',
    userEmail: 'huangyy@example.com',
    userTel: '13800138009',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 0,
    createTime: '2024-03-15 10:09:00'
  },
  {
    userId: 11,
    userStudentNumber: '2021123456799',
    userName: '杨晓东',
    userEmail: 'yangxd@example.com',
    userTel: '13800138010',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 1,
    createTime: '2024-03-15 10:10:00'
  },
  {
    userId: 12,
    userStudentNumber: '2021123456800',
    userName: '朱天宇',
    userEmail: 'zhuty@example.com',
    userTel: '13800138011',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:11:00'
  },
  {
    userId: 13,
    userStudentNumber: '2021123456801',
    userName: '赵雨欣',
    userEmail: 'zhaoyx@example.com',
    userTel: '13800138012',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 0,
    createTime: '2024-03-15 10:12:00'
  },
  {
    userId: 14,
    userStudentNumber: '2021123456802',
    userName: '孙志远',
    userEmail: 'sunzy@example.com',
    userTel: '13800138013',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 1,
    createTime: '2024-03-15 10:13:00'
  },
  {
    userId: 15,
    userStudentNumber: '2021123456803',
    userName: '徐晨阳',
    userEmail: 'xucy@example.com',
    userTel: '13800138014',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:14:00'
  },
  {
    userId: 16,
    userStudentNumber: '2021123456804',
    userName: '马思琪',
    userEmail: 'masq@example.com',
    userTel: '13800138015',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 0,
    createTime: '2024-03-15 10:15:00'
  },
  {
    userId: 17,
    userStudentNumber: '2021123456805',
    userName: '胡宇轩',
    userEmail: 'huyx@example.com',
    userTel: '13800138016',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 1,
    createTime: '2024-03-15 10:16:00'
  },
  {
    userId: 18,
    userStudentNumber: '2021123456806',
    userName: '林雨晴',
    userEmail: 'linyq@example.com',
    userTel: '13800138017',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 0,
    createTime: '2024-03-15 10:17:00'
  },
  {
    userId: 19,
    userStudentNumber: '2021123456807',
    userName: '王子豪',
    userEmail: 'wangzh@example.com',
    userTel: '13800138018',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:18:00'
  },
  {
    userId: 20,
    userStudentNumber: '2021123456808',
    userName: '陈梓涵',
    userEmail: 'chenzh@example.com',
    userTel: '13800138019',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 0,
    createTime: '2024-03-15 10:19:00'
  },
  {
    userId: 21,
    userStudentNumber: '2021123456809',
    userName: '张浩然',
    userEmail: 'zhanghr@example.com',
    userTel: '13800138020',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:20:00'
  },
  {
    userId: 22,
    userStudentNumber: '2021123456810',
    userName: '李思源',
    userEmail: 'lisy@example.com',
    userTel: '13800138021',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:21:00'
  },
  {
    userId: 23,
    userStudentNumber: '2021123456811',
    userName: '刘雨菲',
    userEmail: 'liuyf@example.com',
    userTel: '13800138022',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 0,
    createTime: '2024-03-15 10:22:00'
  },
  {
    userId: 24,
    userStudentNumber: '2021123456812',
    userName: '周子涵',
    userEmail: 'zhouzh@example.com',
    userTel: '13800138023',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 0,
    createTime: '2024-03-15 10:23:00'
  },
  {
    userId: 25,
    userStudentNumber: '2021123456813',
    userName: '吴承轩',
    userEmail: 'wucx@example.com',
    userTel: '13800138024',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:24:00'
  },
  {
    userId: 26,
    userStudentNumber: '2021123456814',
    userName: '郑雨泽',
    userEmail: 'zhengyz@example.com',
    userTel: '13800138025',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 1,
    createTime: '2024-03-15 10:25:00'
  },
  {
    userId: 27,
    userStudentNumber: '2021123456815',
    userName: '黄子轩',
    userEmail: 'huangzx@example.com',
    userTel: '13800138026',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:26:00'
  },
  {
    userId: 28,
    userStudentNumber: '2021123456816',
    userName: '杨雨欣',
    userEmail: 'yangyx@example.com',
    userTel: '13800138027',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 0,
    createTime: '2024-03-15 10:27:00'
  },
  {
    userId: 29,
    userStudentNumber: '2021123456817',
    userName: '朱思远',
    userEmail: 'zhusy@example.com',
    userTel: '13800138028',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 1,
    createTime: '2024-03-15 10:28:00'
  },
  {
    userId: 30,
    userStudentNumber: '2021123456818',
    userName: '赵雨晨',
    userEmail: 'zhaoyc@example.com',
    userTel: '13800138029',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 0,
    createTime: '2024-03-15 10:29:00'
  },
  {
    userId: 31,
    userStudentNumber: '2021123456819',
    userName: '孙浩宇',
    userEmail: 'sunhy@example.com',
    userTel: '13800138030',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:30:00'
  },
  {
    userId: 32,
    userStudentNumber: '2021123456820',
    userName: '徐梓萱',
    userEmail: 'xuzx@example.com',
    userTel: '13800138031',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 0,
    createTime: '2024-03-15 10:31:00'
  },
  {
    userId: 33,
    userStudentNumber: '2021123456821',
    userName: '马子轩',
    userEmail: 'mazx@example.com',
    userTel: '13800138032',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:32:00'
  },
  {
    userId: 34,
    userStudentNumber: '2021123456822',
    userName: '胡雪莹',
    userEmail: 'huxy@example.com',
    userTel: '13800138033',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 0,
    createTime: '2024-03-15 10:33:00'
  },
  {
    userId: 35,
    userStudentNumber: '2021123456823',
    userName: '林承远',
    userEmail: 'lincy@example.com',
    userTel: '13800138034',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 1,
    createTime: '2024-03-15 10:34:00'
  },
  {
    userId: 36,
    userStudentNumber: '2021123456824',
    userName: '王博文',
    userEmail: 'wangbw@example.com',
    userTel: '13800138035',
    userAcademy: '信息工程学院',
    userClass: '信息安全1班',
    userGender: 1,
    createTime: '2024-03-15 10:35:00'
  },
  {
    userId: 37,
    userStudentNumber: '2021123456825',
    userName: '陈语嫣',
    userEmail: 'chenyy@example.com',
    userTel: '13800138036',
    userAcademy: '网络空间安全学院',
    userClass: '网络安全1班',
    userGender: 0,
    createTime: '2024-03-15 10:36:00'
  },
  {
    userId: 38,
    userStudentNumber: '2021123456826',
    userName: '张晓东',
    userEmail: 'zhangxd@example.com',
    userTel: '13800138037',
    userAcademy: '计算机科学与技术学院',
    userClass: '网络安全2班',
    userGender: 1,
    createTime: '2024-03-15 10:37:00'
  }
])

// 搜索和筛选条件
const filters = ref({
  search: '',
  academy: '',
  class: '',
  gender: ''
})

// 分页
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: computed(() => filteredUsers.value.length)
})

// 计算当前页显示的用户
const currentPageUsers = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredUsers.value.slice(start, end)
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(pagination.value.total / pagination.value.pageSize)
})

// 页码数组
const pageNumbers = computed(() => {
  const current = pagination.value.current
  const total = totalPages.value
  const pages = []

  if (total <= 7) {
    // 如果总页数小于等于7，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 如果总页数大于7，使用省略号显示
    if (current <= 3) {
      // 当前页靠近开始
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      // 当前页靠近结束
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      // 当前页在中间
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  return pages
})

// 处理页码变化
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    pagination.value.current = page
  }
}

// 处理每页显示数量变化
const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const size = parseInt(target.value)
  pagination.value.pageSize = size
  pagination.value.current = 1
}

// 学院列表
const academies = ['计算机科学与技术学院', '信息工程学院', '网络空间安全学院']

// 班级列表
const classes = ['网络安全1班', '网络安全2班', '信息安全1班']

// 过滤后的用户列表
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    if (filters.value.search && !user.userName.includes(filters.value.search) && !user.userStudentNumber.includes(filters.value.search)) {
      return false
    }
    if (filters.value.academy && user.userAcademy !== filters.value.academy) {
      return false
    }
    if (filters.value.class && user.userClass !== filters.value.class) {
      return false
    }
    if (filters.value.gender && user.userGender !== parseInt(filters.value.gender)) {
      return false
    }
    return true
  })
})

// 添加加载状态
const loading = ref(false)

// 添加错误状态
const error = ref<string | null>(null)

// 获取用户数据的方法
const fetchUsers = async () => {
  try {
    loading.value = true
    // TODO: 替换为实际的API调用
    // const response = await api.getUsers()
    // users.value = response.data
  } catch (err) {
    error.value = '获取用户数据失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  fetchUsers()
})

// 清理工作
onUnmounted(() => {
  users.value = []
  error.value = null
})

// 处理用户操作
const handleEdit = (user: User) => {
  // TODO: 实现编辑功能
  console.log('编辑用户:', user)
}

const handleDelete = (user: User) => {
  // TODO: 实现删除功能
  console.log('删除用户:', user)
}

const handleResetPassword = (user: User) => {
  // TODO: 实现重置密码功能
  console.log('重置密码:', user)
}
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <div class="container mx-auto p-4">
      <!-- 页面标题 -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">用户管理</h1>
        <button class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          添加用户
        </button>
      </div>

      <!-- 搜索和筛选 -->
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- 搜索框 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">搜索</span>
              </label>
              <input type="text" class="input input-bordered" placeholder="搜索用户名或学号" v-model="filters.search" />
            </div>

            <!-- 学院筛选 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">学院</span>
              </label>
              <select class="select select-bordered" v-model="filters.academy">
                <option value="">全部</option>
                <option v-for="academy in academies" :key="academy" :value="academy">
                  {{ academy }}
                </option>
              </select>
            </div>

            <!-- 班级筛选 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">班级</span>
              </label>
              <select class="select select-bordered" v-model="filters.class">
                <option value="">全部</option>
                <option v-for="class_ in classes" :key="class_" :value="class_">
                  {{ class_ }}
                </option>
              </select>
            </div>

            <!-- 性别筛选 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">性别</span>
              </label>
              <select class="select select-bordered" v-model="filters.gender">
                <option value="">全部</option>
                <option value="1">男</option>
                <option value="0">女</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加加载和错误状态显示 -->
      <div v-if="loading" class="text-center py-4">
        <div class="loading loading-spinner loading-lg"></div>
      </div>
      <div v-else-if="error" class="text-center py-4 text-error">
        {{ error }}
      </div>

      <!-- 优化后的用户列表表格 -->
      <div v-else class="card bg-base-100 shadow-xl">
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead class="bg-base-200">
                <tr>
                  <th class="whitespace-nowrap">学号</th>
                  <th class="whitespace-nowrap">姓名</th>
                  <th class="whitespace-nowrap">邮箱</th>
                  <th class="whitespace-nowrap">电话</th>
                  <th class="whitespace-nowrap">学院</th>
                  <th class="whitespace-nowrap">班级</th>
                  <th class="whitespace-nowrap">性别</th>
                  <th class="whitespace-nowrap">注册时间</th>
                  <th class="whitespace-nowrap text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in currentPageUsers" :key="user.userId" class="hover">
                  <td class="whitespace-nowrap">{{ user.userStudentNumber }}</td>
                  <td class="whitespace-nowrap">{{ user.userName }}</td>
                  <td class="whitespace-nowrap">{{ user.userEmail }}</td>
                  <td class="whitespace-nowrap">{{ user.userTel }}</td>
                  <td class="whitespace-nowrap max-w-[200px] truncate" :title="user.userAcademy">
                    {{ user.userAcademy }}
                  </td>
                  <td class="whitespace-nowrap">{{ user.userClass }}</td>
                  <td class="whitespace-nowrap">
                    <span :class="user.userGender === 1 ? 'text-blue-500' : 'text-pink-500'">
                      {{ user.userGender === 1 ? '男' : '女' }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap">{{ user.createTime }}</td>
                  <td class="whitespace-nowrap">
                    <div class="flex justify-center gap-2">
                      <button class="btn btn-xs btn-ghost" @click="handleEdit(user)">编辑</button>
                      <button class="btn btn-xs btn-ghost text-warning" @click="handleResetPassword(user)">重置密码</button>
                      <button class="btn btn-xs btn-ghost text-error" @click="handleDelete(user)">删除</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 分页控件 -->
          <div class="flex flex-col sm:flex-row justify-between items-center p-4 bg-base-100 gap-4">
            <div class="text-sm text-base-content/60">
              共 {{ pagination.total }} 条记录，每页
              <select v-model="pagination.pageSize" class="select select-bordered select-sm mx-1" @change="handlePageSizeChange">
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              条
            </div>
            <div class="join">
              <button class="join-item btn btn-sm" :disabled="pagination.current === 1" @click="handlePageChange(pagination.current - 1)">«</button>
              <template v-for="page in pageNumbers" :key="page">
                <button v-if="page === '...'" class="join-item btn btn-sm btn-disabled">...</button>
                <button v-else class="join-item btn btn-sm" :class="{ 'btn-active': page === pagination.current }" @click="handlePageChange(Number(page))">
                  {{ page }}
                </button>
              </template>
              <button class="join-item btn btn-sm" :disabled="pagination.current === totalPages" @click="handlePageChange(pagination.current + 1)">»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 基础布局样式 */
.container {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  overflow-y: auto;
}

/* 表格容器样式 */
.card {
  margin-bottom: 1.5rem;
  overflow: visible;
}

.card-body {
  overflow: visible;
}

.overflow-x-auto {
  overflow-x: none;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
}

/* 表格样式优化 */
.table {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.table th {
  background-color: hsl(var(--b2));
  color: hsl(var(--bc) / 0.7);
  font-weight: 500;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table td {
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.3s ease;
}

/* 动画效果 */
.table tr {
  transition: all 0.3s ease;
}

.table tr:hover td {
  background-color: hsl(var(--b2) / 0.5);
  transform: translateX(4px);
}

/* 按钮样式 */
.btn-xs {
  min-height: 0;
  height: 1.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

/* 确保内容不换行 */
.whitespace-nowrap {
  white-space: nowrap;
}

/* 添加过渡效果 */
.hover {
  transition: all 0.3s ease;
}

/* 表格紧凑样式 */
.table-compact th,
.table-compact td {
  padding: 0.5rem;
}

/* 表格斑马纹 */
.table-zebra tbody tr:nth-child(even) {
  background-color: hsl(var(--b2) / 0.3);
}

/* 性别标记颜色 */
.gender-male {
  color: #3b82f6;
  transition: all 0.3s ease;
}

.gender-female {
  color: #ec4899;
  transition: all 0.3s ease;
}

/* 添加表格内容悬停效果 */
.table td > * {
  transition: all 0.3s ease;
}

.table tr:hover td > * {
  transform: scale(1.02);
}
</style>
