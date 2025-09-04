import { useState, useEffect } from "react";
import { AuthPage } from "./components/AuthPage";
import { StudentApp } from "./components/StudentApp";
import { AdminApp } from "./components/AdminApp";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { supabase } from './utils/supabase/client';

type AppState = 'loading' | 'auth' | 'student' | 'admin';
type UserRole = 'student' | 'admin';

interface User {
  id: string;
  name: string;
  role: UserRole;
  academic_level?: string;
  subjects?: string[];
  learning_preferences?: any;
  created_at?: string;
  updated_at?: string;
}

export default function App() {
  const [currentApp, setCurrentApp] = useState<AppState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setCurrentApp('auth');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setCurrentApp('auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    console.log('Fetching user profile for:', userId);
    
    // Create temporary profile immediately for development
    const { data: authUser } = await supabase.auth.getUser();
    if (authUser.user) {
      const tempProfile = {
        id: authUser.user.id,
        name: authUser.user.user_metadata?.full_name || 'Student',
        role: (authUser.user.user_metadata?.role as UserRole) || 'student',
        academic_level: authUser.user.user_metadata?.academic_level || '',
        subjects: [],
        learning_preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Created temporary profile for development:', tempProfile);
      setUser(tempProfile);
      setCurrentApp(tempProfile.role === 'admin' ? 'admin' : 'student');
      return;
    }

    // Fallback if no auth user
    setCurrentApp('auth');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentApp('auth');
  };

  const handleRoleSwitch = (role: UserRole) => {
    if (user && user.role === 'admin') {
      setCurrentApp(role === 'admin' ? 'admin' : 'student');
    }
  };

  const renderCurrentApp = () => {
    switch (currentApp) {
      case 'loading':
        return <LoadingSpinner />;
      case 'student':
        return (
          <StudentApp 
            user={user}
            session={session}
            onSignOut={handleSignOut}
            onRoleSwitch={handleRoleSwitch}
          />
        );
      case 'admin':
        return (
          <AdminApp 
            user={user}
            session={session}
            onSignOut={handleSignOut}
            onRoleSwitch={handleRoleSwitch}
          />
        );
      default:
        return (
          <AuthPage 
            onAuthSuccess={fetchUserProfile}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Development Mode Banner */}
      <div className="bg-orange-500 text-white text-center py-2 px-4 text-sm font-medium">
        🚧 Development Mode - Using mock data for demonstration purposes
      </div>
      {renderCurrentApp()}
    </div>
  );
}