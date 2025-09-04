// ========================================
// E-petitpas AI School - Revision Sheet Service
// ========================================

import { prisma } from '../database';
import { AppError } from '../types';
import { AIService } from './aiService';
import { ExportFormat } from '../../generated/prisma';

interface CreateRevisionSheetData {
  title: string;
  subject: string;
  gradeLevel: string;
  questionIds: string[];
  exportFormat?: ExportFormat;
}

export class RevisionService {
  /**
   * Create a revision sheet from selected questions
   */
  static async createRevisionSheet(
    userId: string,
    data: CreateRevisionSheetData
  ) {
    // Verify user owns all questions
    const userQuestions = await AIService.getUserQuestions(userId, 1, 1000);
    const userQuestionIds = new Set(userQuestions.questions.map(q => q.id));

    const invalidQuestions = data.questionIds.filter(id => !userQuestionIds.has(id));
    if (invalidQuestions.length > 0) {
      throw new AppError(
        `Invalid question IDs: ${invalidQuestions.join(', ')}`,
        400,
        'INVALID_QUESTION_IDS'
      );
    }

    // Get the selected questions
    const questions = userQuestions.questions.filter(q => data.questionIds.includes(q.id));

    if (questions.length === 0) {
      throw new AppError('No valid questions found', 400, 'NO_QUESTIONS_FOUND');
    }

    // Generate revision sheet content
    const content = this.generateRevisionContent(questions, data.title, data.subject, data.gradeLevel);

    // Save to database
    const revisionSheet = await prisma.revisionSheet.create({
      data: {
        userId,
        title: data.title,
        subject: data.subject,
        gradeLevel: data.gradeLevel,
        content,
        exportFormat: data.exportFormat || 'PDF',
        // filePath will be set when the file is actually generated
      }
    });

    return {
      id: revisionSheet.id,
      title: revisionSheet.title,
      subject: revisionSheet.subject,
      gradeLevel: revisionSheet.gradeLevel,
      content: revisionSheet.content,
      exportFormat: revisionSheet.exportFormat,
      questionCount: questions.length,
      createdAt: revisionSheet.createdAt
    };
  }

  /**
   * Generate the content of the revision sheet
   */
  private static generateRevisionContent(
    questions: any[],
    title: string,
    subject: string,
    gradeLevel: string
  ): string {
    const header = `
# ${title}

**Matière :** ${subject}  
**Niveau :** ${gradeLevel}  
**Nombre de questions :** ${questions.length}  
**Généré le :** ${new Date().toLocaleDateString('fr-FR')}  
**Plateforme :** E-petitpas IA School  

---

## Résumé des Questions et Réponses

`;

    const questionsContent = questions.map((question, index) => {
      const steps = question.steps?.steps || [];
      const quiz = question.quiz?.questions || [];

      return `
### Question ${index + 1}: ${question.subject}

**Question :** ${question.questionText}

**Réponse :**
${question.aiResponse}

${steps.length > 0 ? `
**Étapes détaillées :**
${steps.map((step: any, stepIndex: number) => 
  `${stepIndex + 1}. **${step.title}**  
   ${step.content}`
).join('\n\n')}
` : ''}

${quiz.length > 0 ? `
**Quiz de révision :**
${quiz.map((q: any, qIndex: number) => 
  `**Q${qIndex + 1} :** ${q.question}  
   a) ${q.options[0]}  
   b) ${q.options[1]}  
   c) ${q.options[2]}  
   d) ${q.options[3]}  
   
   *Réponse : ${String.fromCharCode(97 + q.correct_answer)})*`
).join('\n\n')}
` : ''}

---
`;
    }).join('\n');

    const footer = `
## Notes de révision

- [ ] Relire toutes les réponses
- [ ] Refaire les quiz sans regarder les réponses
- [ ] Identifier les points à approfondir
- [ ] Poser des questions complémentaires si nécessaire

---

*Fiche générée automatiquement par E-petitpas IA School*  
*Pour plus d'aide, contactez votre assistant IA Mr Alex*
`;

    return header + questionsContent + footer;
  }

