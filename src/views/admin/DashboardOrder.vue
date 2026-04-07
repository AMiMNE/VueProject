<template>
  <div class="page-content">
    <h2>订单管理</h2>
    <div class="filter-bar">
      <div class="filter-item">
        <label>搜索：</label>
        <el-input
          v-model="orderSearch"
          placeholder="请输入订单号或客户名"
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
    </div>
    <el-table :data="filteredOrders" style="width: 100%">
      <el-table-column prop="id" label="订单号" width="120" />
      <el-table-column prop="customer" label="客户" width="120" />
      <el-table-column prop="amount" label="金额" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column label="操作">
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

    <el-dialog
      v-model="detailDialogVisible"
      title="订单详情"
      width="600px"
    >
      <el-descriptions :column="2" border v-if="currentOrder">
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

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'DashboardOrder',
  components: { Search },
  props: {
    orders: { type: Array, default: () => [] }
  },
  setup(props) {
    const orderSearch = ref('')
    const orderStatus = ref('')
    const orderDate = ref(null)
    const filteredOrders = ref([...props.orders])
    const detailDialogVisible = ref(false)
    const currentOrder = ref(null)

    const filterOrders = () => {
      filteredOrders.value = props.orders.filter(order => {
        const matchSearch = orderSearch.value === '' ||
          order.id.toLowerCase().includes(orderSearch.value.toLowerCase()) ||
          order.customer.includes(orderSearch.value)
        const matchStatus = orderStatus.value === '' ||
          order.status === orderStatus.value
        const matchDate = orderDate.value === null ||
          order.date === formatDate(orderDate.value)
        return matchSearch && matchStatus && matchDate
      })
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
      order.status = '已发货'
      ElMessage.success('订单已发货')
    }

    const showOrderDetail = (order) => {
      currentOrder.value = order
      detailDialogVisible.value = true
    }

    watch(orderSearch, () => { filterOrders() }, { immediate: true })

    return {
      orderSearch,
      orderStatus,
      orderDate,
      filteredOrders,
      getStatusType,
      handleOrderSearchClear,
      handleOrderStatusChange,
      handleOrderDateChange,
      handleShip,
      detailDialogVisible,
      currentOrder,
      showOrderDetail
    }
  }
}
</script>

<style scoped>
.page-content h2 {
  margin: 0 0 20px 0;
  color: #303133;
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
</style>
