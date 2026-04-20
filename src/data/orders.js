// 订单数据及其操作函数
const ORDERS_KEY = 'systemOrders'
const ORDERS_VERSION_KEY = 'systemOrdersVersion'
const CURRENT_VERSION = 4

// 获取不同日期的辅助函数
const getDaysAgo = (days) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const formatDate = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateTime = (date) => {
  return date.toISOString()
}

// 用户名到用户 ID 的映射（非管理员用户）
const userMapping = {
  'user': 'U001',
  'zhangsan': 'U003',
  'lisi': 'U004',
  'wangwu': 'U005',
  'zhaoliu': 'U006',
  'sunqi': 'U007',
  'zhouba': 'U008',
  'wujiu': 'U009',
  'shiyi': 'U010',
  'cheems': 'U011',
  'zhengshi': 'U012',
  'user001': 'U013',
  'user002': 'U014',
  'user003': 'U015'
}

const defaultOrders = [
  {
    id: 'ORDMO59DDE5PD0H',
    username: 'cheems',
    customerId: 'U011',
    customer: 'cheems',
    items: [
      { productId: 'P001', name: '苹果', price: 5.00, discount: 1.0, quantity: 3, unit: '斤', subtotal: '15.00' },
      { productId: 'P002', name: '香蕉', price: 3.50, discount: 0.9, quantity: 2, unit: '斤', subtotal: '6.30' }
    ],
    totalAmount: '21.30',
    amount: 21.30,
    itemCount: 5,
    status: '待发货',
    date: formatDate(),
    createTime: new Date().toISOString(),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD20260418001',
    username: 'zhangsan',
    customerId: 'U003',
    customer: 'zhangsan',
    items: [
      { productId: 'P003', name: '牛奶', price: 8.00, discount: 1.0, quantity: 5, unit: '盒', subtotal: '40.00' }
    ],
    totalAmount: '40.00',
    amount: 40.00,
    itemCount: 5,
    status: '待发货',
    date: formatDate(),
    createTime: new Date().toISOString(),
    urgentCount: 2,
    lastUrgentTime: new Date().toISOString()
  },
  {
    id: 'ORD20260417001',
    username: 'lisi',
    customerId: 'U004',
    customer: 'lisi',
    items: [
      { productId: 'P004', name: '面包', price: 6.00, discount: 0.8, quantity: 4, unit: '个', subtotal: '19.20' },
      { productId: 'P005', name: '鸡蛋', price: 12.00, discount: 1.0, quantity: 1, unit: '盒', subtotal: '12.00' }
    ],
    totalAmount: '31.20',
    amount: 31.20,
    itemCount: 5,
    status: '已发货',
    date: formatDate(getDaysAgo(1)),
    createTime: getDaysAgo(1).toISOString(),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD20260416001',
    username: 'wangwu',
    customerId: 'U005',
    customer: 'wangwu',
    items: [
      { productId: 'P006', name: '大米', price: 45.00, discount: 0.95, quantity: 2, unit: '袋', subtotal: '85.50' }
    ],
    totalAmount: '85.50',
    amount: 85.50,
    itemCount: 2,
    status: '已完成',
    date: formatDate(getDaysAgo(2)),
    createTime: getDaysAgo(2).toISOString(),
    urgentCount: 1,
    lastUrgentTime: getDaysAgo(2).toISOString()
  },
  {
    id: 'ORD20260415001',
    username: 'zhaoliu',
    customerId: 'U006',
    customer: 'zhaoliu',
    items: [
      { productId: 'P007', name: '食用油', price: 35.00, discount: 1.0, quantity: 1, unit: '桶', subtotal: '35.00' },
      { productId: 'P008', name: '酱油', price: 8.50, discount: 1.0, quantity: 2, unit: '瓶', subtotal: '17.00' }
    ],
    totalAmount: '52.00',
    amount: 52.00,
    itemCount: 3,
    status: '已取消',
    date: formatDate(getDaysAgo(3)),
    createTime: getDaysAgo(3).toISOString(),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD20260410001',
    username: 'zhouba',
    customerId: 'U008',
    customer: 'zhouba',
    items: [
      { productId: 'P009', name: '茶叶', price: 128.00, discount: 0.9, quantity: 1, unit: '盒', subtotal: '115.20' }
    ],
    totalAmount: '115.20',
    amount: 115.20,
    itemCount: 1,
    status: '已完成',
    date: formatDate(getDaysAgo(8)),
    createTime: getDaysAgo(8).toISOString(),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD20260405001',
    username: 'wujiu',
    customerId: 'U009',
    customer: 'wujiu',
    items: [
      { productId: 'P010', name: '咖啡', price: 58.00, discount: 1.0, quantity: 2, unit: '袋', subtotal: '116.00' },
      { productId: 'P011', name: '糖', price: 12.00, discount: 1.0, quantity: 3, unit: '袋', subtotal: '36.00' }
    ],
    totalAmount: '152.00',
    amount: 152.00,
    itemCount: 5,
    status: '已完成',
    date: formatDate(getDaysAgo(13)),
    createTime: getDaysAgo(13).toISOString(),
    urgentCount: 3,
    lastUrgentTime: getDaysAgo(13).toISOString()
  },
  {
    id: 'ORD20260320001',
    username: 'shiyi',
    customerId: 'U010',
    customer: 'shiyi',
    items: [
      { productId: 'P012', name: '矿泉水', price: 2.00, discount: 1.0, quantity: 24, unit: '瓶', subtotal: '48.00' }
    ],
    totalAmount: '48.00',
    amount: 48.00,
    itemCount: 24,
    status: '已完成',
    date: formatDate(getDaysAgo(29)),
    createTime: getDaysAgo(29).toISOString(),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD20260215001',
    username: 'zhengshi',
    customerId: 'U012',
    customer: 'zhengshi',
    items: [
      { productId: 'P013', name: '零食大礼包', price: 88.00, discount: 0.85, quantity: 1, unit: '份', subtotal: '74.80' },
      { productId: 'P014', name: '饮料', price: 5.00, discount: 1.0, quantity: 6, unit: '瓶', subtotal: '30.00' }
    ],
    totalAmount: '104.80',
    amount: 104.80,
    itemCount: 7,
    status: '已完成',
    date: formatDate(getDaysAgo(62)),
    createTime: getDaysAgo(62).toISOString(),
    urgentCount: 1,
    lastUrgentTime: getDaysAgo(62).toISOString()
  },
  {
    id: 'ORD20260110001',
    username: 'user001',
    customerId: 'U013',
    customer: 'user001',
    items: [
      { productId: 'P015', name: '坚果礼盒', price: 158.00, discount: 0.9, quantity: 1, unit: '盒', subtotal: '142.20' }
    ],
    totalAmount: '142.20',
    amount: 142.20,
    itemCount: 1,
    status: '已完成',
    date: formatDate(getDaysAgo(98)),
    createTime: getDaysAgo(98).toISOString(),
    urgentCount: 0,
    lastUrgentTime: null
  }
]

