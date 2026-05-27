import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../src/constants';
import { useAuthStore } from '../src/store/authStore';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated, loadToken } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!isHydrated) {
      loadToken();
    }
  }, [isHydrated, loadToken]);

  useEffect(() => {
    if (!rootNavigationState?.key || !isHydrated) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isHydrated, rootNavigationState?.key, router, segments]);

  return (
    <>
      {children}
      {!isHydrated ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.background,
            pointerEvents: 'none',
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : null}
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="transaction/[id]"
              options={{
                headerShown: true,
                title: 'Detalhes',
                headerBackTitle: 'Voltar',
                headerStyle: { backgroundColor: COLORS.surface },
                headerTintColor: COLORS.text,
                headerTitleStyle: { color: COLORS.text },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: COLORS.background },
              }}
            />
            <Stack.Screen
              name="transaction/new"
              options={{
                headerShown: true,
                title: 'Nova Transação',
                headerBackTitle: 'Voltar',
                headerStyle: { backgroundColor: COLORS.surface },
                headerTintColor: COLORS.text,
                headerTitleStyle: { color: COLORS.text },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: COLORS.background },
              }}
            />
          </Stack>
        </AuthGate>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
