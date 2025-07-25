'use client'
import { useState, useEffect } from 'react'
import '../styles/checkout.css'

export default function CheckoutPage() {
  const [form, setForm] = useState({ name: '', email: '' })
  const [done, setDone] = useState(false)
  const [quantidade, setQuantidade] = useState(1)

  useEffect(() => {
    const qtd = parseInt(window.localStorage.getItem('vale_adicionados') || '1', 10)
    setQuantidade(qtd)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, quantidade })
    })
    setDone(true)
    window.localStorage.removeItem('vale_adicionados')
  }

  if (done) return <div className='container'><h1>Pedido recebido!</h1></div>

  return (
    <div className='checkout-container'>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} className='checkout-form'>
        <input type='text' placeholder='Nome' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input type='email' placeholder='Email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <div style={{marginBottom: 12}}>Quantidade: <b>{quantidade}</b></div>
        <button type='submit'>Finalizar</button>
      </form>
    </div>
  )
}