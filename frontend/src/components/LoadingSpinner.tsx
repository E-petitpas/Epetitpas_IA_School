import { Brain, Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-2xl animate-spin"></div>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl text-gray-900 font-semibold mb-2">E-petitpas IA School</h2>
          <p className="text-gray-600">Loading your learning environment...</p>
        </div>
        
        <div className="flex items-center space-x-2 text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Please wait</span>
        </div>
      </div>
    </div>
  );
}