import { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requirePlan?: 'free' | 'pro' | 'enterprise';
}

const planHierarchy = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

export function ProtectedRoute({ children, requirePlan = 'free' }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  if (requirePlan && user) {
    const userPlanLevel = planHierarchy[user.plan];
    const requiredPlanLevel = planHierarchy[requirePlan];

    if (userPlanLevel < requiredPlanLevel) {
      return <Redirect to="/pricing" />;
    }
  }

  return <>{children}</>;
}
