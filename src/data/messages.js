// 消息数据
const MESSAGES_KEY = 'systemMessages'
const MESSAGES_VERSION_KEY = 'systemMessagesVersion'
const CURRENT_VERSION = 1

// 模拟消息数据
const defaultMessages = [
  {
    id: 'msg001',
    from: 'user',
    fromName: '张三',
    avatar: '',
    content: '您好，我想咨询一下订单 ORD001 的发货情况',
    time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 分钟前
    isRead: false,
    conversationId: 'conv001'
  },
  {
    id: 'msg002',
    from: 'user',
    fromName: '李四',
    avatar: '',
    content: '请问产品 P003 什么时候有货？',
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 分钟前
    isRead: false,
    conversationId: 'conv002'
  },
  {
    id: 'msg003',
    from: 'user',
    fromName: '王五',
    avatar: '',
    content: '我的订单已经催单 3 次了，请尽快处理',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 小时前
    isRead: false,
    conversationId: 'conv003'
  },
  {
    id: 'msg004',
    from: 'user',
    fromName: '赵六',
    avatar: '',
    content: '谢谢您的帮助，问题已经解决了',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 小时前
    isRead: true,
    conversationId: 'conv004'
  },
  {
    id: 'msg005',
    from: 'user',
    fromName: '孙七',
    avatar: '',
    content: '我想批量采购一批商品，有优惠吗？',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 天前
    isRead: true,
    conversationId: 'conv005'
  }
]

export const getMessages = () => {
  const savedVersion = localStorage.getItem(MESSAGES_VERSION_KEY)
  const messagesStr = localStorage.getItem(MESSAGES_KEY)
  
  if (messagesStr && savedVersion === String(CURRENT_VERSION)) {
    return JSON.parse(messagesStr)
  }
  
  saveMessages(defaultMessages)
  localStorage.setItem(MESSAGES_VERSION_KEY, String(CURRENT_VERSION))
  return defaultMessages
}

export const saveMessages = (messages) => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
}

export const getUnreadCount = () => {
  const messages = getMessages()
  return messages.filter(m => !m.isRead).length
}

export const markMessageAsRead = (messageId) => {
  const messages = getMessages()
  const msg = messages.find(m => m.id === messageId)
  if (msg) {
    msg.isRead = true
    saveMessages(messages)
    return true
  }
  return false
}

export const markConversationAsRead = (conversationId) => {
  const messages = getMessages()
  let hasChanges = false
  messages.forEach(msg => {
    if (msg.conversationId === conversationId && !msg.isRead) {
      msg.isRead = true
      hasChanges = true
    }
  })
  if (hasChanges) {
    saveMessages(messages)
  }
}

export const sendMessage = (conversationId, from, fromName, content) => {
  const messages = getMessages()
  const newMessage = {
    id: `msg${Date.now()}`,
    from,
    fromName,
    avatar: '',
    content,
    time: new Date().toISOString(),
    isRead: false,
    conversationId
  }
  messages.push(newMessage)
  saveMessages(messages)
  return newMessage
}

export const getConversations = () => {
  const messages = getMessages()
  const conversations = {}
  
  messages.forEach(msg => {
    if (!conversations[msg.conversationId]) {
      conversations[msg.conversationId] = {
        id: msg.conversationId,
        from: msg.from,
        fromName: msg.fromName,
        avatar: msg.avatar,
        lastMessage: msg.content,
        lastTime: msg.time,
        unreadCount: 0
      }
    }
    if (!msg.isRead && msg.from !== 'admin') {
      conversations[msg.conversationId].unreadCount++
    }
    // 更新最后一条消息
    if (new Date(msg.time) > new Date(conversations[msg.conversationId].lastTime)) {
      conversations[msg.conversationId].lastMessage = msg.content
      conversations[msg.conversationId].lastTime = msg.time
    }
  })
  
  return Object.values(conversations).sort((a, b) => 
    new Date(b.lastTime) - new Date(a.lastTime)
  )
}

export const getConversationMessages = (conversationId) => {
  const messages = getMessages()
  return messages
    .filter(msg => msg.conversationId === conversationId)
    .sort((a, b) => new Date(a.time) - new Date(b.time))
}