  /**
   * Get user's revision sheets
   */
  static async getUserRevisionSheets(
    userId: string,
    page = 1,
    limit = 20,
    filters?: {
      subject?: string;
      gradeLevel?: string;
      exportFormat?: ExportFormat;
      search?: string;
    }
  ) {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(filters?.subject && { subject: filters.subject }),
      ...(filters?.gradeLevel && { gradeLevel: filters.gradeLevel }),
      ...(filters?.exportFormat && { exportFormat: filters.exportFormat }),
      ...(filters?.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' as const } },
          { content: { contains: filters.search, mode: 'insensitive' as const } }
        ]
      })
    };

    const [sheets, total] = await Promise.all([
      prisma.revisionSheet.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.revisionSheet.count({ where })
    ]);

    return {
      sheets: sheets.map(sheet => ({
        id: sheet.id,
        title: sheet.title,
        subject: sheet.subject,
        gradeLevel: sheet.gradeLevel,
        exportFormat: sheet.exportFormat,
        downloadCount: sheet.downloadCount,
        createdAt: sheet.createdAt,
        // Don't include full content in list view for performance
        preview: sheet.content.substring(0, 200) + (sheet.content.length > 200 ? '...' : '')
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
   * Get a specific revision sheet
   */
  static async getRevisionSheet(sheetId: string, userId: string) {
    const sheet = await prisma.revisionSheet.findFirst({
      where: { id: sheetId, userId }
    });

    if (!sheet) {
      throw new AppError('Revision sheet not found', 404, 'SHEET_NOT_FOUND');
    }

    return sheet;
  }

  /**
   * Update a revision sheet
   */
  static async updateRevisionSheet(
    sheetId: string,
    userId: string,
    data: {
      title?: string;
      subject?: string;
      gradeLevel?: string;
    }
  ) {
    const sheet = await prisma.revisionSheet.findFirst({
      where: { id: sheetId, userId }
    });

    if (!sheet) {
      throw new AppError('Revision sheet not found', 404, 'SHEET_NOT_FOUND');
    }

    return await prisma.revisionSheet.update({
      where: { id: sheetId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.subject && { subject: data.subject }),
        ...(data.gradeLevel && { gradeLevel: data.gradeLevel })
      }
    });
  }

  /**
   * Delete a revision sheet
   */
  static async deleteRevisionSheet(sheetId: string, userId: string) {
    const sheet = await prisma.revisionSheet.findFirst({
      where: { id: sheetId, userId }
    });

    if (!sheet) {
      throw new AppError('Revision sheet not found', 404, 'SHEET_NOT_FOUND');
    }

    await prisma.revisionSheet.delete({
      where: { id: sheetId }
    });
  }

  /**
   * Download a revision sheet (increment download count)
   */
  static async downloadRevisionSheet(sheetId: string, userId: string) {
    const sheet = await this.getRevisionSheet(sheetId, userId);

    // Increment download count
    await prisma.revisionSheet.update({
      where: { id: sheetId },
      data: { downloadCount: { increment: 1 } }
    });

    return {
      id: sheet.id,
      title: sheet.title,
      subject: sheet.subject,
      gradeLevel: sheet.gradeLevel,
      content: sheet.content,
      exportFormat: sheet.exportFormat,
      createdAt: sheet.createdAt
    };
  }

  /**
   * Get user's revision sheet statistics
   */
  static async getRevisionStats(userId: string) {
    const sheets = await prisma.revisionSheet.findMany({
      where: { userId },
      select: {
        subject: true,
        gradeLevel: true,
        exportFormat: true,
        downloadCount: true,
        createdAt: true
      }
    });

    const stats = {
      total: sheets.length,
      thisWeek: sheets.filter(s => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(s.createdAt) >= weekAgo;
      }).length,
      thisMonth: sheets.filter(s => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return new Date(s.createdAt) >= monthAgo;
      }).length,
      totalDownloads: sheets.reduce((sum, s) => sum + s.downloadCount, 0),
      bySubject: sheets.reduce((acc, s) => {
        acc[s.subject] = (acc[s.subject] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byFormat: sheets.reduce((acc, s) => {
        acc[s.exportFormat] = (acc[s.exportFormat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byGradeLevel: sheets.reduce((acc, s) => {
        acc[s.gradeLevel] = (acc[s.gradeLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return stats;
  }

  /**
   * Generate different export formats (for future implementation)
   */
  static async generateExportFile(
    sheetId: string,
    userId: string,
    format: ExportFormat
  ): Promise<{ content: string; mimeType: string; filename: string }> {
    const sheet = await this.getRevisionSheet(sheetId, userId);

    switch (format) {
      case 'PDF':
        // TODO: Implement PDF generation with libraries like puppeteer or jsPDF
        return {
          content: sheet.content,
          mimeType: 'application/pdf',
          filename: `${sheet.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        };

      case 'WORD':
        // TODO: Implement Word document generation with libraries like docx
        return {
          content: sheet.content,
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          filename: `${sheet.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx`
        };

      case 'TXT':
      default:
        return {
          content: sheet.content,
          mimeType: 'text/plain',
          filename: `${sheet.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
        };
    }
  }
}