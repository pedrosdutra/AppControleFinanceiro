export const COLORS = {
  primary: '#8B80F9',
  primaryDark: '#6F63E8',
  primaryLight: '#BBB5FF',
  secondary: '#F48FB1',
  success: '#34D399',
  successLight: 'rgba(52, 211, 153, 0.16)',
  danger: '#FB7185',
  dangerLight: 'rgba(251, 113, 133, 0.16)',
  warning: '#FBBF24',
  warningLight: 'rgba(251, 191, 36, 0.16)',
  income: '#34D399',
  expense: '#FB7185',

  background: '#090B14',
  surface: '#121726',
  surfaceAlt: '#181D2E',
  card: '#101524',

  text: '#F5F7FF',
  textSecondary: '#A7B0C4',
  textLight: '#75809C',
  border: '#2A3147',
  borderLight: '#1E2436',

  dark: '#05070D',
  darkAlt: '#0D1220',
  darkCard: '#141B2D',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.34,
    shadowRadius: 24,
    elevation: 10,
  },
};

// Mock API base URL - replace with your actual backend URL
export const API_BASE_URL = 'https://financeiro-api.example.com/api';

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const CATEGORY_ICONS: Record<string, string> = {
  food: 'fast-food',
  transport: 'car',
  health: 'medkit',
  education: 'school',
  entertainment: 'game-controller',
  shopping: 'cart',
  home: 'home',
  salary: 'cash',
  freelance: 'laptop',
  investment: 'trending-up',
  other: 'ellipsis-horizontal',
};
