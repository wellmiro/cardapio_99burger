import { useEffect, useState } from "react";
import Header from "../../components/header";
import Pedido from "../../components/pedido";
import api from '../../services/api';

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [filtroStatus, setFiltroStatus] = useState("A");

    function ListarPedidos() {
        api.get("pedidos/itens")
            .then(response => setPedidos(response.data))
            .catch(err => console.log(err));
    }

    // Atualiza o status de um pedido no estado
    const alterarStatusPedido = (id, novoStatus) => {
        setPedidos(prev =>
            prev.map(p => p.id_pedido === id ? { ...p, status: novoStatus } : p)
        );
    };

    useEffect(() => {
        ListarPedidos();
    }, []);

    return (
        <>
            <Header 
                filtroStatus={filtroStatus} 
                setFiltroStatus={setFiltroStatus} 
            />

            <div className="container-fluid">
                <div className="m-2 mt-4 d-flex justify-content-between">
                    <h2>Pedidos na Fila</h2>
                    <button onClick={ListarPedidos} className="btn btn-lg btn-primary">Atualizar</button>
                </div>   

                <div className="m-2 mt-4">
                    {pedidos
                        .filter(item => filtroStatus === "T" || item.status === filtroStatus)
                        .map(item => (
                            <Pedido
                                key={item.id_pedido}
                                {...item}
                                alterarStatus={(novoStatus) => alterarStatusPedido(item.id_pedido, novoStatus)}
                            />
                        ))
                    }
                </div> 
            </div>
        </>
    );
}

export default Pedidos;
