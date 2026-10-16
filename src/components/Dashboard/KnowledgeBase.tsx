import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Check, 
  Settings, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  Save,
  Percent
} from 'lucide-react';
import { UnansweredQuestion, BrandSettings } from '../../types';

interface KnowledgeBaseProps {
  unansweredQuestions: UnansweredQuestion[];
  brandSettings: BrandSettings;
  onAddToFaq: (questionId: string, answer: string) => Promise<void>;
  onUpdateBrandSettings: (settings: Partial<BrandSettings>) => Promise<void>;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  unansweredQuestions,
  brandSettings,
  onAddToFaq,
  onUpdateBrandSettings,
}) => {
  const [settings, setSettings] = useState<BrandSettings>(brandSettings);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [editingAnswers, setEditingAnswers] = useState<{ [key: string]: string }>({});

  const handleSaveSettings = async () => {
    await onUpdateBrandSettings(settings);
    setSaveStatus('✅ Brand settings and tone saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleApproveAnswer = async (qId: string, suggested: string) => {
    const finalAnswer = editingAnswers[qId] || suggested;
    await onAddToFaq(qId, finalAnswer);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900/80 border border-stone-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white font-heading">SoleAI Knowledge & Brand Controls</h2>
          <p className="text-xs text-stone-400">
            Control SoleAI's brand voice, discount permissions, size exchange rules, and fill customer knowledge gaps.
          </p>
        </div>

        {saveStatus && (
          <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-lg animate-pulse">
            {saveStatus}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Unanswered Questions Gap Log */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white font-heading">Customer Questions Gap Log</h3>
              </div>
              <span className="text-[11px] text-stone-400">
                {unansweredQuestions.filter(q => q.status === 'unresolved').length} Gaps to Review
              </span>
            </div>

            <p className="text-xs text-stone-400 mt-2 mb-4">
              When shoppers ask questions that aren't yet in your product spec or policy files, SoleAI flags them here. One tap approves the AI-suggested answer for future chats.
            </p>

            <div className="space-y-4">
              {unansweredQuestions.map(item => {
                const isApproved = item.status === 'added_to_faq';

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isApproved
                        ? 'bg-stone-950/50 border-emerald-900/40 text-stone-300'
                        : 'bg-stone-950/80 border-stone-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-stone-200">{item.question}</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 italic">
                          Shopper asked: "{item.sampleCustomerQuery}" ({item.frequency} times)
                        </p>
                      </div>

                      {isApproved ? (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> In Knowledge Base
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                          Pending Approval
                        </span>
                      )}
                    </div>

                    {/* Suggested Answer Input */}
                    <div className="mt-3 pt-3 border-t border-stone-800/80 space-y-2">
                      <label className="text-[11px] text-stone-400 flex items-center gap-1 font-medium">
                        <Sparkles className="w-3 h-3 text-amber-400" /> SoleAI Suggested Knowledge Answer:
                      </label>
                      <textarea
                        rows={2}
                        disabled={isApproved}
                        value={editingAnswers[item.id] !== undefined ? editingAnswers[item.id] : item.suggestedAnswer || ''}
                        onChange={e => setEditingAnswers({ ...editingAnswers, [item.id]: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 disabled:opacity-75"
                      />

                      {!isApproved && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleApproveAnswer(item.id, item.suggestedAnswer || '')}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow transition-all flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Train Bot
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Brand Tone & Policy Settings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-stone-800">
              <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <Settings className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white font-heading">Tone & Policy Guardrails</h3>
            </div>

            {/* Language Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Conversation Style / Language</label>
              <select
                value={settings.languageMode}
                onChange={e => setSettings({ ...settings, languageMode: e.target.value as any })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="hinglish">Hinglish (Recommended: natural Indian D2C street tone)</option>
                <option value="english">Formal English (Polite & minimal)</option>
                <option value="hindi">Pure Hindi (Devanagari script)</option>
              </select>
            </div>

            {/* Max Discount Permission */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-300">Max Discount Limit</label>
                <span className="text-xs font-mono font-bold text-amber-400">{settings.maxDiscountPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="5"
                value={settings.maxDiscountPercent}
                onChange={e => setSettings({ ...settings, maxDiscountPercent: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-stone-500">
                SoleAI will only offer up to {settings.maxDiscountPercent}% (code "SOLE10") when a buyer hesitates on price.
              </p>
            </div>

            {/* Return Policy */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Size Exchange & Return Policy</label>
              <textarea
                rows={3}
                value={settings.returnPolicyText}
                onChange={e => setSettings({ ...settings, returnPolicyText: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Shipping Policy */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Shipping & Dispatch Timeframe</label>
              <textarea
                rows={2}
                value={settings.shippingPolicyText}
                onChange={e => setSettings({ ...settings, shippingPolicyText: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveSettings}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Policies & AI Persona
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
