const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const formatDigitalTime = (
  date: Date,
  is24Hour: boolean = false,
  showSeconds: boolean = true
): { time: string; period: string; seconds: string } => {
  const h24 = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  const minStr = String(m).padStart(2, '0');
  const secStr = String(s).padStart(2, '0');

  if (is24Hour) {
    const hrStr = String(h24).padStart(2, '0');
    const time = showSeconds ? `${hrStr}:${minStr}:${secStr}` : `${hrStr}:${minStr}`;
    return { time, period: '', seconds: secStr };
  } else {
    const period = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 || 12;
    const hrStr = String(h12).padStart(2, '0');
    const time = `${hrStr}:${minStr}`;
    return { time, period, seconds: secStr };
  }
};

export const getFullFormattedDate = (date: Date): string => {
  const dayName = DAYS[date.getDay()];
  const monthName = MONTHS[date.getMonth()];
  const dayNum = date.getDate();
  const year = date.getFullYear();

  let suffix = 'th';
  if (dayNum % 10 === 1 && dayNum !== 11) suffix = 'st';
  else if (dayNum % 10 === 2 && dayNum !== 12) suffix = 'nd';
  else if (dayNum % 10 === 3 && dayNum !== 13) suffix = 'rd';

  return `${dayName}, ${monthName} ${dayNum}${suffix}, ${year}`;
};

export const formatZonedCityTime = (
  date: Date,
  timezone: string,
  is24Hour: boolean = false
): { time: string; period: string; dateStr: string; timeDiff: string; isDay: boolean } => {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: is24Hour ? 'h23' : 'h12',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const parts = dtf.formatToParts(date);
    let hourStr = '00';
    let minuteStr = '00';
    let period = '';
    let weekdayStr = '';
    let monthStr = '';
    let dayStr = '';

    parts.forEach((p) => {
      if (p.type === 'hour') hourStr = p.value.padStart(2, '0');
      if (p.type === 'minute') minuteStr = p.value.padStart(2, '0');
      if (p.type === 'dayPeriod') period = p.value.toUpperCase();
      if (p.type === 'weekday') weekdayStr = p.value;
      if (p.type === 'month') monthStr = p.value;
      if (p.type === 'day') dayStr = p.value;
    });

    const time = `${hourStr}:${minuteStr}`;
    const dateStr = `${weekdayStr}, ${monthStr} ${dayStr}`;

    // Get 24-hour hour in target timezone for isDay and time difference
    const dtf24 = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    });
    const parts24 = dtf24.formatToParts(date);
    let targetH = 0;
    let targetM = 0;
    parts24.forEach((p) => {
      if (p.type === 'hour') targetH = parseInt(p.value, 10);
      if (p.type === 'minute') targetM = parseInt(p.value, 10);
    });

    const isDay = targetH >= 6 && targetH < 18;

    const localMinutes = date.getHours() * 60 + date.getMinutes();
    const targetMinutes = targetH * 60 + targetM;
    let diffMinutes = targetMinutes - localMinutes;
    if (diffMinutes > 720) diffMinutes -= 1440;
    if (diffMinutes < -720) diffMinutes += 1440;

    const diffHours = diffMinutes / 60;
    const roundedDiff = Math.round(diffHours * 2) / 2;
    const diffSign = roundedDiff >= 0 ? '+' : '';
    const timeDiff = roundedDiff === 0 ? 'Same time' : `${diffSign}${roundedDiff}h`;

    return { time, period, dateStr, timeDiff, isDay };
  } catch {
    const { time, period } = formatDigitalTime(date, is24Hour, false);
    return {
      time,
      period,
      dateStr: 'Today',
      timeDiff: 'Same time',
      isDay: true,
    };
  }
};

export const formatStopwatchTime = (ms: number): { main: string; msPart: string } => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((ms % 1000) / 10);

  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');
  const msStr = String(hundredths).padStart(2, '0');

  return {
    main: `${minStr}:${secStr}`,
    msPart: `.${msStr}`,
  };
};

export const formatTimerSeconds = (totalSec: number): string => {
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
