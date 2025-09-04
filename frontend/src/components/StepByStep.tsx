import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ExportButton } from "./ExportButton";
import { Logo } from "./Logo";
import { 
  BookOpen, 
  CheckCircle,
  PlayCircle
} from "lucide-react";
import { useState } from "react";

interface Step {
  title: string;
  content: string;
  order: number;
}

interface StepByStepProps {
  steps: Step[];
}

export function StepByStep({ steps }: StepByStepProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const sortedSteps = steps.sort((a, b) => a.order - b.order);
  
  const exportContent = {
    steps: sortedSteps.map(step => `${step.title}: ${step.content}`),
    title: "Explication étape par étape par Mr Alex"
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Logo size="sm" showText={false} />
          <div>
            <h3 className="text-xl text-gray-900 font-semibold">Explication étape par étape</h3>
            <p className="text-sm text-gray-600">Guidée par Mr Alex</p>
          </div>
        </div>
        
        <ExportButton 
          content={exportContent} 
          type="step-by-step" 
        />
      </div>
        
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          variant="outline"
          size="sm"
          className="border-orange-300"
        >
          Précédent
        </Button>
        <span className="text-sm text-gray-600 px-3">
          Étape {currentStep + 1} sur {sortedSteps.length}
        </span>
        <Button
          onClick={() => setCurrentStep(Math.min(sortedSteps.length - 1, currentStep + 1))}
          disabled={currentStep === sortedSteps.length - 1}
          variant="outline"
          size="sm"
          className="border-orange-300"
        >
          Suivant
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {sortedSteps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              index === currentStep
                ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                : index < currentStep
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-semibold">Étape {index + 1}</span>
              {index < currentStep && <CheckCircle className="w-3 h-3" />}
              {index === currentStep && <PlayCircle className="w-3 h-3" />}
            </div>
            <p className="text-sm font-medium">{step.title}</p>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border border-orange-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {currentStep + 1}
          </div>
          <h4 className="text-orange-800 font-semibold">
            {sortedSteps[currentStep].title}
          </h4>
        </div>
        <p className="text-gray-800 leading-relaxed">{sortedSteps[currentStep].content}</p>
        <div className="mt-4 text-xs text-gray-500 border-t pt-2">
          💡 Mr Alex vous guide pas à pas dans cette explication
        </div>
      </div>
    </Card>
  );
}