import axios from 'axios';
import { User } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

interface LoginResponse {
  token: string;
  user: User;
}

class AuthService {
  async login(googleToken: string): Promise<LoginResponse> {
    try {
      console.log('Attempting login with token:', googleToken.substring(0, 10) + '...');
      console.log('API URL:', API_URL);

      const response = await axios.post(`${API_URL}/auth/google`, { token: googleToken });

      if (!response.data.token) {
        throw new Error('No token received from server');
      }

      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const token = localStorage.getItem('token');
      console.log('Getting current user with token:', token ? 'present' : 'missing');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Current user response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.patch(`${API_URL}/users/me`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  // Setup axios interceptor for handling token
  setupAxiosInterceptors() {
    axios.interceptors.request.use((config) => {
      if (config.url?.endsWith("/auth/google")) {
        return config;
      }
      const token = localStorage.getItem('token');
      if (token) {
        config.headers!['Authorization'] = `Bearer ${token}`;
        console.log('Added token to request headers');
      }
      return config;
    });
    axios.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          // window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}

export const authService = new AuthService();