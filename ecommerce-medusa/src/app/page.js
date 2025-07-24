'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './styles/global.css';

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Componente montado');
  }, []);

  return (
    <div className="home-container">
      <h1>Bem-vindo</h1>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
      <Link href="/produtos">Ver Produtos</Link>
    </div>
  );
}
