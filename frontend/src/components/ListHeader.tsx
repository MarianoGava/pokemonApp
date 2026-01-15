import { useState } from 'react';
import pokeballIcon from '@/assets/icons/pokeball.svg';
import searchIcon from '@/assets/icons/search.svg';
import closeIcon from '@/assets/icons/close.svg';
import sortNumberIcon from '@/assets/icons/sort-number.svg';
import sortNameIcon from '@/assets/icons/sort-name.svg';
import SortModal from './SortModal';

export type SortOption = 'name' | 'number' | 'default';

interface ListHeaderProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export default function ListHeader({
  searchInput,
  onSearchChange,
  onSearchClear,
  sortBy,
  onSortChange,
  onLogout,
  isLoggingOut,
}: ListHeaderProps) {
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-primary text-gray-white shadow-drop">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img 
                src={pokeballIcon} 
                alt="Poké Ball" 
                className="w-6 h-6 brightness-0 invert"
              />
              <h1 className="text-h1 text-gray-white">Pokédex</h1>
            </div>
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 text-body2 text-gray-white bg-transparent border border-gray-white rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-white disabled:opacity-50"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="relative flex-1">
              <img
                src={searchIcon}
                alt="Search"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={onSearchClear}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center cursor-pointer hover:opacity-80"
                  aria-label="Clear search"
                >
                  <img
                    src={closeIcon}
                    alt="Clear"
                    className="w-2 h-2"
                  />
                </button>
              )}
              <input
                type="text"
                value={searchInput}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search"
                className={`w-full pl-11 py-2 bg-gray-white text-gray-copy rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-gray-white text-[10px] ${searchInput ? 'pr-11' : 'pr-4'}`}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsSortModalOpen(!isSortModalOpen)}
              className="w-8 h-8 bg-gray-white rounded-full flex items-center justify-center shadow-drop hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-white"
              aria-label="Sort options"
            >
              <img
                src={sortBy === 'number' ? sortNumberIcon : sortNameIcon}
                alt="Sort"
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>
      </header>

      <SortModal
        isOpen={isSortModalOpen}
        sortBy={sortBy}
        onClose={() => setIsSortModalOpen(false)}
        onSelect={onSortChange}
      />
    </>
  );
}
