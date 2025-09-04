import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  History, 
  Search, 
  FileText, 
  Download,
  Calendar,
  Brain,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  Filter,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface QuestionHistoryProps {
  user: any;
  session: any;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  steps: any[];
  quiz: any[];
  academic_level: string;
  subjects: string[];
  created_at: string;
}

export function QuestionHistory({ user, session }: QuestionHistoryProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    fetchQuestions();
  }, [user]);

  const fetchQuestions = async () => {
    console.log('Using mock question history for development mode');
    
    // Create mock question history
    const mockQuestions: Question[] = [
      {
        id: '1',
        question: 'Explain the concept of photosynthesis in plants',
        answer: 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.',
        steps: [
          { title: 'Light Absorption', content: 'Chlorophyll absorbs light energy', order: 1 },
          { title: 'Water Splitting', content: 'Water molecules are split into hydrogen and oxygen', order: 2 },
          { title: 'Glucose Formation', content: 'Carbon dioxide and hydrogen combine to form glucose', order: 3 }
        ],
        quiz: [
          {
            question: 'What gas is produced during photosynthesis?',
            options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
            correct_answer: 1
          }
        ],
        academic_level: user.academic_level || '',
        subjects: ['Biology'],
        created_at: '2024-01-20T10:00:00Z'
      },
      {
        id: '2',
        question: 'How do I solve quadratic equations?',
        answer: 'Quadratic equations can be solved using the quadratic formula, factoring, or completing the square.',
        steps: [
          { title: 'Identify coefficients', content: 'Find values of a, b, and c in ax² + bx + c = 0', order: 1 },
          { title: 'Apply formula', content: 'Use x = (-b ± √(b²-4ac)) / 2a', order: 2 },
          { title: 'Simplify', content: 'Calculate the discriminant and solve', order: 3 }
        ],
        quiz: [
          {
            question: 'What is the discriminant in a quadratic equation?',
            options: ['b²-4ac', 'a²+b²', '-b/2a', '4ac'],
            correct_answer: 0
          }
        ],
        academic_level: user.academic_level || '',
        subjects: ['Mathematics'],
        created_at: '2024-01-19T14:30:00Z'
      },
      {
        id: '3',
        question: 'What is object-oriented programming?',
        answer: 'Object-oriented programming (OOP) is a programming paradigm based on the concept of objects and classes.',
        steps: [
          { title: 'Understanding Objects', content: 'Objects are instances of classes with properties and methods', order: 1 },
          { title: 'Class Definition', content: 'Classes serve as blueprints for creating objects', order: 2 },
          { title: 'Key Principles', content: 'Encapsulation, inheritance, and polymorphism', order: 3 }
        ],
        quiz: [
          {
            question: 'Which is NOT a principle of OOP?',
            options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Compilation'],
            correct_answer: 3
          }
        ],
        academic_level: user.academic_level || '',
        subjects: ['Computer Science'],
        created_at: '2024-01-18T09:15:00Z'
      }
    ];

    setQuestions(mockQuestions);
    setLoading(false);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || 
                          (q.subjects && q.subjects.includes(selectedSubject));
    return matchesSearch && matchesSubject;
  });

  const generateRevisionSheet = () => {
    const content = `
REVISION SHEET - ${new Date().toLocaleDateString()}

Generated from your E-petitpas IA School learning history

${filteredQuestions.map((q, index) => `
${index + 1}. QUESTION: ${q.question}

ANSWER SUMMARY:
${q.answer}

KEY POINTS:
${q.steps.map((step, i) => `• ${step.title}`).join('\n')}

---
`).join('')}

Total questions reviewed: ${filteredQuestions.length}
Academic Level: ${user.academic_level}
Generated on: ${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revision-sheet-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSubjectStats = () => {
    const subjectCounts = {};
    questions.forEach(q => {
      if (q.subjects) {
        q.subjects.forEach(subject => {
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });
      }
    });
    return Object.entries(subjectCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const uniqueSubjects = [...new Set(questions.flatMap(q => q.subjects || []))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading your history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Questions</p>
              <p className="text-2xl text-blue-900 font-semibold">{questions.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">All time</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">This Week</p>
              <p className="text-2xl text-green-900 font-semibold">12</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+3 from last week</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Subjects Covered</p>
              <p className="text-2xl text-orange-900 font-semibold">{uniqueSubjects.length}</p>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">Different topics</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Avg. Response</p>
              <p className="text-2xl text-purple-900 font-semibold">2.3s</p>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">AI response time</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search questions and answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-400"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none"
              >
                <option value="all">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={generateRevisionSheet}
            disabled={filteredQuestions.length === 0}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Revision Sheet
          </Button>
        </div>
      </Card>

      {/* Subject Distribution */}
      {getSubjectStats().length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Most Studied Subjects
          </h3>
          <div className="space-y-3">
            {getSubjectStats().map(([subject, count]) => (
              <div key={subject} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{subject}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(count / Math.max(...getSubjectStats().map(([,c]) => c))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-900 font-medium w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg text-gray-900 font-semibold">
            Question History ({filteredQuestions.length})
          </h3>
          {filteredQuestions.length !== questions.length && (
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              Filtered results
            </Badge>
          )}
        </div>

        {filteredQuestions.length === 0 ? (
          <Card className="p-8 text-center">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg text-gray-900 font-medium mb-2">No questions found</h4>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedSubject !== "all" 
                ? "Try adjusting your search terms or filters."
                : "Start asking questions to build your learning history!"
              }
            </p>
            {(searchTerm || selectedSubject !== "all") && (
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSubject("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question, index) => (
              <Card key={question.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Question #{questions.length - questions.findIndex(q => q.id === question.id)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(question.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <h4 className="text-gray-900 font-medium mb-2">{question.question}</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">{question.answer}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    {question.subjects && question.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {question.subjects.slice(0, 3).map(subject => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {question.subjects.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{question.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {question.steps && question.steps.length > 0 && (
                        <span className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{question.steps.length} steps</span>
                        </span>
                      )}
                      {question.quiz && question.quiz.length > 0 && (
                        <span className="flex items-center space-x-1">
                          <Brain className="w-3 h-3" />
                          <span>{question.quiz.length} quiz questions</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const content = `Question: ${question.question}\n\nAnswer:\n${question.answer}\n\nSteps:\n${question.steps?.map((s, i) => `${i+1}. ${s.title}: ${s.content}`).join('\n') || 'None'}`;
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `question-${question.id}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}