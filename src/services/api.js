import axios from 'axios';
let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (rawBaseUrl.endsWith('/')) {
    rawBaseUrl = rawBaseUrl.slice(0, -1);
}
if (!rawBaseUrl.endsWith('/api')) {
    rawBaseUrl += '/api';
}
const baseURL = rawBaseUrl;

const api = axios.create({
    baseURL,
});
// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export default api;
