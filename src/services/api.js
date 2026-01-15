import axios from 'axios';

// Mantenha o link do ngrok como base enquanto estiver testando com o banco local
// Quando mudar definitivamente para a AWS, basta trocar para o IP fixo
const URL = 'https://nonautobiographical-uncapitulating-henry.ngrok-free.dev';

const api = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Esse header é o que libera o acesso no navegador e evita o erro 8012
        'ngrok-skip-browser-warning': 'true' 
    }
});

export default api;