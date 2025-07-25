'use client'
import { useEffect, useState } from 'react'

export default function EstoquePage() {
  const [estoque, setEstoque] = useState(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory`, {
      headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}` }
    })
      .then(res => res.json())
      .then(data => setEstoque(data.available))
  }, [])

  return (
    <div className="container">
      <h1>Gerenciar Estoque</h1>
      <ul>
        <li>Vale Teste - {estoque !== null ? estoque : 'Carregando...'} disponíveis</li>
      </ul>
    </div>
  )
}
