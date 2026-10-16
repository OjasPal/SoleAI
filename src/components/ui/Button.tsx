import React, { forwardRef, useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'icon';
  loading?: boolean;
  destructiveConfirmText?: string;
  onConfirmDestructive?: () => void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  destructiveConfirmText = 'Confirm?',
  onConfirmDestructive,
  onClick,
  ...props
}, ref) => {
  const [confirming, setConfirming] = useState(false);

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-pill transition-all select-none active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  const sizeStyles = {
    sm: 'h-8 px-3.5 text-small gap-1.5',
    md: 'h-10 px-5 text-body gap-2',
    icon: 'h-9 w-9 p-0 flex items-center justify-center',
  }[size];

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles = 'bg-white text-black hover:bg-neutral-200 shadow-panel';
  } else if (variant === 'secondary') {
    variantStyles = 'bg-transparent text-text border border-line hover:border-line-strong hover:bg-white/[0.03]';
  } else if (variant === 'ghost') {
    variantStyles = 'bg-transparent text-text-2 hover:text-text hover:bg-white/[0.04]';
  } else if (variant === 'destructive') {
    variantStyles = 'bg-transparent text-risk hover:underline p-0 h-auto rounded-none';
  }

  if (variant === 'destructive' && confirming) {
    return (
      <div className="inline-flex items-center gap-2">
        <button
          ref={ref}
          type="button"
          onClick={() => {
            setConfirming(false);
            onConfirmDestructive?.();
          }}
          className="text-risk font-semibold text-small underline hover:text-red-400 cursor-pointer"
        >
          {destructiveConfirmText}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-text-3 text-small hover:text-text cursor-pointer"
        >
          Cancel
        </button>
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'destructive') {
      setConfirming(true);
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {children}
          {variant === 'secondary' && size !== 'icon' && (
            <ChevronRight className="w-3.5 h-3.5 opacity-60 ml-0.5" />
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
