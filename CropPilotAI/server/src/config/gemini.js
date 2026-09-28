import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

export const isGeminiConfigured = Boolean(
  apiKey && 
  apiKey.length > 10 && 
  !apiKey.includes('your_gemini_api_key')
);

let geminiClient = null;
let generativeModel = null;

if (isGeminiConfigured) {
  try {
    geminiClient = new GoogleGenerativeAI(apiKey);
    generativeModel = geminiClient.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        responseMimeType: 'application/json'
      }
    });
    console.log('🤖 Google Gemini AI client initialized successfully with model gemini-1.5-flash.');
  } catch (err) {
    console.warn('⚠️ Error initializing Google Gemini client:', err.message);
  }
} else {
  console.log('ℹ️ Running with Agronomic Heuristic AI Engine (Add GEMINI_API_KEY in server/.env for live cloud synthesis).');
}

export { generativeModel };
