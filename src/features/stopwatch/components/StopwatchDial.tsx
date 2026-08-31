import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { formatStopwatchTime } from '@/utils/time';
import { Typography } from '@/constants/theme';

interface StopwatchDialProps {
  elapsedMs: number;
  size?: number;
}

export const StopwatchDial: React.FC<StopwatchDialProps> = ({ elapsedMs, size = 260 }) => {
  const { theme } = useAppTheme();
  const radius = size / 2;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth;
  const circumference = normalizedRadius * 2 * Math.PI;

  const seconds = (elapsedMs / 1000) % 60;
  const strokeDashoffset = circumference - (seconds / 60) * circumference;

  const { main, msPart } = formatStopwatchTime(elapsedMs);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <SvgGradient id="stopwatchLiquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.65" />
          </SvgGradient>
        </Defs>

        {/* Liquid Glass Track */}
        <Circle
          stroke="rgba(255, 255, 255, 0.15)"
          fill="rgba(255, 255, 255, 0.04)"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress Arc */}
        <Circle
          stroke="url(#stopwatchLiquidGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </Svg>

      {/* Center Readout */}
      <View style={styles.timeCenter}>
        <View style={styles.digitsRow}>
          <Text style={[styles.mainDigits, { color: '#FFFFFF' }]}>{main}</Text>
          <Text style={[styles.msDigits, { color: 'rgba(255, 255, 255, 0.85)' }]}>{msPart}</Text>
        </View>
        <Text style={[styles.subLabel, { color: 'rgba(255, 255, 255, 0.60)' }]}>MIN : SEC . MS</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  svg: {
    position: 'absolute',
  },
  timeCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  mainDigits: {
    fontSize: 44,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  msDigits: {
    fontSize: 26,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginLeft: 2,
  },
  subLabel: {
    ...Typography.caption,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
