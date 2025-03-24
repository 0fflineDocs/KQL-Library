import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Query, CategoryInfo } from '@/types';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categories: string[];
  categoryInfo: Record<string, CategoryInfo>;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedSubCategory: string | null;
  setSelectedSubCategory: (subcategory: string | null) => void;
  queries: Query[];
  setSelectedQuery: (query: Query | null) => void;
}

const SearchModal = ({ 
  isOpen, 
  onClose, 
  onSearch, 
  searchTerm, 
  setSearchTerm,
  categories,
  categoryInfo,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  queries,
  setSelectedQuery
}: SearchModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'Enter') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle outside clicks
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

  // Filter queries based on search term
  const filteredQueries = searchTerm 
    ? queries.filter(query => 
        query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (query.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    : [];

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    onClose();
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (category: string, subcategory: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(subcategory);
    onClose();
  };

  // Handle query selection
  const handleQuerySelect = (query: Query) => {
    setSelectedQuery(query);
    setSelectedCategory(query.category);
    setSelectedSubCategory(query.subCategory || null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 z-50">
      <div 
        ref={modalRef}
        className="w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-h-[80vh] flex flex-col"
      >
        {/* Search input */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search queries, tags, descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border-0 rounded px-3 py-2 text-white placeholder:text-gray-400 focus:ring-1 focus:ring-[#8be9fd] focus:outline-none"
            />
            <button 
              className="p-1 rounded-full hover:bg-gray-800"
              onClick={() => setSearchTerm('')}
            >
              {searchTerm && <X className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>
        
        {/* Search results or categories */}
        <div className="overflow-y-auto flex-1 p-4">
          {searchTerm ? (
            // Show search results
            filteredQueries.length > 0 ? (
              <div>
                <h3 className="text-gray-400 text-sm mb-2">Search Results ({filteredQueries.length})</h3>
                <div className="space-y-1">
                  {filteredQueries.map((query, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-2 hover:bg-gray-800 rounded text-white flex flex-col"
                      onClick={() => handleQuerySelect(query)}
                    >
                      <span className="text-[#50fa7b] font-medium">{query.title}</span>
                      <span className="text-sm text-[#ffb86c]">{query.description}</span>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-[#bd93f9]">{query.category}</span>
                        {query.subCategory && (
                          <span className="text-xs text-[#ff79c6]">{query.subCategory}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                No queries found matching "{searchTerm}"
              </div>
            )
          ) : (
            // Show categories and subcategories
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => {
                const info = categoryInfo[category];
                const textColorClass = info?.textColor || "text-blue-400";
                
                return (
                  <div key={category} className="border border-gray-800 rounded-lg p-3">
                    <button
                      className={`text-left font-medium mb-2 ${textColorClass} hover:underline w-full`}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {info?.displayName || category}
                    </button>
                    
                    {info?.subCategories && info.subCategories.length > 0 && (
                      <div className="ml-2 space-y-1 border-l border-gray-800 pl-2">
                        {info.subCategories.map((subCategory) => (
                          <button
                            key={subCategory}
                            className="text-left block text-sm text-[#ff79c6] hover:bg-gray-800 rounded px-2 py-1 w-full"
                            onClick={() => handleSubcategorySelect(category, subCategory)}
                          >
                            {subCategory}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Show count of queries in this category */}
                    <div className="text-xs text-gray-400 mt-2">
                      {queries.filter(q => q.category === category).length} queries
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer with cancel button */}
        <div className="border-t border-gray-800 p-3 flex justify-end">
          <button 
            className="px-4 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#8be9fd]"
            onClick={onClose}
          >
            Cancel (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
