import React from 'react';
import { Sidebar, SurfaceView, DashboardTab } from './Sidebar';

export interface AppShellProps {
  surface: SurfaceView;
  dashboardTab: DashboardTab;
  onSelectSurface: (surface: SurfaceView) => void;
  onSelectDashboardTab: (tab: DashboardTab) => void;
  needsYouCount: number;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  surface,
  dashboardTab,
  onSelectSurface,
  onSelectDashboardTab,
  needsYouCount,
  children,
}) => {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col md:flex-row antialiased font-sans">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 px-4 py-2 bg-white text-black font-medium rounded-pill"
      >
        Skip to main content
      </a>

      {/* Persistent Left Sidebar */}
      <Sidebar
        surface={surface}
        dashboardTab={dashboardTab}
        onSelectSurface={onSelectSurface}
        onSelectDashboardTab={onSelectDashboardTab}
        needsYouCount={needsYouCount}
      />

      {/* Main Content Viewport */}
      <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 outline-none">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};
