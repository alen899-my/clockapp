import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/common/GradientBackground';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { IconButton } from '@/components/common/IconButton';
import { AlarmCard } from '@/features/alarm/components/AlarmCard';
import { AlarmModal } from '@/features/alarm/components/AlarmModal';
import { useAlarms } from '@/features/alarm/hooks/useAlarms';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { AlarmItem } from '@/features/alarm/types';
import { Spacing, Typography } from '@/constants/theme';

export default function AlarmScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const { alarms, toggleAlarm, addAlarm, updateAlarm, deleteAlarm } = useAlarms();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<AlarmItem | null>(null);

  const handleOpenNew = () => {
    setEditingAlarm(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (alarm: AlarmItem) => {
    setEditingAlarm(alarm);
    setModalVisible(true);
  };

  const handleSaveAlarm = (data: Omit<AlarmItem, 'id' | 'createdAt'>) => {
    if (editingAlarm) {
      updateAlarm(editingAlarm.id, data);
    } else {
      addAlarm(data);
    }
  };

  return (
    <GradientBackground>
      <FlatList
        data={alarms}
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
          <ScreenHeader
            title="Alarms"
            subtitle={`${alarms.filter((a) => a.enabled).length} Active`}
            style={styles.scrollableHeader}
            rightAction={
              <IconButton
                icon={<Ionicons name="add" size={24} color={theme.textPrimary} />}
                onPress={handleOpenNew}
              />
            }
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="alarm-outline" size={48} color={theme.primaryLight} style={{ opacity: 0.5 }} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Alarms Set</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
              Tap the + button to create a new smart wake up alarm.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <AlarmCard
            alarm={item}
            onToggle={toggleAlarm}
            onDelete={deleteAlarm}
            onEdit={handleOpenEdit}
          />
        )}
      />

      <AlarmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveAlarm}
        initialAlarm={editingAlarm}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: Spacing.xl,
  },
  scrollableHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 1.5,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h2,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
