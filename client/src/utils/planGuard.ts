type Plan = 'free' | 'pro' | 'enterprise';

const planHierarchy: Record<Plan, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

export function canAccessFeature(userPlan: Plan, requiredPlan: Plan): boolean {
  return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
}

export function isPlanSufficient(userPlan: Plan, requiredPlan: Plan): boolean {
  return canAccessFeature(userPlan, requiredPlan);
}
