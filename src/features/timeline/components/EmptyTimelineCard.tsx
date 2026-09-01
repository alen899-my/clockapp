import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/features/theme/useThemeSettings';

export const EmptyTimelineCard: React.FC = () => {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* ── Paper Card matching Top Rolling Time Cards ── */}
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        {/* Layer 1: Frosted Blur Layer (Dark Mode) */}
        {isDark && Platform.OS !== 'web' ? (
          <BlurView
            intensity={45}
            tint="dark"
            style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
          />
        ) : null}

        {/* Layer 2: Translucent Paper Gradient */}
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']
              : ['#FFFFFF', '#FDFBF7', '#F3EFE6']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 3: Top Tape / Adhesive Strip (Matching Top Rolling Cards) */}
        <View style={[styles.topTape, isDark ? styles.tapeDark : styles.tapeLight]} />

        {/* ── Left Side: Character Image ── */}
        <View style={styles.leftImageCol}>
          <Image
            source={require('@/assets/images/characters/char1.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>

        {/* ── Right Side: Text & Add Action ── */}
        <View style={styles.rightContentCol}>
          <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
            No plan for today
          </Text>
          <Text style={[styles.subtitle, isDark ? styles.subtitleDark : styles.subtitleLight]}>
            Stay organized. Add your routines & tasks.
          </Text>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.addBtn, isDark ? styles.addBtnDark : styles.addBtnLight]}
            onPress={() => router.push('/create-plan')}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={15} color={isDark ? '#FFFFFF' : '#FFFFFF'} style={{ marginRight: 4 }} />
            <Text style={[styles.addBtnText, isDark ? styles.addBtnTextDark : styles.addBtnTextLight]}>
              Add Plan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    overflow: 'hidden',
    borderWidth: 1.2,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  cardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  cardLight: {
    backgroundColor: '#FAF8F5',
    borderColor: 'rgba(0, 0, 0, 0.14)',
  },
  topTape: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 6,
    borderRadius: 3,
    zIndex: 20,
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
  leftImageCol: {
    width: 82,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  rightContentCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  titleDark: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  titleLight: {
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 10,
  },
  subtitleDark: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  subtitleLight: {
    color: '#64748B',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  addBtnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderColor: 'rgba(255, 255, 255, 0.40)',
  },
  addBtnLight: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  addBtnTextDark: {
    color: '#FFFFFF',
  },
  addBtnTextLight: {
    color: '#FFFFFF',
  },
});
