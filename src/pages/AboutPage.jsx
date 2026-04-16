import axios from 'axios';
import toast from 'react-hot-toast';

// Direct connection to backend on port 8080
const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      console.error('[Network Error]', error);
      return Promise.reject(error);
    }
    
    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 400:
        toast.error(error.response.data?.message || 'Bad request. Please check your input.');
        break;
        
      case 401:
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Don't redirect if already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
        }
        break;
        
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
        
      case 404:
        toast.error('Resource not found');
        break;
        
      case 409:
        toast.error(error.response.data?.message || 'Conflict occurred');
        break;
        
      case 500:
        toast.error('Server error. Please try again later.');
        console.error('[Server Error]', error.response.data);
        break;
        
      default:
        toast.error(error.response.data?.message || 'An error occurred');
    }
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        status: error.response.status,
        url: error.config.url,
        method: error.config.method,
        data: error.response.data
      });
    }
    
    return Promise.reject(error);
  }
);

// ============= Auth APIs =============
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// ============= Product APIs =============
export const productAPI = {
  // Public endpoints
  getAll: () => api.get('/machines/public'),
  getById: (id) => api.get(`/machines/public/${id}`),
  search: (keyword) => api.get(`/machines/public/search`, { params: { keyword } }),
  
  // Admin endpoints
  create: (formData) => api.post('/machines/admin', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/machines/admin/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/machines/admin/${id}`),
};

// ============= Order APIs =============
export const orderAPI = {
  // User endpoints
  create: (items, shippingAddress, contactPhone, notes = '') => 
    api.post('/orders', items, {
      params: {
        shippingAddress,
        contactPhone,
        notes
      }
    }),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  
  // Admin endpoints
  getAll: () => api.get('/orders/admin/all'),
  updateStatus: (id, status) => api.put(`/orders/admin/${id}/status`, null, {
    params: { status }
  }),
};

// ============= Image APIs =============
export const imageAPI = {
  getImageUrl: (fileName) => `${API_URL}/images/${fileName}`,
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteImage: (fileName) => api.delete(`/images/${fileName}`),
};

// ============= User APIs =============
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  
  // Admin endpoints
  getAllUsers: () => api.get('/users/admin/all'),
  updateUserRole: (id, role) => api.put(`/users/admin/${id}/role`, null, {
    params: { role }
  }),
};

// ============= Helper Functions =============
export const apiHelpers = {
  // Check if API is available
  healthCheck: async () => {
    try {
      const response = await api.get('/machines/public', { timeout: 5000 });
      return { available: true, response };
    } catch (error) {
      return { available: false, error };
    }
  },
  
  // Get full image URL
  getFullImageUrl: (relativeUrl) => {
    if (!relativeUrl) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (relativeUrl.startsWith('http')) return relativeUrl;
    return `${API_URL}${relativeUrl}`;
  },
  
  // Format price for display
  formatPrice: (price) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  },
  
  // Parse error message
  getErrorMessage: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
};

// Export the base URL for use in components
export const BASE_URL = API_URL;

export default api;