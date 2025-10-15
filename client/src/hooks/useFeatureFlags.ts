import { useQuery } from '@tanstack/react-query';
import type { FeatureFlags } from '@shared/schema';

export function useFeatureFlags() {
  return useQuery<FeatureFlags>({
    queryKey: ['/api/flags'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
