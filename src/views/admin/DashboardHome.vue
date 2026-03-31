<template>
  <div class="dashboard-content">
    <h1>欢迎回来，{{ currentUser }}！</h1>
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon" style="background: #409eff;">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ users.length }}</div>
          <div class="stat-label">用户总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: #67c23a;">
          <el-icon><Goods /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ products.length }}</div>
          <div class="stat-label">产品数量</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: #e6a23c;">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ orders.length }}</div>
          <div class="stat-label">订单总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: #f56c6c;">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-number">¥{{ totalRevenue }}</div>
          <div class="stat-label">今日收入</div>
        </div>
      </div>
    </div>

    <div class="overview-sections">
      <div class="overview-section">
        <div class="section-header">
          <h3>商品管理总览</h3>
          <el-button size="small" type="primary" @click="$emit('navigate', 'product')">查看全部</el-button>
        </div>
        <el-table :data="products.slice(0, 5)" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="产品名称" width="150" />
          <el-table-column prop="price" label="价格" width="100">
            <template #default="scope">
              ¥{{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.stock > 50 ? 'success' : scope.row.stock > 20 ? 'warning' : 'danger'">
                {{ scope.row.stock }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" width="120">
            <template #default="scope">
              {{ getCategoryName(scope.row.category) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default>
              <el-button size="small" @click="$emit('navigate', 'product')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="overview-section">
        <div class="section-header">
          <h3>用户管理总览</h3>
          <el-button size="small" type="primary" @click="$emit('navigate', 'user')">查看全部</el-button>
        </div>
        <el-table :data="users.slice(0, 5)" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="email" label="邮箱" width="180" />
          <el-table-column prop="role" label="角色" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.role === '管理员' ? 'danger' : 'primary'">
                {{ scope.row.role }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '正常' ? 'success' : 'info'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default>
              <el-button size="small" @click="$emit('navigate', 'user')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { User, Goods, Document, Money } from '@element-plus/icons-vue'
import { products as productsData, categories as categoriesData } from '../../data/products'

export default {
  name: 'DashboardHome',
  components: { User, Goods, Document, Money },
  props: {
    currentUser: { type: String, default: '' },
    users: { type: Array, default: () => [] },
    orders: { type: Array, default: () => [] }
  },
  emits: ['navigate'],
  setup(props) {
    const products = productsData
    const categories = categoriesData

    const getCategoryName = (categoryId) => {
      const category = categories.find(c => c.id === categoryId)
      return category ? category.name : categoryId
    }

    const totalRevenue = computed(() => {
      return props.orders.reduce((sum, o) => sum + (o.amount || 0), 0).toFixed(2)
    })

    return { products, getCategoryName, totalRevenue }
  }
}
</script>

<style scoped>
.dashboard-content h1 {
  margin: 0 0 30px 0;
  color: #303133;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: #fff;
  font-size: 28px;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.overview-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.overview-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;
}

.section-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}
</style>
