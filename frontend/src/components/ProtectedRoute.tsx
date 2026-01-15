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
    if (requireAuth && !isAuthenticated) {
      navigate('/login');
    } else if (!requireAuth && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, requireAuth, navigate]);

  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return null;
  }

  return <>{children}</>;
}

