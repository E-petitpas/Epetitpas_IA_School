// ========================================
// E-petitpas AI School - Route Guards
// ========================================

import React, { ReactNode } from 'react';
import { useAuth } from './context';
import { UserRole } from './types';

interface RouteGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface PrivateRouteProps extends RouteGuardProps {
  allowedRoles?: UserRole[];
  requireEmailVerified?: boolean;
}

// Loading component for auth checks
const AuthLoading: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Vérification de l'authentification...</span>
  </div>
);

// Unauthorized component
const Unauthorized: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h2>
      <p className="text-gray-600 mb-6">
        {message || 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.'}
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retour
      </button>
    </div>
  </div>
);

/**
 * Guest Route - Only for non-authenticated users
 * Redirects authenticated users to dashboard
 */
export const GuestRoute: React.FC<RouteGuardProps> = ({ children, fallback }) => {
  const { user, loading, initialized } = useAuth();

  // Show loading while checking auth
  if (!initialized || loading) {
    return fallback || <AuthLoading />;
  }

  // If user is authenticated, redirect to appropriate dashboard
  if (user) {
    const dashboardPath = user.role === 'ADMIN' ? '/admin' : '/student';
    window.location.replace(dashboardPath);
    return null;
  }

  return <>{children}</>;
};

/**
 * Private Route - Only for authenticated users
 * Can restrict by roles and email verification
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
  requireEmailVerified = false,
  fallback,
}) => {
  const { user, loading, initialized } = useAuth();

  // Show loading while checking auth
  if (!initialized || loading) {
    return fallback || <AuthLoading />;
  }

  // Not authenticated - redirect to login
  if (!user) {
    window.location.replace('/auth/signin');
    return null;
  }

  // Check email verification if required
  if (requireEmailVerified && !user.emailVerifiedAt) {
    return (
      <Unauthorized message="Votre email n'est pas encore vérifié. Veuillez vérifier votre boîte mail." />
    );
  }

  // Check account status
  if (user.statutCompte !== 'ACTIF') {
    return (
      <Unauthorized message="Votre compte n'est pas actif. Contactez le support." />
    );
  }

  // Check role permissions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

/**
 * Admin Route - Only for admin users
 */
export const AdminRoute: React.FC<RouteGuardProps> = ({ children, fallback }) => {
  return (
    <PrivateRoute allowedRoles={['ADMIN']} fallback={fallback}>
      {children}
    </PrivateRoute>
  );
};

/**
 * Student Route - Only for student users
 */
export const StudentRoute: React.FC<RouteGuardProps> = ({ children, fallback }) => {
  return (
    <PrivateRoute allowedRoles={['STUDENT']} fallback={fallback}>
      {children}
    </PrivateRoute>
  );
};

/**
 * Mixed Route - For both admin and students but with different views
 */
export const MixedRoute: React.FC<RouteGuardProps> = ({ children, fallback }) => {
  return (
    <PrivateRoute allowedRoles={['STUDENT', 'ADMIN']} fallback={fallback}>
      {children}
    </PrivateRoute>
  );
};