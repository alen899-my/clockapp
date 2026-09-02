import { API_BASE_URL } from '@/config/api';
import { AuthResponse, LoginCredentials, SignupCredentials, User } from './types';

const AUTH_ENDPOINT = `${API_BASE_URL}/api/auth`;

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json?.error?.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    return json;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Network request timed out. Please check your connection.');
    }
    throw err;
  }
}

export const authApi = {
  /**
   * Register a new user account
   */
  async signup(credentials: SignupCredentials): Promise<{ user: User; token: string }> {
    const res = await request<AuthResponse>(`${AUTH_ENDPOINT}/signup`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return res.data;
  },

  /**
   * Log into existing account
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const res = await request<AuthResponse>(`${AUTH_ENDPOINT}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return res.data;
  },

  /**
   * Get current user profile with token
   */
  async getProfile(token: string): Promise<User> {
    const res = await request<{ success: boolean; data: { user: User } }>(`${AUTH_ENDPOINT}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.user;
  },
};
