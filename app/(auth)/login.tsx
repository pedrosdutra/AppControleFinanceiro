import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../src/constants';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('ogpedros123@hotmail.com');
  const [password, setPassword] = useState('123456');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    clearError();
    await login(email.trim(), password);
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Erro', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>💰</Text>
            </View>
            <Text style={styles.appName}>Controle Financeiro</Text>
            <Text style={styles.subtitle}>Gerencie suas finanças com inteligência</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bem-vindo de volta!</Text>
            <Text style={styles.cardSubtitle}>Faça login para continuar</Text>
            <Text style={styles.mockHint}>Mock: ogpedros123@hotmail.com / 123456</Text>

            <Input
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              error={errors.email}
              containerStyle={styles.inputSpacing}
            />
            <Input
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon="lock-closed-outline"
              error={errors.password}
            />

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.loginBtn}
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: SPACING.base, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: SPACING['3xl'] },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.base,
    ...SHADOWS.lg,
  },
  logoIcon: { fontSize: 36 },
  appName: { fontSize: FONTS.size['2xl'], fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: FONTS.size.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING['2xl'],
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  cardTitle: { fontSize: FONTS.size.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  cardSubtitle: { fontSize: FONTS.size.sm, color: COLORS.textSecondary, marginBottom: SPACING['2xl'] },
  mockHint: { fontSize: FONTS.size.xs, color: COLORS.primary, marginTop: -SPACING.lg, marginBottom: SPACING.lg },
  inputSpacing: { marginBottom: SPACING.base },
  loginBtn: { marginTop: SPACING.lg },
  forgotBtn: { alignItems: 'center', marginTop: SPACING.md },
  forgotText: { color: COLORS.primary, fontSize: FONTS.size.sm, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  footerText: { color: COLORS.textSecondary, fontSize: FONTS.size.base },
  footerLink: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.size.base },
});
