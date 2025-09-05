// ========================================
// E-petitpas AI School - Protected Route Component
// ========================================

import { useEffect } from 'react';
import { useProtectedRoute, useRoleErrorMessages } from './hooks';
import { UserRole } from './types';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  fallbackComponent?: React.ReactNode;
  onRedirect?: (redirectTo: string, reason: string) => void;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackComponent,
  onRedirect 
}: ProtectedRouteProps) => {
  const { isLoading, hasAccess, getRedirectInfo } = useProtectedRoute(requiredRole);
  const { showAccessDeniedError } = useRoleErrorMessages();
  
  useEffect(() => {
    if (!isLoading) {
      const redirectInfo = getRedirectInfo();
      
      if (redirectInfo.shouldRedirect) {
        // Show error message for access denied cases
        if (redirectInfo.reason?.includes('Access denied')) {
          showAccessDeniedError(requiredRole);
        }
        
        // Call redirect handler if provided
        if (onRedirect && redirectInfo.redirectTo) {
          setTimeout(() => {
            onRedirect(redirectInfo.redirectTo!, redirectInfo.reason || 'Access denied');
          }, 1500); // Give time for error message to show
        }
      }
    }
  }, [isLoading, getRedirectInfo, onRedirect, showAccessDeniedError, requiredRole]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!hasAccess) {
    return fallbackComponent || <div className="p-4 text-center">Access denied. Redirecting...</div>;
  }
  
  return <>{children}</>;
};