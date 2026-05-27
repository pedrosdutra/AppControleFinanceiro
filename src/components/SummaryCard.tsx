import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants';
import { FinancialSummary } from '../types';

interface SummaryCardProps {
  summary: FinancialSummary | null;
  month: number;
  year: number;
}

const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, month, year }) => {
  const income = summary?.total_income ?? 0;
  const expense = summary?.total_expense ?? 0;
  const balance = summary?.balance ?? 0;

  return (
    <View style={styles.card}>
      <Text style={styles.period}>{MONTH_NAMES[month - 1]} {year}</Text>
      <Text style={styles.balanceLabel}>Saldo Total</Text>
      <Text style={[styles.balance, { color: balance >= 0 ? COLORS.income : COLORS.expense }]}>
        {formatCurrency(balance)}
      </Text>
      <View style={styles.row}>
        <View style={styles.item}>
          <View style={[styles.dot, { backgroundColor: COLORS.income }]} />
          <Text style={styles.itemLabel}>Receitas</Text>
          <Text style={[styles.itemValue, { color: COLORS.income }]}>+{formatCurrency(income)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <View style={[styles.dot, { backgroundColor: COLORS.expense }]} />
          <Text style={styles.itemLabel}>Despesas</Text>
          <Text style={[styles.itemValue, { color: COLORS.expense }]}>-{formatCurrency(expense)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING['2xl'],
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.base,
    backgroundColor: COLORS.dark,
    ...SHADOWS.lg,
  },
  period: {
    fontSize: FONTS.size.sm,
    color: COLORS.primaryLight,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  balanceLabel: {
    fontSize: FONTS.size.base,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: SPACING.xs,
  },
  balance: {
    fontSize: FONTS.size['3xl'],
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  item: { flex: 1, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: SPACING.xs },
  itemLabel: { fontSize: FONTS.size.xs, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  itemValue: { fontSize: FONTS.size.md, fontWeight: '700' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: SPACING.md },
});
