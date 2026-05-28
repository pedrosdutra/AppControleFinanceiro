import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { transactionsApi } from '../../src/services/api';
import { Transaction } from '../../src/types';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { useFinanceStore } from '../../src/store/financeStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../src/constants';
import { formatIsoDateToDisplay } from '../../src/utils/date';

const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const formatDate = (dateStr: string) => formatIsoDateToDisplay(dateStr);

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { deleteTransaction } = useFinanceStore();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      transactionsApi.getById(id)
        .then(setTransaction)
        .catch(() => Alert.alert('Erro', 'Transação não encontrada.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Excluir Transação',
      'Esta ação não pode ser desfeita. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(id);
            router.back();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ flex: 1 }} color={COLORS.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Transação não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isIncome = transaction.type === 'income';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Amount Hero */}
        <View style={[styles.hero, { backgroundColor: isIncome ? COLORS.income : COLORS.expense }]}>
          <Ionicons
            name={isIncome ? 'arrow-down-circle' : 'arrow-up-circle'}
            size={48}
            color="rgba(255,255,255,0.8)"
            style={{ marginBottom: SPACING.sm }}
          />
          <Text style={styles.heroAmount}>{formatCurrency(transaction.amount)}</Text>
          <Text style={styles.heroType}>{isIncome ? 'Receita' : 'Despesa'}</Text>
        </View>

        {/* Details Card */}
        <Card style={styles.card} variant="elevated">
          <DetailRow icon="text" label="Título" value={transaction.title} />
          <DetailRow icon="calendar" label="Data" value={formatDate(transaction.date)} />
          <DetailRow icon="grid" label="Categoria" value={transaction.category?.name ?? 'Sem categoria'} />
          {transaction.notes ? (
            <DetailRow icon="chatbubble" label="Observações" value={transaction.notes} />
          ) : null}
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Editar"
            variant="outline"
            leftIcon={<Ionicons name="pencil" size={16} color={COLORS.primary} />}
            onPress={() => router.push(`/transaction/edit/${id}`)}
            style={styles.actionBtn}
          />
          <Button
            title="Excluir"
            variant="danger"
            leftIcon={<Ionicons name="trash" size={16} color={COLORS.white} />}
            onPress={handleDelete}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.icon}>
        <Ionicons name={icon as any} size={18} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={rowStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  icon: {
    width: 36, height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    marginRight: SPACING.md,
  },
  label: { fontSize: FONTS.size.xs, color: COLORS.textLight, fontWeight: '500' },
  value: { fontSize: FONTS.size.base, color: COLORS.text, fontWeight: '600', marginTop: 2 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.base },
  hero: {
    borderRadius: RADIUS.xl,
    padding: SPACING['2xl'],
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
  },
  heroAmount: { fontSize: FONTS.size['3xl'], fontWeight: '800', color: COLORS.white },
  heroType: { fontSize: FONTS.size.base, color: 'rgba(255,255,255,0.8)', marginTop: SPACING.xs },
  card: { marginBottom: SPACING.md },
  actions: { flexDirection: 'row', gap: SPACING.md },
  actionBtn: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: FONTS.size.md, color: COLORS.textSecondary },
});
