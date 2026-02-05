import { getUser } from '@/api/auth-api';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized)
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // console.log(query);

  return {
    ...query,
    user: query.data ?? null,
    isUserPending: query.isPending,
    userError: query.error,
  };
};
