import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { transactionsApi } from '../../../src/services/api';
import { useFinanceStore } from '../../../src/store/financeStore';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../../src/constants';
import { EntityId, TransactionType } from '../../../src/types';
import { formatIsoDateToDisplay, maskDateInput, parseDisplayDateToIso } from '../../../src/utils/date';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { categories, fetchCategories, updateTransaction, isSubmitting } = useFinanceStore();

  const [isLoadingTransaction, setIsLoadingTransaction] = useState(true);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<EntityId | null>(null);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!id) {
      setIsLoadingTransaction(false);
      Alert.alert('Erro', 'Transação não encontrada.', [{ text: 'OK', onPress: () => router.back() }]);
      return;
    }

    let isActive = true;
    setIsLoadingTransaction(true);

    transactionsApi.getById(id)
      .then((transaction) => {
        if (!isActive) {
          return;
        }

        setTransactionType(transaction.type);
        setTitle(transaction.title);
        setAmount(transaction.amount.toFixed(2).replace('.', ','));
        setCategoryId(transaction.category_id);
        setDate(formatIsoDateToDisplay(transaction.date));
        setNotes(transaction.notes ?? '');
      })
      .catch(() => {
        if (isActive) {
          Alert.alert('Erro', 'Transação não encontrada.', [{ text: 'OK', onPress: () => router.back() }]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingTransaction(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [id, router]);

  const filteredCategories = categories.filter(
    (category) => category.type === transactionType || category.type === 'both'
  );

  useEffect(() => {
    if (!categoryId || categories.length === 0) {
      return;
    }

    const hasValidCategory = categories.some(
      (category) => category.id === categoryId
        && (category.type === transactionType || category.type === 'both')
    );

    if (!hasValidCategory) {
      setCategoryId(null);
    }
  }, [categories, categoryId, transactionType]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!title.trim()) nextErrors.title = 'Título é obrigatório';

    if (!amount) {
      nextErrors.amount = 'Valor é obrigatório';
    } else if (Number.isNaN(Number(amount.replace(',', '.'))) || Number(amount.replace(',', '.')) <= 0) {
      nextErrors.amount = 'Valor inválido';
    }

    if (!categoryId) nextErrors.category = 'Selecione uma categoria';

    if (!date) {
      nextErrors.date = 'Data é obrigatória';
    } else if (!parseDisplayDateToIso(date)) {
      nextErrors.date = 'Use o formato dd/mm/aaaa';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!id || !validate()) {
      return;
    }

    const normalizedDate = parseDisplayDateToIso(date);

    if (!normalizedDate) {
      setErrors((currentErrors) => ({ ...currentErrors, date: 'Use o formato dd/mm/aaaa' }));
      return;
    }

    try {
      await updateTransaction(id, {
        title: title.trim(),
        amount: Number(amount.replace(',', '.')),
        type: transactionType,
        category_id: categoryId!,
        date: normalizedDate,
        notes: notes.trim() || undefined,
      });

      if (Platform.OS === 'web') {
        router.back();
        return;
      }

      Alert.alert('Sucesso', 'Transação atualizada com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar a transação.');
    }
  };

  if (isLoadingTransaction) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ flex: 1 }} color={COLORS.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[styles.typeBtn, transactionType === 'income' && styles.typeBtnActiveIncome]}
              onPress={() => setTransactionType('income')}
            >
              <Ionicons name="arrow-down-circle" size={20} color={transactionType === 'income' ? COLORS.white : COLORS.textSecondary} />
              <Text style={[styles.typeBtnText, transactionType === 'income' && styles.typeBtnTextActive]}>Receita</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, transactionType === 'expense' && styles.typeBtnActiveExpense]}
              onPress={() => setTransactionType('expense')}
            >
              <Ionicons name="arrow-up-circle" size={20} color={transactionType === 'expense' ? COLORS.white : COLORS.textSecondary} />
              <Text style={[styles.typeBtnText, transactionType === 'expense' && styles.typeBtnTextActive]}>Despesa</Text>
            </TouchableOpacity>
          </View>

          <Input
            label="Título"
            placeholder="Ex: Salário, Aluguel, Mercado..."
            value={title}
            onChangeText={setTitle}
            leftIcon="text"
            error={errors.title}
          />

          <Input
            label="Valor (R$)"
            placeholder="0,00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            leftIcon="cash"
            error={errors.amount}
          />

          <Input
            label="Data"
            placeholder="dd/mm/aaaa"
            value={date}
            onChangeText={(value) => setDate(maskDateInput(value))}
            leftIcon="calendar"
            keyboardType="number-pad"
            maxLength={10}
            error={errors.date}
          />

          <View style={styles.categorySection}>
            <Text style={styles.categoryLabel}>Categoria</Text>
            <View style={styles.categoryGrid}>
              {filteredCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    categoryId === category.id && {
                      backgroundColor: category.color,
                      borderColor: category.color,
                    },
                  ]}
                  onPress={() => setCategoryId(category.id)}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={16}
                    color={categoryId === category.id ? COLORS.white : category.color}
                  />
                  <Text style={[styles.chipText, categoryId === category.id && { color: COLORS.white }]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          <Input
            label="Observações (opcional)"
            placeholder="Adicione uma nota..."
            value={notes}
            onChangeText={setNotes}
            leftIcon="chatbubble-outline"
            multiline
            numberOfLines={3}
            containerStyle={{ marginBottom: SPACING.lg }}
          />

          <Button
            title="Salvar Alterações"
            onPress={handleSubmit}
            loading={isSubmitting}
            fullWidth
            size="lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.base, paddingBottom: SPACING['4xl'] },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xs,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  typeBtnActiveIncome: { backgroundColor: COLORS.income },
  typeBtnActiveExpense: { backgroundColor: COLORS.expense },
  typeBtnText: { fontSize: FONTS.size.base, fontWeight: '600', color: COLORS.textSecondary },
  typeBtnTextActive: { color: COLORS.white },
  categorySection: { marginBottom: SPACING.md },
  categoryLabel: {
    fontSize: FONTS.size.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  chipText: { fontSize: FONTS.size.sm, fontWeight: '600', color: COLORS.textSecondary },
  errorText: { fontSize: FONTS.size.xs, color: COLORS.danger, marginTop: SPACING.xs },
});