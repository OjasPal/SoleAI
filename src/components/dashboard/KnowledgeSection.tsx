import React, { useState } from 'react';
import { BrandSettings, UnansweredQuestion } from '../../types';
import { PageHeader } from '../layout/PageHeader';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StatusDot } from '../ui/StatusDot';
import { Tabs } from '../ui/Tabs';
import { Check, Sparkles } from 'lucide-react';

export interface KnowledgeSectionProps {
  brandSettings: BrandSettings;
  unansweredQuestions: UnansweredQuestion[];
  onUpdateBrandSettings: (settings: Partial<BrandSettings>) => Promise<void>;
  onAddToFaq: (questionId: string, answer: string) => Promise<void>;
}

export const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({
  brandSettings,
  unansweredQuestions,
  onUpdateBrandSettings,
  onAddToFaq,
}) => {
  const [activeTab, setActiveTab] = useState<'tone' | 'policies' | 'faqs'>('tone');
  const [formData, setFormData] = useState<BrandSettings>(brandSettings);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [faqAnswers, setFaqAnswers] = useState<{ [id: string]: string }>({});

  const handleFieldChange = (key: keyof BrandSettings, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    try {
      await onUpdateBrandSettings(formData);
      setDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleApproveFaq = async (qId: string, defaultAnswer: string) => {
    const finalAnswer = faqAnswers[qId] || defaultAnswer;
    await onAddToFaq(qId, finalAnswer);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        primaryTitle="Tone & Policies."
        secondaryTitle="Brand voice and automated store policies."
        description="Defines how SoleAI greets buyers, enforces return rules, and handles unknown customer questions."
        actions={
          activeTab !== 'faqs' ? (
            <Button
              variant="primary"
              size="sm"
              loading={saving}
              disabled={!dirty}
              onClick={handleSave}
            >
              {saveSuccess ? 'Saved' : 'Save Changes'}
            </Button>
          ) : undefined
        }
      />

      {/* Sub Tabs */}
      <Tabs
        activeId={activeTab}
        onChange={id => setActiveTab(id as any)}
        items={[
          { id: 'tone', label: 'Tone & Persona' },
          { id: 'policies', label: 'Store Policies' },
          { id: 'faqs', label: 'FAQ Gaps', badge: unansweredQuestions.filter(q => q.status === 'unresolved').length },
        ]}
      />

      {/* Tab 1: Tone & Persona */}
      {activeTab === 'tone' && (
        <Panel className="p-6 max-w-2xl space-y-6">
          <div className="space-y-1.5">
            <label className="block text-small font-medium text-text">Conversation Language Style</label>
            <select
              value={formData.languageMode}
              onChange={e => handleFieldChange('languageMode', e.target.value)}
              className="w-full h-10 px-3.5 bg-bg-sunken border border-line rounded-panel text-body text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="hinglish">Hinglish (Conversational Indian D2C street tone)</option>
              <option value="english">Formal English (Clean, concise)</option>
              <option value="hindi">Hindi (Devanagari)</option>
            </select>
            <p className="text-small text-text-3">SoleAI naturally switches between English and Hinglish based on buyer cues.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-small font-medium text-text">
              Max Authorized Discount Percentage ({formData.maxDiscountPercent}%)
            </label>
            <input
              type="range"
              min="0"
              max="20"
              step="5"
              value={formData.maxDiscountPercent}
              onChange={e => handleFieldChange('maxDiscountPercent', Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
            <p className="text-small text-text-3">Maximum discount coupon code (SOLE10) SoleAI can offer hesitant buyers.</p>
          </div>

          <Input
            label="WhatsApp Business Support Number"
            value={formData.whatsappNumber}
            onChange={e => handleFieldChange('whatsappNumber', e.target.value)}
            helperText="Customer replies are routed here if human handoff is requested."
          />
        </Panel>
      )}

      {/* Tab 2: Policies */}
      {activeTab === 'policies' && (
        <Panel className="p-6 max-w-2xl space-y-6">
          <div className="space-y-1.5">
            <label className="block text-small font-medium text-text">7-Day Return & Size Exchange Policy</label>
            <textarea
              rows={3}
              value={formData.returnPolicyText}
              onChange={e => handleFieldChange('returnPolicyText', e.target.value)}
              className="w-full p-3 bg-bg-sunken border border-line rounded-panel text-body text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
            <p className="text-small text-text-3">Reassures shoppers about wrong-size exchange support.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-small font-medium text-text">Shipping & Dispatch Timeframes</label>
            <textarea
              rows={2}
              value={formData.shippingPolicyText}
              onChange={e => handleFieldChange('shippingPolicyText', e.target.value)}
              className="w-full p-3 bg-bg-sunken border border-line rounded-panel text-body text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
            <p className="text-small text-text-3">Shared when customers ask delivery timelines.</p>
          </div>
        </Panel>
      )}

      {/* Tab 3: FAQ Gaps */}
      {activeTab === 'faqs' && (
        <div className="space-y-4 max-w-3xl">
          <p className="text-small text-text-3">
            Questions shoppers asked that weren't covered by catalogue policies. Approve or edit the suggested answer.
          </p>

          <div className="space-y-3">
            {unansweredQuestions.map(item => {
              const isResolved = item.status === 'added_to_faq';

              return (
                <Panel key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-small font-medium text-text">{item.question}</h4>
                      <p className="text-[11px] text-text-3 mt-0.5">
                        Shopper query: "{item.sampleCustomerQuery}" • Asked {item.frequency} times
                      </p>
                    </div>
                    <StatusDot status={isResolved ? 'ok' : 'warn'} label={isResolved ? 'In Knowledge Base' : 'Pending'} />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-line">
                    <textarea
                      rows={2}
                      disabled={isResolved}
                      value={faqAnswers[item.id] !== undefined ? faqAnswers[item.id] : item.suggestedAnswer || ''}
                      onChange={e => setFaqAnswers({ ...faqAnswers, [item.id]: e.target.value })}
                      className="w-full p-2.5 bg-bg-sunken border border-line rounded-panel text-small text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
                      placeholder="Enter verified answer..."
                    />

                    {!isResolved && (
                      <div className="flex justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleApproveFaq(item.id, item.suggestedAnswer || '')}
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Approve & Add to FAQ
                        </Button>
                      </div>
                    )}
                  </div>
                </Panel>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
