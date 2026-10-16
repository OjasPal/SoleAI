import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, AlertCircle } from 'lucide-react';
import { ChatMessage, FootwearItem } from '../../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Modal } from '../ui/Modal';
import { api } from '../../lib/api';

export interface ChatPanelProps {
  channel?: 'whatsapp' | 'website' | 'instagram';
  customerName?: string;
  initialMessages?: ChatMessage[];
  onOrderInfluenced?: () => void;
  onTraceUpdate?: (trace: {
    intent?: string;
    matchedProducts?: FootwearItem[];
    latencyMs?: number;
    source?: 'gemini' | 'rules';
    handoffTriggered?: boolean;
    lastAssistantMessage?: ChatMessage;
  }) => void;
  headerTitle?: string;
  headerSubtitle?: string;
  className?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  channel = 'website',
  customerName = 'Shopper',
  initialMessages,
  onOrderInfluenced,
  onTraceUpdate,
  headerTitle,
  headerSubtitle,
  className = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages || [
      {
        id: 'init-1',
        sender: 'assistant',
        text: 'Namaste! Welcome to KicksCraft India. Looking for daily sneakers, loafers, Chelsea boots, or recovery slides today? Ask about UK sizes, fit, or COD!',
        timestamp: 'Just now',
        source: 'rules',
      }
    ]
  );
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState<{ title: string; desc: string } | null>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setLoading(true);
    setErrorMsg(null);

    try {
      const resp = await api.sendMessage({
        message: text,
        history: newHistory.map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        })),
        channel,
        customerName,
      });

      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: resp.replyText,
        timestamp: 'Just now',
        recommendedProducts: resp.recommendedProducts,
        actionType: resp.actionType as any,
        actionData: resp.actionData,
        source: resp.source,
        latencyMs: resp.latencyMs,
      };

      setMessages(prev => [...prev, assistantMessage]);

      onTraceUpdate?.({
        intent: resp.intent,
        matchedProducts: resp.recommendedProducts,
        latencyMs: resp.latencyMs,
        source: resp.source,
        handoffTriggered: resp.needsHumanHandoff,
        lastAssistantMessage: assistantMessage,
      });

      if (resp.actionType === 'checkout_link' || resp.actionType === 'cod_confirmation') {
        onOrderInfluenced?.();
      }
    } catch (err: any) {
      setErrorMsg('Failed to send message. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectSize = (shoe: FootwearItem, sizeUK: number) => {
    handleSend(`Can I order the ${shoe.name} in UK ${sizeUK}?`);
  };

  return (
    <div className={`flex flex-col bg-bg-raised border border-line rounded-panel overflow-hidden ${className}`}>
      {/* Header */}
      {headerTitle && (
        <div className="px-4 py-3 border-b border-line bg-bg flex items-center justify-between">
          <div className="flex items-center gap-2">
            {channel === 'whatsapp' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="WhatsApp Channel" />
            )}
            <div>
              <h3 className="text-small font-display font-medium text-text leading-tight">{headerTitle}</h3>
              {headerSubtitle && <p className="text-[11px] text-text-3 font-mono">{headerSubtitle}</p>}
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-3 px-2 py-0.5 rounded-pill bg-white/[0.04] border border-line">
            Simulated
          </span>
        </div>
      )}

      {/* Messages Thread */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-sunken min-h-[300px]"
        aria-live="polite"
        role="log"
      >
        {messages.map((m, idx) => (
          <MessageBubble
            key={m.id}
            message={m}
            isLast={idx === messages.length - 1}
            onSelectSize={handleSelectSize}
            onSelectQuickReply={text => handleSend(text)}
            onOpenDemoNotice={(title, desc) => setDemoNotice({ title, desc })}
          />
        ))}

        {loading && <TypingIndicator />}

        {errorMsg && (
          <div className="p-3 rounded-panel bg-risk/10 border border-risk/30 text-risk text-small flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </span>
            <button
              onClick={() => handleSend(messages[messages.length - 1]?.text)}
              className="text-small underline font-medium hover:text-white cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}
        <div ref={threadEndRef} />
      </div>

      {/* Composer */}
      <div className="p-3 bg-bg border-t border-line flex items-end gap-2">
        <textarea
          rows={1}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask sizing, fit, or COD... (Enter to send)"
          className="flex-1 max-h-28 min-h-[40px] px-3.5 py-2.5 bg-bg-sunken border border-line rounded-panel text-body text-text placeholder:text-text-3/60 resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <button
          type="button"
          disabled={!inputText.trim() || loading}
          onClick={() => handleSend()}
          aria-label="Send message"
          className="h-10 w-10 flex items-center justify-center rounded-pill bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:pointer-events-none transition-all flex-shrink-0 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>

      {/* Demo Notice Modal */}
      <Modal
        open={Boolean(demoNotice)}
        onClose={() => setDemoNotice(null)}
        title={demoNotice?.title || 'Demo Notice'}
        description={demoNotice?.desc || 'Simulated action.'}
      />
    </div>
  );
};
