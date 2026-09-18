/**
 * 商品接口 Mock
 * 对应 YouxxAPi.json 中的「商品」标签：商品查询、分类，以及管理员侧的商品维护
 */
import Mock from 'mockjs'
import { products, categories, ok, fail, pageResult, getQuery, getBody, pathOf, now } from './db'

// 上传图片时复用已有的本地图片资源（真实后端会按分类落盘并返回新路径）
const CATEGORY_SAMPLE_IMAGE = {
  drinks: 'drinks/water.png',
  snacks: 'snacks/chips.png',
  daily: 'daily/tissue.png',
  fresh: 'fresh/eggs.png',
  dairy: 'dairy/milk.png',
  instant: 'instant/noodles.png'
}

const segmentFrom = (url, fromEnd = 1) => {
  const segments = pathOf(url).split('/')
  return decodeURIComponent(segments[segments.length - fromEnd])
}

// ==================== 分类 ====================
Mock.mock(/\/api\/product\/category\/list(\?.*)?$/, 'get', () => ok(categories))

// ==================== 图片上传 ====================
Mock.mock(/\/api\/product\/upload$/, 'post', (options) => {
  const { categoryId } = getQuery(options.url)
  const sample = CATEGORY_SAMPLE_IMAGE[categoryId] || 'snacks/chips.png'
  return ok({ url: `/upload_resources/products/${sample}` })
})

// ==================== 批量上下架 ====================
Mock.mock(/\/api\/product\/batch\/status$/, 'put', (options) => {
  const { ids, status } = getBody(options)
  if (!Array.isArray(ids) || !status) return fail('参数校验失败')

  products.forEach(p => {
    if (ids.includes(p.id)) {
      p.status = status
      p.updateTime = now()
    }
  })
  return ok()
})

// ==================== 商品列表 / 热销 ====================
Mock.mock(/\/api\/product\/list(\?.*)?$/, 'get', (options) => {
  const { keyword, categoryId, status, page, size } = getQuery(options.url)
  let result = [...products]

  if (keyword) {
    const kw = keyword.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(kw))
  }
  if (categoryId) result = result.filter(p => p.categoryId === categoryId)
  if (status) result = result.filter(p => p.status === status)

  return ok(pageResult(result, page, size))
})

Mock.mock(/\/api\/product\/hot(\?.*)?$/, 'get', () => {
  return ok(products.filter(p => p.isHot && p.status === 'ONSHELF'))
})

// ==================== 商品详情 / 新增 ====================
Mock.mock(/\/api\/product\/(?!list|hot|category|upload|batch)([^/?]+)(\?.*)?$/, 'get', (options) => {
  const product = products.find(p => p.id === segmentFrom(options.url))
  return product ? ok(product) : fail('商品不存在')
})

Mock.mock(/\/api\/product$/, 'post', (options) => {
  const body = getBody(options)
  if (!body.id || !body.name || !body.categoryId) return fail('参数校验失败')
  if (products.some(p => p.id === body.id)) return fail('商品 ID 已存在')

  const product = {
    id: body.id,
    name: body.name,
    categoryId: body.categoryId,
    price: Number(body.price) || 0,
    unit: body.unit || '件',
    stock: Number(body.stock) || 0,
    imageUrl: body.imageUrl || '',
    description: body.description || '',
    barCode: body.barCode || '',
    discount: body.discount ?? 1,
    isHot: !!body.isHot,
    tags: body.tags || '',
    status: body.status || 'ONSHELF',
    createTime: now(),
    updateTime: now()
  }
  products.push(product)
  return ok(product)
})

// ==================== 商品编辑 / 上下架 / 折扣 / 删除 ====================
Mock.mock(/\/api\/product\/(?!batch)([^/?]+)\/status$/, 'put', (options) => {
  const id = segmentFrom(options.url, 2)
  const product = products.find(p => p.id === id)
  if (!product) return fail('商品不存在')

  product.status = getBody(options).status
  product.updateTime = now()
  return ok()
})

Mock.mock(/\/api\/product\/([^/?]+)\/discount$/, 'put', (options) => {
  const id = segmentFrom(options.url, 2)
  const product = products.find(p => p.id === id)
  if (!product) return fail('商品不存在')

  product.discount = getBody(options).discount
  product.updateTime = now()
  return ok()
})

Mock.mock(/\/api\/product\/(?!list|hot|category|upload|batch)([^/?]+)(\?.*)?$/, 'put', (options) => {
  const id = segmentFrom(options.url)
  const product = products.find(p => p.id === id)
  if (!product) return fail('商品不存在')

  Object.assign(product, getBody(options), { id: product.id, updateTime: now() })
  return ok(product)
})

Mock.mock(/\/api\/product\/(?!list|hot|category|upload|batch)([^/?]+)(\?.*)?$/, 'delete', (options) => {
  const id = segmentFrom(options.url)
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return fail('商品不存在')

  products.splice(index, 1)
  return ok()
})
