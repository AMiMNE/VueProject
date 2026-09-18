/**
 * 认证接口 Mock
 * 对应 YouxxAPi.json 中的「认证」标签：登录 / 注册 / 登出 / 当前用户信息
 */
import Mock from 'mockjs'
import { users, session, ok, fail, getBody, now, MOCK_PASSWORD } from './db'

const toUserVO = (user) => ({
  id: user.id,
  username: user.username,
  phone: user.phone,
  email: user.email,
  role: user.role,
  status: user.status,
  avatar: user.avatar,
  createTime: user.createTime,
  updateTime: user.updateTime
})

// 登录：管理端请使用 admin / 123456；其他已存在的用户名为普通用户角色
Mock.mock(/\/api\/auth\/login$/, 'post', (options) => {
  const { username, password } = getBody(options)
  const user = users.find(u => u.username === username)

  if (!user || password !== MOCK_PASSWORD) return fail('用户名或密码错误')
  if (user.status === 'DISABLED') return fail('账号已被禁用，请联系管理员')

  session.token = `mock-token-${user.id}-${Date.now()}`
  session.user = user

  return ok({
    token: session.token,
    userId: user.id,
    username: user.username,
    role: user.role
  })
})

// 注册：新增一个普通用户
Mock.mock(/\/api\/auth\/register$/, 'post', (options) => {
  const { username, password, phone } = getBody(options)
  if (!username || !password) return fail('参数校验失败')
  if (users.some(u => u.username === username)) return fail('用户名已存在')

  const maxId = users.reduce((max, u) => Math.max(max, Number(String(u.id).replace(/\D/g, '')) || 0), 0)
  const user = {
    id: `U${String(maxId + 1).padStart(3, '0')}`,
    username,
    phone: phone || '',
    email: '',
    role: 'USER',
    status: 'NORMAL',
    avatar: '',
    createTime: now(),
    updateTime: now()
  }
  users.push(user)
  return ok(toUserVO(user))
})

Mock.mock(/\/api\/auth\/logout$/, 'post', () => {
  session.token = ''
  session.user = null
  return ok()
})

Mock.mock(/\/api\/auth\/info$/, 'get', () => {
  if (!session.user) return fail('登录状态已失效，请重新登录')
  return ok(toUserVO(session.user))
})
