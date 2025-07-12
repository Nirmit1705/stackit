import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = (): string | null => localStorage.getItem('token');
const setToken = (token: string): void => localStorage.setItem('token', token);
const removeToken = (): void => localStorage.removeItem('token');

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },

  signup: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/signup', { username, email, password });
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },

  logout: () => {
    removeToken();
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  getUserStats: async (userId: string) => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  },
};

// Questions API
export const questionsAPI = {
  getQuestions: async (params: any = {}) => {
    const response = await api.get('/questions', { params });
    return response.data;
  },

  getQuestion: async (id: string) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  createQuestion: async (questionData: any) => {
    const response = await api.post('/questions', questionData);
    return response.data;
  },

  addAnswer: async (questionId: string, content: string) => {
    const response = await api.post(`/questions/${questionId}/answers`, { content });
    return response.data;
  },
};

// Answers API
export const answersAPI = {
  voteAnswer: async (answerId: string, type: 'up' | 'down') => {
    const response = await api.post(`/answers/${answerId}/vote`, { type });
    return response.data;
  },

  acceptAnswer: async (answerId: string) => {
    const response = await api.post(`/answers/${answerId}/accept`);
    return response.data;
  },
};

// Tags API
export const tagsAPI = {
  getTags: async () => {
    const response = await api.get('/tags');
    return response.data;
  },

  getPopularTags: async () => {
    const response = await api.get('/tags/popular');
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async (params: any = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post('/notifications/mark-all-read');
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (publicId: string) => {
    const response = await api.delete(`/uploads/image/${publicId}`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getUsers: async (params: any = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId: string, status: string) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  getQuestions: async (params: any = {}) => {
    const response = await api.get('/admin/questions', { params });
    return response.data;
  },

  deleteQuestion: async (questionId: string) => {
    const response = await api.delete(`/admin/questions/${questionId}`);
    return response.data;
  },

  deleteAnswer: async (answerId: string) => {
    const response = await api.delete(`/admin/answers/${answerId}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  createTag: async (tagData: any) => {
    const response = await api.post('/admin/tags', tagData);
    return response.data;
  },

  deleteTag: async (tagId: string) => {
    const response = await api.delete(`/admin/tags/${tagId}`);
    return response.data;
  },
};

export { getToken, setToken, removeToken };
