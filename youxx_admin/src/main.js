import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/global.css'

// 开发环境启用 Mock，拦截 /api/** 请求，无需启动后端即可调试
if (process.env.NODE_ENV === 'development') {
  require('@/mock/index.js')
}

createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
