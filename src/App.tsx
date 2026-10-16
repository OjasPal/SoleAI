import React, { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { SurfaceView, DashboardTab } from './components/layout/Sidebar';
import { OverviewSection } from './components/dashboard/OverviewSection';
import { NeedsYouSection } from './components/dashboard/NeedsYouSection';
import { CatalogueSection } from './components/dashboard/CatalogueSection';
import { OrdersSection } from './components/dashboard/OrdersSection';
import { KnowledgeSection } from './components/dashboard/KnowledgeSection';
import { WhatsAppSimulator } from './components/CustomerSimulator/WhatsAppSimulator';
import { BrandDemoStore } from './components/CustomerSimulator/BrandDemoStore';
import { FootwearItem, Order, Conversation, UnansweredQuestion, BrandSettings, DashboardMetrics } from './types';
import { api } from './lib/api';
import { 
  INITIAL_SHOES, 
  INITIAL_BRAND_SETTINGS, 
  INITIAL_ORDERS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_UNANSWERED_QUESTIONS, 
  INITIAL_METRICS 
} from './data/mockData';

export const App: React.FC = () => {
  const [surface, setSurface] = useState<SurfaceView>('dashboard');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined);

  // Core Data Stores
  const [shoes, setShoes] = useState<FootwearItem[]>(INITIAL_SHOES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [unansweredQuestions, setUnansweredQuestions] = useState<UnansweredQuestion[]>(INITIAL_UNANSWERED_QUESTIONS);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(INITIAL_BRAND_SETTINGS);
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);

  const refreshData = async () => {
    try {
      const [shoesData, ordersData, convsData, uqData, settingsData, metricsData] = await Promise.all([
        api.getShoes(),
        api.getOrders(),
        api.getConversations(),
        api.getUnansweredQuestions(),
        api.getBrandSettings(),
        api.getMetrics(),
      ]);
      if (shoesData) setShoes(shoesData);
      if (ordersData) setOrders(ordersData);
      if (convsData) setConversations(convsData);
      if (uqData) setUnansweredQuestions(uqData);
      if (settingsData) setBrandSettings(settingsData);
      if (metricsData) setMetrics(metricsData);
    } catch (err) {
      console.warn('Backend sync warning, fallback active:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers for Merchant Actions
  const handleReplyConversation = async (conversationId: string, text: string) => {
    try {
      const updated = await api.replyToConversation(conversationId, text);
      setConversations(prev => prev.map(c => c.id === conversationId ? updated : c));
    } catch {
      setConversations(prev => prev.map(c => c.id === conversationId ? {
        ...c,
        lastMessageSnippet: text,
        messages: [...c.messages, { id: `m-${Date.now()}`, sender: 'merchant', text, timestamp: 'Just now' }]
      } : c));
    }
  };

  const handleResolveConversation = async (conversationId: string) => {
    try {
      const updated = await api.resolveConversation(conversationId);
      setConversations(prev => prev.map(c => c.id === conversationId ? updated : c));
      setMetrics(prev => ({ ...prev, needsYouCount: Math.max(0, prev.needsYouCount - 1) }));
    } catch {
      setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, status: 'resolved' } : c));
    }
  };

  const handleUpdateStock = async (shoeId: string, sizeUK: number, newStock: number) => {
    try {
      const updated = await api.updateStock(shoeId, sizeUK, newStock);
      setShoes(prev => prev.map(s => s.id === shoeId ? updated : s));
    } catch {
      setShoes(prev => prev.map(s => s.id === shoeId ? {
        ...s,
        sizes: s.sizes.map(sz => sz.sizeUK === sizeUK ? { ...sz, stock: newStock, inStock: newStock > 0 } : sz)
      } : s));
    }
  };

  const handleUpdateShoe = async (shoeId: string, data: Partial<FootwearItem>) => {
    try {
      const updated = await api.updateShoe(shoeId, data);
      setShoes(prev => prev.map(s => s.id === shoeId ? updated : s));
    } catch {
      setShoes(prev => prev.map(s => s.id === shoeId ? { ...s, ...data } : s));
    }
  };

  const handleConfirmCod = async (orderId: string) => {
    try {
      const updated = await api.confirmCod(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setMetrics(prev => ({ ...prev, codOrdersConfirmed: prev.codOrdersConfirmed + 1 }));
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, codStatus: 'verified_by_shopper' } : o));
    }
  };

  const handleCancelCod = async (orderId: string) => {
    try {
      const updated = await api.cancelCod(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setMetrics(prev => ({
        ...prev,
        codRtoPreventedCount: prev.codRtoPreventedCount + 1,
        estimatedRtoSavingsINR: prev.estimatedRtoSavingsINR + 400
      }));
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, codStatus: 'cancelled_prevented_rto' } : o));
    }
  };

  const handleAddToFaq = async (questionId: string, answer: string) => {
    try {
      const updated = await api.addQuestionToFaq(questionId, answer);
      setUnansweredQuestions(prev => prev.map(q => q.id === questionId ? updated : q));
    } catch {
      setUnansweredQuestions(prev => prev.map(q => q.id === questionId ? { ...q, status: 'added_to_faq', suggestedAnswer: answer } : q));
    }
  };

  const handleUpdateBrandSettings = async (newSettings: Partial<BrandSettings>) => {
    try {
      const updated = await api.updateBrandSettings(newSettings);
      setBrandSettings(updated);
    } catch {
      setBrandSettings(prev => ({ ...prev, ...newSettings }));
    }
  };

  const handleTakeOverChat = (convId: string) => {
    setSelectedConversationId(convId);
    setDashboardTab('needs-you');
  };

  const needsYouCount = conversations.filter(c => c.status === 'needs_merchant').length;

  return (
    <AppShell
      surface={surface}
      dashboardTab={dashboardTab}
      onSelectSurface={setSurface}
      onSelectDashboardTab={setDashboardTab}
      needsYouCount={needsYouCount}
    >
      {surface === 'dashboard' && (
        <>
          {dashboardTab === 'overview' && (
            <OverviewSection
              metrics={metrics}
              orders={orders}
              conversations={conversations}
              shoes={shoes}
              unansweredQuestions={unansweredQuestions}
              onNavigateTab={setDashboardTab}
              onTakeOverChat={handleTakeOverChat}
              onConfirmCod={handleConfirmCod}
            />
          )}

          {dashboardTab === 'needs-you' && (
            <NeedsYouSection
              conversations={conversations}
              selectedId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
              onReply={handleReplyConversation}
              onResolve={handleResolveConversation}
            />
          )}

          {dashboardTab === 'catalogue' && (
            <CatalogueSection
              shoes={shoes}
              onUpdateStock={handleUpdateStock}
              onUpdateShoe={handleUpdateShoe}
            />
          )}

          {dashboardTab === 'orders' && (
            <OrdersSection
              orders={orders}
              onConfirmCod={handleConfirmCod}
              onCancelCod={handleCancelCod}
            />
          )}

          {dashboardTab === 'knowledge' && (
            <KnowledgeSection
              brandSettings={brandSettings}
              unansweredQuestions={unansweredQuestions}
              onUpdateBrandSettings={handleUpdateBrandSettings}
              onAddToFaq={handleAddToFaq}
            />
          )}
        </>
      )}

      {surface === 'whatsapp' && (
        <WhatsAppSimulator
          initialShoes={shoes}
          onOrderInfluenced={() => {
            setMetrics(prev => ({
              ...prev,
              ordersInfluencedCount: prev.ordersInfluencedCount + 1,
              ordersInfluencedRevenueINR: prev.ordersInfluencedRevenueINR + 3499,
            }));
          }}
        />
      )}

      {surface === 'storefront' && (
        <BrandDemoStore
          shoes={shoes}
          brandSettings={brandSettings}
          onOpenWhatsApp={() => setSurface('whatsapp')}
        />
      )}
    </AppShell>
  );
};

export default App;
