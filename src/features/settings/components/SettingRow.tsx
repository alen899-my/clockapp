import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { Spacing, Typography } from '@/constants/theme';

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action: React.ReactNode;
  isLast?: boolean;
}

export const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  subtitle,
  action,
  isLast = false,
}) => {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.row,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: 'rgba(255, 255, 255, 0.08)',
        },
      ]}
    >
      <View style={styles.left}>
        <View style={[styles.iconContainer, { backgroundColor: theme.glassBg }]}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.action}>{action}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: Spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
  },
  subtitle: {
    ...Typography.caption,
    marginTop: 2,
  },
  action: {
    alignItems: 'flex-end',
  },
});
