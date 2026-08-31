import React from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { Spacing, Typography } from '@/constants/theme';

interface ScreenHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  rightAction,
  style,
  ...props
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.headerContainer, style]} {...props}>
      <View style={styles.textColumn}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.primaryLight }]}>{subtitle}</Text>
        ) : null}
      </View>
      {rightAction ? <View style={styles.actionContainer}>{rightAction}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    ...Typography.h1,
  },
  subtitle: {
    ...Typography.caption,
    marginTop: 2,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  actionContainer: {
    marginLeft: Spacing.md,
  },
});
