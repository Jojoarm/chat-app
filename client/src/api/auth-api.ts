import api from '@/lib/axios';
import type { SignInFormData } from '@/validations/sign-in.validation';
import type { SignUpFormData } from '@/validations/sign-up.validation';
import axios from 'axios';

export const createUser = async (formData: SignUpFormData) => {
  const { data } = await api.post('/api/users/signup', formData);
  if (!data.success) {
    throw new Error(data.message || 'Sign up failed');
  }
  return data.user;
};

export const userLogin = async (formData: SignInFormData) => {
  const { data } = await api.post('/api/users/login', formData);
  if (!data.success) {
    throw new Error(data.message || 'Login failed');
  }
  return data.user;
};

export const getUser = async () => {
  try {
    const { data } = await api.get('/api/users/auth-status');
    if (data.success) {
      return data.user;
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('401 Unauthorized');
      }
    }
    throw error;
  }
};

export const userLogout = async () => {
  const { data } = await api.post('/api/users/logout');
  if (!data.success) {
    throw new Error(data.message || 'Logout failed');
  }
  return data;
};
