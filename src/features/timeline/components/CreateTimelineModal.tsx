import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import {
  TIMELINE_CATEGORIES,
  TimelineCategory,
  TimelineItem,
  TimelineRepeatType,
} from '../types';
import { formatDateToISO } from '../hooks/useTimeline';

interface CreateTimelineModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'>) => void;
  initialDate?: Date;
}

const DAYS_OF_WEEK = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

export const CreateTimelineModal: React.FC<CreateTimelineModalProps> = ({
  visible,
  onClose,
  onSave,
  initialDate = new Date(),
}) => {
  const { theme, isDark } = useAppTheme();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TimelineCategory>('focus');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [repeatType, setRepeatType] = useState<TimelineRepeatType>('today_only');
  const [specificDays, setSpecificDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default
  const [notes, setNotes] = useState('');

  const selectedCategoryMeta =
    TIMELINE_CATEGORIES.find((c) => c.key === category) || TIMELINE_CATEGORIES[0];

  const toggleDay = (day: number) => {
    if (specificDays.includes(day)) {
      if (specificDays.length > 1) {
        setSpecificDays(specificDays.filter((d) => d !== day));
      }
    } else {
      setSpecificDays([...specificDays, day].sort());
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const todayStr = formatDateToISO(initialDate);

    onSave({
      title: title.trim(),
      startTime,
      endTime,
      category,
      color: selectedCategoryMeta.color,
      emoji: selectedCategoryMeta.emoji,
      repeatType,
      specificDays: repeatType === 'specific_days' ? specificDays : undefined,
      startDate: todayStr,
      notes: notes.trim() ? notes.trim() : undefined,
    });

    // Reset & close
    setTitle('');
    setNotes('');
    setStartTime('09:00');
    setEndTime('10:30');
    setRepeatType('today_only');
    onClose();
  };

  // Helper for quick time increments
  const adjustHour = (current: string, delta: number): string => {
    const [h, m] = current.split(':').map(Number);
    let newH = ((h || 0) + delta + 24) % 24;
    return `${String(newH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
  };

  const adjustMinute = (current: string, delta: number): string => {
    const [h, m] = current.split(':').map(Number);
    let totalM = (h || 0) * 60 + (m || 0) + delta;
    if (totalM < 0) totalM += 24 * 60;
    totalM = totalM % (24 * 60);
    const newH = Math.floor(totalM / 60);
    const newM = totalM % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1}>
          <View style={styles.backdrop} />
        </TouchableOpacity>

        <View style={[styles.modalSheet, isDark ? styles.sheetDark : styles.sheetLight]}>
          {/* Blur Layer */}
          {isDark && Platform.OS !== 'web' ? (
            <BlurView intensity={45} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 24 }]} />
          ) : null}

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Add Timeline Plan</Text>
              <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
                Schedule a routine or focus block
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Title Input */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>PLAN TITLE</Text>
              <TextInput
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight, { color: theme.textPrimary }]}
                placeholder="e.g. Deep Work, Gym, Reading..."
                placeholderTextColor={theme.textMuted}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
            </View>

            {/* Category Selector */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>CATEGORY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                {TIMELINE_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.key;
                  return (
                    <TouchableOpacity
                      key={cat.key}
                      style={[
                        styles.catChip,
                        isSelected
                          ? { backgroundColor: cat.color, borderColor: cat.color }
                          : isDark
                          ? styles.catChipDark
                          : styles.catChipLight,
                      ]}
                      onPress={() => setCategory(cat.key)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.catEmoji}>{cat.emoji}</Text>
                      <Text
                        style={[
                          styles.catLabel,
                          { color: isSelected ? '#FFFFFF' : theme.textPrimary },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Time Pickers (Start & End) */}
            <View style={styles.timeSection}>
              {/* Start Time */}
              <View style={styles.timeCol}>
                <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>START TIME</Text>
                <View style={[styles.timeBox, isDark ? styles.timeBoxDark : styles.timeBoxLight]}>
                  <Text style={[styles.timeValText, { color: theme.textPrimary }]}>{startTime}</Text>
                  <View style={styles.adjustBtnsRow}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setStartTime(adjustHour(startTime, -1))}
                    >
                      <Text style={[styles.stepBtnText, { color: theme.textPrimary }]}>-1h</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setStartTime(adjustMinute(startTime, -15))}
                    >
                      <Text style={[styles.stepBtnText, { color: theme.textPrimary }]}>-15m</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setStartTime(adjustMinute(startTime, 15))}
                    >
                      <Text style={[styles.stepBtnText, { color: theme.textPrimary }]}>+15m</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setStartTime(adjustHour(startTime, 1))}
                    >
                      <Text style={[styles.stepBtnText, { color: theme.textPrimary }]}>+1h</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* End Time */}
              <View style={styles.timeCol}>
                <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>END TIME</Text>
                <View style={[styles.timeBox, isDark ? styles.timeBoxDark : styles.timeBoxLight]}>
                  <Text style={[styles.timeValText, { color: theme.textPrimary }]}>{endTime}</Text>
                  <View style={styles.adjustBtnsRow}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setEndTime(adjustHour(endTime, -1))}
                    >
                      <Text style={[styles.stepBtnText, { color: theme.textPrimary }]}>-1h</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setEndTime(adjustMinute(endTime, -15))}
                    >
                      <Text style={[styles.stepBtnText, { color: theme.textPrimary }]}>-15m</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setEndTime(adjustMinute(endTime, 15))}
                    >
                      <Text style={[styles.stepBtnText, { color: theme.textPrimary }]}>+15m</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setEndTime(adjustHour(endTime, 1))}
                    >
                      <Text style={[styles.stepBtnText, { color: theme.textPrimary }]}>+1h</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Repeat / Range Mode Selector */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>APPLY TO</Text>
              <View style={[styles.repeatTabs, isDark ? styles.repeatTabsDark : styles.repeatTabsLight]}>
                {[
                  { key: 'today_only', label: 'Today Only' },
                  { key: 'daily', label: 'Daily' },
                  { key: 'specific_days', label: 'Days of Week' },
                ].map((tab) => {
                  const isSelected = repeatType === tab.key;
                  return (
                    <TouchableOpacity
                      key={tab.key}
                      style={[styles.repeatTabBtn, isSelected && styles.repeatTabBtnActive]}
                      onPress={() => setRepeatType(tab.key as TimelineRepeatType)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.repeatTabText,
                          { color: isSelected ? '#FFFFFF' : theme.textMuted },
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Specific Days Picker */}
              {repeatType === 'specific_days' && (
                <View style={styles.daysRow}>
                  {DAYS_OF_WEEK.map((d) => {
                    const isSelected = specificDays.includes(d.value);
                    return (
                      <TouchableOpacity
                        key={d.value}
                        style={[
                          styles.dayPill,
                          isSelected
                            ? { backgroundColor: '#6366F1', borderColor: '#6366F1' }
                            : isDark
                            ? styles.dayPillDark
                            : styles.dayPillLight,
                        ]}
                        onPress={() => toggleDay(d.value)}
                      >
                        <Text
                          style={[
                            styles.dayPillText,
                            { color: isSelected ? '#FFFFFF' : theme.textMuted },
                          ]}
                        >
                          {d.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Notes Input */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>OPTIONAL NOTES</Text>
              <TextInput
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight, { color: theme.textPrimary }]}
                placeholder="Key focus items, links, reminders..."
                placeholderTextColor={theme.textMuted}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={[styles.cancelBtnText, { color: theme.textMuted }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, !title.trim() && { opacity: 0.5 }]}
              onPress={handleSave}
              disabled={!title.trim()}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.saveBtnText}>Save Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalSheet: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '88%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.2,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetDark: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  sheetLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.10)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    borderWidth: 1,
  },
  inputDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  inputLight: {
    backgroundColor: '#F8FAFC',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  catRow: {
    gap: 8,
    paddingVertical: 2,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  catChipDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  catChipLight: {
    backgroundColor: '#F1F5F9',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  catEmoji: {
    fontSize: 14,
  },
  catLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeSection: {
    flexDirection: 'row',
    gap: 12,
  },
  timeCol: {
    flex: 1,
    gap: 8,
  },
  timeBox: {
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeBoxDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  timeBoxLight: {
    backgroundColor: '#F8FAFC',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  timeValText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
    fontVariant: ['tabular-nums'],
  },
  adjustBtnsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  stepBtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 6,
  },
  stepBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  repeatTabs: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
  },
  repeatTabsDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  repeatTabsLight: {
    backgroundColor: '#F1F5F9',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  repeatTabBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  repeatTabBtnActive: {
    backgroundColor: '#6366F1',
  },
  repeatTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 4,
  },
  dayPill: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  dayPillDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  dayPillLight: {
    backgroundColor: '#F1F5F9',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  dayPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
