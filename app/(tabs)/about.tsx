import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../src/constants';

const TECH_STACK = [
  { name: 'React Native', icon: 'logo-react', color: '#61DAFB' },
  { name: 'Expo Router', icon: 'navigate', color: '#000020' },
  { name: 'Zustand', icon: 'layers', color: '#764ABC' },
  { name: 'TypeScript', icon: 'code-slash', color: '#3178C6' },
  { name: 'Axios', icon: 'cloud', color: '#5A29E4' },
];

const FEATURES = [
  { icon: 'shield-checkmark', title: 'Autenticação Segura', desc: 'Login e cadastro com JWT.' },
  { icon: 'bar-chart', title: 'Resumo Financeiro', desc: 'Visão consolidada de receitas e despesas.' },
  { icon: 'swap-vertical', title: 'CRUD Transações', desc: 'Crie, edite e exclua lançamentos financeiros.' },
  { icon: 'grid', title: 'Categorias', desc: 'Organize suas transações por categoria.' },
  { icon: 'moon', title: 'Design Moderno', desc: 'Interface limpa e intuitiva.' },
];

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>💰</Text>
          </View>
          <Text style={styles.appName}>Controle Financeiro</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
          <Text style={styles.description}>
            Aplicativo de gerenciamento financeiro pessoal desenvolvido com React Native e Expo.
            Gerencie suas finanças de forma simples, visual e eficiente.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funcionalidades</Text>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon as any} size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tech Stack */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tecnologias</Text>
          <View style={styles.techGrid}>
            {TECH_STACK.map((t, i) => (
              <View key={i} style={styles.techBadge}>
                <Ionicons name={t.icon as any} size={18} color={t.color} />
                <Text style={styles.techName}>{t.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Feito com ❤️ para a disciplina de Desenvolvimento Mobile</Text>
          <Text style={styles.footerYear}>© 2025 – AppControleFinanceiro</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  hero: { alignItems: 'center', padding: SPACING['2xl'], paddingBottom: SPACING.lg },
  logoCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.darkCard,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
  },
  logoEmoji: { fontSize: 40 },
  appName: { fontSize: FONTS.size['2xl'], fontWeight: '800', color: COLORS.text },
  version: {
    fontSize: FONTS.size.sm,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginVertical: SPACING.sm,
    fontWeight: '600',
  },
  description: {
    fontSize: FONTS.size.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: SPACING.sm,
  },
  section: { paddingHorizontal: SPACING.base, marginBottom: SPACING.xl },
  sectionTitle: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  featureIcon: {
    width: 40, height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    marginRight: SPACING.md,
  },
  featureTitle: { fontSize: FONTS.size.base, fontWeight: '600', color: COLORS.text },
  featureDesc: { fontSize: FONTS.size.sm, color: COLORS.textSecondary, marginTop: 2 },
  techGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  techBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  techName: { fontSize: FONTS.size.sm, fontWeight: '600', color: COLORS.text },
  footer: { alignItems: 'center', padding: SPACING.xl, paddingBottom: SPACING['2xl'] },
  footerText: { fontSize: FONTS.size.sm, color: COLORS.textSecondary, textAlign: 'center' },
  footerYear: { fontSize: FONTS.size.xs, color: COLORS.textLight, marginTop: SPACING.xs },
});
