import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Send, 
  Phone, 
  User, 
  Bot, 
  Clock, 
  Tag, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Conversation, ChatMessage } from '../../types';

interface NeedsYouQueueProps {
  conversations: Conversation[];
  onReply: (conversationId: string, text: string) => Promise<void>;
  onResolve: (conversationId: string) => Promise<void>;
}

export const NeedsYouQueue: React.FC<NeedsYouQueueProps> = ({
  conversations,
  onReply,
  onResolve,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    conversations.find(c => c.status === 'needs_merchant')?.id || conversations[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<'needs_merchant' | 'resolved' | 'all'>('needs_merchant');
  const [isSending, setIsSending] = useState(false);

  const filteredConversations = conversations.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const selectedConv = conversations.find(c => c.id === selectedId) || filteredConversations[0];

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConv) return;
    setIsSending(true);
    try {
      await onReply(selectedConv.id, replyText);
      setReplyText('');
    } finally {
      setIsSending(false);
    }
  };

  const insertTemplate = (text: string) => {
    setReplyText(text);
  };

  return (
    <div className="space-y-4">
      {/* Header & Sub-filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900/80 border border-stone-800 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white font-heading">"Needs You" Handoff Queue</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-950/80 text-red-400 border border-red-800/60">
              {conversations.filter(c => c.status === 'needs_merchant').length} Active Escalations
            </span>
          </div>
          <p className="text-xs text-stone-400">
            SoleAI escalates chats when customers dispute sizing, request bulk orders, or require founder intervention.
          </p>
        </div>

        <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter('needs_merchant')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'needs_merchant' ? 'bg-red-600 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Needs Merchant
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'resolved' ? 'bg-stone-800 text-emerald-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'all' ? 'bg-stone-800 text-stone-200' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Main Split-Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px]">
        {/* Left List (4 Cols) */}
        <div className="lg:col-span-4 bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-stone-800 text-xs text-stone-400 font-medium">
            Customer Threads ({filteredConversations.length})
          </div>

          <div className="divide-y divide-stone-800/80 overflow-y-auto flex-1">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No conversations found under this filter.
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = selectedConv?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`p-3.5 cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? 'bg-stone-800/70 border-l-amber-500'
                        : 'border-l-transparent hover:bg-stone-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-stone-100">{conv.customerName}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{conv.lastUpdated}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-stone-950 text-stone-400 border border-stone-800">
                        {conv.channel}
                      </span>
                      {conv.status === 'needs_merchant' ? (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800/60">
                          {conv.handoffReason?.replace('_', ' ') || 'Needs Attention'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          Resolved
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-400 line-clamp-2">
                      {conv.lastMessageSnippet}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Pane (8 Cols) */}
        <div className="lg:col-span-8 bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col overflow-hidden">
          {selectedConv ? (
            <>
              {/* Top Bar for Selected Conversation */}
              <div className="p-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 bg-stone-950/40">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center font-bold text-stone-200">
                    {selectedConv.customerName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{selectedConv.customerName}</h3>
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" /> {selectedConv.customerPhone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-amber-400/90 font-medium">
                        Intent: {selectedConv.intentDetected || 'Footwear query'}
                      </span>
                      <span className="text-[11px] text-stone-500">• Channel: {selectedConv.channel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedConv.status === 'needs_merchant' ? (
                    <button
                      onClick={() => onResolve(selectedConv.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                      <CheckCircle className="w-3.5 h-3.5" /> Solved by Founder
                    </span>
                  )}
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-950/20">
                {selectedConv.messages.map(msg => {
                  const isUser = msg.sender === 'user';
                  const isMerchant = msg.sender === 'merchant';
                  const isAssistant = msg.sender === 'assistant';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1 mb-1 text-[10px] text-stone-500">
                        {isUser ? (
                          <>
                            <User className="w-3 h-3 text-stone-400" />
                            <span>{selectedConv.customerName}</span>
                          </>
                        ) : isMerchant ? (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span className="text-amber-400 font-semibold">Founder (You)</span>
                          </>
                        ) : (
                          <>
                            <Bot className="w-3 h-3 text-cyan-400" />
                            <span className="text-cyan-400">SoleAI</span>
                          </>
                        )}
                        <span>• {msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-stone-800 text-stone-100 rounded-tl-sm border border-stone-700/60'
                            : isMerchant
                            ? 'bg-amber-600 text-white rounded-tr-sm shadow-md'
                            : 'bg-stone-900 text-stone-200 border border-cyan-800/40 rounded-tr-sm'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {msg.actionType === 'human_handoff' && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-red-400 bg-red-950/40 border border-red-800/40 px-2 py-0.5 rounded-md">
                          <ShieldAlert className="w-3 h-3" /> Handoff triggered to merchant
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Template Chips */}
              <div className="px-4 py-2 bg-stone-950/60 border-t border-stone-800/80 flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-stone-500 text-[11px] font-medium whitespace-nowrap">Quick replies:</span>
                <button
                  onClick={() => insertTemplate("Arre Devansh don't worry! I have reserved UK 10 for you. Our courier will pick up UK 9 from your doorstep tomorrow, free of cost.")}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg whitespace-nowrap border border-stone-700 text-[11px] transition-colors"
                >
                  👟 Free Size Exchange Approval
                </button>
                <button
                  onClick={() => insertTemplate("Hey Rhea! Congratulations on the wedding! For 18 pairs of Tan Pullup Loafers, we can offer a 20% groomsmen package + custom monogramming.")}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg whitespace-nowrap border border-stone-700 text-[11px] transition-colors"
                >
                  🎉 Wedding Bulk Quote
                </button>
                <button
                  onClick={() => insertTemplate("Hi Ananya, I personally contacted the Delhivery hub manager in Mumbai. Your package is out for delivery today before 4 PM!")}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg whitespace-nowrap border border-stone-700 text-[11px] transition-colors"
                >
                  📦 Courier Expedited Resolution
                </button>
              </div>

              {/* Message Composer */}
              <div className="p-3 bg-stone-900 border-t border-stone-800 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                  placeholder="Type your reply as the brand founder..."
                  className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isSending}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-stone-500 text-sm">
              Select a conversation to view chat history
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
