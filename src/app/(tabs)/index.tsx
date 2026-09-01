import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { AnalogClock } from '@/features/world-clock/components/AnalogClock';
import { RollingTimeCards } from '@/components/common/RollingTimeCards';
import { TodayTimelineSection } from '@/features/timeline/components/TodayTimelineSection';
import { useWorldClocks } from '@/features/world-clock/hooks/useWorldClocks';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { getTimeOfDayTheme } from '@/features/theme/timeOfDayTheme';
import { getFullFormattedDate } from '@/utils/time';
import { Spacing, Typography } from '@/constants/theme';
import { ScrollView } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = Math.max(Math.round(SCREEN_HEIGHT * 0.34), 280);

function getGreeting(date: Date): string {
  const h = date.getHours();
  if (h < 5) return 'Good Night';
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
}

function getGreetingEmoji(date: Date): string {
  const h = date.getHours();
  if (h < 5) return '🌙';
  if (h < 12) return '☀️';
  if (h < 17) return '🌤️';
  if (h < 21) return '🌆';
  return '🌙';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark, settings } = useAppTheme();
  const { currentTime } = useWorldClocks();

  const timeTheme = getTimeOfDayTheme(currentTime);
  const greeting = getGreeting(currentTime);
  const emoji = getGreetingEmoji(currentTime);

  const is24Hour = settings?.timeFormat === '24h';
  const h24 = currentTime.getHours();
  const m = currentTime.getMinutes();
  const s = currentTime.getSeconds();

  const hoursStr = is24Hour
    ? String(h24).padStart(2, '0')
    : String(h24 % 12 || 12).padStart(2, '0');
  const minutesStr = String(m).padStart(2, '0');
  const secondsStr = String(s).padStart(2, '0');

  const fullDate = getFullFormattedDate(currentTime);

  const bodyGradientColors = isDark
    ? (['#000000', '#000000', '#000000'] as [string, string, string])
    : (['#FFFFFF', '#FAFBFC', '#F4F6F8'] as [string, string, string]);

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      {/* ── Background under the Hero Image (Black on dark mode, Snow on light mode) ── */}
      <LinearGradient
        colors={bodyGradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
      >
        {/* ── HERO IMAGE & CLOCK SECTION ── */}
        <View style={[styles.heroWrapper, { minHeight: HERO_HEIGHT + insets.top }]}>
          <Image
            source={timeTheme.image}
            style={[styles.heroImage, { width: SCREEN_WIDTH, height: HERO_HEIGHT + insets.top + 30 }]}
            resizeMode="cover"
          />


          {/* Top bar */}
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <View style={styles.topBarBtn}>
              {Platform.OS !== 'web' && (
                <BlurView intensity={28} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 20 }]} />
              )}
              <Ionicons name="menu-outline" size={20} color="#fff" />
            </View>
          </View>

          {/* Hero Content: Greeting & Date on top, 3 Paper Calendar Time Cards in center */}
          <View style={[styles.heroContent, { paddingTop: insets.top + 52 }]}>
            {/* Greeting & Date Header Row */}
            <View style={styles.greetingHeaderRow}>
              <View style={styles.greetingCol}>
                <Text style={styles.greetingLine1}>{greeting} {emoji}</Text>
                <Text style={styles.greetingSubtitle}>Make every moment count.</Text>
              </View>

              <View style={styles.dateCol}>
                <Text style={styles.heroDateText}>{fullDate}</Text>
              </View>
            </View>

            {/* 3 Paper Calendar Rolling Time Cards (Hours, Minutes, Seconds) */}
            <View style={styles.rollingCardsWrapper}>
              <RollingTimeCards
                hours={hoursStr}
                minutes={minutesStr}
                seconds={secondsStr}
                isDark={isDark}
              />
            </View>
          </View>
        </View>

        {/* ── TODAY'S TIMELINE FEATURE ── */}
        <TodayTimelineSection currentTime={currentTime} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  listContent: { paddingBottom: Spacing.xl },

  /* ─── Hero ─── */
  heroWrapper: {
    width: SCREEN_WIDTH,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  topBarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  heroContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 14,
    justifyContent: 'space-between',
  },
  greetingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  greetingCol: {
    flex: 1,
  },
  dateCol: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 3,
    maxWidth: '45%',
  },
  greetingLine1: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  greetingSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.80)',
    marginTop: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.50)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroDateText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.90)',
    letterSpacing: -0.2,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  rollingCardsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },

  /* ─── Analog & Digital Clock Section ─── */
  clockHeroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },

  /* ─── Section Header ─── */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.label,
  },

  /* ─── Empty State ─── */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
});


