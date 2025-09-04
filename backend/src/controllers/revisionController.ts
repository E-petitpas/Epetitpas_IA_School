// ========================================
// E-petitpas AI School - Revision Sheet Controller
// ========================================

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { RevisionService } from '../services/revisionService';
import { ResponseUtil } from '../utils/response';

export class RevisionController {
  /**
   * POST /api/v1/revision-sheets
   * Create a new revision sheet from selected questions
   */
  static async createRevisionSheet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const revisionSheet = await RevisionService.createRevisionSheet(req.user.id, req.body);
      
      ResponseUtil.created(res, revisionSheet, 'Revision sheet created successfully');
    } catch (error: any) {
      if (error.code === 'INVALID_QUESTION_IDS') {
        ResponseUtil.validationError(res, error.message);
        return;
      }
      if (error.code === 'NO_QUESTIONS_FOUND') {
        ResponseUtil.validationError(res, error.message);
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/v1/revision-sheets
   * Get user's revision sheets with pagination and filters
   */
  static async getUserRevisionSheets(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
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
        exportFormat,
        search
      } = req.query as any;

      const result = await RevisionService.getUserRevisionSheets(req.user.id, page, limit, {
        subject,
        gradeLevel,
        exportFormat,
        search
      });

      ResponseUtil.paginated(res, result.sheets, result.pagination, 'Revision sheets retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/revision-sheets/:id
   * Get a specific revision sheet by ID
   */
  static async getRevisionSheet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const revisionSheet = await RevisionService.getRevisionSheet(id, req.user.id);
      
      ResponseUtil.success(res, revisionSheet, 'Revision sheet retrieved successfully');
    } catch (error: any) {
      if (error.code === 'SHEET_NOT_FOUND') {
        ResponseUtil.notFound(res, error.message);
        return;
      }
      next(error);
    }
  }

  /**
   * PATCH /api/v1/revision-sheets/:id
   * Update a revision sheet
   */
  static async updateRevisionSheet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const updatedSheet = await RevisionService.updateRevisionSheet(id, req.user.id, req.body);
      
      ResponseUtil.success(res, updatedSheet, 'Revision sheet updated successfully');
    } catch (error: any) {
      if (error.code === 'SHEET_NOT_FOUND') {
        ResponseUtil.notFound(res, error.message);
        return;
      }
      next(error);
    }
  }

  /**
   * DELETE /api/v1/revision-sheets/:id
   * Delete a revision sheet
   */
  static async deleteRevisionSheet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;
      await RevisionService.deleteRevisionSheet(id, req.user.id);
      
      ResponseUtil.success(res, null, 'Revision sheet deleted successfully');
    } catch (error: any) {
      if (error.code === 'SHEET_NOT_FOUND') {
        ResponseUtil.notFound(res, error.message);
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/v1/revision-sheets/:id/download
   * Download a revision sheet (increment download count)
   */
  static async downloadRevisionSheet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const { format = 'TXT' } = req.query as any;
      
      const exportData = await RevisionService.generateExportFile(id, req.user.id, format);
      
      // Set appropriate headers for download
      res.setHeader('Content-Type', exportData.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${exportData.filename}"`);
      
      res.send(exportData.content);
    } catch (error: any) {
      if (error.code === 'SHEET_NOT_FOUND') {
        ResponseUtil.notFound(res, error.message);
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/v1/revision-sheets/stats/overview
   * Get user's revision sheet statistics
   */
  static async getRevisionStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const stats = await RevisionService.getRevisionStats(req.user.id);
      
      ResponseUtil.success(res, stats, 'Revision sheet statistics retrieved');
    } catch (error) {
      next(error);
    }
  }
}