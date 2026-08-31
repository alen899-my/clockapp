export interface CityTimezone {
  id: string;
  name: string;
  country: string;
  timezone: string;
  flag: string;
  continent: string;
}

export const POPULAR_CITIES: CityTimezone[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧', continent: 'Europe' },
  { id: 'new_york', name: 'New York', country: 'United States', timezone: 'America/New_York', flag: '🇺🇸', continent: 'North America' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵', continent: 'Asia' },
  { id: 'paris', name: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷', continent: 'Europe' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪', continent: 'Asia' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬', continent: 'Asia' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺', continent: 'Oceania' },
  { id: 'san_francisco', name: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles', flag: '🇺🇸', continent: 'North America' },
  { id: 'delhi', name: 'New Delhi', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', continent: 'Asia' },
  { id: 'hong_kong', name: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', flag: '🇭🇰', continent: 'Asia' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪', continent: 'Europe' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', flag: '🇨🇦', continent: 'North America' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷', continent: 'Asia' },
  { id: 'shanghai', name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', flag: '🇨🇳', continent: 'Asia' },
  { id: 'rome', name: 'Rome', country: 'Italy', timezone: 'Europe/Rome', flag: '🇮🇹', continent: 'Europe' },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', flag: '🇨🇭', continent: 'Europe' },
  { id: 'sao_paulo', name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷', continent: 'South America' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬', continent: 'Africa' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿', continent: 'Oceania' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', flag: '🇹🇭', continent: 'Asia' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱', continent: 'Europe' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', flag: '🇹🇷', continent: 'Europe' },
  { id: 'los_angeles', name: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', flag: '🇺🇸', continent: 'North America' },
  { id: 'chicago', name: 'Chicago', country: 'United States', timezone: 'America/Chicago', flag: '🇺🇸', continent: 'North America' },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', flag: '🇿🇦', continent: 'Africa' },
];

export const DEFAULT_SELECTED_CITIES: string[] = ['london', 'new_york', 'tokyo', 'paris'];
