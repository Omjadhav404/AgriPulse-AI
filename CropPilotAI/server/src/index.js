import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import advisoryRoutes from './routes/advisoryRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import { isSupabaseConfigured } from './config/supabase.js';
import { isGeminiConfigured } from './config/gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security and middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/advisory', advisoryRoutes);
app.use('/api/farms', farmRoutes);

// Health & Telemetry Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CropPilotAI Agronomic Engine',
    supabaseConnected: isSupabaseConfigured,
    geminiAiActive: isGeminiConfigured,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root API Welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CropPilotAI Backend API',
    endpoints: {
      health: '/api/health',
      advisoryDiagnose: 'POST /api/advisory/diagnose',
      advisoryHistory: 'GET /api/advisory/history',
      farms: 'GET /api/farms',
      dashboardStats: 'GET /api/farms/stats/dashboard'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🌱 CropPilotAI Backend Server running on http://localhost:${PORT}`);
  console.log(`   - Supabase Integration: ${isSupabaseConfigured ? '🟢 Connected' : '🟡 Local Persistence Mode'}`);
  console.log(`   - Gemini AI Engine:     ${isGeminiConfigured ? '🟢 Live Gemini Flash' : '🟡 Heuristic Expert Mode'}`);
  console.log(`=============================================================\n`);
});
