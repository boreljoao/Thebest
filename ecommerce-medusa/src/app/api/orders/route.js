import fs from 'fs'
import path from 'path'

const ordersFile = path.join(process.cwd(), 'src', 'data', 'order.json')
const inventoryFile = path.join(process.cwd(), 'src', 'data', 'inventory.json')

function safeReadJson(file) {
  try {
    const content = fs.readFileSync(file, 'utf-8')
    if (!content.trim()) return []
    return JSON.parse(content)
  } catch {
    return []
  }
}

export async function GET() {
  const orders = safeReadJson(ordersFile)
  return Response.json(orders)
}

export async function POST(req) {
  const order = await req.json()
  if (order.limpar) {
    fs.writeFileSync(ordersFile, '[]')
    return Response.json({ success: true })
  }
  const orders = safeReadJson(ordersFile)
  const now = new Date().toISOString()
  const quantidade = order.quantidade || 1
  orders.push({ id: Date.now(), ...order, quantidade, hora: now })
  fs.writeFileSync(ordersFile, JSON.stringify(orders))
  const inv = JSON.parse(fs.readFileSync(inventoryFile, 'utf-8'))
  if (inv.available > 0) inv.available -= quantidade
  fs.writeFileSync(inventoryFile, JSON.stringify(inv))
  return Response.json({ success: true })
}