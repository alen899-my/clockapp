import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { LapItem } from '../types';
import { formatStopwatchTime } from '@/utils/time';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { GlassCard } from '@/components/common/GlassCard';

interface LapListProps {
  laps: LapItem[];
  fastestLapId: string | null;
  slowestLapId: string | null;
}

export const LapList: React.FC<LapListProps> = ({ laps, fastestLapId, slowestLapId }) => {
  const { theme } = useAppTheme();

  if (laps.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          Recorded laps will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCol, { color: theme.textMuted }]}>LAP</Text>
        <Text style={[styles.headerCol, { color: theme.textMuted }]}>SPLIT</Text>
        <Text style={[styles.headerCol, { color: theme.textMuted, textAlign: 'right' }]}>
          OVERALL
        </Text>
      </View>

      <FlatList
        data={laps}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isFastest = item.id === fastestLapId;
          const isSlowest = item.id === slowestLapId;

          const lapTime = formatStopwatchTime(item.lapTimeMs);
          const overallTime = formatStopwatchTime(item.overallTimeMs);

          let lapColor = theme.textPrimary;
          if (isFastest) lapColor = theme.success;
          if (isSlowest) lapColor = theme.danger;

          return (
            <GlassCard style={styles.lapCard}>
              <View style={styles.lapRow}>
                {/* Lap Number & Badge */}
                <View style={styles.lapNumCol}>
                  <Text style={[styles.lapNumberText, { color: lapColor }]}>
                    #{String(item.lapNumber).padStart(2, '0')}
                  </Text>
                  {isFastest ? (
                    <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                      <Text style={[styles.badgeText, { color: theme.success }]}>BEST</Text>
                    </View>
                  ) : null}
                  {isSlowest ? (
                    <View style={[styles.badge, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                      <Text style={[styles.badgeText, { color: theme.danger }]}>SLOW</Text>
                    </View>
                  ) : null}
                </View>

                {/* Split Time */}
                <Text style={[styles.splitTimeText, { color: lapColor }]}>
                  {lapTime.main}
                  <Text style={{ fontSize: 11 }}>{lapTime.msPart}</Text>
                </Text>

                {/* Overall Time */}
                <Text style={[styles.overallTimeText, { color: theme.textMuted }]}>
                  {overallTime.main}
                  <Text style={{ fontSize: 11 }}>{overallTime.msPart}</Text>
                </Text>
              </View>
            </GlassCard>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: Spacing.xs,
  },
  headerCol: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    width: '33%',
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  lapCard: {
    marginVertical: 3,
    paddingVertical: 2,
  },
  lapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lapNumCol: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
  },
  lapNumberText: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginRight: 6,
  },
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  splitTimeText: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    width: '35%',
  },
  overallTimeText: {
    fontSize: 14,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
    width: '35%',
  },
  emptyContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    fontStyle: 'italic',
  },
});
