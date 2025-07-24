'use client'
import { useState } from 'react'
import '../styles/produto.css'

export default function ProdutosPage() {
  const [estoque, setEstoque] = useState(20)
  const [adicionados, setAdicionados] = useState(0)

  const handleAdicionar = () => {
    if (adicionados < estoque) {
      setAdicionados(adicionados + 1)
    }
  }

  const handleCheckout = () => {
    if (adicionados > 0) {
      // Aqui você pode redirecionar para o checkout ou simular
      window.location.href = '/checkout'
    }
  }

  return (
    <div className="produtos-page">
      <div className="produto-card melhorado">
        <img src="/vale.jpg" alt="Vale Teste" className="produto-img" />
        <h2>Vale Teste</h2>
        <p className="produto-desc">Um vale simples para testes. Adicione ao carrinho e finalize para testar o fluxo.</p>
        <span className="produto-preco">R$ 1,00</span>
        <span className="produto-estoque">{estoque - adicionados} disponíveis</span>
        <div className="produto-actions">
          <button onClick={handleAdicionar} disabled={adicionados >= estoque} className="btn-add">
            Adicionar {adicionados > 0 && `(${adicionados})`}
          </button>
          <button onClick={handleCheckout} disabled={adicionados === 0} className="btn-checkout">
            Ir para Checkout
          </button>
        </div>
      </div>
    </div>
  )
}