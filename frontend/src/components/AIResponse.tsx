import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExportButton } from "./ExportButton";
import { Logo } from "./Logo";
import { Separator } from "./ui/separator";
import { Bot, CheckCircle, Clock, BookOpen, HelpCircle as Quiz, Trophy, RefreshCw } from "lucide-react";

interface Step {
  title: string;
  content: string;
  order: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

interface AIResponseProps {
  question: string;
  answer: string;
  steps?: Step[];
  quiz?: QuizQuestion[];
  timestamp?: string;
  isGenerating?: boolean;
}

export function AIResponse({ 
  question, 
  answer, 
  steps = [], 
  quiz = [], 
  timestamp, 
  isGenerating = false 
}: AIResponseProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [currentQuizScore, setCurrentQuizScore] = useState(0);

  const exportContent = {
    question,
    answer,
    steps,
    quiz,
    title: "Réponse de Mr Alex"
  };

  const handleQuizAnswer = (questionIndex: number, selectedOption: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const submitQuiz = () => {
    let score = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        score++;
      }
    });
    setCurrentQuizScore(score);
    setShowQuizResults(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowQuizResults(false);
    setCurrentQuizScore(0);
  };

  const canSubmitQuiz = Object.keys(selectedAnswers).length === quiz.length;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-white to-green-50 border-green-200 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">Mr Alex</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Assistant IA
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                {timestamp ? `Répondu le ${new Date(timestamp).toLocaleDateString('fr-FR')}` : 'Réponse en cours...'}
              </p>
            </div>
          </div>
          
          {!isGenerating && (
            <ExportButton 
              content={exportContent} 
              type="ai-response" 
            />
          )}
        </div>

        {/* Question */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2">Q</span>
            Votre question
          </h4>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
            <p className="text-gray-800">{question}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Answer */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-2">R</span>
            Réponse de Mr Alex
            {!isGenerating && (
              <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
            )}
            {isGenerating && (
              <Clock className="w-4 h-4 text-orange-500 ml-2 animate-pulse" />
            )}
          </h4>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            {isGenerating ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-gray-600 text-sm ml-2">Mr Alex prépare une réponse détaillée...</span>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-800 leading-relaxed">{answer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with branding */}
        {!isGenerating && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Logo size="sm" showText={false} />
                <span>E-petitpas IA School - Mr Alex</span>
              </div>
              <span>Réponse générée par IA</span>
            </div>
          </div>
        )}
      </Card>

      {/* Step-by-Step Explanation */}
      {!isGenerating && steps.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Explication étape par étape</h3>
          </div>
          
          <div className="space-y-4">
            {steps
              .sort((a, b) => a.order - b.order)
              .map((step, index) => (
                <Card key={index} className="p-4 bg-white border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {step.order}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-700 leading-relaxed">{step.content}</p>
                    </div>
                  </div>
                </Card>
              ))
            }
          </div>
        </Card>
      )}

      {/* Interactive Quiz */}
      {!isGenerating && quiz.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Quiz className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Quiz de compréhension</h3>
            </div>
            {showQuizResults && (
              <Button
                onClick={resetQuiz}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refaire
              </Button>
            )}
          </div>

          {!showQuizResults ? (
            <div className="space-y-6">
              {quiz.map((question, questionIndex) => (
                <div key={questionIndex} className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Question {questionIndex + 1}: {question.question}
                  </h4>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleQuizAnswer(questionIndex, optionIndex)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedAnswers[questionIndex] === optionIndex
                            ? 'bg-blue-100 border-blue-400 text-blue-800'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-4">
                <Button
                  onClick={submitQuiz}
                  disabled={!canSubmitQuiz}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Vérifier mes réponses
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Résultats : {currentQuizScore}/{quiz.length}
                </h4>
                <p className="text-gray-700">
                  {currentQuizScore === quiz.length 
                    ? "🎉 Parfait ! Tu as tout bon !" 
                    : currentQuizScore >= quiz.length * 0.7 
                    ? "👏 Très bien ! Continue comme ça !" 
                    : "💪 Bon effort ! N'hésite pas à relire l'explication."}
                </p>
              </div>

              <div className="space-y-4">
                {quiz.map((question, questionIndex) => {
                  const userAnswer = selectedAnswers[questionIndex];
                  const isCorrect = userAnswer === question.correct_answer;
                  
                  return (
                    <div key={questionIndex} className="space-y-2">
                      <h4 className="font-medium text-gray-900">
                        Question {questionIndex + 1}: {question.question}
                      </h4>
                      <div className="space-y-1">
                        {question.options.map((option, optionIndex) => {
                          const isUserChoice = userAnswer === optionIndex;
                          const isCorrectAnswer = optionIndex === question.correct_answer;
                          
                          let className = "w-full text-left p-3 rounded-lg border ";
                          if (isCorrectAnswer) {
                            className += "bg-green-100 border-green-400 text-green-800";
                          } else if (isUserChoice && !isCorrectAnswer) {
                            className += "bg-red-100 border-red-400 text-red-800";
                          } else {
                            className += "bg-gray-50 border-gray-200 text-gray-600";
                          }
                          
                          return (
                            <div key={optionIndex} className={className}>
                              <span className="font-medium mr-2">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {option}
                              {isCorrectAnswer && <span className="ml-2">✓</span>}
                              {isUserChoice && !isCorrectAnswer && <span className="ml-2">✗</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}