import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { tokenStorage } from './tokenStorage';
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  Transaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  Category,
  FinancialSummary,
  User,
} from '../types';

const MOCK_AUTH_TOKEN = 'mock-auth-token';
const MOCK_TRANSACTIONS_KEY = 'mock-transactions';

const MOCK_USER: User = {
  id: 1,
  name: 'Pedro Gomes',
  email: 'ogpedros123@hotmail.com',
  created_at: '2026-05-27T00:00:00.000Z',
};

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Salario', icon: 'cash', color: '#34D399', type: 'income' },
  { id: 2, name: 'Freelance', icon: 'laptop', color: '#8B80F9', type: 'income' },
  { id: 3, name: 'Investimentos', icon: 'trending-up', color: '#60A5FA', type: 'income' },
  { id: 4, name: 'Alimentacao', icon: 'fast-food', color: '#F59E0B', type: 'expense' },
  { id: 5, name: 'Transporte', icon: 'car', color: '#38BDF8', type: 'expense' },
  { id: 6, name: 'Moradia', icon: 'home', color: '#FB7185', type: 'expense' },
  { id: 7, name: 'Saude', icon: 'medkit', color: '#22C55E', type: 'expense' },
  { id: 8, name: 'Outros', icon: 'ellipsis-horizontal', color: '#A78BFA', type: 'both' },
];

const isMockCredentialLogin = (payload: LoginPayload) => (
  payload.email.trim().toLowerCase() === MOCK_USER.email && payload.password === '123456'
);

const isUsingMockData = async () => (await tokenStorage.getToken()) === MOCK_AUTH_TOKEN;

const getMockTransactions = async (): Promise<Transaction[]> => {
  const raw = await AsyncStorage.getItem(MOCK_TRANSACTIONS_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Transaction[];
  } catch {
    await AsyncStorage.removeItem(MOCK_TRANSACTIONS_KEY);
    return [];
  }
};

const saveMockTransactions = async (transactions: Transaction[]) => {
  await AsyncStorage.setItem(MOCK_TRANSACTIONS_KEY, JSON.stringify(transactions));
};

const withMockCategory = (transaction: Transaction): Transaction => ({
  ...transaction,
  category: MOCK_CATEGORIES.find((category) => category.id === transaction.category_id),
});

const getFilteredMockTransactions = async (params?: {
  month?: number;
  year?: number;
  type?: string;
  category_id?: number;
}) => {
  const transactions = (await getMockTransactions()).map(withMockCategory);

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const matchesMonth = params?.month ? transactionDate.getMonth() + 1 === params.month : true;
    const matchesYear = params?.year ? transactionDate.getFullYear() === params.year : true;
    const matchesType = params?.type ? transaction.type === params.type : true;
    const matchesCategory = params?.category_id ? transaction.category_id === params.category_id : true;

    return matchesMonth && matchesYear && matchesType && matchesCategory;
  });
};

const buildMockTransaction = (payload: CreateTransactionPayload): Transaction => {
  const now = new Date().toISOString();

  return withMockCategory({
    id: Date.now(),
    title: payload.title,
    amount: payload.amount,
    type: payload.type,
    category_id: payload.category_id,
    date: payload.date,
    notes: payload.notes,
    user_id: MOCK_USER.id,
    created_at: now,
    updated_at: now,
  });
};

// ===================== AXIOS INSTANCE =====================
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await tokenStorage.clearToken();
    }
    return Promise.reject(error);
  }
);

// ===================== AUTH =====================
export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    if (isMockCredentialLogin(payload)) {
      return { user: MOCK_USER, token: MOCK_AUTH_TOKEN };
    }

    const res = await api.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },
  logout: async (): Promise<void> => {
    const token = await tokenStorage.getToken();
    if (token === MOCK_AUTH_TOKEN) {
      return;
    }

    await api.post('/auth/logout');
  },
  me: async (): Promise<User> => {
    const token = await tokenStorage.getToken();
    if (token === MOCK_AUTH_TOKEN) {
      return MOCK_USER;
    }

    const res = await api.get<User>('/auth/me');
    return res.data;
  },
};

// ===================== TRANSACTIONS =====================
export const transactionsApi = {
  getAll: async (params?: {
    month?: number;
    year?: number;
    type?: string;
    category_id?: number;
    page?: number;
  }): Promise<{ data: Transaction[]; total: number }> => {
    if (await isUsingMockData()) {
      const data = await getFilteredMockTransactions(params);
      return { data, total: data.length };
    }

    const res = await api.get('/transactions', { params });
    return res.data;
  },
  getById: async (id: number): Promise<Transaction> => {
    if (await isUsingMockData()) {
      const transaction = (await getMockTransactions()).map(withMockCategory).find((item) => item.id === id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return transaction;
    }

    const res = await api.get<Transaction>(`/transactions/${id}`);
    return res.data;
  },
  create: async (payload: CreateTransactionPayload): Promise<Transaction> => {
    if (await isUsingMockData()) {
      const transaction = buildMockTransaction(payload);
      const transactions = await getMockTransactions();
      await saveMockTransactions([transaction, ...transactions]);
      return transaction;
    }

    const res = await api.post<Transaction>('/transactions', payload);
    return res.data;
  },
  update: async (id: number, payload: UpdateTransactionPayload): Promise<Transaction> => {
    if (await isUsingMockData()) {
      const transactions = await getMockTransactions();
      const index = transactions.findIndex((transaction) => transaction.id === id);

      if (index < 0) {
        throw new Error('Transaction not found');
      }

      const updatedTransaction = withMockCategory({
        ...transactions[index],
        ...payload,
        updated_at: new Date().toISOString(),
      });

      transactions[index] = updatedTransaction;
      await saveMockTransactions(transactions);
      return updatedTransaction;
    }

    const res = await api.put<Transaction>(`/transactions/${id}`, payload);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    if (await isUsingMockData()) {
      const transactions = await getMockTransactions();
      await saveMockTransactions(transactions.filter((transaction) => transaction.id !== id));
      return;
    }

    await api.delete(`/transactions/${id}`);
  },
};

// ===================== CATEGORIES =====================
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    if (await isUsingMockData()) {
      return MOCK_CATEGORIES;
    }

    const res = await api.get<Category[]>('/categories');
    return res.data;
  },
};

// ===================== SUMMARY =====================
export const summaryApi = {
  get: async (month: number, year: number): Promise<FinancialSummary> => {
    if (await isUsingMockData()) {
      const transactions = await getFilteredMockTransactions({ month, year });
      const total_income = transactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0);
      const total_expense = transactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0);

      return {
        total_income,
        total_expense,
        balance: total_income - total_expense,
        month,
        year,
      };
    }

    const res = await api.get<FinancialSummary>('/summary', { params: { month, year } });
    return res.data;
  },
};

export default api;
