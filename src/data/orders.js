// 订单数据及其操作函数
const ORDERS_KEY = 'systemOrders'
const ORDERS_VERSION_KEY = 'systemOrdersVersion'
const CURRENT_VERSION = 2

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
  // 最近三天的订单
  {
    id: 'ORD001',
    username: 'zhangsan',
    customerId: 'U003',
    customer: '张三',
    items: [
      { productId: 'P001', name: '农夫山泉', price: 2.00, discount: 1, quantity: 50, unit: '瓶', subtotal: '100.00' },
      { productId: 'P002', name: '可口可乐', price: 3.00, discount: 0.95, quantity: 35, unit: '瓶', subtotal: '99.75' }
    ],
    totalAmount: '199.75',
    amount: 199.75,
    itemCount: 85,
    status: '待发货',
    date: formatDate(getDaysAgo(0)),
    createTime: formatDateTime(getDaysAgo(0)),
    urgentCount: 2,
    lastUrgentTime: new Date().toISOString()
  },
  {
    id: 'ORD002',
    username: 'lisi',
    customerId: 'U004',
    customer: '李四',
    items: [
      { productId: 'P005', name: '乐事薯片', price: 6.50, discount: 1, quantity: 10, unit: '袋', subtotal: '65.00' },
      { productId: 'P013', name: '伊利纯牛奶', price: 12.00, discount: 0.95, quantity: 3, unit: '箱', subtotal: '34.20' }
    ],
    totalAmount: '99.20',
    amount: 99.20,
    itemCount: 13,
    status: '待发货',
    date: formatDate(getDaysAgo(1)),
    createTime: formatDateTime(getDaysAgo(1)),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD003',
    username: 'wangwu',
    customerId: 'U005',
    customer: '王五',
    items: [
      { productId: 'P011', name: '新鲜鸡蛋', price: 15.00, discount: 1, quantity: 10, unit: '盒', subtotal: '150.00' },
      { productId: 'P012', name: '新鲜西红柿', price: 4.50, discount: 1, quantity: 20, unit: '斤', subtotal: '90.00' }
    ],
    totalAmount: '240.00',
    amount: 240.00,
    itemCount: 30,
    status: '已发货',
    date: formatDate(getDaysAgo(2)),
    createTime: formatDateTime(getDaysAgo(2)),
    urgentCount: 1,
    lastUrgentTime: new Date().toISOString()
  },
  // 最近一周的订单（3-7 天前）
  {
    id: 'ORD004',
    username: 'zhaoliu',
    customerId: 'U006',
    customer: '赵六',
    items: [
      { productId: 'P003', name: '康师傅冰红茶', price: 3.50, discount: 1, quantity: 24, unit: '瓶', subtotal: '84.00' },
      { productId: 'P004', name: '统一绿茶', price: 3.00, discount: 0.9, quantity: 30, unit: '瓶', subtotal: '81.00' }
    ],
    totalAmount: '165.00',
    amount: 165.00,
    itemCount: 54,
    status: '已发货',
    date: formatDate(getDaysAgo(4)),
    createTime: formatDateTime(getDaysAgo(4)),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD005',
    username: 'sunqi',
    customerId: 'U007',
    customer: '孙七',
    items: [
      { productId: 'P006', name: '奥利奥饼干', price: 8.00, discount: 1, quantity: 15, unit: '盒', subtotal: '120.00' },
      { productId: 'P007', name: '趣多多曲奇', price: 7.50, discount: 0.95, quantity: 20, unit: '盒', subtotal: '142.50' }
    ],
    totalAmount: '262.50',
    amount: 262.50,
    itemCount: 35,
    status: '已完成',
    date: formatDate(getDaysAgo(5)),
    createTime: formatDateTime(getDaysAgo(5)),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD006',
    username: 'zhouba',
    customerId: 'U008',
    customer: '周八',
    items: [
      { productId: 'P008', name: '德芙巧克力', price: 25.00, discount: 1, quantity: 8, unit: '盒', subtotal: '200.00' }
    ],
    totalAmount: '200.00',
    amount: 200.00,
    itemCount: 8,
    status: '已完成',
    date: formatDate(getDaysAgo(6)),
    createTime: formatDateTime(getDaysAgo(6)),
    urgentCount: 3,
    lastUrgentTime: new Date().toISOString()
  },
  // 最近三个月的订单（8-90 天前）
  {
    id: 'ORD007',
    username: 'wujiu',
    customerId: 'U009',
    customer: '吴九',
    items: [
      { productId: 'P009', name: '士力架', price: 5.00, discount: 1, quantity: 50, unit: '根', subtotal: '250.00' },
      { productId: 'P010', name: '绿箭口香糖', price: 6.00, discount: 0.9, quantity: 30, unit: '瓶', subtotal: '162.00' }
    ],
    totalAmount: '412.00',
    amount: 412.00,
    itemCount: 80,
    status: '已完成',
    date: formatDate(getDaysAgo(15)),
    createTime: formatDateTime(getDaysAgo(15)),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD008',
    username: 'zhengshi',
    customerId: 'U012',
    customer: '郑十',
    items: [
      { productId: 'P014', name: '蒙牛纯牛奶', price: 55.00, discount: 0.95, quantity: 2, unit: '箱', subtotal: '104.50' },
      { productId: 'P015', name: '光明酸奶', price: 45.00, discount: 1, quantity: 3, unit: '箱', subtotal: '135.00' }
    ],
    totalAmount: '239.50',
    amount: 239.50,
    itemCount: 5,
    status: '已取消',
    date: formatDate(getDaysAgo(30)),
    createTime: formatDateTime(getDaysAgo(30)),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD009',
    username: 'cheems',
    customerId: 'U011',
    customer: 'cheems',
    items: [
      { productId: 'P016', name: '金龙鱼食用油', price: 68.00, discount: 1, quantity: 5, unit: '桶', subtotal: '340.00' },
      { productId: 'P017', name: '海天酱油', price: 12.00, discount: 1, quantity: 10, unit: '瓶', subtotal: '120.00' }
    ],
    totalAmount: '460.00',
    amount: 460.00,
    itemCount: 15,
    status: '已完成',
    date: formatDate(getDaysAgo(45)),
    createTime: formatDateTime(getDaysAgo(45)),
    urgentCount: 1,
    lastUrgentTime: new Date().toISOString()
  },
  {
    id: 'ORD010',
    username: 'user001',
    customerId: 'U013',
    customer: '用户一',
    items: [
      { productId: 'P018', name: '五常大米', price: 88.00, discount: 0.9, quantity: 2, unit: '袋', subtotal: '158.40' }
    ],
    totalAmount: '158.40',
    amount: 158.40,
    itemCount: 2,
    status: '已取消',
    date: formatDate(getDaysAgo(60)),
    createTime: formatDateTime(getDaysAgo(60)),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD011',
    username: 'user002',
    customerId: 'U014',
    customer: '用户二',
    items: [
      { productId: 'P019', name: '鲁花花生油', price: 159.00, discount: 1, quantity: 1, unit: '桶', subtotal: '159.00' },
      { productId: 'P020', name: '恒顺香醋', price: 15.00, discount: 1, quantity: 4, unit: '瓶', subtotal: '60.00' }
    ],
    totalAmount: '219.00',
    amount: 219.00,
    itemCount: 5,
    status: '已完成',
    date: formatDate(getDaysAgo(75)),
    createTime: formatDateTime(getDaysAgo(75)),
    urgentCount: 0,
    lastUrgentTime: null
  },
  {
    id: 'ORD012',
    username: 'user003',
    customerId: 'U015',
    customer: '用户三',
    items: [
      { productId: 'P001', name: '农夫山泉', price: 2.00, discount: 1, quantity: 100, unit: '瓶', subtotal: '200.00' }
    ],
    totalAmount: '200.00',
    amount: 200.00,
    itemCount: 100,
    status: '待发货',
    date: formatDate(getDaysAgo(2)),
    createTime: formatDateTime(getDaysAgo(2)),
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
