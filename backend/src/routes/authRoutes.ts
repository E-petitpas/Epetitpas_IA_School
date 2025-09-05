// ========================================
// E-petitpas AI School - Authentication Routes
// ========================================

import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateSchema } from '../validators';
import { z } from 'zod';

const router = Router();

// ===============================
// AUTHENTICATION VALIDATION SCHEMAS
// ===============================

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  preferences: z.object({
    academic_level: z.string().optional(),
    subjects: z.array(z.string()).optional(),
    learning_preferences: z.record(z.boolean()).optional(),
    language: z.string().optional().default('fr'),
    theme: z.enum(['light', 'dark']).optional().default('light'),
    notifications: z.boolean().optional().default(true)
  }).optional()
});

const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required')
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  type: z.enum(['signup', 'recovery', 'invite']).optional().default('signup')
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format')
});

const resetPasswordSchema = z.object({
  access_token: z.string().min(1, 'Access token is required'),
  refresh_token: z.string().min(1, 'Refresh token is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters')
});

const validateLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  expectedRole: z.enum(['STUDENT', 'ADMIN'], 'Expected role must be STUDENT or ADMIN')
});

// ===============================
// PUBLIC AUTHENTICATION ROUTES
// ===============================

/**
 * POST /api/v1/auth/signup
 * Register a new user
 */
router.post(
  '/signup',
  validateSchema(signupSchema),
  AuthController.signup
);

/**
 * POST /api/v1/auth/signin
 * Sign in user
 */
router.post(
  '/signin',
  validateSchema(signinSchema),
  AuthController.signin
);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
router.post(
  '/refresh',
  validateSchema(refreshTokenSchema),
  AuthController.refresh
);

/**
 * POST /api/v1/auth/verify-email
 * Verify email with token
 */
router.post(
  '/verify-email',
  validateSchema(verifyEmailSchema),
  AuthController.verifyEmail
);

/**
 * POST /api/v1/auth/forgot-password
 * Request password reset
 */
router.post(
  '/forgot-password',
  validateSchema(forgotPasswordSchema),
  AuthController.forgotPassword
);

/**
 * POST /api/v1/auth/reset-password
 * Reset password with token
 */
router.post(
  '/reset-password',
  validateSchema(resetPasswordSchema),
  AuthController.resetPassword
);

/**
 * POST /api/v1/auth/validate-login
 * Validate login credentials with role verification
 */
router.post(
  '/validate-login',
  validateSchema(validateLoginSchema),
  AuthController.validateLogin
);

// ===============================
// PROTECTED AUTHENTICATION ROUTES
// ===============================

/**
 * POST /api/v1/auth/signout
 * Sign out user (requires authentication)
 */
router.post(
  '/signout',
  authenticateToken,
  AuthController.signout
);

/**
 * GET /api/v1/auth/me
 * Get current user profile (requires authentication)
 */
router.get(
  '/me',
  authenticateToken,
  AuthController.getProfile
);

export default router;