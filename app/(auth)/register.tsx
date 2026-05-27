import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../src/constants';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nome é obrigatório';
    if (!email.trim()) e.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido';
    if (!password) e.password = 'Senha é obrigatória';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (password !== passwordConfirmation) e.passwordConfirmation = 'Senhas não coincidem';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    clearError();
    await register(name.trim(), email.trim(), password, passwordConfirmation);
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
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Comece sua jornada financeira hoje</Text>
          </View>

          <View style={styles.card}>
            <Input
              label="Nome Completo"
              placeholder="Seu nome"
              value={name}
              onChangeText={setName}
              leftIcon="person-outline"
              error={errors.name}
            />
            <Input
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              error={errors.email}
            />
            <Input
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon="lock-closed-outline"
              error={errors.password}
            />
            <Input
              label="Confirmar Senha"
              placeholder="Repita a senha"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              isPassword
              leftIcon="shield-checkmark-outline"
              error={errors.passwordConfirmation}
            />

            <Button
              title="Criar Conta"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.btn}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: SPACING.base },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  header: { marginBottom: SPACING['2xl'] },
  title: { fontSize: FONTS.size['3xl'], fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: FONTS.size.base, color: COLORS.textSecondary, marginTop: SPACING.xs },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING['2xl'],
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  btn: { marginTop: SPACING.base },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  footerText: { color: COLORS.textSecondary, fontSize: FONTS.size.base },
  footerLink: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.size.base },
});
