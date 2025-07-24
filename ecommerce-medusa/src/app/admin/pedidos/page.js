'use client'
import { useEffect, useState } from 'react'

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
    fetch(`${base}/admin/orders`)
      .then(res => res.json())
      .then(data => setPedidos(data.orders || []))
  }, [])

  return (
    <div className="container">
      <h1>Pedidos</h1>
      <ul>
        {pedidos.map(p => (
          <li key={p.id}>{p.display_id} - {p.total / 100} {p.currency_code}</li>
        ))}
      </ul>
    </div>
  )
}
