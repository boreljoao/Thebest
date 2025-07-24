import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../../styles/produto.css';

export default function ProdutoPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    if (slug) {
      fetch(`https://SEU-BACKEND-MEDUSA.com/store/products/${slug}`)
        .then(res => res.json())
        .then(data => setProduto(data.product));
    }
  }, [slug]);

  if (!produto) return <div>Carregando...</div>;

  return (
    <div className="produto-container">
      <img src={produto.thumbnail} alt={produto.title} />
      <div className="produto-info">
        <h1>{produto.title}</h1>
        <p>{produto.description}</p>
        <span>{produto.variants[0].prices[0].amount / 100} R$</span>
        <button>Comprar</button>
      </div>
    </div>
  );
}