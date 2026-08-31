import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/features/theme/useThemeSettings';

interface GradientBackgroundProps extends ViewProps {
  children: React.ReactNode;
  showAmbientGlow?: boolean;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  showAmbientGlow = true,
  style,
  ...props
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bgBase }, style]} {...props}>
      <LinearGradient
        colors={theme.bgGradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {showAmbientGlow && (
        <>
          <View
            style={[
              styles.ambientGlowTop,
              {
                backgroundColor: theme.primaryGlow,
              },
            ]}
          />
          <View
            style={[
              styles.ambientGlowBottom,
              {
                backgroundColor: theme.primaryGlow,
              },
            ]}
          />
        </>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  ambientGlowTop: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.28,
    transform: [{ scale: 1.2 }],
  },
  ambientGlowBottom: {
    position: 'absolute',
    bottom: 50,
    left: -100,
    width: 340,
    height: 340,
    borderRadius: 170,
    opacity: 0.2,
    transform: [{ scale: 1.1 }],
  },
});
