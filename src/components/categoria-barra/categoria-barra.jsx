import { useRef, useEffect, useState } from 'react';
import './categoria-barra.css';

function CategoriaBarra({ dados = [] }) {
  const scrollRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const scrollToCategoria = (categoria) => {
    setActiveId(categoria.id_categoria);
    const el = document.getElementById(categoria.categoria);
    if (el) {
      const offset = 160;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const sections = dados.map(d => document.getElementById(d.categoria)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const found = dados.find(d => d.categoria === entry.target.id);
            if (found) setActiveId(found.id_categoria);
          }
        }
      },
      { rootMargin: '-180px 0px -60% 0px', threshold: 0.1 }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [dados]);

  useEffect(() => {
    if (!activeId || !scrollRef.current) return;
    const activeBtn = scrollRef.current.querySelector(`[data-cat-id="${activeId}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeId]);

  if (dados.length === 0) return null;

  return (
    <div className="cat-bar-wrapper">
      <div className="cat-bar" ref={scrollRef}>
        {dados.map((item) => (
          <button
            key={item.id_categoria}
            data-cat-id={item.id_categoria}
            className={`cat-item ${activeId === item.id_categoria ? 'cat-active' : ''}`}
            onClick={() => scrollToCategoria(item)}
          >
            {item.url_foto ? (
              <div className="cat-icon-wrap">
                <img
                  src={item.url_foto}
                  alt={item.categoria}
                  className="cat-icon-img"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ) : (
              <div className="cat-icon-wrap cat-icon-placeholder">
                <span>{item.categoria?.charAt(0) || '?'}</span>
              </div>
            )}
            <span className="cat-label">{item.categoria}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoriaBarra;
