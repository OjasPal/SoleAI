# SoleAI

> **"Turn DMs into orders, and cut COD returns."**

SoleAI is sales and customer support automation infrastructure tailored for Indian D2C footwear brands. It bridges customer interactions across WhatsApp, Instagram DMs, and web storefronts directly into orders while automating Cash on Delivery (COD) confirmations to prevent expensive Return-to-Origin (RTO) courier losses.

---

## The Problem in Indian D2C Footwear

1. **Slow DM Conversions**: Late-night ad clicks and Instagram inquiries go cold when founders cannot respond immediately.
2. **High COD RTO Losses**: Brands bleed ₹350–₹450 on two-way courier shipping for every unconfirmed COD delivery refused at doorsteps.
3. **Sizing Uncertainty**: Footwear returns occur largely due to sizing friction (e.g. narrow toe boxes, half-size confusion).
4. **Repetitive Support Inquiries**: Repetitive queries regarding available UK sizes, delivery timeframes, and exchange policies drain hours of merchant bandwidth daily.

---

## Architecture & Features

### 1. Merchant Dashboard
- **Live Command Center**: Real-time tracking of inquiries handled, influenced orders (₹), COD confirmation rates, RTO savings, and AI response latencies.
- **"Needs You" Escalation Queue**: Proactive routing for high-intent customer requests (e.g., custom bulk wedding orders, size exchanges, courier delays) with 1-click founder responses.
- **Footwear Catalogue & Real-Time Stock**: UK size 6 to 11 inventory breakdown, fit guidance rules (*"Runs snug: recommend 1 size up"*), and Shopify/CSV synchronization.
- **COD Confirmation & RTO Guard**: Unified order log with one-tap WhatsApp verification triggers and preemptive cancellation of high-risk fake orders.
- **Knowledge Base & FAQ Gaps**: Automated gap logging for customer queries missing from store policies with 1-click approval.

### 2. Multi-Channel Customer Simulators
- **WhatsApp Commerce Simulator**: Conversational shopping experience supporting fluent English and natural Hinglish, product recommendation cards, live size stock chips, and one-tap COD address confirmation.
- **Storefront Widget**: Floating interactive fit and size advisor embedded directly onto the brand's storefront.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, TypeScript (via `tsx`)
- **Bundler & Dev Server**: Vite
- **AI Engine**: Google GenAI SDK (`@google/genai`) with local footwear heuristic fallback

---

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/OjasPal/SoleAI.git
cd SoleAI

# Install dependencies
npm install
```

### Environment Variables

Configure environment variables via your deployment platform or secret manager (e.g., Google Secret Manager):

| Variable | Description | Required |
|---|---|---|
| `PORT` | Port for the Express server (default `3000`) | Optional |
| `GEMINI_API_KEY` | Google Gemini API Key for conversational sales assistant | Optional (intelligent heuristic fallback used if omitted) |

### Development

```bash
# Start backend and frontend simultaneously
npm run dev
```

The application will be running at `http://localhost:3000`.

### Production Build

```bash
# Compile TypeScript and bundle frontend
npm run build

# Start production server
npm start
```

---

## Project Structure

```
├── docs/
│   └── PRODUCT_SPEC.md        # Product specification and business roadmap
├── src/
│   ├── components/
│   │   ├── CustomerSimulator/ # WhatsApp simulator & demo storefront
│   │   ├── Dashboard/         # Merchant KPI cards, Needs You queue, orders, stock
│   │   └── Navbar.tsx         # Unified navigation
│   ├── data/
│   │   └── mockData.ts        # Footwear models, mock orders & conversations
│   ├── lib/
│   │   └── api.ts             # Typed client-side API layer
│   ├── types/
│   │   └── index.ts           # Domain data models & interfaces
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── server.ts                  # Express backend & API proxy
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## License

MIT
