import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Layers, 
  ShoppingBag, 
  BookOpen, 
  ChevronDown, 
  MessageSquareShare, 
  Store,
  Menu,
  X
} from 'lucide-react';
import { StatusDot } from '../ui/StatusDot';
import { api } from '../../lib/api';

export type SurfaceView = 'dashboard' | 'whatsapp' | 'storefront';
export type DashboardTab = 'overview' | 'needs-you' | 'catalogue' | 'orders' | 'knowledge';

export interface SidebarProps {
  surface: SurfaceView;
  dashboardTab: DashboardTab;
  onSelectSurface: (surface: SurfaceView) => void;
  onSelectDashboardTab: (tab: DashboardTab) => void;
  needsYouCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  surface,
  dashboardTab,
  onSelectSurface,
  onSelectDashboardTab,
  needsYouCount,
}) => {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<boolean | null>(null);

  useEffect(() => {
    api.getStatus()
      .then(res => setGeminiStatus(res.geminiConfigured))
      .catch(() => setGeminiStatus(false));
  }, []);

  const navItems: { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'needs-you', label: 'Needs You', icon: AlertCircle, count: needsYouCount },
    { id: 'catalogue', label: 'Catalogue & Stock', icon: Layers },
    { id: 'orders', label: 'Orders & COD', icon: ShoppingBag },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  ];

  const handleNavClick = (tab: DashboardTab) => {
    onSelectSurface('dashboard');
    onSelectDashboardTab(tab);
    setMobileOpen(false);
  };

  const handleSurfaceSwitch = (target: SurfaceView) => {
    onSelectSurface(target);
    setWorkspaceOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between h-14 px-4 bg-bg border-b border-line sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-text text-body">SoleAI</span>
          <span className="text-text-3 font-mono text-label">/ KicksCraft</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className="p-2 text-text-2 hover:text-text cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-bg-raised border-r border-line flex flex-col justify-between transition-all duration-200 ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-16 lg:w-[232px]'
        }`}
      >
        <div>
          {/* Workspace Switcher */}
          <div className="p-3 border-b border-line relative">
            <button
              onClick={() => setWorkspaceOpen(!workspaceOpen)}
              className="w-full h-10 px-2.5 flex items-center justify-between rounded-panel hover:bg-white/[0.04] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-md bg-white/[0.08] flex items-center justify-center font-display font-bold text-xs text-text flex-shrink-0">
                  S
                </div>
                <div className="hidden lg:block truncate">
                  <div className="text-small font-medium text-text leading-tight truncate">
                    SoleAI <span className="text-text-3">/ KicksCraft</span>
                  </div>
                  <div className="text-[10px] text-text-3 uppercase tracking-wider font-mono">
                    {surface === 'dashboard' ? 'Merchant' : surface === 'whatsapp' ? 'WhatsApp' : 'Store'}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-3 group-hover:text-text hidden lg:block" />
            </button>

            {/* Workspace Switcher Popover */}
            {workspaceOpen && (
              <div className="absolute top-14 left-3 right-3 z-50 bg-bg border border-line-strong rounded-panel p-1.5 shadow-2xl space-y-1">
                <button
                  onClick={() => handleSurfaceSwitch('dashboard')}
                  className={`w-full px-2.5 py-2 rounded-panel text-left flex items-center gap-2 text-small transition-colors cursor-pointer ${
                    surface === 'dashboard' ? 'bg-white text-black font-semibold' : 'text-text hover:bg-white/[0.05]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Merchant Dashboard</span>
                </button>
                <button
                  onClick={() => handleSurfaceSwitch('whatsapp')}
                  className={`w-full px-2.5 py-2 rounded-panel text-left flex items-center gap-2 text-small transition-colors cursor-pointer ${
                    surface === 'whatsapp' ? 'bg-white text-black font-semibold' : 'text-text hover:bg-white/[0.05]'
                  }`}
                >
                  <MessageSquareShare className="w-4 h-4" />
                  <span>WhatsApp Simulator</span>
                </button>
                <button
                  onClick={() => handleSurfaceSwitch('storefront')}
                  className={`w-full px-2.5 py-2 rounded-panel text-left flex items-center gap-2 text-small transition-colors cursor-pointer ${
                    surface === 'storefront' ? 'bg-white text-black font-semibold' : 'text-text hover:bg-white/[0.05]'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>KicksCraft Storefront</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-2 space-y-0.5" aria-label="Main Navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = surface === 'dashboard' && dashboardTab === item.id;
              const hasAlert = item.count !== undefined && item.count > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  className={`w-full h-10 px-2.5 rounded-panel flex items-center justify-between text-small transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white/[0.06] text-text font-medium border border-line'
                      : 'text-text-2 hover:text-text hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-text' : 'text-text-3'}`} />
                    <span className="hidden lg:inline truncate">{item.label}</span>
                  </div>

                  {hasAlert && (
                    <div className="flex items-center gap-1.5">
                      <span className="hidden lg:inline text-label font-mono font-bold text-accent">
                        {item.count}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: AI Status line & Demo data pill */}
        <div className="p-3 border-t border-line space-y-2">
          <div className="hidden lg:flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-3">
              Integrations: simulated
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-pill bg-white/[0.05] border border-line text-text-3">
              Demo
            </span>
          </div>

          <div className="flex items-center gap-2 px-1">
            <StatusDot
              status={geminiStatus ? 'ok' : 'neutral'}
              label={geminiStatus ? 'Gemini connected' : 'Demo rules engine'}
              className="text-[11px]"
            />
          </div>
        </div>
      </aside>
    </>
  );
};
