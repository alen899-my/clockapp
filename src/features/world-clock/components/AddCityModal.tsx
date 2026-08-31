import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { CityTimezone, POPULAR_CITIES } from '@/constants/timezones';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { GlassCard } from '@/components/common/GlassCard';
import { triggerHaptic } from '@/utils/haptics';

interface AddCityModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCity: (city: CityTimezone) => void;
  selectedCityIds: string[];
}

export const AddCityModal: React.FC<AddCityModalProps> = ({
  visible,
  onClose,
  onSelectCity,
  selectedCityIds,
}) => {
  const { theme, settings } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.continent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (city: CityTimezone) => {
    triggerHaptic('selection', settings.hapticsEnabled);
    onSelectCity(city);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.modalSheet, { backgroundColor: theme.bgBase }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Add World City</Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: theme.glassBg }]}
            >
              <Feather name="x" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.glassBorder,
              },
            ]}
          >
            <Feather name="search" size={18} color={theme.primaryLight} style={styles.searchIcon} />
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="Search city, country or continent..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Cities List */}
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isAdded = selectedCityIds.includes(item.id);
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSelect(item)}
                  disabled={isAdded}
                  style={styles.cityRow}
                >
                  <GlassCard
                    style={[
                      styles.cityCard,
                      isAdded && { opacity: 0.5 },
                    ]}
                  >
                    <View style={styles.cityRowContent}>
                      <View style={styles.cityInfo}>
                        <Text style={styles.flag}>{item.flag}</Text>
                        <View>
                          <Text style={[styles.cityName, { color: theme.textPrimary }]}>
                            {item.name}
                          </Text>
                          <Text style={[styles.countryName, { color: theme.textMuted }]}>
                            {item.country} • {item.continent}
                          </Text>
                        </View>
                      </View>

                      {isAdded ? (
                        <View style={[styles.addedBadge, { backgroundColor: theme.primaryDark }]}>
                          <Feather name="check" size={14} color="#FFFFFF" />
                        </View>
                      ) : (
                        <Text style={[styles.addText, { color: theme.primaryLight }]}>Add</Text>
                      )}
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    height: '80%',
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
  closeButton: {
    padding: 8,
    borderRadius: BorderRadius.full,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  cityRow: {
    marginBottom: Spacing.sm,
  },
  cityCard: {
    paddingVertical: Spacing.xs,
  },
  cityRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  cityName: {
    ...Typography.h3,
    fontSize: 16,
  },
  countryName: {
    ...Typography.caption,
    marginTop: 2,
  },
  addedBadge: {
    padding: 6,
    borderRadius: BorderRadius.full,
  },
  addText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
