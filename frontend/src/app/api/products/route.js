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

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const products = readProducts()
  const filtered = category ? products.filter(p => p.category === category) : products
  return Response.json(filtered)
} 