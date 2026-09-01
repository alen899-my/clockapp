import React, { useState, useEffect } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface PaperTimePickerModalProps {
  visible: boolean;
  initialTime: string; // "HH:mm" (24h)
  title?: string;
  isDark: boolean;
  onClose: () => void;
  onConfirm: (time24: string) => void;
}

export const PaperTimePickerModal: React.FC<PaperTimePickerModalProps> = ({
  visible,
  initialTime,
  title = 'Select Time',
  isDark,
  onClose,
  onConfirm,
}) => {
  const [hour12, setHour12] = useState(9);
  const [minute, setMinute] = useState(0);
  const [isPM, setIsPM] = useState(false);

  useEffect(() => {
    if (visible && initialTime) {
      const [hStr, mStr] = initialTime.split(':');
      let h = parseInt(hStr || '9', 10);
      const m = parseInt(mStr || '0', 10);
      const pm = h >= 12;
      let h12 = h % 12;
      if (h12 === 0) h12 = 12;

      setHour12(h12);
      setMinute(m);
      setIsPM(pm);
    }
  }, [visible, initialTime]);

  const incrementHour = (delta: number) => {
    setHour12((prev) => {
      let next = prev + delta;
      if (next > 12) next = 1;
      if (next < 1) next = 12;
      return next;
    });
  };

  const incrementMinute = (delta: number) => {
    setMinute((prev) => {
      let next = (prev + delta + 60) % 60;
      return next;
    });
  };

  const handleDone = () => {
    let h24 = hour12 % 12;
    if (isPM) h24 += 12;
    const time24 = `${String(h24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    onConfirm(time24);
    onClose();
  };

  const hourStr = String(hour12).padStart(2, '0');
  const minuteStr = String(minute).padStart(2, '0');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
              {/* Blur Layer */}
              {isDark && Platform.OS !== 'web' ? (
                <BlurView
                  intensity={45}
                  tint="dark"
                  style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
                />
              ) : null}

              {/* Translucent Gradient */}
              <LinearGradient
                colors={
                  isDark
                    ? ['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.05)', '#0A0E17']
                    : ['#FFFFFF', '#FDFBF7', '#F3EFE6']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              {/* Top Tape Strip matching rolling time card */}
              <View style={[styles.topTape, isDark ? styles.tapeDark : styles.tapeLight]} />

              {/* Modal Header */}
              <View style={styles.headerRow}>
                <Text style={[styles.modalTitle, isDark ? styles.titleDark : styles.titleLight]}>
                  {title}
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              {/* ── 3D Paper Time Pickers (Hours : Minutes : AM/PM) ── */}
              <View style={styles.pickersContainer}>
                {/* Hours Box */}
                <View style={styles.unitCol}>
                  <Text style={[styles.unitLabel, isDark ? styles.labelDark : styles.labelLight]}>
                    HOURS
                  </Text>
                  <TouchableOpacity
                    style={[styles.stepperArrow, isDark ? styles.arrowDark : styles.arrowLight]}
                    onPress={() => incrementHour(1)}
                  >
                    <Ionicons name="chevron-up" size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
                  </TouchableOpacity>

                  <View style={[styles.digitPaperCard, isDark ? styles.digitCardDark : styles.digitCardLight]}>
                    <Text style={[styles.digitNumber, isDark ? styles.digitDark : styles.digitLight]}>
                      {hourStr}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.stepperArrow, isDark ? styles.arrowDark : styles.arrowLight]}
                    onPress={() => incrementHour(-1)}
                  >
                    <Ionicons name="chevron-down" size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
                  </TouchableOpacity>
                </View>

                {/* Colon Separator */}
                <Text style={[styles.colonText, isDark ? styles.colonDark : styles.colonLight]}>
                  :
                </Text>

                {/* Minutes Box */}
                <View style={styles.unitCol}>
                  <Text style={[styles.unitLabel, isDark ? styles.labelDark : styles.labelLight]}>
                    MINUTES
                  </Text>
                  <TouchableOpacity
                    style={[styles.stepperArrow, isDark ? styles.arrowDark : styles.arrowLight]}
                    onPress={() => incrementMinute(5)}
                  >
                    <Ionicons name="chevron-up" size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
                  </TouchableOpacity>

                  <View style={[styles.digitPaperCard, isDark ? styles.digitCardDark : styles.digitCardLight]}>
                    <Text style={[styles.digitNumber, isDark ? styles.digitDark : styles.digitLight]}>
                      {minuteStr}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.stepperArrow, isDark ? styles.arrowDark : styles.arrowLight]}
                    onPress={() => incrementMinute(-5)}
                  >
                    <Ionicons name="chevron-down" size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
                  </TouchableOpacity>
                </View>

                {/* AM / PM Toggle */}
                <View style={styles.amPmCol}>
                  <TouchableOpacity
                    style={[
                      styles.amPmPill,
                      !isPM
                        ? isDark
                          ? styles.amPmActiveDark
                          : styles.amPmActiveLight
                        : isDark
                        ? styles.amPmInactiveDark
                        : styles.amPmInactiveLight,
                    ]}
                    onPress={() => setIsPM(false)}
                  >
                    <Text
                      style={[
                        styles.amPmText,
                        !isPM ? styles.amPmTextActive : isDark ? styles.amPmTextDark : styles.amPmTextLight,
                      ]}
                    >
                      AM
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.amPmPill,
                      isPM
                        ? isDark
                          ? styles.amPmActiveDark
                          : styles.amPmActiveLight
                        : isDark
                        ? styles.amPmInactiveDark
                        : styles.amPmInactiveLight,
                    ]}
                    onPress={() => setIsPM(true)}
                  >
                    <Text
                      style={[
                        styles.amPmText,
                        isPM ? styles.amPmTextActive : isDark ? styles.amPmTextDark : styles.amPmTextLight,
                      ]}
                    >
                      PM
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Preset Quick Minute Chips */}
              <View style={styles.quickMinutesRow}>
                {[0, 15, 30, 45].map((mVal) => (
                  <TouchableOpacity
                    key={mVal}
                    style={[
                      styles.quickMinChip,
                      minute === mVal
                        ? isDark
                          ? styles.quickMinActiveDark
                          : styles.quickMinActiveLight
                        : isDark
                        ? styles.quickMinInactiveDark
                        : styles.quickMinInactiveLight,
                    ]}
                    onPress={() => setMinute(mVal)}
                  >
                    <Text
                      style={[
                        styles.quickMinText,
                        minute === mVal
                          ? { color: '#FFFFFF', fontWeight: '700' }
                          : isDark
                          ? { color: 'rgba(255, 255, 255, 0.75)' }
                          : { color: '#64748B' },
                      ]}
                    >
                      :{String(mVal).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Set Time CTA Button */}
              <TouchableOpacity
                style={[styles.confirmBtn, isDark ? styles.confirmBtnDark : styles.confirmBtnLight]}
                onPress={handleDone}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmBtnText}>Set Time</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 12,
  },
  cardDark: {
    backgroundColor: 'rgba(20, 26, 38, 0.90)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  cardLight: {
    backgroundColor: '#FAF8F5',
    borderColor: 'rgba(0, 0, 0, 0.14)',
  },
  topTape: {
    position: 'absolute',
    top: 0,
    left: '30%',
    right: '30%',
    height: 6,
    borderRadius: 3,
    zIndex: 20,
  },
  tapeDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.30)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  tapeLight: {
    backgroundColor: 'rgba(251, 191, 36, 0.55)',
    borderWidth: 0.5,
    borderColor: 'rgba(245, 158, 11, 0.60)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  titleLight: {
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  pickersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 10,
  },
  unitCol: {
    alignItems: 'center',
  },
  unitLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  labelDark: {
    color: 'rgba(255, 255, 255, 0.60)',
  },
  labelLight: {
    color: '#64748B',
  },
  stepperArrow: {
    padding: 6,
    borderRadius: 8,
  },
  arrowDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  arrowLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  digitPaperCard: {
    width: 72,
    height: 72,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    borderWidth: 1.2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  digitCardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  digitCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  digitNumber: {
    fontSize: 32,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  digitDark: {
    color: '#FFFFFF',
  },
  digitLight: {
    color: '#0F172A',
  },
  colonText: {
    fontSize: 28,
    fontWeight: '800',
    paddingBottom: 4,
  },
  colonDark: {
    color: 'rgba(255, 255, 255, 0.60)',
  },
  colonLight: {
    color: '#64748B',
  },
  amPmCol: {
    justifyContent: 'center',
    gap: 8,
    marginLeft: 6,
    paddingTop: 18,
  },
  amPmPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amPmActiveDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.60)',
  },
  amPmActiveLight: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  amPmInactiveDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  amPmInactiveLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  amPmText: {
    fontSize: 12,
    fontWeight: '800',
  },
  amPmTextActive: {
    color: '#FFFFFF',
  },
  amPmTextDark: {
    color: 'rgba(255, 255, 255, 0.60)',
  },
  amPmTextLight: {
    color: '#64748B',
  },
  quickMinutesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  quickMinChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickMinActiveDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.50)',
  },
  quickMinActiveLight: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  quickMinInactiveDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  quickMinInactiveLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  quickMinText: {
    fontSize: 12,
    fontWeight: '600',
  },
  confirmBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmBtnDark: {
    backgroundColor: '#FFFFFF',
  },
  confirmBtnLight: {
    backgroundColor: '#0F172A',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
});
