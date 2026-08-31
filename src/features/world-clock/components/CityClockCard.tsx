import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/common/GlassCard';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { WorldClockCity } from '../types';
import { formatZonedCityTime } from '@/utils/time';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { triggerHaptic } from '@/utils/haptics';

interface CityClockCardProps {
  city: WorldClockCity;
  currentTime: Date;
  onRemove: (id: string) => void;
}

export const CityClockCard: React.FC<CityClockCardProps> = ({
  city,
  currentTime,
  onRemove,
}) => {
  const { theme, settings } = useAppTheme();
  const is24Hour = settings.timeFormat === '24h';

  const { time, period, dateStr, timeDiff, isDay } = formatZonedCityTime(
    currentTime,
    city.timezone,
    is24Hour
  );

  const handleDelete = () => {
    triggerHaptic('warning', settings.hapticsEnabled);
    onRemove(city.id);
  };

  return (
    <GlassCard style={styles.card}>
      <View style={styles.cardContent}>
        {/* Left: City Info & Time Difference */}
        <View style={styles.leftCol}>
          <View style={styles.cityHeaderRow}>
            <Text style={styles.flagText}>{city.flag}</Text>
            <Text style={[styles.cityName, { color: theme.textPrimary }]} numberOfLines={1}>
              {city.name}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View
              style={[
                styles.timeDiffBadge,
                {
                  backgroundColor: theme.glassBg,
                  borderColor: theme.glassBorder,
                },
              ]}
            >
              <Text style={[styles.timeDiffText, { color: theme.primaryLight }]}>
                {timeDiff}
              </Text>
            </View>
            <Text style={[styles.dateText, { color: theme.textMuted }]}>{dateStr}</Text>
          </View>
        </View>

        {/* Right: Time, Period, Day/Night Indicator & Delete */}
        <View style={styles.rightCol}>
          <View style={styles.timeWrapper}>
            <View style={styles.sunMoonIcon}>
              {isDay ? (
                <Ionicons name="sunny" size={16} color="#FBBF24" />
              ) : (
                <Ionicons name="moon" size={16} color={theme.accent} />
              )}
            </View>

            <Text style={[styles.timeText, { color: theme.textPrimary }]}>{time}</Text>

            {!is24Hour && period ? (
              <Text style={[styles.periodText, { color: theme.primaryLight }]}>{period}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleDelete}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="trash-2" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  cityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 20,
    marginRight: 8,
  },
  cityName: {
    ...Typography.h3,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  timeDiffBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginRight: 8,
  },
  timeDiffText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    ...Typography.caption,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  sunMoonIcon: {
    marginRight: 6,
    alignSelf: 'center',
  },
  timeText: {
    fontSize: 26,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  periodText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  deleteButton: {
    marginTop: 6,
    padding: 4,
  },
});
