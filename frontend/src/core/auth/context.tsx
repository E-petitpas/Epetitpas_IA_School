// ========================================
// E-petitpas AI School - Auth Context (with Zustand)
// ========================================

import {createContext, ReactNode, useContext, useEffect} from 'react';
import {useAuthStore} from './store';
import {supabase} from '@/utils/supabase/client';
import {AuthError, AuthSession, SignUpData, User} from './types';

// Auth Context Interface
interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  initialized: boolean;
  signup: (data: SignUpData) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: AuthError }>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const store = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    store.initializeAuth();
    
    // Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' && session) {
          await store.handleSessionUpdate(session);
        } else if (event === 'SIGNED_OUT') {
          store.setUser(null);
          store.setSession(null);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          await store.handleSessionUpdate(session);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []); // Pas de dépendances - les fonctions du store sont stables

  const contextValue: AuthContextType = {
    user: store.user,
    session: store.session,
    loading: store.loading,
    initialized: store.initialized,
    signup: store.signup,
    signin: store.signin,
    signout: store.signout,
    refreshSession: store.refreshSession,
    updateProfile: store.updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};