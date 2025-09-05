// ========================================
// E-petitpas AI School - AI Questions Controller
// ========================================

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { AIService } from '../services/aiService';
import { ResponseUtil } from '../utils/response';

export class AIController {
  /**
   * POST /api/v1/questions
   * Create a new AI question
   */
  static async createQuestion(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const question = await AIService.createQuestion(req.user.id, req.body);
      
      ResponseUtil.created(res, question, 'Question generated successfully');
    } catch (error: any) {
      if (error.code === 'QUOTA_EXCEEDED') {
        ResponseUtil.rateLimitExceeded(res, error.message);
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/v1/questions
   * Get user's questions with pagination and filters
   */
  static async getUserQuestions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const {
        page = 1,
        limit = 20,
        subject,
        gradeLevel,
        questionType,
        isBookmarked,
        search,
        sortBy,
        sortOrder
      } = req.query as any;

      const result = await AIService.getUserQuestions(req.user.id, page, limit, {
        subject,
        gradeLevel,
        questionType,
        isBookmarked,
        search,
        sortBy,
        sortOrder
      });

      ResponseUtil.paginated(res, result.questions, result.pagination, 'Questions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/questions/:id
   * Get a specific question by ID
   */
  static async getQuestionById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;
      
      // Get user's questions to ensure they own this question
      const result = await AIService.getUserQuestions(req.user.id, 1, 1000);
      const question = result.questions.find(q => q.id === id);
      
      if (!question) {
        ResponseUtil.notFound(res, 'Question not found');
        return;
      }

      ResponseUtil.success(res, question, 'Question retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/questions/:id/bookmark
   * Toggle bookmark status of a question
   */
  static async toggleBookmark(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const updatedQuestion = await AIService.toggleBookmark(id, req.user.id);
      
      ResponseUtil.success(res, updatedQuestion, 'Bookmark status updated');
    } catch (error: any) {
      if (error.code === 'QUESTION_NOT_FOUND') {
        ResponseUtil.notFound(res, error.message);
        return;
      }
      next(error);
    }
  }

  /**
   * DELETE /api/v1/questions/:id
   * Delete a question
   */
  static async deleteQuestion(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;
      await AIService.deleteQuestion(id, req.user.id);
      
      ResponseUtil.success(res, null, 'Question deleted successfully');
    } catch (error: any) {
      if (error.code === 'QUESTION_NOT_FOUND') {
        ResponseUtil.notFound(res, error.message);
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/v1/questions/quota/status
   * Get user's current quota status
   */
  static async getQuotaStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const quota = await AIService.getUserQuota(req.user.id);
      
      ResponseUtil.success(res, quota, 'Quota status retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/questions/stats/overview
   * Get user's question statistics
   */
  static async getQuestionStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      // Get all user questions for statistics
      const allQuestions = await AIService.getUserQuestions(req.user.id, 1, 1000);
      const questions = allQuestions.questions;

      // Calculate statistics
      const stats = {
        total: questions.length,
        thisWeek: questions.filter(q => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(q.createdAt) >= weekAgo;
        }).length,
        thisMonth: questions.filter(q => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return new Date(q.createdAt) >= monthAgo;
        }).length,
        bookmarked: questions.filter(q => q.isBookmarked).length,
        bySubject: questions.reduce((acc, q) => {
          acc[q.subject] = (acc[q.subject] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byType: questions.reduce((acc, q) => {
          const type = q.questionType || 'explanation';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        avgResponseTime: questions.length > 0 
          ? questions.reduce((sum, q) => sum + (q.createdAt ? 2000 : 0), 0) / questions.length
          : 0
      };

      ResponseUtil.success(res, stats, 'Question statistics retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/questions/subjects
   * Get available subjects list
   */
  static async getAvailableSubjects(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Predefined subjects for MVP
      const subjects = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology',
        'French', 'English', 'Spanish', 'German',
        'History', 'Geography', 'Philosophy', 'Economics',
        'Computer Science', 'Literature', 'Word', 'Excel',
        'TSSR', 'DWWM', 'CDA', 'BTS SIO'
      ];

      const gradeLevels = [
        'CE1', '6ème', '4ème', 'Terminale',
        'BTS SIO', 'TSSR', 'DWWM', 'CDA',
        'Licence', 'Master', 'Reconversion'
      ];

      ResponseUtil.success(res, {
        subjects: subjects.sort(),
        gradeLevels: gradeLevels,
        questionTypes: ['explanation', 'exercise', 'quiz']
      }, 'Available subjects retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/questions/bulk-delete
   * Delete multiple questions
   */
  static async bulkDeleteQuestions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { questionIds } = req.body;
      
      if (!Array.isArray(questionIds) || questionIds.length === 0) {
        ResponseUtil.validationError(res, 'questionIds must be a non-empty array');
        return;
      }

      let deletedCount = 0;
      const errors: string[] = [];

      for (const id of questionIds) {
        try {
          await AIService.deleteQuestion(id, req.user.id);
          deletedCount++;
        } catch (error: any) {
          errors.push(`Failed to delete question ${id}: ${error.message}`);
        }
      }

      const result = {
        deletedCount,
        totalRequested: questionIds.length,
        errors: errors.length > 0 ? errors : undefined
      };

      if (deletedCount === questionIds.length) {
        ResponseUtil.success(res, result, 'All questions deleted successfully');
      } else {
        ResponseUtil.success(res, result, `${deletedCount}/${questionIds.length} questions deleted`);
      }
    } catch (error) {
      next(error);
    }
  }
}