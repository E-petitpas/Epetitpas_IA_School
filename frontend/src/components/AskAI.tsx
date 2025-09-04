import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Logo } from "./Logo";
import { 
  MessageSquare, 
  Send,
  Loader2,
  RotateCcw,
  Sparkles
} from "lucide-react";

interface AskAIProps {
  question: string;
  setQuestion: (question: string) => void;
  onAskQuestion: () => void;
  loading: boolean;
  dailyUsage: { used: number; limit: number };
  onReset: () => void;
  hasResponse: boolean;
}

export function AskAI({ 
  question, 
  setQuestion, 
  onAskQuestion, 
  loading, 
  dailyUsage, 
  onReset, 
  hasResponse 
}: AskAIProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-blue-200">
      <div className="flex items-center space-x-3 mb-4">
        <Logo size="sm" showText={false} />
        <div className="flex-1">
          <h3 className="text-xl text-gray-900 font-semibold">Demandez à Mr Alex</h3>
          <p className="text-sm text-gray-600">Votre assistant éducatif IA personnel</p>
        </div>
        <Badge className="bg-gradient-to-r from-orange-100 to-blue-100 text-blue-800 border-blue-200">
          Powered by OpenAI
        </Badge>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="Posez-moi n'importe quelle question ! Par exemple : 'Explique-moi la photosynthèse', 'Aide-moi avec les équations quadratiques', 'Comment écrire un bon essai ?'"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[100px] border-blue-200 focus:border-blue-400 resize-none"
          disabled={loading || dailyUsage.used >= dailyUsage.limit}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Mr Alex vous fournira des explications étape par étape et générera des quiz interactifs</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasResponse && (
              <Button
                onClick={onReset}
                variant="outline"
                className="border-gray-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Nouvelle Question
              </Button>
            )}
            
            <Button
              onClick={onAskQuestion}
              disabled={!question.trim() || loading || dailyUsage.used >= dailyUsage.limit}
              className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Mr Alex réfléchit...' : 'Demander à Mr Alex'}
            </Button>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            🎓 <strong>Mr Alex à votre service :</strong> Je suis votre assistant éducatif bienveillant ! Je reconnais les mathématiques, les sciences, la programmation et bien d'autres sujets pour vous offrir des explications personnalisées avec des quiz ludiques.
          </p>
        </div>

        {dailyUsage.used >= dailyUsage.limit && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              Vous avez atteint votre limite quotidienne de questions. 
              <Button
                variant="link"
                className="text-orange-600 p-0 ml-1"
                onClick={() => {/* Navigate to subscription */}}
              >
                Améliorez votre plan
              </Button> 
              pour poser plus de questions à Mr Alex.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}