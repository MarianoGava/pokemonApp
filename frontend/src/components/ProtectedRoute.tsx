import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { username } = authStorage.get();
  const isAuthenticated = !!username;

  useEffect(() => {
    const shouldRedirect = requireAuth ? !isAuthenticated : isAuthenticated;
    const redirectPath = requireAuth ? '/login' : '/';

    if (shouldRedirect) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, requireAuth, navigate]);

  const shouldRender = requireAuth ? isAuthenticated : !isAuthenticated;

  if (!shouldRender) {
    return null;
  }

  return children;
}

