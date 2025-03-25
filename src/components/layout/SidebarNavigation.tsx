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

  // Filter queries by category and subcategory
  const getFilteredQueries = (category: string, subcategory: string | null = null) => {
    return queries.filter(query => {
      const categoryMatch = query.category === category;
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

  // Select a subcategory
  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubCategory(prev => prev === subcategory ? null : subcategory);
  };

  // Select a query
  const handleQuerySelect = (query: Query) => {
    setSelectedQuery(query);
  };
  
  // Get current queries based on selected filters
  const currentQueries = selectedCategory 
    ? getFilteredQueries(selectedCategory, selectedSubCategory)
    : [];

  return (
    <div className="flex h-full">
      {/* Left panel: Categories and Subcategories */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto h-full">
        <div className="p-2">
          {categories.map((category) => {
            const isExpanded = expandedCategories[category];
            const textColorClass = categoryInfo[category]?.textColor || "text-blue-400";
            const subcategories = getSubcategoriesFromQueries(category);
            
            return (
              <div key={category} className="mb-1">
                <Button
                  className={cn(
                    "w-full p-2 rounded-md flex items-center justify-start",
                    selectedCategory === category ? "bg-gray-800" : "hover:bg-gray-800/50"
                  )}
                  onClick={() => toggleCategory(category)}
                >
                  {isExpanded ? 
                    <ChevronDown className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" /> : 
                    <ChevronRight className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  }
                  <span className={`truncate text-left ${textColorClass}`}>
                    {categoryInfo[category]?.displayName || category}
                  </span>
                </Button>
                
                {isExpanded && subcategories.length > 0 && (
                  <div className="ml-2 pl-2 border-l border-gray-800 mt-1 mb-2">
                    {subcategories.map((subcategory) => (
                      <Button
                        key={subcategory}
                        className={cn(
                          "w-full p-1.5 pl-6 text-sm rounded flex items-center justify-start",
                          selectedSubCategory === subcategory 
                            ? "bg-gray-800 text-[#ff79c6] font-medium" 
                            : "text-[#ff79c6] hover:bg-gray-800/30"
                        )}
                        onClick={() => handleSubcategorySelect(subcategory)}
                      >
                        <span className="truncate text-left">{subcategory}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel: Queries */}
      <div className="w-72 bg-gray-900/90 overflow-y-auto h-full">
        <div className="p-2">
          {selectedCategory ? (
            currentQueries.length > 0 ? (
              <div>
                <div className="p-2 border-b border-gray-800 mb-2">
                  <h3 className="text-sm font-medium text-gray-400">
                    {selectedSubCategory 
                      ? `${selectedCategory} / ${selectedSubCategory}` 
                      : selectedCategory}
                    <span className="ml-1 text-xs">({currentQueries.length})</span>
                  </h3>
                </div>
                {currentQueries.map((query, index) => (
                  <Button
                    key={index}
                    className={cn(
                      "w-full p-2 text-sm rounded flex items-center justify-start my-1",
                      selectedQuery === query 
                        ? "bg-gray-800 text-[#50fa7b]" 
                        : "text-gray-300 hover:bg-gray-800/30"
                    )}
                    onClick={() => handleQuerySelect(query)}
                  >
                    <span className="truncate text-left">{query.title}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 text-gray-500">
                No queries available for this {selectedSubCategory ? "subcategory" : "category"}
              </div>
            )
          ) : (
            <div className="text-center p-6 text-gray-500">
              Select a category to view available queries
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
