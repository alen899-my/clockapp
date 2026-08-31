import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { triggerHaptic } from '@/utils/haptics';

interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  variant?: 'glass' | 'primary' | 'solid';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 44,
  variant = 'glass',
  style,
  ...props
}) => {
  const { theme, settings } = useAppTheme();

  const handlePress = () => {
    triggerHaptic('light', settings.hapticsEnabled);
    onPress();
  };

  const getBgColor = () => {
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'solid':
        return theme.cardBg;
      case 'glass':
      default:
        return theme.glassBg;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getBgColor(),
          borderColor: theme.glassBorder,
        },
        style,
      ]}
      {...props}
    >
      <View style={styles.iconWrapper}>{icon}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
