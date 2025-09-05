// ========================================
// E-petitpas AI School - TypeScript Types
// ========================================

import { Request } from 'express';
import { Role, StatutCompte, SubscriptionStatus } from '../../generated/prisma';

// ===============================
// AUTH TYPES
// ===============================

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  statutCompte: StatutCompte;
  preferences?: any;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    role?: Role;
    academic_level?: string;
  };
}

// ===============================
// API RESPONSE TYPES
// ===============================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ===============================
// VALIDATION TYPES
// ===============================

export interface CreateUserData {
  email: string;
  name: string;
  role?: Role;
  preferences?: any;
}

export interface UpdateUserData {
  name?: string;
  preferences?: any;
  profileImage?: string;
}

export interface CreateQuestionData {
  subject: string;
  gradeLevel: string;
  questionText: string;
}

export interface AIQuestionResponse {
  id: string;
  questionText: string;
  aiResponse: string;
  steps?: any;
  quiz?: any;
  subject: string;
  gradeLevel: string;
  createdAt: Date;
}

export interface SubscriptionData {
  planId: string;
  autoRenew?: boolean;
}

// ===============================
// ERROR TYPES
// ===============================

export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ===============================
// QUOTA TYPES
// ===============================

export interface QuotaInfo {
  used: number;
  limit: number;
  remaining: number;
  resetAt: Date;
}

// ===============================
// SUBSCRIPTION TYPES
// ===============================

export interface SubscriptionInfo {
  id: string;
  planName: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  features: {
    dailyQuestionsLimit: number;
    canGenerateQuizzes: boolean;
    canExportFiles: boolean;
    hasAdvancedStats: boolean;
  };
}