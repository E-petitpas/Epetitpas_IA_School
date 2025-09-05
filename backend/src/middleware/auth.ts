// ========================================
// E-petitpas AI School - Authentication Middleware
// ========================================

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, AuthenticatedUser, AppError } from '../types';
import { supabaseService } from '../utils/supabase';
import { prisma } from '../database';
import { ResponseUtil } from '../utils/response';
import { Role } from '../../generated/prisma';

/**
 * Extract Bearer token from Authorization header
 */
function extractToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Main authentication middleware
 */
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      ResponseUtil.unauthorized(res, 'Access token required');
      return;
    }

    // Verify token with Supabase
    const supabaseUser = await supabaseService.verifyToken(token);
    if (!supabaseUser) {
      ResponseUtil.unauthorized(res, 'Invalid or expired token');
      return;
    }

    // Get or create user profile in our database
    // First, try by Supabase ID
    let user = await prisma.user.findUnique({ where: { id: supabaseUser.id } });

    // If not found by ID, try by email (to avoid unique email conflicts)
    if (!user) {
      user = await prisma.user.findUnique({ where: { email: supabaseUser.email } });
    }

    // If still not found, create from Supabase data
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: (supabaseUser.user_metadata.full_name as string) || 'User',
          role: (supabaseUser.user_metadata.role as Role) || 'STUDENT',
          statutCompte: 'ACTIF',
          emailVerifiedAt: new Date(),
          preferences: {
            academic_level: supabaseUser.user_metadata.academic_level,
            ...supabaseUser.user_metadata
          }
        }
      });
    }

    // Check if account is active
    if (user.statutCompte !== 'ACTIF') {
      ResponseUtil.forbidden(res, 'Account is not active');
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      statutCompte: user.statutCompte,
      preferences: user.preferences as any
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    ResponseUtil.internalError(res, 'Authentication failed');
  }
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = extractToken(req.headers.authorization);
  
  if (!token) {
    next();
    return;
  }

  // Try to authenticate, but don't fail if it doesn't work
  try {
    await authenticateToken(req, res, () => {});
  } catch (error) {
    // Ignore authentication errors for optional auth
    console.log('Optional auth failed, continuing without user');
  }
  
  next();
}

/**
 * Role-based authorization middleware
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtil.unauthorized(res, 'Authentication required');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      ResponseUtil.forbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
}

/**
 * Admin-only middleware
 */
export const requireAdmin = requireRole('ADMIN');

/**
 * User or Admin middleware
 */
export const requireUser = requireRole('STUDENT', 'ADMIN');

/**
 * Check if user can access resource (own resource or admin)
 */
export function requireOwnershipOrAdmin(getUserId: (req: AuthenticatedRequest) => string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtil.unauthorized(res, 'Authentication required');
      return;
    }

    const resourceUserId = getUserId(req);
    
    if (req.user.role === 'ADMIN' || req.user.id === resourceUserId) {
      next();
      return;
    }

    ResponseUtil.forbidden(res, 'Access denied');
  };
}