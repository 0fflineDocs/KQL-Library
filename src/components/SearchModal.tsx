// src/components/SearchModal.tsx - Updated to maintain category-subcategory consistency
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Query, CategoryInfo } from '@/types';

// Utility functions for subcategory key management
const createSubcategoryKey = (category: string, subcategory: string) => `${category}:${subcategory}`;

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categories: string[];
  categoryInfo: Record<string, CategoryInfo>;
  setSelectedCategory: (category: string | null) => void;
  setSelectedSubCategory: (subcategory: string | null) => void;
  queries: Query[];
  setSelectedQuery: (query: Query | null) => void;
}

const SearchModal = ({ 
  isOpen, 
  onClose, 
  searchTerm, 
  setSearchTerm,
  categories,
  categoryInfo,
  setSelectedCategory,
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
      } else if (event.key === 'Enter' && filteredQueries.length > 0) {
        handleQuerySelect(filteredQueries[0]);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose, searchTerm]);

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
    // Always set category first to ensure consistency
    setSelectedCategory(category);
    
    // Then set subcategory with compound key
    setSelectedSubCategory(createSubcategoryKey(category, subcategory));
    onClose();
  };

  // Handle query selection
  const handleQuerySelect = (query: Query) => {
    setSelectedQuery(query);
    
    // Set category to match the query's category
    setSelectedCategory(query.category);
    
    // Set subcategory if the query has one
    if (query.subCategory) {
      setSelectedSubCategory(createSubcategoryKey(query.category, query.subCategory));
    } else {
      setSelectedSubCategory(null);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 z-50">
        <motion.div 
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-slate-900 border border-slate-700/50 shadow-2xl flex flex-col"
        >
          {/* Search input */}
          <div className="p-4 border-b border-slate-700/30">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search queries, tags, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-500 text-sm transition-all duration-200 outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600/50"
              />
              <button 
                className="p-1 rounded-full hover:bg-slate-800/50 transition-colors duration-200"
                onClick={() => setSearchTerm('')}
              >
                {searchTerm && <X className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
          
          {/* Search results or categories */}
          <div className="overflow-y-auto flex-1 p-4">
            {searchTerm ? (
              // Show search results
              filteredQueries.length > 0 ? (
                <div>
                  <h3 className="text-slate-400 text-sm mb-2">Search Results ({filteredQueries.length})</h3>
                  <div className="space-y-1">
                    {filteredQueries.map((query, index) => (
                      <motion.button
                        key={`${query.category}-${query.title}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="w-full text-left p-3 hover:bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 text-white flex flex-col transition-colors duration-200"
                        onClick={() => handleQuerySelect(query)}
                      >
                        <span className="text-slate-100 font-medium">{query.title}</span>
                        <span className="text-sm text-slate-300">{query.description}</span>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-slate-400">{query.category}</span>
                          {query.subCategory && (
                            <span className="text-xs text-slate-500">{query.subCategory}</span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-4">
                  No queries found matching "{searchTerm}"
                </div>
              )
            ) : (
              // Show categories and subcategories
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category, index) => {
                  const info = categoryInfo[category];
                  const textColorClass = info?.textColor || "text-blue-400";
                  
                  // Get all subcategories for this category from actual queries
                  const subcategories = [...new Set(
                    queries
                      .filter(q => q.category === category && q.subCategory)
                      .map(q => q.subCategory as string)
                  )];
                  
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-5 hover:bg-slate-800 hover:border-slate-600/50 transition-colors duration-200"
                    >
                      <button
                        className={`text-left font-medium mb-2 ${textColorClass} hover:underline w-full text-sm`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {info?.displayName || category}
                      </button>
                      
                      {subcategories.length > 0 && (
                        <div className="ml-2 space-y-1 border-l border-slate-700/30 pl-2">
                          {subcategories.map((subCategory) => (
                            <button
                              key={`${category}:${subCategory}`}
                              className="text-left block text-sm text-slate-300 hover:text-slate-200 hover:bg-slate-800/50 rounded px-2 py-1 w-full transition-colors duration-200"
                              onClick={() => handleSubcategorySelect(category, subCategory)}
                            >
                              {subCategory}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Show count of queries in this category */}
                      <div className="text-xs text-slate-500 mt-2">
                        {queries.filter(q => q.category === category).length} queries
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Footer with cancel button */}
          <div className="border-t border-slate-700/30 p-3 flex justify-end">
            <button 
              className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-slate-200 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-slate-600/50"
              onClick={onClose}
            >
              Cancel (ESC)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SearchModal;
