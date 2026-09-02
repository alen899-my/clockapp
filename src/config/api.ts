import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Resolves the API Base URL from Environment Variables (.env)
 * 
 * Deployment:
 * - Set EXPO_PUBLIC_API_URL in .env (e.g. EXPO_PUBLIC_API_URL=https://api.yourdomain.com)
 * - The app will automatically connect to this URL without modifying any code.
 * 
 * Local Development:
 * - If EXPO_PUBLIC_API_URL is empty, it uses EXPO_PUBLIC_API_PORT from .env (default: 5005)
 * - Auto-detects your PC's LAN IP when running on a physical phone via Expo.
 */
export function getApiBaseUrl(): string {
  // 1. Explicit environment variable (Production / Preview / Custom API URL)
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envApiUrl) {
    return envApiUrl.replace(/\/+$/, '');
  }

  // 2. Read local development port from env (fallback: 5005)
  const envPort = process.env.EXPO_PUBLIC_API_PORT?.trim() || '5005';

  // 3. Web browser environment
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      const hostname = window.location.hostname;
      return `http://${hostname}:${envPort}`;
    }
    return `http://localhost:${envPort}`;
  }

  // 4. Native (Android / iOS) - Extract development machine LAN IP from Expo host
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost || (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) {
      return `http://${ip}:${envPort}`;
    }
  }

  // 5. Android Emulator fallback (10.0.2.2 maps to host PC localhost)
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${envPort}`;
  }

  // 6. iOS Simulator fallback
  return `http://localhost:${envPort}`;
}

export const API_BASE_URL = getApiBaseUrl();

console.log(`[API Config] Resolved API Base URL: ${API_BASE_URL}`);
