import { FootwearItem, Order, Conversation, UnansweredQuestion, BrandSettings, DashboardMetrics, ChatMessage } from '../types';

export const api = {
  async getShoes(): Promise<FootwearItem[]> {
    const res = await fetch('/api/shoes');
    return res.json();
  },

  async updateShoe(id: string, data: Partial<FootwearItem>): Promise<FootwearItem> {
    const res = await fetch(`/api/shoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateStock(id: string, sizeUK: number, stock: number): Promise<FootwearItem> {
    const res = await fetch(`/api/shoes/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sizeUK, stock }),
    });
    return res.json();
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders');
    return res.json();
  },

  async confirmCod(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/confirm-cod`, { method: 'POST' });
    return res.json();
  },

  async cancelCod(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/cancel-cod`, { method: 'POST' });
    return res.json();
  },

  async getConversations(): Promise<Conversation[]> {
    const res = await fetch('/api/conversations');
    return res.json();
  },

  async replyToConversation(id: string, text: string): Promise<Conversation> {
    const res = await fetch(`/api/conversations/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return res.json();
  },

  async resolveConversation(id: string): Promise<Conversation> {
    const res = await fetch(`/api/conversations/${id}/resolve`, { method: 'POST' });
    return res.json();
  },

  async getUnansweredQuestions(): Promise<UnansweredQuestion[]> {
    const res = await fetch('/api/unanswered-questions');
    return res.json();
  },

  async addQuestionToFaq(id: string, answer: string): Promise<UnansweredQuestion> {
    const res = await fetch(`/api/unanswered-questions/${id}/add-to-faq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });
    return res.json();
  },

  async getBrandSettings(): Promise<BrandSettings> {
    const res = await fetch('/api/brand-settings');
    return res.json();
  },

  async updateBrandSettings(settings: Partial<BrandSettings>): Promise<BrandSettings> {
    const res = await fetch('/api/brand-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  async getMetrics(): Promise<DashboardMetrics> {
    const res = await fetch('/api/metrics');
    return res.json();
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
  }> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },
};
