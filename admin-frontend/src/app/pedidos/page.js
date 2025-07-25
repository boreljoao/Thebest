'use client'
import { useEffect, useState } from 'react'

export default function PedidosPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}` }
    })
      .then(r => r.json())
      .then(setOrders)
  }, [])

  return (
    <div className='container'>
      <h1>Pedidos</h1>
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            <b>{o.name}</b> - {o.email} <br/>
            <span>Quantidade: {o.quantidade || 1}</span> <br/>
            <span>Hora: {o.hora ? new Date(o.hora).toLocaleString() : '-'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}