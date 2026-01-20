import axios from 'axios';

// Agora a base é o seu domínio fixo no Render
const URL = 'https://api-99burger.onrender.com';

const api = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // Deletei o header do ngrok daqui
    }
});

export default api;