import React from 'react';
import { DashboardMetrics, Order, Conversation, FootwearItem, UnansweredQuestion } from '../../types';
import { PageHeader } from '../layout/PageHeader';
import { Panel } from '../ui/Panel';
import { StatusDot } from '../ui/StatusDot';
import { Button } from '../ui/Button';
import { formatINR, formatNumberIN } from '../../lib/format';
import { ArrowRight } from 'lucide-react';

export interface OverviewSectionProps {
  metrics: DashboardMetrics;
  orders: Order[];
  conversations: Conversation[];
  shoes: FootwearItem[];
  unansweredQuestions: UnansweredQuestion[];
  onNavigateTab: (tab: 'needs-you' | 'catalogue' | 'orders' | 'knowledge') => void;
  onTakeOverChat: (convId: string) => void;
  onConfirmCod: (orderId: string) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  metrics,
  orders,
  conversations,
  shoes,
  unansweredQuestions,
  onNavigateTab,
  onTakeOverChat,
  onConfirmCod,
}) => {
  const needsYouConvs = conversations.filter(c => c.status === 'needs_merchant');
  const pendingCodOrders = orders.filter(o => o.codStatus === 'pending_confirmation');
  const lowStockCount = shoes.reduce((acc, shoe) => acc + shoe.sizes.filter(s => s.stock <= 2).length, 0);
  const faqGapsCount = unansweredQuestions.filter(q => q.status === 'unresolved').length;

  const secondaryHeader = needsYouConvs.length > 0
    ? `${needsYouConvs.length} customer${needsYouConvs.length === 1 ? '' : 's'} need you.`
    : 'All customer conversations are resolved.';

  return (
    <div className="space-y-8">
      {/* Two-tone Page Header */}
      <PageHeader
        primaryTitle="Good evening."
        secondaryTitle={secondaryHeader}
        description="Autonomous sales and COD operations for KicksCraft India."
      />

      {/* ATTENTION STRIP: 1 hairline-divided row of 4 counts */}
      <Panel className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-line">
        <button onClick={() => onNavigateTab('needs-you')} className="p-5 text-left hover:bg-white/[0.02] transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label font-mono uppercase text-text-3">Needs Attention</span>
            {needsYouConvs.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
          </div>
          <div className="text-h1 font-mono font-bold text-text group-hover:text-accent transition-colors">{needsYouConvs.length}</div>
          <p className="text-[11px] text-text-3 mt-1 truncate">Customer escalations</p>
        </button>

        <button onClick={() => onNavigateTab('orders')} className="p-5 text-left hover:bg-white/[0.02] transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label font-mono uppercase text-text-3">COD to Confirm</span>
            {pendingCodOrders.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-warn" />}
          </div>
          <div className="text-h1 font-mono font-bold text-text group-hover:text-warn transition-colors">{pendingCodOrders.length}</div>
          <p className="text-[11px] text-text-3 mt-1 truncate">Pending doorstep delivery</p>
        </button>

        <button onClick={() => onNavigateTab('catalogue')} className="p-5 text-left hover:bg-white/[0.02] transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label font-mono uppercase text-text-3">Low Stock SKUs</span>
            {lowStockCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-risk" />}
          </div>
          <div className="text-h1 font-mono font-bold text-text group-hover:text-risk transition-colors">{lowStockCount}</div>
          <p className="text-[11px] text-text-3 mt-1 truncate">Sizes at 2 or fewer</p>
        </button>

        <button onClick={() => onNavigateTab('knowledge')} className="p-5 text-left hover:bg-white/[0.02] transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label font-mono uppercase text-text-3">FAQ Gaps</span>
            {faqGapsCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-text-3" />}
          </div>
          <div className="text-h1 font-mono font-bold text-text group-hover:text-white transition-colors">{faqGapsCount}</div>
          <p className="text-[11px] text-text-3 mt-1 truncate">Unresolved customer queries</p>
        </button>
      </Panel>

      {/* KPI STRIP: 4 existing KPIs in ONE bordered strip with vertical hairlines */}
      <Panel className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line">
        <div className="p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-label font-mono uppercase text-text-3">Today's Inquiries</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded-pill bg-white/[0.04] text-text-3 border border-line">Demo</span>
          </div>
          <div className="text-h1 font-mono font-bold text-text pt-1">{formatNumberIN(metrics.totalInquiriesToday)}</div>
          <p className="text-small text-text-3">{metrics.aiHandledPercentage}% resolved by SoleAI</p>
        </div>

        <div className="p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-label font-mono uppercase text-text-3">Influenced Revenue</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded-pill bg-white/[0.04] text-text-3 border border-line">Demo</span>
          </div>
          <div className="text-h1 font-mono font-bold text-text pt-1">{formatINR(metrics.ordersInfluencedRevenueINR)}</div>
          <p className="text-small text-text-3">{metrics.ordersInfluencedCount} pairs converted via chat</p>
        </div>

        <div className="p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-label font-mono uppercase text-text-3">COD RTO Prevented</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded-pill bg-white/[0.04] text-text-3 border border-line">Demo</span>
          </div>
          <div className="text-h1 font-mono font-bold text-text pt-1">{metrics.codRtoPreventedCount} orders</div>
          <p className="text-small text-text-3">~{formatINR(metrics.estimatedRtoSavingsINR)} freight saved</p>
        </div>

        <div className="p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-label font-mono uppercase text-text-3">AI Response Latency</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded-pill bg-white/[0.04] text-text-3 border border-line">Real-time</span>
          </div>
          <div className="text-h1 font-mono font-bold text-text pt-1">{metrics.avgResponseTimeSeconds}s</div>
          <p className="text-small text-text-3">Average measured response</p>
        </div>
      </Panel>

      {/* Two Columns: Needs You & Orders Awaiting Confirmation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-line mb-3">
              <div className="flex items-center gap-2">
                <span className="text-small font-mono uppercase tracking-wider text-text font-semibold">Needs You Inbox</span>
                {needsYouConvs.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
              </div>
              <button onClick={() => onNavigateTab('needs-you')} className="text-small text-text-2 hover:text-text inline-flex items-center gap-1 cursor-pointer">
                View all ({needsYouConvs.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-line">
              {needsYouConvs.length === 0 ? (
                <div className="py-8 text-center text-text-3 text-small">No escalated chats waiting for review.</div>
              ) : (
                needsYouConvs.slice(0, 3).map(conv => (
                  <div key={conv.id} className="py-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text text-small">{conv.customerName}</span>
                        <span className="text-label font-mono uppercase text-text-3">({conv.channel})</span>
                      </div>
                      <span className="text-label font-mono text-text-3">{conv.lastUpdated}</span>
                    </div>
                    <p className="text-small text-text-2 line-clamp-1 italic">"{conv.lastMessageSnippet}"</p>
                    <div className="flex items-center justify-between pt-1">
                      <StatusDot status="accent" label={conv.handoffReason?.replace('_', ' ') || 'Assistance needed'} />
                      <Button variant="secondary" size="sm" onClick={() => onTakeOverChat(conv.id)}>Take over</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Panel>

        <Panel className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-line mb-3">
              <span className="text-small font-mono uppercase tracking-wider text-text font-semibold">COD Orders Awaiting Confirmation</span>
              <button onClick={() => onNavigateTab('orders')} className="text-small text-text-2 hover:text-text inline-flex items-center gap-1 cursor-pointer">
                All orders <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-line">
              {pendingCodOrders.length === 0 ? (
                <div className="py-8 text-center text-text-3 text-small">All pending COD orders verified.</div>
              ) : (
                pendingCodOrders.slice(0, 3).map(ord => (
                  <div key={ord.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-label text-text font-semibold">{ord.orderNumber}</span>
                        <span className="text-small text-text truncate">{ord.customerName}</span>
                      </div>
                      <p className="text-[11px] text-text-3 truncate">{ord.shoeName} (UK {ord.sizeUK}) • {formatINR(ord.amountINR)}</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => onConfirmCod(ord.id)}>Confirm</Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};
