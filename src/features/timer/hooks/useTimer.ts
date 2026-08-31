import { useEffect, useRef, useState } from 'react';
import { TimerState } from '../types';
import { triggerHaptic } from '@/utils/haptics';

export const useTimer = () => {
  const [totalSeconds, setTotalSeconds] = useState<number>(300); // 5 minutes default
  const [remainingSeconds, setRemainingSeconds] = useState<number>(300);
  const [timerState, setTimerState] = useState<TimerState>('idle');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            triggerHaptic('success');
            setTimerState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState]);

  const startTimer = (customSeconds?: number) => {
    const sec = customSeconds ?? remainingSeconds;
    if (sec <= 0) return;

    if (customSeconds) {
      setTotalSeconds(customSeconds);
      setRemainingSeconds(customSeconds);
    }
    setTimerState('running');
  };

  const pauseTimer = () => {
    if (timerState === 'running') {
      setTimerState('paused');
    }
  };

  const resumeTimer = () => {
    if (timerState === 'paused') {
      setTimerState('running');
    }
  };

  const resetTimer = () => {
    setTimerState('idle');
    setRemainingSeconds(totalSeconds);
  };

  const addOneMinute = () => {
    setRemainingSeconds((prev) => prev + 60);
    setTotalSeconds((prev) => prev + 60);
    triggerHaptic('light');
  };

  return {
    totalSeconds,
    remainingSeconds,
    timerState,
    setTotalSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    addOneMinute,
  };
};
