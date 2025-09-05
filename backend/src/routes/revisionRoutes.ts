// ========================================
// E-petitpas AI School - Revision Sheet Routes
// ========================================

import { Router } from 'express';
import { RevisionController } from '../controllers/revisionController';
import { authenticateToken, requireUser } from '../middleware/auth';
import { validateSchema } from '../validators';
import { z } from 'zod';
import { ExportFormat } from '../../generated/prisma';

const router = Router();

// Apply authentication to all revision routes
router.use(authenticateToken);
router.use(requireUser); // Only authenticated users (not guests)

// ===============================
// REVISION SHEET VALIDATION SCHEMAS
// ===============================

const createRevisionSheetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject too long'),
  gradeLevel: z.string().min(1, 'Grade level is required').max(50, 'Grade level too long'),
  questionIds: z.array(z.string().cuid()).min(1, 'At least one question is required').max(50, 'Maximum 50 questions per revision sheet'),
  exportFormat: z.nativeEnum(ExportFormat).optional()
});

const revisionFilterSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  exportFormat: z.nativeEnum(ExportFormat).optional(),
  search: z.string().optional()
});

const updateRevisionSheetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject too long').optional(),
  gradeLevel: z.string().min(1, 'Grade level is required').max(50, 'Grade level too long').optional()
});

const downloadSchema = z.object({
  format: z.nativeEnum(ExportFormat).optional()
});

// ===============================
// REVISION SHEET ROUTES
// ===============================

/**
 * POST /api/v1/revision-sheets
 * Create a new revision sheet from selected questions
 */
router.post(
  '/',
  validateSchema(createRevisionSheetSchema),
  RevisionController.createRevisionSheet
);

/**
 * GET /api/v1/revision-sheets
 * Get user's revision sheets with pagination and filters
 */
router.get(
  '/',
  validateSchema(revisionFilterSchema, 'query'),
  RevisionController.getUserRevisionSheets
);

/**
 * GET /api/v1/revision-sheets/stats/overview
 * Get user's revision sheet statistics
 * Note: This route must be before /:id to avoid conflicts
 */
router.get(
  '/stats/overview',
  RevisionController.getRevisionStats
);

/**
 * GET /api/v1/revision-sheets/:id
 * Get a specific revision sheet by ID
 */
router.get(
  '/:id',
  validateSchema(z.object({
    id: z.string().cuid('Invalid revision sheet ID')
  }), 'params'),
  RevisionController.getRevisionSheet
);

/**
 * PATCH /api/v1/revision-sheets/:id
 * Update a revision sheet
 */
router.patch(
  '/:id',
  validateSchema(z.object({
    id: z.string().cuid('Invalid revision sheet ID')
  }), 'params'),
  validateSchema(updateRevisionSheetSchema),
  RevisionController.updateRevisionSheet
);

/**
 * DELETE /api/v1/revision-sheets/:id
 * Delete a revision sheet
 */
router.delete(
  '/:id',
  validateSchema(z.object({
    id: z.string().cuid('Invalid revision sheet ID')
  }), 'params'),
  RevisionController.deleteRevisionSheet
);

/**
 * GET /api/v1/revision-sheets/:id/download
 * Download a revision sheet with optional format
 */
router.get(
  '/:id/download',
  validateSchema(z.object({
    id: z.string().cuid('Invalid revision sheet ID')
  }), 'params'),
  validateSchema(downloadSchema, 'query'),
  RevisionController.downloadRevisionSheet
);

export default router;