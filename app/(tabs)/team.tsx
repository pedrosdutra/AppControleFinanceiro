import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../src/constants';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Ana Souza',
    role: 'Desenvolvedora Mobile',
    bio: 'Especialista em React Native com 4 anos de experiência. Apaixonada por UX e design de produtos digitais.',
    avatar: 'https://i.pravatar.cc/150?img=1',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 2,
    name: 'Carlos Lima',
    role: 'Desenvolvedor Back-end',
    bio: 'Desenvolvedor PHP/Laravel com foco em APIs REST. Gosta de banco de dados e arquitetura limpa.',
    avatar: 'https://i.pravatar.cc/150?img=3',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 3,
    name: 'Beatriz Nunes',
    role: 'UI/UX Designer',
    bio: 'Designer criativa com background em finanças pessoais. Responsável pela identidade visual do app.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

export default function TeamScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nossa Equipe</Text>
          <Text style={styles.subtitle}>
            Conheça as pessoas por trás do Controle Financeiro
          </Text>
        </View>

        {/* Team Cards */}
        {TEAM_MEMBERS.map((member) => (
          <View key={member.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Image source={{ uri: member.avatar }} style={styles.avatar} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{member.role}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.bio}>{member.bio}</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => Linking.openURL(member.github)}
              >
                <Ionicons name="logo-github" size={18} color={COLORS.text} />
                <Text style={styles.socialText}>GitHub</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialBtn, { backgroundColor: COLORS.surfaceAlt }]}
                onPress={() => Linking.openURL(member.linkedin)}
              >
                <Ionicons name="logo-linkedin" size={18} color={COLORS.primary} />
                <Text style={[styles.socialText, { color: COLORS.primary }]}>LinkedIn</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Collaboration Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>🤝</Text>
          <Text style={styles.bannerTitle}>Trabalhando juntos</Text>
          <Text style={styles.bannerText}>
            Nossa equipe é apaixonada por criar soluções financeiras acessíveis e elegantes para todos.
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
    width: 64, height: 64, borderRadius: 32,
    marginRight: SPACING.md,
    borderWidth: 3, borderColor: COLORS.primaryLight,
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
  socialRow: { flexDirection: 'row', gap: SPACING.sm },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialText: { fontSize: FONTS.size.sm, fontWeight: '600', color: COLORS.text },
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
