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
  const auth = authStorage.get();

  useEffect(() => {
    if (requireAuth && !auth.isAuthenticated) {
      navigate('/login');
    } else if (!requireAuth && auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, requireAuth, navigate]);

  if (requireAuth && !auth.isAuthenticated) {
    return null; // or a loading spinner
  }

  if (!requireAuth && auth.isAuthenticated) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}

