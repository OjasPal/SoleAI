import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-bg-raised border border-line rounded-panel w-fit" aria-label="Assistant is typing">
      <span className="w-1.5 h-1.5 rounded-full bg-text-3 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-text-3 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-text-3 animate-bounce" />
    </div>
  );
};
