'use client'
import { useEffect, useState } from 'react'

export default function PedidosPage() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const [o, p] = await Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/products').then(r => r.json())
    ])
    setOrders(o)
    setProducts(p)
    setLoading(false)
  }

  const findProduct = (id) => products.find(p => p.id === id)

  async function updateItemQty(orderId, productId, delta) {
    const order = orders.find(o => o.id === orderId)
    if (!order) return
    const items = [...(order.items || [])]
    const idx = items.findIndex(i => i.productId === productId)
    if (idx === -1) return
    const nextQty = Math.max(0, (items[idx].quantity || 0) + delta)
    items[idx] = { ...items[idx], quantity: nextQty }
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    })
    if (res.ok) await load()
    else alert('Falha ao atualizar pedido')
  }

  async function removeOrder(orderId) {
    if (!confirm('Remover este pedido?')) return
    const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' })
    if (res.ok) await load()
    else alert('Falha ao remover pedido')
  }

  // ===== Criação de novo pedido =====
  const [newOrder, setNewOrder] = useState({ name: '', email: '', items: [] })
  const [selProductId, setSelProductId] = useState('')
  const [selQty, setSelQty] = useState(1)

  function addItemToNewOrder() {
    const pid = Number(selProductId)
    const qty = Math.max(1, parseInt(selQty || 1, 10))
    if (!pid) return
    const existsIndex = newOrder.items.findIndex(i => i.productId === pid)
    const items = [...newOrder.items]
    if (existsIndex >= 0) items[existsIndex] = { ...items[existsIndex], quantity: items[existsIndex].quantity + qty }
    else items.push({ productId: pid, quantity: qty })
    setNewOrder({ ...newOrder, items })
    setSelProductId('')
    setSelQty(1)
  }

  function removeItemFromNewOrder(pid) {
    setNewOrder({ ...newOrder, items: newOrder.items.filter(i => i.productId !== pid) })
  }

  const newTotal = newOrder.items.reduce((acc, it) => {
    const p = findProduct(it.productId)
    return acc + (p ? p.price * it.quantity : 0)
  }, 0)

  async function createOrder() {
    if (!newOrder.name || !newOrder.email || newOrder.items.length === 0) {
      alert('Preencha nome, email e ao menos um item.')
      return
    }
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    })
    if (res.ok) {
      setNewOrder({ name: '', email: '', items: [] })
      await load()
    } else {
      const msg = await res.text()
      alert('Falha ao criar pedido: ' + msg)
    }
  }

  // ===== Edição de nome/email em pedidos =====
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  function startEditMeta(o) {
    setEditingId(o.id)
    setEditName(o.name || '')
    setEditEmail(o.email || '')
  }
  function cancelEditMeta() {
    setEditingId(null)
    setEditName('')
    setEditEmail('')
  }
  async function saveEditMeta(orderId) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, email: editEmail })
    })
    if (res.ok) {
      cancelEditMeta()
      await load()
    } else {
      alert('Falha ao salvar dados do cliente')
    }
  }

  return (
    <div className='container' style={{ padding: '24px 0' }}>
      <h1>Pedidos</h1>

      {/* Criar novo pedido */}
      <div className='card' style={{ padding: 16, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12 }}>Criar novo pedido</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <input className='input' placeholder='Nome do cliente' value={newOrder.name} onChange={e => setNewOrder({ ...newOrder, name: e.target.value })} />
          <input className='input' placeholder='Email do cliente' value={newOrder.email} onChange={e => setNewOrder({ ...newOrder, email: e.target.value })} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
          <select className='input' style={{ maxWidth: 360 }} value={selProductId} onChange={e => setSelProductId(e.target.value)}>
            <option value=''>Selecione um produto</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.title} · R$ {p.price.toFixed(2)} · estoque {p.stock}</option>
            ))}
          </select>
          <input className='input' type='number' min={1} value={selQty} onChange={e => setSelQty(e.target.value)} style={{ width: 120 }} />
          <button className='btn btn-primary' onClick={addItemToNewOrder}>Adicionar item</button>
        </div>
        {newOrder.items.length > 0 && (
          <div style={{ borderTop: '1px solid #eee', paddingTop: 8 }}>
            {newOrder.items.map(it => {
              const p = findProduct(it.productId)
              if (!p) return null
              return (
                <div key={it.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>{p.title} · Qtd: {it.quantity}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span>R$ {(p.price * it.quantity).toFixed(2)}</span>
                    <button className='btn btn-outline' onClick={() => removeItemFromNewOrder(it.productId)}>Remover</button>
                  </div>
                </div>
              )
            })}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <b>Total</b>
              <b>R$ {newTotal.toFixed(2)}</b>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button className='btn btn-primary' onClick={createOrder} disabled={!newOrder.name || !newOrder.email || newOrder.items.length === 0}>Criar pedido</button>
        </div>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : orders.length === 0 ? (
        <div>Nenhum pedido</div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {orders.map(o => (
            <div key={o.id} className='card' style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>#{o.id}</div>
                  {editingId === o.id ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input className='input' value={editName} onChange={e => setEditName(e.target.value)} />
                      <input className='input' value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                    </div>
                  ) : (
                    <div style={{ color: '#666' }}>{o.name} · {o.email}</div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div><b>Total:</b> R$ {Number(o.total || 0).toFixed(2)}</div>
                  <div style={{ color: '#666' }}>{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                {editingId === o.id ? (
                  <>
                    <button className='btn btn-primary' onClick={() => saveEditMeta(o.id)}>Salvar</button>
                    <button className='btn btn-outline' onClick={cancelEditMeta}>Cancelar</button>
                  </>
                ) : (
                  <button className='btn btn-outline' onClick={() => startEditMeta(o)}>Editar pedido</button>
                )}
              </div>
              <div style={{ borderTop: '1px solid #eee', paddingTop: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#666', fontSize: 13 }}>
                      <th style={{ padding: '6px 4px' }}>Produto</th>
                      <th style={{ padding: '6px 4px' }}>Qtd</th>
                      <th style={{ padding: '6px 4px' }}>Preço</th>
                      <th style={{ padding: '6px 4px' }}>Subtotal</th>
                      <th style={{ padding: '6px 4px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(o.items || []).map((it, idx) => {
                      const p = findProduct(it.productId)
                      const qty = it.quantity || 1
                      const unit = p ? p.price : 0
                      const sub = unit * qty
                      return (
                        <tr key={idx}>
                          <td style={{ padding: '6px 4px' }}>{p ? p.title : `Produto ${it.productId}`}</td>
                          <td style={{ padding: '6px 4px' }}>
                            {editingId === o.id ? (
                              <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                                <button className='btn btn-outline' onClick={() => updateItemQty(o.id, it.productId, -1)}>-</button>
                                <span>{qty}</span>
                                <button className='btn btn-primary' onClick={() => updateItemQty(o.id, it.productId, +1)}>+</button>
                              </div>
                            ) : (
                              <span>{qty}</span>
                            )}
                          </td>
                          <td style={{ padding: '6px 4px' }}>R$ {unit.toFixed(2)}</td>
                          <td style={{ padding: '6px 4px' }}>R$ {sub.toFixed(2)}</td>
                          <td style={{ padding: '6px 4px' }}>
                            {editingId === o.id && qty > 0 && (
                              <button className='btn btn-outline' onClick={() => updateItemQty(o.id, it.productId, -qty)}>Remover item</button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <div></div>
                <button className='btn btn-outline' onClick={() => removeOrder(o.id)}>Excluir pedido</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}