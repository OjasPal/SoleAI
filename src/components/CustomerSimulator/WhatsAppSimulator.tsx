import React, { useState } from 'react';
import { FootwearItem, ChatMessage } from '../../types';
import { PageHeader } from '../layout/PageHeader';
import { ChatPanel } from '../chat/ChatPanel';
import { Inspector } from '../chat/Inspector';
import { Panel } from '../ui/Panel';

export interface WhatsAppSimulatorProps {
  initialShoes: FootwearItem[];
  onOrderInfluenced?: () => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  initialShoes,
  onOrderInfluenced,
}) => {
  const [trace, setTrace] = useState<{
    intent?: string;
    matchedProducts?: FootwearItem[];
    latencyMs?: number;
    source?: 'gemini' | 'rules';
    handoffTriggered?: boolean;
    lastAssistantMessage?: ChatMessage;
  }>({
    intent: 'General Footwear Inquiry',
    matchedProducts: initialShoes.slice(0, 2),
    source: 'rules',
  });

  return (
    <div className="space-y-6">
      <PageHeader
        primaryTitle="WhatsApp Sales Simulator."
        secondaryTitle="Interactive buyer chat and telemetry inspector."
        description="Test how SoleAI handles Hinglish inquiries, live sizing recommendations, and 1-tap COD confirmations."
      />

      {/* Centred Device Column (390px) + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-center max-w-5xl mx-auto">
        {/* Device Container (7 cols on lg, centered 390px) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-[390px] rounded-[32px] p-2 bg-bg-sunken border border-line shadow-2xl">
            {/* Simulated Speaker / Notch */}
            <div className="w-24 h-3 bg-white/[0.08] rounded-pill mx-auto mb-2" />

            <ChatPanel
              channel="whatsapp"
              customerName="Aarav (WhatsApp)"
              headerTitle="KicksCraft India"
              headerSubtitle="WhatsApp Business (Simulated)"
              onOrderInfluenced={onOrderInfluenced}
              onTraceUpdate={setTrace}
              className="h-[580px] rounded-[24px] border-none"
            />
          </div>
        </div>

        {/* Inspector Panel (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <Inspector
            lastAssistantMessage={trace.lastAssistantMessage}
            detectedIntent={trace.intent}
            matchedProducts={trace.matchedProducts}
            latencyMs={trace.latencyMs}
            source={trace.source}
            handoffTriggered={trace.handoffTriggered}
          />

          <Panel className="p-4 space-y-2 text-small">
            <span className="text-label font-mono uppercase text-text-3 block">
              Suggested Test Prompts
            </span>
            <ul className="space-y-1.5 text-small text-text-2">
              <li className="font-mono text-[11px] text-text">"Bhai Astro Low ka size 9 stock mein hai?"</li>
              <li className="font-mono text-[11px] text-text">"Cash on delivery available hai Delhi mein?"</li>
              <li className="font-mono text-[11px] text-text">"Mere pair wide hain, Street Retro snug aayega kya?"</li>
              <li className="font-mono text-[11px] text-text">"Need 18 pairs for groomsmen in Goa" (triggers handoff)</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
};
