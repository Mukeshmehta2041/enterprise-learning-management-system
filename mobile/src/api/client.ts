import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { mapErrorToMobileError } from "../utils/errors";
import { Config } from "../config";

const BASE_URL = Config.apiUrl;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("auth_token");
    }

    // Map to normalized MobileAppError
    const mobileError = mapErrorToMobileError(error);
    return Promise.reject(mobileError);
  }
);
