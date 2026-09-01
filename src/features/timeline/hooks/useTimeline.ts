import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimelineItem } from '../types';

const STORAGE_KEY = '@clock_app_timeline_items_v1';

export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isItemActiveForDate(item: TimelineItem, targetDate: Date): boolean {
  const targetIso = formatDateToISO(targetDate);
  const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday...

  switch (item.repeatType) {
    case 'today_only':
      return item.startDate === targetIso;

    case 'daily':
      return true;

    case 'specific_days':
      return Array.isArray(item.specificDays) && item.specificDays.includes(dayOfWeek);

    case 'date_range':
      if (!item.startDate || !item.endDate) return false;
      return targetIso >= item.startDate && targetIso <= item.endDate;

    default:
      return true;
  }
}

export function useTimeline(currentDate: Date = new Date()) {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from AsyncStorage on mount
  useEffect(() => {
    let isMounted = true;
    const loadItems = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (err) {
        console.error('Failed to load timeline items:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadItems();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save to AsyncStorage
  const saveItems = useCallback(async (newItems: TimelineItem[]) => {
    try {
      setItems(newItems);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (err) {
      console.error('Failed to save timeline items:', err);
    }
  }, []);

  // Add Item
  const addItem = useCallback(
    async (itemData: Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'>) => {
      const newItem: TimelineItem = {
        ...itemData,
        id: `timeline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        completedDates: [],
        createdAt: new Date().toISOString(),
      };
      const updated = [...items, newItem];
      await saveItems(updated);
      return newItem;
    },
    [items, saveItems]
  );

  // Update Item
  const updateItem = useCallback(
    async (id: string, updates: Partial<TimelineItem>) => {
      const updated = items.map((item) => (item.id === id ? { ...item, ...updates } : item));
      await saveItems(updated);
    },
    [items, saveItems]
  );

  // Delete Item
  const deleteItem = useCallback(
    async (id: string) => {
      const updated = items.filter((item) => item.id !== id);
      await saveItems(updated);
    },
    [items, saveItems]
  );

  // Toggle Complete for Today
  const toggleCompleteToday = useCallback(
    async (id: string) => {
      const todayIso = formatDateToISO(currentDate);
      const updated = items.map((item) => {
        if (item.id !== id) return item;
        const currentCompleted = item.completedDates || [];
        const isCompleted = currentCompleted.includes(todayIso);
        const newCompleted = isCompleted
          ? currentCompleted.filter((d) => d !== todayIso)
          : [...currentCompleted, todayIso];
        return {
          ...item,
          completedDates: newCompleted,
        };
      });
      await saveItems(updated);
    },
    [items, currentDate, saveItems]
  );

  // Apply Template
  const applyTemplate = useCallback(
    async (templateItems: Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'>[]) => {
      const todayIso = formatDateToISO(currentDate);
      const newCreatedItems: TimelineItem[] = templateItems.map((item, idx) => ({
        ...item,
        id: `timeline_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
        startDate: item.startDate || todayIso,
        completedDates: [],
        createdAt: new Date().toISOString(),
      }));
      const updated = [...items, ...newCreatedItems];
      await saveItems(updated);
    },
    [items, currentDate, saveItems]
  );

  // Add Multiple Items (Batch)
  const addMultipleItems = useCallback(
    async (itemsData: Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'>[]) => {
      const todayIso = formatDateToISO(currentDate);
      const newCreatedItems: TimelineItem[] = itemsData.map((item, idx) => ({
        ...item,
        id: `timeline_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
        startDate: item.startDate || todayIso,
        completedDates: [],
        createdAt: new Date().toISOString(),
      }));
      const updated = [...items, ...newCreatedItems];
      await saveItems(updated);
      return newCreatedItems;
    },
    [items, currentDate, saveItems]
  );

  // Replace Today Items (For editing entire day's plan)
  const replaceTodayItems = useCallback(
    async (itemsData: Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'>[]) => {
      const todayIso = formatDateToISO(currentDate);
      const otherItems = items.filter((item) => !isItemActiveForDate(item, currentDate));
      const newCreatedItems: TimelineItem[] = itemsData.map((item, idx) => ({
        ...item,
        id: `timeline_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
        startDate: item.startDate || todayIso,
        completedDates: [],
        createdAt: new Date().toISOString(),
      }));
      const updated = [...otherItems, ...newCreatedItems];
      await saveItems(updated);
      return newCreatedItems;
    },
    [items, currentDate, saveItems]
  );

  // Filter items active for today and sort by startTime
  const todayIso = useMemo(() => formatDateToISO(currentDate), [currentDate]);

  const todayItems = useMemo(() => {
    return items
      .filter((item) => isItemActiveForDate(item, currentDate))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [items, currentDate]);

  const completedCount = useMemo(() => {
    return todayItems.filter((item) => item.completedDates?.includes(todayIso)).length;
  }, [todayItems, todayIso]);

  return {
    items,
    todayItems,
    isLoading,
    todayIso,
    completedCount,
    totalCount: todayItems.length,
    addItem,
    addMultipleItems,
    replaceTodayItems,
    updateItem,
    deleteItem,
    toggleCompleteToday,
    applyTemplate,
  };
}

