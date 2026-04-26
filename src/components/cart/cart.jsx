import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cart.css';

function Cart() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const slug = localStorage.getItem('slug');

  const loadCart = () => {
    try {
      setItems(JSON.parse(localStorage.getItem('cart') || '[]'));
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    loadCart();
    const handleToggle = () => setOpen(prev => !prev);
    const handleUpdate = () => loadCart();

    window.addEventListener('toggle-cart', handleToggle);
    window.addEventListener('cart-updated', handleUpdate);
    return () => {
      window.removeEventListener('toggle-cart', handleToggle);
      window.removeEventListener('cart-updated', handleUpdate);
    };
  }, []);

  const updateQtd = (id, delta) => {
    const updated = items.map(item => {
      if (item.id_produto === id) {
        const newQtd = item.qtd + delta;
        return newQtd > 0 ? { ...item, qtd: newQtd } : null;
      }
      return item;
    }).filter(Boolean);

    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id) => {
    const updated = items.filter(item => item.id_produto !== id);
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const total = items.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  const totalItems = items.reduce((acc, item) => acc + item.qtd, 0);

  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const handleCheckout = () => {
    setOpen(false);
    if (slug) {
      navigate(`/cardapio_digital/${slug}/checkout`);
    }
  };

  return (
    <>
      {/* Floating cart button for mobile */}
      {totalItems > 0 && !open && (
        <button className="cart-float" onClick={() => setOpen(true)}>
          <div className="cart-float-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span>Ver sacola</span>
            <span className="cart-float-badge">{totalItems}</span>
          </div>
          <span className="cart-float-total">{fmt(total)}</span>
        </button>
      )}

      {/* Overlay */}
      <div
        className={`cart-overlay ${open ? 'cart-overlay-active' : ''}`}
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className={`cart-panel ${open ? 'cart-panel-open' : ''}`}>
        <div className="cart-header">
          <h3>Sacola</h3>
          <button className="cart-close" onClick={() => setOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p>Sua sacola está vazia</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id_produto} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.nome}</span>
                    <span className="cart-item-price">{fmt(item.preco * item.qtd)}</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button onClick={() => updateQtd(item.id_produto, -1)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                      <span>{item.qtd}</span>
                      <button onClick={() => updateQtd(item.id_produto, 1)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeItem(item.id_produto)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Total</span>
                <strong>{fmt(total)}</strong>
              </div>
              <button className="cart-checkout-btn" onClick={handleCheckout}>
                Finalizar Pedido
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
