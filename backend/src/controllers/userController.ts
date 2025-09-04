// ========================================
// E-petitpas AI School - User Controller
// ========================================

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { UserService } from '../services/userService';
import { ResponseUtil } from '../utils/response';

export class UserController {
  /**
   * Get current user profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const profile = await UserService.getUserProfile(req.user.id);
      
      if (!profile) {
        ResponseUtil.notFound(res, 'User profile not found');
        return;
      }

      ResponseUtil.success(res, profile, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update current user profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const updatedUser = await UserService.updateUser(req.user.id, req.body);
      
      ResponseUtil.success(res, updatedUser, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID (admin or self only)
   */
  static async getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;

      // Check if user can access this resource
      if (req.user.role !== 'ADMIN' && req.user.id !== id) {
        ResponseUtil.forbidden(res, 'Access denied');
        return;
      }

      const user = await UserService.getUserProfile(id);
      
      if (!user) {
        ResponseUtil.notFound(res, 'User not found');
        return;
      }

      ResponseUtil.success(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        ResponseUtil.forbidden(res);
        return;
      }

      const { page, limit, role, statutCompte, search } = req.query as any;
      
      const result = await UserService.getAllUsers(page, limit, {
        role,
        statutCompte,
        search
      });

      ResponseUtil.paginated(res, result.users, result.pagination, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new user (admin only)
   */
  static async createUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        ResponseUtil.forbidden(res);
        return;
      }

      const user = await UserService.createUser(req.body, true);
      
      ResponseUtil.created(res, user, 'User created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user (admin only)
   */
  static async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        ResponseUtil.forbidden(res);
        return;
      }

      const { id } = req.params;
      const updatedUser = await UserService.updateUser(id, req.body);
      
      ResponseUtil.success(res, updatedUser, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user status (admin only)
   */
  static async updateUserStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        ResponseUtil.forbidden(res);
        return;
      }

      const { id } = req.params;
      const { statutCompte } = req.body;
      
      const updatedUser = await UserService.updateUserStatus(id, statutCompte);
      
      ResponseUtil.success(res, updatedUser, 'User status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        ResponseUtil.forbidden(res);
        return;
      }

      const { id } = req.params;
      
      // Prevent admin from deleting themselves
      if (req.user.id === id) {
        ResponseUtil.error(res, 'Cannot delete your own account', 400);
        return;
      }
      
      await UserService.deleteUser(id);
      
      ResponseUtil.success(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user statistics (admin only)
   */
  static async getUserStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        ResponseUtil.forbidden(res);
        return;
      }

      // Get basic user statistics
      const [
        totalUsers,
        activeUsers,
        adminUsers,
        blockedUsers,
        usersThisMonth
      ] = await Promise.all([
        UserService.getAllUsers(1, 1).then(r => r.pagination.total),
        UserService.getAllUsers(1, 1, { statutCompte: 'ACTIF' }).then(r => r.pagination.total),
        UserService.getAllUsers(1, 1, { role: 'ADMIN' }).then(r => r.pagination.total),
        UserService.getAllUsers(1, 1, { statutCompte: 'BLOQUE' }).then(r => r.pagination.total),
        UserService.getAllUsers(1, 1).then(r => 
          r.users.filter(u => 
            new Date(u.createdAt).getMonth() === new Date().getMonth()
          ).length
        )
      ]);

      const stats = {
        totalUsers,
        activeUsers,
        adminUsers,
        blockedUsers,
        usersThisMonth,
        inactiveUsers: totalUsers - activeUsers,
        growthRate: usersThisMonth // Could be calculated more precisely
      };

      ResponseUtil.success(res, stats, 'User statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}