export type LoginResponse = {
  user: { id: string; name: string; email: string; phone?: string };
  token: string;
};

const BASE = '/api';

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const raw = await res.text();
    let message = `Request failed: ${res.status}`;
    try {
      const data = JSON.parse(raw);
      if (data?.message) message = data.message;
    } catch {
      if (raw) message = raw;
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export const api = {
  register: (data: { name: string; email: string; phone?: string; password: string }) =>
    http<LoginResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    http<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getItems: () => http<any[]>('/items'),

  createItem: (data: {
    name: string;
    category: string;
    description: string;
    location: string;
    date: string;
    contactDetails: string;
    image?: string;
    userId: string;
    type: 'lost' | 'found';
  }) => http<{ id: string }>('/items', { method: 'POST', body: JSON.stringify(data) }),

  getClaims: () => http<any[]>('/claims'),

  createClaim: (data: { itemId: string; claimantId: string; details: string }) =>
    http<{ id: string }>('/claims', { method: 'POST', body: JSON.stringify(data) }),

  updateClaimStatus: (id: string, status: 'pending' | 'accepted' | 'rejected') =>
    http<{ id: string; status: string }>(`/claims/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  deleteItem: (id: string) => http<{ ok: boolean }>(`/items/${id}`, { method: 'DELETE' }),
  deleteItemPost: (id: string) => http<{ ok: boolean }>(`/items/${id}/delete`, { method: 'POST' }),
};


