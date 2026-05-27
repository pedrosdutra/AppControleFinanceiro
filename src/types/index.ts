// ===================== AUTH =====================
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  created_at?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ===================== TRANSACTIONS =====================
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  category_id: number;
  category?: Category;
  date: string;
  notes?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionPayload {
  title: string;
  amount: number;
  type: TransactionType;
  category_id: number;
  date: string;
  notes?: string;
}

export interface UpdateTransactionPayload extends Partial<CreateTransactionPayload> {}

// ===================== CATEGORIES =====================
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: TransactionType | 'both';
  user_id?: number;
}

// ===================== SUMMARY =====================
export interface FinancialSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  month: number;
  year: number;
}
