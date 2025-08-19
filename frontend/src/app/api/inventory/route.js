import fs from 'fs'
import path from 'path'

const file = path.join(process.cwd(), 'src', 'data', 'inventory.json')

export async function GET() {
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  return Response.json(data)
}

export async function POST(req) {
  const body = await req.json()
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  if (body.decrement) {
    if (data.available > 0) data.available -= 1
  }
  if (typeof body.set === 'number') {
    data.available = body.set
  }
  fs.writeFileSync(file, JSON.stringify(data))
  return Response.json(data)
}