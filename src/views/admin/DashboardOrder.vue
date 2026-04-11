<template>
  <div class="page-content">
    <h2>订单管理</h2>
    <div class="filter-bar">
      <div class="filter-item">
        <label>搜索：</label>
        <el-input
          v-model="orderSearch"
          placeholder="请输入订单号"
          clearable
          @clear="handleOrderSearchClear"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="filter-item">
        <label>状态：</label>
        <el-select
          v-model="orderStatus"
          placeholder="请选择状态"
          clearable
          @change="handleOrderStatusChange"
        >
          <el-option label="全部" value="" />
          <el-option label="待发货" value="待发货" />
          <el-option label="已发货" value="已发货" />
          <el-option label="已完成" value="已完成" />
          <el-option label="已取消" value="已取消" />
        </el-select>
      </div>
      <div class="filter-item">
        <label>日期：</label>
        <el-date-picker
          v-model="orderDate"
          type="date"
          placeholder="选择日期"
          clearable
          @change="handleOrderDateChange"
        />
      </div>
      <div class="filter-item">
        <label>催单：</label>
        <el-select
          v-model="orderUrgent"
          placeholder="催单状态"
          clearable
          @change="filterOrders"
        >
          <el-option label="全部" value="" />
          <el-option label="已催单" value="urgent" />
          <el-option label="未催单" value="not-urgent" />
        </el-select>
      </div>
    </div>

    <div class="sort-bar">
      <div class="sort-item">
        <label>排序：</label>
        <div class="sort-buttons">
          <div 
            class="sort-button"
            :class="{ active: sortOption === 'id-asc' }"
            @click="sortOption = 'id-asc'; filterOrders()"
          >
            <span class="sort-text">订单号升序</span>
          </div>
          <div 
            class="sort-button"
            :class="{ active: sortOption === 'id-desc' }"
            @click="sortOption = 'id-desc'; filterOrders()"
          >
            <span class="sort-text">订单号降序</span>
          </div>
          <div 
            class="sort-button"
            :class="{ active: sortOption === 'date-asc' }"
            @click="sortOption = 'date-asc'; filterOrders()"
          >
            <span class="sort-text">日期升序</span>
          </div>
          <div 
            class="sort-button"
            :class="{ active: sortOption === 'date-desc' }"
            @click="sortOption = 'date-desc'; filterOrders()"
          >
            <span class="sort-text">日期降序</span>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <el-table :data="filteredOrders" style="width: 100%">
        <el-table-column prop="id" label="订单号" width="0" />
        <el-table-column prop="customer" label="客户" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="催单" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.urgentCount > 0" type="danger">
              已催单 ({{ scope.row.urgentCount }})
            </el-tag>
            <span v-else style="color: #909399;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" @click="showOrderDetail(scope.row)">查看</el-button>
            <el-button
              v-if="scope.row.status === '待发货'"
              size="small"
              type="primary"
              @click="handleShip(scope.row)"
            >
              发货
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="date-drawer">
        <h3 class="date-drawer-title">日期筛选</h3>
        <div class="date-drawer-content">
          <div 
            class="date-drawer-item" 
            :class="{ active: dateFilter === '' }"
            @click="dateFilter = ''; filterOrders()"
          >
            <span class="date-drawer-text">全部</span>
          </div>
          <div 
            class="date-drawer-item"
            :class="{ active: dateFilter === '3days' }"
            @click="dateFilter = '3days'; filterOrders()"
          >
            <span class="date-drawer-text">最近三天</span>
          </div>
          <div 
            class="date-drawer-item"
            :class="{ active: dateFilter === '1week' }"
            @click="dateFilter = '1week'; filterOrders()"
          >
            <span class="date-drawer-text">最近一周</span>
          </div>
          <div 
            class="date-drawer-item"
            :class="{ active: dateFilter === '3months' }"
            @click="dateFilter = '3months'; filterOrders()"
          >
            <span class="date-drawer-text">近三个月</span>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="detailDialogVisible"
      title="订单详情"
      width="600px"
      :before-close="handleDialogClose"
    >
      <div v-if="detailLoading" class="loading-container">
        <el-progress :percentage="parseFloat(loadingPercentage.toFixed(2))" :stroke-width="8" />
        <p class="loading-text">正在加载订单详情...</p>
      </div>
      <div v-else-if="currentOrder">
        <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ currentOrder.id }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentOrder.status)">
            {{ currentOrder.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="下单日期">{{ currentOrder.date }}</el-descriptions-item>
        <el-descriptions-item label="商品数量">{{ currentOrder.itemCount }} 件</el-descriptions-item>
        <el-descriptions-item label="订单金额" :span="2">
          <span style="color: #f56c6c; font-size: 18px; font-weight: bold;">
            ¥{{ currentOrder.totalAmount }}
          </span>
        </el-descriptions-item>
      </el-descriptions>

      <h4 style="margin: 20px 0 10px; color: #303133;">商品列表</h4>
      <el-table :data="currentOrder?.items" border size="small">
        <el-table-column prop="productId" label="商品 ID" width="100" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="单价" width="80">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="折扣" width="80">
          <template #default="scope">
            {{ (scope.row.discount * 10).toFixed(1) }}折
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="80">
          <template #default="scope">
            {{ scope.row.quantity }} {{ scope.row.unit }}
          </template>
        </el-table-column>
        <el-table-column prop="subtotal" label="小计" width="100">
          <template #default="scope">
            <span style="color: #f56c6c;">¥{{ scope.row.subtotal }}</span>
          </template>
        </el-table-column>
      </el-table>
      </div>

      <template #footer>
        <el-button @click="handleDialogClose">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { updateOrderStatus } from '@/data/orders.js'

export default {
  name: 'DashboardOrder',
  components: { Search },
  props: {
    orders: { type: Array, default: () => [] }
  },
  emits: ['orderUpdated'],
  setup(props, { emit }) {
    const orderSearch = ref('')
    const orderStatus = ref('')
    const orderDate = ref(null)
    const orderUrgent = ref('')
    const dateFilter = ref('')
    const sortOption = ref('')
    const filteredOrders = ref([...props.orders])
    const detailDialogVisible = ref(false)
    const currentOrder = ref(null)
    const detailLoading = ref(false)
    const loadingPercentage = ref(false)
    let loadingTimer = null

    const startLoading = () => {
      detailLoading.value = true
      loadingPercentage.value = 0
      loadingTimer = setInterval(() => {
        if (loadingPercentage.value < 90) {
          loadingPercentage.value += Math.random() * 15
        }
      }, 100)
    }

    const stopLoading = () => {
      if (loadingTimer) {
        clearInterval(loadingTimer)
        loadingTimer = null
      }
      loadingPercentage.value = 100
      setTimeout(() => {
        detailLoading.value = false
      }, 200)
    }

    const handleDialogClose = () => {
      detailDialogVisible.value = false
    }

    const filterOrders = () => {
      let result = [...props.orders]

      // 搜索筛选
      if (orderSearch.value !== '') {
        result = result.filter(order =>
          order.id.toLowerCase().includes(orderSearch.value.toLowerCase()) ||
          order.customer.includes(orderSearch.value)
        )
      }

      // 状态筛选
      if (orderStatus.value !== '') {
        result = result.filter(order => order.status === orderStatus.value)
      }

      // 日期筛选
      if (orderDate.value !== null) {
        const selectedDate = formatDate(orderDate.value)
        result = result.filter(order => order.date === selectedDate)
      }

      // 催单筛选
      if (orderUrgent.value === 'urgent') {
        result = result.filter(order => order.urgentCount > 0)
      } else if (orderUrgent.value === 'not-urgent') {
        result = result.filter(order => order.urgentCount === 0 || !order.urgentCount)
      }

      // 日期范围筛选（书签）
      const now = new Date()
      if (dateFilter.value === '3days') {
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
        result = result.filter(order => new Date(order.createTime) >= threeDaysAgo)
      } else if (dateFilter.value === '1week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        result = result.filter(order => new Date(order.createTime) >= oneWeekAgo)
      } else if (dateFilter.value === '3months') {
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        result = result.filter(order => new Date(order.createTime) >= threeMonthsAgo)
      }

      // 排序
      if (sortOption.value) {
        const [field, order] = sortOption.value.split('-')
        result.sort((a, b) => {
          if (field === 'id') {
            return order === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
          } else if (field === 'date') {
            return order === 'asc'
              ? new Date(a.createTime) - new Date(b.createTime)
              : new Date(b.createTime) - new Date(a.createTime)
          }
          return 0
        })
      }

      filteredOrders.value = result
    }

    const formatDate = (date) => {
      if (!date) return ''
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const getStatusType = (status) => {
      const statusMap = {
        '待发货': 'warning',
        '已发货': 'primary',
        '已完成': 'success',
        '已取消': 'danger'
      }
      return statusMap[status] || 'info'
    }

    const handleOrderSearchClear = () => {
      orderSearch.value = ''
      filterOrders()
    }

    const handleOrderStatusChange = () => {
      filterOrders()
    }

    const handleOrderDateChange = () => {
      filterOrders()
    }

    const handleShip = (order) => {
      const success = updateOrderStatus(order.id, '已发货')
      if (success) {
        order.status = '已发货'
        ElMessage.success('订单已发货')
        emit('orderUpdated')
      } else {
        ElMessage.error('发货失败')
      }
    }

    const showOrderDetail = (order) => {
      currentOrder.value = order
      detailDialogVisible.value = true
      startLoading()
      setTimeout(() => {
        stopLoading()
      }, 500)
    }

    watch(() => props.orders, () => {
      filterOrders()
    }, { immediate: true, deep: true })

    watch(orderSearch, () => { filterOrders() })

    return {
      orderSearch,
      orderStatus,
      orderDate,
      orderUrgent,
      dateFilter,
      sortOption,
      filteredOrders,
      getStatusType,
      handleOrderSearchClear,
      handleOrderStatusChange,
      handleOrderDateChange,
      filterOrders,
      handleShip,
      detailDialogVisible,
      currentOrder,
      showOrderDetail,
      detailLoading,
      loadingPercentage,
      handleDialogClose
    }
  }
}
</script>

<style scoped>
.page-content h2 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.main-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.main-content > .el-table {

  flex: 1;
  min-width: 0;
}

.date-drawer {
  width: 200px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: sticky;
  top: 20px;
}

.date-drawer-title {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.date-drawer-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-drawer-item {
  position: relative;
  padding: 12px 16px;
  background: #f5f7fa;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.date-drawer-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: transparent;
  transition: all 0.3s ease;
}

.date-drawer-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.date-drawer-item:hover {
  background: #ecf5ff;
  color: #409eff;
  transform: translateX(-2px);
}

.date-drawer-item:hover::before {
  background: #409eff;
}

.date-drawer-item:hover::after {
  opacity: 1;
}

.date-drawer-item.active {
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  transform: translateX(-2px);
}

.date-drawer-item.active::before {
  background: #409eff;
  width: 4px;
}

.date-drawer-item.active::after {
  opacity: 1;
}

.date-drawer-text {
  position: relative;
  z-index: 1;
  display: inline-block;
  padding: 0 4px;
}

.filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.filter-item label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
  min-width: 60px;
}

.sort-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  align-items: center;
}

.sort-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.sort-item label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.sort-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sort-button {
  position: relative;
  padding: 10px 18px;
  background: #f5f7fa;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.sort-button::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: transparent;
  transition: all 0.3s ease;
}

.sort-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.sort-button:hover {
  background: #ecf5ff;
  color: #409eff;
  transform: translateX(-2px);
}

.sort-button:hover::before {
  background: #409eff;
}

.sort-button:hover::after {
  opacity: 1;
}

.sort-button.active {
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  transform: translateX(-2px);
}

.sort-button.active::before {
  background: #409eff;
  width: 4px;
}

.sort-button.active::after {
  opacity: 1;
}

.sort-text {
  position: relative;
  z-index: 1;
  display: inline-block;
  padding: 0 4px;
  white-space: nowrap;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-text {
  margin-top: 20px;
  color: #909399;
  font-size: 14px;
}
</style>
