import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MessageSquare, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  X,
  Send,
  RefreshCw,
  Star
} from 'lucide-react';
import { FootwearItem, ChatMessage } from '../../types';
import { api } from '../../lib/api';

interface BrandDemoStoreProps {
  shoes: FootwearItem[];
  onOpenWhatsApp: () => void;
}

export const BrandDemoStore: React.FC<BrandDemoStoreProps> = ({
  shoes,
  onOpenWhatsApp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeShoe, setActiveShoe] = useState<FootwearItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  // Floating Chat Widget state
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [widgetMessages, setWidgetMessages] = useState<ChatMessage[]>([
    {
      id: 'w-1',
      sender: 'assistant',
      text: 'Hey! Welcome to KicksCraft India. Looking for daily sneakers, loafers, or recovery slides? Ask me about sizes, fit, or COD!',
      timestamp: 'Just now',
    }
  ]);
  const [widgetInput, setWidgetInput] = useState('');
  const [isWidgetLoading, setIsWidgetLoading] = useState(false);

  const categories = [
    { label: 'All Silhouettes', value: 'all' },
    { label: 'Sneakers', value: 'sneakers' },
    { label: 'Penny Loafers', value: 'loafers' },
    { label: 'Chelsea Boots', value: 'boots' },
    { label: 'Cloud Slides', value: 'slides' },
  ];

  const filteredShoes = shoes.filter(s => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const handleWidgetSend = async (customText?: string) => {
    const text = customText || widgetInput;
    if (!text.trim() || isWidgetLoading) return;

    const userMsg: ChatMessage = {
      id: `w-u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setWidgetMessages(prev => [...prev, userMsg]);
    setWidgetInput('');
    setIsWidgetLoading(true);

    try {
      const resp = await api.sendMessage({
        message: text,
        channel: 'website',
        customerName: 'Storefront Visitor',
      });

      const assistantMsg: ChatMessage = {
        id: `w-a-${Date.now()}`,
        sender: 'assistant',
        text: resp.replyText,
        timestamp: 'Just now',
        recommendedProducts: resp.recommendedProducts,
        actionType: resp.actionType as any,
        actionData: resp.actionData,
      };

      setWidgetMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsWidgetLoading(false);
    }
  };

  const handleAskFitForShoe = (shoe: FootwearItem) => {
    setIsWidgetOpen(true);
    handleWidgetSend(`What is the sizing and fit advice for ${shoe.name}?`);
  };

  const handleOrderDirect = (shoe: FootwearItem, size: number) => {
    setCheckoutSuccess(`🎉 Order placed for ${shoe.name} (UK ${size})! SoleAI is sending your WhatsApp COD confirmation link.`);
    setTimeout(() => setCheckoutSuccess(null), 5000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Store Header & Promo Bar */}
      <div className="bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="px-6 py-3 bg-amber-600/90 text-white text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Monsoon Collection Live • Handcrafted in Mumbai • 100% Free Doorstep Size Exchanges</span>
          </div>
          <button
            onClick={onOpenWhatsApp}
            className="underline hover:text-amber-100 hidden sm:block text-[11px]"
          >
            Order via WhatsApp Assistant →
          </button>
        </div>

        {/* Hero Section */}
        <div className="p-8 sm:p-12 relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              KicksCraft India D2C Store
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
              Timeless Soles, <br /><span className="text-amber-400">Zero Fit Anxiety.</span>
            </h1>
            <p className="text-stone-300 text-sm leading-relaxed">
              Every pair is handcrafted with full-grain leathers and high-rebound cushioning. Our built-in SoleAI assistant guides your UK size so you never deal with wrong-size returns.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const target = document.getElementById('catalogue-section');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-900/30 transition-all flex items-center gap-2"
              >
                <span>Browse Footwear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsWidgetOpen(true)}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ask SoleAI Sizing Bot</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80"
              alt="Hero Shoe"
              className="w-72 sm:w-80 h-72 sm:h-80 object-cover rounded-3xl border-2 border-stone-800 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-300"
            />
            <div className="absolute -bottom-4 -left-4 bg-stone-900/90 backdrop-blur-md border border-stone-700 p-3 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">COD Available Pan-India</p>
                <p className="text-stone-400 text-[11px]">Free 7-Day Doorstep Replacement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-2xl flex items-center space-x-3">
          <Truck className="w-6 h-6 text-amber-400 flex-shrink-0" />
          <div className="text-xs">
            <h4 className="font-bold text-white">Dispatched in 24 Hours</h4>
            <p className="text-stone-400">Express delivery to 19,000+ Indian pincodes</p>
          </div>
        </div>

        <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-2xl flex items-center space-x-3">
          <RotateCcw className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <h4 className="font-bold text-white">100% Free Size Swap</h4>
            <p className="text-stone-400">Our rider picks up the old pair and delivers your new size</p>
          </div>
        </div>

        <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-2xl flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-cyan-400 flex-shrink-0" />
          <div className="text-xs">
            <h4 className="font-bold text-white">AI Fit Sizing Guarantee</h4>
            <p className="text-stone-400">SoleAI analyzes your usual sneaker size for the ideal fit</p>
          </div>
        </div>
      </div>

      {checkoutSuccess && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-700 rounded-2xl text-xs text-emerald-200 flex items-center justify-between shadow-xl animate-fadeIn">
          <span>{checkoutSuccess}</span>
          <button onClick={() => setCheckoutSuccess(null)} className="text-emerald-400 font-bold">✕</button>
        </div>
      )}

      {/* Catalogue Filter Section */}
      <div id="catalogue-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Handcrafted Footwear Lineup</h2>
            <p className="text-xs text-stone-400">Click any shoe to test live sizing advice with SoleAI.</p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shoes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredShoes.map(shoe => {
            const isFeatured = shoe.featured;

            return (
              <div
                key={shoe.id}
                className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-sm hover:border-amber-600/40 transition-all flex flex-col justify-between group"
              >
                <div className="relative">
                  <img
                    src={shoe.imageUrl}
                    alt={shoe.name}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {shoe.isBestSeller && (
                    <span className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-md">
                      Best Seller
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-md text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-stone-700">
                    UK 6-11
                  </span>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-stone-400 tracking-wider">
                        {shoe.category}
                      </span>
                      <div className="flex items-center text-amber-400 text-[10px]">
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> 4.9 (128)
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                      {shoe.name}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">{shoe.tagline}</p>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-white font-mono">₹{shoe.priceINR}</span>
                      {shoe.originalPriceINR && (
                        <span className="text-xs text-stone-500 line-through font-mono">₹{shoe.originalPriceINR}</span>
                      )}
                    </div>
                  </div>

                  {/* Sizing Fit Badge */}
                  <div className="pt-2 border-t border-stone-800/80">
                    <p className="text-[11px] text-stone-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span className="line-clamp-1">{shoe.fitGuidance}</span>
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handleAskFitForShoe(shoe)}
                        className="flex-1 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3 text-amber-400" /> Ask Fit
                      </button>
                      <button
                        onClick={() => handleOrderDirect(shoe, 8)}
                        className="py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                        title="Simulate Instant Checkout"
                      >
                        Buy COD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating SoleAI Widget Icon */}
      {!isWidgetOpen && (
        <button
          onClick={() => setIsWidgetOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 border-2 border-amber-300/40"
        >
          <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
          <span className="text-xs font-bold font-heading pr-1">Ask SoleAI (Size & COD)</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      )}

      {/* Floating SoleAI Chat Widget Modal */}
      {isWidgetOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] bg-stone-900 border border-stone-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/80 p-4 border-b border-stone-800 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-heading flex items-center gap-1.5">
                  SoleAI Footwear Assistant
                </h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online • English & Hinglish
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsWidgetOpen(false)}
              className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-stone-950/60">
            {widgetMessages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-amber-600 text-white rounded-tr-none'
                        : 'bg-stone-800 text-stone-200 border border-stone-700/80 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-2 space-y-2 max-w-[90%]">
                      {msg.recommendedProducts.map(p => (
                        <div key={p.id} className="bg-stone-900 border border-stone-800 p-2 rounded-xl flex items-center space-x-2">
                          <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="text-xs flex-1 min-w-0">
                            <p className="font-bold text-white line-clamp-1">{p.name}</p>
                            <p className="text-[11px] text-amber-400">₹{p.priceINR} • {p.fitGuidance}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isWidgetLoading && (
              <div className="flex items-center space-x-2 text-stone-400 text-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Checking size chart & live stock...</span>
              </div>
            )}
          </div>

          {/* Quick chip queries */}
          <div className="px-3 py-1.5 bg-stone-950 border-t border-stone-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleWidgetSend("Bhai Street Retro ka size 9 aayega kya?")}
              className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md whitespace-nowrap"
            >
              👟 Size 9 Stock?
            </button>
            <button
              onClick={() => handleWidgetSend("Is Cash on delivery available in Delhi?")}
              className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md whitespace-nowrap"
            >
              💵 COD Available?
            </button>
            <button
              onClick={() => handleWidgetSend("What is the return and exchange policy?")}
              className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md whitespace-nowrap"
            >
              🔄 Free Exchange?
            </button>
          </div>

          {/* Input */}
          <div className="p-2.5 bg-stone-900 border-t border-stone-800 flex items-center gap-1.5">
            <input
              type="text"
              value={widgetInput}
              onChange={e => setWidgetInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleWidgetSend()}
              placeholder="Ask about size, fit, COD..."
              className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => handleWidgetSend()}
              disabled={!widgetInput.trim() || isWidgetLoading}
              className="p-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
