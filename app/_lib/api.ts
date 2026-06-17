import {
  User,
  Subscription,
  Deck,
  Card,
  CardInput,
  Upload,
  DashboardStats,
  Insight,
  ReviewQueue,
  CheckoutResponse,
  TransactionVerify,
  APIKeyResponse,
  Rating,
  SessionSummary,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === 'string') msg = d;
      else if (Array.isArray(d)) msg = d.map((e: { msg: string }) => e.msg).join(', ');
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return {} as T;
  }

  return res.json();
}

export const authApi = {
  register: async (email: string, password: string, display_name?: string) =>
    apiFetch<{ status: string; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name }),
    }),

  login: async (email: string, password: string) =>
    apiFetch<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: async () =>
    apiFetch<{ status: string }>('/api/auth/logout', { method: 'POST' }),

  me: async () => apiFetch<User>('/api/auth/me'),

  subscription: async () =>
    apiFetch<Subscription>('/api/auth/subscription'),

  verifyEmail: async (token: string) =>
    apiFetch<{ status: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendVerification: async (email: string) =>
    apiFetch<{ status: string }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export const uploadApi = {
  upload: async (formData: FormData) => {
    const res = await fetch(`${API_URL}/api/uploads`, {
      credentials: 'include',
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },

  getStatus: async (uploadId: string) =>
    apiFetch<Upload>(`/api/uploads/${uploadId}/status`),

  getPreview: async (uploadId: string) =>
    apiFetch<{ cards: Upload['preview_cards'] }>(`/api/uploads/${uploadId}/preview`),
};

export const deckApi = {
  create: async (name: string, subject_tag?: string, cards?: CardInput[], upload_id?: string) =>
    apiFetch<Deck>('/api/decks', {
      method: 'POST',
      body: JSON.stringify({ name, subject_tag, cards, upload_id }),
    }),

  list: async () => apiFetch<Deck[]>('/api/decks'),

  get: async (deckId: string) => apiFetch<Deck>(`/api/decks/${deckId}`),

  update: async (deckId: string, data: { name?: string; subject_tag?: string }) =>
    apiFetch<Deck>(`/api/decks/${deckId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: async (deckId: string) =>
    apiFetch<{ status: string }>(`/api/decks/${deckId}`, { method: 'DELETE' }),
};

export const cardApi = {
  update: async (cardId: string, data: { front?: string; back?: string; topic_tag?: string }) =>
    apiFetch<Card>(`/api/cards/${cardId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: async (cardId: string) =>
    apiFetch<{ status: string }>(`/api/cards/${cardId}`, { method: 'DELETE' }),
};

export const reviewApi = {
  getQueue: async () => apiFetch<ReviewQueue>('/api/review/queue'),

  rate: async (cardId: string, rating: Rating) =>
    apiFetch<{ status: string; next_review_at: string }>('/api/review/rate', {
      method: 'POST',
      body: JSON.stringify({ card_id: cardId, rating }),
    }),

  startSession: async (deckId?: string) =>
    apiFetch<{ session_id: string }>(`/api/review/session/start${deckId ? `?deck_id=${deckId}` : ''}`, {
      method: 'POST',
    }),

  endSession: async (sessionId: string, cardsReviewed: number, newCards: number, retentionDelta?: number) =>
    apiFetch<SessionSummary>('/api/review/session/end', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        cards_reviewed: cardsReviewed,
        new_cards: newCards,
        retention_delta: retentionDelta,
      }),
    }),
};

export const dashboardApi = {
  getStats: async () => apiFetch<DashboardStats>('/api/dashboard/stats'),
};

export const insightsApi = {
  get: async () => apiFetch<Insight>('/api/insights'),
};

export const paddleApi = {
  checkout: async (tier: string, billingInterval: string) =>
    apiFetch<CheckoutResponse>('/api/paddle/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier, billing_interval: billingInterval }),
    }),

  verifyTransaction: async (transactionId: string) =>
    apiFetch<TransactionVerify>('/api/paddle/verify-transaction', {
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    }),

  getPortalUrl: async () =>
    apiFetch<{ url: string }>('/api/paddle/portal-url'),
};

export const settingsApi = {
  getApiKey: async () => apiFetch<APIKeyResponse>('/api/settings/apikey'),

  setApiKey: async (apiKey: string) =>
    apiFetch<APIKeyResponse>('/api/settings/apikey', {
      method: 'POST',
      body: JSON.stringify({ api_key: apiKey }),
    }),

  deleteApiKey: async () =>
    apiFetch<{ status: string }>('/api/settings/apikey', { method: 'DELETE' }),

  getSubscription: async () =>
    apiFetch<Subscription>('/api/settings/subscription'),

  deleteAccount: async () =>
    apiFetch<{ status: string }>('/api/settings/users/me', { method: 'DELETE' }),
};