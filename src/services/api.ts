import { type User as SupabaseAuthUser } from '@supabase/supabase-js';
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  Transaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  Category,
  FinancialSummary,
  TransactionType,
  User,
} from '../types';
import { getSupabaseClient } from './supabase';

type ProfileRow = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
};

type CategoryRow = {
  id: string;
  user_id: string | null;
  name: string;
  icon: string;
  color: string;
  type: Category['type'];
  is_default?: boolean;
  created_at?: string;
};

type TransactionRow = {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  amount: number | string;
  type: TransactionType;
  transaction_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  category: CategoryRow | null;
};

const TRANSACTION_SELECT = `
  id,
  user_id,
  category_id,
  title,
  amount,
  type,
  transaction_date,
  notes,
  created_at,
  updated_at,
  category:categories (
    id,
    user_id,
    name,
    icon,
    color,
    type
  )
`;

const getMonthBounds = (month: number, year: number) => {
  const start = new Date(Date.UTC(year, month - 1, 1)).toISOString().split('T')[0];
  const end = new Date(Date.UTC(year, month, 0)).toISOString().split('T')[0];
  return { start, end };
};

const buildError = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return new Error(error.message);
  }

  return new Error(fallback);
};

const mapSupabaseAuthMessage = (message?: string, fallback?: string) => {
  const normalizedMessage = message?.trim().toLowerCase();

  switch (normalizedMessage) {
    case 'email not confirmed':
      return 'Confirme seu e-mail antes de entrar.';
    case 'email rate limit exceeded':
      return 'O limite de envios de e-mail foi atingido no Supabase. Aguarde alguns minutos antes de tentar novamente.';
    case 'invalid login credentials':
      return 'E-mail ou senha inválidos.';
    case 'user already registered':
    case 'a user with this email address has already been registered':
      return 'Este e-mail já está cadastrado.';
    default:
      return message || fallback || 'Ocorreu um erro de autenticação.';
  }
};

const buildAuthError = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return new Error(mapSupabaseAuthMessage(error.message, fallback));
  }

  return new Error(fallback);
};

const toAppUser = (profile: ProfileRow): User => ({
  id: profile.id,
  name: profile.name,
  email: profile.email,
  avatar: profile.avatar_url ?? undefined,
  avatar_url: profile.avatar_url ?? undefined,
  created_at: profile.created_at,
});

const toAppCategory = (category: CategoryRow): Category => ({
  id: category.id,
  user_id: category.user_id ?? undefined,
  name: category.name,
  icon: category.icon,
  color: category.color,
  type: category.type,
});

const normalizeCategoryName = (name: string) => name
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase();

const compareCategoryRows = (firstCategory: CategoryRow, secondCategory: CategoryRow) => {
  const firstDefaultRank = firstCategory.is_default ? 0 : 1;
  const secondDefaultRank = secondCategory.is_default ? 0 : 1;

  if (firstDefaultRank !== secondDefaultRank) {
    return firstDefaultRank - secondDefaultRank;
  }

  const firstIsSalary = normalizeCategoryName(firstCategory.name) === 'salario';
  const secondIsSalary = normalizeCategoryName(secondCategory.name) === 'salario';

  if (firstIsSalary !== secondIsSalary) {
    return firstIsSalary ? -1 : 1;
  }

  return firstCategory.name.localeCompare(secondCategory.name, 'pt-BR');
};

const toAppTransaction = (transaction: TransactionRow): Transaction => ({
  id: transaction.id,
  user_id: transaction.user_id,
  category_id: transaction.category_id,
  title: transaction.title,
  amount: Number(transaction.amount),
  type: transaction.type,
  date: transaction.transaction_date,
  notes: transaction.notes ?? undefined,
  category: transaction.category ? toAppCategory(transaction.category) : undefined,
  created_at: transaction.created_at,
  updated_at: transaction.updated_at,
});

const ensureProfile = async (authUser: SupabaseAuthUser) => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: authUser.id,
        name: authUser.user_metadata?.name ?? authUser.email?.split('@')[0] ?? 'Usuario',
        email: authUser.email ?? '',
        avatar_url: authUser.user_metadata?.avatar_url ?? null,
      },
      { onConflict: 'id' }
    )
    .select('id, name, email, avatar_url, created_at')
    .single<ProfileRow>();

  if (error) {
    throw buildError(error, 'Nao foi possivel sincronizar o perfil do usuario.');
  }

  return data;
};

const getSession = async () => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw buildError(error, 'Nao foi possivel recuperar a sessao atual.');
  }

  return data.session;
};

const applyTransactionFilters = <T>(
  query: T,
  params?: {
    month?: number;
    year?: number;
    type?: string;
    category_id?: string;
  }
) => {
  let nextQuery: any = query;

  if (params?.month && params?.year) {
    const { start, end } = getMonthBounds(params.month, params.year);
    nextQuery = nextQuery.gte('transaction_date', start).lte('transaction_date', end);
  }

  if (params?.type) {
    nextQuery = nextQuery.eq('type', params.type);
  }

  if (params?.category_id) {
    nextQuery = nextQuery.eq('category_id', params.category_id);
  }

  return nextQuery;
};

