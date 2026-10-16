import React from 'react';
import { ChatMessage, FootwearItem } from '../../types';
import { ProductRecCard } from './ProductRecCard';
import { ActionButtons } from './ActionButtons';
import { AlertCircle } from 'lucide-react';

export interface MessageBubbleProps {
  message: ChatMessage;
  isLast?: boolean;
  onSelectSize?: (shoe: FootwearItem, sizeUK: number) => void;
  onSelectQuickReply?: (text: string) => void;
  onOpenDemoNotice?: (title: string, desc: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLast,
  onSelectSize,
  onSelectQuickReply,
  onOpenDemoNotice,
}) => {
  const isUser = message.sender === 'user';
  const isMerchant = message.sender === 'merchant';
  const isAssistant = message.sender === 'assistant';

  return (
    <div className={`flex flex-col space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
      {/* Sender Header / Source Tag */}
      <div className="flex items-center gap-2 px-1 text-[11px] text-text-3 font-mono">
        {isUser ? (
          <span>Customer</span>
        ) : isMerchant ? (
          <span className="text-text font-semibold">Founder</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-text font-medium">SoleAI</span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded-pill bg-white/[0.05] border border-line text-text-3">
              {message.source === 'gemini' ? 'Gemini' : 'Demo rules'}
            </span>
            {message.latencyMs !== undefined && (
              <span className="text-[10px] text-text-3">
                {message.latencyMs}ms
              </span>
            )}
          </div>
        )}
        <span>• {message.timestamp}</span>
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-panel px-4 py-3 text-body leading-relaxed border transition-colors ${
          isUser
            ? 'bg-bg-raised text-text border-line-strong'
            : isMerchant
            ? 'bg-bg-raised text-text border-accent/40 shadow-panel'
            : 'bg-bg-sunken text-text border-line'
        }`}
      >
        <p className="whitespace-pre-line select-text">{message.text}</p>

        {/* System block for Human Handoff */}
        {message.actionType === 'human_handoff' && (
          <div className="mt-3 p-2.5 rounded-md bg-white/[0.03] border border-line flex items-start gap-2 text-small text-text-2">
            <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-text">Connecting you to the founder</p>
              <p className="text-[11px] text-text-3 mt-0.5">
                SoleAI flagged this conversation for direct merchant review and priority handling.
              </p>
            </div>
          </div>
        )}

        {/* Product Recommendations Horizontal Reel */}
        {message.recommendedProducts && message.recommendedProducts.length > 0 && (
          <div className="mt-3 -mx-2 px-2 flex gap-2.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
            {message.recommendedProducts.map(shoe => (
              <ProductRecCard
                key={shoe.id}
                shoe={shoe}
                onSelectSize={onSelectSize}
              />
            ))}
          </div>
        )}

        {/* Actions & Quick Replies */}
        <ActionButtons
          actionType={message.actionType}
          actionData={message.actionData}
          quickReplies={isLast && isAssistant ? [
            'Check size 9 stock',
            'Is COD available?',
            'What is the exchange policy?'
          ] : undefined}
          onSelectQuickReply={onSelectQuickReply}
          onOpenDemoNotice={onOpenDemoNotice}
        />
      </div>
    </div>
  );
};
