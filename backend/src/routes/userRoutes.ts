// ========================================
// E-petitpas AI School - User Routes
// ========================================

import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, requireAdmin, requireOwnershipOrAdmin } from '../middleware/auth';
import { validateSchema, updateUserSchema, createUserSchema, adminUserUpdateSchema, paginationSchema } from '../validators';
import { z } from 'zod';
import { Role, StatutCompte } from '../../generated/prisma';
import { apiLimiter } from '../middleware';

const router = Router();

// Apply authentication to all user routes
router.use(authenticateToken);

// ===============================
// PROFILE ROUTES (Self-service)
// ===============================

/**
 * GET /api/users/profile
 * Get current user's profile
 */
router.get(
  '/profile',
  UserController.getProfile
);

/**
 * PUT /api/users/profile
 * Update current user's profile
 */
router.put(
  '/profile',
  validateSchema(updateUserSchema),
  UserController.updateProfile
);

// ===============================
// USER MANAGEMENT ROUTES
// ===============================

/**
 * GET /api/users/:id
 * Get user by ID (admin or self only)
 */
router.get(
  '/:id',
  requireOwnershipOrAdmin(req => req.params.id),
  UserController.getUserById
);

/**
 * PUT /api/users/:id
 * Update user by ID (admin only)
 */
router.put(
  '/:id',
  requireAdmin,
  validateSchema(adminUserUpdateSchema),
  UserController.updateUser
);

/**
 * DELETE /api/users/:id
 * Delete user by ID (admin only)
 */
router.delete(
  '/:id',
  requireAdmin,
  UserController.deleteUser
);

/**
 * PATCH /api/users/:id/status
 * Update user status (admin only)
 */
router.patch(
  '/:id/status',
  requireAdmin,
  validateSchema(z.object({
    statutCompte: z.nativeEnum(StatutCompte)
  })),
  UserController.updateUserStatus
);

// ===============================
// ADMIN ROUTES
// ===============================

/**
 * GET /api/users
 * Get all users with pagination and filters (admin only)
 */
router.get(
  '/',
  requireAdmin,
  validateSchema(z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
    role: z.nativeEnum(Role).optional(),
    statutCompte: z.nativeEnum(StatutCompte).optional(),
    search: z.string().optional()
  }), 'query'),
  UserController.getAllUsers
);

/**
 * POST /api/users
 * Create new user (admin only)
 */
router.post(
  '/',
  requireAdmin,
  apiLimiter,
  validateSchema(createUserSchema),
  UserController.createUser
);

/**
 * GET /api/users/stats/overview
 * Get user statistics (admin only)
 */
router.get(
  '/stats/overview',
  requireAdmin,
  UserController.getUserStats
);

export default router;