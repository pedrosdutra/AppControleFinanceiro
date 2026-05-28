import { create } from 'zustand';
import { Transaction, Category, FinancialSummary, CreateTransactionPayload, UpdateTransactionPayload, EntityId } from '../types';
import { transactionsApi, categoriesApi, summaryApi } from '../services/api';

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  summary: FinancialSummary | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  selectedMonth: number;
  selectedYear: number;
  filterType: 'all' | 'income' | 'expense';

  fetchTransactions: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  createTransaction: (payload: CreateTransactionPayload) => Promise<void>;
  updateTransaction: (id: EntityId, payload: UpdateTransactionPayload) => Promise<void>;
  deleteTransaction: (id: EntityId) => Promise<void>;
  setMonth: (month: number, year: number) => void;
  setFilterType: (type: 'all' | 'income' | 'expense') => void;
  clearError: () => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  categories: [],
  summary: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
  filterType: 'all',

  fetchTransactions: async () => {
    const { selectedMonth, selectedYear, filterType } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await transactionsApi.getAll({
        month: selectedMonth,
        year: selectedYear,
        type: filterType !== 'all' ? filterType : undefined,
      });
      set({ transactions: result.data, isLoading: false });
    } catch (err: any) {
      set({ error: 'Erro ao carregar transações.', isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await categoriesApi.getAll();
      set({ categories });
    } catch {}
  },

  fetchSummary: async () => {
    const { selectedMonth, selectedYear } = get();
    try {
      const summary = await summaryApi.get(selectedMonth, selectedYear);
      set({ summary });
    } catch {}
  },

  createTransaction: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const newTx = await transactionsApi.create(payload);
      set((state) => ({
        transactions: [newTx, ...state.transactions],
        isSubmitting: false,
      }));
      get().fetchSummary();
    } catch (err: any) {
      set({ error: 'Erro ao criar transação.', isSubmitting: false });
      throw err;
    }
  },

  updateTransaction: async (id, payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const updated = await transactionsApi.update(id, payload);
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? updated : t)),
        isSubmitting: false,
      }));
      get().fetchSummary();
    } catch (err: any) {
      set({ error: 'Erro ao atualizar transação.', isSubmitting: false });
      throw err;
    }
  },

  deleteTransaction: async (id) => {
    try {
      await transactionsApi.delete(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
      get().fetchSummary();
    } catch {
      set({ error: 'Erro ao excluir transação.' });
    }
  },

  setMonth: (month, year) => {
    set({ selectedMonth: month, selectedYear: year });
    get().fetchTransactions();
    get().fetchSummary();
  },

  setFilterType: (type) => {
    set({ filterType: type });
    get().fetchTransactions();
  },

  clearError: () => set({ error: null }),
}));
