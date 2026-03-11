import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
  token: string;
}

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Ideally we hydrate this from localStorage if persisting
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
}));
