// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error('[API Network Error]', error.message, {
                baseURL: error.config?.baseURL,
                url: error.config?.url,
                method: error.config?.method
            });
            return Promise.reject(error);
        }

        console.error('[API Error]', error.response.status, error.response.data);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============= AUTH API =============
const postWithFallback = async (paths, payload) => {
    let lastError;

    for (const path of paths) {
        try {
            return await api.post(path, payload);
        } catch (error) {
            lastError = error;
            if (error.response?.status !== 404) {
                throw error;
            }
        }
    }

    throw lastError;
};

export const authAPI = {
    login: (credentials) => postWithFallback(['/auth/login', '/api/auth/login'], credentials),
    register: (userData) => postWithFallback(['/auth/register', '/api/auth/register'], userData),
};

// ============= PRODUCT API (alias for carAPI) =============
export const productAPI = {
    // Public endpoints
    getAll: () => api.get('/api/cars/public'),
    getById: (id) => api.get(`/api/cars/public/${id}`),
    search: (keyword) => api.get(`/api/cars/public/search?keyword=${keyword}`),
    getByBrand: (brand) => api.get(`/api/cars/public/brand/${brand}`),
    getFeatured: () => api.get('/api/cars/public/featured'),
    
    // Admin endpoints
    create: (formData) => api.post('/api/cars/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.put(`/api/cars/admin/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/api/cars/admin/${id}`),
};

// ============= CAR API =============
export const carAPI = productAPI; // carAPI нь productAPI-тай адил

// ============= MACHINE API =============
export const machineAPI = {
    getAll: () => api.get('/machines/public'),
    getById: (id) => api.get(`/machines/public/${id}`),
    search: (keyword) => api.get(`/machines/public/search?keyword=${keyword}`),
    create: (formData) => api.post('/machines/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.put(`/machines/admin/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/machines/admin/${id}`),
};

// ============= CATEGORY API =============
export const categoryAPI = {
    getAll: () => api.get('/categories/public'),
    getById: (id) => api.get(`/categories/public/${id}`),
    create: (data) => api.post('/categories/admin', data),
    update: (id, data) => api.put(`/categories/admin/${id}`, data),
    delete: (id) => api.delete(`/categories/admin/${id}`),
};

// ============= ORDER API =============
export const orderAPI = {
    create: (items, shippingAddress, contactPhone) => 
        api.post(`/orders?shippingAddress=${shippingAddress}&contactPhone=${contactPhone}`, items),
    getMyOrders: () => api.get('/orders/my-orders'),
    getById: (id) => api.get(`/orders/${id}`),
    getAll: () => api.get('/orders/admin/all'),
    updateStatus: (id, status) => api.put(`/orders/admin/${id}/status?status=${status}`),
};

// ============= USER API =============
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
};

// Default export
export default api;
