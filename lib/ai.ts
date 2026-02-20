import { GoogleGenAI } from "@google/genai";

/**
 * Lumina Quest AI Servisi
 * Not: Kelime üretimi ve Lore mevcut değildir. 
 * Bu sınıf gelecekteki olası yardımcı asistan özellikleri için iskelet olarak bırakılmıştır.
 */
export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  }

  // Gelecekte eklenebilecek yardımcı özellikler için ayrılmıştır.
}

export const aiService = new AIService();