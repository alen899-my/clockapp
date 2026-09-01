import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { TimelineItem } from '../types';

interface TimelineItemCardProps {
  item: TimelineItem;
  currentTime: Date;
  todayIso: string;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  colorIndex?: number;
  isFirst?: boolean;
  isLast?: boolean;
  inChain?: boolean;
}

function formatDisplayTime(timeStr: string, is24Hour: boolean): string {
  if (is24Hour) return timeStr;
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${period}`;
}

function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export const TimelineItemCard: React.FC<TimelineItemCardProps> = ({
  item,
  currentTime,
  todayIso,
  onToggleComplete,
  onDelete,
  isFirst = false,
  isLast = false,
  inChain = true,
}) => {
  const { isDark, settings } = useAppTheme();
  const is24Hour = settings?.timeFormat === '24h';
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.75,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleComplete(item.id);
  };

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const startMinutes = timeStringToMinutes(item.startTime);
  const endMinutes = item.endTime ? timeStringToMinutes(item.endTime) : startMinutes + 60;
  const isNowActive =
    startMinutes <= endMinutes
      ? currentMinutes >= startMinutes && currentMinutes < endMinutes
      : currentMinutes >= startMinutes || currentMinutes < endMinutes;

  const startTimeFormatted = formatDisplayTime(item.startTime, is24Hour);

  return (
    <View style={[styles.row, !inChain && styles.rowStandalone]}>
      {/* ── Minimal Timeline Track & Node Dot ── */}
      {inChain && (
        <View style={styles.trackCol}>
          {/* Top connecting line */}
          <View
            style={[
              styles.trackLine,
              { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)' },
              isFirst && { opacity: 0 },
            ]}
          />

          {/* Minimal Node Checkbox */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.nodeCircle,
                isDark ? styles.nodeCircleDark : styles.nodeCircleLight,
                isNowActive && styles.nodeNowActive,
              ]}
              onPress={handleToggle}
              activeOpacity={0.65}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View
                style={[
                  styles.nodeDot,
                  {
                    backgroundColor: isNowActive
                      ? '#10B981'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.40)'
                      : '#94A3B8',
                  },
                ]}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom connecting line */}
          <View
            style={[
              styles.trackLine,
              { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)' },
              isLast && { opacity: 0 },
            ]}
          />
        </View>
      )}

      {/* ── Notion-Like Text Row with Light Border ── */}
      <View
        style={[
          styles.notionRowContainer,
          isDark ? styles.containerDark : styles.containerLight,
        ]}
      >
        <View style={styles.contentWrap}>
          {/* Top Line: Pure Text Time (No Badge) & Active Now Indicator */}
          <View style={styles.topMetaRow}>
            <Text
              style={[
                styles.timeText,
                isDark ? styles.timeTextDark : styles.timeTextLight,
                isNowActive && styles.timeTextActive,
              ]}
            >
              {startTimeFormatted}
            </Text>

            {isNowActive ? (
              <View style={styles.nowInline}>
                <View style={styles.nowDot} />
                <Text style={styles.nowText}>NOW</Text>
              </View>
            ) : null}
          </View>

          {/* Activity Title Text */}
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.activityTitle,
                isDark ? styles.textDark : styles.textLight,
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {/* Subtle Delete Action */}
            <TouchableOpacity
              onPress={() => onDelete(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.deleteBtn}
            >
              <Ionicons
                name="trash-outline"
                size={15}
                color={isDark ? 'rgba(255, 255, 255, 0.30)' : '#94A3B8'}
              />
            </TouchableOpacity>
          </View>

          {/* Minimal Repeat Notice */}
          {item.repeatType && item.repeatType !== 'today_only' ? (
            <View style={styles.repeatRow}>
              <Ionicons
                name="repeat"
                size={11}
                color={isDark ? 'rgba(255, 255, 255, 0.40)' : '#94A3B8'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.repeatLabel, isDark ? styles.subDark : styles.subLight]}>
                {item.repeatType === 'daily'
                  ? 'Daily'
                  : item.repeatType === 'specific_days'
                  ? 'Weekly'
                  : 'Scheduled'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  rowStandalone: {
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  trackCol: {
    width: 22,
    alignItems: 'center',
    marginRight: 10,
  },
  trackLine: {
    width: 1.5,
    flex: 1,
  },
  nodeCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    zIndex: 10,
  },
  nodeCircleDark: {
    backgroundColor: '#0F0F12',
    borderColor: 'rgba(255, 255, 255, 0.20)',
  },
  nodeCircleLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.16)',
  },
  nodeNowActive: {
    borderColor: '#10B981',
  },
  nodeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  notionRowContainer: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.2,
    paddingVertical: 11,
    paddingHorizontal: 15,
  },
  containerDark: {
    backgroundColor: '#111216',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomWidth: 2.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 5,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderBottomWidth: 2.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 4,
  },
  contentWrap: {
    gap: 3,
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  timeTextDark: {
    color: 'rgba(255, 255, 255, 0.55)',
  },
  timeTextLight: {
    color: '#64748B',
  },
  timeTextActive: {
    color: '#10B981',
    fontWeight: '700',
  },
  nowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nowDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  nowText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  textDark: {
    color: '#F1F5F9',
  },
  textLight: {
    color: '#0F172A',
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 8,
    opacity: 0.8,
  },
  repeatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  repeatLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  subDark: {
    color: 'rgba(255, 255, 255, 0.40)',
  },
  subLight: {
    color: '#94A3B8',
  },
});
