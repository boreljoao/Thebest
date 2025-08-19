import fs from 'fs'
import path from 'path'

const ordersFile = path.join(process.cwd(), 'src', 'data', 'order.json')
const productsFile = path.join(process.cwd(), 'src', 'data', 'products.json')

function readJson(file, fallback = []) {
  try {
    const raw = fs.readFileSync(file, 'utf-8')
    if (!raw.trim()) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return []
  return items
    .map(it => ({ productId: Number(it.productId), quantity: Math.max(0, parseInt(it.quantity || 0, 10)) }))
    .filter(it => Number.isFinite(it.productId))
}

export async function GET(_req, { params }) {
  const id = Number(params.id)
  const orders = readJson(ordersFile, [])
  const order = orders.find(o => o.id === id)
  if (!order) return new Response('Not Found', { status: 404 })
  return Response.json(order)
}

export async function DELETE(_req, { params }) {
  const id = Number(params.id)
  const orders = readJson(ordersFile, [])
  const order = orders.find(o => o.id === id)
  if (!order) return new Response(JSON.stringify({ error: 'Pedido não encontrado' }), { status: 404 })

  const products = readJson(productsFile, [])
  // devolve estoque
  for (const it of (order.items || [])) {
    const p = products.find(pr => pr.id === it.productId)
    if (p) p.stock += (it.quantity || 0)
  }
  writeJson(productsFile, products)

  const nextOrders = orders.filter(o => o.id !== id)
  writeJson(ordersFile, nextOrders)
  return Response.json({ success: true })
}

export async function PUT(req, { params }) {
  const id = Number(params.id)
  const body = await req.json()
  const orders = readJson(ordersFile, [])
  const orderIndex = orders.findIndex(o => o.id === id)
  if (orderIndex === -1) return new Response(JSON.stringify({ error: 'Pedido não encontrado' }), { status: 404 })

  const original = orders[orderIndex]
  const newName = typeof body.name === 'string' ? body.name : original.name
  const newEmail = typeof body.email === 'string' ? body.email : original.email
  const newItems = normalizeItems(body.items ?? original.items)

  const products = readJson(productsFile, [])

  // calcula diferenças por produto
  const productIds = Array.from(new Set([...(original.items||[]).map(i=>i.productId), ...newItems.map(i=>i.productId)]))
  const deltas = productIds.map(pid => {
    const oldQty = (original.items || []).find(i => i.productId === pid)?.quantity || 0
    const newQty = newItems.find(i => i.productId === pid)?.quantity || 0
    return { productId: pid, delta: newQty - oldQty }
  })

  // valida estoque para aumentos
  for (const { productId, delta } of deltas) {
    if (delta > 0) {
      const p = products.find(pr => pr.id === productId)
      if (!p) return new Response(JSON.stringify({ error: `Produto ${productId} inexistente` }), { status: 400 })
      if (p.stock < delta) return new Response(JSON.stringify({ error: `Sem estoque para aumentar ${p.title}` }), { status: 409 })
    }
  }

  // aplica deltas no estoque
  for (const { productId, delta } of deltas) {
    const p = products.find(pr => pr.id === productId)
    if (!p) continue
    if (delta > 0) p.stock -= delta
    if (delta < 0) p.stock += (-delta)
  }

  // recalcula total
  let total = 0
  for (const it of newItems) {
    const p = products.find(pr => pr.id === it.productId)
    if (!p) continue
    total += p.price * it.quantity
  }

  // persiste
  writeJson(productsFile, products)
  const updated = {
    ...original,
    name: newName,
    email: newEmail,
    items: newItems.filter(i => i.quantity > 0),
    total
  }
  orders[orderIndex] = updated
  writeJson(ordersFile, orders)

  return Response.json({ success: true, order: updated })
} 