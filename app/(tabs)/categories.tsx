import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceStore } from '../../src/store/financeStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../src/constants';

export default function CategoriesScreen() {
  const { categories, fetchCategories, isLoading } = useFinanceStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const incomeCategories = categories.filter((c) => c.type === 'income' || c.type === 'both');
  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'both');

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <View style={styles.categoryCard}>
      <View style={[styles.iconBg, { backgroundColor: item.color + '22' }]}>
        <Ionicons name={item.icon as any} size={22} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <View style={[styles.badge, { backgroundColor: item.type === 'income' ? COLORS.successLight : COLORS.dangerLight }]}>
        <Text style={[styles.badgeText, { color: item.type === 'income' ? COLORS.income : COLORS.expense }]}>
          {item.type === 'income' ? 'Receita' : item.type === 'expense' ? 'Despesa' : 'Ambos'}
        </Text>
      </View>
    </View>
  );

  if (isLoading && categories.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ flex: 1 }} color={COLORS.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorias</Text>
      </View>

      {/* Income */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: COLORS.income }]} />
          <Text style={styles.sectionTitle}>Receitas ({incomeCategories.length})</Text>
        </View>
        <FlatList
          data={incomeCategories}
          keyExtractor={(i) => i.id.toString()}
          renderItem={renderCategory}
          scrollEnabled={false}
        />
      </View>

      {/* Expense */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: COLORS.expense }]} />
          <Text style={styles.sectionTitle}>Despesas ({expenseCategories.length})</Text>
        </View>
        <FlatList
          data={expenseCategories}
          keyExtractor={(i) => i.id.toString()}
          renderItem={renderCategory}
          scrollEnabled={false}
        />
      </View>

      {categories.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🗂️</Text>
          <Text style={styles.emptyText}>Nenhuma categoria disponível</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.base, paddingTop: SPACING.md },
  title: { fontSize: FONTS.size['2xl'], fontWeight: '800', color: COLORS.text },
  section: { paddingHorizontal: SPACING.base, marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  sectionDot: { width: 10, height: 10, borderRadius: 5, marginRight: SPACING.sm },
  sectionTitle: { fontSize: FONTS.size.md, fontWeight: '700', color: COLORS.text },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  iconBg: {
    width: 42, height: 42,
    borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
    marginRight: SPACING.md,
  },
  categoryName: { flex: 1, fontSize: FONTS.size.base, fontWeight: '600', color: COLORS.text },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full },
  badgeText: { fontSize: FONTS.size.xs, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: SPACING['4xl'] },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.size.md, color: COLORS.textSecondary },
});
