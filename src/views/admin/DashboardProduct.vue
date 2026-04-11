<template>
  <div class="page-content">
    <h2>产品管理</h2>
    <div class="filter-bar">
      <div class="filter-left">
        <div class="filter-item">
          <label>搜索：</label>
          <el-input
            v-model="productSearch"
            placeholder="请输入产品名称或 ID"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="filter-item">
          <label>分类：</label>
          <el-select
            v-model="productCategory"
            placeholder="请选择分类"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label>状态：</label>
          <el-button-group class="status-button-group">
            <el-button 
              :type="productStatus === '' ? 'primary' : 'default'"
              @click="productStatus = ''"
              :plain="productStatus !== ''"
            >
              <el-icon><CircleCheckFilled /></el-icon>
              <span>全部</span>
            </el-button>
            <el-button 
              :type="productStatus === 'onshelf' ? 'success' : 'default'"
              @click="productStatus = 'onshelf'"
              :plain="productStatus !== 'onshelf'"
            >
              <el-icon><UploadFilled /></el-icon>
              <span>上架中</span>
            </el-button>
            <el-button 
              :type="productStatus === 'offshelf' ? 'danger' : 'default'"
              @click="productStatus = 'offshelf'"
              :plain="productStatus !== 'offshelf'"
            >
              <el-icon><DeleteFilled /></el-icon>
              <span>已下架</span>
            </el-button>
          </el-button-group>
        </div>
      </div>
      <div class="filter-right">
        <el-button-group>
          <el-button :type="viewMode === 'large' ? 'primary' : 'default'" @click="viewMode = 'large'">
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button :type="viewMode === 'small' ? 'primary' : 'default'" @click="viewMode = 'small'">
            <el-icon><List /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="category-bar">
      <div class="category-scroll">
        <div 
          class="category-item" 
          :class="{ active: productCategory === '' }"
          @click="productCategory = ''"
        >
          <span class="category-text">全部</span>
        </div>
        <div 
          v-for="cat in categories" 
          :key="cat.id"
          class="category-item"
          :class="{ active: productCategory === cat.id }"
          @click="productCategory = cat.id"
        >
          <span class="category-text">{{ cat.name }}</span>
        </div>
      </div>
    </div>
    <div class="product-grid" :class="{ 'small-mode': viewMode === 'small' }">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="product-card"
        :class="{ 'offshelf': product.status === 'offshelf' }"
      >
        <div class="product-image">
          <img v-if="product.image" :src="product.image" :alt="product.name" />
          <el-icon v-else><Goods /></el-icon>
        </div>
        <div class="product-info">
          <div class="product-id">ID: {{ product.id }}</div>
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">¥{{ product.price }}/{{ product.unit }}</div>
          <div class="product-stock">
            <el-tag :type="product.stock > 50 ? 'success' : product.stock > 20 ? 'warning' : 'danger'" size="small">
              库存: {{ product.stock }}
            </el-tag>
          </div>
          <div class="product-category">
            <el-tag type="info" size="small">
              {{ getCategoryName(product.category) }}
            </el-tag>
          </div>
        </div>
        <div class="product-actions">
          <el-button size="small" type="primary" @click="showProductDetail(product)">详情</el-button>
          <el-button 
            v-if="product.status !== 'offshelf'"
            size="small" 
            type="success" 
            @click="toggleProductStatus(product, 'offshelf')"
          >
            下架
          </el-button>
          <el-button 
            v-else
            size="small" 
            type="warning" 
            @click="toggleProductStatus(product, 'onshelf')"
          >
            上架
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog v-model="detailDialogVisible" title="产品详情" width="700px" class="product-detail-dialog">
      <div v-if="selectedProduct" class="product-detail">
        <div class="detail-layout">
          <div class="detail-image">
            <img v-if="selectedProduct.image" :src="selectedProduct.image" :alt="selectedProduct.name" />
            <el-icon v-else class="no-image-icon"><Goods /></el-icon>
          </div>
          <div class="detail-info">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">产品ID</span>
                <span class="detail-value">{{ selectedProduct.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">产品名称</span>
                <span class="detail-value">{{ selectedProduct.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">分类</span>
                <el-tag type="info" size="small">{{ getCategoryName(selectedProduct.category) }}</el-tag>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">价格</span>
                <span class="detail-value price">¥{{ selectedProduct.price }}/{{ selectedProduct.unit }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">库存</span>
                <el-tag :type="selectedProduct.stock > 50 ? 'success' : selectedProduct.stock > 20 ? 'warning' : 'danger'" size="small">
                  {{ selectedProduct.stock }} {{ selectedProduct.unit }}
                </el-tag>
              </div>
              <div class="detail-item" v-if="selectedProduct.discount < 1">
                <span class="detail-label">折扣</span>
                <el-tag type="warning" size="small">{{ (selectedProduct.discount * 10).toFixed(1) }}折</el-tag>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item" v-if="selectedProduct.barCode">
                <span class="detail-label">条码</span>
                <span class="detail-value">{{ selectedProduct.barCode }}</span>
              </div>
              <div class="detail-item" v-if="selectedProduct.description" :span="2">
                <span class="detail-label">描述</span>
                <span class="detail-value">{{ selectedProduct.description }}</span>
              </div>
            </div>
            <div class="detail-row tags-row" v-if="selectedProduct.tags && selectedProduct.tags.length">
              <div class="detail-item full-width">
                <span class="detail-label center-label">标签</span>
                <div class="detail-tags centered">
                  <el-tag v-for="tag in selectedProduct.tags" :key="tag" size="small">
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { Goods, Search, Grid, List, CircleCheckFilled, UploadFilled, DeleteFilled } from '@element-plus/icons-vue'
import { products as productsData, categories as categoriesData } from '../../data/products'

export default {
  name: 'DashboardProduct',
  components: { 
    Goods, Search, Grid, List, 
    CircleCheckFilled, UploadFilled, DeleteFilled 
  },
  setup() {
    const products = productsData
    const categories = categoriesData
    const productSearch = ref('')
    const productCategory = ref('')
    const productStatus = ref('') // 产品状态筛选
    const selectedProduct = ref(null)
    const detailDialogVisible = ref(false)
    const viewMode = ref('large')

    const getCategoryName = (categoryId) => {
      const category = categories.find(c => c.id === categoryId)
      return category ? category.name : categoryId
    }

    // 使用 computed 自动响应筛选条件变化，避免 watch 的循环触发问题
    const filteredProducts = computed(() => {
      return products.filter(product => {
        // 搜索筛选
        const matchSearch = productSearch.value === '' ||
          product.name.toLowerCase().includes(productSearch.value.toLowerCase()) ||
          product.id.toString().includes(productSearch.value)
        // 分类筛选
        const matchCategory = productCategory.value === '' ||
          product.category === productCategory.value
        // 状态筛选
        const matchStatus = productStatus.value === '' ||
          product.status === productStatus.value
        return matchSearch && matchCategory && matchStatus
      })
    })

    // 切换产品上下架状态
    const toggleProductStatus = (product, newStatus) => {
      product.status = newStatus
      // computed 会自动重新计算，无需手动触发
    }

    const showProductDetail = (product) => {
      selectedProduct.value = product
      detailDialogVisible.value = true
    }

    return {
      products,
      categories,
      productSearch,
      productCategory,
      productStatus,
      filteredProducts,
      selectedProduct,
      detailDialogVisible,
      viewMode,
      getCategoryName,
      toggleProductStatus,
      showProductDetail
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
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-left {
  display: flex;
  gap: 20px;
  flex: 1;
  align-items: center;
}

/* 状态按钮组样式 */
.status-button-group {
  display: inline-flex;
}

.status-button-group .el-button {
  padding: 8px 12px;
  font-size: 13px;
}

.status-button-group .el-button .el-icon {
  margin-right: 4px;
}

.filter-right {
  flex-shrink: 0;
}

.category-bar {
  margin-bottom: 20px;
  padding: 0;
  background: #fff;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-scroll {
  display: flex;
  gap: 0;
  overflow-x: auto;
  padding: 0;
  scrollbar-width: thin;
  position: relative;
}

.category-scroll::-webkit-scrollbar {
  height: 3px;
}

.category-scroll::-webkit-scrollbar-thumb {
  background: #e4e7ed;
  border-radius: 2px;
}

.category-item {
  flex-shrink: 0;
  position: relative;
  padding: 14px 24px;
  background: #f5f7fa;
  border: none;
  border-radius: 8px 8px 0 0;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  margin-right: 2px;
  overflow: hidden;
}

.category-item::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: transparent;
  transition: all 0.3s ease;
}

.category-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: #ecf5ff;
  color: #409eff;
  transform: translateY(-2px);
}

.category-item:hover::before {
  background: #409eff;
}

.category-item:hover::after {
  opacity: 1;
}

.category-item.active {
  background: linear-gradient(180deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transform: translateY(-2px);
}

.category-item.active::before {
  background: #409eff;
  height: 4px;
}

.category-item.active::after {
  opacity: 1;
}

.category-text {
  position: relative;
  z-index: 1;
  display: inline-block;
  padding: 0 4px;
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

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding: 10px 0;
}

.product-grid.small-mode {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.product-grid.small-mode .product-card {
  border-radius: 8px;
}

.product-grid.small-mode .product-image {
  height: 80px;
}

.product-grid.small-mode .product-image .el-icon {
  font-size: 28px;
}

.product-grid.small-mode .product-info {
  padding: 6px 8px;
}

.product-grid.small-mode .product-id {
  font-size: 10px;
}

.product-grid.small-mode .product-name {
  font-size: 12px;
}

.product-grid.small-mode .product-price {
  font-size: 11px;
}

.product-grid.small-mode .product-stock,
.product-grid.small-mode .product-category {
  display: none;
}

.product-grid.small-mode .product-actions {
  margin-top: 4px;
}

.product-grid.small-mode .product-actions .el-button {
  font-size: 12px;
  padding: 4px 8px;
}

.product-card {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 已下架产品样式 */
.product-card.offshelf {
  opacity: 0.6;
}

.product-card.offshelf::after {
  content: '已下架';
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(245, 108, 108, 0.9);
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  z-index: 10;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 130px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image .el-icon {
  font-size: 50px;
  opacity: 0.8;
}

.product-info {
  padding: 10px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-id {
  font-size: 11px;
  color: #909399;
  font-weight: 500;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.product-price {
  font-size: 13px;
  font-weight: 600;
  color: #f56c6c;
}

.product-stock,
.product-category {
  margin-top: 2px;
}

.product-actions {
  display: flex;
  gap: 0;
  margin-top: 8px;
}

.product-actions .el-button {
  flex: 1;
  margin: 0;
  border-radius: 0;
}

.product-actions .el-button:first-child {
  border-radius: 4px 0 0 4px;
}

.product-actions .el-button:last-child {
  border-radius: 0 4px 4px 0;
}

.product-actions .el-button:not(:first-child):not(:last-child) {
  border-radius: 0;
}

.product-detail {
  padding: 20px 0;
}

.detail-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.detail-image {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-icon {
  font-size: 60px;
  color: #fff;
  opacity: 0.8;
}

.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.detail-row {
  display: flex;
  gap: 24px;
  align-items: stretch;
}

.detail-row.tags-row {
  justify-content: center;
  margin-top: 5px;
  border-top: 1px solid #f0f2f5;
  padding-top: 15px;
}

.detail-row .detail-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.detail-row .detail-item.full-width {
  flex: 1 1 100%;
  text-align: center;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
}

.detail-label.center-label {
  text-align: center;
}

.detail-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  line-height: 1.4;
}

.detail-value.price {
  font-size: 20px;
  font-weight: 700;
  color: #f56c6c;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.detail-tags.centered {
  justify-content: center;
}
</style>

<style>
.product-detail-dialog .el-dialog__header {
  padding: 20px 24px 10px !important;
  text-align: left !important;
}

.product-detail-dialog .el-dialog__title {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #303133 !important;
}

.product-detail-dialog .el-dialog__body {
  padding: 15px 24px 20px !important;
}

.product-detail-dialog .el-dialog__footer {
  padding: 0 24px 20px !important;
  border-top: 1px solid #f0f2f5;
  margin-top: 0 !important;
}

.product-detail-dialog .el-dialog__headerbtn {
  top: 18px !important;
  right: 20px !important;
}
</style>
