import { createPortal } from 'react-dom';
import { SortOption } from './ListHeader';

interface SortModalProps {
  isOpen: boolean;
  sortBy: SortOption;
  onClose: () => void;
  onSelect: (option: SortOption) => void;
}

export default function SortModal({
  isOpen,
  sortBy,
  onClose,
  onSelect,
}: SortModalProps) {
  if (!isOpen) return null;

  const handleSelect = (option: SortOption) => {
    onSelect(option);
    onClose();
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      <div className="fixed top-24 right-4 sm:right-8 z-50 bg-gray-white rounded-lg shadow-drop overflow-hidden min-w-[105px]">
        <div className="bg-primary px-4 py-3">
          <h3 className="text-subtitle2 text-gray-white font-bold">Sort by:</h3>
        </div>
        <div className="p-4 space-y-3">
          <button
            type="button"
            onClick={() => handleSelect('number')}
            className="w-full flex items-center space-x-3 hover:bg-gray-background p-2 rounded-lg transition-colors"
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              sortBy === 'number' 
                ? 'border-primary bg-primary' 
                : 'border-gray-medium'
            }`}>
              {sortBy === 'number' && (
                <div className="w-2 h-2 rounded-full bg-gray-white" />
              )}
            </div>
            <span className="text-body2 text-gray-dark">Number</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelect('name')}
            className="w-full flex items-center space-x-3 hover:bg-gray-background p-2 rounded-lg transition-colors"
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              sortBy === 'name' 
                ? 'border-primary bg-primary' 
                : 'border-gray-medium'
            }`}>
              {sortBy === 'name' && (
                <div className="w-2 h-2 rounded-full bg-gray-white" />
              )}
            </div>
            <span className="text-body2 text-gray-dark">Name</span>
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
