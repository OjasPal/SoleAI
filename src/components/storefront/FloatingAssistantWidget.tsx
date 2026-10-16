import React from 'react';
import { ChatPanel } from '../chat/ChatPanel';
import { Sparkles, X, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../../types';

interface FloatingAssistantWidgetProps {
  open: boolean;
  onToggle: () => void;
  initialQuery?: string;
}

export const FloatingAssistantWidget: React.FC<FloatingAssistantWidgetProps> = ({
  open,
  onToggle,
  initialQuery,
}) => {
  const initialMessages: ChatMessage[] = [
    {
      id: 'init-store',
      sender: 'assistant',
      text: initialQuery
        ? `Namaste! Regarding your question: "${initialQuery}" — I can verify live UK sizes, check fit tendencies, or explain COD delivery right now.`
        : 'Namaste! Welcome to KicksCraft India. Looking for court sneakers, retros, penny loafers, or cloud recovery slides? Ask me about UK sizing, wide feet fit, or COD!',
      timestamp: 'Just now',
      source: 'rules',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Floating Chat Panel Drawer */}
      {open && (
        <div className="mb-3 w-[380px] max-w-[calc(100vw-32px)] h-[560px] max-h-[82vh] rounded-panel border border-line shadow-2xl bg-bg-raised overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-200">
          <div className="px-4 py-3 bg-bg border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <div>
                <h3 className="text-small font-display font-medium text-text">SoleAI Fit Assistant</h3>
                <p className="text-[10px] font-mono text-text-3">Connected to live UK inventory</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              aria-label="Close assistant"
              className="p-1 rounded-panel hover:bg-white/[0.05] text-text-3 hover:text-text cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <ChatPanel
              key={initialQuery || 'default-chat'}
              channel="website"
              customerName="Storefront Shopper"
              initialMessages={initialMessages}
              className="h-full border-none rounded-none"
            />
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={onToggle}
        aria-label={open ? 'Close SoleAI Assistant' : 'Open SoleAI Fit Assistant'}
        className={`h-11 px-4 rounded-pill flex items-center gap-2.5 transition-all shadow-xl cursor-pointer ${
          open
            ? 'bg-bg-raised border border-line-strong text-text'
            : 'bg-white text-black hover:bg-neutral-200'
        }`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
        </span>
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-small font-medium font-display tracking-tight">
          {open ? 'Minimize SoleAI' : 'Ask SoleAI Sizing'}
        </span>
      </button>
    </div>
  );
};
