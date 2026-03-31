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
        <template #default>
          <el-button size="small">查看</el-button>
          <el-button size="small" type="primary">发货</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

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

    watch(orderSearch, () => { filterOrders() }, { immediate: true })

    return {
      orderSearch,
      orderStatus,
      orderDate,
      filteredOrders,
      getStatusType,
      handleOrderSearchClear,
      handleOrderStatusChange,
      handleOrderDateChange
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
