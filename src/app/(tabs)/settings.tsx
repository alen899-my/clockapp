import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/common/GradientBackground';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ThemeSelector } from '@/features/settings/components/ThemeSelector';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { SettingRow } from '@/features/settings/components/SettingRow';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { Spacing } from '@/constants/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, settings, updateSettings } = useAppTheme();

  return (
    <GradientBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xs,
            paddingBottom: insets.bottom + 110,
          },
        ]}
      >
        {/* EAS Workflow Banner */}
        <View style={[styles.easBanner, { backgroundColor: theme.primary + '20', borderLeftColor: theme.primary }]}>
          <View style={styles.bannerContent}>
            <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
            <View style={styles.bannerText}>
              <Text style={[styles.bannerTitle, { color: theme.primary }]}>EAS Workflow Enabled</Text>
              <Text style={[styles.bannerSubtitle, { color: theme.textSecondary }]}>
                Continuous integration & deployment configured
              </Text>
            </View>
          </View>
        </View>

        {/* Scrollable Screen Header */}
        <ScreenHeader
          title="Settings"
          subtitle="Personalize MyTime"
          style={styles.scrollableHeader}
        />

        {/* Purple Palette Selector */}
        <View style={styles.sectionPad}>
          <ThemeSelector />
        </View>

        <View style={styles.sectionPad}>
          {/* Time & Clock Settings */}
          <SettingsSection title="TIME DISPLAY">
            <SettingRow
              icon={<Ionicons name="time-outline" size={20} color={theme.primaryLight} />}
              title="Time Format"
              subtitle="Switch between 12-Hour (AM/PM) and 24-Hour"
              action={
                <View style={styles.segmentWrap}>
                  <SegmentedControl
                    options={[
                      { key: '12h', label: '12H' },
                      { key: '24h', label: '24H' },
                    ]}
                    selectedKey={settings.timeFormat}
                    onSelect={(fmt) => updateSettings({ timeFormat: fmt as '12h' | '24h' })}
                  />
                </View>
              }
            />

            <SettingRow
              icon={<Ionicons name="sparkles-outline" size={20} color={theme.primaryLight} />}
              title="Show Seconds"
              subtitle="Display live seconds counter on clocks"
              action={
                <Switch
                  value={settings.showSeconds}
                  onValueChange={(val) => updateSettings({ showSeconds: val })}
                  trackColor={{ false: theme.cardBg, true: theme.primary }}
                  thumbColor={settings.showSeconds ? '#FFFFFF' : theme.textMuted}
                />
              }
              isLast={true}
            />
          </SettingsSection>

          {/* Feedback & Interaction */}
          <SettingsSection title="HAPTICS & ALERTS">
            <SettingRow
              icon={<Ionicons name="phone-portrait-outline" size={20} color={theme.primaryLight} />}
              title="Haptic Feedback"
              subtitle="Vibrations when pressing buttons and timers"
              action={
                <Switch
                  value={settings.hapticsEnabled}
                  onValueChange={(val) => updateSettings({ hapticsEnabled: val })}
                  trackColor={{ false: theme.cardBg, true: theme.primary }}
                  thumbColor={settings.hapticsEnabled ? '#FFFFFF' : theme.textMuted}
                />
              }
            />

            <SettingRow
              icon={<Ionicons name="volume-high-outline" size={20} color={theme.primaryLight} />}
              title="Vibrate on Alarm"
              subtitle="Vibrate device when alarms and timers trigger"
              action={
                <Switch
                  value={settings.vibrateOnAlarm}
                  onValueChange={(val) => updateSettings({ vibrateOnAlarm: val })}
                  trackColor={{ false: theme.cardBg, true: theme.primary }}
                  thumbColor={settings.vibrateOnAlarm ? '#FFFFFF' : theme.textMuted}
                />
              }
              isLast={true}
            />
          </SettingsSection>

          {/* About & Version */}
          <SettingsSection title="ABOUT">
            <SettingRow
              icon={<Ionicons name="information-circle-outline" size={20} color={theme.primaryLight} />}
              title="App Version"
              subtitle="MyTime Pro Edition v1.0.0"
              action={
                <View style={[styles.badge, { backgroundColor: theme.glassBg }]}>
                  <Text style={[styles.badgeText, { color: theme.primaryLight }]}>Latest</Text>
                </View>
              }
            />

            <SettingRow
              icon={<Ionicons name="color-palette-outline" size={20} color={theme.primaryLight} />}
              title="EAS Build Ready"
              subtitle="Configured with production EAS pipeline"
              action={<Ionicons name="checkmark-circle" size={20} color={theme.success} />}
              isLast={true}
            />
          </SettingsSection>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  scrollableHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xs,
  },
  sectionPad: {
    paddingHorizontal: Spacing.lg,
  },
  segmentWrap: {
    width: 120,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  easBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
  },
});
