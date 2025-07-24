import fs from 'fs'
import path from 'path'

const ordersFile = path.join(process.cwd(), 'src', 'data', 'orders.json')
const inventoryFile = path.join(process.cwd(), 'src', 'data', 'inventory.json')

export async function GET() {
  const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'))
  return Response.json(orders)
}

export async function POST(req) {
  const order = await req.json()
  const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'))
  orders.push({ id: Date.now(), ...order })
  fs.writeFileSync(ordersFile, JSON.stringify(orders))
  const inv = JSON.parse(fs.readFileSync(inventoryFile, 'utf-8'))
  if (inv.available > 0) inv.available -= 1
  fs.writeFileSync(inventoryFile, JSON.stringify(inv))
  return Response.json({ success: true })
}