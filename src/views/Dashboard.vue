<template>
  <div class="dashboard-container">
    <el-container class="layout-container">
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>管理系统</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="user">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="product">
            <el-icon><Goods /></el-icon>
            <span>产品管理</span>
          </el-menu-item>
          <el-menu-item index="order">
            <el-icon><Document /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header">
          <div class="header-left">
            <el-button text @click="toggleSidebar">
              <el-icon><Fold /></el-icon>
            </el-button>
          </div>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-icon><Avatar /></el-icon>
                {{ currentUser }}
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                  <el-dropdown-item command="settings">设置</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="main-content">
          <div class="content-wrapper">
            <DashboardHome
              v-if="activeMenu === 'dashboard'"
              :current-user="currentUser"
              :users="users"
              :orders="orders"
              @navigate="handleMenuSelect"
            />
            <DashboardManageUser
              v-else-if="activeMenu === 'user'"
              :users="users"
              :current-user="currentUser"
            />
            <DashboardProduct
              v-else-if="activeMenu === 'product'"
            />
            <DashboardOrder
              v-else-if="activeMenu === 'order'"
              :orders="orders"
            />
            <DashboardSettings
              v-else-if="activeMenu === 'settings'"
            />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  HomeFilled,
  User,
  Goods,
  Document,
  Setting,
  Fold,
  Avatar,
  ArrowDown
} from '@element-plus/icons-vue'
import DashboardHome from './admin/DashboardHome.vue'
import DashboardManageUser from './admin/DashboardManageUser.vue'
import DashboardProduct from './admin/DashboardProduct.vue'
import DashboardOrder from './admin/DashboardOrder.vue'
import DashboardSettings from './admin/DashboardSettings.vue'

export default {
  name: 'Dashboard',
  components: {
    HomeFilled,
    User,
    Goods,
    Document,
    Setting,
    Fold,
    Avatar,
    ArrowDown,
    DashboardHome,
    DashboardManageUser,
    DashboardProduct,
    DashboardOrder,
    DashboardSettings
  },
  setup() {
    const router = useRouter()
    const activeMenu = ref('dashboard')
    const currentUser = ref('')
    const isCollapsed = ref(false)

    const users = ref([
      // 管理员
      { id: 'A001', username: 'admin', phone: '13800138000', role: '管理员', status: '正常' },
      { id: 'A002', username: 'admin2', phone: '13800138001', role: '管理员', status: '正常' },
      { id: 'A003', username: 'admin3', phone: '13800138002', role: '管理员', status: '禁用' },
      
      // 用户
      { id: 'U001', username: 'user', phone: '13900139000', role: '用户', status: '正常' },
      { id: 'U002', username: 'test', phone: '13700137000', role: '用户', status: '禁用' },
      { id: 'U003', username: 'zhangsan', phone: '13600136000', role: '用户', status: '正常' },
      { id: 'U004', username: 'lisi', phone: '13500135000', role: '用户', status: '正常' },
      { id: 'U005', username: 'wangwu', phone: '13400134000', role: '用户', status: '正常' },
      { id: 'U006', username: 'zhaoliu', phone: '13300133000', role: '用户', status: '正常' },
      { id: 'U007', username: 'sunqi', phone: '13200132000', role: '用户', status: '禁用' },
      { id: 'U008', username: 'zhouba', phone: '13100131000', role: '用户', status: '正常' },
      { id: 'U009', username: 'wujiu', phone: '13000130000', role: '用户', status: '正常' },
      { id: 'U010', username: 'shiyi', phone: '12900129000', role: '用户', status: '正常' }
    ])

    const orders = ref([
      {
        id: 'ORD001',
        customer: '张三',
        amount: 199.99,
        status: '待发货',
        date: '2024-01-15',
        totalAmount: '199.99',
        itemCount: 8,
        items: [
          { productId: 'P001', name: '农夫山泉', price: 2.00, discount: 1, quantity: 50, unit: '瓶', subtotal: '100.00' },
          { productId: 'P002', name: '可口可乐', price: 3.00, discount: 0.95, quantity: 35, unit: '瓶', subtotal: '99.75' }
        ]
      },
      {
        id: 'ORD002',
        customer: '李四',
        amount: 99.99,
        status: '已发货',
        date: '2024-01-14',
        totalAmount: '99.99',
        itemCount: 5,
        items: [
          { productId: 'P005', name: '乐事薯片', price: 6.50, discount: 1, quantity: 10, unit: '袋', subtotal: '65.00' },
          { productId: 'P013', name: '伊利纯牛奶', price: 12.00, discount: 0.95, quantity: 3, unit: '箱', subtotal: '34.20' }
        ]
      },
      {
        id: 'ORD003',
        customer: '王五',
        amount: 299.99,
        status: '已完成',
        date: '2024-01-13',
        totalAmount: '299.99',
        itemCount: 15,
        items: [
          { productId: 'P011', name: '新鲜鸡蛋', price: 15.00, discount: 1, quantity: 10, unit: '盒', subtotal: '150.00' },
          { productId: 'P012', name: '新鲜西红柿', price: 4.50, discount: 1, quantity: 20, unit: '斤', subtotal: '90.00' },
          { productId: 'P003', name: '康师傅冰红茶', price: 3.50, discount: 1, quantity: 15, unit: '瓶', subtotal: '52.50' }
        ]
      }
    ])

    onMounted(() => {
      const username = localStorage.getItem('username')
      currentUser.value = username || '用户'
    })

    const handleMenuSelect = (index) => {
      activeMenu.value = index
    }

    const handleCommand = (command) => {
      if (command === 'logout') {
        localStorage.removeItem('username')
        router.push('/login')
      } else if (command === 'profile') {
        alert('个人信息功能开发中...')
      } else if (command === 'settings') {
        activeMenu.value = 'settings'
      }
    }

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
    }

    return {
      activeMenu,
      currentUser,
      users,
      orders,
      handleMenuSelect,
      handleCommand,
      toggleSidebar
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
  width: 100%;
}

.layout-container {
  height: 100%;
}

.sidebar {
  background-color: #304156;
  color: #fff;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #2b3a4a;
  color: #fff;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-menu {
  border-right: none;
  background-color: #304156;
}

.sidebar-menu .el-menu-item {
  color: #fff;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #263445;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #409eff;
  color: #fff;
}

.sidebar-menu .el-menu-item .el-icon {
  color: #fff;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

.header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  font-size: 14px;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

.content-wrapper {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  min-height: calc(100vh - 140px);
}
</style>
