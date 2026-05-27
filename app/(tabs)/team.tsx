import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../src/constants';

const PROFILE_PHOTO = require('../../assets/pedro-dutra.png');

const PROFILE = {
  name: 'Pedro Dutra',
  role: 'Desenvolvedor do Projeto',
  bio: 'Responsável pelo desenvolvimento da aplicação, estrutura de navegação, autenticação, gerenciamento de estado e interface do projeto.',
  focus: ['Expo Router', 'Zustand', 'React Native', 'UX escura'],
};

export default function TeamScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sobre Mim</Text>
          <Text style={styles.subtitle}>
            Projeto desenvolvido individualmente para a disciplina
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Image source={PROFILE_PHOTO} style={styles.avatar} />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{PROFILE.name}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{PROFILE.role}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.bio}>{PROFILE.bio}</Text>

          <View style={styles.focusSection}>
            <Text style={styles.focusTitle}>Principais frentes</Text>
            <View style={styles.focusRow}>
              {PROFILE.focus.map((item) => (
                <View key={item} style={styles.focusBadge}>
                  <Text style={styles.focusText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Collaboration Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>🚀</Text>
          <Text style={styles.bannerTitle}>Projeto Individual</Text>
          <Text style={styles.bannerText}>
            O aplicativo foi pensado e desenvolvido por uma unica pessoa, da ideia inicial ate a interface final.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.base, paddingTop: SPACING.md, marginBottom: SPACING.md },
  title: { fontSize: FONTS.size['2xl'], fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: FONTS.size.base, color: COLORS.textSecondary, marginTop: SPACING.xs },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    marginRight: SPACING.md,
    borderWidth: 3, borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.surfaceAlt,
  },
  memberInfo: { flex: 1 },
  memberName: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.text },
  roleBadge: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  roleText: { fontSize: FONTS.size.xs, color: COLORS.primary, fontWeight: '600' },
  bio: { fontSize: FONTS.size.sm, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.md },
  focusSection: { marginTop: SPACING.xs },
  focusTitle: { fontSize: FONTS.size.sm, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  focusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  focusBadge: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  focusText: { fontSize: FONTS.size.sm, fontWeight: '600', color: COLORS.textSecondary },
  banner: {
    margin: SPACING.base,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING['2xl'],
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    ...SHADOWS.lg,
  },
  bannerEmoji: { fontSize: 40, marginBottom: SPACING.md },
  bannerTitle: { fontSize: FONTS.size.xl, fontWeight: '700', color: COLORS.white, marginBottom: SPACING.sm },
  bannerText: { fontSize: FONTS.size.sm, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 22 },
});
