'use client'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [estoque, setEstoque] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  // Carrega estoque e pedidos
  const fetchData = async () => {
    setLoading(true)
    const invRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory`, {
      headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}` }
    })
    const inv = await invRes.json()
    setEstoque(inv.available)
    const ordRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}` }
    })
    const ord = await ordRes.json()
    setOrders(ord)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Adiciona 1 ao estoque
  const handleAddEstoque = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`
      },
      body: JSON.stringify({ set: estoque + 1 })
    })
    fetchData()
  }

  // Remove 1 do estoque
  const handleRemoveEstoque = async () => {
    if (estoque > 0) {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`
        },
        body: JSON.stringify({ set: estoque - 1 })
      })
      fetchData()
    }
  }

  // Zera o estoque
  const handleZerarEstoque = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`
      },
      body: JSON.stringify({ set: 0 })
    })
    fetchData()
  }

  // Limpa todos os pedidos
  const handleLimparPedidos = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`
      },
      body: JSON.stringify({ limpar: true })
    })
    fetchData()
  }

  return (
    <div className="container" style={{maxWidth: 700, margin: '40px auto'}}>
      <h1>Painel Admin</h1>
      <h2>Estoque</h2>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18}}>
        <span style={{fontSize: 20}}>Vale Teste: <b>{estoque !== null ? estoque : '...'}</b></span>
        <button onClick={handleAddEstoque}>+1</button>
        <button onClick={handleRemoveEstoque} disabled={estoque === 0}>-1</button>
        <button onClick={handleZerarEstoque}>Zerar</button>
      </div>
      <h2>Pedidos</h2>
      <button onClick={handleLimparPedidos} style={{marginBottom: 10}}>Limpar todos os pedidos</button>
      <ul style={{background: '#fafafa', borderRadius: 8, padding: 16}}>
        {orders.length === 0 && <li>Nenhum pedido</li>}
        {orders.map(o => (
          <li key={o.id} style={{marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 6}}>
            <b>{o.name}</b> - {o.email} <br/>
            <span>Quantidade: {o.quantidade || 1}</span> <br/>
            <span>Hora: {o.hora ? new Date(o.hora).toLocaleString() : '-'}</span>
          </li>
        ))}
      </ul>
      {loading && <div>Carregando...</div>}
    </div>
  )
} 