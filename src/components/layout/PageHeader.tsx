import React from 'react';

export interface PageHeaderProps {
  primaryTitle: string;
  secondaryTitle?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  primaryTitle,
  secondaryTitle,
  description,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-line ${className}`}>
      <div className="space-y-1.5 max-w-2xl">
        <h1 className="text-h1 font-display tracking-tight leading-tight">
          <span className="text-text">{primaryTitle}</span>
          {secondaryTitle && (
            <> <span className="text-text-3 font-normal">{secondaryTitle}</span></>
          )}
        </h1>
        {description && (
          <p className="text-small text-text-2">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
