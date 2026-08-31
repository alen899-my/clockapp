import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { formatTimerSeconds } from '@/utils/time';
import { TimerState } from '../types';
import { Typography } from '@/constants/theme';

interface TimerCircularProgressProps {
  totalSeconds: number;
  remainingSeconds: number;
  state: TimerState;
  size?: number;
}

export const TimerCircularProgress: React.FC<TimerCircularProgressProps> = ({
  totalSeconds,
  remainingSeconds,
  state,
  size = 270,
}) => {
  const { theme } = useAppTheme();
  const radius = size / 2;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const formattedTime = formatTimerSeconds(remainingSeconds);

  const getStatusText = () => {
    switch (state) {
      case 'running':
        return 'COUNTDOWN ACTIVE';
      case 'paused':
        return 'TIMER PAUSED';
      case 'finished':
        return 'TIME IS UP!';
      case 'idle':
      default:
        return 'READY';
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <SvgGradient id="timerLiquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.70" />
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
          stroke="url(#timerLiquidGradient)"
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

      {/* Center Display */}
      <View style={styles.centerContent}>
        <Text style={[styles.timeDigits, { color: '#FFFFFF' }]}>
          {formattedTime}
        </Text>
        <Text
          style={[
            styles.statusLabel,
            {
              color: state === 'finished' ? theme.danger : 'rgba(255, 255, 255, 0.80)',
            },
          ]}
        >
          {getStatusText()}
        </Text>
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
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDigits: {
    fontSize: 52,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  statusLabel: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 6,
  },
});
