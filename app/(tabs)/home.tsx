import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { useFinanceStore } from '../../src/store/financeStore';
import { SummaryCard } from '../../src/components/SummaryCard';
import { TransactionCard } from '../../src/components/TransactionCard';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, MONTH_NAMES } from '../../src/constants';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const {
    transactions,
    summary,
    isLoading,
    selectedMonth,
    selectedYear,
    fetchTransactions,
    fetchSummary,
    fetchCategories,
    deleteTransaction,
    setMonth,
  } = useFinanceStore();

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
    fetchSummary();
  }, []);

  const onRefresh = useCallback(() => {
    fetchTransactions();
    fetchSummary();
  }, [selectedMonth, selectedYear]);

  const changeMonth = (direction: -1 | 1) => {
    let m = selectedMonth + direction;
    let y = selectedYear;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setMonth(m, y);
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0] ?? 'Usuário'}! 👋</Text>
            <Text style={styles.headerSub}>Aqui está seu resumo financeiro</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthBtn}>
            <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.monthText}>{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthBtn}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <SummaryCard summary={summary} month={selectedMonth} year={selectedYear} />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: COLORS.successLight }]}
              onPress={() => router.push('/transaction/new?type=income')}
            >
              <Ionicons name="add-circle" size={28} color={COLORS.income} />
              <Text style={[styles.actionText, { color: COLORS.income }]}>Receita</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: COLORS.dangerLight }]}
              onPress={() => router.push('/transaction/new?type=expense')}
            >
              <Ionicons name="remove-circle" size={28} color={COLORS.expense} />
              <Text style={[styles.actionText, { color: COLORS.expense }]}>Despesa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: COLORS.surfaceAlt }]}
              onPress={() => router.push('/(tabs)/transactions')}
            >
              <Ionicons name="list" size={28} color={COLORS.primary} />
              <Text style={[styles.actionText, { color: COLORS.primary }]}>Ver Tudo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transações Recentes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>💸</Text>
              <Text style={styles.emptyText}>Nenhuma transação este mês</Text>
              <Text style={styles.emptySubText}>Adicione sua primeira transação!</Text>
            </View>
          ) : (
            recentTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onPress={() => router.push(`/transaction/${tx.id}`)}
                onDelete={() => deleteTransaction(tx.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.base,
    paddingTop: SPACING.md,
  },
  greeting: { fontSize: FONTS.size.xl, fontWeight: '700', color: COLORS.text },
  headerSub: { fontSize: FONTS.size.sm, color: COLORS.textSecondary, marginTop: 2 },
  logoutBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  monthBtn: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  monthText: { fontSize: FONTS.size.md, fontWeight: '600', color: COLORS.text, minWidth: 150, textAlign: 'center' },
  section: { paddingHorizontal: SPACING.base, marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONTS.size.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  seeAll: { fontSize: FONTS.size.sm, color: COLORS.primary, fontWeight: '600' },
  quickActions: { flexDirection: 'row', gap: SPACING.md },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  actionText: { fontSize: FONTS.size.sm, fontWeight: '600', marginTop: SPACING.xs },
  empty: { alignItems: 'center', paddingVertical: SPACING['3xl'] },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.size.md, fontWeight: '600', color: COLORS.textSecondary },
  emptySubText: { fontSize: FONTS.size.sm, color: COLORS.textLight, marginTop: SPACING.xs },
});
