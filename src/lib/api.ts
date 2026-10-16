import { FootwearItem, Order, Conversation, UnansweredQuestion, BrandSettings, DashboardMetrics, ApiStatus } from '../types';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, `Request to ${url} failed (${res.status}): ${errorText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async getStatus(): Promise<ApiStatus> {
    return request<ApiStatus>('/api/status');
  },

  async getShoes(): Promise<FootwearItem[]> {
    return request<FootwearItem[]>('/api/shoes');
  },

  async updateShoe(id: string, data: Partial<FootwearItem>): Promise<FootwearItem> {
    return request<FootwearItem>(`/api/shoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateStock(id: string, sizeUK: number, stock: number): Promise<FootwearItem> {
    return request<FootwearItem>(`/api/shoes/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sizeUK, stock }),
    });
  },

  async getOrders(): Promise<Order[]> {
    return request<Order[]>('/api/orders');
  },

  async confirmCod(id: string): Promise<Order> {
    return request<Order>(`/api/orders/${id}/confirm-cod`, { method: 'POST' });
  },

  async cancelCod(id: string): Promise<Order> {
    return request<Order>(`/api/orders/${id}/cancel-cod`, { method: 'POST' });
  },

  async getConversations(): Promise<Conversation[]> {
    return request<Conversation[]>('/api/conversations');
  },

  async replyToConversation(id: string, text: string): Promise<Conversation> {
    return request<Conversation>(`/api/conversations/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  },

  async resolveConversation(id: string): Promise<Conversation> {
    return request<Conversation>(`/api/conversations/${id}/resolve`, { method: 'POST' });
  },

  async getUnansweredQuestions(): Promise<UnansweredQuestion[]> {
    return request<UnansweredQuestion[]>('/api/unanswered-questions');
  },

  async addQuestionToFaq(id: string, answer: string): Promise<UnansweredQuestion> {
    return request<UnansweredQuestion>(`/api/unanswered-questions/${id}/add-to-faq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });
  },

  async getBrandSettings(): Promise<BrandSettings> {
    return request<BrandSettings>('/api/brand-settings');
  },

  async updateBrandSettings(settings: Partial<BrandSettings>): Promise<BrandSettings> {
    return request<BrandSettings>('/api/brand-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  },

  async getMetrics(): Promise<DashboardMetrics> {
    return request<DashboardMetrics>('/api/metrics');
  },

  async sendMessage(params: {
    message: string;
    history?: { role: string; text: string }[];
    channel?: 'whatsapp' | 'website' | 'instagram';
    customerName?: string;
    customerPhone?: string;
  }): Promise<{
    replyText: string;
    recommendedProducts: FootwearItem[];
    actionType: string;
    actionData?: any;
    needsHumanHandoff: boolean;
    handoffReason?: string;
    intent: string;
    source: 'gemini' | 'rules';
    latencyMs: number;
  }> {
    const start = performance.now();
    const result = await request<{
      replyText: string;
      recommendedProducts: FootwearItem[];
      actionType: string;
      actionData?: any;
      needsHumanHandoff: boolean;
      handoffReason?: string;
      intent: string;
      source?: 'gemini' | 'rules';
    }>('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const latencyMs = Math.round(performance.now() - start);

    return {
      ...result,
      source: result.source || 'rules',
      latencyMs,
    };
  },
};
