import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { AskAI } from "./AskAI";
import { AIResponse } from "./AIResponse";
import { 
  MessageSquare, 
  Brain, 
  BookOpen, 
  Download, 
  Zap, 
  Star,
  Send,
  Loader2,
  CheckCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  Award
} from "lucide-react";
import { useState } from "react";
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface StudentDashboardProps {
  user: any;
  session: any;
  onUsageUpdate: () => void;
  dailyUsage: { used: number; limit: number };
}

interface AIResponse {
  id: string;
  question: string;
  answer: string;
  steps: Array<{
    title: string;
    content: string;
    order: number;
  }>;
  quiz?: Array<{
    question: string;
    options: string[];
    correct_answer: number;
  }>;
  created_at: string;
}

export function StudentDashboard({ user, session, onUsageUpdate, dailyUsage }: StudentDashboardProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);

  const handleAskQuestion = async () => {
    if (!question.trim() || loading || dailyUsage.used >= dailyUsage.limit) return;

    setLoading(true);
    
    try {
      // Call the real API if OPENAI_API_KEY is available, otherwise use mock
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f91daf9c/ask-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          question: question.trim(),
          user_id: user?.id || 'demo-user',
          academic_level: user?.academic_level,
          subjects: user?.subjects || []
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setAiResponse(result.data);
        if (result.mr_alex_mode === 'fallback') {
          console.log('🎓 Mr Alex mode fallback: Réponse intelligente générée (quota OpenAI dépassé ou clé non configurée)');
        } else {
          console.log('🤖 Réponse générée par Mr Alex via OpenAI GPT-4o-mini');
        }
      } else {
        throw new Error(result.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error calling Ask AI API:', error);
      
      // Fallback to mock response
      console.log('Using local fallback response due to API error...');
      
      // Create local fallback response if API fails
      const mockResponse: AIResponse = {
        id: crypto.randomUUID(),
        question: question.trim(),
        answer: `Bonjour ! Je suis Mr Alex, votre assistant éducatif IA. Je rencontre actuellement quelques difficultés techniques, mais je veux quand même vous aider à apprendre ! 

Pour votre question "${question.trim()}", voici une approche générale que nous pouvons utiliser ensemble :`,
        steps: [
          {
            title: "Comprendre la question",
            content: "Commençons par bien analyser ce que vous demandez et identifier les concepts clés à aborder.",
            order: 1
          },
          {
            title: "Explorer les concepts fondamentaux", 
            content: "Nous allons découvrir ensemble les principes de base qui nous aideront à répondre à votre question.",
            order: 2
          },
          {
            title: "Appliquer concrètement",
            content: "Maintenant, voyons comment utiliser ces connaissances dans des situations réelles !",
            order: 3
          }
        ],
        quiz: [
          {
            question: "Quelle est la meilleure façon d'apprendre de nouveaux concepts ?",
            options: [
              "Mémoriser sans comprendre",
              "Les décomposer étape par étape",
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
          },
          {
            question: "Pourquoi est-il important de pratiquer avec des quiz ?",
            options: [
              "C'est inutile",
              "Pour vérifier sa compréhension et s'améliorer",
              "Pour perdre du temps",
              "Pour se décourager"
            ],
            correct_answer: 1
          }
        ],
        created_at: new Date().toISOString()
      };
      
      setAiResponse(mockResponse);
    }
    
    onUsageUpdate();
    setLoading(false);
  };

  const resetSession = () => {
    setAiResponse(null);
    setQuestion("");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 p-8 rounded-2xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-white font-bold mb-2">Bienvenue, {user?.name?.split(' ')[0]} ! 👋</h2>
            <p className="text-blue-100 mb-4">Prêt à apprendre quelque chose de nouveau aujourd'hui ? Demandez-moi n'importe quoi !</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">Questions aujourd'hui : {dailyUsage.used}/{dailyUsage.limit}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span className="text-sm">Niveau : {user?.academic_level || 'Non défini'}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Questions d'aujourd'hui</p>
              <p className="text-2xl text-blue-900 font-semibold">{dailyUsage.used}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">{dailyUsage.limit - dailyUsage.used} restantes</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Série d'étude</p>
              <p className="text-2xl text-green-900 font-semibold">7</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">Jours consécutifs</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Score moyen</p>
              <p className="text-2xl text-orange-900 font-semibold">87%</p>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">Performance quiz</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Temps économisé</p>
              <p className="text-2xl text-purple-900 font-semibold">4.2h</p>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">Cette semaine</p>
        </Card>
      </div>

      {/* AI Question Input */}
      <AskAI 
        question={question}
        setQuestion={setQuestion}
        onAskQuestion={handleAskQuestion}
        loading={loading}
        dailyUsage={dailyUsage}
        onReset={resetSession}
        hasResponse={!!aiResponse}
      />

      {/* AI Thinking State */}
      {loading && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-gray-900 font-semibold mb-2">Mr Alex analyse votre question...</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <span>Traitement : "{question.substring(0, 50)}..."</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <span>Génération d'une explication personnalisée...</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span>Création de questions de pratique...</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* AI Response Display */}
      {aiResponse && !loading && (
        <AIResponse
          question={aiResponse.question}
          answer={aiResponse.answer}
          steps={aiResponse.steps}
          quiz={aiResponse.quiz}
          timestamp={aiResponse.created_at}
          isGenerating={false}
        />
      )}

      {/* Quick Start Tips */}
      {!aiResponse && (
        <Card className="p-6 border-dashed border-2 border-gray-200">
          <h3 className="text-lg text-gray-900 font-semibold mb-4">💡 Conseils pour commencer</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-gray-800 font-medium">Excellentes questions à poser :</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>"Explique-moi la photosynthèse simplement"</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>"Aide-moi à résoudre : 2x + 5 = 15"</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>"Comment structurer un essai persuasif ?"</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-gray-800 font-medium">Ce que je peux faire pour vous :</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Explications étape par étape</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Questions de pratique & quiz</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Aide aux devoirs & guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}