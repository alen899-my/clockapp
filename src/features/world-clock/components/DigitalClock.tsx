import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { formatDigitalTime, getFullFormattedDate } from '@/utils/time';

interface DigitalClockProps {
  date: Date;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({ date }) => {
  const { theme, settings } = useAppTheme();
  const is24Hour = settings.timeFormat === '24h';
  const showSeconds = settings.showSeconds;

  const { time, period, seconds } = formatDigitalTime(date, is24Hour, showSeconds);
  const fullDate = getFullFormattedDate(date);

  return (
    <View style={styles.container}>
      {/* Time Display with AM/PM pill */}
      <View style={styles.timeRow}>
        <Text style={[styles.timeText, { color: theme.textPrimary }]}>{time}</Text>

        {!is24Hour && period ? (
          <View
            style={[
              styles.periodBadge,
              {
                backgroundColor: theme.glassBg,
                borderColor: theme.glassBorder,
              },
            ]}
          >
            <Text style={[styles.periodText, { color: theme.primaryLight }]}>{period}</Text>
          </View>
        ) : null}

        {showSeconds && !is24Hour ? (
          <View style={styles.secondsBadge}>
            <Text style={[styles.secondsText, { color: theme.accent }]}>{seconds}</Text>
          </View>
        ) : null}
      </View>

      {/* Date & Timezone string */}
      <Text style={[styles.dateText, { color: theme.textSecondary }]}>{fullDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  timeText: {
    ...Typography.clockTime,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(0, 0, 0, 0.40)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  periodBadge: {
    marginLeft: Spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondsBadge: {
    marginLeft: 6,
  },
  secondsText: {
    fontSize: 18,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  dateText: {
    ...Typography.body,
    marginTop: 6,
    letterSpacing: 0.2,
  },
});
