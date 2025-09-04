// ========================================
// E-petitpas AI School - Validation Schemas
// ========================================

import { z } from 'zod';
import { Role } from '../../generated/prisma';

// ===============================
// USER VALIDATION SCHEMAS
// ===============================

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.nativeEnum(Role).optional().default('USER'),
  preferences: z.object({
    academic_level: z.string().optional(),
    subjects: z.array(z.string()).optional(),
    learning_preferences: z.record(z.boolean()).optional(),
    language: z.string().optional().default('fr'),
    theme: z.enum(['light', 'dark']).optional().default('light'),
    notifications: z.boolean().optional().default(true)
  }).optional()
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  profileImage: z.string().url('Invalid URL format').optional(),
  preferences: z.object({
    academic_level: z.string().optional(),
    subjects: z.array(z.string()).optional(),
    learning_preferences: z.record(z.boolean()).optional(),
    language: z.string().optional(),
    theme: z.enum(['light', 'dark']).optional(),
    notifications: z.boolean().optional()
  }).optional()
});

// ===============================
// AI QUESTION VALIDATION SCHEMAS
// ===============================

export const createQuestionSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  questionText: z.string().min(5, 'Question must be at least 5 characters'),
  questionType: z.enum(['explanation', 'exercise', 'quiz']).optional().default('explanation')
});

export const updateQuestionSchema = z.object({
  isBookmarked: z.boolean().optional(),
  tags: z.array(z.string()).optional()
});

// ===============================
// SUBSCRIPTION VALIDATION SCHEMAS
// ===============================

export const createSubscriptionSchema = z.object({
  planId: z.string().cuid('Invalid plan ID'),
  autoRenew: z.boolean().optional().default(true)
});

export const updateSubscriptionSchema = z.object({
  autoRenew: z.boolean().optional()
});

// ===============================
// REVISION SHEET VALIDATION SCHEMAS
// ===============================

export const createRevisionSheetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  questionIds: z.array(z.string().cuid()).min(1, 'At least one question is required'),
  exportFormat: z.enum(['PDF', 'WORD', 'TXT']).optional().default('PDF')
});

// ===============================
// QUERY PARAMETER SCHEMAS
// ===============================

export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
}).refine(data => data.page >= 1, { message: 'Page must be >= 1', path: ['page'] })
  .refine(data => data.limit >= 1 && data.limit <= 100, { message: 'Limit must be between 1 and 100', path: ['limit'] });

export const questionFilterSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  questionType: z.enum(['explanation', 'exercise', 'quiz']).optional(),
  isBookmarked: z.string().transform(val => val === 'true').optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'subject', 'gradeLevel']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
}).refine(data => data.page >= 1, { message: 'Page must be >= 1', path: ['page'] })
  .refine(data => data.limit >= 1 && data.limit <= 100, { message: 'Limit must be between 1 and 100', path: ['limit'] });

// ===============================
// ADMIN VALIDATION SCHEMAS
// ===============================

export const adminUserUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.nativeEnum(Role).optional(),
  statutCompte: z.enum(['ACTIF', 'INACTIF', 'BLOQUE', 'EN_ATTENTE_VALIDATION']).optional(),
  preferences: z.record(z.any()).optional()
});

export const adminStatsFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  period: z.enum(['day', 'week', 'month', 'year']).optional().default('month')
});

// ===============================
// VALIDATION MIDDLEWARE FACTORY
// ===============================

import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';

export function validateSchema<T>(schema: z.ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = source === 'body' ? req.body : 
                   source === 'query' ? req.query : 
                   req.params;
      
      const result = schema.safeParse(data);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        ResponseUtil.validationError(res, 'Validation failed', errors);
        return;
      }
      
      // Replace the original data with the validated and transformed data
      if (source === 'body') req.body = result.data;
      else if (source === 'query') req.query = result.data as any;
      else req.params = result.data as any;
      
      next();
    } catch (error) {
      console.error('Validation error:', error);
      ResponseUtil.internalError(res, 'Validation processing failed');
    }
  };
}