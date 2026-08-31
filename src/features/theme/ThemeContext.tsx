import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME_PALETTES, ThemeColors, ThemeId } from '@/constants/theme';
import { ClockSettings, ThemeContextValue } from './types';
import { triggerHaptic } from '@/utils/haptics';

const THEME_STORAGE_KEY = '@mytime_active_theme_v2';
const SETTINGS_STORAGE_KEY = '@mytime_clock_settings';

const DEFAULT_SETTINGS: ClockSettings = {
  timeFormat: '12h',
  showSeconds: true,
  clockFaceStyle: 'neon',
  hapticsEnabled: true,
  vibrateOnAlarm: true,
  soundVolume: 0.8,
};

const ThemeContext = createContext<ThemeContextValue>({
  themeId: 'crystal-glass',
  theme: THEME_PALETTES['crystal-glass'],
  isDark: true,
  settings: DEFAULT_SETTINGS,
  setThemeId: () => {},
  updateSettings: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>('crystal-glass');
  const [settings, setSettingsState] = useState<ClockSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme in THEME_PALETTES)) {
          setThemeIdState(savedTheme as ThemeId);
        }

        const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (savedSettings) {
          setSettingsState((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
        }
      } catch (err) {
        console.warn('Failed to load persisted theme/settings', err);
      }
    };

    loadPersistedData();
  }, []);

  const setThemeId = async (id: ThemeId) => {
    setThemeIdState(id);
    triggerHaptic('selection', settings.hapticsEnabled);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, id);
    } catch (err) {
      console.warn('Failed to save theme', err);
    }
  };

  const updateSettings = async (newSettings: Partial<ClockSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated)).catch(console.warn);
      return updated;
    });
    triggerHaptic('light', settings.hapticsEnabled);
  };

  const theme: ThemeColors = THEME_PALETTES[themeId] || THEME_PALETTES['crystal-glass'];
  const isDark = theme.isDark;

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme,
        isDark,
        settings,
        setThemeId,
        updateSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
