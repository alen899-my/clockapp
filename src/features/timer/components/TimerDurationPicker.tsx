import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { GradientButton } from '@/components/common/GradientButton';

interface TimerDurationPickerProps {
  onStartCustom: (totalSeconds: number) => void;
}

export const TimerDurationPicker: React.FC<TimerDurationPickerProps> = ({ onStartCustom }) => {
  const { theme } = useAppTheme();
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(5);
  const [seconds, setSeconds] = useState<number>(0);

  const totalSec = hours * 3600 + minutes * 60 + seconds;

  const handleStart = () => {
    if (totalSec > 0) {
      onStartCustom(totalSec);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.pickerBox,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.glassBorder,
          },
        ]}
      >
        <View style={styles.colsRow}>
          {/* Hours */}
          <View style={styles.col}>
            <TouchableOpacity
              onPress={() => setHours((h) => (h + 1) % 24)}
              style={styles.stepBtn}
            >
              <Text style={[styles.arrow, { color: theme.primaryLight }]}>▲</Text>
            </TouchableOpacity>
            <Text style={[styles.valText, { color: theme.textPrimary }]}>
              {String(hours).padStart(2, '0')}
            </Text>
            <TouchableOpacity
              onPress={() => setHours((h) => (h - 1 + 24) % 24)}
              style={styles.stepBtn}
            >
              <Text style={[styles.arrow, { color: theme.primaryLight }]}>▼</Text>
            </TouchableOpacity>
            <Text style={[styles.unitText, { color: theme.textMuted }]}>HOURS</Text>
          </View>

          <Text style={[styles.sep, { color: theme.primaryLight }]}>:</Text>

          {/* Minutes */}
          <View style={styles.col}>
            <TouchableOpacity
              onPress={() => setMinutes((m) => (m + 1) % 60)}
              style={styles.stepBtn}
            >
              <Text style={[styles.arrow, { color: theme.primaryLight }]}>▲</Text>
            </TouchableOpacity>
            <Text style={[styles.valText, { color: theme.textPrimary }]}>
              {String(minutes).padStart(2, '0')}
            </Text>
            <TouchableOpacity
              onPress={() => setMinutes((m) => (m - 1 + 60) % 60)}
              style={styles.stepBtn}
            >
              <Text style={[styles.arrow, { color: theme.primaryLight }]}>▼</Text>
            </TouchableOpacity>
            <Text style={[styles.unitText, { color: theme.textMuted }]}>MINS</Text>
          </View>

          <Text style={[styles.sep, { color: theme.primaryLight }]}>:</Text>

          {/* Seconds */}
          <View style={styles.col}>
            <TouchableOpacity
              onPress={() => setSeconds((s) => (s + 5) % 60)}
              style={styles.stepBtn}
            >
              <Text style={[styles.arrow, { color: theme.primaryLight }]}>▲</Text>
            </TouchableOpacity>
            <Text style={[styles.valText, { color: theme.textPrimary }]}>
              {String(seconds).padStart(2, '0')}
            </Text>
            <TouchableOpacity
              onPress={() => setSeconds((s) => (s - 5 + 60) % 60)}
              style={styles.stepBtn}
            >
              <Text style={[styles.arrow, { color: theme.primaryLight }]}>▼</Text>
            </TouchableOpacity>
            <Text style={[styles.unitText, { color: theme.textMuted }]}>SECS</Text>
          </View>
        </View>
      </View>

      <View style={styles.btnWrap}>
        <GradientButton
          title={`Start ${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s Timer`}
          onPress={handleStart}
          disabled={totalSec === 0}
          size="lg"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  pickerBox: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  colsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  col: {
    alignItems: 'center',
    width: 68,
  },
  stepBtn: {
    padding: 8,
  },
  arrow: {
    fontSize: 16,
    fontWeight: '700',
  },
  valText: {
    fontSize: 38,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  unitText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },
  sep: {
    fontSize: 32,
    fontWeight: '700',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  btnWrap: {
    marginTop: Spacing.lg,
  },
});
