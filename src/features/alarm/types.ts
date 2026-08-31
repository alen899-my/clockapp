export interface AlarmItem {
  id: string;
  hour: number;
  minute: number;
  label: string;
  days: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  enabled: boolean;
  snoozeEnabled: boolean;
  snoozeDurationMinutes: number;
  soundName: string;
  createdAt: number;
}
