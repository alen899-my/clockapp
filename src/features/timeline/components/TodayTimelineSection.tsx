import React from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { useTimeline } from '../hooks/useTimeline';
import { EmptyTimelineCard } from './EmptyTimelineCard';
import { TimelineItemCard } from './TimelineItemCard';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TodayTimelineSectionProps {
  currentTime: Date;
}

export const TodayTimelineSection: React.FC<TodayTimelineSectionProps> = ({ currentTime }) => {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const {
    todayItems,
    todayIso,
    deleteItem,
    toggleCompleteToday,
  } = useTimeline(currentTime);

  // Active uncompleted items for today
  const activeItems = todayItems.filter(
    (item) => !item.completedDates?.includes(todayIso)
  );

  // Animated completion toggle: completed item vanishes from chain and next item slides up
  const handleToggleComplete = (id: string) => {
    LayoutAnimation.configureNext({
      duration: 350,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.78,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    toggleCompleteToday(id);
  };

  const handleDelete = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    deleteItem(id);
  };

  if (activeItems.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyTimelineCard />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Top Header Row: Today's Plan & Edit Link ── */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, isDark ? styles.titleDark : styles.titleLight]}>
            Today's Plan
          </Text>
          <View style={[styles.countBadge, isDark ? styles.badgeDark : styles.badgeLight]}>
            <Text style={[styles.countText, isDark ? styles.countDark : styles.countLight]}>
              {activeItems.length}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.editBtn, isDark ? styles.editBtnDark : styles.editBtnLight]}
          onPress={() => router.push('/create-plan')}
          activeOpacity={0.75}
        >
          <Ionicons
            name="pencil"
            size={12}
            color={isDark ? '#FFFFFF' : '#0F172A'}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.editText, isDark ? styles.textWhite : styles.textDark]}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Connected Timeline Chain ── */}
      <View style={styles.chainList}>
        {activeItems.map((item, index) => (
          <TimelineItemCard
            key={item.id}
            item={item}
            currentTime={currentTime}
            todayIso={todayIso}
            colorIndex={index}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            isFirst={index === 0}
            isLast={index === activeItems.length - 1}
            inChain={true}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  titleLight: {
    color: '#0F172A',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  badgeLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
  },
  countDark: {
    color: '#FFFFFF',
  },
  countLight: {
    color: '#0F172A',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  editBtnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.20)',
  },
  editBtnLight: {
    backgroundColor: '#FAF8F5',
    borderColor: 'rgba(0, 0, 0, 0.10)',
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#0F172A',
  },
  chainList: {
    paddingTop: 2,
  },
});
