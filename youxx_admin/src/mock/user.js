/**
 * 用户接口 Mock
 * 对应 YouxxAPi.json 中的「用户」标签：管理员侧用户管理 + 个人资料 + 收货地址
 *
 * 注意：mockjs 按注册顺序命中第一条匹配规则，故具体路径需先于 /api/user/{id} 注册。
 */
import Mock from 'mockjs'
import { users, addresses, session, ok, fail, pageResult, getQuery, getBody, pathOf, nextAddressId, now, MOCK_PASSWORD } from './db'

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

// 取路径中的某一段（默认取最后一段），如 /api/user/address/1/default → 倒数第二段为 1
const segmentFrom = (url, fromEnd = 1) => {
  const segments = pathOf(url).split('/')
  return decodeURIComponent(segments[segments.length - fromEnd])
}

const currentUser = () => users.find(u => u.id === session.user?.id) || null

// ==================== 管理员：用户管理 ====================
Mock.mock(/\/api\/user\/list(\?.*)?$/, 'get', (options) => {
  const { keyword, role, page, size } = getQuery(options.url)
  let result = [...users]
  if (keyword) {
    const kw = keyword.toLowerCase()
    result = result.filter(u => u.username.toLowerCase().includes(kw))
  }
  if (role) result = result.filter(u => u.role === role)
  return ok(pageResult(result, page, size))
})

Mock.mock(/\/api\/user$/, 'post', (options) => {
  const body = getBody(options)
  if (!body.username || !body.password) return fail('参数校验失败')
  if (users.some(u => u.username === body.username)) return fail('用户名已存在')

  const maxId = users.reduce((max, u) => Math.max(max, Number(String(u.id).replace(/\D/g, '')) || 0), 0)
  const user = {
    id: body.id || `U${String(maxId + 1).padStart(3, '0')}`,
    username: body.username,
    phone: body.phone || '',
    email: body.email || '',
    role: body.role || 'USER',
    status: body.status || 'NORMAL',
    avatar: body.avatar || '',
    createTime: now(),
    updateTime: now()
  }
  users.push(user)
  return ok(toUserVO(user))
})

// ==================== 个人资料 ====================
Mock.mock(/\/api\/user\/profile$/, 'get', () => {
  const user = currentUser()
  return user ? ok(toUserVO(user)) : fail('登录状态已失效，请重新登录')
})

Mock.mock(/\/api\/user\/profile$/, 'put', (options) => {
  const user = currentUser()
  if (!user) return fail('登录状态已失效，请重新登录')

  const { phone, email, avatar } = getBody(options)
  if (phone !== undefined) user.phone = phone
  if (email !== undefined) user.email = email
  if (avatar !== undefined) user.avatar = avatar
  user.updateTime = now()
  return ok(toUserVO(user))
})

Mock.mock(/\/api\/user\/password$/, 'put', (options) => {
  const { oldPassword } = getBody(options)
  if (oldPassword !== MOCK_PASSWORD) return fail('原密码不正确')
  return ok()
})

Mock.mock(/\/api\/user\/avatar\/upload$/, 'post', () => {
  const user = currentUser()
  if (!user) return fail('登录状态已失效，请重新登录')

  // mock 环境不做真实落盘，直接复用已有的头像资源
  user.avatar = '/upload_resources/user_icon/359c7016-b030-474c-a2a6-8baa6819cc49.jpg'
  return ok({ url: user.avatar })
})

// ==================== 收货地址 ====================
Mock.mock(/\/api\/user\/address$/, 'get', () => {
  const userId = session.user?.id
  return ok(addresses.filter(a => a.userId === userId))
})

Mock.mock(/\/api\/user\/address$/, 'post', (options) => {
  const userId = session.user?.id
  if (!userId) return fail('登录状态已失效，请重新登录')

  const body = getBody(options)
  if (!body.name || !body.phone || !body.detail) return fail('参数校验失败')

  if (body.isDefault) addresses.forEach(a => { if (a.userId === userId) a.isDefault = false })
  const address = {
    id: nextAddressId(),
    userId,
    name: body.name,
    phone: body.phone,
    detail: body.detail,
    isDefault: !!body.isDefault,
    createTime: now()
  }
  addresses.push(address)
  return ok(address)
})

Mock.mock(/\/api\/user\/address\/([^/?]+)\/default$/, 'put', (options) => {
  const id = Number(segmentFrom(options.url, 2))
  const address = addresses.find(a => a.id === id)
  if (!address) return fail('地址不存在')

  addresses.forEach(a => { if (a.userId === address.userId) a.isDefault = a.id === id })
  return ok()
})

Mock.mock(/\/api\/user\/address\/([^/?]+)(\?.*)?$/, 'put', (options) => {
  const id = Number(segmentFrom(options.url))
  const address = addresses.find(a => a.id === id)
  if (!address) return fail('地址不存在')

  const body = getBody(options)
  if (body.isDefault) addresses.forEach(a => { if (a.userId === address.userId) a.isDefault = false })
  Object.assign(address, {
    name: body.name ?? address.name,
    phone: body.phone ?? address.phone,
    detail: body.detail ?? address.detail,
    isDefault: body.isDefault ?? address.isDefault
  })
  return ok(address)
})

Mock.mock(/\/api\/user\/address\/([^/?]+)(\?.*)?$/, 'delete', (options) => {
  const id = Number(segmentFrom(options.url))
  const index = addresses.findIndex(a => a.id === id)
  if (index === -1) return fail('地址不存在')
  addresses.splice(index, 1)
  return ok()
})

// ==================== 管理员：用户详情 / 编辑 / 状态 / 删除 ====================
Mock.mock(/\/api\/user\/(?!list|profile|password|address|avatar)([^/?]+)(\?.*)?$/, 'get', (options) => {
  const user = users.find(u => u.id === segmentFrom(options.url))
  return user ? ok(toUserVO(user)) : fail('用户不存在')
})

Mock.mock(/\/api\/user\/(?!list|profile|password|address|avatar)([^/?]+)(\?.*)?$/, 'put', (options) => {
  const user = users.find(u => u.id === segmentFrom(options.url))
  if (!user) return fail('用户不存在')

  const { phone, email, role, status, avatar } = getBody(options)
  if (phone !== undefined) user.phone = phone
  if (email !== undefined) user.email = email
  if (role !== undefined) user.role = role
  if (status !== undefined) user.status = status
  if (avatar !== undefined) user.avatar = avatar
  user.updateTime = now()
  return ok(toUserVO(user))
})

Mock.mock(/\/api\/user\/(?!list|profile|password|address|avatar)([^/?]+)\/status$/, 'put', (options) => {
  const id = segmentFrom(options.url, 2)
  const user = users.find(u => u.id === id)
  if (!user) return fail('用户不存在')

  user.status = getBody(options).status
  user.updateTime = now()
  return ok()
})

Mock.mock(/\/api\/user\/(?!list|profile|password|address|avatar)([^/?]+)(\?.*)?$/, 'delete', (options) => {
  const id = segmentFrom(options.url)
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return fail('用户不存在')
  if (users[index].role === 'ADMIN') return fail('管理员账号不允许删除')

  users.splice(index, 1)
  return ok()
})
