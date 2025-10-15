import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { WorkflowRun, InsertWorkflowRun } from '@shared/schema';

export function useCreateWorkflow() {
  return useMutation({
    mutationFn: async (data: InsertWorkflowRun) => {
      const res = await apiRequest('POST', '/api/workflows', data);
      return res.json() as Promise<WorkflowRun>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows/user', data.userId] });
    },
  });
}

export function useWorkflow(id: string | null) {
  return useQuery({
    queryKey: ['/api/workflows', id],
    enabled: !!id,
  });
}

export function useUserWorkflows(userId: string) {
  return useQuery({
    queryKey: ['/api/workflows/user', userId],
  });
}

export function useUpdateWorkflow() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WorkflowRun> }) => {
      const res = await apiRequest('PATCH', `/api/workflows/${id}`, data);
      return res.json() as Promise<WorkflowRun>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows', data.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/workflows/user', data.userId] });
    },
  });
}
