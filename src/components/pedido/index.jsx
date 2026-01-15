import React from 'react';
import './style.css'; 
import api from '../../services/api';

const STATUS_OPTIONS_MAP = {
    "A": "Aguardando",
    "P": "Em Produção",
    "E": "Saiu Entrega",
    "F": "Finalizado"
};

// --- COMPONENTE FILHO: ItemDoPedido ---
const ItemDoPedido = ({ item }) => {
    // Coleta dados, priorizando nome_produto ou nome.
    const nome = item.nome_produto ?? item.nome ?? '';
    // Formata quantidade removendo .00 se for inteiro.
    const qtdStr = parseFloat(item.qtd || 0).toString().replace('.00', '');
    const obsItem = item.observacao ?? item.obs ?? '';
    // A propriedade vl_unitario é importante para mostrar o preço unitário, se necessário,
    // mas o foco aqui é layout (por isso a removi para simplificar, mas você pode reintroduzir se precisar).

    return (
        <div className="item-row"> 
            {/* Contêiner da Imagem */}
            <div className="item-image" style={{ 
                backgroundImage: `url(${item.url_foto ?? ''})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}></div>
            
            {/* Contêiner da Informação: Nome + Quantidade */}
            <div className="item-info"> 
                {/* Nome do Produto (Esquerda) */}
                <span className="item-name">
                    {nome} 
                    {obsItem && <small style={{ color: 'var(--secondary-text)', fontWeight: 400 }}> ({obsItem})</small>}
                </span>
                {/* Quantidade (Direita) - Usa a classe estilizada no CSS */}
                <span className="item-qty-display">{qtdStr}x</span> 
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL: Pedido ---
function Pedido({ 
    id_pedido, 
    nome_cliente, 
    dt_pedido, 
    endereco_entrega, 
    vl_total, 
    vl_entrega, 
    forma_pagamento, 
    itens = [], 
    rota, 
    status, 
    alterarStatus 
}) {

    const atualizarStatus = (novoStatus) => {
        alterarStatus(novoStatus);
        api.put(`pedidos/status/${id_pedido}`, { status: novoStatus }).catch(err => console.log(err));
    };

    const formatarValor = (valor) => {
        return (parseFloat(valor) || 0).toFixed(2).replace('.', ',');
    };

    return (
        <div className="order-card"> 
            
            <div className="order-header">
                <span className="order-id">#{id_pedido}</span>
                <span className="order-time">{dt_pedido || 'N/A'}</span> 
                
                <select 
                    className="status-dropdown" 
                    value={status} 
                    onChange={(e) => atualizarStatus(e.target.value)}
                >
                    {Object.entries(STATUS_OPTIONS_MAP).map(([key, label]) => (
                         <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            <div className="order-details">
                <div className="client-info-row">
                    <div className="client-name">Cliente: **{nome_cliente ? nome_cliente.toUpperCase() : 'N/A'}**</div>
                    <span className="total-value">R$ {formatarValor(vl_total)}</span> 
                </div>

                {endereco_entrega && endereco_entrega.trim() !== "" && (
                    <div className="delivery-address">
                         🏠 {endereco_entrega}
                         {rota && (
                            <a href={rota} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px', color: 'var(--dark-text)' }}>
                                (Rota)
                            </a>
                         )}
                    </div>
                )}
                
                <span className="payment-info">
                    Pagamento: {forma_pagamento || 'N/A'} | Taxa de Entrega: R$ {formatarValor(vl_entrega)}
                </span>
            </div>

            <div className="order-items">
                {/* items-grid agora será forçado a ser uma lista vertical no CSS */}
                <div className="items-grid"> 
                    {Array.isArray(itens) && itens.map((item, index) => (
                        <ItemDoPedido key={item.id_item || index} item={item} />
                    ))}
                </div>
            </div>
            
        </div>
    );
}

export default Pedido;