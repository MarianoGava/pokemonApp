import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/testUtils';
import ProtectedRoute from '../ProtectedRoute';
import { authStorage } from '@/lib/auth';

vi.mock('@/lib/auth', () => ({
  authStorage: {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('should render children when authenticated and requireAuth is true', () => {
    vi.mocked(authStorage.get).mockReturnValue({ username: 'admin' });

    renderWithProviders(
      <ProtectedRoute requireAuth={true}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should not render children when not authenticated and requireAuth is true', () => {
    vi.mocked(authStorage.get).mockReturnValue({ username: null });

    renderWithProviders(
      <ProtectedRoute requireAuth={true}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when not authenticated and requireAuth is true', async () => {
    vi.mocked(authStorage.get).mockReturnValue({ username: null });

    renderWithProviders(
      <ProtectedRoute requireAuth={true}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should redirect to home when authenticated and requireAuth is false', async () => {
    vi.mocked(authStorage.get).mockReturnValue({ username: 'admin' });

    renderWithProviders(
      <ProtectedRoute requireAuth={false}>
        <div>Login Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should render children when not authenticated and requireAuth is false', () => {
    vi.mocked(authStorage.get).mockReturnValue({ username: null });

    renderWithProviders(
      <ProtectedRoute requireAuth={false}>
        <div>Login Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Login Content')).toBeInTheDocument();
  });

  it('should default requireAuth to true', () => {
    vi.mocked(authStorage.get).mockReturnValue({ username: null });

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
