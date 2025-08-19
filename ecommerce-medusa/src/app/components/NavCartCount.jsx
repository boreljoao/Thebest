'use client'

import { useEffect, useState } from 'react'

export default function NavCartCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const update = () => {
      try {
        const c = JSON.parse(localStorage.getItem('cart') || '[]')
        const total = c.reduce((acc, it) => acc + (it.quantity || 1), 0)
        setCount(total)
      } catch {}
    }
    update()
    window.addEventListener('storage', update)
    window.addEventListener('cart:updated', update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('cart:updated', update)
    }
  }, [])

  return (
    <a href="/checkout" className="badge" style={{ marginLeft: 8, textDecoration: 'none' }}>
      {count > 0 ? `Carrinho: ${count}` : 'Carrinho vazio'}
    </a>
  )
} 