import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_SHOES,
  INITIAL_BRAND_SETTINGS,
  INITIAL_ORDERS,
  INITIAL_CONVERSATIONS,
  INITIAL_UNANSWERED_QUESTIONS,
  INITIAL_METRICS
} from './src/data/mockData.ts';
import { FootwearItem, Order, Conversation, UnansweredQuestion, BrandSettings, DashboardMetrics, ChatMessage } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-Memory Database Store for SoleAI
let shoesStore: FootwearItem[] = JSON.parse(JSON.stringify(INITIAL_SHOES));
let brandSettingsStore: BrandSettings = JSON.parse(JSON.stringify(INITIAL_BRAND_SETTINGS));
let ordersStore: Order[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
let conversationsStore: Conversation[] = JSON.parse(JSON.stringify(INITIAL_CONVERSATIONS));
let unansweredQuestionsStore: UnansweredQuestion[] = JSON.parse(JSON.stringify(INITIAL_UNANSWERED_QUESTIONS));
let metricsStore: DashboardMetrics = JSON.parse(JSON.stringify(INITIAL_METRICS));

const geminiApiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  } catch (err) {
    console.warn('[SoleAI] Gemini SDK init error:', err);
  }
}

// ---------------- API ENDPOINTS ----------------

// 1. Catalogue
app.get('/api/shoes', (req, res) => {
  res.json(shoesStore);
});

app.post('/api/shoes', (req, res) => {
  const newShoe: FootwearItem = {
    ...req.body,
    id: `shoe-${Date.now()}`
  };
  shoesStore.unshift(newShoe);
  res.status(201).json(newShoe);
});

app.put('/api/shoes/:id', (req, res) => {
  const { id } = req.params;
  const index = shoesStore.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Shoe not found' });
  }
  shoesStore[index] = { ...shoesStore[index], ...req.body };
  res.json(shoesStore[index]);
});

// Update single size stock
app.patch('/api/shoes/:id/stock', (req, res) => {
  const { id } = req.params;
  const { sizeUK, stock } = req.body;
  const shoe = shoesStore.find(s => s.id === id);
  if (!shoe) return res.status(404).json({ error: 'Shoe not found' });

  const sizeObj = shoe.sizes.find(s => s.sizeUK === Number(sizeUK));
  if (sizeObj) {
    sizeObj.stock = Number(stock);
    sizeObj.inStock = sizeObj.stock > 0;
  }
  res.json(shoe);
});

// 2. Orders & COD Confirmation
app.get('/api/orders', (req, res) => {
  res.json(ordersStore);
});

app.post('/api/orders/:id/confirm-cod', (req, res) => {
  const { id } = req.params;
  const order = ordersStore.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.codStatus = 'verified_by_shopper';
  order.confirmedAt = 'Just now';
  metricsStore.codOrdersConfirmed += 1;
  res.json(order);
});

app.post('/api/orders/:id/cancel-cod', (req, res) => {
  const { id } = req.params;
  const order = ordersStore.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.codStatus = 'cancelled_prevented_rto';
  metricsStore.codRtoPreventedCount += 1;
  metricsStore.estimatedRtoSavingsINR += 400; // Average ₹400 two-way courier + packaging saved
  res.json(order);
});

// 3. Conversations & "Needs You" Handoff Queue
app.get('/api/conversations', (req, res) => {
  res.json(conversationsStore);
});

app.post('/api/conversations/:id/reply', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const conv = conversationsStore.find(c => c.id === id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });

  const msg: ChatMessage = {
    id: `m-${Date.now()}`,
    sender: 'merchant',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  conv.messages.push(msg);
  conv.lastMessageSnippet = text;
  conv.lastUpdated = 'Just now';
  conv.unreadMerchantCount = 0;
  res.json(conv);
});

app.post('/api/conversations/:id/resolve', (req, res) => {
  const { id } = req.params;
  const conv = conversationsStore.find(c => c.id === id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });

  conv.status = 'resolved';
  metricsStore.needsYouCount = Math.max(0, metricsStore.needsYouCount - 1);
  res.json(conv);
});

