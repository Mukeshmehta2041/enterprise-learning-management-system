import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  redirectPath: string | null;
  setAuth: (user: User | null, token: string) => Promise<void>;
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
        // Since we have a token, try to fetch the user profile
        // Import apiClient dynamically or use it if available
        const { apiClient } = await import("../api/client");
        try {
          const userResponse = await apiClient.get("/api/v1/users/me");
          const userData = userResponse.data;
          const user = {
            id: userData.id,
            email: userData.email,
            fullName: userData.displayName || userData.fullName || userData.email,
            role: Array.isArray(userData.roles) ? userData.roles[0] : userData.role,
            avatarUrl: userData.avatarUrl,
            bio: userData.bio,
            createdAt: userData.createdAt,
          };
          set({ token, user, isLoading: false });
        } catch (err) {
          console.error("Failed to fetch user during initialization", err);
          // If token is invalid/expired, logout
          await SecureStore.deleteItemAsync("auth_token");
          set({ token: null, user: null, isLoading: false });
        }
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
