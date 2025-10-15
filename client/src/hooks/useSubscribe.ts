import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { InsertEmailSubscription } from '@shared/schema';

export function useSubscribe() {
  return useMutation({
    mutationFn: async (data: InsertEmailSubscription) => {
      return await apiRequest('POST', '/api/subscribe', data);
    },
  });
}
