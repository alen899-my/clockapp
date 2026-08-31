import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { triggerHaptic } from '@/utils/haptics';

interface SegmentOption {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedKey,
  onSelect,
}) => {
  const { theme, settings } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.glassBg,
          borderColor: theme.glassBorder,
        },
      ]}
    >
      {options.map((option) => {
        const isSelected = option.key === selectedKey;
        return (
          <TouchableOpacity
            key={option.key}
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic('selection', settings.hapticsEnabled);
              onSelect(option.key);
            }}
            style={styles.optionButton}
          >
            {isSelected ? (
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.12)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  StyleSheet.absoluteFill,
                  {
                    borderRadius: BorderRadius.full,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.50)',
                  },
                ]}
              />
            ) : null}
            <View style={styles.labelRow}>
              {option.icon ? <View style={styles.iconMargin}>{option.icon}</View> : null}
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? '#FFFFFF' : theme.textMuted,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconMargin: {
    marginRight: 6,
  },
  optionText: {
    ...Typography.caption,
  },
});
