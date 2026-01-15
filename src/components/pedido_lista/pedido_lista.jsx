import { useState } from "react";
import Pedido from "../pedido/Pedido";
import Header from "../header/Header";

function PedidosLista({ pedidos }) {
    const [listaPedidos, setListaPedidos] = useState(
        pedidos.map(p => ({ ...p, status: p.status || "A" }))
    );
    const [filtroStatus, setFiltroStatus] = useState("A"); // filtro inicial

    // Atualiza status de um pedido específico
    const alterarStatusPedido = (id_pedido, novoStatus) => {
        setListaPedidos(prev =>
            prev.map(p => p.id_pedido === id_pedido ? { ...p, status: novoStatus } : p)
        );
    };

    // Atualiza status de todos os pedidos filtrados
    const alterarStatusHeader = (novoStatus) => {
        setListaPedidos(prev =>
            prev.map(p =>
                filtroStatus === "T" || p.status === filtroStatus
                    ? { ...p, status: novoStatus }
                    : p
            )
        );
    };

    return (
        <div>
            <Header
                filtroStatus={filtroStatus}
                setFiltroStatus={setFiltroStatus}
                alterarStatusHeader={alterarStatusHeader}
            />

            {listaPedidos.map(pedido => {
                if (filtroStatus !== "T" && pedido.status !== filtroStatus) return null;

                return (
                    <Pedido
                        key={pedido.id_pedido}
                        {...pedido}
                        alterarStatus={novoStatus => alterarStatusPedido(pedido.id_pedido, novoStatus)}
                    />
                );
            })}
        </div>
    );
}

export default PedidosLista;
