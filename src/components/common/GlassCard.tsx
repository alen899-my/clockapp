import React from 'react';
import { StyleSheet, View, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { BorderRadius, Spacing } from '@/constants/theme';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  borderRadius?: number;
  useGradient?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  intensity = 35,
  borderRadius = BorderRadius.lg,
  useGradient = true,
  style,
  ...props
}) => {
  const { theme, isDark } = useAppTheme();

  return (
    <View
      style={[
        styles.cardContainer,
        {
          borderRadius,
          borderColor: theme.glassBorder,
          backgroundColor: theme.cardBg,
        },
        style,
      ]}
      {...props}
    >
      {/* 1. Frosted Blur Layer */}
      {Platform.OS !== 'web' ? (
        <BlurView
          intensity={intensity}
          tint={isDark ? 'dark' : 'light'}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
      ) : null}

      {/* 2. Liquid Glass Translucent Gradient Fill */}
      {useGradient && (
        <LinearGradient
          colors={theme.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
      )}

      {/* 3. Specular Top Rim Liquid Glass Highlight */}
      <View
        style={[
          styles.specularRim,
          {
            backgroundColor: theme.glassHighlight,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
          },
        ]}
      />

      {/* 4. Card Content */}
      <View style={[styles.innerContent, { padding: Spacing.md }]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  specularRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    opacity: 0.65,
    zIndex: 2,
  },
  innerContent: {
    position: 'relative',
    zIndex: 3,
  },
});
