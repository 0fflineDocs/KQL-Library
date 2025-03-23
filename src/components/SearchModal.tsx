import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchModal = ({ isOpen, onClose, onSearch, searchTerm, setSearchTerm }: SearchModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 z-50">
      <div 
        ref={modalRef}
        className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-lg shadow-xl"
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search queries, tags, descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border-0 rounded px-3 py-2 text-white placeholder:text-gray-400 focus:ring-1 focus:ring-[#8be9fd] focus:outline-none"
              autoFocus
            />
          </div>
          <div className="flex justify-end">
            <button 
              className="text-sm px-4 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
