export type Role = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  image?: string; // Base64 string
  timestamp: number;
}

export interface UsageStats {
  textCount: number;
  imageCount: number;
}

export interface LimitConfig {
  maxText: number;
  maxImages: number;
}

export interface GeminiResponse {
  text: string;
  error?: string;
}