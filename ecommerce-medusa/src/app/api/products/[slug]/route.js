import fs from 'fs'
import path from 'path'

const productsFile = path.join(process.cwd(), 'src', 'data', 'products.json')

function readProducts() {
  try {
    const raw = fs.readFileSync(productsFile, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}
function writeProducts(list) {
  fs.writeFileSync(productsFile, JSON.stringify(list, null, 2))
}

function findBySlugOrId(products, param) {
  const asNum = Number(param)
  if (Number.isFinite(asNum)) {
    const byId = products.find(p => p.id === asNum)
    if (byId) return byId
  }
  return products.find(p => p.slug === param)
}

export async function GET(_req, { params }) {
  const products = readProducts()
  const product = findBySlugOrId(products, params.slug)
  if (!product) return new Response('Not Found', { status: 404 })
  return Response.json(product)
}

export async function PUT(req, { params }) {
  const body = await req.json()
  const products = readProducts()
  const target = findBySlugOrId(products, params.slug)
  if (!target) return new Response(JSON.stringify({ error: 'Produto não encontrado' }), { status: 404 })
  const idx = products.findIndex(p => p.id === target.id)
  const next = { ...target }
  if (typeof body.stock === 'number' && Number.isFinite(body.stock)) next.stock = Math.max(0, Math.floor(body.stock))
  if (typeof body.deltaStock === 'number' && Number.isFinite(body.deltaStock)) next.stock = Math.max(0, Math.floor((next.stock ?? target.stock) + body.deltaStock))
  if (typeof body.price === 'number' && Number.isFinite(body.price)) next.price = body.price
  if (typeof body.title === 'string') next.title = body.title
  if (typeof body.category === 'string') next.category = body.category
  products[idx] = next
  writeProducts(products)
  return Response.json({ success: true, product: next })
} 