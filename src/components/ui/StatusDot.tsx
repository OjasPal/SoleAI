import React from 'react';

export type StatusVariant = 'ok' | 'warn' | 'risk' | 'accent' | 'neutral';

export interface StatusDotProps {
  status: StatusVariant;
  label?: string;
  pulse?: boolean;
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  label,
  pulse = false,
  className = '',
}) => {
  const dotColorClass = {
    ok: 'bg-ok',
    warn: 'bg-warn',
    risk: 'bg-risk',
    accent: 'bg-accent',
    neutral: 'bg-text-3',
  }[status];

  const textColorClass = {
    ok: 'text-ok',
    warn: 'text-warn',
    risk: 'text-risk',
    accent: 'text-accent',
    neutral: 'text-text-3',
  }[status];

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-1.5 w-1.5 items-center justify-center">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${dotColorClass}`}
          />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dotColorClass}`} />
      </span>
      {label && (
        <span className={`text-small font-medium ${textColorClass}`}>
          {label}
        </span>
      )}
    </span>
  );
};
