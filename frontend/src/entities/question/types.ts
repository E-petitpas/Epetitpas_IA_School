// ========================================
// E-petitpas AI School - Question Types
// ========================================

export type QuestionType = 'explanation' | 'exercise' | 'quiz';

export interface QuestionStep {
  title: string;
  content: string;
  order: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

export interface Question {
  id: string;
  userId: string;
  subject: string;
  gradeLevel: string;
  questionText: string;
  aiResponse: string;
  steps?: {
    steps: QuestionStep[];
  };
  quiz?: {
    questions: QuizQuestion[];
  };
  questionType: QuestionType;
  isBookmarked: boolean;
  tags: string[];
  tokensUsed: number;
  responseTimeMs: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionData {
  subject: string;
  gradeLevel: string;
  questionText: string;
  questionType?: QuestionType;
}

export interface QuestionFilters {
  page?: number;
  limit?: number;
  subject?: string;
  gradeLevel?: string;
  questionType?: QuestionType;
  isBookmarked?: boolean;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'subject' | 'gradeLevel';
  sortOrder?: 'asc' | 'desc';
}

export interface QuestionStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
  bookmarked: number;
  bySubject: Record<string, number>;
  byType: Record<string, number>;
  avgResponseTime: number;
}

export interface QuotaStatus {
  used: number;
  limit: number;
  remaining: number;
  resetAt: string;
}