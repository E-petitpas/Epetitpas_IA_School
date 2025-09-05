import { useState } from 'react';
import {useAuth} from './core/auth/context';
import {LoadingSpinner} from './components/LoadingSpinner';
import {ProtectedRoute} from './core/auth/ProtectedRoute';

// Apps
import {AuthPage} from './components/AuthPage';
import {StudentApp} from './components/StudentApp';
import {AdminApp} from './components/AdminApp';

export const AppRouter = () => {
  const { user, session, loading, initialized, signout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('/');

  // Show loading while initializing
  if (!initialized || loading) {
    return <LoadingSpinner />;
  }

  // Show auth page with session info if exists
  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} session={session} />;
  }

  // Handle redirects based on role
  const handleRedirect = (redirectTo: string, reason: string) => {
    console.log(`Redirecting to ${redirectTo}: ${reason}`);
    setCurrentRoute(redirectTo);
  };

  // Determine which app to show based on current route and user role
  if (user.role === 'ADMIN') {
    return (
      <ProtectedRoute 
        requiredRole="ADMIN" 
        onRedirect={handleRedirect}
        fallbackComponent={<LoadingSpinner />}
      >
        <AdminApp
          user={user}
          session={{ user }}
          onSignOut={signout}
          onRoleSwitch={() => console.log('Role switch not implemented')}
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute 
      requiredRole="STUDENT" 
      onRedirect={handleRedirect}
      fallbackComponent={<LoadingSpinner />}
    >
      <StudentApp
        user={user}
        session={{ user }}
        onSignOut={signout}
        onRoleSwitch={() => console.log('Role switch not implemented')}
      />
    </ProtectedRoute>
  );
};