const generateOrderId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 4)
  return `ORD${timestamp}${random}`.toUpperCase()
}

export const getOrders = () => {
  const savedVersion = localStorage.getItem(ORDERS_VERSION_KEY)
  const ordersStr = localStorage.getItem(ORDERS_KEY)
  
  if (ordersStr && savedVersion === String(CURRENT_VERSION)) {
    return JSON.parse(ordersStr)
  }
  
  saveOrders(defaultOrders)
  localStorage.setItem(ORDERS_VERSION_KEY, String(CURRENT_VERSION))
  return defaultOrders
}

export const urgentOrder = (orderId) => {
  const orders = getOrders()
  const orderIndex = orders.findIndex(o => o.id === orderId)
  if (orderIndex > -1) {
    const order = orders[orderIndex]
    if (order.status === '待发货') {
      order.urgentCount = (order.urgentCount || 0) + 1
      order.lastUrgentTime = new Date().toISOString()
      saveOrders(orders)
      return { success: true, message: '催单成功' }
    }
    return { success: false, message: '该订单状态不支持催单' }
  }
  return { success: false, message: '订单不存在' }
}

export const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export const getOrdersByUsername = (username) => {
  const orders = getOrders()
  return orders.filter(o => o.username === username)
}

export const createOrder = (cartItems, totalAmount, username) => {
  const orders = getOrders()
  
  // 根据用户名查找用户 ID
  const customerId = userMapping[username] || 'U999'
  
  const newOrder = {
    id: generateOrderId(),
    username: username,
    customerId: customerId,
    customer: username,
    items: cartItems.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      discount: item.discount,
      quantity: item.quantity,
      unit: item.unit,
      subtotal: (item.price * item.discount * item.quantity).toFixed(2)
    })),
    totalAmount: totalAmount.toFixed(2),
    amount: totalAmount,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    status: '待发货',
    date: formatDate(),
    createTime: new Date().toISOString(),
    urgentCount: 0,
    lastUrgentTime: null
  }
  
  orders.unshift(newOrder)
  saveOrders(orders)
  
  return newOrder
}

export const updateOrderStatus = (orderId, newStatus) => {
  const orders = getOrders()
  const orderIndex = orders.findIndex(o => o.id === orderId)
  if (orderIndex > -1) {
    orders[orderIndex].status = newStatus
    saveOrders(orders)
    return true
  }
  return false
}

export const deleteOrder = (orderId) => {
  const orders = getOrders()
  const filteredOrders = orders.filter(o => o.id !== orderId)
  saveOrders(filteredOrders)
  return filteredOrders.length < orders.length
}

export const getOrderById = (orderId) => {
  const orders = getOrders()
  return orders.find(o => o.id === orderId)
}
