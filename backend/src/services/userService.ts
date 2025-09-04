// ========================================
// E-petitpas AI School - User Service
// ========================================

import { prisma } from '../database';
import { CreateUserData, UpdateUserData, AuthenticatedUser } from '../types';
import { supabaseService } from '../utils/supabase';
import { Role, StatutCompte } from '../../generated/prisma';

export class UserService {
  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<AuthenticatedUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      statutCompte: user.statutCompte,
      preferences: user.preferences as any
    };
  }

  /**
   * Get user profile with subscription info
   */
  static async getUserProfile(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        quotas: {
          where: { 
            date: new Date(new Date().toDateString()) // Today's quota
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: {
            questions: true,
            revisionSheets: true
          }
        }
      }
    });

    if (!user) return null;

    const activeSubscription = user.subscriptions[0];
    const todayQuota = user.quotas[0];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      statutCompte: user.statutCompte,
      profileImage: user.profileImage,
      preferences: user.preferences,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      subscription: activeSubscription ? {
        id: activeSubscription.id,
        planName: activeSubscription.plan.name,
        status: activeSubscription.status,
        startDate: activeSubscription.startDate,
        endDate: activeSubscription.endDate,
        autoRenew: activeSubscription.autoRenew,
        features: {
          dailyQuestionsLimit: activeSubscription.plan.dailyQuestionsLimit,
          canGenerateQuizzes: activeSubscription.plan.canGenerateQuizzes,
          canExportFiles: activeSubscription.plan.canExportFiles,
          hasAdvancedStats: activeSubscription.plan.hasAdvancedStats
        }
      } : null,
      quota: todayQuota ? {
        used: todayQuota.questionsUsed,
        limit: todayQuota.questionsLimit,
        remaining: todayQuota.questionsLimit - todayQuota.questionsUsed,
        resetAt: new Date(todayQuota.date.getTime() + 24 * 60 * 60 * 1000)
      } : null,
      stats: {
        totalQuestions: user._count.questions,
        totalRevisionSheets: user._count.revisionSheets
      }
    };
  }

  /**
   * Create user (admin only)
   */
  static async createUser(data: CreateUserData, createdByAdmin = false) {
    // Create user in our database
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role || 'USER',
        statutCompte: createdByAdmin ? 'ACTIF' : 'EN_ATTENTE_VALIDATION',
        preferences: data.preferences || {},
        emailVerifiedAt: createdByAdmin ? new Date() : null
      }
    });

    // If created by admin and it's a development/test environment, 
    // also create in Supabase Auth
    if (createdByAdmin && process.env.NODE_ENV !== 'production') {
      try {
        await supabaseService.createUser(
          data.email,
          'TempPassword123!', // Temporary password
          {
            full_name: data.name,
            role: data.role,
            ...data.preferences
          }
        );
      } catch (error) {
        console.error('Failed to create user in Supabase Auth:', error);
        // Continue anyway - user exists in our DB
      }
    }

    return user;
  }

  /**
   * Update user profile
   */
  static async updateUser(id: string, data: UpdateUserData) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.profileImage && { profileImage: data.profileImage }),
        ...(data.preferences && { 
          preferences: data.preferences 
        })
      }
    });

    // Also update Supabase user metadata if needed
    if (data.name || data.preferences) {
      try {
        await supabaseService.updateUserMetadata(id, {
          full_name: data.name,
          ...data.preferences
        });
      } catch (error) {
        console.error('Failed to update Supabase metadata:', error);
        // Continue anyway - main update succeeded
      }
    }

    return user;
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(id: string) {
    // Soft delete - change status instead of actual deletion
    return await prisma.user.update({
      where: { id },
      data: {
        statutCompte: 'INACTIF',
        email: `deleted_${Date.now()}_${id}@deleted.local` // Anonymize email
      }
    });
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(
    page = 1,
    limit = 20,
    filters?: {
      role?: Role;
      statutCompte?: StatutCompte;
      search?: string;
    }
  ) {
    const skip = (page - 1) * limit;

    const where = {
      ...(filters?.role && { role: filters.role }),
      ...(filters?.statutCompte && { statutCompte: filters.statutCompte }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' as const } },
          { email: { contains: filters.search, mode: 'insensitive' as const } }
        ]
      })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          subscriptions: {
            where: { status: 'ACTIVE' },
            include: { plan: { select: { name: true } } },
            take: 1
          },
          _count: {
            select: { questions: true }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update user status (admin only)
   */
  static async updateUserStatus(id: string, statutCompte: StatutCompte) {
    return await prisma.user.update({
      where: { id },
      data: { statutCompte }
    });
  }
}