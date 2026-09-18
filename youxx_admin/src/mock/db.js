/**
 * Mock 内存数据库
 *
 * 字段结构严格对齐 YouxxAPi.json 中的 schema，接口返回体与后端 Result 一致：
 * code = 1 成功，code = 0 失败（msg 为失败原因）。
 * 数据保存在内存中，刷新页面后恢复为初始数据。
 */

// ==================== 会话 ====================
// 登录成功后由 auth.js 写入，其他模块可据此判断当前登录身份
export const session = {
  token: '',
  user: null
}

// Mock 环境下的统一密码，配合任意已存在的用户名即可登录
export const MOCK_PASSWORD = '123456'

// ==================== 商品分类 ====================
export const categories = [
  { id: 'drinks', name: '饮料', icon: 'Coffee', sortOrder: 1 },
  { id: 'snacks', name: '零食', icon: 'Sugar', sortOrder: 2 },
  { id: 'daily', name: '日用品', icon: 'Goods', sortOrder: 3 },
  { id: 'fresh', name: '生鲜', icon: 'Apple', sortOrder: 4 },
  { id: 'dairy', name: '乳制品', icon: 'MilkTea', sortOrder: 5 },
  { id: 'instant', name: '速食', icon: 'Food', sortOrder: 6 }
]

// ==================== 商品 ====================
export const products = [
  { id: 'P001', name: '农夫山泉', categoryId: 'drinks', price: 2.00, unit: '瓶', stock: 500, imageUrl: '/upload_resources/products/drinks/water.png', description: '550ml 饮用天然水', barCode: '6920552655001', discount: 1.00, isHot: true, tags: '热销,解渴', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P002', name: '可口可乐', categoryId: 'drinks', price: 3.00, unit: '瓶', stock: 300, imageUrl: '/upload_resources/products/drinks/cola.png', description: '330ml 可乐', barCode: '6920552655002', discount: 0.95, isHot: true, tags: '热销,碳酸', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P003', name: '康师傅冰红茶', categoryId: 'drinks', price: 3.50, unit: '瓶', stock: 200, imageUrl: '/upload_resources/products/drinks/iceTea.png', description: '500ml 冰红茶', barCode: '6920552655003', discount: 1.00, isHot: false, tags: '茶饮', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P004', name: '统一绿茶', categoryId: 'drinks', price: 3.00, unit: '瓶', stock: 180, imageUrl: '/upload_resources/products/drinks/greenTea.png', description: '500ml 绿茶', barCode: '6920552655004', discount: 1.00, isHot: false, tags: '茶饮,健康', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P005', name: '乐事薯片', categoryId: 'snacks', price: 6.50, unit: '袋', stock: 150, imageUrl: '/upload_resources/products/snacks/chips.png', description: '组合装 120g', barCode: '6920552655005', discount: 1.00, isHot: true, tags: '热销,膨化', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P006', name: '奥利奥饼干', categoryId: 'snacks', price: 7.80, unit: '盒', stock: 120, imageUrl: '/upload_resources/products/snacks/orio.png', description: '巧克力味夹心饼干 388g', barCode: '6920552655006', discount: 0.90, isHot: false, tags: '饼干,甜点', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P007', name: '卫龙辣条', categoryId: 'snacks', price: 2.50, unit: '袋', stock: 200, imageUrl: '/upload_resources/products/snacks/lajiao.png', description: '大面筋 65g', barCode: '6920552655007', discount: 1.00, isHot: true, tags: '辣味,童年', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P008', name: '手抽纸巾', categoryId: 'daily', price: 9.90, unit: '提', stock: 100, imageUrl: '/upload_resources/products/daily/tissue.png', description: '抽纸 3 层 120 抽*3 包', barCode: '6920552655008', discount: 1.00, isHot: false, tags: '生活用纸', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P009', name: '雕牌洗洁精', categoryId: 'daily', price: 12.80, unit: '瓶', stock: 80, imageUrl: '/upload_resources/products/daily/detergent.png', description: '1.5kg 柠檬香型', barCode: '6920552655009', discount: 0.85, isHot: false, tags: '清洁,厨房', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P010', name: '六神花露水', categoryId: 'daily', price: 15.00, unit: '瓶', stock: 60, imageUrl: '/upload_resources/products/daily/deet.png', description: '195ml 驱蚊型', barCode: '6920552655010', discount: 1.00, isHot: false, tags: '驱蚊,夏季', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P011', name: '新鲜鸡蛋', categoryId: 'fresh', price: 15.00, unit: '盒', stock: 50, imageUrl: '/upload_resources/products/fresh/eggs.png', description: '土鸡蛋 12 枚', barCode: '6920552655011', discount: 1.00, isHot: true, tags: '生鲜,营养', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P012', name: '新鲜西红柿', categoryId: 'fresh', price: 4.50, unit: '斤', stock: 40, imageUrl: '/upload_resources/products/fresh/tomato.png', description: '500g 约 2-3 个', barCode: '6920552655012', discount: 1.00, isHot: false, tags: '蔬菜,新鲜', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P013', name: '伊利纯牛奶', categoryId: 'dairy', price: 12.00, unit: '箱', stock: 70, imageUrl: '/upload_resources/products/dairy/milk.png', description: '250ml*12 盒', barCode: '6920552655013', discount: 0.95, isHot: true, tags: '牛奶,补钙', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P014', name: '蒙牛酸奶', categoryId: 'dairy', price: 15.80, unit: '箱', stock: 45, imageUrl: '/upload_resources/products/dairy/yogurt.png', description: '100g*12 杯', barCode: '6920552655014', discount: 1.00, isHot: false, tags: '酸奶,益生菌', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P015', name: '康师傅红烧牛肉面', categoryId: 'instant', price: 4.50, unit: '袋', stock: 200, imageUrl: '/upload_resources/products/instant/noodles.png', description: '方便面 103g', barCode: '6920552655015', discount: 1.00, isHot: true, tags: '速食,泡面', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P016', name: '统一老坛酸菜面', categoryId: 'instant', price: 4.50, unit: '袋', stock: 180, imageUrl: '/upload_resources/products/instant/suancai.png', description: '方便面 105g', barCode: '6920552655016', discount: 0.90, isHot: false, tags: '速食,泡面,酸菜', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P017', name: '桂格燕麦片', categoryId: 'instant', price: 22.00, unit: '袋', stock: 60, imageUrl: '/upload_resources/products/instant/oat.png', description: '即食燕麦片 1kg', barCode: '6920552655017', discount: 1.00, isHot: false, tags: '早餐,健康', status: 'ONSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'P018', name: '农夫果园', categoryId: 'drinks', price: 4.20, unit: '瓶', stock: 100, imageUrl: '/upload_resources/products/drinks/juice.png', description: '100% 果汁 450ml', barCode: '6920552655018', discount: 1.00, isHot: false, tags: '果汁,健康', status: 'OFFSHELF', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' }
]

