import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

export default function Home() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch('https://SEU-BACKEND-MEDUSA.com/store/products')
      .then(res => res.json())
      .then(data => setProdutos(data.products));
  }, []);

  return (
    <div className="container">
      <h1>Minha Loja</h1>
      <div className="produtos-grid">
        {produtos.map(produto => (
          <Link href={`/produtos/${produto.handle}`} key={produto.id}>
            <div className="produto-card">
              <img src={produto.thumbnail} alt={produto.title} />
              <h2>{produto.title}</h2>
              <p>{produto.variants[0].prices[0].amount / 100} R$</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
