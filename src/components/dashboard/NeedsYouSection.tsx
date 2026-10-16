import React, { useState } from 'react';
import { Conversation } from '../../types';
import { PageHeader } from '../layout/PageHeader';
import { Panel } from '../ui/Panel';
import { StatusDot } from '../ui/StatusDot';
import { Button } from '../ui/Button';
import { Check, Send } from 'lucide-react';

export interface NeedsYouSectionProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelectConversation: (id: string) => void;
  onReply: (conversationId: string, text: string) => Promise<void>;
  onResolve: (conversationId: string) => Promise<void>;
}

export const NeedsYouSection: React.FC<NeedsYouSectionProps> = ({
  conversations,
  selectedId,
  onSelectConversation,
  onReply,
  onResolve,
}) => {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const activeConv = conversations.find(c => c.id === selectedId) || conversations[0];
  const pendingCount = conversations.filter(c => c.status === 'needs_merchant').length;

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeConv || sending) return;
    setSending(true);
    try {
      await onReply(activeConv.id, replyText);
      setReplyText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        primaryTitle="Needs You."
        secondaryTitle={`${pendingCount} conversation${pendingCount === 1 ? '' : 's'} awaiting founder reply.`}
        description="Chats flagged by SoleAI due to size disputes, wedding bulk queries, or delivery delays."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left List (~320px / 4 cols) */}
        <Panel className="lg:col-span-4 p-0 divide-y divide-line overflow-y-auto max-h-[720px]">
          <div className="p-4 bg-bg border-b border-line">
            <span className="text-label font-mono uppercase text-text-3 font-semibold">
              Customer Threads ({conversations.length})
            </span>
          </div>

          {conversations.map(conv => {
            const isSelected = activeConv?.id === conv.id;
            const isPending = conv.status === 'needs_merchant';

            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full p-4 text-left transition-colors cursor-pointer block border-l-2 ${
                  isSelected
                    ? 'bg-white/[0.04] border-l-white'
                    : 'border-l-transparent hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-small text-text">{conv.customerName}</span>
                  <span className="text-label font-mono text-text-3">{conv.lastUpdated}</span>
                </div>

                <p className="text-small text-text-3 line-clamp-1 mb-2">
                  {conv.lastMessageSnippet}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-text-3">
                    {conv.channel}
                  </span>
                  <StatusDot
                    status={isPending ? 'accent' : 'ok'}
                    label={isPending ? (conv.handoffReason?.replace('_', ' ') || 'Needs attention') : 'Resolved'}
                  />
                </div>
              </button>
            );
          })}
        </Panel>

        {/* Right Detail Pane (8 cols): Thread + Context */}
        {activeConv ? (
          <Panel className="lg:col-span-8 p-0 flex flex-col justify-between overflow-hidden">
            {/* Header with Context */}
            <div className="p-4 bg-bg border-b border-line flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-medium text-text text-body">{activeConv.customerName}</h3>
                  <span className="text-label font-mono text-text-3">({activeConv.customerPhone})</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-text-3 mt-1">
                  <span>Channel: {activeConv.channel}</span>
                  <span>•</span>
                  <span>Intent: {activeConv.intentDetected || 'Inquiry'}</span>
                </div>
              </div>

              {activeConv.status === 'needs_merchant' ? (
                <Button variant="secondary" size="sm" onClick={() => onResolve(activeConv.id)}>
                  <Check className="w-3.5 h-3.5 mr-1" /> Mark Resolved
                </Button>
              ) : (
                <span className="text-small font-mono text-ok">Resolved</span>
              )}
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg-sunken min-h-[350px]">
              {activeConv.messages.map(msg => {
                const isUser = msg.sender === 'user';
                const isMerchant = msg.sender === 'merchant';

                return (
                  <div key={msg.id} className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}>
                    <span className="text-[10px] font-mono text-text-3 px-1 mb-1">
                      {isUser ? activeConv.customerName : isMerchant ? 'Founder (You)' : 'SoleAI'} • {msg.timestamp}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-panel px-3.5 py-2.5 text-body border ${
                        isUser
                          ? 'bg-bg-raised text-text border-line'
                          : isMerchant
                          ? 'bg-bg-raised text-text border-accent/40 shadow-panel'
                          : 'bg-bg text-text-2 border-line'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick replies & Composer */}
            <div className="p-3 bg-bg border-t border-line space-y-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setReplyText("Arre don't worry, your size exchange is 100% free doorstep pickup! Let me reserve the next size right away.")}
                  className="px-2.5 py-1 rounded-pill bg-bg-sunken border border-line text-text-3 hover:text-text cursor-pointer whitespace-nowrap"
                >
                  Free Size Exchange
                </button>
                <button
                  type="button"
                  onClick={() => setReplyText("Here is your coupon SOLE10 for 10% off your pair today!")}
                  className="px-2.5 py-1 rounded-pill bg-bg-sunken border border-line text-text-3 hover:text-text cursor-pointer whitespace-nowrap"
                >
                  10% Discount Code
                </button>
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type founder reply... (Enter to send)"
                  className="flex-1 px-3 py-2 bg-bg-sunken border border-line rounded-panel text-body text-text placeholder:text-text-3/60 resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                />
                <Button variant="primary" size="sm" loading={sending} disabled={!replyText.trim()} onClick={handleSendReply}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel className="lg:col-span-8 p-12 text-center text-text-3">
            Select a conversation thread to review details.
          </Panel>
        )}
      </div>
    </div>
  );
};
