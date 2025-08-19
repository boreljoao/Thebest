'use client';

import Link from 'next/link'
import { useEffect, useState } from 'react'
import './styles/global.css'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')

  useEffect(() => {
    setLoading(true)
    const url = category ? `/api/products?category=${category}` : '/api/products'
    fetch(url)
      .then(r => r.json())
      .then(data => setProducts(data))
      .finally(() => setLoading(false))
  }, [category])

  const categories = [
    { key: '', label: 'Todos' },
    { key: 'aneis', label: 'Anéis' },
    { key: 'colares', label: 'Colares' },
    { key: 'brincos', label: 'Brincos' },
    { key: 'pulseiras', label: 'Pulseiras' }
  ]

  return (
    <div>
      <section style={{ padding: '40px 0', background: 'linear-gradient(90deg,#0D0D0D,#1B1B1B)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 24, alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: 42, marginBottom: 12 }}>Jóias que eternizam momentos</h1>
            <p style={{ color: '#CECECE', maxWidth: 520, marginBottom: 20 }}>Descubra nossa curadoria em ouro 18k: anéis, colares, pulseiras e brincos com acabamento impecável.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/produtos" className="btn btn-primary">Ver catálogo</Link>
              <a href="#catalogo" className="btn btn-outline">Explorar</a>
            </div>
          </div>
          <img alt="Joias" src="https://images.unsplash.com/photo-1603217192478-254a3f4a242d?q=80&w=1400&auto=format&fit=crop" style={{ width: '100%', borderRadius: 16, boxShadow: '0 12px 28px rgba(0,0,0,.28)' }} />
        </div>
      </section>

      <section id="catalogo" className="container" style={{ padding: '36px 0 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <h2>Catálogo</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c.key} onClick={() => setCategory(c.key)} className={`btn ${category === c.key ? 'btn-primary' : 'btn-outline'}`}>{c.label}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ color: '#777' }}>Carregando...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20
          }}>
            {products.map(p => (
              <article key={p.id} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,.06)' }}>
                <Link href={`/produtos/${p.slug}`} style={{ display: 'block' }}>
                  <img src={p.image} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                </Link>
                <div style={{ padding: 16 }}>
                  <h3 style={{ marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ color: '#666', fontSize: 14, marginBottom: 10 }}>{p.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <strong style={{ color: 'var(--color-primary)' }}>R$ {p.price.toFixed(2)}</strong>
                    <Link href={`/produtos/${p.slug}`} className="btn btn-primary">Ver</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
