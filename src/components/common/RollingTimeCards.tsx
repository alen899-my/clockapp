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
const HALF_HEIGHT = CARD_HEIGHT / 2;

const SinglePaperFoldCard: React.FC<SingleCardProps> = ({ value, label, isDark = true }) => {
  const [topNumber, setTopNumber] = useState(value);
  const [bottomNumber, setBottomNumber] = useState(value);
  const [incomingNumber, setIncomingNumber] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  // 3D fold animation: 0 -> 1 (0deg to -180deg folding up)
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (value !== topNumber && !isFlipping) {
      setIncomingNumber(value);
      setIsFlipping(true);

      flipAnim.setValue(0);
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setTopNumber(value);
        setBottomNumber(value);
        setIsFlipping(false);
        flipAnim.setValue(0);
      });
    }
  }, [value, topNumber, isFlipping, flipAnim]);

  // Top half folding backwards / up (0deg to -90deg)
  const topFoldRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '-90deg', '-90deg'],
  });
  const topFoldOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  // Bottom half folding up into place (-90deg to 0deg)
  const bottomFoldRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['90deg', '90deg', '0deg'],
  });
  const bottomFoldOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [0, 0, 1, 1],
  });

  // Dynamic shadow as paper folds
  const foldShadowOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.45, 0],
  });

  return (
    <View style={styles.cardCol}>
      {/* ── Paper Card Container ── */}
      <View style={[styles.cardContainer, isDark ? styles.cardDark : styles.cardLight]}>
        {/* Layer 1: Frosted Glass Background (Dark Mode) */}
        {isDark && Platform.OS !== 'web' ? (
          <BlurView
            intensity={45}
            tint="dark"
            style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
          />
        ) : null}

        {/* ── 1. BACKGROUND UNDERNEATH: Top Half (New Number) & Bottom Half (Old Number) ── */}
        <View style={styles.staticBackdrop}>
          {/* Incoming Top Half */}
          <View style={styles.topHalfBox}>
            <LinearGradient
              colors={
                isDark
                  ? ['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 0.08)']
                  : ['#FFFFFF', '#FBF8F2']
              }
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.numberPositionerTop}>
              <Text style={[styles.digitText, isDark ? styles.digitDark : styles.digitLight]}>
                {isFlipping ? incomingNumber : topNumber}
              </Text>
            </View>
          </View>

          {/* Bottom Half */}
          <View style={styles.bottomHalfBox}>
            <LinearGradient
              colors={
                isDark
                  ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                  : ['#F6F2E9', '#ECE6D9']
              }
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.numberPositionerBottom}>
              <Text style={[styles.digitText, isDark ? styles.digitDark : styles.digitLight]}>
                {bottomNumber}
              </Text>
            </View>
          </View>
        </View>

        {/* ── 2. FLIPPING LEAF 1: Top Half Folding Upwards (Old Number) ── */}
        {isFlipping && (
          <Animated.View
            style={[
              styles.topHalfBox,
              styles.animatedFlapTop,
              {
                opacity: topFoldOpacity,
                transform: [
                  { perspective: 600 },
                  { translateY: HALF_HEIGHT / 2 },
                  { rotateX: topFoldRotate },
                  { translateY: -HALF_HEIGHT / 2 },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={
                isDark
                  ? ['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 0.08)']
                  : ['#FFFFFF', '#FBF8F2']
              }
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.numberPositionerTop}>
              <Text style={[styles.digitText, isDark ? styles.digitDark : styles.digitLight]}>
                {topNumber}
              </Text>
            </View>
            <Animated.View style={[styles.foldShadow, { opacity: foldShadowOpacity }]} />
          </Animated.View>
        )}

        {/* ── 3. FLIPPING LEAF 2: Bottom Half Folding Down into Place (New Number) ── */}
        {isFlipping && (
          <Animated.View
            style={[
              styles.bottomHalfBox,
              styles.animatedFlapBottom,
              {
                opacity: bottomFoldOpacity,
                transform: [
                  { perspective: 600 },
                  { translateY: -HALF_HEIGHT / 2 },
                  { rotateX: bottomFoldRotate },
                  { translateY: HALF_HEIGHT / 2 },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={
                isDark
                  ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                  : ['#F6F2E9', '#ECE6D9']
              }
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.numberPositionerBottom}>
              <Text style={[styles.digitText, isDark ? styles.digitDark : styles.digitLight]}>
                {incomingNumber}
              </Text>
            </View>
            <Animated.View style={[styles.foldShadow, { opacity: foldShadowOpacity }]} />
          </Animated.View>
        )}

        {/* ── 4. Top Tape / Adhesive Strip ── */}
        <View style={[styles.topTape, isDark ? styles.tapeDark : styles.tapeLight]} />
      </View>

      {/* ── Label (HOURS, MINS, SECS) ── */}
      <Text style={[styles.cardLabel, isDark ? styles.cardLabelDark : styles.cardLabelLight]}>
        {label}
      </Text>
    </View>
  );
};

interface RollingTimeCardsProps {
  hours: string;
  minutes: string;
  seconds: string;
  isDark?: boolean;
}

export const RollingTimeCards: React.FC<RollingTimeCardsProps> = ({
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

        {/* 2. Minutes Paper Card */}
        <SinglePaperFoldCard value={minutes} label="MINS" isDark={isDark} />

        {/* 3. Seconds Paper Card */}
        <SinglePaperFoldCard value={seconds} label="SECS" isDark={isDark} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
  },
  cardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  cardLight: {
    backgroundColor: '#FAF8F5',
    borderColor: 'rgba(0, 0, 0, 0.14)',
  },
  staticBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  topHalfBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HALF_HEIGHT,
    overflow: 'hidden',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  bottomHalfBox: {
    position: 'absolute',
    top: HALF_HEIGHT,
    left: 0,
    right: 0,
    height: HALF_HEIGHT,
    overflow: 'hidden',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  animatedFlapTop: {
    zIndex: 20,
    backfaceVisibility: 'hidden',
  },
  animatedFlapBottom: {
    zIndex: 20,
    backfaceVisibility: 'hidden',
  },
  numberPositionerTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberPositionerBottom: {
    position: 'absolute',
    top: -HALF_HEIGHT,
    left: 0,
    right: 0,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitText: {
    fontSize: 42,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  digitDark: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.70)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  digitLight: {
    color: '#0F172A',
  },
  foldShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  topTape: {
    position: 'absolute',
    top: 0,
    left: '28%',
    right: '28%',
    height: 6,
    borderRadius: 3,
    zIndex: 35,
  },
  tapeDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.40)',
  },
  tapeLight: {
    backgroundColor: 'rgba(251, 191, 36, 0.45)',
    borderWidth: 0.5,
    borderColor: 'rgba(245, 158, 11, 0.50)',
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
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardLabelLight: {
    color: '#64748B',
  },
});
