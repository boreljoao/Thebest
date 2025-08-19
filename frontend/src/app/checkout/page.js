'use client'
import { useEffect, useState } from 'react'
import '../styles/checkout.css'

export default function CheckoutPage() {
  const [form, setForm] = useState({ name: '', email: '' })
  const [done, setDone] = useState(false)
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setItems(cart)
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])

  const enriched = items.map(it => ({
    ...it,
    product: products.find(p => p.id === it.productId)
  })).filter(it => it.product)

  const total = enriched.reduce((acc, it) => acc + it.product.price * it.quantity, 0)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, items })
    })
    setSubmitting(false)
    if (res.ok) {
      setDone(true)
      localStorage.removeItem('cart')
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart:updated'))
      }
    }
  }

  if (done) return <div className='container' style={{ padding: 24 }}><h1>Pedido recebido!</h1></div>

  return (
    <div className='checkout-container'>
      <h1>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <form onSubmit={handleSubmit} className='checkout-form'>
          <input type='text' placeholder='Nome' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input type='email' placeholder='Email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <button type='submit' className='btn btn-primary' disabled={items.length === 0 || submitting}>
            {submitting ? 'Enviando...' : 'Finalizar'}
          </button>
        </form>
        <aside style={{ background: '#FAFAFA', border: '1px solid #EEE', borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Resumo</h3>
          {enriched.length === 0 ? (
            <div style={{ color: '#777' }}>Seu carrinho está vazio.</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {enriched.map(it => (
                <div key={it.productId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={it.product.image} alt={it.product.title} style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{it.product.title}</div>
                    <div style={{ color: '#666', fontSize: 13 }}>Qtd: {it.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 600 }}>R$ {(it.product.price * it.quantity).toFixed(2)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, borderTop: '1px solid #eee', paddingTop: 8 }}>
                <span>Total</span>
                <strong>R$ {total.toFixed(2)}</strong>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}