// ===================== AUTH =====================
export const authApi = {
  getSessionToken: async (): Promise<string | null> => {
    const session = await getSession();
    return session?.access_token ?? null;
  },
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    });

    if (error || !data.session || !data.user) {
      throw buildAuthError(error, 'Nao foi possivel fazer login.');
    }

    const profile = await ensureProfile(data.user);

    return {
      user: toAppUser(profile),
      token: data.session.access_token,
    };
  },
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      options: {
        data: {
          name: payload.name.trim(),
        },
      },
    });

    if (error) {
      throw buildAuthError(error, 'Nao foi possivel criar a conta.');
    }

    if (!data.session || !data.user) {
      return {
        user: null,
        token: null,
        requiresEmailConfirmation: true,
      };
    }

    const profile = await ensureProfile(data.user);

    return {
      user: toAppUser(profile),
      token: data.session.access_token,
    };
  },
  logout: async (): Promise<void> => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw buildError(error, 'Nao foi possivel encerrar a sessao.');
    }
  },
  me: async (): Promise<User> => {
    const session = await getSession();

    if (!session?.user) {
      throw new Error('Sessao nao encontrada.');
    }

    const profile = await ensureProfile(session.user);
    return toAppUser(profile);
  },
};

// ===================== TRANSACTIONS =====================
export const transactionsApi = {
  getAll: async (params?: {
    month?: number;
    year?: number;
    type?: string;
    category_id?: string;
    page?: number;
  }): Promise<{ data: Transaction[]; total: number }> => {
    const supabase = getSupabaseClient();
    let query = supabase
      .from('transactions')
      .select(TRANSACTION_SELECT, { count: 'exact' })
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false });

    query = applyTransactionFilters(query, params);

    const { data, error, count } = await query.returns<TransactionRow[]>();

    if (error) {
      throw buildError(error, 'Nao foi possivel carregar as transacoes.');
    }

    return {
      data: (data ?? []).map(toAppTransaction),
      total: count ?? data?.length ?? 0,
    };
  },
  getById: async (id: string): Promise<Transaction> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('transactions')
      .select(TRANSACTION_SELECT)
      .eq('id', id)
      .single<TransactionRow>();

    if (error || !data) {
      throw buildError(error, 'Transacao nao encontrada.');
    }

    return toAppTransaction(data);
  },
  create: async (payload: CreateTransactionPayload): Promise<Transaction> => {
    const session = await getSession();

    if (!session?.user) {
      throw new Error('Sessao nao encontrada.');
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: session.user.id,
        category_id: payload.category_id,
        title: payload.title.trim(),
        amount: payload.amount,
        type: payload.type,
        transaction_date: payload.date,
        notes: payload.notes?.trim() || null,
      })
      .select(TRANSACTION_SELECT)
      .single<TransactionRow>();

    if (error || !data) {
      throw buildError(error, 'Nao foi possivel criar a transacao.');
    }

    return toAppTransaction(data);
  },
  update: async (id: string, payload: UpdateTransactionPayload): Promise<Transaction> => {
    const supabase = getSupabaseClient();
    const updates: Record<string, unknown> = {};

    if (payload.title !== undefined) {
      updates.title = payload.title.trim();
    }
    if (payload.amount !== undefined) {
      updates.amount = payload.amount;
    }
    if (payload.type !== undefined) {
      updates.type = payload.type;
    }
    if (payload.category_id !== undefined) {
      updates.category_id = payload.category_id;
    }
    if (payload.date !== undefined) {
      updates.transaction_date = payload.date;
    }
    if (payload.notes !== undefined) {
      updates.notes = payload.notes?.trim() || null;
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select(TRANSACTION_SELECT)
      .single<TransactionRow>();

    if (error || !data) {
      throw buildError(error, 'Nao foi possivel atualizar a transacao.');
    }

    return toAppTransaction(data);
  },
  delete: async (id: string): Promise<void> => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('transactions').delete().eq('id', id);

    if (error) {
      throw buildError(error, 'Nao foi possivel excluir a transacao.');
    }
  },
};

// ===================== CATEGORIES =====================
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, user_id, name, icon, color, type, is_default')
      .order('is_default', { ascending: false })
      .order('name', { ascending: true })
      .returns<CategoryRow[]>();

    if (error) {
      throw buildError(error, 'Nao foi possivel carregar as categorias.');
    }

    return (data ?? [])
      .sort(compareCategoryRows)
      .map(toAppCategory);
  },
};

// ===================== SUMMARY =====================
export const summaryApi = {
  get: async (month: number, year: number): Promise<FinancialSummary> => {
    const supabase = getSupabaseClient();
    const { start, end } = getMonthBounds(month, year);
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type')
      .gte('transaction_date', start)
      .lte('transaction_date', end)
      .returns<Array<{ amount: number | string; type: TransactionType }>>();

    if (error) {
      throw buildError(error, 'Nao foi possivel carregar o resumo financeiro.');
    }

    const totals = (data ?? []).reduce(
      (accumulator, transaction) => {
        const amount = Number(transaction.amount);

        if (transaction.type === 'income') {
          accumulator.total_income += amount;
        } else {
          accumulator.total_expense += amount;
        }

        return accumulator;
      },
      { total_income: 0, total_expense: 0 }
    );

    return {
      ...totals,
      balance: totals.total_income - totals.total_expense,
      month,
      year,
    };
  },
};
