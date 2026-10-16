import React from 'react';
import { Panel } from '../ui/Panel';
import { StatusDot } from '../ui/StatusDot';
import { ChatMessage, FootwearItem } from '../../types';

export interface InspectorProps {
  lastAssistantMessage?: ChatMessage;
  detectedIntent?: string;
  matchedProducts?: FootwearItem[];
  latencyMs?: number;
  source?: 'gemini' | 'rules';
  handoffTriggered?: boolean;
}

export const Inspector: React.FC<InspectorProps> = ({
  lastAssistantMessage,
  detectedIntent = 'General Footwear Inquiry',
  matchedProducts = [],
  latencyMs,
  source = 'rules',
  handoffTriggered = false,
}) => {
  return (
    <Panel className="p-4 space-y-4 text-small">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <h3 className="text-small font-mono uppercase tracking-wider text-text font-semibold">
          AI Inspector (Demo Tool)
        </h3>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-pill bg-white/[0.05] border border-line text-text-3">
          Simulated trace
        </span>
      </div>

      <div className="space-y-3 font-mono text-[11px]">
        {/* Source */}
        <div className="flex items-center justify-between">
          <span className="text-text-3">Response Source</span>
          <div className="flex items-center gap-1.5">
            <StatusDot status={source === 'gemini' ? 'ok' : 'neutral'} />
            <span className="text-text capitalize font-sans">{source}</span>
          </div>
        </div>

        {/* Latency */}
        <div className="flex items-center justify-between">
          <span className="text-text-3">Round-trip Latency</span>
          <span className="text-text">
            {latencyMs !== undefined ? `${latencyMs} ms` : 'Measuring on send'}
          </span>
        </div>

        {/* Detected Intent */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-text-3">Detected Intent</span>
          <span className="text-text text-right truncate max-w-[180px]">
            {detectedIntent}
          </span>
        </div>

        {/* Action Type */}
        <div className="flex items-center justify-between">
          <span className="text-text-3">Action Type</span>
          <span className="text-text">
            {lastAssistantMessage?.actionType || 'none'}
          </span>
        </div>

        {/* Human Handoff */}
        <div className="flex items-center justify-between">
          <span className="text-text-3">Handoff Escalation</span>
          <span className={handoffTriggered ? 'text-accent font-bold' : 'text-text-3'}>
            {handoffTriggered ? 'FLAGGED (Needs Merchant)' : 'None'}
          </span>
        </div>

        {/* Matched Products */}
        <div className="pt-2 border-t border-line space-y-1.5">
          <span className="text-text-3 block">Matched SKUs ({matchedProducts.length})</span>
          {matchedProducts.length === 0 ? (
            <span className="text-text-3 italic">No specific shoe recommended</span>
          ) : (
            <div className="space-y-1">
              {matchedProducts.map(p => (
                <div key={p.id} className="text-text text-small truncate flex items-center justify-between">
                  <span>{p.name}</span>
                  <span className="text-text-3">₹{p.priceINR}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
};
