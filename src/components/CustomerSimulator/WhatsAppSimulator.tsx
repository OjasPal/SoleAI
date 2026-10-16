import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  CheckCheck, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Tag,
  Check,
  AlertTriangle
} from 'lucide-react';
import { FootwearItem, ChatMessage } from '../../types';
import { api } from '../../lib/api';

interface WhatsAppSimulatorProps {
  initialShoes: FootwearItem[];
  onOrderInfluenced?: () => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  initialShoes,
  onOrderInfluenced,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'wa-1',
      sender: 'assistant',
      text: 'Namaste! Welcome to KicksCraft India. I am SoleAI, your personal footwear stylist. Are you looking for sneakers, Chelsea boots, loafers, or cloud slides today?',
      timestamp: '11:00 AM',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedCod, setConfirmedCod] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.sendMessage({
        message: text,
        history: newHistory.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text })),
        channel: 'whatsapp',
        customerName: 'WhatsApp Shopper',
        customerPhone: '+91 98200 45678',
      });

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: response.recommendedProducts,
        actionType: response.actionType as any,
        actionData: response.actionData,
      };

      setMessages(prev => [...prev, assistantMsg]);
      if (onOrderInfluenced && (response.actionType === 'checkout_link' || response.actionType === 'cod_confirmation')) {
        onOrderInfluenced();
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Arre, don\'t worry! All sizes are in stock with free doorstep size exchange. Which UK size do you wear?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCodCard = () => {
    setConfirmedCod('Order KC-8921 confirmed for doorstep delivery in Mumbai!');
    const confirmNotice: ChatMessage = {
      id: `conf-${Date.now()}`,
      sender: 'assistant',
      text: '✅ Shandaar! Your Cash on Delivery order is confirmed. Our Mumbai dispatch team is boxing your pair. BlueDart tracking will be shared on this WhatsApp chat within 12 hours!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, confirmNotice]);
  };

  const testPrompts = [
    'Bhai Astro Low ka size 9 stock mein hai kya?',
    'Delhi mein Cash on delivery available hai?',
    'Mere pair wide hain, Street Retro snug fit hoga kya?',
    'Do you have any discount code?',
    'Need 18 pairs for wedding party in Goa'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-white font-heading">
          WhatsApp Sales & COD Assistant Simulator
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
          In India, over 70% of footwear D2C conversations happen on WhatsApp. Experience how SoleAI answers sizing in Hinglish, provides live stock checks, and confirms COD delivery.
        </p>

        {/* Quick Test Prompt Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          <span className="text-xs font-semibold text-stone-500">Try asking:</span>
          {testPrompts.map(prompt => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-emerald-700/60 rounded-full text-xs transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-2.5 h-2.5 text-emerald-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Realistic Mobile Frame */}
      <div className="max-w-md mx-auto bg-stone-950 rounded-[40px] p-3 shadow-2xl border-4 border-stone-800 relative">
        {/* Notch */}
        <div className="w-36 h-4 bg-stone-800 rounded-b-2xl mx-auto mb-2 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-stone-900 border border-stone-700"></div>
        </div>

        {/* Screen Container */}
        <div className="bg-[#0b141a] rounded-[30px] overflow-hidden h-[600px] flex flex-col border border-stone-800/80">
          {/* WhatsApp Header */}
          <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between text-white border-b border-[#2a3942]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-stone-800 border-2 border-emerald-500 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=150&q=80"
                  alt="KicksCraft"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm">KicksCraft India</span>
                  <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold" title="Verified Business">
                    ✓
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>SoleAI Bot Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-stone-300">
              <Video className="w-4 h-4 cursor-pointer hover:text-white" />
              <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
              <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Messages Background Wallpaper */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0b141a] relative">
            {messages.map(msg => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm shadow-md leading-relaxed relative ${
                      isUser
                        ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                        : 'bg-[#202c33] text-[#d1d7db] rounded-tl-none border border-[#2a3942]'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-stone-400">
                      <span>{msg.timestamp}</span>
                      {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                    </div>
                  </div>

                  {/* Product Recommendation Card attachment if any */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-2 space-y-2 max-w-[85%]">
                      {msg.recommendedProducts.map(shoe => (
                        <div
                          key={shoe.id}
                          className="bg-[#202c33] border border-[#2a3942] rounded-2xl overflow-hidden shadow-lg p-2.5 text-stone-200"
                        >
                          <img
                            src={shoe.imageUrl}
                            alt={shoe.name}
                            className="w-full h-32 object-cover rounded-xl border border-stone-800"
                          />
                          <div className="mt-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-white line-clamp-1">{shoe.name}</span>
                              <span className="text-xs font-extrabold text-emerald-400 font-mono">₹{shoe.priceINR}</span>
                            </div>
                            <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{shoe.tagline}</p>

                            <div className="mt-2 p-1.5 rounded-lg bg-[#111b21] text-[10px] text-amber-300/90 border border-stone-800/80">
                              👟 <strong>Fit Advice:</strong> {shoe.fitGuidance}
                            </div>

                            {/* Size selector buttons */}
                            <div className="mt-2 flex items-center gap-1 overflow-x-auto">
                              <span className="text-[10px] text-stone-400 mr-1 font-mono">Sizes:</span>
                              {shoe.sizes.map(sz => (
                                <button
                                  key={sz.sizeUK}
                                  onClick={() => handleSendMessage(`I would like to order size UK ${sz.sizeUK} in ${shoe.name}`)}
                                  disabled={!sz.inStock}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${
                                    sz.inStock
                                      ? 'bg-[#005c4b] hover:bg-[#007a64] text-white border border-emerald-500/50'
                                      : 'bg-stone-800 text-stone-500 line-through opacity-50 cursor-not-allowed'
                                  }`}
                                >
                                  UK {sz.sizeUK}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 1-Tap COD Confirmation Action Card */}
                  {msg.actionType === 'cod_confirmation' && (
                    <div className="mt-2 max-w-[85%] bg-gradient-to-r from-[#1f302b] to-[#1a2e26] border border-emerald-500/50 rounded-2xl p-3 shadow-lg text-emerald-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">One-Tap COD Order Confirmation</span>
                      </div>
                      <p className="text-[11px] text-stone-300">
                        Please confirm your doorstep delivery to prevent courier returns (RTO). Free 7-day size exchange is guaranteed!
                      </p>
                      <button
                        onClick={handleConfirmCodCard}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" /> Confirm My Order & Address
                      </button>
                    </div>
                  )}

                  {/* Discount Offer Card */}
                  {msg.actionType === 'discount_offer' && (
                    <div className="mt-2 max-w-[85%] bg-gradient-to-r from-amber-950/60 to-stone-900 border border-amber-600/40 rounded-2xl p-3 text-amber-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                        <Tag className="w-3.5 h-3.5" /> 10% Instant Coupon Unlocked!
                      </div>
                      <p className="text-[11px] text-stone-300">
                        Use coupon <strong className="text-amber-400 font-mono">SOLE10</strong> at checkout for 10% off your handcrafted pair.
                      </p>
                    </div>
                  )}

                  {/* Handoff escalation notification */}
                  {msg.actionType === 'human_handoff' && (
                    <div className="mt-2 max-w-[85%] bg-red-950/60 border border-red-700/50 rounded-2xl p-3 text-red-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-red-300">
                        <AlertTriangle className="w-3.5 h-3.5" /> Founder Escalation
                      </div>
                      <p className="text-[11px] text-stone-300">
                        KicksCraft founder has been notified on their dashboard and will reply directly in this chat!
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center space-x-2 bg-[#202c33] border border-[#2a3942] rounded-2xl rounded-tl-none px-4 py-2 text-stone-400 text-xs w-fit">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>SoleAI is checking size inventory & fit...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Bottom Composer */}
          <div className="bg-[#1f2c34] p-2.5 flex items-center space-x-2 border-t border-[#2a3942]">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Message KicksCraft (English or Hinglish)..."
              className="flex-1 bg-[#2a3942] text-sm text-white placeholder-stone-400 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#029070] disabled:opacity-50 text-white flex items-center justify-center transition-all shadow-md flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
