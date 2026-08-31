import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { TimerPreset } from '../types';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { triggerHaptic } from '@/utils/haptics';

export const PRESET_LIST: TimerPreset[] = [
  { id: '1m', label: '1 min', seconds: 60 },
  { id: '3m', label: '3 min', seconds: 180 },
  { id: '5m', label: '5 min', seconds: 300 },
  { id: '10m', label: '10 min', seconds: 600 },
  { id: '15m', label: '15 min', seconds: 900 },
  { id: '25m', label: '25 min (Pomodoro)', seconds: 1500 },
  { id: '45m', label: '45 min (Focus)', seconds: 2700 },
  { id: '60m', label: '1 hour', seconds: 3600 },
];

interface TimerPresetsProps {
  onSelectPreset: (seconds: number) => void;
  selectedSeconds: number;
}

export const TimerPresets: React.FC<TimerPresetsProps> = ({
  onSelectPreset,
  selectedSeconds,
}) => {
  const { theme, settings } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>QUICK PRESETS</Text>
      <View style={styles.chipsWrap}>
        {PRESET_LIST.map((preset) => {
          const isSelected = preset.seconds === selectedSeconds;
          return (
            <TouchableOpacity
              key={preset.id}
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic('selection', settings.hapticsEnabled);
                onSelectPreset(preset.seconds);
              }}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.primary : theme.cardBg,
                  borderColor: isSelected ? theme.primaryLight : theme.glassBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    ...Typography.label,
    marginBottom: Spacing.sm,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
