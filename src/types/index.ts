export type FootwearCategory = 'sneakers' | 'loafers' | 'boots' | 'slides' | 'formals';

export interface ShoeSizeStock {
  sizeUK: number;
  stock: number;
  inStock: boolean;
}

export interface FootwearItem {
  id: string;
  name: string;
  tagline: string;
  category: FootwearCategory;
  priceINR: number;
  originalPriceINR?: number;
  imageUrl: string;
  colorway: string;
  material: string;
  fitGuidance: string; // e.g. "Runs snug. Recommend 1 size up for broad feet."
  sizeRecommendation: 'true_to_size' | 'size_up' | 'size_down';
  sizes: ShoeSizeStock[];
  description: string;
  isBestSeller?: boolean;
  featured?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'merchant';
  text: string;
  timestamp: string;
  recommendedProducts?: FootwearItem[];
  actionType?: 'size_recommendation' | 'checkout_link' | 'cod_confirmation' | 'human_handoff' | 'discount_offer';
  actionData?: {
    shoeId?: string;
    shoeName?: string;
    sizeUK?: number;
    priceINR?: number;
    checkoutUrl?: string;
    discountCode?: string;
    discountPercent?: number;
    orderId?: string;
  };
}

export interface Conversation {
  id: string;
  customerName: string;
  customerPhone: string;
  channel: 'whatsapp' | 'instagram' | 'website';
  status: 'ai_active' | 'needs_merchant' | 'resolved';
  handoffReason?: 'size_dispute' | 'angry_customer' | 'custom_bulk_order' | 'payment_failure' | 'address_verification' | 'discount_negotiation';
  lastMessageSnippet: string;
  lastUpdated: string;
  unreadMerchantCount: number;
  messages: ChatMessage[];
  sentiment: 'positive' | 'neutral' | 'frustrated' | 'ready_to_buy';
  intentDetected?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  channel: 'whatsapp' | 'website' | 'instagram';
  shoeId: string;
  shoeName: string;
  shoeImage: string;
  sizeUK: number;
  amountINR: number;
  paymentMethod: 'COD' | 'UPI' | 'Prepaid_Card';
  codStatus: 'verified_by_shopper' | 'pending_confirmation' | 'cancelled_prevented_rto' | 'shipped' | 'delivered';
  rtoRiskScore: 'low' | 'medium' | 'high';
  createdAt: string;
  deliveryCity: string;
  confirmedAt?: string;
}

export interface UnansweredQuestion {
  id: string;
  question: string;
  frequency: number;
  category: 'sizing' | 'shipping' | 'returns' | 'customization' | 'material';
  sampleCustomerQuery: string;
  firstAsked: string;
  status: 'unresolved' | 'added_to_faq';
  suggestedAnswer?: string;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  languageMode: 'hinglish' | 'english' | 'hindi';
  whatsappNumber: string;
  supportEmail: string;
  maxDiscountPercent: number;
  autoDiscountAllowed: boolean;
  returnPolicyText: string;
  shippingPolicyText: string;
  codPolicyText: string;
  aiPersonaNotes: string;
}

export interface DashboardMetrics {
  totalInquiriesToday: number;
  aiHandledPercentage: number;
  avgResponseTimeSeconds: number;
  ordersInfluencedCount: number;
  ordersInfluencedRevenueINR: number;
  codOrdersConfirmed: number;
  codRtoPreventedCount: number;
  estimatedRtoSavingsINR: number;
  needsYouCount: number;
}
