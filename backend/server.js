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
import authRoutes from './routes/authRoutes.js';

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
// Always allow finovert.com + any Vercel preview + localhost for dev
const ALWAYS_ALLOWED = [
  'https://www.finovert.com',
  'https://finovert.com',
];

const allowedOrigins = IS_PROD
  ? [...ALWAYS_ALLOWED, CLIENT_ORIGIN].filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.finovert.com')
    ) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked origin: ${origin}`);
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

// Fallback for missing old uploads
app.use('/uploads', (req, res) => {
  res.status(404).setHeader('Content-Type', 'image/svg+xml').send(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="100%" height="100%" fill="#f8d7da"/>
      <text x="50%" y="45%" font-family="sans-serif" font-size="20" fill="#721c24" text-anchor="middle" font-weight="bold">Legacy File No Longer Available</text>
      <text x="50%" y="55%" font-family="sans-serif" font-size="14" fill="#721c24" text-anchor="middle">This file was deleted when the server restarted.</text>
      <text x="50%" y="65%" font-family="sans-serif" font-size="14" fill="#721c24" text-anchor="middle">Please request a new upload from the user.</text>
    </svg>
  `);
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
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

// ─── Start Server (port first, then DB) ──────────────────────────────────────
// We start the HTTP server FIRST so Render's port health check passes immediately.
// MongoDB connects asynchronously after the port is open.
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('⚠️  Server will continue running but DB operations will fail.');
    console.error('⚠️  Check that MongoDB Atlas allows connections from 0.0.0.0/0');
  });

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n⚠️  Received ${signal}. Closing server...`);
  server.close(() => {
    mongoose.connection.close().then(() => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

