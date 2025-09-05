// ========================================
// E-petitpas AI School - Auth Store (Zustand)
// ========================================

import {create} from 'zustand';
import {supabase} from '@/utils/supabase/client';
import {AuthError, AuthSession, SignUpData, User} from './types';
import type {Session} from '@supabase/supabase-js';
import {toast} from 'react-toastify';

// Toast flags to prevent duplicates
let backendErrorShown = false;
let networkErrorShown = false;
let loginSuccessShown = false; // prevent duplicate login success toasts

// Helper to get validation message based on user state
const getValidationMessage = (user: any, emailConfirmed: boolean) => {
  if (!emailConfirmed) {
    return { type: 'email', message: 'Email not confirmed' };
  }
  
  if (user?.role === 'ADMIN' && user?.statutCompte === 'EN_ATTENTE_VALIDATION') {
    const validation = user?.adminValidation;
    if (!validation) {
      return { type: 'admin', message: 'Admin account not yet validated' };
    }
    
    switch (validation.status) {
      case 'PENDING':
        return { type: 'admin', message: 'Admin account pending email confirmation' };
      case 'EMAIL_CONFIRMED':
        return { type: 'admin', message: 'Admin account awaiting manual approval' };
      case 'REJECTED':
        return { type: 'admin', message: `Admin account rejected: ${validation.rejectionReason || 'Contact administrator'}` };
      default:
        return { type: 'admin', message: 'Admin account not yet validated' };
    }
  }
  
  return null;
};

interface AuthState {
  // State
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  initialized: boolean;
  
  // Validation state
  validationMessage: { type: string; message: string } | null;
  
  // Form persistence
  formData: {
    name: string;
    email: string;
    password: string;
    academicLevel: string;
  };

  // Actions
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setSession: (session: AuthSession | null) => void;
  setInitialized: (initialized: boolean) => void;
  setValidationMessage: (message: { type: string; message: string } | null) => void;
  setFormData: (data: Partial<AuthState['formData']>) => void;
  clearFormData: () => void;
  
  // Auth methods
  initializeAuth: () => Promise<void>;
  handleSessionUpdate: (session: Session) => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: AuthError }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  session: null,
  loading: true,
  initialized: false,
  validationMessage: null,
  
  // Form data persistence
  formData: {
    name: '',
    email: '',
    password: '',
    academicLevel: ''
  },

  // State setters
  setLoading: (loading) => set({ loading }),
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setInitialized: (initialized) => set({ initialized }),
  setValidationMessage: (validationMessage) => set({ validationMessage }),
  
  // Form data setters
  setFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),
  clearFormData: () => set({ 
    formData: { name: '', email: '', password: '', academicLevel: '' } 
  }),

  // Initialize auth state
  initializeAuth: async () => {
    const { setLoading, setInitialized, handleSessionUpdate } = get();
    
    try {
      setLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return;
      }

      if (session) {
        await handleSessionUpdate(session);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  },

  // Handle session updates
  handleSessionUpdate: async (session: Session) => {
    const { setSession, setUser } = get();
    
    try {
      // Set session
      const authSession: AuthSession = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      };
      setSession(authSession);

      // Skip real-time email confirmation gate; proceed to backend profile fetch

      try {
        // Fetch user profile from backend
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            if (result.success) {
              setUser(result.data);
              if (!loginSuccessShown) {
                toast.success('Login successful!');
                loginSuccessShown = true;
              }
            } else {
              toast.error('Error retrieving user profile');
            }
          } else {
            // Backend returned HTML instead of JSON
            throw new Error('Backend returned HTML instead of JSON - API not available');
          }
        } else {
          // Backend API not found or error
          if (!backendErrorShown) {
            toast.error('⚠️ Backend API unavailable. Limited functionality.', {
              position: "top-center",
              autoClose: 5000
            });
            backendErrorShown = true;
          }
        }
      } catch (fetchError: any) {
        // Network error or parsing error
        if (!networkErrorShown) {
          const isJSONError = fetchError.message?.includes('JSON') || fetchError.name === 'SyntaxError';
          const errorMessage = isJSONError 
            ? '⚠️ Backend API not configured. Limited functionality.' 
            : '❌ Unable to connect to backend server';
            
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 5000
          });
          networkErrorShown = true;
        }
        console.error('Backend connection error:', fetchError);
      }
    } catch (error) {
      console.error('Error handling session update:', error);
      toast.error('Session update error');
    }
  },

  // Sign up
  signup: async (data: SignUpData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            full_name: data.name,
            ...data.preferences,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Sign in
  signin: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Sign out
  signout: async () => {
    const { setUser, setSession } = get();
    
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      loginSuccessShown = false; // reset toast guard on signout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },

  // Refresh session
  refreshSession: async () => {
    const { handleSessionUpdate } = get();
    
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }

      if (session) {
        await handleSessionUpdate(session);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  },

  // Update profile
  updateProfile: async (data: Partial<User>) => {
    const { session, setUser } = get();
    
    try {
      if (!session) {
        return { success: false, error: { message: 'Not authenticated' } };
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: { message: result.error || 'Update failed' } };
      }

      // Update local user state
      if (result.success && result.data) {
        setUser(result.data);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: { message: error.message } };
    }
  },
}));