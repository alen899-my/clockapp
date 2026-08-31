import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/common/GradientBackground';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { TimerCircularProgress } from '@/features/timer/components/TimerCircularProgress';
import { TimerPresets } from '@/features/timer/components/TimerPresets';
import { TimerDurationPicker } from '@/features/timer/components/TimerDurationPicker';
import { GradientButton } from '@/components/common/GradientButton';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { useTimer } from '@/features/timer/hooks/useTimer';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { Spacing } from '@/constants/theme';

export default function TimerScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const {
    totalSeconds,
    remainingSeconds,
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    addOneMinute,
  } = useTimer();

  const [mode, setMode] = useState<'presets' | 'custom'>('presets');

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
          title="Timer"
          subtitle="Focus & Interval Countdown"
          style={styles.scrollableHeader}
        />

        {/* Circular Progress & Time readout */}
        <View style={styles.dialWrapper}>
          <TimerCircularProgress
            totalSeconds={totalSeconds}
            remainingSeconds={remainingSeconds}
            state={timerState}
            size={255}
          />
        </View>

        {/* Action Controls when Running / Paused */}
        {timerState !== 'idle' ? (
          <View style={styles.runningControlsRow}>
            <View style={styles.btnCol}>
              <GradientButton
                title="Cancel"
                icon={<Ionicons name="refresh" size={18} color="#FFFFFF" />}
                onPress={resetTimer}
                variant="glass"
              />
            </View>

            <View style={styles.btnCol}>
              <GradientButton
                title="+1 Min"
                icon={<Ionicons name="add" size={18} color="#FFFFFF" />}
                onPress={addOneMinute}
                variant="glass"
              />
            </View>

            <View style={styles.btnCol}>
              {timerState === 'running' ? (
                <GradientButton
                  title="Pause"
                  icon={<Ionicons name="pause" size={18} color="#FFFFFF" />}
                  onPress={pauseTimer}
                  variant="danger"
                />
              ) : (
                <GradientButton
                  title="Resume"
                  icon={<Ionicons name="play" size={18} color="#FFFFFF" />}
                  onPress={resumeTimer}
                  variant="primary"
                />
              )}
            </View>
          </View>
        ) : (
          /* When Idle: Segmented Switcher for Quick Presets vs Custom Picker */
          <View style={styles.idleSection}>
            <View style={styles.segmentedWrapper}>
              <SegmentedControl
                options={[
                  { key: 'presets', label: 'Quick Presets' },
                  { key: 'custom', label: 'Custom Picker' },
                ]}
                selectedKey={mode}
                onSelect={(key) => setMode(key as 'presets' | 'custom')}
              />
            </View>

            {mode === 'presets' ? (
              <>
                <TimerPresets
                  selectedSeconds={totalSeconds}
                  onSelectPreset={(sec) => startTimer(sec)}
                />
                <View style={styles.startBtnWrap}>
                  <GradientButton
                    title="Start Timer"
                    icon={<Ionicons name="play" size={18} color="#FFFFFF" />}
                    onPress={() => startTimer(totalSeconds)}
                    size="lg"
                  />
                </View>
              </>
            ) : (
              <TimerDurationPicker onStartCustom={(sec) => startTimer(sec)} />
            )}
          </View>
        )}
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
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runningControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: 12,
    marginTop: Spacing.md,
  },
  btnCol: {
    flex: 1,
  },
  idleSection: {
    marginTop: Spacing.xs,
  },
  segmentedWrapper: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  startBtnWrap: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
});