// ==================== 用户 ====================
export const users = [
  { id: 'A001', username: 'admin', phone: '13800000000', email: 'admin@youxx.com', role: 'ADMIN', status: 'NORMAL', avatar: '', createTime: '2026-05-21 10:00:00', updateTime: '2026-05-21 10:00:00' },
  { id: 'U001', username: 'zhangsan', phone: '13800000001', email: 'zhangsan@example.com', role: 'USER', status: 'NORMAL', avatar: '/upload_resources/user_icon/359c7016-b030-474c-a2a6-8baa6819cc49.jpg', createTime: '2026-05-22 09:12:00', updateTime: '2026-05-22 09:12:00' },
  { id: 'U002', username: 'lisi', phone: '13800000002', email: 'lisi@example.com', role: 'USER', status: 'NORMAL', avatar: '', createTime: '2026-05-23 14:30:00', updateTime: '2026-05-23 14:30:00' },
  { id: 'U003', username: 'wangwu', phone: '13800000003', email: 'wangwu@example.com', role: 'USER', status: 'DISABLED', avatar: '', createTime: '2026-06-01 11:05:00', updateTime: '2026-06-01 11:05:00' },
  { id: 'U004', username: 'zhaoliu', phone: '13800000004', email: 'zhaoliu@example.com', role: 'USER', status: 'NORMAL', avatar: '', createTime: '2026-06-08 16:48:00', updateTime: '2026-06-08 16:48:00' },
  { id: 'U005', username: 'sunqi', phone: '13800000005', email: 'sunqi@example.com', role: 'USER', status: 'NORMAL', avatar: '', createTime: '2026-06-15 08:20:00', updateTime: '2026-06-15 08:20:00' },
  { id: 'U006', username: 'zhouba', phone: '13800000006', email: 'zhouba@example.com', role: 'USER', status: 'DISABLED', avatar: '', createTime: '2026-07-02 19:33:00', updateTime: '2026-07-02 19:33:00' },
  { id: 'U007', username: 'wujiu', phone: '13800000007', email: 'wujiu@example.com', role: 'USER', status: 'NORMAL', avatar: '/upload_resources/user_icon/35bfba3a-24cb-4278-a432-7a7460337f81.jpg', createTime: '2026-07-19 13:07:00', updateTime: '2026-07-19 13:07:00' },
  { id: 'U008', username: 'zhengshi', phone: '13800000008', email: 'zhengshi@example.com', role: 'USER', status: 'NORMAL', avatar: '', createTime: '2026-08-05 10:41:00', updateTime: '2026-08-05 10:41:00' }
]

