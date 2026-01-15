import './style.css';
import Logo from '../../assets/logo.png';

function Header({ filtroStatus, setFiltroStatus, alterarStatusHeader }) {
    const botoes = [
        { label: "Aguardando", status: "A" },
        { label: "Em Produção", status: "P" },
        { label: "Saiu Entrega", status: "E" },
        { label: "Finalizado", status: "F" },
        { label: "Todos", status: "T" }
    ];

    return (
        <div className="header d-flex align-items-center justify-content-between p-2">
            <img src={Logo} alt="Logo" style={{ height: '50px' }} />
            <div className="d-flex gap-2">
                {botoes.map(b => (
                    <button
                        key={b.status}
                        className={`btn ${filtroStatus === b.status ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => {
                            setFiltroStatus(b.status);
                            if (b.status !== "T") alterarStatusHeader(b.status);
                        }}
                    >
                        {b.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Header;
