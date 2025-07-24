'use client'
import { useParams, useRouter } from 'next/navigation'
import '../../styles/produto.css'

const produto = {
  slug: 'vale-teste',
  title: 'Vale Teste',
  description: 'Um vale simples de teste',
  price: 1,
  image: '/vale.jpg'
}

export default function ProdutoPage() {
  const { slug } = useParams()
  const router = useRouter()

  if (slug !== produto.slug) return <div>Produto não encontrado</div>

  return (
    <div className='produto-container'>
      <img src={produto.image} alt={produto.title} />
      <div className='produto-info'>
        <h1>{produto.title}</h1>
        <p>{produto.description}</p>
        <span>R$ {produto.price.toFixed(2)}</span>
        <button onClick={() => router.push('/checkout')}>Comprar</button>
      </div>
    </div>
  )
}