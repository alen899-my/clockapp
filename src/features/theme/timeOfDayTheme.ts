import { ImageSourcePropType } from 'react-native';

export interface TimeOfDayInfo {
  key: string;
  name: string;
  subtitle: string;
  image: ImageSourcePropType;
  overlayGradient: [string, string, string];
  blurIntensity: number;
}

const TIME_THEME_IMAGES = {
  '12am-4am': require('@/assets/images/themes/12am-4am.png'),
  '4am-6am': require('@/assets/images/themes/4am-6am.png'),
  '6am-8am': require('@/assets/images/themes/6am-8am.png'),
  '8am-11am': require('@/assets/images/themes/8am-11am.png'),
  '11am-1pm': require('@/assets/images/themes/11am-1pm.png'),
  '1pm-3pm': require('@/assets/images/themes/1pm-3pm.png'),
  '3pm-5pm': require('@/assets/images/themes/3pm-5pm.png'),
  '5pm-630pm': require('@/assets/images/themes/5pm-630pm.png'),
  '630pm-715pm': require('@/assets/images/themes/630pm-715pm.png'),
  '730pm-9pm': require('@/assets/images/themes/730pm-9pm.png'),
  '9pm-12am': require('@/assets/images/themes/9pm-12a,.png'),
};

export const getTimeOfDayTheme = (date: Date): TimeOfDayInfo => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // 12am - 4am (00:00 - 04:00)
  if (totalMinutes < 240) {
    return {
      key: '12am-4am',
      name: 'Midnight Calm',
      subtitle: '12:00 AM — 04:00 AM',
      image: TIME_THEME_IMAGES['12am-4am'],
      overlayGradient: ['rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0.50)', 'rgba(0, 0, 0, 0.85)'],
      blurIntensity: 18,
    };
  }

  // 4am - 6am (04:00 - 06:00)
  if (totalMinutes < 360) {
    return {
      key: '4am-6am',
      name: 'Dawn Twilight',
      subtitle: '04:00 AM — 06:00 AM',
      image: TIME_THEME_IMAGES['4am-6am'],
      overlayGradient: ['rgba(0, 0, 0, 0.20)', 'rgba(0, 0, 0, 0.45)', 'rgba(0, 0, 0, 0.82)'],
      blurIntensity: 16,
    };
  }

  // 6am - 8am (06:00 - 08:00)
  if (totalMinutes < 480) {
    return {
      key: '6am-8am',
      name: 'Golden Sunrise',
      subtitle: '06:00 AM — 08:00 AM',
      image: TIME_THEME_IMAGES['6am-8am'],
      overlayGradient: ['rgba(0, 0, 0, 0.18)', 'rgba(0, 0, 0, 0.42)', 'rgba(0, 0, 0, 0.80)'],
      blurIntensity: 16,
    };
  }

  // 8am - 11am (08:00 - 11:00)
  if (totalMinutes < 660) {
    return {
      key: '8am-11am',
      name: 'Morning Radiance',
      subtitle: '08:00 AM — 11:00 AM',
      image: TIME_THEME_IMAGES['8am-11am'],
      overlayGradient: ['rgba(0, 0, 0, 0.18)', 'rgba(0, 0, 0, 0.42)', 'rgba(0, 0, 0, 0.80)'],
      blurIntensity: 16,
    };
  }

  // 11am - 1pm (11:00 - 13:00)
  if (totalMinutes < 780) {
    return {
      key: '11am-1pm',
      name: 'High Noon',
      subtitle: '11:00 AM — 01:00 PM',
      image: TIME_THEME_IMAGES['11am-1pm'],
      overlayGradient: ['rgba(0, 0, 0, 0.18)', 'rgba(0, 0, 0, 0.42)', 'rgba(0, 0, 0, 0.80)'],
      blurIntensity: 16,
    };
  }

  // 1pm - 3pm (13:00 - 15:00)
  if (totalMinutes < 900) {
    return {
      key: '1pm-3pm',
      name: 'Afternoon Sun',
      subtitle: '01:00 PM — 03:00 PM',
      image: TIME_THEME_IMAGES['1pm-3pm'],
      overlayGradient: ['rgba(0, 0, 0, 0.18)', 'rgba(0, 0, 0, 0.42)', 'rgba(0, 0, 0, 0.80)'],
      blurIntensity: 16,
    };
  }

  // 3pm - 5pm (15:00 - 17:00)
  if (totalMinutes < 1020) {
    return {
      key: '3pm-5pm',
      name: 'Warm Daylight',
      subtitle: '03:00 PM — 05:00 PM',
      image: TIME_THEME_IMAGES['3pm-5pm'],
      overlayGradient: ['rgba(0, 0, 0, 0.18)', 'rgba(0, 0, 0, 0.42)', 'rgba(0, 0, 0, 0.80)'],
      blurIntensity: 16,
    };
  }

  // 5pm - 6:30pm (17:00 - 18:30)
  if (totalMinutes < 1110) {
    return {
      key: '5pm-630pm',
      name: 'Sunset Twilight',
      subtitle: '05:00 PM — 06:30 PM',
      image: TIME_THEME_IMAGES['5pm-630pm'],
      overlayGradient: ['rgba(0, 0, 0, 0.20)', 'rgba(0, 0, 0, 0.45)', 'rgba(0, 0, 0, 0.82)'],
      blurIntensity: 16,
    };
  }

  // 6:30pm - 7:15pm (18:30 - 19:15)
  if (totalMinutes < 1155) {
    return {
      key: '630pm-715pm',
      name: 'Magic Blue Hour',
      subtitle: '06:30 PM — 07:15 PM',
      image: TIME_THEME_IMAGES['630pm-715pm'],
      overlayGradient: ['rgba(0, 0, 0, 0.22)', 'rgba(0, 0, 0, 0.48)', 'rgba(0, 0, 0, 0.84)'],
      blurIntensity: 18,
    };
  }

  // 7:30pm - 9pm (19:15 - 21:00)
  if (totalMinutes < 1260) {
    return {
      key: '730pm-9pm',
      name: 'Evening Glow',
      subtitle: '07:15 PM — 09:00 PM',
      image: TIME_THEME_IMAGES['730pm-9pm'],
      overlayGradient: ['rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0.50)', 'rgba(0, 0, 0, 0.86)'],
      blurIntensity: 18,
    };
  }

  // 9pm - 12am (21:00 - 24:00)
  return {
    key: '9pm-12am',
    name: 'Night Sky',
    subtitle: '09:00 PM — 12:00 AM',
    image: TIME_THEME_IMAGES['9pm-12am'],
    overlayGradient: ['rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0.55)', 'rgba(0, 0, 0, 0.88)'],
    blurIntensity: 18,
  };
};
