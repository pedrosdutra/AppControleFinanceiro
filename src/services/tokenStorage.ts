import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  getToken: async () => {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(AUTH_TOKEN_KEY);
    }

    return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  },

  setToken: async (token: string) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      return;
    }

    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  },

  clearToken: async () => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  },
};