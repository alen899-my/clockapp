import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { BorderRadius, Spacing } from '@/constants/theme';
import { triggerHaptic } from '@/utils/haptics';

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'accent' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  ...props
}) => {
  const { theme, settings } = useAppTheme();

  const handlePress = () => {
    triggerHaptic('medium', settings.hapticsEnabled);
    onPress();
  };

  const getGradientColors = (): [string, string] => {
    switch (variant) {
      case 'danger':
        return ['#EF4444', '#DC2626'];
      case 'accent':
        return ['rgba(255, 255, 255, 0.40)', 'rgba(255, 255, 255, 0.15)'];
      case 'glass':
        return ['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.05)'];
      case 'primary':
      default:
        return ['rgba(255, 255, 255, 0.95)', 'rgba(241, 245, 249, 0.80)'];
    }
  };

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 14, fontSize: 13 },
    md: { paddingVertical: 14, paddingHorizontal: 22, fontSize: 15 },
    lg: { paddingVertical: 18, paddingHorizontal: 28, fontSize: 17 },
  }[size];

  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.touchable,
        {
          opacity: disabled ? 0.5 : 1,
          borderColor: isPrimary ? 'rgba(255, 255, 255, 0.8)' : theme.glassBorder,
          borderWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={isPrimary ? '#0F172A' : '#FFFFFF'} size="small" />
        ) : (
          <View style={styles.contentRow}>
            {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: sizeStyles.fontSize,
                  color: isPrimary ? '#0F172A' : '#FFFFFF',
                  fontWeight: isPrimary ? '700' : '600',
                },
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  gradient: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  buttonText: {
    letterSpacing: 0.3,
  },
});
