/**
 * Mock 服务入口
 *
 * 仅在开发环境由 main.js 引入：拦截所有 /api/** 请求，前端无需启动后端即可调试。
 * 接口路径、请求参数与响应结构均对齐 YouxxAPi.json，切换回真实后端只需停用本文件。
 */
import Mock from 'mockjs'
import { users, session } from './db'

import './auth'
import './user'
import './product'
import './order'
import './message'

// 模拟网络延迟，随机 200-600ms
Mock.setup({ timeout: '200-600' })

// 刷新页面后内存数据会重建，这里按 sessionStorage 中残留的登录信息恢复会话
const userId = sessionStorage.getItem('userId')
if (userId) {
  session.token = sessionStorage.getItem('token') || ''
  session.user = users.find(u => u.id === userId) || null
}

console.log('[Mock] 接口模拟已启用，数据源 src/mock（管理员账号 admin / 123456）')
