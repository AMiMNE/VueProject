<template>
  <div class="page-content">
    <h2>产品管理</h2>
    <div class="filter-bar">
      <div class="filter-item">
        <label>搜索：</label>
        <el-input
          v-model="productSearch"
          placeholder="请输入产品名称或ID"
          clearable
          @clear="handleSearchClear"
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
          @change="handleCategoryChange"
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
    </div>
    <div class="product-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
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
        </div>
      </div>
    </div>

    <el-dialog v-model="detailDialogVisible" title="产品详情" width="500px">
      <div v-if="selectedProduct" class="product-detail">
        <div class="detail-image" v-if="selectedProduct.image">
          <img :src="selectedProduct.image" :alt="selectedProduct.name" />
        </div>
        <div class="detail-item">
          <span class="detail-label">产品ID：</span>
          <span class="detail-value">{{ selectedProduct.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">产品名称：</span>
          <span class="detail-value">{{ selectedProduct.name }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">价格：</span>
          <span class="detail-value price">¥{{ selectedProduct.price }}/{{ selectedProduct.unit }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">库存：</span>
          <el-tag :type="selectedProduct.stock > 50 ? 'success' : selectedProduct.stock > 20 ? 'warning' : 'danger'">
            {{ selectedProduct.stock }} {{ selectedProduct.unit }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="detail-label">分类：</span>
          <el-tag type="info">{{ getCategoryName(selectedProduct.category) }}</el-tag>
        </div>
        <div class="detail-item" v-if="selectedProduct.description">
          <span class="detail-label">描述：</span>
          <span class="detail-value">{{ selectedProduct.description }}</span>
        </div>
        <div class="detail-item" v-if="selectedProduct.barCode">
          <span class="detail-label">条码：</span>
          <span class="detail-value">{{ selectedProduct.barCode }}</span>
        </div>
        <div class="detail-item" v-if="selectedProduct.discount < 1">
          <span class="detail-label">折扣：</span>
          <el-tag type="warning">{{ (selectedProduct.discount * 10).toFixed(1) }}折</el-tag>
        </div>
        <div class="detail-item" v-if="selectedProduct.tags && selectedProduct.tags.length">
          <span class="detail-label">标签：</span>
          <div class="detail-tags">
            <el-tag v-for="tag in selectedProduct.tags" :key="tag" size="small" style="margin-right: 5px;">
              {{ tag }}
            </el-tag>
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
import { ref, watch } from 'vue'
import { Goods, Search } from '@element-plus/icons-vue'
import { products as productsData, categories as categoriesData } from '../../data/products'

export default {
  name: 'DashboardProduct',
  components: { Goods, Search },
  setup() {
    const products = productsData
    const categories = categoriesData
    const productSearch = ref('')
    const productCategory = ref('')
    const filteredProducts = ref([...products])
    const selectedProduct = ref(null)
    const detailDialogVisible = ref(false)

    const getCategoryName = (categoryId) => {
      const category = categories.find(c => c.id === categoryId)
      return category ? category.name : categoryId
    }

    const filterProducts = () => {
      filteredProducts.value = products.filter(product => {
        const matchSearch = productSearch.value === '' ||
          product.name.toLowerCase().includes(productSearch.value.toLowerCase()) ||
          product.id.toString().includes(productSearch.value)
        const matchCategory = productCategory.value === '' ||
          product.category === productCategory.value
        return matchSearch && matchCategory
      })
    }

    const handleSearchClear = () => {
      productSearch.value = ''
      filterProducts()
    }

    const handleCategoryChange = () => {
      filterProducts()
    }

    const showProductDetail = (product) => {
      selectedProduct.value = product
      detailDialogVisible.value = true
    }

    watch(productSearch, () => { filterProducts() }, { immediate: true })

    return {
      products,
      categories,
      productSearch,
      productCategory,
      filteredProducts,
      selectedProduct,
      detailDialogVisible,
      getCategoryName,
      handleSearchClear,
      handleCategoryChange,
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

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  padding: 10px 0;
}

.product-card {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
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
  gap: 8px;
  margin-top: 8px;
}

.product-actions .el-button {
  flex: 1;
}

.product-detail {
  padding: 20px 0;
}

.detail-image {
  text-align: center;
  margin-bottom: 20px;
}

.detail-image img {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  min-width: 100px;
}

.detail-value {
  font-size: 14px;
  color: #303133;
  font-weight: 400;
}

.detail-value.price {
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
}
</style>
