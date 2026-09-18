/**
 * 订单接口 Mock
 * 对应 YouxxAPi.json 中的「订单」标签：下单、订单查询与状态流转
 */
import Mock from 'mockjs'
import { orders, products, session, ok, fail, pageResult, getQuery, getBody, pathOf, nextOrderItemId, now } from './db'

const STATUS_TEXT = {
  PENDING: '待发货',
  SHIPPED: '已发货',
  COMPLETED: '已完成',
  CANCELLED: '已取消'
}

const segmentFrom = (url, fromEnd = 1) => {
  const segments = pathOf(url).split('/')
  return decodeURIComponent(segments[segments.length - fromEnd])
}

const buildOrderId = () => {
  const date = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const prefix = `ORD${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const seq = orders.filter(o => o.id.startsWith(prefix)).length + 1
  return `${prefix}${String(seq).padStart(3, '0')}`
}

// 订单列表：管理端查看全部订单
Mock.mock(/\/api\/order\/list(\?.*)?$/, 'get', (options) => {
  const { keyword, status, beginTime, endTime, page, size } = getQuery(options.url)
  let result = [...orders]

  if (keyword) {
    const kw = keyword.toLowerCase()
    result = result.filter(o => o.id.toLowerCase().includes(kw) || o.username.toLowerCase().includes(kw))
  }
  if (status) result = result.filter(o => o.status === status)
  if (beginTime) result = result.filter(o => o.createTime >= beginTime)
  if (endTime) result = result.filter(o => o.createTime <= endTime)

  result.sort((a, b) => b.createTime.localeCompare(a.createTime))
  return ok(pageResult(result, page, size))
})

// 我的订单：用户端按 token 过滤
Mock.mock(/\/api\/order\/my(\?.*)?$/, 'get', (options) => {
  const { status } = getQuery(options.url)
  let result = orders.filter(o => o.userId === session.user?.id)
  if (status) result = result.filter(o => o.status === status)
  return ok(result)
})

Mock.mock(/\/api\/order\/([^/?]+)\/status$/, 'put', (options) => {
  const order = orders.find(o => o.id === segmentFrom(options.url, 2))
  if (!order) return fail('订单不存在')

  const { status } = getBody(options)
  if (!STATUS_TEXT[status]) return fail('订单状态不合法')

  order.status = status
  order.updateTime = now()
  return ok()
})

Mock.mock(/\/api\/order\/([^/?]+)\/urgent$/, 'post', (options) => {
  const order = orders.find(o => o.id === segmentFrom(options.url, 2))
  if (!order) return fail('订单不存在')
  if (order.status !== 'PENDING') return fail('仅待发货订单可以催单')

  order.urgentCount += 1
  order.lastUrgentTime = now()
  order.updateTime = now()
  return ok()
})

// 创建订单：金额与商品快照由「后端」计算
Mock.mock(/\/api\/order$/, 'post', (options) => {
  const { id, items } = getBody(options)
  if (!Array.isArray(items) || items.length === 0) return fail('参数校验失败')

  const orderItems = []
  let totalAmount = 0
  let itemCount = 0

  for (const item of items) {
    const product = products.find(p => p.id === item.productId)
    if (!product) return fail(`商品 ${item.productId} 不存在`)

    const quantity = Number(item.quantity) || 1
    const subtotal = Number((product.price * product.discount * quantity).toFixed(2))
    totalAmount += subtotal
    itemCount += quantity
    orderItems.push({
      id: nextOrderItemId(),
      orderId: id || '',
      productId: product.id,
      productName: product.name,
      price: product.price,
      discount: product.discount,
      quantity,
      unit: product.unit,
      subtotal
    })
  }

  const order = {
    id: id || buildOrderId(),
    userId: session.user?.id || '',
    username: session.user?.username || '',
    totalAmount: Number(totalAmount.toFixed(2)),
    itemCount,
    status: 'PENDING',
    urgentCount: 0,
    lastUrgentTime: null,
    createTime: now(),
    updateTime: now(),
    items: orderItems
  }
  orderItems.forEach(item => { item.orderId = order.id })
  orders.unshift(order)
  return ok(order)
})

// 订单详情 / 删除（放在列表与 my 之后注册，避免被误匹配）
Mock.mock(/\/api\/order\/(?!list|my)([^/?]+)(\?.*)?$/, 'get', (options) => {
  const order = orders.find(o => o.id === segmentFrom(options.url))
  return order ? ok({ order, items: order.items }) : fail('订单不存在')
})

Mock.mock(/\/api\/order\/(?!list|my)([^/?]+)(\?.*)?$/, 'delete', (options) => {
  const index = orders.findIndex(o => o.id === segmentFrom(options.url))
  if (index === -1) return fail('订单不存在')

  orders.splice(index, 1)
  return ok()
})
