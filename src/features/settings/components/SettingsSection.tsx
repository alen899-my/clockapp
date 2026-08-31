import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { GlassCard } from '@/components/common/GlassCard';
import { Spacing, Typography } from '@/constants/theme';

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      {title ? (
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{title}</Text>
      ) : null}
      <GlassCard style={styles.card}>{children}</GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.label,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  card: {
    padding: Spacing.sm,
  },
});
