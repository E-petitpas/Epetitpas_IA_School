import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Brain, Home, BookOpen, Settings, Menu, History, User, LogOut, Shield, CreditCard } from "lucide-react";
import { StudentDashboard } from "./StudentDashboard";
import { StudentSettingsPage } from "./StudentSettingsPage";
import { QuestionHistory } from "./QuestionHistory";
import { Logo } from "./Logo";
import { useState, useEffect } from "react";
import { supabase } from '../utils/supabase/client';

interface StudentAppProps {
  user: any;
  session: any;
  onSignOut: () => void;
  onRoleSwitch: (role: 'student' | 'admin') => void;
}

export function StudentApp({ user, session, onSignOut, onRoleSwitch }: StudentAppProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dailyUsage, setDailyUsage] = useState({ used: 0, limit: 20 });

  useEffect(() => {
    fetchUserUsage();
  }, [user]);

  const fetchUserUsage = async () => {
    // Skip database operations in development mode
    console.log('Using default usage values for development mode');
    setDailyUsage(prev => ({ ...prev, used: Math.floor(Math.random() * 5) })); // Random for demo
  };

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: Home, color: "blue" },
    { id: "history", label: "History & Revision", icon: History, color: "green" },
    { id: "settings", label: "Settings", icon: Settings, color: "orange" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "history":
        return <QuestionHistory user={user} session={session} />;
      case "settings":
        return <StudentSettingsPage user={user} session={session} onUpdate={fetchUserUsage} />;
      default:
        return <StudentDashboard user={user} session={session} onUsageUpdate={fetchUserUsage} dailyUsage={dailyUsage} />;
    }
  };

  const getPageTitle = () => {
    const currentNav = navigation.find(nav => nav.id === activeTab);
    return currentNav ? currentNav.label : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="w-full px-4 md:px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Logo size="sm" showText={true} variant="compact" className="flex-shrink-0 sm:hidden" />
            <Logo size="sm" showText={true} variant="default" className="hidden sm:flex flex-shrink-0" />
            <div className="ml-3 hidden lg:block">
              <p className="text-xs text-blue-600 font-medium">Student Portal</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                    activeTab === item.id
                      ? `bg-${item.color}-100 text-${item.color}-700 shadow-sm`
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
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
              <span className="text-sm text-blue-900 font-medium">{user?.name}</span>
              <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                Student
              </Badge>
            </div>
            
            {user?.role === 'admin' && (
              <Button
                onClick={() => onRoleSwitch('admin')}
                variant="outline"
                size="sm"
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </Button>
            )}
            
            <Button
              onClick={onSignOut}
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
            <nav className="grid grid-cols-1 gap-2 mt-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-lg transition-colors font-medium ${
                      activeTab === item.id
                        ? `bg-${item.color}-100 text-${item.color}-700`
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
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-blue-900 font-medium">{user?.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {user?.role === 'admin' && (
                  <Button
                    onClick={() => onRoleSwitch('admin')}
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Admin
                  </Button>
                )}
                
                <Button
                  onClick={onSignOut}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {(() => {
                const currentNav = navigation.find(nav => nav.id === activeTab);
                if (currentNav) {
                  const Icon = currentNav.icon;
                  return (
                    <>
                      <div className={`w-8 h-8 bg-gradient-to-br from-${currentNav.color}-500 to-${currentNav.color}-600 rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h1 className="text-2xl text-gray-900 font-semibold">{currentNav.label}</h1>
                    </>
                  );
                }
                return null;
              })()}
            </div>
            
            {activeTab === "dashboard" && (
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-blue-600 border-blue-300">
                  {dailyUsage.used}/{dailyUsage.limit} questions today
                </Badge>
              </div>
            )}
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-2 py-2">
        <nav className="flex items-center justify-around">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? `text-${item.color}-600`
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