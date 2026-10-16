import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  ShoppingBag, 
  AlertTriangle, 
  ArrowUpRight, 
  MessageSquare, 
  Sparkles,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { DashboardMetrics, Order, Conversation } from '../../types';

interface OverviewTabProps {
  metrics: DashboardMetrics;
  orders: Order[];
  conversations: Conversation[];
  onNavigateTab: (tab: 'needs-you' | 'catalogue' | 'orders' | 'knowledge') => void;
  onOpenWhatsApp: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  orders,
  conversations,
  onNavigateTab,
  onOpenWhatsApp,
}) => {
  const needsYouConversations = conversations.filter(c => c.status === 'needs_merchant');
  const recentOrders = orders.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Needs You queue has items */}
      {metrics.needsYouCount > 0 && (
        <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-900/60 text-red-300 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-200">
                {metrics.needsYouCount} Customers waiting for founder attention
              </h4>
              <p className="text-xs text-red-300/80">
                SoleAI flagged size disputes, wedding bulk orders, and custom delivery inquiries.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('needs-you')}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow transition-all flex items-center gap-1"
          >
            Open Queue <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Inquiries */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-sm hover:border-stone-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Total Enquiries Today</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-heading">{metrics.totalInquiriesToday}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18% vs yesterday
            </span>
          </div>
          <div className="mt-2 text-xs text-stone-400">
            <span className="text-emerald-400 font-medium">{metrics.aiHandledPercentage}%</span> auto-resolved by SoleAI
          </div>
        </div>

        {/* Card 2: Orders Influenced */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-sm hover:border-stone-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Orders Influenced by AI</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-heading">
              ₹{(metrics.ordersInfluencedRevenueINR).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 text-xs text-stone-400">
            <span className="text-white font-semibold">{metrics.ordersInfluencedCount} pairs</span> converted from WhatsApp/DMs
          </div>
        </div>

        {/* Card 3: COD RTO Cut */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-sm hover:border-stone-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">COD Return (RTO) Prevented</span>
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400 font-heading">
              {metrics.codRtoPreventedCount} Orders
            </span>
          </div>
          <div className="mt-2 text-xs text-stone-400 flex items-center justify-between">
            <span>Saved ~₹{metrics.estimatedRtoSavingsINR.toLocaleString('en-IN')} in freight</span>
            <span className="text-[10px] bg-cyan-900/40 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-700/40">
              {metrics.codOrdersConfirmed} Confirmed
            </span>
          </div>
        </div>

        {/* Card 4: Response Time */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-sm hover:border-stone-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Avg AI Response Time</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-heading">{metrics.avgResponseTimeSeconds}s</span>
            <span className="text-xs text-stone-400">instant 24/7 replies</span>
          </div>
          <div className="mt-2 text-xs text-stone-400">
            Prevents ad clicks from going cold at 1 AM
          </div>
        </div>
      </div>

      {/* Main Grid: Handoff Preview & Live Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Needs You Queue Preview & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse"></span>
                <h3 className="text-base font-semibold text-white font-heading">Needs You Inbox (High Intent / Escalations)</h3>
              </div>
              <button
                onClick={() => onNavigateTab('needs-you')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                View all ({needsYouConversations.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-800/80 mt-2">
              {needsYouConversations.length === 0 ? (
                <div className="py-8 text-center text-stone-500 text-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All customer queries are smoothly handled by SoleAI!
                </div>
              ) : (
                needsYouConversations.map(conv => (
                  <div key={conv.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-800/30 px-2 rounded-xl transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-stone-100">{conv.customerName}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                          {conv.channel}
                        </span>
                        {conv.handoffReason && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50">
                            {conv.handoffReason.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 line-clamp-1 italic">
                        "{conv.lastMessageSnippet}"
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigateTab('needs-you')}
                      className="self-start sm:self-center px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 rounded-lg text-xs font-medium transition-all"
                    >
                      Take Over Chat
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Simulation Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-amber-950/20 to-stone-900 border border-amber-800/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-semibold text-white">Experience SoleAI in action</h4>
              </div>
              <p className="text-xs text-stone-400">
                Test how SoleAI handles Hindi/English sizing advice, stock availability, and 1-tap COD confirmations.
              </p>
            </div>
            <button
              onClick={onOpenWhatsApp}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" /> Open WhatsApp Simulator
            </button>
          </div>
        </div>

        {/* Right Col: Recent Orders & COD Status */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h3 className="text-base font-semibold text-white font-heading">Recent Orders Feed</h3>
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                View all
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {recentOrders.map(ord => (
                <div key={ord.id} className="p-3 bg-stone-950/60 border border-stone-800/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200">{ord.orderNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                      ord.codStatus === 'verified_by_shopper'
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                        : ord.codStatus === 'pending_confirmation'
                        ? 'bg-amber-950/80 text-amber-400 border-amber-800/60 animate-pulse'
                        : ord.codStatus === 'cancelled_prevented_rto'
                        ? 'bg-red-950/80 text-red-400 border-red-800/60'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}>
                      {ord.codStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <img src={ord.shoeImage} alt={ord.shoeName} className="w-10 h-10 rounded-lg object-cover border border-stone-800" />
                    <div className="text-xs">
                      <p className="font-medium text-stone-200 line-clamp-1">{ord.shoeName}</p>
                      <p className="text-stone-400">Size UK {ord.sizeUK} • ₹{ord.amountINR} ({ord.paymentMethod})</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-800/60">
                    <span>{ord.customerName} ({ord.deliveryCity})</span>
                    <span>{ord.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
            <span>COD Confirmation Rate</span>
            <span className="text-emerald-400 font-semibold font-mono">82.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