// 4. Unanswered Questions Gap Log
app.get('/api/unanswered-questions', (req, res) => {
  res.json(unansweredQuestionsStore);
});

app.post('/api/unanswered-questions/:id/add-to-faq', (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  const item = unansweredQuestionsStore.find(q => q.id === id);
  if (!item) return res.status(404).json({ error: 'Question not found' });

  item.status = 'added_to_faq';
  item.suggestedAnswer = answer || item.suggestedAnswer;
  res.json(item);
});

// 5. Brand Settings
app.get('/api/brand-settings', (req, res) => {
  res.json(brandSettingsStore);
});

app.put('/api/brand-settings', (req, res) => {
  brandSettingsStore = { ...brandSettingsStore, ...req.body };
  res.json(brandSettingsStore);
});

// 6. Metrics
app.get('/api/metrics', (req, res) => {
  const needsCount = conversationsStore.filter(c => c.status === 'needs_merchant').length;
  metricsStore.needsYouCount = needsCount;
  res.json(metricsStore);
});

// 7. AI Sales & Fit Assistant Endpoint (/api/chat)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], channel = 'website', customerName = 'Customer', customerPhone = '+91 98000 00000' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build context with current footwear catalogue
    const catalogueSummary = shoesStore.map(s => {
      const stockBreakdown = s.sizes.map(sz => `UK ${sz.sizeUK}: ${sz.stock > 0 ? sz.stock + ' in stock' : 'OUT OF STOCK'}`).join(', ');
      return `- [${s.id}] ${s.name} (${s.category}): ₹${s.priceINR}. Fit: "${s.fitGuidance}" (Recommends: ${s.sizeRecommendation}). Stock: [${stockBreakdown}]. Colors: ${s.colorway}. Material: ${s.material}`;
    }).join('\n');

    const systemPrompt = `You are SoleAI, the intelligent sales and order assistant for Indian D2C footwear brand "${brandSettingsStore.brandName}".
Brand Tagline: "${brandSettingsStore.tagline}"
Language Mode: ${brandSettingsStore.languageMode} (Fluent English with natural Indian Hinglish touch when appropriate, e.g. "Arre don't worry", "Size exchange bilkul free hai", "Dispatched in 24 hrs").

STORE POLICIES:
- Returns & Exchanges: ${brandSettingsStore.returnPolicyText}
- Shipping: ${brandSettingsStore.shippingPolicyText}
- Cash on Delivery (COD): ${brandSettingsStore.codPolicyText}
- Max Discount: ${brandSettingsStore.maxDiscountPercent}% (Discount code: "SOLE10"). Only offer if customer asks for discount or hesitates on price.

LIVE CATALOGUE & STOCK:
${catalogueSummary}

YOUR MISSION & BEHAVIORS:
1. "Turn DMs into orders and cut COD returns."
2. Accurate Size & Fit Guidance:
   - Sizing in India is standard UK/India sizing.
   - If a shoe runs snug (e.g. Street Retro), tell them clearly: "Runs slightly snug due to padded collar, recommend sizing 1 up!"
   - Check real stock from the list above. If a size is out of stock (e.g. Astro Low UK 9), tell them gently and suggest nearest available size (UK 10) or alternate model.
3. COD Reassurance:
   - Reassure them that COD is available. Emphasize that free doorstep size exchange is guaranteed so they never worry about ordering the wrong fit.
4. Channel Adaptation:
   - Current channel: ${channel}.
5. Human Handoff Triggers:
   - If customer is furious, threatens a chargeback, asks for bulk wholesale (>10 pairs), or has a complex custom request, acknowledge empathetically and set handoff to human merchant.

FORMAT YOUR RESPONSE:
Respond as a JSON object with this exact shape:
{
  "replyText": "your friendly, natural, consultative response text",
  "matchedShoeIds": ["shoe-1", "shoe-2"], // up to 2 most relevant shoe IDs from catalogue, or empty []
  "actionType": "none" | "size_recommendation" | "checkout_link" | "cod_confirmation" | "human_handoff" | "discount_offer",
  "actionData": {
    "shoeId": "optional shoe ID",
    "shoeName": "optional shoe name",
    "sizeUK": optional number (e.g. 8),
    "priceINR": optional number,
    "discountCode": "optional code",
    "checkoutUrl": "optional URL"
  },
  "needsHumanHandoff": false,
  "handoffReason": "size_dispute" | "angry_customer" | "custom_bulk_order" | "payment_failure" | "address_verification" | null,
  "intent": "e.g. Size advice / COD confirmation / Product inquiry"
}
Ensure the JSON is completely valid without markdown quotes around it, or wrapped in \`\`\`json.`;

    let replyData: any = null;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemPrompt },
                { text: `Customer History: ${JSON.stringify(history.slice(-4))}` },
                { text: `New Customer Message: "${message}"` }
              ]
            }
          ],
          config: {
            temperature: 0.3,
            responseMimeType: 'application/json',
          }
        });

        const rawText = response.text?.trim() || '';
        const cleanJson = rawText.replace(/^```json/, '').replace(/```$/, '').trim();
        replyData = JSON.parse(cleanJson);
      } catch (geminiErr) {
        console.warn('[SoleAI] Gemini API call failed, using intelligent rule engine:', geminiErr);
      }
    }

    // High-fidelity fallback rule engine if Gemini API key is missing or failed
    if (!replyData) {
      replyData = generateIntelligentShoeResponse(message, shoesStore, brandSettingsStore);
    }

    // Attach full shoe objects for recommended products
    let recommendedProducts: FootwearItem[] = [];
    if (replyData.matchedShoeIds && Array.isArray(replyData.matchedShoeIds)) {
      recommendedProducts = shoesStore.filter(s => replyData.matchedShoeIds.includes(s.id));
    }

    // If human handoff triggered, register or update in conversations store
    if (replyData.needsHumanHandoff) {
      metricsStore.needsYouCount += 1;
      const existingConv = conversationsStore.find(c => c.customerPhone === customerPhone || c.customerName === customerName);
      if (existingConv) {
        existingConv.status = 'needs_merchant';
        existingConv.handoffReason = replyData.handoffReason || 'size_dispute';
        existingConv.lastMessageSnippet = message;
        existingConv.unreadMerchantCount += 1;
      }
    }

    res.json({
      replyText: replyData.replyText,
      recommendedProducts,
      actionType: replyData.actionType || 'none',
      actionData: replyData.actionData || null,
      needsHumanHandoff: Boolean(replyData.needsHumanHandoff),
      handoffReason: replyData.handoffReason || null,
      intent: replyData.intent || 'General Footwear Inquiry'
    });
  } catch (err: any) {
    console.error('[SoleAI] Chat error:', err);
    res.status(500).json({
      replyText: "Arre, I am having a quick sync with our inventory system. What size and style are you looking for?",
      recommendedProducts: [shoesStore[0]],
      actionType: 'none',
      needsHumanHandoff: false
    });
  }
});

