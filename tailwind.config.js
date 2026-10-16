/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-raised': 'var(--bg-raised)',
        'bg-sunken': 'var(--bg-sunken)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        accent: 'var(--accent)',
        ok: 'var(--ok)',
        warn: 'var(--warn)',
        risk: 'var(--risk)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Inter Tight"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        panel: '8px',
        pill: '999px',
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 5.5vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        'display-l': ['clamp(2rem, 3.5vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.035em' }],
        h1: ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        h2: ['1.25rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        body: ['0.875rem', { lineHeight: '1.55' }],
        small: ['0.78125rem', { lineHeight: '1.45' }],
        label: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.08em' }],
      },
      boxShadow: {
        panel: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
};
