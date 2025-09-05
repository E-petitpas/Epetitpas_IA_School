// ========================================
// E-petitpas AI School - Response Utilities
// ========================================

import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

export class ResponseUtil {
  /**
   * Send success response
   */
  static success<T>(res: Response, data?: T, message?: string, statusCode = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static error(res: Response, message: string, statusCode = 400, code?: string): Response {
    const response: ApiResponse = {
      success: false,
      error: message,
      code
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send paginated response
   */
  static paginated<T>(
    res: Response, 
    data: T[], 
    pagination: { page: number; limit: number; total: number; pages: number },
    message?: string
  ): Response {
    const response: PaginatedResponse<T> = {
      success: true,
      data,
      message,
      pagination
    };

    return res.status(200).json(response);
  }

  /**
   * Send created response (201)
   */
  static created<T>(res: Response, data?: T, message?: string): Response {
    return this.success(res, data, message, 201);
  }

  /**
   * Send no content response (204)
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Send unauthorized response (401)
   */
  static unauthorized(res: Response, message = 'Unauthorized'): Response {
    return this.error(res, message, 401, 'UNAUTHORIZED');
  }

  /**
   * Send forbidden response (403)
   */
  static forbidden(res: Response, message = 'Forbidden'): Response {
    return this.error(res, message, 403, 'FORBIDDEN');
  }

  /**
   * Send not found response (404)
   */
  static notFound(res: Response, message = 'Resource not found'): Response {
    return this.error(res, message, 404, 'NOT_FOUND');
  }

  /**
   * Send validation error response (422)
   */
  static validationError(res: Response, message = 'Validation failed', errors?: any): Response {
    const response: ApiResponse = {
      success: false,
      error: message,
      code: 'VALIDATION_ERROR',
      data: errors
    };

    return res.status(422).json(response);
  }

  /**
   * Send rate limit response (429)
   */
  static rateLimitExceeded(res: Response, message = 'Rate limit exceeded'): Response {
    return this.error(res, message, 429, 'RATE_LIMIT_EXCEEDED');
  }

  /**
   * Send internal server error response (500)
   */
  static internalError(res: Response, message = 'Internal server error'): Response {
    return this.error(res, message, 500, 'INTERNAL_ERROR');
  }
}