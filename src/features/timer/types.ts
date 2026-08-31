export type TimerState = 'idle' | 'running' | 'paused' | 'finished';

export interface TimerPreset {
  id: string;
  label: string;
  seconds: number;
}
