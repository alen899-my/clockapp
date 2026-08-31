import { ThemeColors, ThemeId } from '@/constants/theme';

export type TimeFormat = '12h' | '24h';
export type ClockFaceStyle = 'neon' | 'minimal' | 'glass' | 'analog';

export interface ClockSettings {
  timeFormat: TimeFormat;
  showSeconds: boolean;
  clockFaceStyle: ClockFaceStyle;
  hapticsEnabled: boolean;
  vibrateOnAlarm: boolean;
  soundVolume: number;
}

export interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemeColors;
  isDark: boolean;
  settings: ClockSettings;
  setThemeId: (id: ThemeId) => void;
  updateSettings: (newSettings: Partial<ClockSettings>) => void;
}
