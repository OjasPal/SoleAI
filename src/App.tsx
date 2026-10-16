import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewTab } from './components/Dashboard/OverviewTab';
import { NeedsYouQueue } from './components/Dashboard/NeedsYouQueue';
import { CatalogueManager } from './components/Dashboard/CatalogueManager';
import { OrdersTracker } from './components/Dashboard/OrdersTracker';
import { KnowledgeBase } from './components/Dashboard/KnowledgeBase';
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
  const [activeView, setActiveView] = useState<'dashboard' | 'whatsapp' | 'storefront'>('dashboard');
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'needs-you' | 'catalogue' | 'orders' | 'knowledge'>('overview');

  // Application State
  const [shoes, setShoes] = useState<FootwearItem[]>(INITIAL_SHOES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [unansweredQuestions, setUnansweredQuestions] = useState<UnansweredQuestion[]>(INITIAL_UNANSWERED_QUESTIONS);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(INITIAL_BRAND_SETTINGS);
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from backend API
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
      console.warn('API sync warning (using local fallback store):', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers
  const handleReplyConversation = async (conversationId: string, text: string) => {
    try {
      const updated = await api.replyToConversation(conversationId, text);
      setConversations(prev => prev.map(c => c.id === conversationId ? updated : c));
    } catch {
      // Local fallback
      setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessageSnippet: text,
            lastUpdated: 'Just now',
            messages: [
              ...c.messages,
              {
                id: `m-${Date.now()}`,
                sender: 'merchant',
                text,
                timestamp: 'Just now',
              }
            ]
          };
        }
        return c;
      }));
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
      setShoes(prev => prev.map(s => {
        if (s.id === shoeId) {
          const sizes = s.sizes.map(sz => sz.sizeUK === sizeUK ? { ...sz, stock: newStock, inStock: newStock > 0 } : sz);
          return { ...s, sizes };
        }
        return s;
      }));
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

  const handleOrderInfluenced = () => {
    setMetrics(prev => ({
      ...prev,
      ordersInfluencedCount: prev.ordersInfluencedCount + 1,
      ordersInfluencedRevenueINR: prev.ordersInfluencedRevenueINR + 3499,
    }));
  };

  const needsYouCount = conversations.filter(c => c.status === 'needs_merchant').length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar
        activeView={activeView}
        dashboardTab={dashboardTab}
        onSelectView={setActiveView}
        onSelectDashboardTab={setDashboardTab}
        needsYouCount={needsYouCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'dashboard' && (
          <>
            {dashboardTab === 'overview' && (
              <OverviewTab
                metrics={metrics}
                orders={orders}
                conversations={conversations}
                onNavigateTab={tab => setDashboardTab(tab)}
                onOpenWhatsApp={() => setActiveView('whatsapp')}
              />
            )}

            {dashboardTab === 'needs-you' && (
              <NeedsYouQueue
                conversations={conversations}
                onReply={handleReplyConversation}
                onResolve={handleResolveConversation}
              />
            )}

            {dashboardTab === 'catalogue' && (
              <CatalogueManager
                shoes={shoes}
                onUpdateStock={handleUpdateStock}
                onUpdateShoe={handleUpdateShoe}
              />
            )}

            {dashboardTab === 'orders' && (
              <OrdersTracker
                orders={orders}
                onConfirmCod={handleConfirmCod}
                onCancelCod={handleCancelCod}
              />
            )}

            {dashboardTab === 'knowledge' && (
              <KnowledgeBase
                unansweredQuestions={unansweredQuestions}
                brandSettings={brandSettings}
                onAddToFaq={handleAddToFaq}
                onUpdateBrandSettings={handleUpdateBrandSettings}
              />
            )}
          </>
        )}

        {activeView === 'whatsapp' && (
          <WhatsAppSimulator
            initialShoes={shoes}
            onOrderInfluenced={handleOrderInfluenced}
          />
        )}

        {activeView === 'storefront' && (
          <BrandDemoStore
            shoes={shoes}
            onOpenWhatsApp={() => setActiveView('whatsapp')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-4 text-center text-xs text-stone-500">
        <p>SoleAI • The AI Sales & Order Assistant for Indian D2C Footwear Brands • "Turn DMs into orders, cut COD returns"</p>
      </footer>
    </div>
  );
};

export default App;
