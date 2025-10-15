import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Plan = 'free' | 'pro' | 'enterprise';
type Role = 'user' | 'admin';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    plan: Plan;
    role: Role;
    currentUsage: number;
    usageLimit: number;
  } | null;
  login: (username: string, plan?: Plan) => void;
  logout: () => void;
  incrementUsage: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username: string, plan: Plan = 'free') => {
        set({
          isAuthenticated: true,
          user: {
            id: 'demo-user-1',
            username,
            plan,
            role: 'user',
            currentUsage: 0,
            usageLimit: plan === 'free' ? 10 : plan === 'pro' ? 100 : 1000,
          },
        });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      incrementUsage: () => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              currentUsage: state.user.currentUsage + 1,
            },
          };
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
