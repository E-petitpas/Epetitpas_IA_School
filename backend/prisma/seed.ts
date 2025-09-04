import { PrismaClient } from '../generated/prisma';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Créer les plans d'abonnement
    console.log('📋 Creating subscription plans...');
    
    const plans = await Promise.all([
      prisma.subscriptionPlan.upsert({
        where: { name: 'freemium' },
        update: {},
        create: {
          name: 'freemium',
          price: 0.00,
          dailyQuestionsLimit: 20,
          canGenerateQuizzes: false,
          canExportFiles: false,
          hasAdvancedStats: false,
          features: {
            description: 'Plan gratuit avec limitations',
            maxQuestions: 20,
            support: 'Community'
          }
        }
      }),
      
      prisma.subscriptionPlan.upsert({
        where: { name: 'standard' },
        update: {},
        create: {
          name: 'standard',
          price: 9.99,
          dailyQuestionsLimit: 100,
          canGenerateQuizzes: true,
          canExportFiles: true,
          hasAdvancedStats: false,
          features: {
            description: 'Plan standard pour étudiants',
            maxQuestions: 100,
            support: 'Email',
            exportFormats: ['PDF', 'TXT']
          }
        }
      }),
      
      prisma.subscriptionPlan.upsert({
        where: { name: 'premium' },
        update: {},
        create: {
          name: 'premium',
          price: 19.99,
          dailyQuestionsLimit: 300,
          canGenerateQuizzes: true,
          canExportFiles: true,
          hasAdvancedStats: true,
          features: {
            description: 'Plan premium avec statistiques avancées',
            maxQuestions: 300,
            support: 'Priority',
            exportFormats: ['PDF', 'WORD', 'TXT'],
            analytics: true
          }
        }
      }),
      
      prisma.subscriptionPlan.upsert({
        where: { name: 'pro' },
        update: {},
        create: {
          name: 'pro',
          price: 39.99,
          dailyQuestionsLimit: 1000,
          canGenerateQuizzes: true,
          canExportFiles: true,
          hasAdvancedStats: true,
          features: {
            description: 'Plan professionnel pour écoles et centres de formation',
            maxQuestions: 1000,
            support: '24/7',
            exportFormats: ['PDF', 'WORD', 'TXT'],
            analytics: true,
            multipleUsers: true
          }
        }
      })
    ]);

    console.log(`✅ Created ${plans.length} subscription plans`);

    // 2. Créer un utilisateur admin de test
    console.log('👨‍💼 Creating admin user...');
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@e-petitpas.fr' },
      update: {},
      create: {
        email: 'admin@e-petitpas.fr',
        name: 'Admin E-petitpas',
        role: 'ADMIN',
        statutCompte: 'ACTIF',
        emailVerifiedAt: new Date(),
        preferences: {
          language: 'fr',
          theme: 'dark',
          notifications: true
        }
      }
    });

    console.log(`✅ Created admin user: ${adminUser.email}`);

    // 3. Créer un utilisateur étudiant de test
    console.log('🎓 Creating student user...');
    
    const studentUser = await prisma.user.upsert({
      where: { email: 'student@test.fr' },
      update: {},
      create: {
        email: 'student@test.fr',
        name: 'Étudiant Test',
        role: 'USER',
        statutCompte: 'ACTIF',
        emailVerifiedAt: new Date(),
        preferences: {
          language: 'fr',
          theme: 'light',
          notifications: true,
          academicLevel: 'Terminale',
          subjects: ['Mathematics', 'Physics', 'Computer Science']
        }
      }
    });

    // 4. Créer un abonnement pour l'étudiant
    const freemiumPlan = plans.find(p => p.name === 'freemium');
    if (freemiumPlan) {
      await prisma.userSubscription.create({
        data: {
          userId: studentUser.id,
          planId: freemiumPlan.id,
          status: 'ACTIVE',
          startDate: new Date(),
          autoRenew: true
        }
      });

      console.log(`✅ Created subscription for student: ${studentUser.email}`);
    }

    // 5. Créer un quota journalier pour l'étudiant
    await prisma.dailyQuota.upsert({
      where: {
        userId_date: {
          userId: studentUser.id,
          date: new Date()
        }
      },
      update: {},
      create: {
        userId: studentUser.id,
        date: new Date(),
        questionsUsed: 3,
        questionsLimit: 20
      }
    });

    console.log(`✅ Created daily quota for student`);

    // 6. Créer une question IA d'exemple
    await prisma.aIQuestion.create({
      data: {
        userId: studentUser.id,
        subject: 'Mathematics',
        gradeLevel: 'Terminale',
        questionText: 'Explique-moi la dérivée de x²',
        aiResponse: 'La dérivée de x² est 2x. Voici pourquoi...',
        steps: {
          steps: [
            {
              title: 'Règle de puissance',
              content: 'Pour dériver x^n, on utilise la règle: nx^(n-1)',
              order: 1
            },
            {
              title: 'Application',
              content: 'Pour x², n=2, donc: 2x^(2-1) = 2x^1 = 2x',
              order: 2
            }
          ]
        },
        quiz: {
          questions: [
            {
              question: 'Quelle est la dérivée de x³?',
              options: ['3x²', '3x', 'x³', '3'],
              correct_answer: 0
            }
          ]
        },
        questionType: 'explanation',
        tokensUsed: 150,
        responseTimeMs: 1200,
        tags: ['mathematics', 'derivatives', 'calculus']
      }
    });

    console.log(`✅ Created sample AI question`);

    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();