import React, { useState } from 'react';
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
  selectedQuery: Query | null;
  setSelectedQuery: (query: Query | null) => void;
}

const SidebarNavigation = ({
  categories,
  categoryInfo,
  queries,
  selectedCategory,
  setSelectedCategory,
  selectedQuery,
  setSelectedQuery
}: SidebarNavigationProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
    
    setSelectedCategory(prev => prev === category ? null : category);
    setSelectedQuery(null);
  };

  // Select a query
  const handleQuerySelect = (query: Query) => {
    setSelectedQuery(query);
  };

  // Filter queries by category
  const getQueriesByCategory = (category: string) => {
    return queries.filter(query => query.category === category);
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto h-full">
      <div className="p-2">
        {categories.map((category) => {
          const categoryQueries = getQueriesByCategory(category);
          const isExpanded = expandedCategories[category];
          const textColorClass = categoryInfo[category]?.textColor || "text-blue-400";
          
          return (
            <div key={category} className="mb-1">
              <Button
                className={cn(
                  "w-full text-left p-2 rounded-md flex items-center justify-between",
                  selectedCategory === category ? "bg-gray-800" : "hover:bg-gray-800/50"
                )}
                onClick={() => toggleCategory(category)}
              >
                <span className={textColorClass}>
                  {categoryInfo[category]?.displayName || category}
                </span>
                {isExpanded ? 
                  <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                }
              </Button>
              
              {isExpanded && categoryQueries.length > 0 && (
                <div className="ml-2 pl-2 border-l border-gray-800 mt-1 mb-2">
                  {categoryQueries.map((query, index) => (
                    <Button
                      key={index}
                      className={cn(
                        "w-full text-left p-1.5 text-sm rounded",
                        selectedQuery === query 
                          ? "bg-gray-800 text-[#50fa7b]" 
                          : "text-gray-300 hover:bg-gray-800/30"
                      )}
                      onClick={() => handleQuerySelect(query)}
                    >
                      {query.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarNavigation;
