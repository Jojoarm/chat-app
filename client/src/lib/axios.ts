import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default api;

export const handleApiError = (error: unknown): void => {
  let message = 'An unexpected error occurred';

  if (axios.isAxiosError(error) && error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  throw new Error(message);
};
