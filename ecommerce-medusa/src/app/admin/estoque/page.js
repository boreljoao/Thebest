'use client'
import { useEffect, useState } from 'react'

export default function EstoquePage() {
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
    fetch(`${base}/admin/products`)
      .then(res => res.json())
      .then(data => setProdutos(data.products || []))
  }, [])

  return (
    <div className="container">
      <h1>Gerenciar Estoque</h1>
      <ul>
        {produtos.map(p => (
          <li key={p.id}>{p.title} - {p.variants[0].inventory_quantity}</li>
        ))}
      </ul>
    </div>
  )
}
