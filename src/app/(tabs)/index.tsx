import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TimeThemeBackground } from '@/components/common/TimeThemeBackground';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { IconButton } from '@/components/common/IconButton';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { GlassCard } from '@/components/common/GlassCard';
import { AnalogClock } from '@/features/world-clock/components/AnalogClock';
import { DigitalClock } from '@/features/world-clock/components/DigitalClock';
import { CityClockCard } from '@/features/world-clock/components/CityClockCard';
import { AddCityModal } from '@/features/world-clock/components/AddCityModal';
import { useWorldClocks } from '@/features/world-clock/hooks/useWorldClocks';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { getTimeOfDayTheme } from '@/features/theme/timeOfDayTheme';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const { currentTime, cities, addCity, removeCity } = useWorldClocks();

  const [clockViewMode, setClockViewMode] = useState<'digital' | 'analog'>('digital');
  const [modalVisible, setModalVisible] = useState(false);

  const timeTheme = getTimeOfDayTheme(currentTime);

  return (
    <TimeThemeBackground date={currentTime}>
      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: insets.top + Spacing.xs,
            paddingBottom: insets.bottom + 110,
          },
        ]}
        ListHeaderComponent={
          <>
            {/* Scrollable Screen Header */}
            <ScreenHeader
              title="MyTime"
              subtitle={timeTheme.name}
              style={styles.scrollableHeader}
              rightAction={
                <IconButton
                  icon={<Ionicons name="add" size={24} color={theme.textPrimary} />}
                  onPress={() => setModalVisible(true)}
                />
              }
            />

            <View style={styles.clockHeroContainer}>
              {/* Dynamic Time of Day Glass Badge */}
              <View
                style={[
                  styles.timeOfDayBadge,
                  {
                    backgroundColor: theme.glassBg,
                    borderColor: theme.glassBorder,
                  },
                ]}
              >
                <Ionicons name="sparkles" size={13} color={theme.primaryLight} style={styles.sparkleIcon} />
                <Text style={[styles.timeOfDayText, { color: theme.primaryLight }]}>
                  {timeTheme.name} • {timeTheme.subtitle}
                </Text>
              </View>

              {/* View Switcher: Digital vs Analog */}
              <View style={styles.segmentedWrapper}>
                <SegmentedControl
                  options={[
                    { key: 'digital', label: 'Digital', icon: <Ionicons name="time-outline" size={14} color={theme.textPrimary} /> },
                    { key: 'analog', label: 'Analog', icon: <Ionicons name="disc-outline" size={14} color={theme.textPrimary} /> },
                  ]}
                  selectedKey={clockViewMode}
                  onSelect={(key) => setClockViewMode(key as 'digital' | 'analog')}
                />
              </View>

              {/* Glowing Glass Hero Card around Clock */}
              <GlassCard style={styles.heroGlassCard} intensity={55}>
                <View style={styles.clockFaceWrapper}>
                  {clockViewMode === 'analog' ? (
                    <View style={styles.analogWrapper}>
                      <AnalogClock date={currentTime} size={220} />
                      <DigitalClock date={currentTime} />
                    </View>
                  ) : (
                    <DigitalClock date={currentTime} />
                  )}
                </View>
              </GlassCard>

              {/* Section Divider / Title */}
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
                  WORLD CLOCKS ({cities.length})
                </Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <CityClockCard
            city={item}
            currentTime={currentTime}
            onRemove={removeCity}
          />
        )}
      />

      <AddCityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCity={addCity}
        selectedCityIds={cities.map((c) => c.id)}
      />
    </TimeThemeBackground>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: Spacing.xl,
  },
  scrollableHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  clockHeroContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  timeOfDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  sparkleIcon: {
    marginRight: 6,
  },
  timeOfDayText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  segmentedWrapper: {
    width: 210,
    marginBottom: Spacing.md,
  },
  heroGlassCard: {
    width: '92%',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  clockFaceWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  analogWrapper: {
    alignItems: 'center',
  },
  sectionHeader: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.label,
  },
});
