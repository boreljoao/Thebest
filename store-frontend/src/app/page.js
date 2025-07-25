'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './styles/global.css';

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Componente montado');
  }, []);

  const handleIncrementar = () => {
    const novoCount = count + 1;
    setCount(novoCount);
    window.localStorage.setItem('vale_adicionados', novoCount);
  };

  const handleVerProdutos = () => {
    window.localStorage.setItem('vale_adicionados', count);
    window.location.href = '/produtos';
  };

  const handleCarrinho = () => {
    window.location.href = '/carrinho';
  };

  return (
    <div className="home-container">
      <img
        src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
        alt="Logo Van"
        style={{ width: 90, marginBottom: 24, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
      />
      <h1 style={{ color: '#0070f3', fontWeight: 800, letterSpacing: 1 }}>Bem-vindo ao Vale Teste</h1>
      <p style={{ maxWidth: 320, color: '#444', marginBottom: 18, textAlign: 'center' }}>
        Experimente nossa loja! Adicione um vale teste ao carrinho, vá para o checkout e veja o fluxo completo de compra e estoque funcionando.
      </p>
      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <button onClick={handleIncrementar} style={{ background: '#0070f3', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 6, fontSize: '1rem', cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          Incrementar ({count})
        </button>
        <button onClick={handleVerProdutos} style={{ background: '#fff', color: '#0070f3', border: '2px solid #0070f3', padding: '10px 24px', borderRadius: 6, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          Ver Produtos
        </button>
        <button onClick={handleCarrinho} style={{ background: '#0070f3', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 6, fontSize: '1rem', cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          Carrinho
        </button>
      </div>
      <div style={{ marginTop: 32, color: '#888', fontSize: 14 }}>
        <span>Desenvolvido com <b>Next.js</b> + <b>Medusa</b></span>
      </div>
    </div>
  );
}
