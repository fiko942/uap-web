import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request Interceptor - Simple JWT only
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
client.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        if (response) {
            if (response.status === 401) {
                // Unauthorized - Clear auth and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            if (response.status === 403) {
                console.error("Access Forbidden", response.data);
            }
        }
        return Promise.reject(error);
    }
);

export default client;
