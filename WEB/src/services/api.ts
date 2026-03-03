import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Source': 'web',
  },
});

// Interceptor para agregar el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response:', response.data);
    
    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('User saved to localStorage:', user);
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('Getting current user from localStorage:', user);
    return user;
  },
};

// Analytics Services
export const analyticsService = {
  getDashboard: async (businessId: string, startDate: string, endDate: string) => {
    const response = await api.get(`/analytics/dashboard/${businessId}`, {
      params: { startDate, endDate },
    });
    return response.data;
  },
  
  getProfitability: async (businessId: string, startDate: string, endDate: string) => {
    const response = await api.get(`/analytics/profitability/${businessId}`, {
      params: { startDate, endDate },
    });
    return response.data;
  },
  
  getEfficiency: async (businessId: string, startDate: string, endDate: string) => {
    const response = await api.get(`/analytics/efficiency/${businessId}`, {
      params: { startDate, endDate },
    });
    return response.data;
  },
  
  getRetention: async (businessId: string) => {
    const response = await api.get(`/analytics/retention/${businessId}`);
    return response.data;
  },
  
  getHeatMap: async (businessId: string, startDate: string, endDate: string) => {
    const response = await api.get(`/analytics/heatmap/${businessId}`, {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

// Staff Services
export const staffService = {
  getAll: async () => {
    const response = await api.get('/staff');
    return response.data;
  },
  
  getById: async (staffId: string) => {
    const response = await api.get(`/staff/${staffId}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/staff', data);
    return response.data;
  },
  
  update: async (staffId: string, data: any) => {
    const response = await api.put(`/staff/${staffId}`, data);
    return response.data;
  },
};

// Client Services
export const clientService = {
  getAll: async (businessId: string) => {
    const response = await api.get(`/clients/business/${businessId}`);
    return response.data;
  },
  
  getById: async (businessId: string, clientId: string) => {
    const response = await api.get(`/clients/business/${businessId}/${clientId}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/clients', data);
    return response.data;
  },
};

// Appointment Services
export const appointmentService = {
  getAll: async (businessId: string) => {
    const response = await api.get(`/appointments/${businessId}`);
    return response.data;
  },
  
  create: async (businessId: string, data: any) => {
    const response = await api.post(`/appointments/${businessId}`, data);
    return response.data;
  },
  
  update: async (businessId: string, appointmentId: string, data: any) => {
    const response = await api.put(`/appointments/${businessId}/${appointmentId}`, data);
    return response.data;
  },
  
  cancel: async (businessId: string, appointmentId: string, reason: string) => {
    const response = await api.patch(`/appointments/${businessId}/${appointmentId}/cancel`, { reason });
    return response.data;
  },
};

// Service Services
export const serviceService = {
  getAll: async (businessId: string) => {
    const response = await api.get(`/services/${businessId}`);
    return response.data;
  },
  
  create: async (businessId: string, data: any) => {
    const response = await api.post(`/services/${businessId}`, data);
    return response.data;
  },
  
  update: async (businessId: string, serviceId: string, data: any) => {
    const response = await api.put(`/services/${businessId}/${serviceId}`, data);
    return response.data;
  },
};

// Marketing Services
export const marketingService = {
  getWelcomeKit: async (businessId: string) => {
    const response = await api.get(`/marketing/welcome-kit/${businessId}`);
    return response.data;
  },
  
  downloadFlyer: async (businessId: string) => {
    const response = await api.get(`/marketing/flyer/${businessId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;
