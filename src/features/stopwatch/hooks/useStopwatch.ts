import { useEffect, useRef, useState } from 'react';
import { LapItem } from '../types';

export const useStopwatch = () => {
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<LapItem[]>([]);

  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const lastLapTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();

      const update = () => {
        const now = Date.now();
        const currentElapsed = accumulatedRef.current + (now - startTimeRef.current);
        setElapsedMs(currentElapsed);
        animFrameRef.current = requestAnimationFrame(update);
      };

      animFrameRef.current = requestAnimationFrame(update);
    } else {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    }

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRunning]);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const pause = () => {
    if (isRunning) {
      const now = Date.now();
      accumulatedRef.current += now - startTimeRef.current;
      setElapsedMs(accumulatedRef.current);
      setIsRunning(false);
    }
  };

  const reset = () => {
    setIsRunning(false);
    accumulatedRef.current = 0;
    lastLapTimeRef.current = 0;
    setElapsedMs(0);
    setLaps([]);
  };

  const recordLap = () => {
    if (!isRunning && elapsedMs === 0) return;

    const currentTotal = elapsedMs;
    const lapDuration = currentTotal - lastLapTimeRef.current;
    lastLapTimeRef.current = currentTotal;

    const newLap: LapItem = {
      id: `lap_${Date.now()}_${laps.length + 1}`,
      lapNumber: laps.length + 1,
      lapTimeMs: lapDuration,
      overallTimeMs: currentTotal,
    };

    setLaps((prev) => [newLap, ...prev]);
  };

  // Find fastest & slowest lap IDs
  let fastestLapId: string | null = null;
  let slowestLapId: string | null = null;

  if (laps.length >= 2) {
    let minTime = Infinity;
    let maxTime = -Infinity;

    laps.forEach((lap) => {
      if (lap.lapTimeMs < minTime) {
        minTime = lap.lapTimeMs;
        fastestLapId = lap.id;
      }
      if (lap.lapTimeMs > maxTime) {
        maxTime = lap.lapTimeMs;
        slowestLapId = lap.id;
      }
    });
  }

  return {
    elapsedMs,
    isRunning,
    start,
    pause,
    reset,
    recordLap,
    laps,
    fastestLapId,
    slowestLapId,
  };
};
