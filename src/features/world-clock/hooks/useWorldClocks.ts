import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CityTimezone, DEFAULT_SELECTED_CITIES, POPULAR_CITIES } from '@/constants/timezones';
import { WorldClockCity } from '../types';

const WORLD_CLOCKS_STORAGE_KEY = '@mytime_world_clocks';

export const useWorldClocks = () => {
  const [cities, setCities] = useState<WorldClockCity[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Live timer tick every 1000ms
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load persisted cities
  useEffect(() => {
    const loadCities = async () => {
      try {
        const saved = await AsyncStorage.getItem(WORLD_CLOCKS_STORAGE_KEY);
        if (saved) {
          setCities(JSON.parse(saved));
        } else {
          // Initialize with defaults
          const defaults: WorldClockCity[] = POPULAR_CITIES.filter((c) =>
            DEFAULT_SELECTED_CITIES.includes(c.id)
          ).map((c) => ({ ...c, addedAt: Date.now() }));
          setCities(defaults);
          await AsyncStorage.setItem(WORLD_CLOCKS_STORAGE_KEY, JSON.stringify(defaults));
        }
      } catch (e) {
        console.warn('Failed to load world cities', e);
      }
    };
    loadCities();
  }, []);

  const addCity = async (city: CityTimezone) => {
    if (cities.some((c) => c.id === city.id)) return;

    const updated = [...cities, { ...city, addedAt: Date.now() }];
    setCities(updated);
    try {
      await AsyncStorage.setItem(WORLD_CLOCKS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist added city', e);
    }
  };

  const removeCity = async (id: string) => {
    const updated = cities.filter((c) => c.id !== id);
    setCities(updated);
    try {
      await AsyncStorage.setItem(WORLD_CLOCKS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist removed city', e);
    }
  };

  return {
    currentTime,
    cities,
    addCity,
    removeCity,
  };
};
