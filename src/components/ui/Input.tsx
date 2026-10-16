import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  id,
  className = '',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-small font-medium text-text">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full h-10 px-3.5 bg-bg-sunken border rounded-panel text-body text-text placeholder:text-text-3/60 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none ${
          error ? 'border-risk' : 'border-line hover:border-line-strong'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-small text-risk font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-small text-text-3">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
