// ========================================
// E-petitpas AI School - Authentication Controller
// ========================================

import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { supabaseService } from '../utils/supabase';
import { ResponseUtil } from '../utils/response';
import { UserService } from '../services/userService';
import { prisma } from '../database';

export class AuthController {
  /**
   * POST /api/v1/auth/signup
   * Register a new user
   */
  static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name, preferences } = req.body;

      // Create user in Supabase Auth
      const { data, error } = await supabaseService.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name,
            preferences: preferences || {}
          }
        }
      });

      if (error) {
        ResponseUtil.validationError(res, error.message);
        return;
      }

      if (!data.user) {
        ResponseUtil.internalError(res, 'Failed to create user');
        return;
      }

      // Create user profile in our database
      const userProfile = await UserService.createUser({
        email,
        name,
        preferences
      });

      ResponseUtil.created(res, {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: userProfile.name,
          emailConfirmed: false
        },
        message: 'User created successfully. Please check your email to confirm your account.'
      }, 'Account created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/signin
   * Sign in user
   */
  static async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabaseService.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        ResponseUtil.unauthorized(res, error.message);
        return;
      }

      if (!data.user || !data.session) {
        ResponseUtil.unauthorized(res, 'Invalid credentials');
        return;
      }

      // Get user profile from our database
      const userProfile = await prisma.user.findUnique({
        where: { email: data.user.email! }
      });

      if (!userProfile) {
        ResponseUtil.notFound(res, 'User profile not found');
        return;
      }

      ResponseUtil.success(res, {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: userProfile.name,
          role: userProfile.role,
          preferences: userProfile.preferences,
          emailConfirmed: !!data.user.email_confirmed_at
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }
      }, 'Signed in successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/signout
   * Sign out user
   */
  static async signout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error } = await supabaseService.auth.signOut();

      if (error) {
        ResponseUtil.internalError(res, error.message);
        return;
      }

      ResponseUtil.success(res, null, 'Signed out successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   * Refresh access token
   */
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        ResponseUtil.validationError(res, 'Refresh token is required');
        return;
      }

      const { data, error } = await supabaseService.auth.refreshSession({
        refresh_token
      });

      if (error) {
        ResponseUtil.unauthorized(res, error.message);
        return;
      }

      if (!data.session) {
        ResponseUtil.unauthorized(res, 'Invalid refresh token');
        return;
      }

      ResponseUtil.success(res, {
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }
      }, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/verify-email
   * Verify email with token
   */
  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, type } = req.body;

      const { data, error } = await supabaseService.auth.verifyOtp({
        token_hash: token,
        type: type || 'signup'
      });

      if (error) {
        ResponseUtil.validationError(res, error.message);
        return;
      }

      // Update email verification status in our database
      if (data.user?.email) {
        await prisma.user.update({
          where: { email: data.user.email },
          data: { emailVerifiedAt: new Date() }
        });
      }

      ResponseUtil.success(res, {
        user: data.user,
        session: data.session
      }, 'Email verified successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/forgot-password
   * Request password reset
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const { error } = await supabaseService.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password`
      });

      if (error) {
        ResponseUtil.validationError(res, error.message);
        return;
      }

      ResponseUtil.success(res, null, 'Password reset email sent');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/reset-password
   * Reset password with token
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { access_token, refresh_token, new_password } = req.body;

      // Set the session first
      await supabaseService.auth.setSession({
        access_token,
        refresh_token
      });

      const { data, error } = await supabaseService.auth.updateUser({
        password: new_password
      });

      if (error) {
        ResponseUtil.validationError(res, error.message);
        return;
      }

      ResponseUtil.success(res, {
        user: data.user
      }, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   * Get current user profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const userProfile = await UserService.getUserById(req.user.id);
      
      ResponseUtil.success(res, {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        statutCompte: userProfile.statutCompte,
        preferences: userProfile.preferences,
        profileImage: userProfile.profileImage,
        emailVerifiedAt: userProfile.emailVerifiedAt,
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt
      }, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}