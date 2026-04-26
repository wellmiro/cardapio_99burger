import { useState } from 'react';
import './produto-vitrine.css';

function ProdutoVitrine({ id_produto, nome, preco, foto, descricao }) {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const hasImage = foto && foto.trim() !== '' && !imgError;

  const addToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(item => item.id_produto === id_produto);

      if (existing) {
        existing.qtd += 1;
      } else {
        cart.push({ id_produto, nome, preco, url_foto: foto, qtd: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));

      setAdded(true);
      setTimeout(() => setAdded(false), 800);
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const initials = (nome || '?')
    .split(' ')
    .slice(0, 2)
    .map(w => w.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <div className="pv-card">
      <div className="pv-img-container">
        {hasImage ? (
          <img
            src={foto}
            alt={nome}
            className="pv-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="pv-img-placeholder">
            <span>{initials}</span>
          </div>
        )}
      </div>

      <div className="pv-info">
        <h3 className="pv-name" title={nome}>{nome}</h3>
        {descricao && <p className="pv-desc">{descricao}</p>}
        <div className="pv-footer">
          <span className="pv-price">{formatPrice(preco)}</span>
          <button
            className={`pv-add-btn ${added ? 'pv-added' : ''}`}
            onClick={addToCart}
          >
            {added ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProdutoVitrine;
