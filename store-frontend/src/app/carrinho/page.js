'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CarrinhoPage() {
  const [qtd, setQtd] = useState(0)

  useEffect(() => {
    const val = parseInt(window.localStorage.getItem('vale_adicionados') || '0', 10)
    setQtd(val)
  }, [])

  const handleCheckout = () => {
    if (qtd > 0) {
      window.location.href = '/checkout'
    }
  }

  return (
    <div className='container'>
      <h1>Carrinho</h1>
      <p>Vale Teste: <b>{qtd}</b></p>
      <button onClick={handleCheckout} disabled={qtd === 0} style={{marginRight:8}}>Finalizar Compra</button>
      <Link href='/produtos'>Continuar comprando</Link>
    </div>
  )
}