// Intelligent Footwear Heuristic Engine for instant, reliable replies
function generateIntelligentShoeResponse(query: string, shoes: FootwearItem[], brand: BrandSettings) {
  const q = query.toLowerCase();

  // Check for bulk or escalation handoff
  if (q.includes('bulk') || q.includes('wholesale') || q.includes('10 pairs') || q.includes('wedding party') || q.includes('custom initials') || q.includes('angry') || q.includes('cheat') || q.includes('complaint')) {
    return {
      replyText: "I've flagged this directly to our brand founder so we can personally assist you with priority. One moment while I loop them in!",
      matchedShoeIds: [],
      actionType: 'human_handoff',
      needsHumanHandoff: true,
      handoffReason: q.includes('bulk') || q.includes('wedding') ? 'custom_bulk_order' : 'angry_customer',
      intent: 'Priority Merchant Handoff'
    };
  }

  // Check for COD / Return / Delivery questions
  if (q.includes('cod') || q.includes('cash on delivery')) {
    return {
      replyText: `Yes, Cash on Delivery (COD) is available across India! To prevent courier delays, you will receive a quick 1-tap confirmation. And don't worry about fit—size exchanges are 100% free doorstep pickup!`,
      matchedShoeIds: [shoes[0].id],
      actionType: 'cod_confirmation',
      actionData: {
        shoeId: shoes[0].id,
        shoeName: shoes[0].name,
        priceINR: shoes[0].priceINR
      },
      needsHumanHandoff: false,
      intent: 'COD Availability & Assurance'
    };
  }

  if (q.includes('return') || q.includes('exchange') || q.includes('replace')) {
    return {
      replyText: `We have a hassle-free 7-day doorstep exchange policy! If the shoes feel too tight or loose, we pick them up from your doorstep and swap the size for FREE. No questions asked.`,
      matchedShoeIds: [],
      actionType: 'size_recommendation',
      needsHumanHandoff: false,
      intent: 'Exchange & Return Assurance'
    };
  }

  // Check for discounts
  if (q.includes('discount') || q.includes('coupon') || q.includes('offer') || q.includes('sasta') || q.includes('kam')) {
    return {
      replyText: `Special surprise for you! You can use code "SOLE10" for an instant 10% OFF your first handcrafted pair today. Shall I apply it to your cart?`,
      matchedShoeIds: [shoes[0].id, shoes[1].id],
      actionType: 'discount_offer',
      actionData: {
        discountCode: 'SOLE10',
        discountPercent: 10
      },
      needsHumanHandoff: false,
      intent: 'Discount Offer'
    };
  }

  // Check specific shoe mentions
  const matched = shoes.find(s =>
    q.includes(s.name.toLowerCase()) ||
    q.includes(s.category.toLowerCase()) ||
    (q.includes('chai') && s.id === 'shoe-1') ||
    (q.includes('retro') && s.id === 'shoe-2') ||
    (q.includes('loafer') && s.id === 'shoe-3') ||
    (q.includes('chelsea') && s.id === 'shoe-4') ||
    (q.includes('slide') && s.id === 'shoe-5')
  );

  if (matched) {
    // Sizing question for specific shoe
    if (q.includes('size') || q.includes('fit') || q.includes('snug') || q.includes('tight')) {
      const stockInfo = matched.sizes.map(sz => `UK ${sz.sizeUK}${sz.inStock ? '' : ' (Sold Out)'}`).join(', ');
      return {
        replyText: `For the ${matched.name}: ${matched.fitGuidance} Live sizes available: ${stockInfo}. What is your normal sneaker size?`,
        matchedShoeIds: [matched.id],
        actionType: 'size_recommendation',
        actionData: {
          shoeId: matched.id,
          shoeName: matched.name,
          priceINR: matched.priceINR
        },
        needsHumanHandoff: false,
        intent: 'Shoe Fit & Size Inquiry'
      };
    }

    return {
      replyText: `The ${matched.name} (₹${matched.priceINR}) is one of our most loved silhouettes! ${matched.tagline}. Material: ${matched.material}. Would you like to check size availability or order via COD/UPI?`,
      matchedShoeIds: [matched.id],
      actionType: 'checkout_link',
      actionData: {
        shoeId: matched.id,
        shoeName: matched.name,
        priceINR: matched.priceINR,
        checkoutUrl: `https://kickscraft.in/checkout/${matched.id}`
      },
      needsHumanHandoff: false,
      intent: 'Product Discovery'
    };
  }

  // Default discovery
  return {
    replyText: `Hey there! Welcome to ${brand.brandName}. Looking for daily sneakers, chunky retros, loafers, or recovery slides? Tell me your occasion or usual UK size and I'll find your perfect fit!`,
    matchedShoeIds: [shoes[0].id, shoes[1].id, shoes[2].id],
    actionType: 'size_recommendation',
    needsHumanHandoff: false,
    intent: 'General Greeting & Discovery'
  };
}

// ---------------- SERVE STATIC / VITE MIDDLEWARE ----------------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // In dev, use Vite's dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SoleAI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[SoleAI] Failed to start server:', err);
  process.exit(1);
});
