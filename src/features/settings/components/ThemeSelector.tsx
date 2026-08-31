import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { THEME_PALETTES, ThemeId } from '@/constants/theme';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';

export const ThemeSelector: React.FC = () => {
  const { themeId, setThemeId, theme } = useAppTheme();

  const themeList = Object.values(THEME_PALETTES);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
        LIQUID GLASS PALETTES
      </Text>
      <View style={styles.grid}>
        {themeList.map((item) => {
          const isSelected = item.id === themeId;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => setThemeId(item.id as ThemeId)}
              style={[
                styles.themeCard,
                {
                  borderColor: isSelected ? 'rgba(255, 255, 255, 0.85)' : theme.glassBorder,
                  borderWidth: isSelected ? 2 : 1,
                  backgroundColor: item.cardBg,
                },
              ]}
            >
              <LinearGradient
                colors={item.bgGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.previewBox}
              >
                {/* Visual Liquid Glass Swatches */}
                <View style={styles.swatchRow}>
                  <View style={[styles.swatchDot, { backgroundColor: '#FFFFFF' }]} />
                  <View style={[styles.swatchDot, { backgroundColor: 'rgba(255, 255, 255, 0.65)' }]} />
                  <View style={[styles.swatchDot, { backgroundColor: 'rgba(255, 255, 255, 0.30)' }]} />
                </View>

                {isSelected ? (
                  <View style={[styles.checkCircle, { backgroundColor: '#FFFFFF' }]}>
                    <Feather name="check" size={12} color="#0F172A" />
                  </View>
                ) : null}
              </LinearGradient>

              <Text
                style={[
                  styles.themeName,
                  {
                    color: isSelected ? '#FFFFFF' : theme.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {item.name}
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
    marginVertical: Spacing.md,
  },
  sectionTitle: {
    ...Typography.label,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeCard: {
    width: '48%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    overflow: 'hidden',
  },
  previewBox: {
    height: 60,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    justifyContent: 'space-between',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 6,
  },
  swatchDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  checkCircle: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeName: {
    ...Typography.caption,
    marginTop: 8,
    textAlign: 'center',
  },
});