// ==================== 收货地址 ====================
export const addresses = [
  { id: 1, userId: 'A001', name: '管理员', phone: '13800000000', detail: '浙江省杭州市西湖区文一西路 100 号 1 幢 201 室', isDefault: true, createTime: '2026-05-21 10:00:00' }
]

// ==================== 订单 ====================
export const orders = [
  {
    id: 'ORD20260918001', userId: 'U001', username: 'zhangsan', totalAmount: 10.50, itemCount: 3, status: 'PENDING', urgentCount: 1, lastUrgentTime: '2026-09-18 09:20:00', createTime: '2026-09-18 08:30:00', updateTime: '2026-09-18 09:20:00',
    items: [
      { id: 1, orderId: 'ORD20260918001', productId: 'P001', productName: '农夫山泉', price: 2.00, discount: 1.00, quantity: 2, unit: '瓶', subtotal: 4.00 },
      { id: 2, orderId: 'ORD20260918001', productId: 'P005', productName: '乐事薯片', price: 6.50, discount: 1.00, quantity: 1, unit: '袋', subtotal: 6.50 }
    ]
  },
  {
    id: 'ORD20260918002', userId: 'U002', username: 'lisi', totalAmount: 20.40, itemCount: 3, status: 'PENDING', urgentCount: 0, lastUrgentTime: null, createTime: '2026-09-18 07:15:00', updateTime: '2026-09-18 07:15:00',
    items: [
      { id: 3, orderId: 'ORD20260918002', productId: 'P013', productName: '伊利纯牛奶', price: 12.00, discount: 0.95, quantity: 1, unit: '箱', subtotal: 11.40 },
      { id: 4, orderId: 'ORD20260918002', productId: 'P015', productName: '康师傅红烧牛肉面', price: 4.50, discount: 1.00, quantity: 2, unit: '袋', subtotal: 9.00 }
    ]
  },
  {
    id: 'ORD20260918003', userId: 'U004', username: 'zhaoliu', totalAmount: 14.04, itemCount: 2, status: 'SHIPPED', urgentCount: 0, lastUrgentTime: null, createTime: '2026-09-18 06:40:00', updateTime: '2026-09-18 09:00:00',
    items: [
      { id: 5, orderId: 'ORD20260918003', productId: 'P006', productName: '奥利奥饼干', price: 7.80, discount: 0.90, quantity: 2, unit: '盒', subtotal: 14.04 }
    ]
  },
  {
    id: 'ORD20260917004', userId: 'U005', username: 'sunqi', totalAmount: 16.40, itemCount: 6, status: 'COMPLETED', urgentCount: 0, lastUrgentTime: null, createTime: '2026-09-17 15:22:00', updateTime: '2026-09-18 08:00:00',
    items: [
      { id: 6, orderId: 'ORD20260917004', productId: 'P002', productName: '可口可乐', price: 3.00, discount: 0.95, quantity: 4, unit: '瓶', subtotal: 11.40 },
      { id: 7, orderId: 'ORD20260917004', productId: 'P007', productName: '卫龙辣条', price: 2.50, discount: 1.00, quantity: 2, unit: '袋', subtotal: 5.00 }
    ]
  },
  {
    id: 'ORD20260917005', userId: 'U007', username: 'wujiu', totalAmount: 24.00, itemCount: 3, status: 'COMPLETED', urgentCount: 0, lastUrgentTime: null, createTime: '2026-09-17 11:08:00', updateTime: '2026-09-17 20:30:00',
    items: [
      { id: 8, orderId: 'ORD20260917005', productId: 'P011', productName: '新鲜鸡蛋', price: 15.00, discount: 1.00, quantity: 1, unit: '盒', subtotal: 15.00 },
      { id: 9, orderId: 'ORD20260917005', productId: 'P012', productName: '新鲜西红柿', price: 4.50, discount: 1.00, quantity: 2, unit: '斤', subtotal: 9.00 }
    ]
  },
  {
    id: 'ORD20260916006', userId: 'U003', username: 'wangwu', totalAmount: 10.88, itemCount: 1, status: 'CANCELLED', urgentCount: 0, lastUrgentTime: null, createTime: '2026-09-16 17:55:00', updateTime: '2026-09-16 18:10:00',
    items: [
      { id: 10, orderId: 'ORD20260916006', productId: 'P009', productName: '雕牌洗洁精', price: 12.80, discount: 0.85, quantity: 1, unit: '瓶', subtotal: 10.88 }
    ]
  },
  {
    id: 'ORD20260916007', userId: 'U008', username: 'zhengshi', totalAmount: 34.15, itemCount: 4, status: 'SHIPPED', urgentCount: 2, lastUrgentTime: '2026-09-18 09:45:00', createTime: '2026-09-16 09:05:00', updateTime: '2026-09-17 10:00:00',
    items: [
      { id: 11, orderId: 'ORD20260916007', productId: 'P016', productName: '统一老坛酸菜面', price: 4.50, discount: 0.90, quantity: 3, unit: '袋', subtotal: 12.15 },
      { id: 12, orderId: 'ORD20260916007', productId: 'P017', productName: '桂格燕麦片', price: 22.00, discount: 1.00, quantity: 1, unit: '袋', subtotal: 22.00 }
    ]
  },
  {
    id: 'ORD20260915008', userId: 'U001', username: 'zhangsan', totalAmount: 19.60, itemCount: 5, status: 'COMPLETED', urgentCount: 0, lastUrgentTime: null, createTime: '2026-09-15 13:12:00', updateTime: '2026-09-16 09:30:00',
    items: [
      { id: 13, orderId: 'ORD20260915008', productId: 'P003', productName: '康师傅冰红茶', price: 3.50, discount: 1.00, quantity: 2, unit: '瓶', subtotal: 7.00 },
      { id: 14, orderId: 'ORD20260915008', productId: 'P004', productName: '统一绿茶', price: 3.00, discount: 1.00, quantity: 2, unit: '瓶', subtotal: 6.00 },
      { id: 15, orderId: 'ORD20260915008', productId: 'P018', productName: '农夫果园', price: 4.20, discount: 1.00, quantity: 1, unit: '瓶', subtotal: 4.20 }
    ]
  }
]

