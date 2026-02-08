// src/components/layout/SidebarNavigation.tsx - Complete rewrite with fixes
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import { Query, CategoryInfo } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarNavigationProps {
  categories: string[];
  categoryInfo: Record<string, CategoryInfo>;
  queries: Query[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedSubCategory: string | null;
  setSelectedSubCategory: (subcategory: string | null) => void;
  selectedQuery: Query | null;
  setSelectedQuery: (query: Query | null) => void;
}

// Create a compound key for subcategories to make them unique
const createSubcategoryKey = (category: string, subcategory: string) => `${category}:${subcategory}`;
const parseSubcategoryKey = (key: string | null) => {
  if (!key) return { category: null, subcategory: null };
  const [category, subcategory] = key.split(':');
  return { category, subcategory };
};

const SidebarNavigation = ({
  categories,
  categoryInfo,
  queries,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedQuery,
  setSelectedQuery
}: SidebarNavigationProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Auto-expand the selected category
  useEffect(() => {
    if (selectedCategory) {
      setExpandedCategories(prev => ({
        ...prev,
        [selectedCategory]: true
      }));
    }
  }, [selectedCategory]);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
    
    // If clicking an already selected category, deselect it
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedQuery(null);
    } else {
      // Otherwise, select the new category and reset subcategory
      setSelectedCategory(category);
      setSelectedSubCategory(null);
    }
  };

  // Filter queries by category and subcategory - ensure both match exactly
  const getFilteredQueries = (category: string, subcategory: string | null = null) => {
    return queries.filter(query => {
      // First, match the exact category
      const categoryMatch = query.category === category;
      
      // Then, if a subcategory is specified, check if it matches
      const subcategoryMatch = !subcategory || query.subCategory === subcategory;
      
      return categoryMatch && subcategoryMatch;
    });
  };

  // Get all subcategories for a category from the queries (not just the predefined ones)
  const getSubcategoriesFromQueries = (category: string) => {
    const subcategories = queries
      .filter(query => query.category === category && query.subCategory)
      .map(query => query.subCategory as string);
    
    return [...new Set(subcategories)]; // Remove duplicates
  };

  // Select a subcategory using the compound key - ensure we maintain category context
  const handleSubcategorySelect = (category: string, subcategory: string) => {
    // Important: When selecting a subcategory, also ensure the parent category is selected
    setSelectedCategory(category);
    
    const currentKey = selectedSubCategory;
    const newKey = createSubcategoryKey(category, subcategory);
    
    // If the same subcategory is clicked again, deselect it
    if (currentKey === newKey) {
      setSelectedSubCategory(null);
    } else {
      setSelectedSubCategory(newKey);
    }
  };

  // Select a query and ensure category/subcategory context is maintained
  const handleQuerySelect = (query: Query) => {
    setSelectedQuery(query);
    
    // Ensure category is set to match the query's category
    if (selectedCategory !== query.category) {
      setSelectedCategory(query.category);
    }
    
    // Update subcategory to match the query if needed
    if (query.subCategory) {
      const querySubcategoryKey = createSubcategoryKey(query.category, query.subCategory);
      if (selectedSubCategory !== querySubcategoryKey) {
        setSelectedSubCategory(querySubcategoryKey);
      }
    } else {
      setSelectedSubCategory(null);
    }
  };
  
  // Get current queries based on selected filters - ensures we respect both category and subcategory
  const currentQueries = selectedCategory ? (() => {
    // Extract the subcategory name from the compound key
    const subcategoryName = selectedSubCategory 
      ? parseSubcategoryKey(selectedSubCategory).subcategory
      : null;
    
    // Verify the category in the compound key matches the selected category
    // This prevents showing queries from the wrong category even if subcategory names match
    const isValidSubcategory = !selectedSubCategory || 
      parseSubcategoryKey(selectedSubCategory).category === selectedCategory;
    
    // If category mismatch in subcategory key, clear it
    if (selectedSubCategory && !isValidSubcategory) {
      // This would be handled by the parent component, but we'll filter to be safe
      return getFilteredQueries(selectedCategory, null);
    }
    
    return getFilteredQueries(selectedCategory, subcategoryName);
  })() : [];

  return (
    <div className="flex h-full">
      {/* Left panel: Categories and Subcategories */}
      <div className="w-64 bg-slate-900 border-r border-slate-800/50 overflow-y-auto h-full">
        <div className="p-2">
          {categories.map((category) => {
            const isExpanded = expandedCategories[category];
            const textColorClass = categoryInfo[category]?.textColor || "text-blue-400";
            const subcategories = getSubcategoriesFromQueries(category);
            
            return (
              <div key={category} className="mb-1">
                <Button
                  className={cn(
                    "w-full p-2 rounded-lg flex items-center justify-start transition-colors duration-200",
                    selectedCategory === category ? "bg-slate-800" : "hover:bg-slate-800/50"
                  )}
                  onClick={() => toggleCategory(category)}
                >
                  {isExpanded ? 
                    <ChevronDown className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" /> : 
                    <ChevronRight className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                  }
                  <span className={`truncate text-left text-sm font-medium ${textColorClass}`}>
                    {categoryInfo[category]?.displayName || category}
                  </span>
                </Button>
                
                {isExpanded && subcategories.length > 0 && (
                  <div className="ml-2 pl-2 border-l border-slate-700/30 mt-1 mb-2">
                    {subcategories.map((subcategory) => {
                      const subcategoryKey = createSubcategoryKey(category, subcategory);
                      const isSelected = selectedSubCategory === subcategoryKey;
                      
                      return (
                        <Button
                          key={subcategoryKey}
                          className={cn(
                            "w-full p-1.5 pl-6 text-sm rounded-lg flex items-center justify-start transition-colors duration-200",
                            isSelected 
                              ? "bg-slate-800 text-slate-100 font-medium" 
                              : "text-slate-300 hover:bg-slate-800/50 hover:text-slate-200"
                          )}
                          onClick={() => handleSubcategorySelect(category, subcategory)}
                        >
                          <span className="truncate text-left">{subcategory}</span>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel: Queries */}
      <div className="w-72 bg-slate-900/90 overflow-y-auto h-full">
        <div className="p-2">
          {selectedCategory ? (
            currentQueries.length > 0 ? (
              <div>
                <div className="p-2 border-b border-slate-700/30 mb-2">
                  <h3 className="text-sm font-medium text-slate-400">
                    {selectedSubCategory 
                      ? `${selectedCategory} / ${parseSubcategoryKey(selectedSubCategory).subcategory}` 
                      : selectedCategory}
                    <span className="ml-1 text-xs">({currentQueries.length})</span>
                  </h3>
                </div>
                {currentQueries.map((query, index) => (
                  <Button
                    key={`${query.category}-${query.title}-${index}`}
                    className={cn(
                      "w-full p-2 text-sm rounded-lg flex items-center justify-start my-1 transition-colors duration-200",
                      selectedQuery?.title === query.title && selectedQuery?.category === query.category
                        ? "bg-slate-800 text-slate-100" 
                        : "text-slate-300 hover:bg-slate-800/50 hover:text-slate-200"
                    )}
                    onClick={() => handleQuerySelect(query)}
                  >
                    <span className="truncate text-left">{query.title}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 text-slate-500">
                No queries available for this {selectedSubCategory ? "subcategory" : "category"}
              </div>
            )
          ) : (
            <div className="text-center p-6 text-slate-500">
              Select a category to view available queries
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
