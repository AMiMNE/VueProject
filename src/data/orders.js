// 订单数据及其操作函数
const ORDERS_KEY = 'systemOrders'
const ORDERS_VERSION_KEY = 'systemOrdersVersion'
const CURRENT_VERSION = 2

const defaultOrders = [
  {
    id: 'ORD001',
    username: 'zhangsan',
    customer: '张三',
    items: [
      { productId: 'P001', name: '农夫山泉', price: 2.00, discount: 1, quantity: 50, unit: '瓶', subtotal: '100.00' },
      { productId: 'P002', name: '可口可乐', price: 3.00, discount: 0.95, quantity: 35, unit: '瓶', subtotal: '99.75' }
    ],
    totalAmount: '199.75',
    amount: 199.75,
    itemCount: 85,
    status: '待发货',
    date: '2024-01-15',
    createTime: '2024-01-15T10:00:00.000Z',
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD002',
    username: 'lisi',
    customer: '李四',
    items: [
      { productId: 'P005', name: '乐事薯片', price: 6.50, discount: 1, quantity: 10, unit: '袋', subtotal: '65.00' },
      { productId: 'P013', name: '伊利纯牛奶', price: 12.00, discount: 0.95, quantity: 3, unit: '箱', subtotal: '34.20' }
    ],
    totalAmount: '99.20',
    amount: 99.20,
    itemCount: 13,
    status: '已发货',
    date: '2024-01-14',
    createTime: '2024-01-14T10:00:00.000Z',
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD003',
    username: 'wangwu',
    customer: '王五',
    items: [
      { productId: 'P011', name: '新鲜鸡蛋', price: 15.00, discount: 1, quantity: 10, unit: '盒', subtotal: '150.00' },
      { productId: 'P012', name: '新鲜西红柿', price: 4.50, discount: 1, quantity: 20, unit: '斤', subtotal: '90.00' },
      { productId: 'P003', name: '康师傅冰红茶', price: 3.50, discount: 1, quantity: 15, unit: '瓶', subtotal: '52.50' }
    ],
    totalAmount: '292.50',
    amount: 292.50,
    itemCount: 45,
    status: '已完成',
    date: '2024-01-13',
    createTime: '2024-01-13T10:00:00.000Z',
    urgentCount: 0,
    lastUrgentTime: null
  }
]

const generateOrderId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 4)
  return `ORD${timestamp}${random}`.toUpperCase()
}

const formatDate = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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
  
  const newOrder = {
    id: generateOrderId(),
    username: username,
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
