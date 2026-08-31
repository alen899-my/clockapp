import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import { useAppTheme } from '@/features/theme/useThemeSettings';

interface AnalogClockProps {
  date: Date;
  size?: number;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ date, size = 220 }) => {
  const { theme } = useAppTheme();
  const radius = size / 2;
  const center = radius;

  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours() % 12;

  // Hand Angles (in degrees)
  const secondAngle = seconds * 6; // 360 / 60
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  // Hand lengths
  const hourLength = radius * 0.5;
  const minuteLength = radius * 0.72;
  const secondLength = radius * 0.82;

  // Hour markers (1 to 12)
  const hourTicks = Array.from({ length: 12 }).map((_, i) => {
    const angle = ((i + 1) * 30 * Math.PI) / 180;
    const isMajor = (i + 1) % 3 === 0;
    const outerR = radius - 14;
    const innerR = outerR - (isMajor ? 10 : 6);

    const x1 = center + outerR * Math.sin(angle);
    const y1 = center - outerR * Math.cos(angle);
    const x2 = center + innerR * Math.sin(angle);
    const y2 = center - innerR * Math.cos(angle);

    return (
      <Line
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isMajor ? '#FFFFFF' : theme.tickMarker}
        strokeWidth={isMajor ? 3 : 1.5}
        strokeLinecap="round"
      />
    );
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="liquidGlassGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <Stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.04" />
            <Stop offset="100%" stopColor="rgba(0, 0, 0, 0.25)" stopOpacity="0.5" />
          </RadialGradient>
        </Defs>

        {/* Outer Liquid Glass Dial */}
        <Circle
          cx={center}
          cy={center}
          r={radius - 4}
          fill="url(#liquidGlassGlow)"
          stroke={theme.clockBorder}
          strokeWidth={1.5}
        />

        {/* Inner Specular Ring */}
        <Circle
          cx={center}
          cy={center}
          r={radius - 18}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth={1}
          strokeDasharray="3 6"
        />

        {/* Hour Ticks */}
        {hourTicks}

        {/* Hour Hand */}
        <G rotation={hourAngle} origin={`${center}, ${center}`}>
          <Line
            x1={center}
            y1={center + 12}
            x2={center}
            y2={center - hourLength}
            stroke={theme.hourHand}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </G>

        {/* Minute Hand */}
        <G rotation={minuteAngle} origin={`${center}, ${center}`}>
          <Line
            x1={center}
            y1={center + 16}
            x2={center}
            y2={center - minuteLength}
            stroke={theme.minuteHand}
            strokeWidth={2.8}
            strokeLinecap="round"
          />
        </G>

        {/* Second Hand */}
        <G rotation={secondAngle} origin={`${center}, ${center}`}>
          <Line
            x1={center}
            y1={center + 20}
            x2={center}
            y2={center - secondLength}
            stroke={theme.secondHand}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Circle
            cx={center}
            cy={center - secondLength + 14}
            r={2.5}
            fill="#FFFFFF"
          />
        </G>

        {/* Center Jewel / Crystal Dot */}
        <Circle cx={center} cy={center} r={5} fill="#FFFFFF" />
        <Circle cx={center} cy={center} r={2} fill="rgba(0, 0, 0, 0.5)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 14,
    elevation: 6,
  },
});
