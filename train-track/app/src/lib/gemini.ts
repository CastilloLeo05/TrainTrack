// src/lib/gemini.ts
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing GEMINI_API_KEY in .env.local');
}

export const gemini = new GoogleGenAI({ apiKey });
