// ========================================
// E-petitpas AI School - Auth Hooks
// ========================================

import { useAuth } from './context';
import { UserRole } from './types';
import { toast } from 'react-toastify';

// Hook pour vérifier les rôles et gérer les accès
export const useRoleAuth = () => {
  const { user } = useAuth();
  
  const hasRole = (requiredRole: UserRole): boolean => {
    return user?.role === requiredRole;
  };
  
  const isStudent = (): boolean => {
    return user?.role === 'STUDENT';
  };
  
  const isAdmin = (): boolean => {
    return user?.role === 'ADMIN';
  };
  
  const isActiveAccount = (): boolean => {
    return user?.statutCompte === 'ACTIF';
  };
  
  const canAccessRoute = (requiredRole: UserRole): boolean => {
    return hasRole(requiredRole) && isActiveAccount();
  };
  
  // Vérification stricte du rôle vs le type sélectionné lors du login
  const validateRoleMatch = (selectedUserType: 'student' | 'admin'): {
    valid: boolean;
    redirectTo?: string;
    error?: string;
  } => {
    if (!user) {
      return { valid: false, error: 'User not authenticated' };
    }
    
    // Vérification correspondance rôle/sélection
    const expectedRole = selectedUserType === 'admin' ? 'ADMIN' : 'STUDENT';
    const expectedRoute = selectedUserType === 'admin' ? '/admin/dashboard' : '/home';
    
    if (user.role !== expectedRole) {
      const actualUserType = user.role === 'ADMIN' ? 'Admin' : 'Student';
      const selectedType = selectedUserType === 'admin' ? 'Admin' : 'Student';
      
      return {
        valid: false,
        error: `Role mismatch: You are a ${actualUserType} but tried to login as ${selectedType}. Please select the correct user type.`
      };
    }
    
    // Vérification statut compte
    if (!isActiveAccount()) {
      if (user.role === 'ADMIN' && user.statutCompte === 'EN_ATTENTE_VALIDATION') {
        return {
          valid: false,
          error: 'Admin account pending validation. Please wait for approval.'
        };
      }
      return {
        valid: false,
        error: `Account status: ${user.statutCompte}. Please contact support.`
      };
    }
    
    return {
      valid: true,
      redirectTo: expectedRoute
    };
  };
  
  return {
    user,
    hasRole,
    isStudent,
    isAdmin,
    isActiveAccount,
    canAccessRoute,
    validateRoleMatch
  };
};

// Hook pour les routes protégées
export const useProtectedRoute = (requiredRole: UserRole) => {
  const { user, loading } = useAuth();
  const { canAccessRoute } = useRoleAuth();
  
  const isLoading = loading;
  const isAuthenticated = !!user;
  const hasAccess = canAccessRoute(requiredRole);
  
  const getRedirectInfo = () => {
    if (!isAuthenticated) {
      return { shouldRedirect: true, redirectTo: '/login', reason: 'Not authenticated' };
    }
    
    if (!hasAccess) {
      const correctRoute = user?.role === 'ADMIN' ? '/admin/dashboard' : '/home';
      return { 
        shouldRedirect: true, 
        redirectTo: correctRoute, 
        reason: `Access denied. Redirecting to your ${user?.role === 'ADMIN' ? 'admin' : 'student'} dashboard.` 
      };
    }
    
    return { shouldRedirect: false };
  };
  
  return {
    isLoading,
    isAuthenticated,
    hasAccess,
    getRedirectInfo
  };
};

// Hook pour gérer les messages d'erreur role-based
export const useRoleErrorMessages = () => {
  const showRoleMismatchError = (selectedType: 'student' | 'admin', actualRole: UserRole) => {
    const actualType = actualRole === 'ADMIN' ? 'Admin' : 'Student';
    const selectedTypeFormatted = selectedType === 'admin' ? 'Admin' : 'Student';
    
    toast.error(`Role Mismatch: You are a ${actualType} but selected ${selectedTypeFormatted} login. Please use the correct login type.`, {
      position: 'top-center',
      autoClose: 6000
    });
  };
  
  const showAccountStatusError = (status: string) => {
    const messages = {
      'EN_ATTENTE_VALIDATION': 'Your admin account is pending validation. Please wait for approval.',
      'BLOQUE': 'Your account has been blocked. Please contact support.',
      'INACTIF': 'Your account is inactive. Please contact support.'
    };
    
    const message = messages[status as keyof typeof messages] || `Account status: ${status}. Please contact support.`;
    
    toast.error(message, {
      position: 'top-center',
      autoClose: 6000
    });
  };
  
  const showAccessDeniedError = (userRole: UserRole) => {
    const correctDashboard = userRole === 'ADMIN' ? 'Admin Dashboard' : 'Student Dashboard';
    toast.error(`Access denied. Redirecting you to your ${correctDashboard}.`, {
      position: 'top-center',
      autoClose: 4000
    });
  };
  
  return {
    showRoleMismatchError,
    showAccountStatusError,
    showAccessDeniedError
  };
};