import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlarmItem } from '../types';

const ALARMS_STORAGE_KEY = '@mytime_alarms';

const DEFAULT_ALARMS: AlarmItem[] = [
  {
    id: 'alarm_1',
    hour: 7,
    minute: 0,
    label: 'Morning Rise & Shine',
    days: [1, 2, 3, 4, 5],
    enabled: true,
    snoozeEnabled: true,
    snoozeDurationMinutes: 10,
    soundName: 'Cosmic Violet',
    createdAt: Date.now(),
  },
  {
    id: 'alarm_2',
    hour: 8,
    minute: 30,
    label: 'Weekend Workout',
    days: [0, 6],
    enabled: false,
    snoozeEnabled: true,
    snoozeDurationMinutes: 5,
    soundName: 'Neon Wave',
    createdAt: Date.now() + 1,
  },
  {
    id: 'alarm_3',
    hour: 23,
    minute: 15,
    label: 'Night Wind Down',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
    snoozeEnabled: false,
    snoozeDurationMinutes: 5,
    soundName: 'Velvet Dream',
    createdAt: Date.now() + 2,
  },
];

export const useAlarms = () => {
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);

  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const saved = await AsyncStorage.getItem(ALARMS_STORAGE_KEY);
        if (saved) {
          setAlarms(JSON.parse(saved));
        } else {
          setAlarms(DEFAULT_ALARMS);
          await AsyncStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(DEFAULT_ALARMS));
        }
      } catch (e) {
        console.warn('Failed to load alarms', e);
      }
    };
    loadAlarms();
  }, []);

  const saveAlarms = async (newList: AlarmItem[]) => {
    setAlarms(newList);
    try {
      await AsyncStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.warn('Failed to save alarms', e);
    }
  };

  const toggleAlarm = (id: string) => {
    const updated = alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
    saveAlarms(updated);
  };

  const addAlarm = (alarmData: Omit<AlarmItem, 'id' | 'createdAt'>) => {
    const newAlarm: AlarmItem = {
      ...alarmData,
      id: `alarm_${Date.now()}`,
      createdAt: Date.now(),
    };
    saveAlarms([...alarms, newAlarm]);
  };

  const updateAlarm = (id: string, alarmData: Partial<AlarmItem>) => {
    const updated = alarms.map((a) => (a.id === id ? { ...a, ...alarmData } : a));
    saveAlarms(updated);
  };

  const deleteAlarm = (id: string) => {
    const updated = alarms.filter((a) => a.id !== id);
    saveAlarms(updated);
  };

  return {
    alarms,
    toggleAlarm,
    addAlarm,
    updateAlarm,
    deleteAlarm,
  };
};
