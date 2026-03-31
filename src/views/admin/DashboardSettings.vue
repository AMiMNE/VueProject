<template>
  <div class="page-content">
    <h2>系统设置</h2>
    <el-form label-width="120px">
      <el-form-item label="系统名称">
        <el-input v-model="settings.systemName" />
      </el-form-item>
      <el-form-item label="管理员邮箱">
        <el-input v-model="settings.adminEmail" />
      </el-form-item>
      <el-form-item label="开启注册">
        <el-switch v-model="settings.allowRegister" />
      </el-form-item>
      <el-form-item label="维护模式">
        <el-switch v-model="settings.maintenanceMode" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'DashboardSettings',
  setup() {
    const settings = reactive({
      systemName: '管理系统',
      adminEmail: 'admin@example.com',
      allowRegister: true,
      maintenanceMode: false
    })

    return { settings }
  }
}
</script>

<style scoped>
.page-content h2 {
  margin: 0 0 20px 0;
  color: #303133;
}
</style>
