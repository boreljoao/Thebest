'use client'
import { useEffect, useState } from 'react'

export default function EstoquePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1>Gerenciar Estoque</h1>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className='card' style={{ padding: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#666', fontSize: 13 }}>
                <th style={{ padding: '6px 4px' }}>Produto</th>
                <th style={{ padding: '6px 4px' }}>Categoria</th>
                <th style={{ padding: '6px 4px' }}>Preço</th>
                <th style={{ padding: '6px 4px' }}>Estoque</th>
                <th style={{ padding: '6px 4px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: '6px 4px' }}>{p.title}</td>
                  <td style={{ padding: '6px 4px', textTransform: 'capitalize' }}>{p.category}</td>
                  <td style={{ padding: '6px 4px' }}>R$ {p.price.toFixed(2)}</td>
                  <td style={{ padding: '6px 4px' }}>{p.stock}</td>
                  <td style={{ padding: '6px 4px' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button className='btn btn-outline' onClick={() => updateStock(p.id, -1)} disabled={p.stock <= 0}>-1</button>
                      <button className='btn btn-primary' onClick={() => updateStock(p.id, +1)}>+1</button>
                      <form onSubmit={(e)=>{ e.preventDefault(); const val = Number(e.currentTarget.elements.namedItem('s').value); if(Number.isFinite(val)) setStock(p.id, val); }} style={{ display: 'inline-flex', gap: 6 }}>
                        <input className='input' name='s' type='number' min={0} placeholder='Definir' style={{ width: 110 }} />
                        <button className='btn btn-outline' type='submit'>Definir</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

async function updateStock(productId, delta){
  await fetch(`/api/products/${productId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deltaStock: delta }) })
  // reload list
  location.reload()
}

async function setStock(productId, stock){
  await fetch(`/api/products/${productId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stock }) })
  location.reload()
}
