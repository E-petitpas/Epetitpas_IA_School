// ========================================
// E-petitpas AI School - AI Questions Routes
// ========================================

import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authenticateToken, requireUser } from '../middleware/auth';
import { validateSchema, createQuestionSchema, questionFilterSchema } from '../validators';
import { apiLimiter } from '../middleware';
import { z } from 'zod';

const router = Router();

// Apply authentication to all AI routes
router.use(authenticateToken);
router.use(requireUser); // Only authenticated users (not guests)

// ===============================
// AI QUESTION ROUTES
// ===============================

/**
 * POST /api/v1/questions
 * Create a new AI question
 */
router.post(
  '/',
  apiLimiter, // More restrictive rate limiting for AI generation
  validateSchema(createQuestionSchema),
  AIController.createQuestion
);

/**
 * GET /api/v1/questions
 * Get user's questions with pagination and filters
 */
router.get(
  '/',
  validateSchema(questionFilterSchema, 'query'),
  AIController.getUserQuestions
);

/**
 * GET /api/v1/questions/quota/status
 * Get user's current quota status
 * Note: This route must be before /:id to avoid conflicts
 */
router.get(
  '/quota/status',
  AIController.getQuotaStatus
);

/**
 * GET /api/v1/questions/stats/overview
 * Get user's question statistics
 */
router.get(
  '/stats/overview',
  AIController.getQuestionStats
);

/**
 * GET /api/v1/questions/subjects
 * Get available subjects and grade levels
 */
router.get(
  '/subjects',
  AIController.getAvailableSubjects
);

/**
 * GET /api/v1/questions/:id
 * Get a specific question by ID
 */
router.get(
  '/:id',
  validateSchema(z.object({
    id: z.string().cuid('Invalid question ID')
  }), 'params'),
  AIController.getQuestionById
);

/**
 * PATCH /api/v1/questions/:id/bookmark
 * Toggle bookmark status of a question
 */
router.patch(
  '/:id/bookmark',
  validateSchema(z.object({
    id: z.string().cuid('Invalid question ID')
  }), 'params'),
  AIController.toggleBookmark
);

/**
 * DELETE /api/v1/questions/:id
 * Delete a question
 */
router.delete(
  '/:id',
  validateSchema(z.object({
    id: z.string().cuid('Invalid question ID')
  }), 'params'),
  AIController.deleteQuestion
);

/**
 * POST /api/v1/questions/bulk-delete
 * Delete multiple questions
 */
router.post(
  '/bulk-delete',
  validateSchema(z.object({
    questionIds: z.array(z.string().cuid()).min(1, 'At least one question ID is required').max(50, 'Maximum 50 questions per batch')
  })),
  AIController.bulkDeleteQuestions
);

export default router;