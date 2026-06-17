export interface User {
  id: string;
  email: string;
  display_name: string | null;
  is_email_verified: boolean;
  created_at: string;
  tier: 'free' | 'pro' | 'plus';
}

export interface Subscription {
  tier: string;
  status: string;
  billing_period: string;
  current_period_end: string | null;
  pdf_limit: number;
  card_limit: number;
}

export interface Deck {
  id: string;
  user_id: string;
  name: string;
  subject_tag: string | null;
  card_count: number;
  mastery_pct: number;
  last_reviewed_at: string | null;
  created_at: string;
  cards?: Card[];
}

export interface Card {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  source_reference: string | null;
  confidence_score: number;
  topic_tag: string | null;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CardInput {
  front: string;
  back: string;
  source_reference?: string;
  confidence_score: number;
  topic_tag?: string;
}

export interface CardPreview {
  front: string;
  back: string;
  source_reference: string;
  confidence_score: number;
  topic_tag: string;
}

export interface Upload {
  id: string;
  user_id: string;
  filename: string;
  source_type: 'pdf' | 'text';
  page_count: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  created_at: string;
  preview_cards?: CardPreview[];
  all_cards?: CardPreview[];
}

export interface DashboardStats {
  current_streak: number;
  longest_streak: number;
  today_due: number;
  tomorrow_due: number;
  subject_mastery: Record<string, number>;
}

export interface Insight {
  insights: string[];
  mastery_map?: Record<string, number>;
}

export interface ReviewQueue {
  cards: Card[];
  total_count: number;
}

export interface CheckoutResponse {
  price_id: string;
  client_token: string;
}

export interface TransactionVerify {
  status: 'active' | string;
  tier: string;
}

export interface APIKeyResponse {
  key_masked: string;
  exists: boolean;
}

export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface SessionSummary {
  status: string;
  cards_reviewed: number;
  new_cards: number;
  retention_delta: number;
  streak_updated: boolean;
}