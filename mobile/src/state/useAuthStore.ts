import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  redirectPath: string | null;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setRedirectPath: (path: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  redirectPath: null,
  setAuth: async (user, token) => {
    await SecureStore.setItemAsync("auth_token", token);
    set({ user, token, isLoading: false });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync("auth_token");
    set({ user: null, token: null, isLoading: false });
  },
  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        set({ token, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to initialize auth", error);
      set({ isLoading: false });
    }
  },
  setRedirectPath: (path) => set({ redirectPath: path }),
}));
