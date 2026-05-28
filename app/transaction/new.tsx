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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceStore } from '../../src/store/financeStore';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../src/constants';
import { EntityId, TransactionType } from '../../src/types';
import { formatIsoDateToDisplay, maskDateInput, parseDisplayDateToIso } from '../../src/utils/date';

export default function NewTransactionScreen() {
  const router = useRouter();
  const { type: typeParam } = useLocalSearchParams<{ type?: string }>();
  const { categories, createTransaction, isSubmitting, fetchCategories } = useFinanceStore();

  const [transactionType, setTransactionType] = useState<TransactionType>(
    typeParam === 'income' ? 'income' : 'expense'
  );
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<EntityId | null>(null);
  const [date, setDate] = useState(formatIsoDateToDisplay(new Date().toISOString().split('T')[0]));
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (c) => c.type === transactionType || c.type === 'both'
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Título é obrigatório';
    if (!amount) e.amount = 'Valor é obrigatório';
    else if (isNaN(Number(amount.replace(',', '.'))) || Number(amount.replace(',', '.')) <= 0) {
      e.amount = 'Valor inválido';
    }
    if (!categoryId) e.category = 'Selecione uma categoria';
    if (!date) e.date = 'Data é obrigatória';
    else if (!parseDisplayDateToIso(date)) e.date = 'Use o formato dd/mm/aaaa';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const normalizedDate = parseDisplayDateToIso(date);

    if (!normalizedDate) {
      setErrors((currentErrors) => ({ ...currentErrors, date: 'Use o formato dd/mm/aaaa' }));
      return;
    }

    try {
      await createTransaction({
        title: title.trim(),
        amount: Number(amount.replace(',', '.')),
        type: transactionType,
        category_id: categoryId!,
        date: normalizedDate,
        notes: notes.trim() || undefined,
      });
      Alert.alert('Sucesso', 'Transação criada com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a transação.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          
          {/* Type Toggle */}
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

          {/* Category Picker */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryLabel}>Categoria</Text>
            <View style={styles.categoryGrid}>
              {filteredCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    categoryId === cat.id && { backgroundColor: cat.color, borderColor: cat.color },
                  ]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <Ionicons name={cat.icon as any} size={16} color={categoryId === cat.id ? COLORS.white : cat.color} />
                  <Text style={[styles.chipText, categoryId === cat.id && { color: COLORS.white }]}>
                    {cat.name}
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
            title="Salvar Transação"
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
