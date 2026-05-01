import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Routes
import blogRoutes from './routes/blogRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import subadminRoutes from './routes/subadminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

// ─── Config ───────────────────────────────────────────────────────────────────
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finovert';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// ─── Ensure uploads directory exists ──────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ─── App ──────────────────────────────────────────────────────────────────────
const app = express();

// Trust proxy for rate-limiting behind Render's load balancer
if (IS_PROD) {
  app.set('trust proxy', 1);
}

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to load from frontend
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = IS_PROD
  ? [CLIENT_ORIGIN]
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
});

const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  message: { message: 'Too many uploads. Please wait before uploading again.' },
});

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: { message: 'Email sending limit reached. Try again in an hour.' },
});

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(compression());
app.use(morgan(IS_PROD ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir, {
  maxAge: IS_PROD ? '7d' : 0,
  etag: true,
}));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);
app.use('/api/blogs', blogRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/subadmins', subadminRoutes);
app.use('/api/upload', uploadLimiter, uploadRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/email', emailLimiter, emailRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = IS_PROD && status === 500 ? 'Internal server error.' : err.message;
  if (status >= 500) console.error('[ERROR]', err);
  res.status(status).json({ message });
});

// ─── Database + Server ────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n⚠️  Received ${signal}. Closing server...`);
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();
