'use client'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const [p, o] = await Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/orders').then(r => r.json())
    ])
    setProducts(p)
    setOrders(o)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function handleLimparPedidos() {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limpar: true })
    })
    fetchData()
  }

  return (
    <div className="container" style={{ maxWidth: 900, margin: '40px auto' }}>
      <h1>Painel Admin</h1>

      <h2>Estoque por produto</h2>
      <div className='card' style={{ padding: 16, marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#666', fontSize: 13 }}>
              <th style={{ padding: '6px 4px' }}>Produto</th>
              <th style={{ padding: '6px 4px' }}>Categoria</th>
              <th style={{ padding: '6px 4px' }}>Preço</th>
              <th style={{ padding: '6px 4px' }}>Estoque</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ padding: '6px 4px' }}>{p.title}</td>
                <td style={{ padding: '6px 4px', textTransform: 'capitalize' }}>{p.category}</td>
                <td style={{ padding: '6px 4px' }}>R$ {p.price.toFixed(2)}</td>
                <td style={{ padding: '6px 4px' }}>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Pedidos</h2>
      <a className='btn btn-outline' href='/admin/pedidos' style={{ marginBottom: 12 }}>Ir para gestão detalhada de pedidos</a>
      {loading ? <div>Carregando...</div> : (
        <div style={{ display: 'grid', gap: 16 }}>
          {orders.length === 0 && <div>Nenhum pedido</div>}
          {orders.map(o => (
            <div key={o.id} className='card' style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>#{o.id}</div>
                  <div style={{ color: '#666' }}>{o.name} · {o.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div><b>Total:</b> R$ {Number(o.total || 0).toFixed(2)}</div>
                  <div style={{ color: '#666' }}>{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #eee', paddingTop: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#666', fontSize: 13 }}>
                      <th style={{ padding: '6px 4px' }}>Produto</th>
                      <th style={{ padding: '6px 4px' }}>Qtd</th>
                      <th style={{ padding: '6px 4px' }}>Preço</th>
                      <th style={{ padding: '6px 4px' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(o.items || []).map((it, idx) => {
                      const p = products.find(pr => pr.id === it.productId)
                      const qty = it.quantity || 1
                      const unit = p ? p.price : 0
                      const sub = unit * qty
                      return (
                        <tr key={idx}>
                          <td style={{ padding: '6px 4px' }}>{p ? p.title : `Produto ${it.productId}`}</td>
                          <td style={{ padding: '6px 4px' }}>{qty}</td>
                          <td style={{ padding: '6px 4px' }}>R$ {unit.toFixed(2)}</td>
                          <td style={{ padding: '6px 4px' }}>R$ {sub.toFixed(2)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 