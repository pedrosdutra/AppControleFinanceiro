// ===================== AUTH =====================
export type EntityId = string;

export interface User {
  id: EntityId;
  name: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
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
  user: User | null;
  token: string | null;
  requiresEmailConfirmation?: boolean;
}

// ===================== TRANSACTIONS =====================
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: EntityId;
  title: string;
  amount: number;
  type: TransactionType;
  category_id: EntityId;
  category?: Category;
  date: string;
  notes?: string;
  user_id?: EntityId;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionPayload {
  title: string;
  amount: number;
  type: TransactionType;
  category_id: EntityId;
  date: string;
  notes?: string;
}

export interface UpdateTransactionPayload extends Partial<CreateTransactionPayload> {}

// ===================== CATEGORIES =====================
export interface Category {
  id: EntityId;
  name: string;
  icon: string;
  color: string;
  type: TransactionType | 'both';
  user_id?: EntityId;
}

// ===================== SUMMARY =====================
export interface FinancialSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  month: number;
  year: number;
}
