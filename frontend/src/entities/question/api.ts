// ========================================
// E-petitpas AI School - Question API
// ========================================

import { apiClient } from '@/core/api/client';
import {
  Question,
  CreateQuestionData,
  QuestionFilters,
  QuestionStats,
  QuotaStatus,
} from './types';

export class QuestionAPI {
  /**
   * Create a new AI question
   */
  static async create(data: CreateQuestionData) {
    return apiClient.post<Question>('/questions', data);
  }

  /**
   * Get user's questions with filters and pagination
   */
  static async getList(filters: QuestionFilters = {}) {
    return apiClient.get<Question[]>('/questions', filters);
  }

  /**
   * Get a specific question by ID
   */
  static async getById(id: string) {
    return apiClient.get<Question>(`/questions/${id}`);
  }

  /**
   * Toggle bookmark status
   */
  static async toggleBookmark(id: string) {
    return apiClient.patch<Question>(`/questions/${id}/bookmark`);
  }

  /**
   * Delete a question
   */
  static async delete(id: string) {
    return apiClient.delete(`/questions/${id}`);
  }

  /**
   * Bulk delete questions
   */
  static async bulkDelete(questionIds: string[]) {
    return apiClient.post('/questions/bulk-delete', { questionIds });
  }

  /**
   * Get available subjects and grade levels
   */
  static async getSubjects() {
    return apiClient.get<{
      subjects: string[];
      gradeLevels: string[];
      questionTypes: string[];
    }>('/questions/subjects');
  }

  /**
   * Get user's quota status
   */
  static async getQuotaStatus() {
    return apiClient.get<QuotaStatus>('/questions/quota/status');
  }

  /**
   * Get user's question statistics
   */
  static async getStats() {
    return apiClient.get<QuestionStats>('/questions/stats/overview');
  }
}