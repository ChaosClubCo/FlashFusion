import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';

interface UsageStatus {
  currentUsage: number;
  usageLimit: number;
  isAtLimit: boolean;
  percentage: number;
  plan: string;
}

export function useUsageCheck(userId: string, enabled: boolean = true) {
  return useQuery<UsageStatus>({
    queryKey: ['/api/usage/check', userId],
    queryFn: async () => {
      const response = await fetch('/api/usage/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to check usage');
      return response.json();
    },
    enabled: enabled && !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useUsageIncrement() {
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch('/api/usage/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, ...error };
      }
      
      return response.json();
    },
    onSuccess: (data, userId) => {
      // Invalidate usage check to refetch
      queryClient.invalidateQueries({ queryKey: ['/api/usage/check', userId] });
    },
  });
}
