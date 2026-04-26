import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import Historico from './pages/historico/historico';
import Pedidos from './pages/pedidos';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/cardapio_digital/:id" element={<Home />} />
      <Route path="/historico" element={<Historico />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;
