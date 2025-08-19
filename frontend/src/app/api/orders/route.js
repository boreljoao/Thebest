import fs from 'fs'
import path from 'path'

const ordersFile = path.join(process.cwd(), 'src', 'data', 'order.json')
const productsFile = path.join(process.cwd(), 'src', 'data', 'products.json')

function safeReadJson(file, fallback = []) {
  try {
    const content = fs.readFileSync(file, 'utf-8')
    if (!content.trim()) return fallback
    return JSON.parse(content)
  } catch {
    return fallback
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

export async function GET() {
  const orders = safeReadJson(ordersFile, [])
  return Response.json(orders)
}

export async function POST(req) {
  const body = await req.json()
  const { name, email, items } = body

  if (body.limpar) {
    writeJson(ordersFile, [])
    return Response.json({ success: true })
  }

  if (!Array.isArray(items) || items.length === 0) {
    return new Response(JSON.stringify({ error: 'Carrinho vazio' }), { status: 400 })
  }

  const products = safeReadJson(productsFile, [])

  // Valida itens e calcula total
  let total = 0
  const updatedProducts = products.map(p => ({ ...p }))

  for (const item of items) {
    const product = updatedProducts.find(p => p.id === item.productId)
    if (!product) {
      return new Response(JSON.stringify({ error: `Produto ${item.productId} inexistente` }), { status: 400 })
    }
    const qty = Math.max(1, parseInt(item.quantity || 1, 10))
    if (product.stock < qty) {
      return new Response(JSON.stringify({ error: `Sem estoque para ${product.title}` }), { status: 409 })
    }
    total += product.price * qty
  }

  // Debita estoque
  for (const item of items) {
    const product = updatedProducts.find(p => p.id === item.productId)
    product.stock -= Math.max(1, parseInt(item.quantity || 1, 10))
  }

  // Persiste
  writeJson(productsFile, updatedProducts)

  const orders = safeReadJson(ordersFile, [])
  const now = new Date().toISOString()
  const order = {
    id: Date.now(),
    name,
    email,
    items,
    total,
    createdAt: now
  }
  orders.push(order)
  writeJson(ordersFile, orders)

  return Response.json({ success: true, orderId: order.id })
}