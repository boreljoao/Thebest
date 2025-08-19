'use client'
import { useEffect, useState } from 'react'
import '../styles/produto.css'

export default function ProdutosPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
      .finally(() => setLoading(false))
    const saved = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(saved)
  }, [])

  function saveCart(next) {
    setCart(next)
    localStorage.setItem('cart', JSON.stringify(next))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cart:updated'))
    }
  }

  function addToCart(productId) {
    const next = [...cart]
    const i = next.findIndex(it => it.productId === productId)
    if (i >= 0) next[i].quantity += 1
    else next.push({ productId, quantity: 1 })
    saveCart(next)
  }

  return (
    <div className="container" style={{ padding: '32px 0' }}>
      <h1 style={{ marginBottom: 16 }}>Produtos</h1>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {products.map(p => (
            <article key={p.id} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,.06)' }}>
              <img src={p.image} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              <div style={{ padding: 16 }}>
                <h3 style={{ marginBottom: 6 }}>{p.title}</h3>
                <p style={{ color: '#666', fontSize: 14, marginBottom: 10 }}>{p.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ color: 'var(--color-primary)' }}>R$ {p.price.toFixed(2)}</strong>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" onClick={() => addToCart(p.id)} disabled={p.stock <= 0}>Adicionar</button>
                    <a className='btn btn-outline' href='/checkout'>Comprar</a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}