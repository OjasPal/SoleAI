import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      aria-label="Sub-navigation"
      className={`inline-flex items-center gap-1 p-1 bg-bg-sunken border border-line rounded-pill ${className}`}
    >
      {items.map(tab => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`h-8 px-3.5 rounded-pill text-small font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? 'bg-white text-black font-semibold shadow-panel'
                : 'text-text-2 hover:text-text hover:bg-white/[0.04]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-pill font-mono font-bold ${
                  isActive ? 'bg-black/15 text-black' : 'bg-white/[0.08] text-text-3'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
