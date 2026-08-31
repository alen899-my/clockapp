import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { getTimeOfDayTheme } from '@/features/theme/timeOfDayTheme';
import { useAppTheme } from '@/features/theme/useThemeSettings';

interface TimeThemeBackgroundProps extends ViewProps {
  date: Date;
  children: React.ReactNode;
}

export const TimeThemeBackground: React.FC<TimeThemeBackgroundProps> = ({
  date,
  children,
  style,
  ...props
}) => {
  const { theme, isDark } = useAppTheme();
  const timeTheme = getTimeOfDayTheme(date);

  return (
    <View style={[styles.container, { backgroundColor: theme.bgBase }, style]} {...props}>
      {/* 1. Time-Based High Resolution Wallpaper */}
      <Image
        source={timeTheme.image}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* 2. Frosted Blur Layer (Visible artwork with smooth crystal glass effect) */}
      {Platform.OS !== 'web' ? (
        <BlurView
          intensity={timeTheme.blurIntensity}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      {/* 3. Liquid Glass Neutral Tint Overlay Gradient */}
      <LinearGradient
        colors={timeTheme.overlayGradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 4. White Liquid Glass Ambient Specular Sheen */}
      <View
        style={[
          styles.whiteGlassGlowTop,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
          },
        ]}
      />
      <View
        style={[
          styles.whiteGlassGlowCenter,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        ]}
      />

      {/* 5. Live App Content */}
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
  whiteGlassGlowTop: {
    position: 'absolute',
    top: -60,
    right: -30,
    width: 260,
    height: 260,
    borderRadius: 130,
    transform: [{ scale: 1.2 }],
  },
  whiteGlassGlowCenter: {
    position: 'absolute',
    top: '30%',
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    transform: [{ scale: 1.1 }],
  },
});
