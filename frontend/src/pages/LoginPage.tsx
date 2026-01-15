import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/lib/queries';
import { authStorage } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({ username, password });

      if (response.success) {
        authStorage.set(username);
        navigate('/');
      }
    } catch (err) {
      // Error handled by mutation
    }
  };

  const error = loginMutation.error?.message || 
    (loginMutation.data && !loginMutation.data.success ? loginMutation.data.error : '');

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-primary px-4">
        <div className="max-w-md w-full bg-gray-white rounded-lg shadow-drop p-8">
          <div className="text-center mb-8">
            <h1 className="text-h1 text-gray-dark mb-2">Pokédex</h1>
            <p className="text-body1 text-gray-medium">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-subtitle2 text-gray-dark mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, username: undefined }));
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-body1 ${
                  validationErrors.username ? 'border-red-500' : 'border-gray-light'
                }`}
                placeholder="Enter username"
                disabled={loginMutation.isPending}
              />
              {validationErrors.username && (
                <p className="mt-1 text-body2 text-red-600">{validationErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-subtitle2 text-gray-dark mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-body1 ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-light'
                }`}
                placeholder="Enter password"
                disabled={loginMutation.isPending}
              />
              {validationErrors.password && (
                <p className="mt-1 text-body2 text-red-600">{validationErrors.password}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-body2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-primary text-gray-white py-3 rounded-lg font-bold text-body1 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-drop"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