// ==================== 消息 ====================
// 会话由消息动态聚合，这里只维护消息本身
export const conversations = [
  { id: 'conv_zhangsan', from: 'USER', fromName: 'zhangsan' },
  { id: 'conv_lisi', from: 'USER', fromName: 'lisi' },
  { id: 'conv_wangwu', from: 'USER', fromName: 'wangwu' }
]

export const messages = [
  { id: '1', conversationId: 'conv_zhangsan', sender: 'USER', senderName: 'zhangsan', content: '你好，请问我的订单什么时候发货？', isRead: 0, createTime: '2026-09-18 09:10:00' },
  { id: '2', conversationId: 'conv_zhangsan', sender: 'ADMIN', senderName: 'admin', content: '您好，仓库今天下午会安排发出，请留意物流信息。', isRead: 1, createTime: '2026-09-18 09:18:00' },
  { id: '3', conversationId: 'conv_zhangsan', sender: 'USER', senderName: 'zhangsan', content: '好的，麻烦尽快，谢谢！', isRead: 0, createTime: '2026-09-18 09:25:00' },
  { id: '4', conversationId: 'conv_lisi', sender: 'USER', senderName: 'lisi', content: '伊利纯牛奶还有货吗？', isRead: 1, createTime: '2026-09-17 20:05:00' },
  { id: '5', conversationId: 'conv_lisi', sender: 'ADMIN', senderName: 'admin', content: '有的，库存充足，可以直接下单。', isRead: 1, createTime: '2026-09-17 20:12:00' },
  { id: '6', conversationId: 'conv_wangwu', sender: 'USER', senderName: 'wangwu', content: '我的账号为什么被禁用了？', isRead: 0, createTime: '2026-09-18 08:50:00' }
]

// ==================== 自增主键 ====================
let messageSeq = messages.length
let addressSeq = addresses.length
let orderItemSeq = orders.reduce((max, o) => Math.max(max, ...o.items.map(i => i.id)), 0)

export const nextMessageId = () => String(++messageSeq)
export const nextAddressId = () => ++addressSeq
export const nextOrderItemId = () => ++orderItemSeq

// ==================== 响应包装 ====================
export const ok = (data = null) => ({ code: 1, msg: null, data })
export const fail = (msg) => ({ code: 0, msg, data: null })

export const pageResult = (records, currentPage = 1, size = 10) => {
  const page = Number(currentPage) || 1
  const pageSize = Number(size) || 10
  const start = (page - 1) * pageSize
  return {
    records: records.slice(start, start + pageSize),
    total: records.length,
    page,
    size: pageSize,
    totalPages: Math.ceil(records.length / pageSize)
  }
}

// ==================== 请求解析 ====================
export const getQuery = (url) => {
  const query = {}
  const raw = url.split('?')[1]
  if (!raw) return query
  raw.split('&').forEach(pair => {
    const [key, value] = pair.split('=')
    if (key) query[decodeURIComponent(key)] = decodeURIComponent(value || '')
  })
  return query
}

export const pathOf = (url) => url.split('?')[0]

export const getBody = (options) => {
  if (typeof options.body !== 'string') return {}
  try {
    return JSON.parse(options.body) || {}
  } catch (e) {
    return {}
  }
}

// ==================== 时间工具 ====================
export const now = () => {
  const date = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
