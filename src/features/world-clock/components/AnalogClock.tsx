import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { getTimeOfDayTheme } from '@/features/theme/timeOfDayTheme';
import { useAppTheme } from '@/features/theme/useThemeSettings';

interface AnalogClockProps {
  date?: Date;
  size?: number;
}

const getTimeAccentColor = (key: string): { primary: string; secondary: string; glow: string } => {
  switch (key) {
    case '6am-8am':
    case '8am-11am':
      return { primary: '#FBBF24', secondary: '#F59E0B', glow: 'rgba(251, 191, 36, 0.35)' };
    case '11am-1pm':
    case '1pm-3pm':
      return { primary: '#38BDF8', secondary: '#0284C7', glow: 'rgba(56, 189, 248, 0.35)' };
    case '3pm-5pm':
      return { primary: '#FB923C', secondary: '#EA580C', glow: 'rgba(251, 146, 60, 0.35)' };
    case '5pm-630pm':
      return { primary: '#F43F5E', secondary: '#E11D48', glow: 'rgba(244, 63, 94, 0.35)' };
    case '630pm-715pm':
      return { primary: '#818CF8', secondary: '#6366F1', glow: 'rgba(129, 140, 248, 0.35)' };
    case '730pm-9pm':
      return { primary: '#C084FC', secondary: '#A855F7', glow: 'rgba(192, 132, 252, 0.35)' };
    case '9pm-12am':
    case '12am-4am':
    case '4am-6am':
    default:
      return { primary: '#60A5FA', secondary: '#3B82F6', glow: 'rgba(96, 165, 250, 0.35)' };
  }
};

export const AnalogClock: React.FC<AnalogClockProps> = ({ date, size = 220 }) => {
  const { theme } = useAppTheme();
  const radius = size / 2;
  const center = radius;

  const [liveNow, setLiveNow] = useState(() => Date.now());

  useEffect(() => {
    let animId: number;
    const tick = () => {
      setLiveNow(Date.now());
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const current = new Date(liveNow);
  const activeDate = date || current;
  const timeTheme = getTimeOfDayTheme(activeDate);
  const timeAccent = getTimeAccentColor(timeTheme.key);

  const ms = current.getMilliseconds();
  const seconds = current.getSeconds() + ms / 1000;
  const minutes = current.getMinutes() + seconds / 60;
  const hours = (current.getHours() % 12) + minutes / 60;

  // Hand Angles (in degrees) — smooth continuous sweep
  const secondAngle = seconds * 6; // 360 / 60
  const minuteAngle = minutes * 6;
  const hourAngle = hours * 30;

  // Hand lengths
  const hourLength = radius * 0.46;
  const minuteLength = radius * 0.68;
  const secondLength = radius * 0.80;

  // Hour markers (1 to 12)
  const hourTicks = Array.from({ length: 12 }).map((_, i) => {
    const angle = ((i + 1) * 30 * Math.PI) / 180;
    const isMajor = (i + 1) % 3 === 0;
    const outerR = radius - 8;
    const innerR = outerR - (isMajor ? 6 : 4);

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
        stroke={isMajor ? timeAccent.primary : 'rgba(255, 255, 255, 0.35)'}
        strokeWidth={isMajor ? 2.5 : 1.2}
        strokeLinecap="round"
      />
    );
  });

  // Hour numbers (1 to 12) inside the dial
  const hourNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
    const angle = (num * 30 * Math.PI) / 180;
    const numR = radius - 24;
    const x = center + numR * Math.sin(angle);
    const y = center - numR * Math.cos(angle);
    const isCardinal = num % 3 === 0;

    return (
      <SvgText
        key={`num-${num}`}
        x={x}
        y={y + 4.5}
        fill={isCardinal ? timeAccent.primary : '#FFFFFF'}
        fontSize={isCardinal ? (size > 200 ? 14 : 12) : (size > 200 ? 11 : 10)}
        fontWeight={isCardinal ? '700' : '500'}
        textAnchor="middle"
        opacity={isCardinal ? 1 : 0.85}
      >
        {num}
      </SvgText>
    );
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          {/* Dynamic Time-of-Day Radial Glow */}
          <RadialGradient id="timeThemeDialGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={timeAccent.primary} stopOpacity="0.22" />
            <Stop offset="65%" stopColor={timeAccent.secondary} stopOpacity="0.08" />
            <Stop offset="100%" stopColor="rgba(0, 0, 0, 0.65)" stopOpacity="0.75" />
          </RadialGradient>

          {/* Liquid Glass Edge Highlight */}
          <LinearGradient id="dialRimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={timeAccent.primary} stopOpacity="0.8" />
            <Stop offset="50%" stopColor="rgba(255, 255, 255, 0.4)" stopOpacity="0.4" />
            <Stop offset="100%" stopColor={timeAccent.secondary} stopOpacity="0.6" />
          </LinearGradient>
        </Defs>

        {/* Outer Circular Dial Face */}
        <Circle
          cx={center}
          cy={center}
          r={radius - 4}
          fill="url(#timeThemeDialGlow)"
          stroke="url(#dialRimGradient)"
          strokeWidth={1.5}
        />

        {/* Inner Subtle Specular Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius - 36}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={1}
          strokeDasharray="2 4"
        />

        {/* Hour Ticks */}
        {hourTicks}

        {/* Inside Numbers (1 - 12) */}
        {hourNumbers}

        {/* Hour Hand */}
        <G rotation={hourAngle} origin={`${center}, ${center}`}>
          <Line
            x1={center}
            y1={center + 10}
            x2={center}
            y2={center - hourLength}
            stroke="#FFFFFF"
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        </G>

        {/* Minute Hand */}
        <G rotation={minuteAngle} origin={`${center}, ${center}`}>
          <Line
            x1={center}
            y1={center + 14}
            x2={center}
            y2={center - minuteLength}
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </G>

        {/* Second Hand (Smooth Time-Themed Needle) */}
        <G rotation={secondAngle} origin={`${center}, ${center}`}>
          <Line
            x1={center}
            y1={center + 18}
            x2={center}
            y2={center - secondLength}
            stroke={timeAccent.primary}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <Circle
            cx={center}
            cy={center - secondLength + 12}
            r={2.5}
            fill={timeAccent.primary}
          />
        </G>

        {/* Center Pivot Jewel */}
        <Circle cx={center} cy={center} r={4.5} fill={timeAccent.primary} />
        <Circle cx={center} cy={center} r={2} fill="#FFFFFF" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

