import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceStore } from '../../src/store/financeStore';
import { TransactionCard } from '../../src/components/TransactionCard';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../src/constants';

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'income', label: 'Receitas' },
  { key: 'expense', label: 'Despesas' },
] as const;

export default function TransactionsScreen() {
  const router = useRouter();
  const {
    transactions,
    isLoading,
    filterType,
    fetchTransactions,
    deleteTransaction,
    setFilterType,
  } = useFinanceStore();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert(
      'Excluir Transação',
      'Tem certeza que deseja excluir esta transação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteTransaction(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transações</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/transaction/new')}
        >
          <Ionicons name="add" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilterType(f.key)}
            style={[styles.filterBtn, filterType === f.key && styles.filterActive]}
          >
            <Text style={[styles.filterText, filterType === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchTransactions} tintColor={COLORS.primary} />}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            onPress={() => router.push(`/transaction/${item.id}`)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
            </View>
          ) : null
        }
      />
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
  title: { fontSize: FONTS.size['2xl'], fontWeight: '800', color: COLORS.text },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.md,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  filterBtn: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  filterActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONTS.size.sm, color: COLORS.textSecondary, fontWeight: '600' },
  filterTextActive: { color: COLORS.white },
  list: { paddingHorizontal: SPACING.base, paddingBottom: SPACING['2xl'] },
  empty: { alignItems: 'center', paddingVertical: SPACING['4xl'] },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.size.md, color: COLORS.textSecondary },
});
