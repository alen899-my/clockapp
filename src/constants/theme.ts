import { Platform } from 'react-native';

export type ThemeId = 'crystal-glass' | 'frost-obsidian' | 'diamond-ice' | 'pearl-glass';

export interface ThemeColors {
  id: ThemeId;
  name: string;
  isDark: boolean;
  
  // Backgrounds & Liquid Glass Gradients
  bgBase: string;
  bgGradient: [string, string, string];
  cardGradient: [string, string];
  glassBg: string;
  glassBorder: string;
  glassHighlight: string;
  
  // Primary brand / liquid white tones
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryGlow: string;
  accent: string;
  accentGradient: [string, string];
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textHighlight: string;
  
  // UI Elements
  cardBg: string;
  cardBorder: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  
  // Status Colors
  success: string;
  warning: string;
  danger: string;
  info: string;
  
  // Clock Face
  clockFaceBg: string;
  clockBorder: string;
  hourHand: string;
  minuteHand: string;
  secondHand: string;
  centerDot: string;
  tickMarker: string;
}

export const THEME_PALETTES: Record<ThemeId, ThemeColors> = {
  'crystal-glass': {
    id: 'crystal-glass',
    name: 'Crystal Liquid Glass',
    isDark: true,
    bgBase: '#05070B',
    bgGradient: ['#0A0E17', '#121824', '#05070B'],
    cardGradient: ['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.05)'],
    glassBg: 'rgba(255, 255, 255, 0.10)',
    glassBorder: 'rgba(255, 255, 255, 0.35)',
    glassHighlight: 'rgba(255, 255, 255, 0.70)',
    primary: '#FFFFFF',
    primaryLight: '#F8FAFC',
    primaryDark: '#CBD5E1',
    primaryGlow: 'rgba(255, 255, 255, 0.45)',
    accent: '#E2E8F0',
    accentGradient: ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.12)'],
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    textMuted: 'rgba(255, 255, 255, 0.55)',
    textHighlight: '#FFFFFF',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.28)',
    tabBarBg: 'rgba(15, 20, 30, 0.55)',
    tabBarBorder: 'rgba(255, 255, 255, 0.30)',
    tabBarActive: '#FFFFFF',
    tabBarInactive: 'rgba(255, 255, 255, 0.50)',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    info: '#60A5FA',
    clockFaceBg: 'rgba(255, 255, 255, 0.07)',
    clockBorder: 'rgba(255, 255, 255, 0.40)',
    hourHand: '#FFFFFF',
    minuteHand: 'rgba(255, 255, 255, 0.90)',
    secondHand: '#FFFFFF',
    centerDot: '#FFFFFF',
    tickMarker: 'rgba(255, 255, 255, 0.60)',
  },
  'frost-obsidian': {
    id: 'frost-obsidian',
    name: 'Frost Obsidian Glass',
    isDark: true,
    bgBase: '#030305',
    bgGradient: ['#08090C', '#101217', '#030305'],
    cardGradient: ['rgba(255, 255, 255, 0.14)', 'rgba(255, 255, 255, 0.03)'],
    glassBg: 'rgba(255, 255, 255, 0.07)',
    glassBorder: 'rgba(255, 255, 255, 0.25)',
    glassHighlight: 'rgba(255, 255, 255, 0.60)',
    primary: '#FFFFFF',
    primaryLight: '#E2E8F0',
    primaryDark: '#94A3B8',
    primaryGlow: 'rgba(255, 255, 255, 0.35)',
    accent: '#CBD5E1',
    accentGradient: ['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.08)'],
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.80)',
    textMuted: 'rgba(255, 255, 255, 0.50)',
    textHighlight: '#FFFFFF',
    cardBg: 'rgba(10, 12, 16, 0.45)',
    cardBorder: 'rgba(255, 255, 255, 0.22)',
    tabBarBg: 'rgba(8, 10, 14, 0.65)',
    tabBarBorder: 'rgba(255, 255, 255, 0.24)',
    tabBarActive: '#FFFFFF',
    tabBarInactive: 'rgba(255, 255, 255, 0.45)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#38BDF8',
    clockFaceBg: 'rgba(255, 255, 255, 0.05)',
    clockBorder: 'rgba(255, 255, 255, 0.32)',
    hourHand: '#FFFFFF',
    minuteHand: '#CBD5E1',
    secondHand: '#FFFFFF',
    centerDot: '#FFFFFF',
    tickMarker: 'rgba(255, 255, 255, 0.50)',
  },
  'diamond-ice': {
    id: 'diamond-ice',
    name: 'Diamond Ice Glass',
    isDark: true,
    bgBase: '#040810',
    bgGradient: ['#07101E', '#0E1F38', '#040810'],
    cardGradient: ['rgba(255, 255, 255, 0.22)', 'rgba(224, 242, 254, 0.06)'],
    glassBg: 'rgba(255, 255, 255, 0.12)',
    glassBorder: 'rgba(255, 255, 255, 0.40)',
    glassHighlight: 'rgba(255, 255, 255, 0.85)',
    primary: '#FFFFFF',
    primaryLight: '#E0F2FE',
    primaryDark: '#BAE6FD',
    primaryGlow: 'rgba(224, 242, 254, 0.50)',
    accent: '#BAE6FD',
    accentGradient: ['rgba(255, 255, 255, 0.40)', 'rgba(186, 230, 253, 0.15)'],
    textPrimary: '#FFFFFF',
    textSecondary: '#F0F9FF',
    textMuted: 'rgba(240, 249, 255, 0.60)',
    textHighlight: '#E0F2FE',
    cardBg: 'rgba(255, 255, 255, 0.09)',
    cardBorder: 'rgba(255, 255, 255, 0.35)',
    tabBarBg: 'rgba(10, 20, 36, 0.60)',
    tabBarBorder: 'rgba(255, 255, 255, 0.35)',
    tabBarActive: '#FFFFFF',
    tabBarInactive: 'rgba(224, 242, 254, 0.50)',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#FB7185',
    info: '#38BDF8',
    clockFaceBg: 'rgba(255, 255, 255, 0.08)',
    clockBorder: 'rgba(255, 255, 255, 0.45)',
    hourHand: '#FFFFFF',
    minuteHand: '#E0F2FE',
    secondHand: '#BAE6FD',
    centerDot: '#FFFFFF',
    tickMarker: 'rgba(255, 255, 255, 0.65)',
  },
  'pearl-glass': {
    id: 'pearl-glass',
    name: 'Pure Pearl Glass',
    isDark: false,
    bgBase: '#F1F5F9',
    bgGradient: ['#FFFFFF', '#F8FAFC', '#E2E8F0'],
    cardGradient: ['rgba(255, 255, 255, 0.85)', 'rgba(255, 255, 255, 0.50)'],
    glassBg: 'rgba(255, 255, 255, 0.65)',
    glassBorder: 'rgba(255, 255, 255, 0.80)',
    glassHighlight: 'rgba(255, 255, 255, 0.95)',
    primary: '#0F172A',
    primaryLight: '#334155',
    primaryDark: '#020617',
    primaryGlow: 'rgba(255, 255, 255, 0.70)',
    accent: '#475569',
    accentGradient: ['rgba(255, 255, 255, 0.90)', 'rgba(241, 245, 249, 0.75)'],
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    textHighlight: '#020617',
    cardBg: 'rgba(255, 255, 255, 0.70)',
    cardBorder: 'rgba(255, 255, 255, 0.75)',
    tabBarBg: 'rgba(255, 255, 255, 0.75)',
    tabBarBorder: 'rgba(255, 255, 255, 0.85)',
    tabBarActive: '#0F172A',
    tabBarInactive: '#94A3B8',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#0284C7',
    clockFaceBg: 'rgba(255, 255, 255, 0.75)',
    clockBorder: 'rgba(255, 255, 255, 0.90)',
    hourHand: '#0F172A',
    minuteHand: '#334155',
    secondHand: '#64748B',
    centerDot: '#0F172A',
    tickMarker: 'rgba(15, 23, 42, 0.50)',
  },
};

// Compatibility tokens for template components
export const Fonts = {
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'Courier',
  }),
};

export const MaxContentWidth = 800;
export const BottomTabInset = 80;

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#F8FAFC',
    tint: '#0F172A',
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#0F172A',
    backgroundElement: '#E2E8F0',
  },
  dark: {
    text: '#FFFFFF',
    background: '#05070B',
    tint: '#FFFFFF',
    icon: 'rgba(255, 255, 255, 0.7)',
    tabIconDefault: 'rgba(255, 255, 255, 0.5)',
    tabIconSelected: '#FFFFFF',
    backgroundElement: 'rgba(255, 255, 255, 0.1)',
  },
};

export type ThemeColor = keyof typeof Colors.light;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const Typography = {
  hero: {
    fontSize: 48,
    fontWeight: '800' as const,
    letterSpacing: -1,
  },
  clockTime: {
    fontSize: 56,
    fontWeight: '700' as const,
    letterSpacing: -1,
  },
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 12,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },
};

export const Shadows = {
  glow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 6,
  },
};
