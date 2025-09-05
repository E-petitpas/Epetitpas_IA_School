// ========================================
// E-petitpas AI School - Question Hooks
// ========================================

import { useState, useEffect, useCallback } from 'react';
import { QuestionAPI } from './api';
import {
  Question,
  CreateQuestionData,
  QuestionFilters,
  QuestionStats,
  QuotaStatus,
} from './types';

/**
 * Hook for managing question list
 */
export const useQuestions = (initialFilters: QuestionFilters = {}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchQuestions = useCallback(async (filters: QuestionFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await QuestionAPI.getList({
        ...initialFilters,
        ...filters,
      });
      
      if (response.success) {
        setQuestions(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des questions');
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const refetch = (filters?: QuestionFilters) => {
    return fetchQuestions(filters);
  };

  return {
    questions,
    loading,
    error,
    pagination,
    refetch,
  };
};

/**
 * Hook for creating questions
 */
export const useCreateQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQuestion = useCallback(async (data: CreateQuestionData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await QuestionAPI.create(data);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Erreur lors de la création');
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createQuestion,
    loading,
    error,
  };
};

/**
 * Hook for question actions (bookmark, delete, etc.)
 */
export const useQuestionActions = () => {
  const [loading, setLoading] = useState(false);

  const toggleBookmark = useCallback(async (questionId: string) => {
    try {
      setLoading(true);
      const response = await QuestionAPI.toggleBookmark(questionId);
      return { success: response.success, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuestion = useCallback(async (questionId: string) => {
    try {
      setLoading(true);
      const response = await QuestionAPI.delete(questionId);
      return { success: response.success };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDelete = useCallback(async (questionIds: string[]) => {
    try {
      setLoading(true);
      const response = await QuestionAPI.bulkDelete(questionIds);
      return { success: response.success };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    toggleBookmark,
    deleteQuestion,
    bulkDelete,
    loading,
  };
};

/**
 * Hook for quota status
 */
export const useQuota = () => {
  const [quota, setQuota] = useState<QuotaStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuota = useCallback(async () => {
    try {
      setLoading(true);
      const response = await QuestionAPI.getQuotaStatus();
      
      if (response.success) {
        setQuota(response.data);
      }
    } catch (error) {
      console.error('Error fetching quota:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  return {
    quota,
    loading,
    refetch: fetchQuota,
  };
};

/**
 * Hook for question statistics
 */
export const useQuestionStats = () => {
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await QuestionAPI.getStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
};