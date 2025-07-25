'use client'
import { useState, useEffect } from 'react'
import '../styles/produto.css'

export default function ProdutosPage() {
  const [estoque, setEstoque] = useState(null)
  const [adicionados, setAdicionados] = useState(0)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory`)
      .then(res => res.json())
      .then(data => setEstoque(data.available))
    // Recupera do localStorage o valor salvo no Home
    const salvo = parseInt(window.localStorage.getItem('vale_adicionados') || '0', 10)
    setAdicionados(salvo)
  }, [])

  const handleAdicionar = () => {
    if (estoque !== null && adicionados < estoque) {
      setAdicionados(adicionados + 1)
      window.localStorage.setItem('vale_adicionados', adicionados + 1)
    }
  }

  const handleRemover = () => {
    if (adicionados > 0) {
      setAdicionados(adicionados - 1)
      window.localStorage.setItem('vale_adicionados', adicionados - 1)
    }
  }

  const handleCheckout = () => {
    if (adicionados > 0 && adicionados <= estoque) {
      window.location.href = '/checkout'
    }
  }

  const estoqueDisponivel = estoque !== null ? estoque - adicionados : null
  const podeAdicionar = estoque !== null && adicionados < estoque
  const podeRemover = adicionados > 0
  const podeCheckout = adicionados > 0 && adicionados <= estoque

  return (
    <div className="produtos-page">
      <div className="produto-card melhorado">
        <img src="/vale.jpg" alt="Vale Teste" className="produto-img" />
        <h2>Vale Teste</h2>
        <p className="produto-desc">Um vale simples para testes. Adicione ao carrinho e finalize para testar o fluxo.</p>
        <span className="produto-preco">R$ 1,00</span>
        <span className="produto-estoque">{estoqueDisponivel !== null ? estoqueDisponivel : 'Carregando...'} disponíveis</span>
        <div className="produto-actions">
          <button onClick={handleAdicionar} disabled={!podeAdicionar} className="btn-add">
            Adicionar {adicionados > 0 && `(${adicionados})`}
          </button>
          <button onClick={handleRemover} disabled={!podeRemover} className="btn-remove">
            Remover
          </button>
          <button onClick={handleCheckout} disabled={!podeCheckout} className="btn-checkout">
            Ir para Checkout
          </button>
        </div>
      </div>
    </div>
  )
}