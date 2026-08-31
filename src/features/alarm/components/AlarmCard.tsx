import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/common/GlassCard';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { AlarmItem } from '../types';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { triggerHaptic } from '@/utils/haptics';

const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface AlarmCardProps {
  alarm: AlarmItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (alarm: AlarmItem) => void;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({
  alarm,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const { theme, settings } = useAppTheme();
  const is24Hour = settings.timeFormat === '24h';

  // Format hour & minute
  let displayHour = alarm.hour;
  let period = '';
  if (!is24Hour) {
    period = displayHour >= 12 ? 'PM' : 'AM';
    displayHour = displayHour % 12 || 12;
  }
  const timeStr = `${String(displayHour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}`;

  const handleToggle = () => {
    triggerHaptic('medium', settings.hapticsEnabled);
    onToggle(alarm.id);
  };

  const handleDelete = () => {
    triggerHaptic('warning', settings.hapticsEnabled);
    onDelete(alarm.id);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onEdit(alarm)}
      style={styles.touchable}
    >
      <GlassCard
        style={[
          styles.card,
          !alarm.enabled && { opacity: 0.55 },
        ]}
      >
        <View style={styles.cardHeader}>
          {/* Left: Time & Period */}
          <View style={styles.timeSection}>
            <View style={styles.timeRow}>
              <Text
                style={[
                  styles.timeText,
                  {
                    color: alarm.enabled ? theme.textPrimary : theme.textMuted,
                  },
                ]}
              >
                {timeStr}
              </Text>
              {!is24Hour ? (
                <Text
                  style={[
                    styles.periodText,
                    {
                      color: alarm.enabled ? theme.primaryLight : theme.textMuted,
                    },
                  ]}
                >
                  {period}
                </Text>
              ) : null}
            </View>

            <Text
              style={[
                styles.labelText,
                { color: alarm.enabled ? theme.textSecondary : theme.textMuted },
              ]}
              numberOfLines={1}
            >
              {alarm.label || 'Alarm'}
            </Text>
          </View>

          {/* Right: Switch */}
          <Switch
            value={alarm.enabled}
            onValueChange={handleToggle}
            trackColor={{ false: theme.cardBg, true: theme.primary }}
            thumbColor={alarm.enabled ? '#FFFFFF' : theme.textMuted}
          />
        </View>

        {/* Footer: Days Selector chips & Delete */}
        <View style={styles.footerRow}>
          <View style={styles.daysRow}>
            {DAYS_SHORT.map((dayLabel, index) => {
              const isSelected = alarm.days.includes(index);
              return (
                <View
                  key={`day-${index}`}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: isSelected && alarm.enabled
                        ? theme.primaryDark
                        : 'transparent',
                      borderColor: isSelected && alarm.enabled
                        ? theme.primaryLight
                        : theme.glassBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: isSelected && alarm.enabled
                          ? '#FFFFFF'
                          : theme.textMuted,
                      },
                    ]}
                  >
                    {dayLabel}
                  </Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="trash-2" size={15} color={theme.textMuted} />
          </TouchableOpacity>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  card: {
    padding: Spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  timeSection: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeText: {
    fontSize: 34,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  periodText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  labelText: {
    ...Typography.body,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayChip: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 10,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 4,
  },
});
