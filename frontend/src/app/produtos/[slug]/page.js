'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import '../../styles/produto.css'

export default function ProdutoPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/products/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [slug])

  function addToCart() {
    const current = JSON.parse(localStorage.getItem('cart') || '[]')
    const i = current.findIndex(it => it.productId === product.id)
    if (i >= 0) current[i].quantity += 1
    else current.push({ productId: product.id, quantity: 1 })
    localStorage.setItem('cart', JSON.stringify(current))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cart:updated'))
    }
  }

  if (loading) return <div className='container' style={{ padding: 24 }}>Carregando...</div>
  if (!product) return <div className='container' style={{ padding: 24 }}>Produto não encontrado</div>

  return (
    <div className='container' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '36px 0' }}>
      <img src={product.image} alt={product.title} style={{ width: '100%', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,.10)', objectFit: 'cover', maxHeight: 480 }} />
      <div>
        <h1 style={{ marginBottom: 8 }}>{product.title}</h1>
        <p style={{ color: '#666', marginBottom: 12 }}>{product.description}</p>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 16 }}>R$ {product.price.toFixed(2)}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className='btn btn-primary' onClick={addToCart} disabled={product.stock <= 0}>Adicionar ao carrinho</button>
          <a className='btn btn-outline' href='/checkout'>Comprar agora</a>
        </div>
      </div>
    </div>
  )
}