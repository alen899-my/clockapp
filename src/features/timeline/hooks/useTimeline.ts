import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimelineItem } from '../types';
import { timelineApi } from '@/services/timelineApi';

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
  const [isSyncing, setIsSyncing] = useState(false);

  // Helper to persist to local storage cache
  const persistLocalCache = useCallback(async (newItems: TimelineItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (err) {
      console.error('Failed to cache timeline items to local storage:', err);
    }
  }, []);

  // Sync / Load data on mount: Cache-first + Remote background fetch
  useEffect(() => {
    let isMounted = true;

    const loadAndSync = async () => {
      let localItems: TimelineItem[] = [];

      // 1. Fast Load from AsyncStorage
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            localItems = parsed;
            setItems(localItems);
          }
        }
      } catch (err) {
        console.warn('Failed to load local timeline cache:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }

      // 2. Fetch latest from Neon PostgreSQL backend
      try {
        setIsSyncing(true);
        const remoteItems = await timelineApi.getAll();

        if (isMounted && Array.isArray(remoteItems)) {
          if (remoteItems.length > 0) {
            setItems(remoteItems);
            await persistLocalCache(remoteItems);
          } else if (localItems.length > 0) {
            // First time migration: server is empty, upload local items to Neon DB
            console.log('Migrating local timeline items to Neon PostgreSQL...');
            const uploaded = await timelineApi.createBatch(localItems);
            if (isMounted) {
              setItems(uploaded);
              await persistLocalCache(uploaded);
            }
          }
        }
      } catch (err) {
        console.warn('Could not sync with backend (operating in offline cache mode):', (err as Error).message);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    loadAndSync();

    return () => {
      isMounted = false;
    };
  }, [persistLocalCache]);

  // Add Item (Optimistic + Backend Sync)
  const addItem = useCallback(
    async (itemData: Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'>) => {
      const tempId = `timeline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newItem: TimelineItem = {
        ...itemData,
        id: tempId,
        completedDates: [],
        createdAt: new Date().toISOString(),
      };

      // Optimistic local update
      const updated = [...items, newItem];
      setItems(updated);
      await persistLocalCache(updated);

      // Backend sync
      try {
        const savedItem = await timelineApi.create(newItem);
        // Replace temp item with server response
        setItems((current) => {
          const synced = current.map((it) => (it.id === tempId ? savedItem : it));
          persistLocalCache(synced);
          return synced;
        });
        return savedItem;
      } catch (err) {
        console.warn('Failed to sync new item to backend, saved locally:', err);
        return newItem;
      }
    },
    [items, persistLocalCache]
  );

  // Update Item (Optimistic + Backend Sync)
  const updateItem = useCallback(
    async (id: string, updates: Partial<TimelineItem>) => {
      // Optimistic local update
      const updated = items.map((item) => (item.id === id ? { ...item, ...updates } : item));
      setItems(updated);
      await persistLocalCache(updated);

      // Backend sync
      try {
        await timelineApi.update(id, updates);
      } catch (err) {
        console.warn(`Failed to sync update for item ${id} to backend:`, err);
      }
    },
    [items, persistLocalCache]
  );

  // Delete Item (Optimistic + Backend Sync)
  const deleteItem = useCallback(
    async (id: string) => {
      // Optimistic local update
      const updated = items.filter((item) => item.id !== id);
      setItems(updated);
      await persistLocalCache(updated);

      // Backend sync
      try {
        await timelineApi.delete(id);
      } catch (err) {
        console.warn(`Failed to sync delete for item ${id} to backend:`, err);
      }
    },
    [items, persistLocalCache]
  );

  // Toggle Complete for Today (Optimistic + Backend Sync)
  const toggleCompleteToday = useCallback(
    async (id: string) => {
      const todayIso = formatDateToISO(currentDate);

      // Optimistic local update
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

      setItems(updated);
      await persistLocalCache(updated);

      // Backend sync
      try {
        await timelineApi.toggleComplete(id, todayIso);
      } catch (err) {
        console.warn(`Failed to sync toggle complete for item ${id}:`, err);
      }
    },
    [items, currentDate, persistLocalCache]
  );

  // Apply Template (Batch create to Backend + Local)
  const applyTemplate = useCallback(
    async (templateItems: Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'>[]) => {
      const todayIso = formatDateToISO(currentDate);
      const newItemsToCreate: TimelineItem[] = templateItems.map((item, idx) => ({
        ...item,
        id: `timeline_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
        startDate: item.startDate || todayIso,
        completedDates: [],
        createdAt: new Date().toISOString(),
      }));

      // Optimistic local update
      const updated = [...items, ...newItemsToCreate];
      setItems(updated);
      await persistLocalCache(updated);

      // Backend sync
      try {
        const createdOnServer = await timelineApi.createBatch(newItemsToCreate);
        if (createdOnServer && createdOnServer.length > 0) {
          const syncedItems = [...items, ...createdOnServer];
          setItems(syncedItems);
          await persistLocalCache(syncedItems);
        }
      } catch (err) {
        console.warn('Failed to sync template items to backend, saved locally:', err);
      }
    },
    [items, currentDate, persistLocalCache]
  );

  // Add Multiple Items (Batch)
  const addMultipleItems = useCallback(
    async (itemsData: Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'>[]) => {
      const todayIso = formatDateToISO(currentDate);
      const newItemsToCreate: TimelineItem[] = itemsData.map((item, idx) => ({
        ...item,
        id: `timeline_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
        startDate: item.startDate || todayIso,
        completedDates: [],
        createdAt: new Date().toISOString(),
      }));

      // Optimistic local update
      const updated = [...items, ...newItemsToCreate];
      setItems(updated);
      await persistLocalCache(updated);

      // Backend sync
      try {
        const createdOnServer = await timelineApi.createBatch(newItemsToCreate);
        if (createdOnServer && createdOnServer.length > 0) {
          const syncedItems = [...items, ...createdOnServer];
          setItems(syncedItems);
          await persistLocalCache(syncedItems);
          return createdOnServer;
        }
      } catch (err) {
        console.warn('Failed to sync batch items to backend, saved locally:', err);
      }

      return newItemsToCreate;
    },
    [items, currentDate, persistLocalCache]
  );

  // Replace Today Items (For editing entire day's plan)
  const replaceTodayItems = useCallback(
    async (itemsData: Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'>[]) => {
      const todayIso = formatDateToISO(currentDate);
      const otherItems = items.filter((item) => !isItemActiveForDate(item, currentDate));
      const newItemsToCreate: TimelineItem[] = itemsData.map((item, idx) => ({
        ...item,
        id: `timeline_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
        startDate: item.startDate || todayIso,
        completedDates: [],
        createdAt: new Date().toISOString(),
      }));

      const updated = [...otherItems, ...newItemsToCreate];
      setItems(updated);
      await persistLocalCache(updated);

      // Backend sync
      try {
        const replacedOnServer = await timelineApi.replaceToday(todayIso, newItemsToCreate);
        if (replacedOnServer && replacedOnServer.length > 0) {
          const synced = [...otherItems, ...replacedOnServer];
          setItems(synced);
          await persistLocalCache(synced);
          return replacedOnServer;
        }
      } catch (err) {
        console.warn("Failed to sync replaceTodayItems to backend, saved locally:", err);
      }

      return newItemsToCreate;
    },
    [items, currentDate, persistLocalCache]
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
    isSyncing,
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
