'use client'
import { useEffect, useState } from 'react'

export default function EstoquePage() {
  const [estoque, setEstoque] = useState(null)

  useEffect(() => {
    fetch('/api/inventory')
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
