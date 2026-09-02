import { API_BASE_URL } from '@/config/api';
import { TimelineItem } from '@/features/timeline/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMELINE_ENDPOINT = `${API_BASE_URL}/api/timeline`;
const TOKEN_STORAGE_KEY = '@clock_app_auth_token_v1';

// Retrieve the stored JWT token
async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch (_) {}
  return {};
}

// Helper for HTTP requests with timeout + auth header
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  const authHeader = await getAuthHeader();

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Network request timed out');
    }
    throw err;
  }
}

export const timelineApi = {
  /**
   * Fetch all timeline items for the authenticated user
   */
  async getAll(): Promise<TimelineItem[]> {
    const res = await request<{ success: boolean; data: TimelineItem[] }>(TIMELINE_ENDPOINT);
    return res.data;
  },

  /**
   * Create a single timeline item
   */
  async create(itemData: Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'> & { id?: string }): Promise<TimelineItem> {
    const res = await request<{ success: boolean; data: TimelineItem }>(TIMELINE_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
    return res.data;
  },

  /**
   * Batch create multiple items (e.g. for templates)
   */
  async createBatch(items: (Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'> & { id?: string })[]): Promise<TimelineItem[]> {
    const res = await request<{ success: boolean; data: TimelineItem[] }>(`${TIMELINE_ENDPOINT}/batch`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    return res.data;
  },

  /**
   * Update an existing timeline item
   */
  async update(id: string, updates: Partial<TimelineItem>): Promise<TimelineItem> {
    const res = await request<{ success: boolean; data: TimelineItem }>(`${TIMELINE_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  /**
   * Toggle completed date status
   */
  async toggleComplete(id: string, dateIso: string): Promise<TimelineItem> {
    const res = await request<{ success: boolean; data: TimelineItem }>(`${TIMELINE_ENDPOINT}/${id}/toggle-complete`, {
      method: 'PATCH',
      body: JSON.stringify({ date: dateIso }),
    });
    return res.data;
  },

  /**
   * Delete a timeline item
   */
  async delete(id: string): Promise<void> {
    await request<{ success: boolean }>(`${TIMELINE_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Replace today's items
   */
  async replaceToday(dateIso: string, items: (Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'> & { id?: string })[]): Promise<TimelineItem[]> {
    const res = await request<{ success: boolean; data: TimelineItem[] }>(`${TIMELINE_ENDPOINT}/replace-today`, {
      method: 'PUT',
      body: JSON.stringify({ date: dateIso, items }),
    });
    return res.data;
  },
};
