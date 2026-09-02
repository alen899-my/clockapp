import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface SingleCardProps {
  value: string;
  label: string;
  isDark?: boolean;
}

const CARD_HEIGHT = 86;

const SinglePaperFoldCardComponent: React.FC<SingleCardProps> = ({ value, label, isDark = true }) => {
  const [displayedValue, setDisplayedValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  const anim = useRef(new Animated.Value(0)).current;
  const currentValRef = useRef(value);
  const prevValRef = useRef(value);

  useEffect(() => {
    if (value !== currentValRef.current) {
      prevValRef.current = currentValRef.current;
      currentValRef.current = value;
      setPrevValue(prevValRef.current);
      setDisplayedValue(value);
      setIsAnimating(true);

      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 340,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: Platform.OS !== 'web',
      }).start(({ finished }) => {
        if (finished) {
          setIsAnimating(false);
        }
      });
    }
  }, [value, anim]);

  // Outgoing digit animations (slides up & fades smoothly)
  const outgoingTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -CARD_HEIGHT * 0.45],
  });
  const outgoingOpacity = anim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 0.2, 0],
  });
  const outgoingScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.90],
  });

  // Incoming digit animations (slides up into center smoothly)
  const incomingTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [CARD_HEIGHT * 0.45, 0],
  });
  const incomingOpacity = anim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.8, 1],
  });
  const incomingScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.90, 1],
  });

  const isIos = Platform.OS === 'ios';

  return (
    <View style={styles.cardCol}>
      {/* ── Paper Card Container ── */}
      <View style={[styles.cardContainer, isDark ? styles.cardDark : styles.cardLight]}>
        {/* Layer 1: Frosted Glass Background for iOS */}
        {isIos && isDark ? (
          <BlurView
            intensity={40}
            tint="dark"
            style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
          />
        ) : null}

        {/* Layer 2: Consolidated High-Performance Gradient */}
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.05)', 'rgba(0, 0, 0, 0.22)']
              : ['#FFFFFF', '#FAF7F2', '#EFE9DF']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* ── Digits Container ── */}
        <View style={styles.digitFrame}>
          {isAnimating ? (
            <>
              {/* Outgoing Digit */}
              <Animated.View
                style={[
                  styles.digitWrapper,
                  {
                    opacity: outgoingOpacity,
                    transform: [
                      { translateY: outgoingTranslateY },
                      { scale: outgoingScale },
                    ],
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.digitText, isDark ? styles.digitDark : styles.digitLight]}
                >
                  {prevValue}
                </Text>
              </Animated.View>

              {/* Incoming Digit */}
              <Animated.View
                style={[
                  styles.digitWrapper,
                  {
                    opacity: incomingOpacity,
                    transform: [
                      { translateY: incomingTranslateY },
                      { scale: incomingScale },
                    ],
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.digitText, isDark ? styles.digitDark : styles.digitLight]}
                >
                  {displayedValue}
                </Text>
              </Animated.View>
            </>
          ) : (
            <View style={styles.digitWrapper}>
              <Text
                numberOfLines={1}
                style={[styles.digitText, isDark ? styles.digitDark : styles.digitLight]}
              >
                {displayedValue}
              </Text>
            </View>
          )}
        </View>

        {/* ── Center Fold Seam & Side Hinges (Split-Flap Look) ── */}
        <View style={styles.creaseContainer} pointerEvents="none">
          <View style={[styles.creaseLineDark, !isDark && styles.creaseLineLight]} />
          <View style={[styles.creaseLineHighlight, !isDark && styles.creaseLineHighlightLight]} />
        </View>

        {/* Side Split-Flap Notches */}
        <View style={[styles.sideNotchLeft, isDark ? styles.notchDark : styles.notchLight]} pointerEvents="none" />
        <View style={[styles.sideNotchRight, isDark ? styles.notchDark : styles.notchLight]} pointerEvents="none" />

        {/* ── Top Tape / Adhesive Strip ── */}
        <View style={[styles.topTape, isDark ? styles.tapeDark : styles.tapeLight]} pointerEvents="none" />
      </View>

      {/* ── Label (HOURS, MINS, SECS) ── */}
      <Text style={[styles.cardLabel, isDark ? styles.cardLabelDark : styles.cardLabelLight]}>
        {label}
      </Text>
    </View>
  );
};

// Memoize Single Card to prevent HOURS & MINS re-rendering every second
const SinglePaperFoldCard = React.memo(
  SinglePaperFoldCardComponent,
  (prev, next) =>
    prev.value === next.value &&
    prev.label === next.label &&
    prev.isDark === next.isDark
);

interface RollingTimeCardsProps {
  hours: string;
  minutes: string;
  seconds: string;
  isDark?: boolean;
}

export const RollingTimeCards: React.FC<RollingTimeCardsProps> = React.memo(({
  hours,
  minutes,
  seconds,
  isDark = true,
}) => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.cardsRow}>
        {/* 1. Hours Paper Card */}
        <SinglePaperFoldCard value={hours} label="HOURS" isDark={isDark} />

        {/* Separator Dots */}
        <View style={styles.dotsCol}>
          <View style={[styles.colonDot, isDark ? styles.dotDark : styles.dotLight]} />
          <View style={[styles.colonDot, isDark ? styles.dotDark : styles.dotLight]} />
        </View>

        {/* 2. Minutes Paper Card */}
        <SinglePaperFoldCard value={minutes} label="MINS" isDark={isDark} />

        {/* Separator Dots */}
        <View style={styles.dotsCol}>
          <View style={[styles.colonDot, isDark ? styles.dotDark : styles.dotLight]} />
          <View style={[styles.colonDot, isDark ? styles.dotDark : styles.dotLight]} />
        </View>

        {/* 3. Seconds Paper Card */}
        <SinglePaperFoldCard value={seconds} label="SECS" isDark={isDark} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardCol: {
    flex: 1,
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  cardDark: {
    backgroundColor: 'rgba(28, 28, 30, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  cardLight: {
    backgroundColor: '#FAF8F5',
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  digitFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  digitWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitText: {
    fontSize: 38,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
    textAlign: 'center',
    includeFontPadding: false,
  },
  digitDark: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  digitLight: {
    color: '#0F172A',
  },
  creaseContainer: {
    position: 'absolute',
    top: CARD_HEIGHT / 2 - 1,
    left: 0,
    right: 0,
    height: 2,
    zIndex: 30,
  },
  creaseLineDark: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  creaseLineHighlight: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  creaseLineLight: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  creaseLineHighlightLight: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  sideNotchLeft: {
    position: 'absolute',
    top: CARD_HEIGHT / 2 - 4,
    left: -1,
    width: 4,
    height: 8,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 32,
  },
  sideNotchRight: {
    position: 'absolute',
    top: CARD_HEIGHT / 2 - 4,
    right: -1,
    width: 4,
    height: 8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    zIndex: 32,
  },
  notchDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  notchLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  topTape: {
    position: 'absolute',
    top: 0,
    left: '26%',
    right: '26%',
    height: 6,
    borderRadius: 3,
    zIndex: 35,
  },
  tapeDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  tapeLight: {
    backgroundColor: 'rgba(251, 191, 36, 0.5)',
    borderWidth: 0.5,
    borderColor: 'rgba(245, 158, 11, 0.55)',
  },
  dotsCol: {
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 0,
    marginBottom: 16,
  },
  colonDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dotDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  dotLight: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 7,
    textTransform: 'uppercase',
  },
  cardLabelDark: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  cardLabelLight: {
    color: '#64748B',
  },
});
