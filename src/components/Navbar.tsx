import React from 'react';
import { 
  Footprints, 
  LayoutDashboard, 
  MessageSquareShare, 
  ShoppingBag, 
  AlertCircle, 
  Sparkles,
  Zap
} from 'lucide-react';

interface NavbarProps {
  activeView: 'dashboard' | 'whatsapp' | 'storefront';
  dashboardTab: 'overview' | 'needs-you' | 'catalogue' | 'orders' | 'knowledge';
  onSelectView: (view: 'dashboard' | 'whatsapp' | 'storefront') => void;
  onSelectDashboardTab: (tab: 'overview' | 'needs-you' | 'catalogue' | 'orders' | 'knowledge') => void;
  needsYouCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  dashboardTab,
  onSelectView,
  onSelectDashboardTab,
  needsYouCount,
}) => {
  return (
    <header className="bg-stone-900/90 backdrop-blur-md border-b border-stone-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Mission */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectView('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-900/30 text-white font-bold">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg text-white tracking-tight">SoleAI</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> For Footwear D2C
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">Turn DMs into orders & cut COD returns</p>
            </div>
          </div>

          {/* Main View Switcher (Dashboard vs Customer WhatsApp vs Demo Store) */}
          <nav className="flex items-center space-x-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => onSelectView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'dashboard'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Merchant Dashboard</span>
              {needsYouCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                  {needsYouCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectView('whatsapp')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <MessageSquareShare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Bot Simulator</span>
            </button>

            <button
              onClick={() => onSelectView('storefront')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'storefront'
                  ? 'bg-stone-700 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>KicksCraft Storefront</span>
            </button>
          </nav>

          {/* Live Status indicator */}
          <div className="hidden lg:flex items-center space-x-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Shopify + WhatsApp Synced</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800/60 border border-stone-700/60 text-stone-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Response: ~1.8s</span>
            </div>
          </div>
        </div>

        {/* Dashboard Sub-tabs when on Merchant Dashboard view */}
        {activeView === 'dashboard' && (
          <div className="flex space-x-1 sm:space-x-4 border-t border-stone-800/80 py-2 overflow-x-auto text-xs sm:text-sm">
            <button
              onClick={() => onSelectDashboardTab('overview')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                dashboardTab === 'overview'
                  ? 'bg-stone-800 text-amber-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Overview & KPIs
            </button>

            <button
              onClick={() => onSelectDashboardTab('needs-you')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                dashboardTab === 'needs-you'
                  ? 'bg-stone-800 text-red-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span>Needs You (Handoffs)</span>
              {needsYouCount > 0 && (
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {needsYouCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectDashboardTab('catalogue')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                dashboardTab === 'catalogue'
                  ? 'bg-stone-800 text-amber-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Live Catalogue & Stock (UK 6-11)
            </button>

            <button
              onClick={() => onSelectDashboardTab('orders')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                dashboardTab === 'orders'
                  ? 'bg-stone-800 text-amber-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Orders & COD Confirmation
            </button>

            <button
              onClick={() => onSelectDashboardTab('knowledge')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                dashboardTab === 'knowledge'
                  ? 'bg-stone-800 text-amber-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Tone, Policies & FAQ Gaps
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
