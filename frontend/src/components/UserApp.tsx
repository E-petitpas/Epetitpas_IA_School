import { Button } from "./ui/button";
import { Brain, Home, BookOpen, MessageSquare, Settings, Menu, CreditCard, History, User, LogOut } from "lucide-react";
import { AskAI } from "./AskAI";
import { StepByStep } from "./StepByStep";
import { AutoQuiz } from "./AutoQuiz";
import { StudentDashboard } from "./StudentDashboard";
import { StudentSettingsPage } from "./StudentSettingsPage";
import { PricingPage } from "./PricingPage";
import { QuestionHistory } from "./QuestionHistory";
import { useState } from "react";

interface UserAppProps {
  onSwitchToAdmin: () => void;
  onLogout: () => void;
}

export function UserApp({ onSwitchToAdmin, onLogout }: UserAppProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userNavigation = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "ask", label: "Ask AI", icon: MessageSquare },
    { id: "steps", label: "Step-by-Step", icon: BookOpen },
    { id: "quiz", label: "Quiz", icon: Brain },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "pricing", label: "Plans", icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "ask":
        return <AskAI />;
      case "steps":
        return <StepByStep />;
      case "quiz":
        return <AutoQuiz />;
      case "history":
        return <QuestionHistory />;
      case "settings":
        return <StudentSettingsPage />;
      case "pricing":
        return <PricingPage />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="w-full px-4 md:px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-blue-900">E-petitpas IA School</h1>
              <p className="text-xs text-blue-600">Student Portal</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {userNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-900">Emma Martin</span>
            </div>
            
            <Button
              onClick={onSwitchToAdmin}
              variant="outline"
              size="sm"
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              Admin
            </Button>
            
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-blue-100">
            <nav className="grid grid-cols-2 gap-2 mt-4">
              {userNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-100">
              <Button
                onClick={onSwitchToAdmin}
                variant="outline"
                size="sm"
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                Switch to Admin
              </Button>
              
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <nav className="space-y-2">
                {userNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3">Today's Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Questions Asked</span>
                    <span className="font-semibold text-green-800">12/20</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Quizzes Completed</span>
                    <span className="font-semibold text-green-800">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Study Time</span>
                    <span className="font-semibold text-green-800">1h 45m</span>
                  </div>
                </div>
              </div>

              {/* Current Plan */}
              <div className="mt-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">Current Plan</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-700">Standard Plan</span>
                  <Button
                    onClick={() => setActiveTab("pricing")}
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Upgrade
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const currentNav = userNavigation.find(nav => nav.id === activeTab);
                    if (currentNav) {
                      const Icon = currentNav.icon;
                      return (
                        <>
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <h1 className="text-2xl font-semibold text-gray-900">{currentNav.label}</h1>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
                
                {activeTab === "dashboard" && (
                  <Button
                    onClick={() => setActiveTab("ask")}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask AI Question
                  </Button>
                )}
              </div>

              {/* Dynamic Content */}
              {renderContent()}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-2 py-2">
        <nav className="flex items-center justify-around">
          {userNavigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
}