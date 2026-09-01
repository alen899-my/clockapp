import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { formatDateToISO, useTimeline } from '@/features/timeline/hooks/useTimeline';
import { PaperTimePickerModal } from '@/features/timeline/components/PaperTimePickerModal';
import { TimelineRepeatType } from '@/features/timeline/types';

interface TimeBlockRow {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
}

const DAYS = [
  { label: 'M', full: 'Mon', value: 1 },
  { label: 'T', full: 'Tue', value: 2 },
  { label: 'W', full: 'Wed', value: 3 },
  { label: 'T', full: 'Thu', value: 4 },
  { label: 'F', full: 'Fri', value: 5 },
  { label: 'S', full: 'Sat', value: 6 },
  { label: 'S', full: 'Sun', value: 0 },
];

function formatTime12(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr || '0', 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export default function CreatePlanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const { todayItems, replaceTodayItems, isLoading } = useTimeline();

  const [repeatMode, setRepeatMode] = useState<'today' | 'everyday' | 'custom'>('today');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const [timeBlocks, setTimeBlocks] = useState<TimeBlockRow[]>([
    {
      id: 'block_1',
      startTime: '09:00',
      endTime: '10:00',
      title: '',
    },
  ]);

  const [hasLoadedExisting, setHasLoadedExisting] = useState(false);

  // Preload existing items if editing
  useEffect(() => {
    if (!isLoading && !hasLoadedExisting) {
      if (todayItems.length > 0) {
        setTimeBlocks(
          todayItems.map((item, idx) => ({
            id: item.id || `block_${idx}`,
            startTime: item.startTime,
            endTime: item.endTime || item.startTime,
            title: item.title,
          }))
        );

        // Preload repeat mode if present
        const firstItem = todayItems[0];
        if (firstItem?.repeatType === 'daily') {
          setRepeatMode('everyday');
        } else if (firstItem?.repeatType === 'specific_days' && firstItem.specificDays) {
          setRepeatMode('custom');
          setSelectedDays(firstItem.specificDays);
        }
      }
      setHasLoadedExisting(true);
    }
  }, [isLoading, todayItems, hasLoadedExisting]);

  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [pickerInitialTime, setPickerInitialTime] = useState('09:00');

  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (dayVal: number) => {
    setRepeatMode('custom');
    if (selectedDays.includes(dayVal)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== dayVal));
      }
    } else {
      setSelectedDays([...selectedDays, dayVal]);
    }
  };

  const handleSelectPreset = (preset: 'today' | 'everyday' | 'weekdays') => {
    if (preset === 'today') {
      setRepeatMode('today');
    } else if (preset === 'everyday') {
      setRepeatMode('everyday');
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    } else {
      setRepeatMode('custom');
      setSelectedDays([1, 2, 3, 4, 5]);
    }
  };

  const handleAddBlock = () => {
    const lastBlock = timeBlocks[timeBlocks.length - 1];
    let nextStart = '10:00';
    if (lastBlock) {
      const [h, m] = lastBlock.startTime.split(':').map(Number);
      const nextH = ((h || 0) + 1) % 24;
      nextStart = `${String(nextH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
    }
    const newBlock: TimeBlockRow = {
      id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      startTime: nextStart,
      endTime: nextStart,
      title: '',
    };
    setTimeBlocks([...timeBlocks, newBlock]);
  };

  const handleDeleteBlock = (id: string) => {
    if (timeBlocks.length <= 1) {
      setTimeBlocks([{ ...timeBlocks[0], title: '' }]);
      return;
    }
    setTimeBlocks(timeBlocks.filter((b) => b.id !== id));
  };

  const handleUpdateTitle = (id: string, text: string) => {
    setTimeBlocks(timeBlocks.map((b) => (b.id === id ? { ...b, title: text } : b)));
  };

  const openTimePicker = (id: string, currentTime: string) => {
    setEditingBlockId(id);
    setPickerInitialTime(currentTime);
    setPickerModalVisible(true);
  };

  const handleConfirmTime = (selectedTime24: string) => {
    if (!editingBlockId) return;
    setTimeBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== editingBlockId) return b;
        return { ...b, startTime: selectedTime24, endTime: selectedTime24 };
      })
    );
  };

  const handleSave = async () => {
    const validBlocks = timeBlocks.filter((b) => b.title.trim().length > 0);
    if (validBlocks.length === 0 || isSaving) return;

    setIsSaving(true);
    try {
      const todayStr = formatDateToISO(new Date());
      let repeatType: TimelineRepeatType = 'today_only';
      let specificDaysToSave: number[] | undefined = undefined;

      if (repeatMode === 'everyday') {
        repeatType = 'daily';
      } else if (repeatMode === 'custom') {
        repeatType = 'specific_days';
        specificDaysToSave = selectedDays;
      }

      const itemsToSave = validBlocks.map((b) => ({
        title: b.title.trim(),
        startTime: b.startTime,
        endTime: b.endTime || b.startTime,
        category: 'work' as const,
        color: '#6366F1',
        emoji: '🎯',
        repeatType,
        specificDays: specificDaysToSave,
        startDate: todayStr,
      }));

      await replaceTodayItems(itemsToSave);
      router.back();
    } catch (err) {
      console.error('Failed to save timeline plan:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const hasValidEntries = timeBlocks.some((b) => b.title.trim().length > 0);

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      <LinearGradient
        colors={isDark ? ['#000000', '#000000', '#000000'] : ['#FFFFFF', '#FAFBFC', '#F4F6F8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.backBtn, isDark ? styles.backBtnDark : styles.backBtnLight]}
          onPress={() => router.back()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <View style={styles.headerTitleCenter}>
          <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>
            {todayItems.length > 0 ? "Edit Today's Plan" : 'Plan Your Day'}
          </Text>
          <Text style={[styles.headerSubtitle, isDark ? styles.subDark : styles.subLight]}>
            Add time & activity
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.quickAddBtn, isDark ? styles.quickAddDark : styles.quickAddLight]}
          onPress={handleAddBlock}
          activeOpacity={0.75}
        >
          <Ionicons name="add" size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}>
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, isDark ? styles.sectionTitleDark : styles.sectionTitleLight]}>REPEATING SCHEDULE</Text>
              <View style={styles.presetChipsRow}>
                <TouchableOpacity
                  style={[styles.presetChip, repeatMode === 'today' ? (isDark ? styles.presetActiveDark : styles.presetActiveLight) : (isDark ? styles.presetInactiveDark : styles.presetInactiveLight)]}
                  onPress={() => handleSelectPreset('today')}
                >
                  <Text style={[styles.presetText, repeatMode === 'today' ? styles.presetTextActive : (isDark ? styles.presetTextDark : styles.presetTextLight)]}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.presetChip, repeatMode === 'everyday' ? (isDark ? styles.presetActiveDark : styles.presetActiveLight) : (isDark ? styles.presetInactiveDark : styles.presetInactiveLight)]}
                  onPress={() => handleSelectPreset('everyday')}
                >
                  <Text style={[styles.presetText, repeatMode === 'everyday' ? styles.presetTextActive : (isDark ? styles.presetTextDark : styles.presetTextLight)]}>Everyday</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.presetChip, repeatMode === 'custom' && selectedDays.length === 5 ? (isDark ? styles.presetActiveDark : styles.presetActiveLight) : (isDark ? styles.presetInactiveDark : styles.presetInactiveLight)]}
                  onPress={() => handleSelectPreset('weekdays')}
                >
                  <Text style={[styles.presetText, repeatMode === 'custom' && selectedDays.length === 5 ? styles.presetTextActive : (isDark ? styles.presetTextDark : styles.presetTextLight)]}>Weekdays</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.squareDaysRow}>
              {DAYS.map((d, index) => {
                const isSelected = repeatMode === 'everyday' || (repeatMode === 'custom' && selectedDays.includes(d.value));
                return (
                  <TouchableOpacity
                    key={`${d.label}_${index}`}
                    style={[styles.squareDayPill, isSelected ? (isDark ? styles.squarePillActiveDark : styles.squarePillActiveLight) : (isDark ? styles.squarePillInactiveDark : styles.squarePillInactiveLight)]}
                    onPress={() => toggleDay(d.value)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.squareDayText, isSelected ? styles.squareTextActive : (isDark ? styles.squareTextInactiveDark : styles.squareTextInactiveLight)]}>{d.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.sectionWrapper}>
            <Text style={[styles.sectionTitle, isDark ? styles.sectionTitleDark : styles.sectionTitleLight]}>TIMELINE ACTIVITIES</Text>
            <View style={styles.blocksList}>
              {timeBlocks.map((block, index) => {
                const startTimeFormatted = formatTime12(block.startTime);
                return (
                  <View key={block.id} style={[styles.blockCard, isDark ? styles.blockCardDark : styles.blockCardLight]}>
                    <View style={[styles.cardTape, isDark ? styles.tapeDark : styles.tapeLight]} />
                    {isDark && Platform.OS !== 'web' ? <BlurView intensity={35} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 18 }]} /> : null}
                    
                    {/* Single Start Time Picker Button */}
                    <TouchableOpacity
                      style={[styles.timePickerPill, isDark ? styles.timePillDark : styles.timePillLight]}
                      onPress={() => openTimePicker(block.id, block.startTime)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="time" size={14} color={isDark ? '#FFFFFF' : '#0F172A'} style={{ marginRight: 6 }} />
                      <Text style={[styles.timeTextBold, isDark ? styles.textDark : styles.textLight]}>
                        {startTimeFormatted}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.inputCol}>
                      <TextInput
                        style={[styles.activityInput, isDark ? styles.textDark : styles.textLight]}
                        placeholder={index === 0 ? 'e.g. Go to office' : index === 1 ? 'e.g. Team standup' : index === 2 ? 'e.g. Lunch' : 'e.g. Work block'}
                        placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.35)' : '#94A3B8'}
                        value={block.title}
                        onChangeText={(txt) => handleUpdateTitle(block.id, txt)}
                      />
                    </View>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteBlock(block.id)} activeOpacity={0.7}>
                      <Ionicons name="close-circle-outline" size={20} color={isDark ? 'rgba(255, 255, 255, 0.40)' : '#94A3B8'} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity style={[styles.addMoreCard, isDark ? styles.addMoreDark : styles.addMoreLight]} onPress={handleAddBlock} activeOpacity={0.8}>
              <Ionicons name="add-circle" size={20} color={isDark ? '#FFFFFF' : '#0F172A'} style={{ marginRight: 6 }} />
              <Text style={[styles.addMoreText, isDark ? styles.textDark : styles.textLight]}>Add Activity</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.saveBtn, !hasValidEntries && { opacity: 0.45 }, isDark ? styles.saveBtnDark : styles.saveBtnLight]}
            onPress={handleSave}
            disabled={!hasValidEntries || isSaving}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={20} color={isDark ? '#0F172A' : '#FFFFFF'} style={{ marginRight: 8 }} />
            <Text style={[styles.saveBtnText, isDark ? { color: '#0F172A' } : { color: '#FFFFFF' }]}>
              {isSaving ? 'Saving Plan...' : 'Save Timeline Plan'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <PaperTimePickerModal
        visible={pickerModalVisible}
        initialTime={pickerInitialTime}
        title="Set Time"
        isDark={isDark}
        onClose={() => setPickerModalVisible(false)}
        onConfirm={handleConfirmTime}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1.2 },
  backBtnDark: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  backBtnLight: { backgroundColor: '#FAF8F5', borderColor: 'rgba(0, 0, 0, 0.12)' },
  headerTitleCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  quickAddBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1.2 },
  quickAddDark: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  quickAddLight: { backgroundColor: '#FAF8F5', borderColor: 'rgba(0, 0, 0, 0.12)' },
  textDark: { color: '#FFFFFF' },
  textLight: { color: '#0F172A' },
  subDark: { color: 'rgba(255, 255, 255, 0.60)' },
  subLight: { color: '#64748B' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, gap: 20 },
  sectionWrapper: { gap: 12 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  sectionTitleDark: { color: 'rgba(255, 255, 255, 0.60)' },
  sectionTitleLight: { color: '#64748B' },
  presetChipsRow: { flexDirection: 'row', gap: 6 },
  presetChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  presetActiveDark: { backgroundColor: 'rgba(255, 255, 255, 0.25)', borderColor: 'rgba(255, 255, 255, 0.60)' },
  presetActiveLight: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  presetInactiveDark: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.15)' },
  presetInactiveLight: { backgroundColor: '#FAF8F5', borderColor: 'rgba(0, 0, 0, 0.08)' },
  presetText: { fontSize: 11, fontWeight: '700' },
  presetTextActive: { color: '#FFFFFF' },
  presetTextDark: { color: 'rgba(255, 255, 255, 0.65)' },
  presetTextLight: { color: '#64748B' },
  squareDaysRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  squareDayPill: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1.2, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },
  squarePillActiveDark: { backgroundColor: 'rgba(255, 255, 255, 0.24)', borderColor: 'rgba(255, 255, 255, 0.70)' },
  squarePillActiveLight: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  squarePillInactiveDark: { backgroundColor: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.20)' },
  squarePillInactiveLight: { backgroundColor: '#FAF8F5', borderColor: 'rgba(0, 0, 0, 0.12)' },
  squareDayText: { fontSize: 14, fontWeight: '800' },
  squareTextActive: { color: '#FFFFFF' },
  squareTextInactiveDark: { color: 'rgba(255, 255, 255, 0.65)' },
  squareTextInactiveLight: { color: '#64748B' },
  blocksList: { gap: 12 },
  blockCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 14, overflow: 'hidden', borderWidth: 1.2, position: 'relative', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.20, shadowRadius: 6, elevation: 4 },
  blockCardDark: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.35)' },
  blockCardLight: { backgroundColor: '#FAF8F5', borderColor: 'rgba(0, 0, 0, 0.14)' },
  cardTape: { position: 'absolute', top: 0, left: '25%', right: '25%', height: 5, borderRadius: 2.5, zIndex: 10 },
  tapeDark: { backgroundColor: 'rgba(255, 255, 255, 0.25)', borderWidth: 0.5, borderColor: 'rgba(255, 255, 255, 0.40)' },
  tapeLight: { backgroundColor: 'rgba(251, 191, 36, 0.45)', borderWidth: 0.5, borderColor: 'rgba(245, 158, 11, 0.50)' },
  timePickerPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginRight: 10 },
  timePillDark: { backgroundColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.30)' },
  timePillLight: { backgroundColor: '#FFFFFF', borderColor: 'rgba(0, 0, 0, 0.10)' },
  timeTextBold: { fontSize: 13, fontWeight: '800', letterSpacing: -0.2 },
  inputCol: { flex: 1, justifyContent: 'center' },
  activityInput: { fontSize: 14, fontWeight: '600', paddingVertical: 6 },
  deleteBtn: { padding: 6, marginLeft: 4 },
  addMoreCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 16, borderWidth: 1.2, borderStyle: 'dashed', marginTop: 4 },
  addMoreDark: { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  addMoreLight: { backgroundColor: '#FAF8F5', borderColor: 'rgba(0, 0, 0, 0.18)' },
  addMoreText: { fontSize: 13, fontWeight: '700' },
  saveBtn: { height: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, shadowColor: '#000000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.30, shadowRadius: 10, elevation: 6 },
  saveBtnDark: { backgroundColor: '#FFFFFF' },
  saveBtnLight: { backgroundColor: '#0F172A' },
  saveBtnText: { fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
});
