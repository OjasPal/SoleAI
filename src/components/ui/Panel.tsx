import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  highlight?: boolean;
  sunken?: boolean;
}

export const Panel: React.FC<PanelProps> = ({
  highlight = false,
  sunken = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-panel border border-line ${
        sunken ? 'bg-bg-sunken' : 'bg-bg-raised'
      } ${highlight ? 'shadow-panel' : ''} hover:border-line-strong transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
