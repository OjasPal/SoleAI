// Indian Rupee currency and number formatting utilities

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumberIN(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatPercent(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function formatRelativeTime(dateString: string): string {
  // If already relative (e.g., '12 mins ago'), return as-is
  if (dateString.includes('ago') || dateString === 'Yesterday' || dateString === 'Just now') {
    return dateString;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}
