import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userLogin, createUser, userLogout } from '@/api/auth-api';
import { toast } from 'sonner';
import { useSocket } from '@/store/use-socket';
import type { SignInFormData } from '@/validations/sign-in.validation';
import type { SignUpFormData } from '@/validations/sign-up.validation';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { connectSocket } = useSocket();

  return useMutation({
    mutationFn: (formData: SignInFormData) => userLogin(formData),
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
      connectSocket();
      toast.success('Welcome back!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { connectSocket } = useSocket();

  return useMutation({
    mutationFn: (formData: SignUpFormData) => createUser(formData),
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
      connectSocket();
      toast.success('Welcome!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Sign up failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { disconnectSocket } = useSocket();

  return useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.clear(); // Clear all cached data
      disconnectSocket();
      toast.success('Logged out successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Logout failed');
    },
  });
};
