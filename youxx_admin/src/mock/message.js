/**
 * 消息接口 Mock
 * 对应 YouxxAPi.json 中的「消息」标签：用户与管理员之间的在线客服会话
 *
 * 会话列表由消息动态聚合，未读数按「用户发来的未读消息」统计，与后端管理员视角一致。
 */
import Mock from 'mockjs'
import { messages, conversations, session, ok, fail, getBody, pathOf, nextMessageId, now } from './db'

const segmentFrom = (url, fromEnd = 1) => {
  const segments = pathOf(url).split('/')
  return decodeURIComponent(segments[segments.length - fromEnd])
}

const messagesOf = (conversationId) => messages
  .filter(m => m.conversationId === conversationId)
  .sort((a, b) => a.createTime.localeCompare(b.createTime))

const buildConversations = () => conversations
  .map(conv => {
    const list = messagesOf(conv.id)
    const last = list[list.length - 1]
    return {
      id: conv.id,
      from: conv.from,
      fromName: conv.fromName,
      lastMessage: last ? last.content : '',
      lastTime: last ? last.createTime : '',
      unreadCount: list.filter(m => m.sender === 'USER' && m.isRead === 0).length
    }
  })
  .sort((a, b) => b.lastTime.localeCompare(a.lastTime))

Mock.mock(/\/api\/message\/conversations$/, 'get', () => ok(buildConversations()))

Mock.mock(/\/api\/message\/unread-count$/, 'get', () => {
  const total = messages.filter(m => m.sender === 'USER' && m.isRead === 0).length
  return ok(total)
})

Mock.mock(/\/api\/message\/conversation\/([^/?]+)\/read$/, 'put', (options) => {
  const conversationId = segmentFrom(options.url, 2)
  messages.forEach(m => {
    if (m.conversationId === conversationId && m.sender === 'USER') m.isRead = 1
  })
  return ok()
})

Mock.mock(/\/api\/message\/read-all$/, 'put', () => {
  messages.forEach(m => {
    if (m.sender === 'USER') m.isRead = 1
  })
  return ok()
})

Mock.mock(/\/api\/message\/conversation\/([^/?]+)(\?.*)?$/, 'get', (options) => {
  return ok(messagesOf(segmentFrom(options.url)))
})

Mock.mock(/\/api\/message\/send$/, 'post', (options) => {
  const { conversationId, content } = getBody(options)
  if (!content) return fail('消息内容不能为空')

  const isAdmin = session.user?.role === 'ADMIN'
  const senderName = session.user?.username || (isAdmin ? 'admin' : 'user')
  // 未传会话 ID 时，按 conv_{用户名} 兜底生成（用户首次发起会话）
  const id = conversationId || `conv_${senderName}`

  if (!conversations.some(c => c.id === id)) {
    conversations.push({ id, from: isAdmin ? 'ADMIN' : 'USER', fromName: senderName })
  }

  const message = {
    id: nextMessageId(),
    conversationId: id,
    sender: isAdmin ? 'ADMIN' : 'USER',
    senderName,
    content,
    isRead: isAdmin ? 1 : 0,
    createTime: now()
  }
  messages.push(message)
  return ok(message)
})
