// ========================================
// E-petitpas AI School - AI Question Service
// ========================================

import OpenAI from 'openai';
import { prisma } from '../database';
import { CreateQuestionData, AIQuestionResponse, AppError } from '../types';

interface GeneratedResponse {
  answer: string;
  steps: Array<{
    title: string;
    content: string;
    order: number;
  }>;
  quiz: Array<{
    question: string;
    options: string[];
    correct_answer: number;
  }>;
}

export class AIService {
  private static openai: OpenAI | null = null;

  /**
   * Initialize OpenAI client
   */
  private static getOpenAIClient(): OpenAI | null {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_key_here') {
      return null;
    }

    if (!this.openai) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    return this.openai;
  }

  /**
   * Generate AI response with OpenAI or fallback
   */
  private static async generateAIResponse(
    questionText: string,
    subject: string,
    gradeLevel: string,
    questionType: string
  ): Promise<GeneratedResponse> {
    const openai = this.getOpenAIClient();

    if (openai) {
      return await this.generateWithOpenAI(openai, questionText, subject, gradeLevel, questionType);
    } else {
      console.log('🎓 Using fallback AI response (OpenAI not configured)');
      return this.generateFallbackResponse(questionText, subject, gradeLevel);
    }
  }

  /**
   * Generate response using OpenAI GPT-4o-mini
   */
  private static async generateWithOpenAI(
    openai: OpenAI,
    questionText: string,
    subject: string,
    gradeLevel: string,
    questionType: string
  ): Promise<GeneratedResponse> {
    const systemPrompt = `Tu es Mr Alex, un professeur IA expert en pédagogie pour E-petitpas IA School.

CONTEXTE:
- Niveau: ${gradeLevel}
- Matière: ${subject}
- Type: ${questionType}

MISSION:
1. Fournis une explication claire et pédagogique
2. Décompose en étapes logiques (2-4 étapes max)
3. Crée un mini-quiz (2-3 questions) pour tester la compréhension
4. Adapte le vocabulaire au niveau scolaire
5. Sois encourageant et bienveillant

FORMAT DE RÉPONSE (JSON strict):
{
  "answer": "Explication principale claire et adaptée au niveau",
  "steps": [
    {
      "title": "Titre de l'étape",
      "content": "Contenu détaillé de l'étape",
      "order": 1
    }
  ],
  "quiz": [
    {
      "question": "Question de compréhension",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0
    }
  ]
}

IMPORTANT: Réponds uniquement en JSON valide, sans markdown ni commentaires.`;

    const userPrompt = `Question de l'élève: ${questionText}

Génère une réponse pédagogique complète avec étapes et quiz.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      const parsedResponse = JSON.parse(responseText);
      
      // Validate response structure
      if (!parsedResponse.answer || !parsedResponse.steps || !parsedResponse.quiz) {
        throw new Error('Invalid response structure from OpenAI');
      }

      return parsedResponse;
    } catch (error) {
      console.error('OpenAI API error:', error);
      console.log('🎓 Falling back to mock response due to API error');
      return this.generateFallbackResponse(questionText, subject, gradeLevel);
    }
  }

  /**
   * Generate fallback response when OpenAI is not available
   */
  private static generateFallbackResponse(
    questionText: string,
    subject: string,
    gradeLevel: string
  ): GeneratedResponse {
    return {
      answer: `Bonjour ! Je suis Mr Alex, votre assistant éducatif IA. 

Pour votre question sur "${questionText}" en ${subject} (niveau ${gradeLevel}), voici une approche pédagogique que nous pouvons utiliser ensemble :

Cette réponse est générée en mode développement. Une fois la clé OpenAI configurée, vous aurez accès à des explications personnalisées et adaptées à votre niveau scolaire.`,
      
      steps: [
        {
          title: "Analyse de la question",
          content: `Commençons par bien comprendre ce que vous demandez en ${subject}. C'est important de cerner les concepts clés.`,
          order: 1
        },
        {
          title: "Concepts fondamentaux",
          content: `Explorons ensemble les principes de base qui vous aideront à maîtriser ce sujet au niveau ${gradeLevel}.`,
          order: 2
        },
        {
          title: "Application pratique",
          content: "Maintenant, voyons comment appliquer ces connaissances dans des situations concrètes !",
          order: 3
        }
      ],
      
      quiz: [
        {
          question: `Quelle est la meilleure approche pour apprendre en ${subject} ?`,
          options: [
            "Mémoriser sans comprendre",
            "Décomposer étape par étape",
            "Éviter les parties difficiles",
            "Ne lire que des résumés"
          ],
          correct_answer: 1
        },
        {
          question: "Comment Mr Alex peut-il vous aider dans vos études ?",
          options: [
            "En donnant seulement des réponses courtes",
            "En fournissant des explications détaillées et des quiz",
            "En faisant les devoirs à votre place",
            "En évitant les sujets complexes"
          ],
          correct_answer: 1
        }
      ]
    };
  }

  /**
   * Create a new AI question
   */
  static async createQuestion(
    userId: string,
    data: CreateQuestionData
  ): Promise<AIQuestionResponse> {
    const startTime = Date.now();

    // Check user's daily quota
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let quota = await prisma.dailyQuota.findUnique({
      where: {
        userId_date: {
          userId,
          date: today
        }
      }
    });

    // Get user's subscription to determine limit
    const userSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    });

    const dailyLimit = userSubscription?.plan.dailyQuestionsLimit || 20; // Default freemium limit

    // Create quota if doesn't exist
    if (!quota) {
      quota = await prisma.dailyQuota.create({
        data: {
          userId,
          date: today,
          questionsUsed: 0,
          questionsLimit: dailyLimit
        }
      });
    }

    // Check if user has reached daily limit
    if (quota.questionsUsed >= quota.questionsLimit) {
      throw new AppError(
        `Daily question limit reached (${quota.questionsLimit}). Upgrade your plan for more questions.`,
        429,
        'QUOTA_EXCEEDED'
      );
    }

    // Generate AI response
    const generatedResponse = await this.generateAIResponse(
      data.questionText,
      data.subject,
      data.gradeLevel,
      data.questionType || 'explanation'
    );

    const responseTime = Date.now() - startTime;

    // Save question to database
    const question = await prisma.aIQuestion.create({
      data: {
        userId,
        subject: data.subject,
        gradeLevel: data.gradeLevel,
        questionText: data.questionText,
        aiResponse: generatedResponse.answer,
        steps: { steps: generatedResponse.steps },
        quiz: { questions: generatedResponse.quiz },
        questionType: data.questionType || 'explanation',
        responseTimeMs: responseTime,
        tokensUsed: generatedResponse.answer.length + JSON.stringify(generatedResponse.steps).length, // Approximation
        tags: this.extractTags(data.questionText, data.subject)
      }
    });

    // Update quota
    await prisma.dailyQuota.update({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      data: {
        questionsUsed: { increment: 1 }
      }
    });

    return {
      id: question.id,
      questionText: question.questionText,
      aiResponse: question.aiResponse,
      steps: question.steps,
      quiz: question.quiz,
      subject: question.subject,
      gradeLevel: question.gradeLevel,
      createdAt: question.createdAt
    };
  }

  /**
   * Extract relevant tags from question text and subject
   */
  private static extractTags(questionText: string, subject: string): string[] {
    const tags: string[] = [subject.toLowerCase()];

    // Common educational keywords
    const keywords = [
      'equation', 'formula', 'theorem', 'definition', 'concept', 'example',
      'problem', 'solution', 'method', 'principle', 'law', 'theory',
      'calculation', 'analysis', 'explanation', 'comparison', 'difference'
    ];

    const lowerQuestion = questionText.toLowerCase();
    keywords.forEach(keyword => {
      if (lowerQuestion.includes(keyword)) {
        tags.push(keyword);
      }
    });

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Get user's question history with pagination
   */
  static async getUserQuestions(
    userId: string,
    page = 1,
    limit = 20,
    filters?: {
      subject?: string;
      gradeLevel?: string;
      questionType?: string;
      isBookmarked?: boolean;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ) {
    const skip = (page - 1) * limit;
    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder || 'desc';

    const where = {
      userId,
      ...(filters?.subject && { subject: filters.subject }),
      ...(filters?.gradeLevel && { gradeLevel: filters.gradeLevel }),
      ...(filters?.questionType && { questionType: filters.questionType }),
      ...(filters?.isBookmarked !== undefined && { isBookmarked: filters.isBookmarked }),
      ...(filters?.search && {
        OR: [
          { questionText: { contains: filters.search, mode: 'insensitive' as const } },
          { aiResponse: { contains: filters.search, mode: 'insensitive' as const } },
          { tags: { hasSome: [filters.search.toLowerCase()] } }
        ]
      })
    };

    const [questions, total] = await Promise.all([
      prisma.aIQuestion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.aIQuestion.count({ where })
    ]);

    return {
      questions: questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        aiResponse: q.aiResponse,
        steps: q.steps,
        quiz: q.quiz,
        subject: q.subject,
        gradeLevel: q.gradeLevel,
        questionType: q.questionType,
        isBookmarked: q.isBookmarked,
        tags: q.tags,
        createdAt: q.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Toggle bookmark status
   */
  static async toggleBookmark(questionId: string, userId: string) {
    const question = await prisma.aIQuestion.findFirst({
      where: { id: questionId, userId }
    });

    if (!question) {
      throw new AppError('Question not found', 404, 'QUESTION_NOT_FOUND');
    }

    return await prisma.aIQuestion.update({
      where: { id: questionId },
      data: { isBookmarked: !question.isBookmarked }
    });
  }

  /**
   * Delete a question
   */
  static async deleteQuestion(questionId: string, userId: string) {
    const question = await prisma.aIQuestion.findFirst({
      where: { id: questionId, userId }
    });

    if (!question) {
      throw new AppError('Question not found', 404, 'QUESTION_NOT_FOUND');
    }

    await prisma.aIQuestion.delete({
      where: { id: questionId }
    });
  }

  /**
   * Get user's current quota status
   */
  static async getUserQuota(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const quota = await prisma.dailyQuota.findUnique({
      where: {
        userId_date: {
          userId,
          date: today
        }
      }
    });

    if (!quota) {
      // Get user's subscription to determine limit
      const userSubscription = await prisma.userSubscription.findFirst({
        where: {
          userId,
          status: 'ACTIVE'
        },
        include: { plan: true },
        orderBy: { createdAt: 'desc' }
      });

      const dailyLimit = userSubscription?.plan.dailyQuestionsLimit || 20;

      return {
        used: 0,
        limit: dailyLimit,
        remaining: dailyLimit,
        resetAt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    return {
      used: quota.questionsUsed,
      limit: quota.questionsLimit,
      remaining: quota.questionsLimit - quota.questionsUsed,
      resetAt: new Date(quota.date.getTime() + 24 * 60 * 60 * 1000)
    };
  }
}