import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar.jsx';
import ProdutoVitrine from '../../components/produto-vitrine/produto-vitrine.jsx';
import CategoriaBarra from '../../components/categoria-barra/categoria-barra';
import Cart from '../../components/cart/cart.jsx';
import api from '../../services/api.js';
import './home.css';

function Home() {
  const { id } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [rolou, setRolou] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const monitorarScroll = () => setRolou(window.scrollY > 50);
    window.addEventListener('scroll', monitorarScroll);
    return () => window.removeEventListener('scroll', monitorarScroll);
  }, []);

  useEffect(() => {
    if (!id) return;

    localStorage.setItem('slug', id);

    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('session_id', sessionId);
    }

    setLoading(true);
    setErro(null);

    api.get(`/cardapio_digital/${id}`)
      .then((resp) => {
        const data = resp.data;
        const unique = data.filter(
          (item, index, self) =>
            self.findIndex((p) => p.id_produto === item.id_produto) === index
        );
        setProdutos(unique);
      })
      .catch(() => {
        setErro('Ops! Não conseguimos encontrar este cardápio.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const categoriasUnicas = produtos.reduce((acc, atual) => {
    if (!acc.find((item) => item.id_categoria === atual.id_categoria)) {
      return acc.concat([atual]);
    }
    return acc;
  }, []);

  const produtosPorCategoria = produtos.reduce((acc, produto) => {
    if (!acc[produto.categoria]) acc[produto.categoria] = [];
    acc[produto.categoria].push(produto);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="home-loading">
          <div className="home-spinner" />
          <p>Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="home-error">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          <h2>{erro}</h2>
          <p>Verifique se digitou o endereço corretamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Navbar showMenu={true} />

      <div className={`cat-sticky ${rolou ? 'cat-fixed' : ''}`}>
        <CategoriaBarra dados={categoriasUnicas} />
      </div>

      <main className="home-main">
        {Object.entries(produtosPorCategoria).map(([categoria, listaProdutos]) => (
          <section key={categoria} id={categoria} className="cat-section">
            <h2 className="cat-title">{categoria}</h2>
            <div className="product-grid">
              {listaProdutos.map((prod) => (
                <ProdutoVitrine
                  key={prod.id_produto}
                  id_produto={prod.id_produto}
                  nome={prod.nome}
                  preco={prod.preco}
                  foto={prod.url_foto}
                  descricao={prod.descricao}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <Cart />
    </div>
  );
}

export default Home;
