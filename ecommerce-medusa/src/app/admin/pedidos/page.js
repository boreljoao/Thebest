'use client'
import { useEffect, useState } from 'react'

export default function PedidosPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(setOrders)
  }, [])

  return (
    <div className='container'>
      <h1>Pedidos</h1>
      <ul>
        {orders.map(o => (
          <li key={o.id}>{o.name} - {o.email}</li>
        ))}
      </ul>
    </div>
  )
}