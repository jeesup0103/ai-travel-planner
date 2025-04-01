import axios from 'axios';
import { User } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class AuthService {
  async login(googleToken: string): Promise<string> {
    const response = await axios.post(`${API_URL}/auth/google`, { token: googleToken });
    return response.data.token;
  }

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/users/me`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  // Setup axios interceptor for handling token
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}

export const authService = new AuthService();