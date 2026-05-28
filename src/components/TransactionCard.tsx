import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants';
import { formatIsoDateToDisplay } from '../utils/date';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
}

const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const formatDate = (dateStr: string) => formatIsoDateToDisplay(dateStr);

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
  onDelete,
}) => {
  const isIncome = transaction.type === 'income';

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: isIncome ? COLORS.successLight : COLORS.dangerLight }]}>
        <Ionicons
          name={isIncome ? 'arrow-down-circle' : 'arrow-up-circle'}
          size={24}
          color={isIncome ? COLORS.income : COLORS.expense}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{transaction.title}</Text>
        <Text style={styles.category}>{transaction.category?.name || 'Sem categoria'}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={16} color={COLORS.textLight} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  info: { flex: 1, marginRight: SPACING.sm },
  title: { fontSize: FONTS.size.base, fontWeight: '600', color: COLORS.text },
  category: { fontSize: FONTS.size.xs, color: COLORS.textLight, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: FONTS.size.base, fontWeight: '700' },
  date: { fontSize: FONTS.size.xs, color: COLORS.textLight, marginTop: 2 },
  deleteBtn: { marginLeft: SPACING.sm },
});
