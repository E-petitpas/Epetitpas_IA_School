import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ExportButton } from "./ExportButton";
import { Logo } from "./Logo";
import { 
  Zap,
  CheckCircle,
  RotateCcw
} from "lucide-react";
import { useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

interface AutoQuizProps {
  quiz: QuizQuestion[];
}

export function AutoQuiz({ quiz }: AutoQuizProps) {
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = () => {
    setShowQuizResults(true);
  };

  const getQuizScore = () => {
    if (!quiz || quizAnswers.length === 0) return 0;
    const correct = quizAnswers.filter((answer, index) => 
      answer === quiz[index].correct_answer
    ).length;
    return Math.round((correct / quiz.length) * 100);
  };

  const resetQuiz = () => {
    setQuizAnswers([]);
    setShowQuizResults(false);
  };

  const exportContent = {
    quizData: {
      questions: quiz.map((q, index) => ({
        ...q,
        userAnswer: quizAnswers[index],
        isCorrect: quizAnswers[index] === q.correct_answer
      }))
    },
    score: showQuizResults ? getQuizScore() : undefined,
    title: "Quiz généré par Mr Alex"
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Logo size="sm" showText={false} />
          <div>
            <h3 className="text-xl text-gray-900 font-semibold">Quiz d'entraînement</h3>
            <p className="text-sm text-gray-600">Créé par Mr Alex pour tester vos connaissances</p>
          </div>
          <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200">
            {quiz.length} questions
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          {showQuizResults && (
            <Button
              onClick={resetQuiz}
              variant="outline"
              size="sm"
              className="border-gray-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Recommencer
            </Button>
          )}
          {(showQuizResults || quizAnswers.length === quiz.length) && (
            <ExportButton 
              content={exportContent} 
              type="quiz" 
            />
          )}
        </div>
      </div>

      <div className="space-y-6">
        {quiz.map((quizItem, qIndex) => (
          <div key={qIndex} className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                {qIndex + 1}
              </div>
              <h4 className="text-gray-900 font-medium flex-1">
                {quizItem.question}
              </h4>
            </div>
            
            <div className="space-y-2">
              {quizItem.options.map((option, oIndex) => (
                <button
                  key={oIndex}
                  onClick={() => handleQuizAnswer(qIndex, oIndex)}
                  disabled={showQuizResults}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                    showQuizResults
                      ? oIndex === quizItem.correct_answer
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : quizAnswers[qIndex] === oIndex
                        ? 'bg-red-100 border-red-400 text-red-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                      : quizAnswers[qIndex] === oIndex
                      ? 'bg-purple-100 border-purple-400 text-purple-800'
                      : 'bg-gray-50 border-gray-200 hover:border-purple-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{String.fromCharCode(65 + oIndex)}.</span>
                    <span>{option}</span>
                    {showQuizResults && oIndex === quizItem.correct_answer && (
                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          {showQuizResults && (
            <div className="flex items-center space-x-3">
              <Badge className={`${getQuizScore() >= 70 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'} border-0`}>
                Score: {getQuizScore()}%
              </Badge>
              {getQuizScore() >= 70 ? (
                <span className="text-green-600 text-sm">Excellent travail ! 🎉</span>
              ) : (
                <span className="text-orange-600 text-sm">Continuez à vous entraîner ! 💪</span>
              )}
            </div>
          )}

          <Button
            onClick={submitQuiz}
            disabled={quizAnswers.length !== quiz.length || showQuizResults}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white ml-auto"
          >
            {showQuizResults ? 'Quiz Terminé' : 'Soumettre le Quiz'}
          </Button>
        </div>
      </div>
    </Card>
  );
}