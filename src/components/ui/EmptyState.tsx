import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`py-12 px-4 text-center flex flex-col items-center justify-center gap-3 ${className}`}>
      <p className="text-body text-text-3 font-normal max-w-sm">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
