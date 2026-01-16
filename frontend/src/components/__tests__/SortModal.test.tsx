import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '@/test/testUtils';
import SortModal from '../SortModal';
import { SortOption } from '../ListHeader';

// Mock createPortal to render modal in the same DOM tree
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('SortModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    renderWithProviders(
      <SortModal
        isOpen={false}
        sortBy="number"
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.queryByText('Sort by:')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    renderWithProviders(
      <SortModal
        isOpen={true}
        sortBy="number"
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Sort by:')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should show number as selected when sortBy is number', () => {
    renderWithProviders(
      <SortModal
        isOpen={true}
        sortBy="number"
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const numberOption = screen.getByText('Number').closest('button');
    const numberRadio = numberOption?.querySelector('div');
    expect(numberRadio).toHaveClass('border-primary', 'bg-primary');
  });

  it('should show name as selected when sortBy is name', () => {
    renderWithProviders(
      <SortModal
        isOpen={true}
        sortBy="name"
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const nameOption = screen.getByText('Name').closest('button');
    const nameRadio = nameOption?.querySelector('div');
    expect(nameRadio).toHaveClass('border-primary', 'bg-primary');
  });

  it('should call onSelect and onClose when selecting an option', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SortModal
        isOpen={true}
        sortBy="number"
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const nameButton = screen.getByText('Name').closest('button')!;
    await user.click(nameButton);

    expect(mockOnSelect).toHaveBeenCalledWith('name');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when clicking on backdrop', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(
      <SortModal
        isOpen={true}
        sortBy="number"
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    // Find the backdrop (first div with fixed inset-0)
    const backdrop = container.querySelector('.fixed.inset-0');
    if (backdrop) {
      await user.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should not call onClose when clicking inside modal', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SortModal
        isOpen={true}
        sortBy="number"
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const modalContent = screen.getByText('Sort by:').closest('div');
    if (modalContent) {
      await user.click(modalContent);
      // onClose should not be called when clicking inside
      expect(mockOnClose).not.toHaveBeenCalled();
    }
  });
});
