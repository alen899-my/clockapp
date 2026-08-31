import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { AlarmItem } from '../types';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { GradientButton } from '@/components/common/GradientButton';
import { triggerHaptic } from '@/utils/haptics';

const DAYS_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SOUND_OPTIONS = ['Cosmic Violet', 'Neon Wave', 'Velvet Dream', 'Pulse Beat', 'Crystal Bell'];

interface AlarmModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (alarmData: Omit<AlarmItem, 'id' | 'createdAt'>) => void;
  initialAlarm?: AlarmItem | null;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  visible,
  onClose,
  onSave,
  initialAlarm,
}) => {
  const { theme, settings } = useAppTheme();

  const [hour, setHour] = useState<number>(7);
  const [minute, setMinute] = useState<number>(0);
  const [label, setLabel] = useState<string>('Morning Alarm');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [soundName, setSoundName] = useState<string>('Cosmic Violet');
  const [snoozeEnabled, setSnoozeEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (initialAlarm) {
      setHour(initialAlarm.hour);
      setMinute(initialAlarm.minute);
      setLabel(initialAlarm.label);
      setSelectedDays(initialAlarm.days);
      setSoundName(initialAlarm.soundName);
      setSnoozeEnabled(initialAlarm.snoozeEnabled);
    } else {
      setHour(7);
      setMinute(0);
      setLabel('Alarm');
      setSelectedDays([1, 2, 3, 4, 5]);
      setSoundName('Cosmic Violet');
      setSnoozeEnabled(true);
    }
  }, [initialAlarm, visible]);

  const toggleDay = (dayIndex: number) => {
    triggerHaptic('selection', settings.hapticsEnabled);
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleSave = () => {
    triggerHaptic('success', settings.hapticsEnabled);
    onSave({
      hour,
      minute,
      label: label.trim() || 'Alarm',
      days: selectedDays,
      enabled: true,
      snoozeEnabled,
      snoozeDurationMinutes: 5,
      soundName,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.bgBase }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {initialAlarm ? 'Edit Alarm' : 'New Alarm'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.glassBg }]}
            >
              <Feather name="x" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Time Adjuster Section */}
            <View style={[styles.timeBox, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
              <View style={styles.timePickerRow}>
                {/* Hour */}
                <View style={styles.pickerColumn}>
                  <TouchableOpacity
                    onPress={() => setHour((h) => (h + 1) % 24)}
                    style={styles.stepBtn}
                  >
                    <Text style={[styles.stepText, { color: theme.primaryLight }]}>▲</Text>
                  </TouchableOpacity>
                  <Text style={[styles.pickerValue, { color: theme.textPrimary }]}>
                    {String(hour).padStart(2, '0')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setHour((h) => (h - 1 + 24) % 24)}
                    style={styles.stepBtn}
                  >
                    <Text style={[styles.stepText, { color: theme.primaryLight }]}>▼</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.colonText, { color: theme.primaryLight }]}>:</Text>

                {/* Minute */}
                <View style={styles.pickerColumn}>
                  <TouchableOpacity
                    onPress={() => setMinute((m) => (m + 1) % 60)}
                    style={styles.stepBtn}
                  >
                    <Text style={[styles.stepText, { color: theme.primaryLight }]}>▲</Text>
                  </TouchableOpacity>
                  <Text style={[styles.pickerValue, { color: theme.textPrimary }]}>
                    {String(minute).padStart(2, '0')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setMinute((m) => (m - 1 + 60) % 60)}
                    style={styles.stepBtn}
                  >
                    <Text style={[styles.stepText, { color: theme.primaryLight }]}>▼</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Label Input */}
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>ALARM NAME</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.cardBg,
                  borderColor: theme.glassBorder,
                  color: theme.textPrimary,
                },
              ]}
              value={label}
              onChangeText={setLabel}
              placeholder="e.g. Work, Gym, Medicine"
              placeholderTextColor={theme.textMuted}
            />

            {/* Repeat Days */}
            <Text style={[styles.sectionLabel, { color: theme.textMuted, marginTop: Spacing.md }]}>
              REPEAT DAYS
            </Text>
            <View style={styles.daysRow}>
              {DAYS_FULL.map((d, index) => {
                const isSelected = selectedDays.includes(index);
                return (
                  <TouchableOpacity
                    key={d}
                    activeOpacity={0.7}
                    onPress={() => toggleDay(index)}
                    style={[
                      styles.dayBtn,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.cardBg,
                        borderColor: isSelected ? theme.primaryLight : theme.glassBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayBtnText,
                        { color: isSelected ? '#FFFFFF' : theme.textMuted },
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Sound Selector */}
            <Text style={[styles.sectionLabel, { color: theme.textMuted, marginTop: Spacing.md }]}>
              ALARM TONE
            </Text>
            <View style={styles.soundList}>
              {SOUND_OPTIONS.map((snd) => {
                const isCurrent = snd === soundName;
                return (
                  <TouchableOpacity
                    key={snd}
                    onPress={() => {
                      triggerHaptic('selection', settings.hapticsEnabled);
                      setSoundName(snd);
                    }}
                    style={[
                      styles.soundOption,
                      {
                        backgroundColor: isCurrent ? theme.glassBg : 'transparent',
                        borderColor: isCurrent ? theme.primaryLight : theme.glassBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.soundText,
                        { color: isCurrent ? theme.primaryLight : theme.textSecondary },
                      ]}
                    >
                      {snd}
                    </Text>
                    {isCurrent ? <Feather name="check" size={16} color={theme.primaryLight} /> : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Save Button */}
            <View style={styles.buttonWrapper}>
              <GradientButton
                title={initialAlarm ? 'Save Changes' : 'Set Alarm'}
                onPress={handleSave}
                size="lg"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: '86%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
  },
  closeBtn: {
    padding: 8,
    borderRadius: BorderRadius.full,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  timeBox: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerColumn: {
    alignItems: 'center',
    width: 70,
  },
  stepBtn: {
    padding: 6,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '700',
  },
  pickerValue: {
    fontSize: 44,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  colonText: {
    fontSize: 40,
    fontWeight: '700',
    marginHorizontal: 12,
  },
  sectionLabel: {
    ...Typography.label,
    marginBottom: 6,
  },
  input: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 16,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayBtn: {
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  dayBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  soundList: {
    gap: 6,
  },
  soundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  soundText: {
    fontSize: 15,
    fontWeight: '500',
  },
  buttonWrapper: {
    marginTop: Spacing.xl,
  },
});
