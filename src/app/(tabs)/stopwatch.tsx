import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/common/GradientBackground';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { StopwatchDial } from '@/features/stopwatch/components/StopwatchDial';
import { LapList } from '@/features/stopwatch/components/LapList';
import { GradientButton } from '@/components/common/GradientButton';
import { useStopwatch } from '@/features/stopwatch/hooks/useStopwatch';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { Spacing } from '@/constants/theme';

export default function StopwatchScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const {
    elapsedMs,
    isRunning,
    start,
    pause,
    reset,
    recordLap,
    laps,
    fastestLapId,
    slowestLapId,
  } = useStopwatch();

  return (
    <GradientBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xs,
            paddingBottom: insets.bottom + 110,
          },
        ]}
      >
        {/* Scrollable Screen Header */}
        <ScreenHeader
          title="Stopwatch"
          subtitle="Precision Timer"
          style={styles.scrollableHeader}
        />

        {/* Stopwatch Dial */}
        <View style={styles.dialWrapper}>
          <StopwatchDial elapsedMs={elapsedMs} size={250} />
        </View>

        {/* Action Controls */}
        <View style={styles.controlsRow}>
          {isRunning ? (
            <>
              <View style={styles.btnCol}>
                <GradientButton
                  title="Lap"
                  icon={<Ionicons name="flag" size={18} color="#FFFFFF" />}
                  onPress={recordLap}
                  variant="glass"
                />
              </View>
              <View style={styles.btnCol}>
                <GradientButton
                  title="Pause"
                  icon={<Ionicons name="pause" size={18} color="#FFFFFF" />}
                  onPress={pause}
                  variant="danger"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.btnCol}>
                <GradientButton
                  title="Reset"
                  icon={<Ionicons name="refresh" size={18} color="#FFFFFF" />}
                  onPress={reset}
                  variant="glass"
                  disabled={elapsedMs === 0}
                />
              </View>
              <View style={styles.btnCol}>
                <GradientButton
                  title={elapsedMs > 0 ? 'Resume' : 'Start'}
                  icon={<Ionicons name="play" size={18} color="#FFFFFF" />}
                  onPress={start}
                  variant="primary"
                />
              </View>
            </>
          )}
        </View>

        {/* Laps List */}
        <View style={styles.lapsContainer}>
          <LapList
            laps={laps}
            fastestLapId={fastestLapId}
            slowestLapId={slowestLapId}
          />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  scrollableHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xs,
  },
  dialWrapper: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: 16,
    marginVertical: Spacing.md,
  },
  btnCol: {
    flex: 1,
  },
  lapsContainer: {
    minHeight: 200,
  },
});
