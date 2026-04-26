import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar.jsx';
import api from '../../services/api.js';
import './historico.css';

function Historico() {
  const [pedidos, setPedidos] = useState([]);
  const [idExpandido, setIdExpandido] = useState(null);
  const [detalhes, setDetalhes] = useState(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  const [loadingLista, setLoadingLista] = useState(true);

  const slug = localStorage.getItem('slug');
  const sessionId = localStorage.getItem('session_id');
  const navigate = useNavigate();

  const ETAPAS = [
    { cod: 'A', label: 'Aguardando', icone: '🕐' },
    { cod: 'P', label: 'Em Produção', icone: '👨‍🍳' },
    { cod: 'E', label: 'Saiu p/ Entrega', icone: '🛵' },
    { cod: 'F', label: 'Entregue', icone: '✅' },
  ];

  useEffect(() => {
    if (!slug || !sessionId) {
      setLoadingLista(false);
      return;
    }

    api
      .get(`/pedidos/historico/${slug}/${sessionId}`)
      .then((resp) => setPedidos(resp.data))
      .catch((err) => console.error('Erro lista:', err))
      .finally(() => setLoadingLista(false));
  }, [slug, sessionId]);

  const handleExpandir = async (id_pedido) => {
    if (idExpandido === id_pedido) {
      setIdExpandido(null);
      return;
    }

    setIdExpandido(id_pedido);
    setLoadingDetalhes(true);
    setDetalhes(null);

    try {
      const resp = await api.get(`/pedidos/acompanhar/${id_pedido}`);
      setDetalhes(resp.data);
    } catch (err) {
      console.error('Erro detalhes:', err);
    } finally {
      setLoadingDetalhes(false);
    }
  };

  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const formatQtd = (qtd) => {
    const numero = parseInt(qtd);
    if (!numero || numero <= 0) return 1;
    if (numero > 50) return 1;
    return numero;
  };

  if (loadingLista) {
    return (
      <div className="hist-page">
        <Navbar />
        <div className="hist-container">
          <div className="hist-top">
            <button className="hist-back" onClick={() => navigate(`/cardapio_digital/${slug}`)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Voltar
            </button>
            <h2>Meus Pedidos</h2>
          </div>
          <div className="hist-skeleton-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="hist-skeleton">
                <div className="sk-line sk-w60" />
                <div className="sk-line sk-w40" />
                <div className="sk-line sk-w80" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hist-page">
      <Navbar />

      <div className="hist-container">
        <div className="hist-top">
          <button className="hist-back" onClick={() => navigate(`/cardapio_digital/${slug}`)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Voltar
          </button>
          <h2>Meus Pedidos</h2>
        </div>

        {(!slug || !sessionId) && (
          <div className="hist-empty">
            <p>Você precisa acessar pelo cardápio primeiro.</p>
          </div>
        )}

        {pedidos.length === 0 && slug && sessionId && (
          <div className="hist-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <p>Nenhum pedido encontrado.</p>
          </div>
        )}

        <div className="hist-list">
          {pedidos.map((p) => (
            <div
              key={p.id_pedido}
              className={`hist-card ${idExpandido === p.id_pedido ? 'hist-card-open' : ''}`}
            >
              <button className="hist-summary" onClick={() => handleExpandir(p.id_pedido)}>
                <div className="hist-summary-left">
                  <span className="hist-order-num">Pedido #{p.id_pedido}</span>
                  <span className="hist-order-meta">{p.dt_pedido}</span>
                </div>
                <div className="hist-summary-right">
                  <span className="hist-order-total">{fmt(p.vl_total)}</span>
                  <svg
                    className={`hist-chevron ${idExpandido === p.id_pedido ? 'hist-chevron-up' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </button>

              {idExpandido === p.id_pedido && (
                <div className="hist-details">
                  {loadingDetalhes ? (
                    <div className="hist-detail-loading">
                      <div className="home-spinner" />
                      <span>Buscando status...</span>
                    </div>
                  ) : detalhes ? (
                    <>
                      <div className="hist-timeline">
                        {ETAPAS.map((etapa, index) => {
                          const indexAtual = ETAPAS.findIndex((e) => e.cod === detalhes.status);
                          const concluida = index <= indexAtual;
                          const atual = index === indexAtual;

                          return (
                            <div key={etapa.cod} className={`tl-step ${concluida ? 'tl-done' : ''} ${atual ? 'tl-current' : ''}`}>
                              <div className="tl-dot">
                                <span className="tl-icon">{etapa.icone}</span>
                              </div>
                              <span className="tl-label">{etapa.label}</span>
                              {index < ETAPAS.length - 1 && <div className={`tl-line ${concluida ? 'tl-line-done' : ''}`} />}
                            </div>
                          );
                        })}
                      </div>

                      <div className="hist-items">
                        <h4>Itens do pedido</h4>
                        {detalhes.itens?.map((item, i) => (
                          <div key={i} className="hist-item-row">
                            <span className="hist-item-qty">{formatQtd(item.qtd)}x</span>
                            <span className="hist-item-name">{item.nome_produto}</span>
                            <span className="hist-item-price">{fmt(item.vl_total)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="hist-detail-error">
                      <p>Erro ao carregar detalhes.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Historico;
