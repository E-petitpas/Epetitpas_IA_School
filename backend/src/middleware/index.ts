// ========================================
// E-petitpas AI School - Middleware Configuration
// ========================================

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { ResponseUtil } from '../utils/response';
import { AppError } from '../types';

/**
 * Configure CORS options
 */
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://mcnryknytizgivoukjlq.supabase.co',
        'https://e-petitpas.fr',
        'https://app.e-petitpas.fr'
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

/**
 * Configure rate limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * API-specific rate limiting (more restrictive)
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 API requests per windowMs
  message: {
    success: false,
    error: 'API rate limit exceeded, please try again later',
    code: 'API_RATE_LIMIT_EXCEEDED'
  }
});

/**
 * Auth endpoints rate limiting (very restrictive)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  }
});

/**
 * Error handling middleware
 */
export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Handle known operational errors
  if (error instanceof AppError) {
    ResponseUtil.error(res, error.message, error.statusCode, error.code);
    return;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        ResponseUtil.error(res, 'Resource already exists', 409, 'DUPLICATE_RESOURCE');
        return;
      case 'P2025':
        ResponseUtil.notFound(res, 'Resource not found');
        return;
      default:
        ResponseUtil.internalError(res, 'Database error');
        return;
    }
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    ResponseUtil.validationError(res, error.message);
    return;
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && 'body' in error) {
    ResponseUtil.error(res, 'Invalid JSON format', 400, 'INVALID_JSON');
    return;
  }

  // Default to internal server error
  ResponseUtil.internalError(res, 
    process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : error.message
  );
}

/**
 * 404 handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  ResponseUtil.notFound(res, `Route ${req.method} ${req.path} not found`);
}

/**
 * Request logging configuration
 */
const morganFormat = process.env.NODE_ENV === 'production' 
  ? 'combined' 
  : 'dev';

/**
 * Apply all middleware to Express app
 */
export function configureMiddleware(app: Application): void {
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false
  }));

  // CORS
  app.use(cors(corsOptions));

  // Rate limiting
  app.use(limiter);

  // Request logging
  app.use(morgan(morganFormat));

  // Compression
  app.use(compression());

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Trust proxy (for rate limiting and logging behind reverse proxies)
  app.set('trust proxy', 1);
}