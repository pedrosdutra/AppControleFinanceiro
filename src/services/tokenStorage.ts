import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = 'auth_token';
const SECURE_STORE_TIMEOUT_MS = 1500;

const logTokenStorage = (...messages: unknown[]) => {
  if (__DEV__) {
    console.log('[token-storage]', ...messages);
  }
};

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => resolve(null), timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

export const tokenStorage = {
  getToken: async () => {
    if (Platform.OS === 'web') {
      logTokenStorage('getToken web');
      return AsyncStorage.getItem(AUTH_TOKEN_KEY);
    }

    try {
      logTokenStorage('getToken native secure-store:start');
      const secureToken = await withTimeout(
        SecureStore.getItemAsync(AUTH_TOKEN_KEY),
        SECURE_STORE_TIMEOUT_MS
      );

      if (typeof secureToken === 'string') {
        logTokenStorage('getToken native secure-store:hit');
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, secureToken);
        return secureToken;
      }

      logTokenStorage('getToken native secure-store:timeout-or-empty');
    } catch {}

    logTokenStorage('getToken native async-storage:fallback');
    return AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },

  setToken: async (token: string) => {
    if (Platform.OS === 'web') {
      logTokenStorage('setToken web');
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      return;
    }

    logTokenStorage('setToken native async-storage');
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);

    try {
      logTokenStorage('setToken native secure-store');
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    } catch {}
  },

  clearToken: async () => {
    if (Platform.OS === 'web') {
      logTokenStorage('clearToken web');
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      return;
    }

    logTokenStorage('clearToken native async-storage');
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);

    try {
      logTokenStorage('clearToken native secure-store');
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    } catch {}
  },
};