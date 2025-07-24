'use client'
import { useState } from 'react'
import '../styles/checkout.css'

export default function CheckoutPage() {
  const [form, setForm] = useState({ name: '', email: '' })
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setDone(true)
  }

  if (done) return <div className='container'><h1>Pedido recebido!</h1></div>

  return (
    <div className='checkout-container'>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} className='checkout-form'>
        <input type='text' placeholder='Nome' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input type='email' placeholder='Email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <button type='submit'>Finalizar</button>
      </form>
    </div>
  )
}