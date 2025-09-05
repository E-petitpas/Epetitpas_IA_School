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
      const { email, password, expectedRole } = req.body as { email: string; password: string; expectedRole?: string };

      // 1) Validate user in our DB first (role and status)
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (!existingUser) {
        res.status(404).json({ success: false, error: 'User not found. Please sign up first.' });
        return;
      }

      if (expectedRole && existingUser.role !== expectedRole) {
        res.status(403).json({ success: false, error: `Role mismatch. Expected ${expectedRole}, found ${existingUser.role}.` });
        return;
      }

      if (existingUser.statutCompte !== 'ACTIF') {
        res.status(403).json({ success: false, error: `Account status is ${existingUser.statutCompte}. Contact support.` });
        return;
      }

      // 2) If validation passed, sign in to Supabase to get tokens
      const { data, error } = await supabaseService.auth.signInWithPassword({ email, password });
      if (error) {
        res.status(401).json({ success: false, error: error.message });
        return;
      }

      if (!data.user || !data.session) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      res.json({
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: existingUser.name,
            role: existingUser.role,
            preferences: existingUser.preferences,
            emailConfirmed: !!data.user.email_confirmed_at
          },
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at
          }
        },
        message: 'Signed in successfully'
      });
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

  /**
   * POST /api/v1/auth/validate-login
   * Validate login credentials with role verification
   */
  static async validateLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, expectedRole } = req.body;

      // Try to authenticate with Supabase
      const { data: authData, error: authError } = await supabaseService.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        ResponseUtil.unauthorized(res, 'Invalid email or password');
        return;
      }

      // Sign out immediately - we only needed to validate credentials
      await supabaseService.auth.signOut();

      const supaUser = authData.user;
      if (!supaUser?.email) {
        ResponseUtil.error(res, 'User not found', 400);
        return;
      }

      // Find by email first to avoid ID mismatch issues
      let user = await prisma.user.findUnique({
        where: { email: supaUser.email },
        select: {
          id: true,
          email: true,
          role: true,
          statutCompte: true,
          name: true
        }
      });

      // If not found, create a profile aligned with Supabase user
      if (!user) {
        const inferredRole = (supaUser.user_metadata?.role as any) === 'ADMIN' ? 'ADMIN' : 'STUDENT';
        const statut = inferredRole === 'ADMIN' ? 'EN_ATTENTE_VALIDATION' : 'ACTIF';
        const created = await prisma.user.create({
          data: {
            id: supaUser.id,
            email: supaUser.email,
            name: (supaUser.user_metadata?.full_name as string) || 'User',
            role: inferredRole,
            statutCompte: statut,
            emailVerifiedAt: supaUser.email_confirmed_at ? new Date(supaUser.email_confirmed_at) : null,
            preferences: supaUser.user_metadata || {}
          },
          select: { id: true, email: true, role: true, statutCompte: true, name: true }
        });
        user = created;
      }

      // Check role match
      if (user.role !== expectedRole) {
        const actualUserType = user.role === 'ADMIN' ? 'Admin' : 'Student';
        const selectedUserType = expectedRole === 'ADMIN' ? 'Admin' : 'Student';
        
        ResponseUtil.error(res, 
          `You are a ${actualUserType} but selected ${selectedUserType} login. Please select the correct user type.`, 403, 'ROLE_MISMATCH');
        return;
      }

      // Check account status
      if (user.statutCompte !== 'ACTIF') {
        let message = '';
        
        if (user.role === 'ADMIN' && user.statutCompte === 'EN_ATTENTE_VALIDATION') {
          message = 'Admin account pending validation. Please wait for approval.';
        } else {
          message = `Account status: ${user.statutCompte}. Please contact support.`;
        }
        
        ResponseUtil.error(res, message, 403, 'ACCOUNT_STATUS');
        return;
      }

      // All validations passed
      ResponseUtil.success(res, {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        }
      }, 'Login validation successful');

    } catch (error) {
      next(error);
    }
  }
}